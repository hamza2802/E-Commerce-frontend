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
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  zone: string = '';
  contactNumber: string = '';
  vehicleType: string = '';  // Add field for vehicleType
  vehicleNumber: string = '';  // Add field for vehicleNumber

  constructor(private deliveryAgentService: DeliveryAgentService) {}

  ngOnInit(): void {
    this.fetchDeliveryAgents();  // Fetch agents when component loads
  }

  // Fetch the list of delivery agents
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

  // Populate the modal with selected agent data
  populateModal(agent: any): void {
    this.selectedAgent = agent;
    this.firstName = agent.firstname; 
    this.lastName = agent.lastname;
    this.email = agent.email;
    this.zone = agent.deliveryZone;
    this.contactNumber = agent.contactNumber;
    this.vehicleType = agent.vehicleType;
    this.vehicleNumber = agent.vehicleNumber;
  }

  // Add a new delivery agent
  addDeliveryAgent(): void {
    const newAgent = {
      firstName: this.firstName,  // Use the first name directly
      lastName: this.lastName,     // Use the last name directly
      password: this.password,
      email: this.email,
      contactNumber: parseInt(this.contactNumber),  // Convert the contact number to number
      deliveryZone: this.zone,
      vehicleType: this.vehicleType,  // Include vehicleType
      vehicleNumber: this.vehicleNumber,  // Include vehicleNumber
    };

    this.deliveryAgentService.addDeliveryAgent(newAgent).subscribe({
      
      
      next: (response) => {
        console.log(newAgent);
        this.deliveryAgents.push(response);  // Add the new agent to the table
        this.resetForm();
        alert('Agent added successfully!');
      },
      error: (error) => {
        console.error('Error adding delivery agent:', error);
      }
    });
  }

  // Reset form fields
  resetForm(): void {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.zone = '';
    this.contactNumber = '';
    this.vehicleType = '';
    this.vehicleNumber = '';
  }
}
