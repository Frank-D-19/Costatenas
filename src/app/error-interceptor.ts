import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
    constructor(private toastr:ToastrService){}

    intercept(req: HttpRequest<any>, next:HttpHandler){
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse)=>{
                if(error.error.mensaje!= undefined) 
                    this.toastr.warning(error.error.mensaje, 'Aviso');
                else
                    this.toastr.error(error.message, 'Error');
                // return new Observable<any>();
                return throwError(error);
            })
        );
    }
}