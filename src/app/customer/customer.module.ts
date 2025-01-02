import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { CustomerHomeComponent } from './customer-home/customer-home.component';
import { RouterModule } from '@angular/router';
import { CustomerHeaderComponent } from './customer-header/customer-header.component';
import { CustomerCartComponent } from './customer-cart/customer-cart.component';
import { CategoryMobileComponent } from './category-mobile/category-mobile.component';
import { ProductDetailsComponent } from './product-details/product-details.component';







@NgModule({
  declarations: [
    CustomerDashboardComponent,
    CustomerHomeComponent,
    CustomerHeaderComponent,
    CustomerCartComponent,
    CategoryMobileComponent,
    ProductDetailsComponent,
    
   
  ],
  imports: [
    CommonModule,
    RouterModule,
    
  ]
})
export class CustomerModule { }
