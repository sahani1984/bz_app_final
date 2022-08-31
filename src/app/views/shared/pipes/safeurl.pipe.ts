import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeurl'
})
export class SafeurlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  public transform(value, params): SafeHtml {   
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }


}
