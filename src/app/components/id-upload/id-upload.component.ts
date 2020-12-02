import { ImageProcessingService } from './../../services/image-processing.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from 'ngxs';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IdentificationContext, IdentificationType, Image } from '../../models/identification.model';
import * as IdentificationActions from '../../states/identification/identification.actions';
import { IdentificationState } from '../../states/identification/identification.state';
import {
  acceptedTypeImage,
  errorMessages,
  ImageControl,
  maxPdfSize,
  maxPdfSizeDisplay,
  maxTotalImageSizeDisplay,
  maxTotalImagesSize,
  minImageSize,
  requiredImageNumber,
} from './images-control';

@Component({
  selector: 'app-id-upload',
  templateUrl: './id-upload.component.html',
  styleUrls: ['./id-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdUploadComponent implements OnInit, OnDestroy {
  private idType: IdentificationType;
  public title: string;
  public idGuidePhrase: string;
  public isMobile$: Observable<boolean>;
  public imageControls: ImageControl[] = [];
  public impossibleAction = false;
  public impossibleActionMessage = '';
  public maxTotalDocumentSize = 20;
  public disableAddImage = false;
  private minRequiredImageNumber: number;
  private readonly unsubscribe$ = new Subject<void>();

  @Select(IdentificationState.getIdentificationContext)
  private idContext$: Observable<IdentificationContext>;

  /**
   * vérifie si les images chargées dans le composants sont valides ou non:
   *  - controle niveau collection:
   *    - doit contenir au moins une image
   *  - contrôle image unitairement:
   *    - type MIME
   *    - taille min et max
   *    - cette image n'est pas en double dans la collection
   *    - la somme des tailles des images doit être inférieure à un max
   * cette méthode permet de libérer ou non le CTA
   */
  public get imagesValidity(): boolean {
    const totalSize = this.imageControls.reduce((accumulator, currentValue) => accumulator + currentValue.value.file.size, 0);
    const imageNumberValidity = this.imageControls.length >= this.minRequiredImageNumber;
    this.imageControls = this.imageControls.map((imageControl) => this.checkImage(imageControl, totalSize));
    const imagesValidity = this.imageControls.every((imgCtrl) => imgCtrl.validity);
    return imageNumberValidity && imagesValidity;
  }

  @Select(IdentificationState.getTime)
  public time$: Observable<number>;

  public maxPdfSizeInput: number;

  constructor(
    private readonly store: Store,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private imageService: ImageProcessingService
  ) {}

  public ngOnInit(): void {
    this.getContext();
  }

  public keyEvent(event): void {
    console.log('taille', event.target.value);
    this.maxPdfSizeInput = event.target.value;
    this.imageService.sizeMax = 1000000 * this.maxPdfSizeInput;
  }

  public onSubmit(): void {
    const imageprocessingAction = new IdentificationActions.ImageProcessing(
      this.imageControls.map((imageControl) => imageControl.value),
      false,
    );
    this.store.dispatch([imageprocessingAction]).subscribe();
  }

  public onfileSelected(files: File[]): void {
    files.forEach((file) => {
      const addImageAction = new IdentificationActions.AddImage(file);
      this.store
        .dispatch(addImageAction)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => this.changeDetectorRef.detectChanges());
    });
  }

  public onImageDeleted(imageControls: ImageControl[]): void {
    this.imageControls = imageControls;
    const editImagesActions = new IdentificationActions.EditImages(imageControls.map((imageControl) => imageControl.value));
    this.store.dispatch(editImagesActions);
  }

  /**
   * vérifie la validité d'une image ou un fichier, l'ordre des contrôles a une importance:
   *  - le type de l'image doit être pris en compte
   *  - taille de l'image doit être supérieure à un min
   *  - si PDF, un seul fichier et taille max de 4mo
   * @param imageControl image à controler
   */
  private checkImage(imageControl: ImageControl, totalSize: number): ImageControl {
    const file: File = imageControl.value.file;
    return acceptedTypeImage.indexOf(file.type.toLowerCase()) === -1
      ? { ...imageControl, validity: false, messageError: errorMessages.acceptedTypeMessage }
      : this.checkDuplicate(imageControl.value)
      ? { ...imageControl, validity: false, messageError: errorMessages.duplicateImage }
      : file.size < minImageSize
      ? { ...imageControl, validity: false, messageError: errorMessages.minSizeMessage }
      : file.type === 'application/pdf' && this.imageControls.length > 1
      ? { ...imageControl, validity: false, messageError: errorMessages.pdfOnlyOneFile }
      : file.type === 'application/pdf' && file.size > maxPdfSize
      ? { ...imageControl, validity: false, messageError: errorMessages.pdfMaxSize.replace('$1', maxPdfSizeDisplay) }
      : totalSize > maxTotalImagesSize
      ? { ...imageControl, validity: false, messageError: errorMessages.excedeedTotalMaxSize.replace('$1', maxTotalImageSizeDisplay) }
      : { ...imageControl, validity: true };
  }

  /**
   * retourne vrai si l'image figure en double parmi les images sélectionnées
   * @param image : image à contrôler
   */
  private checkDuplicate(image: Image): boolean {
    let imgs = this.imageControls.map((img) => img.value.file.name);
    const index = imgs.findIndex((img) => img === image.file.name);
    imgs = imgs.slice(index + 1);
    return imgs.findIndex((img) => img === image.file.name) > -1;
  }

  private getContext(): void {
    this.isMobile$ = of(true);
    this.idContext$.pipe(takeUntil(this.unsubscribe$)).subscribe((idContext) => {
      this.idType = idContext.type;
      this.imageControls = idContext.images.map((image) => ({ value: image }));
      this.minRequiredImageNumber = this.idType === IdentificationType.CNI ? requiredImageNumber.CNI.min : requiredImageNumber.PPT.min;
      this.setWording();
    });
  }

  private setWording(): void {
    if (this.idType === IdentificationType.CNI) {
      this.title = `Carte nationale d'identité française`;
      this.idGuidePhrase = `Transmettez le recto et le verso de votre carte d'identité.`;
    } else {
      // wording passeport inconnu
      this.title = `Passeport français`;
      this.idGuidePhrase = `Transmettez les pages intérieures de votre passeport.`;
    }
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
