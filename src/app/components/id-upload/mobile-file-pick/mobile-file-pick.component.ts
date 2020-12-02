import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { inputAcceptedTypeImage } from '../images-control';

@Component({
  selector: 'app-mobile-file-pick',
  templateUrl: './mobile-file-pick.component.html',
  styleUrls: ['./mobile-file-pick.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileFilePickComponent implements OnInit {
  @Output() public choosenFilesDrop: EventEmitter<File[]> = new EventEmitter<File[]>();

  @ViewChild('selectedFile') public selectedFile: ElementRef;
  @ViewChild('takePicture') public takePicture: ElementRef;

  public acceptedType = inputAcceptedTypeImage;
  public showPlusIcon = true;


  constructor(@Inject(DOCUMENT) private document: Document) {}

  public ngOnInit(): void {
  }



  public handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.choosenFilesDrop.emit(Array.from(input.files));
    // indispensable sinon l'utilisateur ne peut pas recharger une image qu'il vient de supprimer:
    this.selectedFile.nativeElement.value = '';
  }

}
