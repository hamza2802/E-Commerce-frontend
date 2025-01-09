import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { CustomerHomeComponent } from './customer-home/customer-home.component';
import { RouterModule } from '@angular/router';
import { CustomerHeaderComponent } from './customer-header/customer-header.component';

import { CategoryMobileComponent } from './category-mobile/category-mobile.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from './customer-cart/customer-cart.component';
import { CategoryHeadphonesComponent } from './category-headphones/category-headphones.component';
import { CategorySmartwatchesComponent } from './category-smartwatches/category-smartwatches.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerOrdersComponent } from './customer-orders/customer-orders.component';
import { CustomerFooterComponent } from './customer-footer/customer-footer.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SearchpageComponent } from './searchpage/searchpage.component';






@NgModule({
  declarations: [
    CustomerDashboardComponent,
    CustomerHomeComponent,
    CustomerHeaderComponent,
    CategoryMobileComponent,
    ProductDetailsComponent,
    CartComponent,
    CategoryHeadphonesComponent,
    CategorySmartwatchesComponent,
    ProfileComponent,
    CustomerOrdersComponent,
    CustomerFooterComponent,
    CheckoutComponent,
    SearchpageComponent
    
   
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,RouterModule
    
  ],

  exports:[
    CustomerHeaderComponent,
    SearchpageComponent
  ]
})
export class CustomerModule { }
