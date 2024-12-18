// boilerplate from : https://github.com/angular/angularfire/blob/bc926a84d5877eb470055a61c731005b51a1b6d4/sample/src/app/auth/auth.component.ts
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
    Component,
    inject,
    makeStateKey,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
    TransferState,
} from '@angular/core';
import {
    Auth,
    createUserWithEmailAndPassword,
    signInAnonymously,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User,
} from '@angular/fire/auth';
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
    FormGroup,
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
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    templateUrl: './sigin-dialog.component.html',
    styleUrl: './sigin-dialog.component.scss',
})
export class SiginDialogComponent implements OnInit, OnDestroy {
    private readonly auth = inject(Auth);
    protected readonly authState = authState(this.auth);

    private readonly transferState = inject(TransferState);
    private readonly transferStateKey = makeStateKey<string | undefined>(
        'auth:uid'
    );
    showEmailPasswordLoginForm: boolean = false;
    showSignUpForm: boolean = false;
    showResetForm: boolean = false;
    invalidPasswordMessage: string | undefined;
    signupForm = new FormGroup({
        emailFormControl: new FormControl('', [
            Validators.required,
            Validators.email,
        ]),
        nameFormControl: new FormControl('', [Validators.required]),
        passwordFormControl: new FormControl('', [
            Validators.required,
            Validators.minLength(8),
        ]),
    });
    loginForm = new FormGroup({
        emailFormControl: new FormControl('', [
            Validators.required,
            Validators.email,
        ]),
        passwordFormControl: new FormControl('', [
            Validators.required,
            Validators.minLength(8),
        ]),
    });

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
                    } else {
                        cookies.remove('__session');
                    }
                },
                async () => {
                    // If another beforeAuthStateChanged rejects, revert the cookie (best-effort)
                    if (priorCookieValue) {
                        cookies.set('__session', priorCookieValue);
                    } else {
                        cookies.remove('__session');
                    }
                }
            );
        }
    }
    ngOnInit() {
        this.loginForm
            .get('passwordFormControl')
            ?.valueChanges.subscribe((value) => {
                if (value!) this.invalidPasswordMessage = undefined;
            });
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
        return signInWithPopup(this.auth, new GoogleAuthProvider()).then(
            (userCreds) => {
                this.dialogRef.close();
            }
        );
    }

    openSignupForm() {
        this.showSignUpForm = true;
    }
    openLoginEmailPasswordForm() {
        this.showEmailPasswordLoginForm = true;
    }
    openResetForm() {
        this.showResetForm = true;
    }
    login() {
        signInWithEmailAndPassword(
            this.auth,
            this.loginForm.value.emailFormControl!,
            this.loginForm.value.passwordFormControl!
        )
            .then((userCreds) => {
                console.log('logged in');
                this.dialogRef.close();
            })
            .catch((error) => {
                this.invalidPasswordMessage = error.message;
                this.loginForm.get('passwordFormControl')?.setValue('');
            });
    }
    signup() {
        createUserWithEmailAndPassword(
            this.auth,
            this.signupForm.value.emailFormControl!,
            this.signupForm.value.passwordFormControl!
        )
            .then((userCredentials) => {
                updateProfile(userCredentials.user, {
                    displayName: this.signupForm.value.nameFormControl,
                }).then(() => {
                    console.log('Profile Created successfully !');
                    this.dialogRef.close(this.signupForm.value.nameFormControl);
                });
            })

            .catch((error) => {
                console.log(error);
            });
    }
}
