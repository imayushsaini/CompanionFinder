import { Component, inject } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Auth, updateProfile } from '@angular/fire/auth';
import { ApiService } from '../service/api.service';

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
    about: string | undefined;
    constructor(private apiService: ApiService) {
        apiService.fetchProfile().subscribe({
            next: (response: any) => {
                this.about = response['about'];
            },
            error: (error) => {},
        });
    }

    onEdit() {
        this.editMode = true;
        this.nameFormControl.setValue(this.name ? this.name : 'Unknown name');
        this.aboutFormControl.setValue(this.about ? this.about : '');
    }

    onSave() {
        const newName = this.nameFormControl.value;
        const newAbout = this.aboutFormControl.value;

        if (newName && this.name != newName) {
            this.updateUserName(newName);
        }
        if (newAbout && this.about != newAbout) {
            this.updateUserAbout(newAbout);
        }
    }
    updateUserName(name: string) {
        updateProfile(this.auth.currentUser!, {
            displayName: name,
        })
            .then(() => {
                console.log('Name updated');
                this.editMode = false;
                this.name = name;
            })
            .catch((error) => {
                console.error('name update failed', error);
            });
    }
    updateUserAbout(about: string) {
        this.apiService.updateProfile(about).subscribe({
            next: (response: any) => {
                this.editMode = false;
                this.about = about;
            },
            error: (error) => {
                console.log(error);
            },
        });
    }
}
