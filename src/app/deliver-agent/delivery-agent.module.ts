import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentDashboardComponent } from './agent-dashboard/agent-dashboard.component';
import { AgentHeaderComponent } from './agent-header/agent-header.component';
import { AssignedOrdersComponent } from './assigned-orders/assigned-orders.component';
import { AgentFooterComponent } from './agent-footer/agent-footer.component';
import { RouterModule } from '@angular/router';
import { DeliveredOrdersComponent } from './delivered-orders/delivered-orders.component';
import { AgentProfile } from './agentProfile/agentProfile.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AgentDashboardComponent,
    AgentHeaderComponent,
    AssignedOrdersComponent,
    AgentFooterComponent,
    DeliveredOrdersComponent,
    AgentProfile
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class DeliveryAgentModule { }
