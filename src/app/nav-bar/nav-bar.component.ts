import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SiginDialogComponent } from '../sigin-dialog/sigin-dialog.component';
import { Auth, onAuthStateChanged, signOut } from '@angular/fire/auth';
@Component({
    selector: 'app-nav-bar',
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatMenuModule,
    ],
    templateUrl: './nav-bar.component.html',
    styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
    readonly dialog = inject(MatDialog);

    private readonly auth = inject(Auth);

    displayName!: string | null;
    signedIn: boolean = false;
    constructor() {
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                this.signedIn = true;
                this.displayName = user.displayName;
            } else {
                this.signedIn = false;
            }
        });
    }

    openDialog() {
        const dialogRef = this.dialog.open(SiginDialogComponent, {
            height: '440px',
            width: '600px',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.displayName = result;
        });
    }
    async logout() {
        return await signOut(this.auth);
    }
}
