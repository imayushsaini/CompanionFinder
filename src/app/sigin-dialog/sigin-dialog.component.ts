import { Component, inject, Optional } from '@angular/core';
import { Auth, authState, signInAnonymously, signOut, User, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { traceUntilFirst } from '@angular/fire/performance';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { Subscription, Observable, EMPTY, map } from 'rxjs';

@Component({
  selector: 'app-sigin-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './sigin-dialog.component.html',
  styleUrl: './sigin-dialog.component.scss'
})
export class SiginDialogComponent {
  private readonly userDisposable: Subscription|undefined;
  public readonly user: Observable<User | null> = EMPTY;

  showLoginButton = true;
  showLogoutButton = false;
  constructor(@Optional() private auth: Auth) {
    console.log(auth)
    if (auth) {
      this.user = authState(this.auth);
      this.userDisposable = authState(this.auth).pipe(
        traceUntilFirst('auth'),
        map(u => !!u)
      ).subscribe((isLoggedIn: boolean) => {
        this.showLoginButton = !isLoggedIn;
        this.showLogoutButton = isLoggedIn;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.userDisposable) {
      this.userDisposable.unsubscribe();
    }
  }

  async login() {
    var gp = new GoogleAuthProvider();
    // return await signInWithPopup(this.auth, gp);
    return createUserWithEmailAndPassword(this.auth, "ayush@gmail.com", "123124242424")
  }

  async logout() {
    return await signOut(this.auth);
  }
}
