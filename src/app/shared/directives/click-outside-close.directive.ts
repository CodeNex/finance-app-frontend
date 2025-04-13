import {
  Directive,
  ElementRef,
  Output,
  EventEmitter,
  Renderer2,
  OnDestroy,
  AfterViewInit,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appClickOutsideClose]',
})
export class ClickOutsideCloseDirective implements AfterViewInit, OnDestroy {

  @Output() clickOutside = new EventEmitter<boolean>();

  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);
  private unsubscribeClickOutside: () => void = () => null;

  ngAfterViewInit(): void {
    this.unsubscribeClickOutside = this.renderer.listen('document', 'click', (event) => {
      const clickedInside = this.elementRef.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.clickOutside.emit(true);
      }
    })
  }

  ngOnDestroy(): void {
    this.unsubscribeClickOutside?.();
  }
}
