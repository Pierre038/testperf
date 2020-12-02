import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { inputAcceptedTypeImage } from '../images-control';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragAndDropComponent {
  @Input() public disabled = false;
  @Output() public choosenFilesDrop: EventEmitter<File[]> = new EventEmitter<File[]>();

  @ViewChild('selectedFile') public inputFileElement: ElementRef;

  public acceptedType = inputAcceptedTypeImage;

  constructor() {}

  public handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.choosenFilesDrop.emit(Array.from(input.files));
    // indispensable sinon l'utilisateur ne peut pas recharger une image qu'il vient de supprimer:
    this.inputFileElement.nativeElement.value = '';
  }
}
