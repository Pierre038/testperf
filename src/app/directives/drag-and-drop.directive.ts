import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[libDragAndDrop]',
})
export class DragAndDropDirective {
  @Input() public disabled = false;
  @Output() public fileDropped = new EventEmitter<File[]>();

  @HostBinding('style.background-color') private background = '#f9f9fb';

  constructor() {}

  @HostListener('dragover', ['$event']) public onDragOver(evt): void {
    evt.preventDefault();
    evt.stopPropagation();

    if (!this.disabled) {
      this.background = '#9ecbec';
    }
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f9f9fb';
  }

  @HostListener('drop', ['$event']) public ondrop(evt): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f9f9fb';
    const files: FileList = evt.dataTransfer.files;
    if (files.length > 0 && !this.disabled) {
      this.fileDropped.emit(Array.from(files));
    }
  }
}
