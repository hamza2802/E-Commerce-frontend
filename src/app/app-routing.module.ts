import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminModule } from './admin/admin.module';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { OrderDetailsComponent } from './admin/orders/order-details/order-details.component';
import { OrderEditComponent } from './admin/orders/order-edit/order-edit.component';
import { OrdersDashboardComponent } from './admin/orders/order-dashboard/order-dashboard.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { AdminDeliveryagentsComponent } from './admin/admin-deliveryagents/admin-deliveryagents.component';
import { AuthModule } from './auth/auth.module';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

const routes: Routes = [
  {
    path : "",
    component : LoginComponent,
  },
  {
    path : "register",
    component : RegisterComponent
  },
  {
   path :"admin-dashboard",
   component: AdminDashboardComponent,
   children:[
    {
    path : "admin-home",
    component: AdminHomeComponent
    },
    {
      path :"admin-orders",
      component :OrdersDashboardComponent
    },
    {
      path : "admin-products",
      component :AdminProductsComponent
    },
    {
      path : "admin-category",
      component : AdminCategoryComponent
    },
    {
      path : "admin-deliveryAgent",
      component : AdminDeliveryagentsComponent
    }
   ]
  }

    
    
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
