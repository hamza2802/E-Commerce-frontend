import { NgModule } from '@angular/core'; 
import { BrowserModule } from '@angular/platform-browser'; 
 
import { AppRoutingModule } from './app-routing.module'; 
import { AppComponent } from './app.component'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatCardModule } from '@angular/material/card'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatRippleModule } from '@angular/material/core'; 
import { AdminModule } from './admin/admin.module'; 
import { RouterModule } from '@angular/router'; 
import { OrdersModule } from './admin/orders/orders.module'; 
import { MatTabsModule } from '@angular/material/tabs'; 
import { FormsModule } from '@angular/forms'; 
import { AuthModule } from './auth/auth.module'; 
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'; 
import { JwtInterceptor } from './jwt.interceptor'; 
import { CustomerModule } from './customer/customer.module'; 
import { ReactiveFormsModule } from '@angular/forms'; 
import { DeliveryAgentModule } from './deliver-agent/delivery-agent.module'; 
import { ToastrModule } from 'ngx-toastr';
 
 
 
 
 
 
 
@NgModule({ 
  declarations: [ 
    AppComponent, 
    
     
 
 
  ], 
  imports: [ 
    BrowserModule, 
    AppRoutingModule, 
    BrowserAnimationsModule, 
    MatToolbarModule, 
    MatCardModule, 
    MatIconModule, 
    MatRippleModule, 
    AdminModule, 
    RouterModule, 
    OrdersModule, 
    MatTabsModule, 
    FormsModule, 
    AuthModule, 
    HttpClientModule, 
    CustomerModule, 
    ReactiveFormsModule, 
    DeliveryAgentModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-center-right', // Use custom position class
      preventDuplicates: true,
    })
    
    
     
     
 
  ], 
  providers: [{ 
    provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true 
  }], 
  bootstrap: [AppComponent] 
}) 
export class AppModule { }