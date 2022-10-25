import { HttpInterceptor, HttpSentEvent, HttpHeaderResponse, HttpHandler, HttpEvent, HttpRequest, HttpHeaders, HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  
  constructor(){
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let jsonReq: HttpRequest<any> = req.clone({
      setHeaders:{
        Authorization : `Bearer ${localStorage.getItem("token")}`,
        'Content-Type' : 'application/json',
        'Access-Control-Allow-Origin' : '*'
      },
    });
    
    return next.handle(jsonReq).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.status === 401) {
          console.log("UnAuthorized");
        }
      })
    );
  }
}