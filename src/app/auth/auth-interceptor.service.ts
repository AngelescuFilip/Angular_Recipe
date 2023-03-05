import {Injectable} from "@angular/core";
import {HttpEventType, HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from "@angular/common/http";
import {exhaustMap, take, tap} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
     return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }
         const modifiedRequest = req.clone({
           params: new HttpParams().set('auth', user.token)
         });  // change the headers
        return next.handle(modifiedRequest);
      }))
  }
}
