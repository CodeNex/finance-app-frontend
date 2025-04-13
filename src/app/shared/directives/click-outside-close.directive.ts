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

/**
 * ClickOutsideCloseDirective
 * This directive is responsible for closing the dropdown menu when clicking outside of it.
 * It listens for click events on the document and emits an event when a click occurs outside of the element it is applied to.
 */
@Directive({
  selector: '[appClickOutsideClose]',
})
export class ClickOutsideCloseDirective implements AfterViewInit, OnDestroy {

  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  @Output() clickOutside = new EventEmitter<boolean>();

  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);

  private unsubscribeClickOutside: () => void = () => null;
  // #endregion

  // #region Lifecycle Hooks
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
  // #endregion
}
