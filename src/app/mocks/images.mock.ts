import { Image } from '../models/identification.model';

export const image1B64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==';

export const wrongImageB64 =
  'unsafe:data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlLXdpZHRoPSIxLjYiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48cGF0aCBkPSJNNTkuOTA4IDQ5LjYwNWw3LjcxLTcuNzFhMS43OTYgMS43OTYgMCAwMDAtMi41NGwtNy43MS03LjcxbS0yMi4xOTYgOC45OGgzMC4wMDUiIHN0cm9rZT0iI0IxMDA2RSIvPjxwYXRoIGQ9Ik01NS40NDcgNTEuODI2djkuNzkxYS43OTYuNzk2IDAgMDEtLjgxMy44MTdIMjIuMDhhLjc5Ni43OTYgMCAwMS0uODEzLS44MTdWMTcuNTU4YzAtLjQ2Ny4zNDgtLjgxNy44MTMtLjgxN2gzMi41NTRjLjQ2NSAwIC44MTMuMzUuODEzLjgxN3YxMS40MjMiIHN0cm9rZT0iIzUxMjQ3MiIvPjwvZz48L3N2Zz4=';

export const createMockImage = (name = 'image_test.jpeg', size = 1000000, type = 'image/jpeg'): File => {
  return new File([new ArrayBuffer(size)], name, { type });
};

export const image: Image = { base64: image1B64, file: createMockImage() };
export const wrongTypeImage: Image = { base64: wrongImageB64, file: createMockImage('wrongTypeImage.svg', 20000, 'image/svg') };

export enum ImageSize {
  XXL = 20000000,
  XL = 8000000,
  L = 6000000,
  M = 4000000,
  S = 2000000,
  XS = 1000000,
  XXS = 2,
}

export const ImagesNames = new Map<ImageSize, string>([
  [ImageSize.XXL, 'xxl.jpg'],
  [ImageSize.XL, 'xl.jpg'],
  [ImageSize.L, 'l.jpg'],
  [ImageSize.M, 'm.jpg'],
  [ImageSize.S, 's.jpg'],
  [ImageSize.XS, 'xs.jpg'],
  [ImageSize.XXS, 'xxs.jpg'],
]);

export const imageFactory = (size: ImageSize): Image => {
  return { base64: image1B64, file: createMockImage(ImagesNames.get(size), size) };
};

export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

export const settingMockImage = () => {
  Object.defineProperty(HTMLImageElement.prototype, 'naturalHeight', { get: () => 1024 });
  Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', { get: () => 1024 });
  Object.defineProperty(global.Image.prototype, 'src', {
    // tslint:disable-next-line: typedef
    set(src) {
      setTimeout(() => this.onload());
    },
  });
};
