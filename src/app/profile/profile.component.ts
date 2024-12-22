import { Component, inject } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Auth, updateCurrentUser, updateProfile } from '@angular/fire/auth';

@Component({
    selector: 'app-profile',
    imports: [
        NavBarComponent,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
})
export class ProfileComponent {
    private readonly auth = inject(Auth);
    editMode: boolean = false;
    nameFormControl = new FormControl('Default name', [Validators.required]);
    aboutFormControl = new FormControl(
        'I not working yet, sad. Work in progess',
        [Validators.required]
    );
    name: string | undefined | null = this.auth.currentUser?.displayName;
    email: string | undefined | null = this.auth.currentUser?.email;
    profilePhoto = this.auth.currentUser?.photoURL;

    onEdit() {
        this.editMode = true;
        this.nameFormControl.setValue(this.name ? this.name : 'Unknown name');
    }
    onSave() {
        updateProfile(this.auth.currentUser!, {
            displayName: this.nameFormControl.value,
        })
            .then(() => {
                console.log('Name updated');
                this.editMode = false;
                this.name = this.nameFormControl.value;
            })
            .catch((error) => {
                console.error('name update failed');
            });
    }
}
