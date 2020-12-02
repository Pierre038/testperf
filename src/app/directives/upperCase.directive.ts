import { AfterContentInit, Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[libToUpperCase]',
})
export class ToUpperCaseDirective implements AfterContentInit {
  private inputElement: HTMLInputElement;
  private readonly lettersToUppercase = /(?<= )[a-z]|(?<=')[a-z]|(?<=-)[a-z]|^[a-z]/gm;

  constructor(private readonly element: ElementRef) {}

  public ngAfterContentInit(): void {
    this.getInputElement();
  }

  @HostListener('input') public onInput(): void {
    this.inputElement.value = this.toDisplayableName(this.inputElement.value);
  }

  private toDisplayableName(ugglyString: string): string {
    const displayableString = ugglyString.replace(this.lettersToUppercase, this.setUpperCase);
    return displayableString;
  }

  private getInputElement(): void {
    if (!this.inputElement) {
      if (this.element.nativeElement.tagName === 'INPUT') {
        this.inputElement = this.element.nativeElement;
      } else {
        this.inputElement = this.element.nativeElement.getElementsByTagName('INPUT')[0];
      }
    }
  }

  private setUpperCase(correspondance: string): string {
    return correspondance.toLocaleUpperCase();
  }
}
