import { Component } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  constructor(private loginService: LoginService, private router: Router) { }

  
  loginForm = new FormGroup({
    email: new FormControl(),
    password: new FormControl()
  });
  myToken: any = "";
  role: any = "";
  
  




  onLogin() {
    console.log("Form Data: ", this.loginForm.value);
      this.loginService.signIn(this.loginForm.value).subscribe({
        next: (response) => {
          this.myToken = response.accessToken
          console.log(this.myToken)
          localStorage.setItem('token', this.myToken);

          const payload = JSON.parse(atob(this.myToken.split('.')[1]));
          console.log(payload)
          const userRole = payload['role'];
          console.log(userRole[0].authority);

          const userName = payload['sub'];
          console.log(userName);
          if (userRole[0].authority === 'ROLE_ADMIN') {
            this.router.navigateByUrl('/admin-dashboard/admin-home');
          } else if (userRole[0].authority === 'ROLE_CUSTOMER') {
            this.router.navigateByUrl('/customer-dashboard');
          }else if (userRole[0].authority === 'ROLE_DELIVERY_AGENT') {
            this.router.navigateByUrl('/delivery-dashboard');
          }
        },
        error:(err:HttpErrorResponse)=>{
          console.log("hi");
          console.log(err.message);
          
          
        }
      });

  }
  

}
