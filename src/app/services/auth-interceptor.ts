import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const stateName = sessionStorage.getItem('state');
    const districtName = sessionStorage.getItem('district');
    if(stateName && districtName){
      const authRequest = req.clone({
        headers: req.headers.set("state", stateName).set('district', districtName)
      });

      return next.handle(authRequest).pipe(tap(() => { },
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status !== 401) {
            return;
          }
          this.router.navigate(['']);
        }
      }));
    }
    
   
  }
}
