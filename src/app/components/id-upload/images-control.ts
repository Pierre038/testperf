import { Image } from '../../models/identification.model';

// taille min d'une image
export const minImageSize = 200;
// taille max d'un pdf'
export const maxPdfSize = 4000000;
export const maxPdfSizeDisplay = '4';
// max de la somme des tailles des images
export const maxTotalImagesSize = 20000000;
export const maxTotalImageSizeDisplay = '20';
// types d'image acceptés
export const acceptedTypeImage: string[] = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];
export const inputAcceptedTypeImage = 'image/png, image/jpg, image/jpeg, application/pdf';

export enum errorMessages {
  minSizeMessage = `L'image est trop petite.`,
  maxSizeMessage = `L'image est trop grande`,
  acceptedTypeMessage = `Ce type de fichier n'est pas pris en compte`,
  duplicateImage = 'Cette image est uploadée en double',
  pdfOnlyOneFile = `Si vous importez un pdf, vous ne devez inclure qu'un seul fichier`,
  pdfMaxSize = `La taille d'un fichier pdf ne doit pas excéder $1mo`,
  multipleMaxNumber = `Vous ne pouvez pas ajouter autant d'images`,
  excedeedTotalMaxSize = 'Le total de vos images dépasse $1mo',
}

// pour chaque type de pièce, précise le nombre min et max d'image requis
export const requiredImageNumber = {
  CNI: { min: 1, max: 2 },
  PPT: { min: 1, max: 3 },
};

export interface ImageControl {
  value: Image;
  validity?: boolean;
  messageError?: string;
}
