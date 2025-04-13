import { Directive, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appClickOutsideClose]'
})
export class ClickOutsideCloseDirective {

  constructor() {
    renderer = new Renderer2();
   }

}
