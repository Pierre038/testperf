import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Action, Selector, State, StateContext } from 'ngxs';
import { Observable } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { EdeContext } from '../../models/ede-eer.model';
import {
  IdentificationContext,
  Image,
} from '../../models/identification.model';
import { IdentificationService } from '../../services/identification.service';
import { ImageProcessingService } from '../../services/image-processing.service';
import * as IdentificationActions from './identification.actions';

export interface IdentificationStateModel {
  identificationContext: IdentificationContext | null;
  isLoading: boolean;
  error: Error | null;
  time: number | null;
}

export const initialState: IdentificationStateModel = {
  identificationContext: {
    images: [],
    type: null,
  },
  isLoading: false,
  error: null,
  time: null,
};

@State<IdentificationStateModel>({
  name: 'identification',
  defaults: initialState,
})
@Injectable()
export class IdentificationState {
  private time: number;
  constructor(
    private readonly imageService: ImageProcessingService,
    private readonly idService: IdentificationService
  ) {}

  @Selector()
  public static getIdentificationContext(
    state: IdentificationStateModel
  ): IdentificationContext {
    return state.identificationContext;
  }

  @Selector()
  public static getEdeContext(
    state: IdentificationStateModel
  ): EdeContext | null {
    return state.identificationContext.ede;
  }

