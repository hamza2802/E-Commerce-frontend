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
import { CustomerDashboardComponent } from './customer/customer-dashboard/customer-dashboard.component'; 
import { CustomerHomeComponent } from './customer/customer-home/customer-home.component'; 
import { CustomerHeaderComponent } from './customer/customer-header/customer-header.component'; 
import { CategoryMobileComponent } from './customer/category-mobile/category-mobile.component'; 
import { ProductDetailsComponent } from './customer/product-details/product-details.component'; 
import { ViewCustomerComponent } from './admin/view-customer/view-customer.component'; 
import { CartComponent } from './customer/customer-cart/customer-cart.component'; 
import { CategoryHeadphonesComponent } from './customer/category-headphones/category-headphones.component'; 
import { CategorySmartwatchesComponent } from './customer/category-smartwatches/category-smartwatches.component'; 
import { ProfileComponent } from './customer/profile/profile.component'; 
import { CustomerOrdersComponent } from './customer/customer-orders/customer-orders.component'; 
import { CheckoutComponent } from './customer/checkout/checkout.component'; 
import { SearchpageComponent } from './customer/searchpage/searchpage.component'; 
import { AgentDashboardComponent } from './deliver-agent/agent-dashboard/agent-dashboard.component'; 
import { AgentHeaderComponent } from './deliver-agent/agent-header/agent-header.component'; 
import { AssignedOrdersComponent } from './deliver-agent/assigned-orders/assigned-orders.component'; 
import { DeliveredOrdersComponent } from './deliver-agent/delivered-orders/delivered-orders.component'; 
import { AgentProfile } from './deliver-agent/agentProfile/agentProfile.component'; 
import { AuthGuard } from './guards/auth.guard';
import { OutfordeliveryComponent } from './deliver-agent/outfordelivery/outfordelivery.component';
 
 
 
const routes: Routes = [ 
  {
    path : "",
    redirectTo : "/customer-dashboard/customer-home",
    pathMatch : "full"
  },
  {
    path : "login",
    component : LoginComponent,
  }, 
  {  
    path : "register", 
    component : RegisterComponent 
  }, 
  { 
   path :"admin-dashboard", 
   component: AdminDashboardComponent, 
   canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] },
   children:[ 
    { 
    path : "admin-home", 
    component: AdminHomeComponent ,
    canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] },
    }, 
    { 
      path :"admin-orders", 
      component :OrdersDashboardComponent ,
      canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] },
    }, 
    { 
      path : "admin-products", 
      component :AdminProductsComponent ,
      canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] },
    },   
    { 
      path : "admin-category", 
      component : AdminCategoryComponent ,
      canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] },
      
    }, 
    { 
      path : "admin-deliveryAgent", 
      component : AdminDeliveryagentsComponent ,
      canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] },
    }, 
    { 
      path : "view-customer", 
      component : ViewCustomerComponent ,
      canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] },
    } 
     
     
   ] 
  }, 
 
 
 
  // Customer Routing  
  { 
    path : "customer-dashboard", 
    component : CustomerDashboardComponent, 
    children : [ 
      { 
        path : "customer-home", 
        component : CustomerHomeComponent 
      }, 
      { 
        path : "customer-headers", 
        component : CustomerHeaderComponent 
      }, 
      { 
        path : "customer-mobile", 
        component : CategoryMobileComponent 
      }, 
      { 
        path : "product-details", 
        component :ProductDetailsComponent 
      }, 
      { 
        path  : "customer-cart", 
        component : CartComponent ,
        canActivate: [AuthGuard], data: { roles: ['ROLE_CUSTOMER'] },

      }, 
      { 
        path : "customer-headphones", 
        component : CategoryHeadphonesComponent 
      }, 
      { 
        path : "customer-smartwatches", 
        component : CategorySmartwatchesComponent 
      }, 
      { 
        path : "customer-profile", 
        component : ProfileComponent ,
        canActivate: [AuthGuard], data: { roles: ['ROLE_CUSTOMER'] },

      }, 
      { 
        path : "customer-myorders", 
        component : CustomerOrdersComponent ,
        canActivate: [AuthGuard], data: { roles: ['ROLE_CUSTOMER'] },

      }, 
      { 
        path :"customer-checkout", 
        component : CheckoutComponent ,
        canActivate: [AuthGuard], data: { roles: ['ROLE_CUSTOMER'] },

      }, 
      { 
        path:"search", 
        component:SearchpageComponent 
      } 
    ] 
  }, 
  { 
    path : "agent-dashboard", 
    component : AgentDashboardComponent, 
    canActivate: [AuthGuard], data: { roles: ['ROLE_DELIVERY_AGENT'] },
    children : [ 
      { 
        path : "agent-header", 
        component : AgentHeaderComponent ,
        canActivate: [AuthGuard], data: { roles: ['ROLE_DELIVERY_AGENT'] },
      }, 
      { 
        path : "agent-assigned-orders", 
        component : AssignedOrdersComponent ,
        canActivate: [AuthGuard], data: { roles: ['ROLE_DELIVERY_AGENT'] },
      }, 
      { 
        path :  "agent-delivered-orders", 
        component : DeliveredOrdersComponent ,
        canActivate: [AuthGuard], data: { roles: ['ROLE_DELIVERY_AGENT'] },
      }, 
      { 
        path : "agent-profile", 
        component : AgentProfile ,
        canActivate: [AuthGuard], data: { roles: ['ROLE_DELIVERY_AGENT'] },
      },
      {
        path : "agent-outfordelivery",
        component : OutfordeliveryComponent
      } 
    ] 
  } 
 
     
     
  
]; 
 
@NgModule({ 
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule] 
}) 
export class AppRoutingModule { }