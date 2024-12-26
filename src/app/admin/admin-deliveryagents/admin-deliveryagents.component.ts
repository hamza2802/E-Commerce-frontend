import { Component, OnInit } from '@angular/core';
import { DeliveryAgentService } from 'src/app/services/delivery-agent/deliveryAgentService';  // Your service for API calls

@Component({
  selector: 'app-admin-deliveryagents',
  templateUrl: './admin-deliveryagents.component.html',
  styleUrls: ['./admin-deliveryagents.component.css']
})
export class AdminDeliveryagentsComponent implements OnInit {
  deliveryAgents: any[] = [];  // Use `any[]` for an array of objects
  selectedAgent: any | null = null; // To hold the selected agent data
  agentName: string = '';
  zone: string = '';
  contactNumber: string = '';
  details: string = '';

  constructor(private deliveryAgentService: DeliveryAgentService) {}

  ngOnInit(): void {
    this.fetchDeliveryAgents();  // Fetch agents when component loads
  }

  fetchDeliveryAgents(): void {
    this.deliveryAgentService.getDeliveryAgents(0, 10).subscribe({
      next: (response) => {
        this.deliveryAgents = response.content;  // Populate the table with agents data
      },
      error: (error) => {
        console.error('Error fetching delivery agents:', error);
      }
    });
  }

  populateModal(agent: any): void {
    this.selectedAgent = agent;
  }

  addDeliveryAgent(): void {
    const newAgent = {
      firstname: this.agentName.split(' ')[0],  // Assuming first name is the first part of the input
      lastname: this.agentName.split(' ')[1] || '', // Assuming last name is the second part
      contactNumber: parseInt(this.contactNumber),  // Convert the contact number to number
      deliveryZone: this.zone,
      vehicleType: '',  // Default empty, unless you have this data in your form
      vehicleNumber: '',  // Similarly, default empty
    };

    this.deliveryAgentService.addDeliveryAgent(newAgent).subscribe({
      next: (response) => {
        this.deliveryAgents.push(response);  // Add the new agent to the table
        this.resetForm();
        alert('Agent added successfully!');
      },
      error: (error) => {
        console.error('Error adding delivery agent:', error);
      }
    });
  }

  resetForm(): void {
    this.agentName = '';
    this.zone = '';
    this.contactNumber = '';
    this.details = '';
  }
}
