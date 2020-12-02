import { NgModule } from '@angular/core';
import { DragAndDropDirective } from './drag-and-drop.directive';
import { ToUpperCaseDirective } from './upperCase.directive';

@NgModule({
  declarations: [ ToUpperCaseDirective, DragAndDropDirective],
  providers: [ ToUpperCaseDirective, DragAndDropDirective],
  exports: [ ToUpperCaseDirective, DragAndDropDirective],
})
export class CommonDirectivesModule {}
