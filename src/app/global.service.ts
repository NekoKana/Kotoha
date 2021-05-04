import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded; charset=UTF-8'
  })
};

@Injectable({
  providedIn: 'root'
})

export class GlobalService {
  constructor(
    private _http: HttpClient
  ) { }

  static readonly HOST: string = 'http://example.com';

  public http(_endpoint: string, _trans_data: any = ''): Observable<any> {
    let ret: Observable<any>;

    ret = this._http.post(GlobalService.HOST + _endpoint, _trans_data, HTTP_OPTIONS)
    .pipe(
      timeout(5000),
      catchError(this.handleError())
    );

    return ret;
  }

  private handleError(): any {
    return (error: any): Observable<any> => {
      const ret = {
        'status': error.status,
        'data': error.statusText + '/' + error.url
      };
      return throwError(ret);
    };
  }
}
