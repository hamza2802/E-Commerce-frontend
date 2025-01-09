import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-agent-header',
  templateUrl: './agent-header.component.html',
  styleUrls: ['./agent-header.component.css']
})
export class AgentHeaderComponent {

   constructor(private router: Router) { }

   

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(["/customer-dashboard/customer-home"]);
  }

}
