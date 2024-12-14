// boilerplate from : https://github.com/angular/angularfire/blob/bc926a84d5877eb470055a61c731005b51a1b6d4/sample/src/app/auth/auth.component.ts
import {
    AsyncPipe,
    isPlatformBrowser,
    isPlatformServer,
} from '@angular/common';
import {
    Component,
    inject,
    makeStateKey,
    PLATFORM_ID,
    TransferState,
} from '@angular/core';
import { Auth, signInAnonymously, signOut, User } from '@angular/fire/auth';
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    beforeAuthStateChanged,
    onIdTokenChanged,
} from 'firebase/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { ɵzoneWrap } from '@angular/fire';
import cookies from 'js-cookie';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
    FormControl,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

// TODO bring this to RxFire
function _authState(auth: Auth): Observable<User | null> {
    return from(auth.authStateReady()).pipe(
        switchMap(
            () =>
                new Observable<User | null>((subscriber) => {
                    const unsubscribe = onAuthStateChanged(
                        auth,
                        subscriber.next.bind(subscriber),
                        subscriber.error.bind(subscriber),
                        subscriber.complete.bind(subscriber)
                    );
                    return { unsubscribe };
                })
        )
    );
}

export const authState = ɵzoneWrap(_authState, true);
@Component({
    selector: 'app-sigin-dialog',
    imports: [
        MatDialogModule,
        MatButtonModule,
        AsyncPipe,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    templateUrl: './sigin-dialog.component.html',
    styleUrl: './sigin-dialog.component.scss',
})
export class SiginDialogComponent {
    private readonly auth = inject(Auth);
    protected readonly authState = authState(this.auth);

    private readonly transferState = inject(TransferState);
    private readonly transferStateKey = makeStateKey<string | undefined>(
        'auth:uid'
    );
    protected readonly uid = this.authState
        .pipe(map((u) => u?.uid))
        .pipe(
            isPlatformServer(inject(PLATFORM_ID))
                ? tap((it) => this.transferState.set(this.transferStateKey, it))
                : this.transferState.hasKey(this.transferStateKey)
                ? startWith(
                      this.transferState.get(this.transferStateKey, undefined)
                  )
                : tap()
        );

    protected readonly showLoginButton = this.uid.pipe(map((it) => !it));
    protected readonly showLogoutButton = this.uid.pipe(map((it) => !!it));

    private readonly unsubscribeFromOnIdTokenChanged: (() => void) | undefined;
    private readonly unsubscribeFromBeforeAuthStateChanged:
        | (() => void)
        | undefined;
    readonly dialogRef = inject(MatDialogRef<SiginDialogComponent>);
    constructor() {
        if (isPlatformBrowser(inject(PLATFORM_ID))) {
            this.unsubscribeFromOnIdTokenChanged = onIdTokenChanged(
                this.auth,
                async (user) => {
                    if (user) {
                        const idToken = await user.getIdToken();
                        cookies.set('__session', idToken);
                        this.dialogRef.close();
                    } else {
                        cookies.remove('__session');
                    }
                }
            );

            let priorCookieValue: string | undefined;
            this.unsubscribeFromBeforeAuthStateChanged = beforeAuthStateChanged(
                this.auth,
                async (user) => {
                    priorCookieValue = cookies.get('__session');
                    const idToken = await user?.getIdToken();
                    if (idToken) {
                        cookies.set('__session', idToken);
                        this.dialogRef.close();
                    } else {
                        cookies.remove('__session');
                    }
                },
                async () => {
                    // If another beforeAuthStateChanged rejects, revert the cookie (best-effort)
                    if (priorCookieValue) {
                        cookies.set('__session', priorCookieValue);
                        this.dialogRef.close();
                    } else {
                        cookies.remove('__session');
                    }
                }
            );
        }
    }

    ngOnDestroy(): void {
        this.unsubscribeFromBeforeAuthStateChanged?.();
        this.unsubscribeFromOnIdTokenChanged?.();
    }

    async logout() {
        return await signOut(this.auth);
    }

    async loginAnonymously() {
        return await signInAnonymously(this.auth);
    }

    async loginWithGoogle() {
        return await signInWithPopup(this.auth, new GoogleAuthProvider());
    }
}
