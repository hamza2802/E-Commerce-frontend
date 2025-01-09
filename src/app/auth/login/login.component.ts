import { Component } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private loginService: LoginService, private router: Router) { }

  passwordFieldType: string = 'password';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]), 
    password: new FormControl('', [Validators.required]), 
    userCaptcha: new FormControl('', [Validators.required]) 
  });

  myToken: any = "";
  role: any = "";
  captcha: string = this.generateCaptcha();
  captchaFailed: boolean = false;

  generateCaptcha(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return captcha;
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Mark all fields as touched to trigger validation messages
      return;
    }

    if (this.loginForm.value.userCaptcha !== this.captcha) {
      this.captchaFailed = true;
      this.loginForm.get('userCaptcha')?.reset(); // Clear the captcha input
      this.captcha = this.generateCaptcha(); // Generate a new captcha
    } else {
      this.captchaFailed = false;
      this.loginService.signIn(this.loginForm.value).subscribe({
        next: (response) => {
          this.myToken = response.accessToken;
          localStorage.setItem('token', this.myToken);

          const payload = JSON.parse(atob(this.myToken.split('.')[1]));
          const userRole = payload['role'];

          const userName = payload['sub'];
          if (userRole[0].authority === 'ROLE_ADMIN') {
            this.router.navigateByUrl('/admin-dashboard/admin-home');
          } else if (userRole[0].authority === 'ROLE_CUSTOMER') {
            this.router.navigateByUrl('/customer-dashboard/customer-home');
          } else if (userRole[0].authority === 'ROLE_DELIVERY_AGENT') {
            this.router.navigateByUrl('/agent-dashboard/agent-assigned-orders');
          }
        }, 
        error: (err: HttpErrorResponse) => {
          console.log(err.message);
        }
      });
    }
  }
}
