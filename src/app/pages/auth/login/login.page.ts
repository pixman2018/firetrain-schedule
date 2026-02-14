import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';
import { form, FormField } from '@angular/forms/signals';
import { I_Auth } from '../services/auth.model';

const ionicModule = [
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonInput,
  IonButton,
];
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormField, ...ionicModule],
})
export class LoginPage implements OnInit {
  private _authService = inject(AuthService);
  private _router = inject(Router);

  // local states
  protected isLoading = signal(false);
  protected errorMessage = signal<string | null>(null);

  private _loginModel = signal<I_Auth>({
    email: '',
    password: '',
  });

  protected loginForm = form(this._loginModel);
  constructor() {}

  ngOnInit() {}

  protected async onLogin() {
    this.isLoading.set(true);
    try {
      await this._authService.login(
        this.loginForm.email().value(),
        this.loginForm.password().value(),
      );

      this._router.navigateByUrl('/tabs/home');
    } catch (error: any) {
      const message = 'Error by login ' + error.message;
      this.errorMessage.set(message);
      console.error(message);
    } finally {
      this.isLoading.set(false);
    }
  }
}
