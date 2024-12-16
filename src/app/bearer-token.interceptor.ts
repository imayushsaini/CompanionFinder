import {
    HttpEvent,
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { from, lastValueFrom } from 'rxjs';

const addBearerToken = async (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Promise<HttpEvent<any>> => {
    const auth = inject(Auth);
    const currentUser = auth.currentUser;
    const token = await currentUser?.getIdToken();
    console.log('toke is' + token);
    if (token) {
        req = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
        });
    }
    return lastValueFrom(next(req));
};
export const bearerTokenInterceptor: HttpInterceptorFn = (req, next) => {
    return from(addBearerToken(req, next));
};
