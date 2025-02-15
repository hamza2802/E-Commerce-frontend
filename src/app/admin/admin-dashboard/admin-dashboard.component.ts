import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {

  constructor(private router: Router) { }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(["/customer-dashboard/customer-home"]);
  }
  
}
