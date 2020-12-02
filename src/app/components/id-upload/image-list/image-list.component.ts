import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { errorMessages, ImageControl } from '../images-control';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageListComponent {
  @Input() public imageControls: ImageControl[];
  @Output() public adjustedImageList: EventEmitter<ImageControl[]> = new EventEmitter<ImageControl[]>();

  public readonly acceptedTypeMessage: string = errorMessages.acceptedTypeMessage;

  constructor() {}

  public deleteImage(name: string): void {
    const index = this.imageControls.findIndex((imageControl) => imageControl.value.file.name === name);
    if (index > -1) {
      this.imageControls.splice(index, 1);
    }
    this.adjustedImageList.emit(this.imageControls);
  }
}
