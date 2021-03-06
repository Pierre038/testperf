import { CaptureComponent } from './../capture/capture.component';
import { CaptureModule } from './../capture/capture.module';
import { ImageProcessingService } from './../../services/image-processing.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EdeMapper } from '../../mappers/ede.mapper';
import { IdentificationService } from '../../services/identification.service';
import { CommonDirectivesModule } from './../../directives/common-directives.module';
import { DragAndDropComponent } from './drag-and-drop/drag-and-drop.component';
import { IdUploadComponent } from './id-upload.component';
import { ImageListComponent } from './image-list/image-list.component';
import { MobileFilePickComponent } from './mobile-file-pick/mobile-file-pick.component';

@NgModule({
  declarations: [IdUploadComponent, ImageListComponent, MobileFilePickComponent, DragAndDropComponent],
  exports: [IdUploadComponent],
  providers: [IdentificationService, EdeMapper, ImageProcessingService],
  imports: [
    CaptureModule,
    CommonModule,
    ReactiveFormsModule,
    CommonDirectivesModule,
  ],
})
export class IdUploadModule {}
