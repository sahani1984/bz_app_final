import { Directive, EventEmitter, ElementRef, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[clickElsewhere]'
})
export class ClickElsewhereDirective {

  @Output() clickElsewhere = new EventEmitter<MouseEvent>();

  constructor(private elementRef: ElementRef) { }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    // Check if the click was outside the element
    if (targetElement && !this.elementRef.nativeElement.contains(targetElement)) {
      this.clickElsewhere.emit(event);
    }
  }

}


// import {Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';

// @Directive({
//     selector: '[clickOutside]'
// })
// export class ClickElsewhereDirective {
//     constructor(private _elementRef : ElementRef) {
//     }

//     @Output()
//     public clickOutside = new EventEmitter();

//     @HostListener('document:click', ['$event.target'])
//     public onClick(targetElement) {
//         const clickedInside = this._elementRef.nativeElement.contains(targetElement);
//         //if (!clickedInside) {
//             this.clickOutside.emit(clickedInside);
//             console.log(targetElement.className)
//             console.log(clickedInside)
//        // }
//     }
// }
