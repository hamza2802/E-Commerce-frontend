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
  errorMessage: string = '';  // New property to hold the error message

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
    console.log("hellllllllllll");
  
    if (this.loginForm.value.userCaptcha !== this.captcha) {
      this.captchaFailed = true;
      this.loginForm.get('userCaptcha')?.reset(); // Clear the captcha input
      this.captcha = this.generateCaptcha(); // Generate a new captcha
    } else {
      this.captchaFailed = false;
      this.loginService.signIn(this.loginForm.value).subscribe({
        next: (response) => {
          console.log(response);
  
          if (response && response.accessToken) {
            this.myToken = response.accessToken;
            localStorage.setItem('token', this.myToken);
  
            try {
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
            } catch (error) {
              console.error('Error decoding token:', error);
              this.errorMessage = 'There was an error with the token. Please try again.';
            }
          } else {
            this.errorMessage = 'Login failed. Please check your credentials and try again.';
          }
        },
        error: (err) => {
          console.error("Error during login:", err);
  
          if (err.status === 400) {
            // Ensure you access the correct errorMessage field
            this.errorMessage = err.error?.errorMessage || 'Invalid login credentials.';
          } else {
            this.errorMessage = 'An error occurred during login. Please try again later.';
          }
  
          alert(this.errorMessage); // Optionally show a user-friendly message
        }
      });
    }
  }
  
  
}