  @Selector()
  public static getIsLoading(state: IdentificationStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  public static getTime(state: IdentificationStateModel): number {
    return state.time;
  }

  @Selector()
  public static getError(state: IdentificationStateModel): Error | null {
    return state.error;
  }

  @Action(IdentificationActions.EditType)
  public EditType(
    { patchState, getState }: StateContext<IdentificationStateModel>,
    { identificationType }: IdentificationActions.EditType
  ): void {
    const currentContext = getState().identificationContext;
    const identificationContext: Partial<IdentificationContext> = {
      type: identificationType,
    };
    patchState({
      identificationContext: { ...currentContext, ...identificationContext },
    });
  }

  @Action(IdentificationActions.EditImages)
  public EditImages(
    { patchState, getState }: StateContext<IdentificationStateModel>,
    { images }: IdentificationActions.EditImages
  ): void {
    const currentContext = getState().identificationContext;
    const identificationContext: Partial<IdentificationContext> = { images };
    patchState({
      identificationContext: { ...currentContext, ...identificationContext },
    });
  }

  @Action(IdentificationActions.AddImage)
  public AddImage(
    { dispatch, patchState }: StateContext<IdentificationStateModel>,
    { file }: IdentificationActions.AddImage
  ): Observable<void> {
    patchState({ isLoading: true });
    return this.imageService.fileToImage(file).pipe(
      mergeMap((image: Image) => {
        return dispatch(new IdentificationActions.AddImageSuccess(image));
      }),
      catchError((error: Error) => {
        return dispatch(new IdentificationActions.AddImageFailed(error));
      }),
      tap(() => patchState({ isLoading: false }))
    );
  }

  @Action(IdentificationActions.AddImageSuccess)
  public AddImageSuccess(
    { patchState, getState }: StateContext<IdentificationStateModel>,
    { image }: IdentificationActions.AddImageSuccess
  ): void {
    const currentContext = getState().identificationContext;
    patchState({
      identificationContext: {
        ...currentContext,
        images: [...currentContext.images, image],
      },
    });
  }

  @Action(IdentificationActions.AddImageFailed)
  public AddImageFailed(
    { patchState }: StateContext<IdentificationStateModel>,
    { error }: IdentificationActions.AddImageFailed
  ): void {
    patchState({ error });
  }

  @Action(IdentificationActions.ImageProcessing)
  public ImageProcessing(
    { patchState, dispatch }: StateContext<IdentificationStateModel>,
    { images, force }: IdentificationActions.ImageProcessing
  ): Observable<void> {
    patchState({ isLoading: true });
    console.log('start:',performance.now());
    this.time = - performance.now();
    return this.imageService.imageProcessing(images, force).pipe(
      mergeMap((resizedImages: Image[]) => {
        return dispatch(
          new IdentificationActions.ImageProcessingSuccess(resizedImages)
        );
      }),
      catchError((error: Error) => {
        return dispatch(new IdentificationActions.ImageProcessingFailed(error));
      }),
      tap(() => {
        patchState({ isLoading: false });
      })
    );
  }

  @Action(IdentificationActions.ImageProcessingSuccess)
  public ImageProcessingSuccess(
    { patchState, getState, dispatch }: StateContext<IdentificationStateModel>,
    { images }: IdentificationActions.ImageProcessingSuccess
  ): Observable<void> {
    // TODO : check si l'image existe toujours,
    // dans le cas ou il y a eu suppresion au cours de l'image processing
    const currentContext = getState().identificationContext;
    patchState({
      identificationContext: {
        ...currentContext,
        images,
      },
    });
    return dispatch(new IdentificationActions.SetPdf(images));
  }

  @Action(IdentificationActions.ImageProcessingFailed)
  public ImageProcessingFailed(
    { patchState }: StateContext<IdentificationStateModel>,
    { error }: IdentificationActions.ImageProcessingFailed
  ): void {
    patchState({ error });
  }

  @Action(IdentificationActions.SetPdf)
  public setPdf(
    { patchState, dispatch }: StateContext<IdentificationStateModel>,
    { images }: IdentificationActions.SetPdf
  ): Observable<void> {
    patchState({ isLoading: true });
    return this.imageService.imagesToPdf(images).pipe(
      mergeMap((pdf: jsPDF) => {
        const file = pdf.output('blob');
        const action =
          file.size > this.imageService.sizeMax
            ? new IdentificationActions.ImageProcessing(images, true)
            : new IdentificationActions.SetPdfSuccess(pdf);
        return dispatch(action);
      }),
      catchError((error: Error) => {
        return dispatch(new IdentificationActions.SetPdfFailed(error));
      }),
      tap(() => patchState({ isLoading: false }))
    );
  }

  @Action(IdentificationActions.SetPdfSuccess)
  public SetPdfSuccess(
    { patchState, getState, dispatch }: StateContext<IdentificationStateModel>,
    { pdf }: IdentificationActions.SetPdfSuccess
  ): Observable<void> {
    patchState({ isLoading: true });
    const currentContext = getState().identificationContext;
    const file = pdf.output('blob');
    console.log('fin', performance.now());
    this.time = (this.time + performance.now()) / 1000;
    console.log('temps total:', this.time)
    patchState({ time: this.time });
    pdf.save('result.pdf'); // TODO: à supprimer
    return this.imageService.fileToHashCode(file).pipe(
      mergeMap((fileHashCode) => {
        const edeContext: EdeContext = {
          ...currentContext.ede,
          file,
          fileHashCode,
        };
        patchState({
          identificationContext: {
            ...currentContext,
            ede: edeContext,
          },
        });
        return dispatch(new IdentificationActions.GetToken(edeContext));
      }),
      tap(() => patchState({ isLoading: false }))
    );
  }

  @Action(IdentificationActions.SetPdfFailed)
  public SetPdfFailed(
    { patchState }: StateContext<IdentificationStateModel>,
    { error }: IdentificationActions.SetPdfFailed
  ): void {
    patchState({ error });
  }

  @Action(IdentificationActions.GetToken)
  public GetToken(
    { patchState, dispatch }: StateContext<IdentificationStateModel>,
    { context }: IdentificationActions.GetToken
  ): Observable<void> {
    patchState({ isLoading: true });
    return this.idService.initUploadId(context).pipe(
      mergeMap((result: EdeContext) => {
        return dispatch(new IdentificationActions.GetTokenSuccess(result));
      }),
      catchError((error: Error) => {
        return dispatch(new IdentificationActions.GetTokenFailed(error));
      }),
      tap(() => patchState({ isLoading: false }))
    );
  }

  @Action(IdentificationActions.GetTokenSuccess)
  public GetTokenSuccess(
    { patchState, getState, dispatch }: StateContext<IdentificationStateModel>,
    { context }: IdentificationActions.GetTokenSuccess
  ): Observable<void> {
    const currentContext = getState().identificationContext;
    patchState({
      identificationContext: {
        ...currentContext,
        ede: context,
      },
    });
    return dispatch(new IdentificationActions.Upload(context));
  }

  @Action(IdentificationActions.GetTokenFailed)
  public GetTokenFailed(
    { patchState }: StateContext<IdentificationStateModel>,
    { error }: IdentificationActions.GetTokenFailed
  ): void {
    patchState({ error });
  }

  @Action(IdentificationActions.Upload)
  public Upload(
    { patchState, dispatch }: StateContext<IdentificationStateModel>,
    { context }: IdentificationActions.Upload
  ): Observable<void> {
    patchState({ isLoading: true });
    return this.idService.uploadId(context).pipe(
      mergeMap((result: EdeContext) => {
        return dispatch(new IdentificationActions.UploadSuccess(result));
      }),
      catchError((error: Error) => {
        return dispatch(new IdentificationActions.UploadFailed(error));
      }),
      tap(() => patchState({ isLoading: false }))
    );
  }

  @Action(IdentificationActions.UploadSuccess)
  public UploadSuccess(
    { patchState, getState }: StateContext<IdentificationStateModel>,
    { context }: IdentificationActions.UploadSuccess
  ): void {
    const currentContext = getState().identificationContext;
    patchState({
      identificationContext: {
        ...currentContext,
        ede: context,
      },
    });
  }

  @Action(IdentificationActions.UploadFailed)
  public UploadFailed(
    { patchState }: StateContext<IdentificationStateModel>,
    { error }: IdentificationActions.UploadFailed
  ): void {
    patchState({ error });
  }
}
