import { TestBed } from '@angular/core/testing';
import { createMockImage, getRandomInt, imageFactory, ImageSize, ImagesNames, settingMockImage } from '../mocks/images.mock';
import { Image } from '../models/identification.model';
import { ImageProcessingService } from './image-processing.service';

// tslint:disable: typedef
// tslint:disable: only-arrow-functions

jest.mock('browser-image-compression', () => {
  return function(file: File): Promise<File> {
    const resizedFile = createMockImage(file.name, getRandomInt(1000000, 4000000));
    return Promise.resolve(resizedFile);
  };
});

let jspdfMock;
jest.mock('jspdf', () => {
  return function() {
    const deletePage = jest.fn();
    const addPage = jest.fn();
    const addImage = jest.fn();
    const jspdf = {
      deletePage,
      addPage,
      addImage,
    };
    deletePage.mockImplementation(() => jspdf);
    addPage.mockImplementation(() => jspdf);
    addImage.mockImplementation(() => jspdf);
    jspdfMock = jspdf;
    return jspdf;
  };
});
settingMockImage();

describe('ImageProcessingServiceService', () => {
  let service: ImageProcessingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageProcessingService],
    });

    service = TestBed.inject(ImageProcessingService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('imageProcessing', () => {
    describe('With one image', () => {
      test.each([
        ['small', imageFactory(ImageSize.S)],
        ['medium', imageFactory(ImageSize.M)],
      ])('should return the image %s without resizing', (name: string, img: Image) => {
        const images: Image[] = [img];
        const resizedImages$ = service.imageProcessing(images);

        expect(img.file.size).toBeLessThanOrEqual(service.sizeMax);
        expect(resizedImages$).toBeDefined();

        return resizedImages$.toPromise().then((result) => {
          expect(result).toBeDefined();
          expect(result[0]).toEqual(img);
        });
      });

      test.each([
        ['medium', imageFactory(ImageSize.M)],
        ['large', imageFactory(ImageSize.L)],
        ['xlarge', imageFactory(ImageSize.XL)],
        ['xxlarge', imageFactory(ImageSize.XXL)],
      ])('should return the image %s resized', (name: string, img: Image) => {
        const images: Image[] = [img];
        const resizedImages$ = service.imageProcessing(images);

        expect(img.file.size).toBeGreaterThanOrEqual(service.sizeMax);
        expect(resizedImages$).toBeDefined();

        return resizedImages$.toPromise().then((result) => {
          expect(result).toBeDefined();
          expect(result[0].file).toBeTruthy();
          expect(result[0].file.size).toBeLessThanOrEqual(service.sizeMax);
        });
      });
    });

    describe('with two images', () => {
      test.each([
        ['[xs, xs]', imageFactory(ImageSize.XS), imageFactory(ImageSize.XS)],
        ['[s, s]', imageFactory(ImageSize.S), imageFactory(ImageSize.S)],
      ])('should return the images %s  not resized', (name: string, img1: Image, img2: Image) => {
        const images: Image[] = [img1, img2];
        const expectedSize1 = img1.file.size;
        const expectedSize2 = img2.file.size;

        const resizedImages$ = service.imageProcessing(images);

        expect(resizedImages$).toBeDefined();

        return resizedImages$.toPromise().then((result) => {
          const size1 = result[0].file.size;
          const size2 = result[1].file.size;
          const sum = size1 + size2;
          expect(size1).toEqual(expectedSize1);
          expect(size2).toEqual(expectedSize2);
          expect(sum).toBeLessThanOrEqual(service.sizeMax);
        });
      });

      test.each([
        ['[m, m]', imageFactory(ImageSize.M), imageFactory(ImageSize.M)],
        ['[l, l]', imageFactory(ImageSize.L), imageFactory(ImageSize.L)],
        ['[xl, xl]', imageFactory(ImageSize.XL), imageFactory(ImageSize.XL)],
        ['[xxl, xxl]', imageFactory(ImageSize.XXL), imageFactory(ImageSize.XXL)],
        ['[xxl, s]', imageFactory(ImageSize.XXL), imageFactory(ImageSize.S)],
        ['[xxl, m]', imageFactory(ImageSize.XXL), imageFactory(ImageSize.M)],
        ['[s, xxl]', imageFactory(ImageSize.S), imageFactory(ImageSize.XXL)],
        ['[m, xxl]', imageFactory(ImageSize.M), imageFactory(ImageSize.XXL)],
      ])('should return the images %s resized', (name: string, img1: Image, img2: Image) => {
        const images: Image[] = [img1, img2];

        const resizedImages$ = service.imageProcessing(images);

        expect(resizedImages$).toBeDefined();

        return resizedImages$.toPromise().then((result) => {
          const size1 = result[0].file.size;
          const size2 = result[1].file.size;
          const sum = size1 + size2;
          expect(size1).toBeLessThan(service.sizeMax);
          expect(size2).toBeLessThan(service.sizeMax);
          expect(sum).toBeLessThanOrEqual(service.sizeMax);
        });
      });

      test.each([
        ['[xxl, s]', 0, 1, [imageFactory(ImageSize.XXL), imageFactory(ImageSize.S)]],
        ['[s, xxl]', 1, 0, [imageFactory(ImageSize.S), imageFactory(ImageSize.XXL)]],
      ])(
        'should return the images %s with the image at position %s resized',
        (name: string, bigIndex: number, smallIndex: number, images: Image[]) => {
          const resizedImages$ = service.imageProcessing(images);
          const expectedSmallName = images[smallIndex].file.name;
          const expectedSmallSize = images[smallIndex].file.size;

          expect(images[bigIndex].file.size).toEqual(ImageSize.XXL);
          expect(images[bigIndex].file.name).toEqual(ImagesNames.get(ImageSize.XXL));
          expect(images[smallIndex].file.name).not.toEqual(ImagesNames.get(ImageSize.XXL));
          expect(resizedImages$).toBeDefined();

          return resizedImages$.toPromise().then((result) => {
            expect(result).toBeDefined();
            expect(result[bigIndex].file.name).toBe(ImagesNames.get(ImageSize.XXL));
            expect(result[bigIndex].file.size).toBeLessThanOrEqual(service.sizeMax);
            expect(result[smallIndex].file.name).toBe(expectedSmallName);
            expect(result[smallIndex].file.size).toEqual(expectedSmallSize);
          });
        },
      );
    });

    describe('With force option', () => {
      let images;
      let resizingSpy;

      beforeEach(() => {
        const smallImage = imageFactory(ImageSize.S);
        images = [smallImage];
        // tslint:disable-next-line: no-any
        resizingSpy = jest.spyOn<ImageProcessingService, any>(service, 'imagesResizing').mockName('imagesResizing');
      });

      test('should resize a small image with force option equal true', () => {
        const resizedImages$ = service.imageProcessing(images, true);

        return resizedImages$.toPromise().then((result) => {
          expect(resizingSpy).toBeCalledTimes(1);
        });
      });

      test('should not resize a small image with force option equal false', () => {
        const resizedImages$ = service.imageProcessing(images, false);

        return resizedImages$.toPromise().then((result) => {
          expect(resizingSpy).not.toHaveBeenCalled();
        });
      });
    });

    describe('check base64', () => {
      test.each([
        ['recalculate', true, ImageSize.L],
        ['not recalculate', false, ImageSize.M],
      ])('should %s the base64', (action: string, recalculate: boolean, size: ImageSize) => {
        const image: Image = imageFactory(size);
        const prevBase64 = image.base64;
        const fileToImageSpy = jest.spyOn(service, 'fileToImage');

        const resizedImages$ = service.imageProcessing([image]);

        return resizedImages$.toPromise().then((result) => {
          expect(result).toBeDefined();
          if (recalculate) {
            expect(fileToImageSpy).toHaveBeenCalledTimes(1);
            expect(result[0].base64).not.toEqual(prevBase64);
          } else {
            expect(fileToImageSpy).not.toHaveBeenCalled();
            expect(result[0].base64).toEqual(prevBase64);
          }
        });
      });
    });
  });

  describe('fileToImage', () => {
    test('should return the image with right base64 property', () => {
      const fileToEncode: File = new File(['ezfzef'], 'fileName');
      const expectedBase64 = 'data:application/octet-stream;base64,ZXpmemVm';

      return service
        .fileToImage(fileToEncode)
        .toPromise()
        .then((result) => {
          expect(result.base64).toEqual(expectedBase64);
        });
    });
  });

  describe('fileToHashCode', () => {
    test('should return the right ash', () => {
      const file: File = imageFactory(ImageSize.M).file;
      const expectedHash = '4ea5c508a6566e76240543f8feb06fd457777be39549c4016436afda65d2330e';

      const hashCode$ = service.fileToHashCode(file);

      return hashCode$.toPromise().then((result) => {
        expect(result).toBe(expectedHash);
      });
    });
  });

  describe('imagesToPdf', () => {
    test.each([
      [1, [imageFactory(ImageSize.M)]],
      [2, [imageFactory(ImageSize.M), imageFactory(ImageSize.M)]],
    ])('should call the pdf creation methodes %s time(s)', (count: number, images: Image[]) => {
      const pdf$ = service.imagesToPdf(images);

      return pdf$.toPromise().then((result) => {
        expect(result).toBeTruthy();
        expect(jspdfMock.deletePage).toHaveBeenCalledTimes(1);
        expect(jspdfMock.addPage).toHaveBeenCalledTimes(count);
        expect(jspdfMock.addImage).toHaveBeenCalledTimes(count);
      });
    });
  });
});
