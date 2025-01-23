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
  errorMessage: string = '';

  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';

  constructor(private http: HttpClient) {}

  // Toggles visibility of password fields
  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    } else if (field === 'confirmPassword') {
      this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
    }
  }

  // Custom validator to check if password and confirmPassword match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // Handles user registration
  onRegister(): void {
    if (this.registerForm.valid) {
      const email = this.registerForm.value.email?.toLowerCase();

      const userData = {
        firstname: this.registerForm.value.firstname,
        lastname: this.registerForm.value.lastname,
        email: email,
        password: this.registerForm.value.password
      };

      this.http.post('http://localhost:8080/e-commerce/register', userData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.showPopupMessage('Success', 'Registration successful!');
        },
        error: (err) => {
          console.error('Error during registration:', err);

          if (err.status === 208) {
            this.errorMessage = err.error?.errorMessage || 'Email already registered.';
          } else {
            this.errorMessage = 'An error occurred during registration. Please try again later.';
          }

          this.showPopupMessage('Error', this.errorMessage);
        }
      });
    } else {
      this.showPopupMessage('Error', 'Please fill out the form correctly.');
    }
  }

  // Displays popup messages
  showPopupMessage(title: string, message: string): void {
    this.popupMessage = { title, message };
    this.showPopup = true;
  }

  // Closes popup
  closePopup(): void {
    this.showPopup = false;
  }

  // Getters for form controls
  get email() { return this.registerForm.get('email'); }
  get firstname() { return this.registerForm.get('firstname'); }
  get lastname() { return this.registerForm.get('lastname'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
}
