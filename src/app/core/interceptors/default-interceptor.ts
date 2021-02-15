import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { environment } from '@env/environment';

import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../authentication/token.service';
import { SettingsService } from '@core/bootstrap/settings.service';

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private token: TokenService,
    private settings: SettingsService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // let token = window.localStorage.getItem('token');
    const token = 'abc';
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJzb2Z0dGVrSldUIiwic3ViIjoicmVhZCIsImF1dGhvcml0aWVzIjpbeyJkZWxlZ2F0ZSI6Im9yZy5zcHJpbmdmcmFtZXdvcmsuc2VjdXJpdHkuY29yZS5HcmFudGVkQXV0aG9yaXR5Iiwib3duZXIiOiJvcmcuc3ByaW5nZnJhbWV3b3JrLnNlY3VyaXR5LmNvcmUuR3JhbnRlZEF1dGhvcml0eSIsInRoaXNPYmplY3QiOm51bGwsInJlc29sdmVTdHJhdGVneSI6MCwiZGlyZWN0aXZlIjowLCJwYXJhbWV0ZXJUeXBlcyI6W10sIm1heGltdW1OdW1iZXJPZlBhcmFtZXRlcnMiOjAsIm1ldGhvZCI6ImdldEF1dGhvcml0eSJ9XX0.nOgf_twKN_lhmHMIl1reTwrNN71QiAaeyu9iB5ytRv21gpvU4PR7v9JI9X2vNYZ9TETrsxCRLe3GaezJbGgyig',
        }
      });
      return next.handle(request);
    }
  }


}
