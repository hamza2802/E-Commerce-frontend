import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(private http: HttpClient) {}

  onRegister() {
    if (this.registerForm.valid) {
      const userData = this.registerForm.value;
      this.http.post('http://localhost:8080/e-commerce/register', userData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          alert('Registration successful!');
          this.registerForm.reset();
        },
        error: (error) => {
          console.error('Registration failed:', error);
          alert('Registration failed. Please try again.');
        }
      });
    }
  }
}
