import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$')
    ]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordMatchValidator });

  showPopup = false;
  popupMessage = { title: '', message: '' };

  constructor(private http: HttpClient) {}

  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    } else if (field === 'confirmPassword') {
      this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onRegister() {
    if (this.registerForm.valid) {
      const email = this.registerForm.value.email;
  
      // Check if email is not null or undefined before calling .toLowerCase()
      if (email) {
        const emailLowercased = email.toLowerCase();
  
        const userData = {
          firstname: this.registerForm.value.firstname,
          lastname: this.registerForm.value.lastname,
          email: emailLowercased,  
          password: this.registerForm.value.password
        };
  
        this.http.post('http://localhost:8080/e-commerce/register', userData).subscribe({
          next: (response) => {
            console.log('Registration successful:', response);
            this.showPopupMessage('Success', 'Registration successful!');
          },
          error: (error) => {
            console.error('Registration failed:', error);
            this.showPopupMessage('Error', 'Registration failed. Please try again.');
          }
        });
      } else {
        // Handle the case when email is null or undefined
        console.error('Email is missing!');
        this.showPopupMessage('Error', 'Please enter a valid email.');
      }
    }
  }
  
  showPopupMessage(title: string, message: string) {
    this.popupMessage = { title, message };
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }

  get email() { return this.registerForm.get('email'); }
  get firstname() { return this.registerForm.get('firstname'); }
  get lastname() { return this.registerForm.get('lastname'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
}  