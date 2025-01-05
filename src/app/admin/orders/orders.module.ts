import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersDashboardComponent } from './order-dashboard/order-dashboard.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderEditComponent } from './order-edit/order-edit.component';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    OrdersDashboardComponent,
    OrderDetailsComponent,
    OrderEditComponent,
  ],
  imports: [
    CommonModule,
    RouterModule, // Import RouterModule for RouterLink
    MatTableModule,
    MatCardModule,
    MatButtonModule,FormsModule
  ],
})
export class OrdersModule {}
