import { Component, OnInit } from '@angular/core';
import { DeliveryAgentService } from 'src/app/services/delivery-agent/deliveryAgentService';

@Component({
  selector: 'app-admin-deliveryagents',
  templateUrl: './admin-deliveryagents.component.html',
  styleUrls: ['./admin-deliveryagents.component.css']
})
export class AdminDeliveryagentsComponent implements OnInit {
  deliveryAgents: any[] = [];
  filteredAgents: any[] = [];
  selectedAgent: any | null = null;
  
  // Search property
  searchTerm: string = '';
  
  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  
  // Form fields
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  zone: string = '';
  contactNumber: string = '';
  vehicleType: string = '';
  vehicleNumber: string = '';

  constructor(private deliveryAgentService: DeliveryAgentService) {}

  ngOnInit(): void {
    this.fetchDeliveryAgents();
  }

  fetchDeliveryAgents(): void {
    this.deliveryAgentService.getDeliveryAgents(0, 100).subscribe({
      next: (response) => {
        this.deliveryAgents = response.content;
        this.filteredAgents = [...this.deliveryAgents]; // Initialize filtered agents with all agents
        this.totalItems = this.filteredAgents.length;
      },
      error: (error) => {
        console.error('Error fetching delivery agents:', error);
      }
    });
  }

  // Updated search functionality with safe checks
  filterAgents(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredAgents = [...this.deliveryAgents];
    } else {
      const searchStr = this.searchTerm.toLowerCase().trim();
      
      this.filteredAgents = this.deliveryAgents.filter(agent => {
        // Safely handle null/undefined values
        const fullName = `${agent.firstname || ''} ${agent.lastname || ''}`.toLowerCase();
        const zone = (agent.deliveryZone || '').toLowerCase();
        const contact = (agent.contactNumber || '').toString().toLowerCase();
        
        return fullName.includes(searchStr) ||
               zone.includes(searchStr) ||
               contact.includes(searchStr);
      });
    }
    
    this.totalItems = this.filteredAgents.length;
    this.currentPage = 1; // Reset to first page when searching
  }

  // Get current page items from filtered results
  get paginatedAgents(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredAgents.slice(startIndex, endIndex);
  }

  // Get total pages based on filtered results
  get totalPages(): number {
    return Math.ceil(this.filteredAgents.length / this.pageSize);
  }

  // Get page numbers array for pagination
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  addDeliveryAgent(): void {
    const newAgent = {
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
      email: this.email,
      contactNumber: parseInt(this.contactNumber),
      deliveryZone: this.zone,
      vehicleType: this.vehicleType,
      vehicleNumber: this.vehicleNumber,
    };

    this.deliveryAgentService.addDeliveryAgent(newAgent).subscribe({
      next: (response) => {
        this.deliveryAgents.push(response);
        this.filterAgents(); // Reapply search filter after adding
        this.totalItems = this.filteredAgents.length;
        this.resetForm();
        alert('Agent added successfully!');
      },
      error: (error) => {
        console.error('Error adding delivery agent:', error);
      }
    });
  }

  updateDeliveryAgent(): void {
    if (this.selectedAgent) {
      const updatedAgent = {
        id: this.selectedAgent.id,
        firstname: this.firstName,
        lastname: this.lastName,
        password: this.password,
        email: this.email,
        contactNumber: parseInt(this.contactNumber),
        deliveryZone: this.zone,
        vehicleType: this.vehicleType,
        vehicleNumber: this.vehicleNumber,
      };

      this.deliveryAgentService.updateDeliveryAgent(updatedAgent).subscribe({
        next: (response) => {
          const index = this.deliveryAgents.findIndex(agent => agent.id === updatedAgent.id);
          if (index !== -1) {
            this.deliveryAgents[index] = response;
            this.filterAgents(); // Reapply search filter after updating
          }
          this.resetForm();
          alert('Agent updated successfully!');
        },
        error: (error) => {
          console.error('Error updating delivery agent:', error);
        }
      });
    }
  }

  deleteDeliveryAgent(agentId: number): void {
    this.deliveryAgents = this.deliveryAgents.filter(agent => agent.id !== agentId);
    this.filterAgents(); // Reapply search filter after deleting
    
    this.deliveryAgentService.deleteDeliveryAgent(agentId).subscribe({
      next: () => {
        alert('Agent deleted successfully!');
      },
      error: (error) => {
        console.error('Error deleting delivery agent:', error);
        this.fetchDeliveryAgents();
      }
    });
  }

  resetForm(): void {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.password = '';
    this.zone = '';
    this.contactNumber = '';
    this.vehicleType = '';
    this.vehicleNumber = '';
  }

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
}