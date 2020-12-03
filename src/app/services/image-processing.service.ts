import { Injectable } from '@angular/core';
import imageCompression from 'browser-image-compression';
import * as CryptoJS from 'crypto-js';
import jsPDF from 'jspdf';
import { EMPTY, forkJoin, from, Observable, Observer, of } from 'rxjs';
import { combineAll, expand, last, map, mergeMap } from 'rxjs/operators';
import { Image } from '../models/identification.model';

@Injectable()
export class ImageProcessingService {
  public  sizeMax = 4000000;
  private readonly defaultWidth = 200;
  public maxIteration = 10;
  public initialQuality = 1;

  constructor() {}

  /**
   * Réduit la taille des images tant que la somme de celles-ci n'est pas inférieur
   * à la taille limite autorisée sizeMax. Puis génére une nouvelle liste d'image.
   * @param images liste des images à réduire
   * @param force force la réduction d'image
   */
  public imageProcessing(images: Image[], force = false): Observable<Image[]> {
    const size = images.reduce(
      (accumulator, currentValue) => accumulator + currentValue.file.size,
      0
    );
    if (size > this.sizeMax || force) {
      return this.imagesResizing(images).pipe(
        expand((results) => {
          const sum = results.reduce(
            (accumulator, currentValue) => accumulator + currentValue.file.size,
            0
          );
          return sum > this.sizeMax ? this.imagesResizing(results) : EMPTY;
        }),
        last(),
        mergeMap((resizedImages) =>
          resizedImages.map((img) => {
            return this.fileToImage(img.file);
          })
        ),
        combineAll()
      );
    }

    return of(images);
  }

  /**
   * [asynchrone] retourne une url base 64 représentant l'image passée en paramètre
   * @param file: input File de l'image
   */
  public fileToImage(file: File): Observable<Image> {
    const imageError =
      'Erreur dans la conversion en base 64 lors de la lecture de l image';

    return new Observable((observer: Observer<Image>) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // avec la méthode utilisée readAsDataURL, reader.result retourne les données du fichier sous forme d'url
        // avec les données du fichier en base64
        const base64 = reader.result as string;
        const image: Image = { base64, file };
        observer.next(image);
        observer.complete();
      };
      reader.onerror = () => {
        observer.error(imageError);
        observer.complete();
      };
      // triggers one of the two event handler onerror or onload:
      reader.readAsDataURL(file);
    });
  }

  /**
   * Hashage d'un fichier en sha256
   * @param file le fichier à hasher
   */
  public fileToHashCode(file: Blob | File): Observable<string> {
    const imageError = "Erreur dans lors du hashage du de l'image";

    return new Observable((observer: Observer<string>) => {
      const reader = new FileReader();
      reader.onload = () => {
        const hash = CryptoJS.SHA256(reader.result as string);

        observer.next(hash.toString());
        observer.complete();
      };
      reader.onerror = () => {
        observer.error(imageError);
        observer.complete();
      };
      // triggers one of the two event handler onerror or onload:
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * [asynchrone] construit un document PDF avec la collection d'images reçue en paramètre
   * @param imageURLBase64Collection : collection d'images sous forme dURL en base64
   */
  public imagesToPdf(images: Image[]): Observable<jsPDF> {
    const docPDF = new jsPDF({ compress: true });
    docPDF.deletePage(1);

    const PdfCollection$ = images.map((image) =>
      this.imageToPdf(docPDF, image)
    );
    return forkJoin(PdfCollection$).pipe(
      mergeMap((docPdfs) => docPdfs),
      last()
    );
  }

  /**
   * [asynchrone] ajoute une page avec une image dans un document pdf passé en paramètre
   * @param docPDF : objet PDF dans lequel l'image va être ajouté
   * @param image : image à ajouter dans le PDF
   * @param width : (optionnel) définit la largeur de l'image dans la page (l'unité est celle de l'objet pdf )
   */
  private imageToPdf(
    docPDF: jsPDF,
    image: Image,
    width?: number
  ): Observable<jsPDF> {
    const widthInPdf = width ? width : this.defaultWidth;
    const imageURLBase64 = image.base64;
    const imageType = image.file.type;

    return this.imageRatio(imageURLBase64).pipe(
      map((ratio) =>
        docPDF
          .addPage()
          .addImage(
            imageURLBase64,
            'JPG',
            5,
            10,
            widthInPdf,
            ratio * widthInPdf
          )
      )
    );
  }

  /**
   * [asynchrone] retourne le ratio hauteur/largeur de l'image passée en paramètre
   * @param imageURLBase64: sous forme dURL en base64
   */
  private imageRatio(imageURLBase64: string): Observable<number> {
    return new Observable((observer: Observer<number>) => {
      const img = new Image();
      img.onload = () => {
        if (img.naturalHeight === 0 || img.naturalWidth === 0) {
          observer.error(
            "Erreur, impossible de calculer le ratio hauteur/largeur de l'image"
          );
        } else {
          observer.next(
            Math.round((img.naturalHeight / img.naturalWidth) * 1000) / 1000
          );
        }
        observer.complete();
      };
      img.onerror = () => {
        observer.error(
          "Erreur dans le calcul du ratio lors du chargement de l'image"
        );
        observer.complete();
      };
      img.src = imageURLBase64;
    });
  }

  /**
   * Réduit la taille de l'image la plus grande parmi la liste.
   * @param images liste d'images à réduire
   */
  private imagesResizing(images: Image[]): Observable<Image[]> {
    const biggestImage = images.reduce((prev, current) => {
      return prev.file.size > current.file.size ? prev : current;
    });
    const sizeLimit = this.sizeMax / 1000000 / images.length;
    const bigImageSize = biggestImage.file.size;
    const maxSizeMb = bigImageSize > sizeLimit ? sizeLimit : bigImageSize / 2;

    return this.compress(biggestImage, maxSizeMb, this.maxIteration, this.initialQuality).pipe(
      map((compressedImage: Image) =>
        images.map((img) =>
          img.file.name === biggestImage.file.name ? compressedImage : img
        )
      )
    );
  }

  /**
   * Réduction d'image à l'aide de la lib browser-image-compression.
   * @param image l'image à compresser
   */
  private compress(image: Image, maxSizeMB: number, maxIteration: number, initialQuality): Observable<Image> {
    return from(
      imageCompression(image.file, { maxSizeMB, useWebWorker: true, maxIteration, initialQuality })
    ).pipe(
      map((result: Blob) => {
        image.file = result as File;
        return image;
      })
    );
  }
}
