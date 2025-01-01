import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { CustomerHomeComponent } from './customer-home/customer-home.component';
import { RouterModule } from '@angular/router';
import { CustomerHeaderComponent } from './customer-header/customer-header.component';




@NgModule({
  declarations: [
    CustomerDashboardComponent,
    CustomerHomeComponent,
    CustomerHeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class CustomerModule { }
