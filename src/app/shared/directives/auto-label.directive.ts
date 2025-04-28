import { Directive, HostListener, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appAutoLabel]'
})
export class AutoLabelDirective {

  private elementRef = inject(ElementRef<HTMLInputElement>);

}
