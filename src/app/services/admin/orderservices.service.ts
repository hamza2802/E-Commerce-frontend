import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderservicesService {
  private baseUrl = 'http://localhost:8080/e-commerce/orders';

  constructor(private http: HttpClient) {}

  getOrdersByStatus(status: string, page: number, size: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${status}?page=${page}&size=${size}`);
  }

  getDeliveryAgentsByOrderLocation(orderId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${orderId}/delivery-agents`);
  }

  

  assignDeliveryAgent(orderId: number, deliveryAgentId: number): Observable<any> {
    // Create the DTO object that matches the backend's AssignDeliveryAgentDto
    const assignmentData = {
      orderId: orderId,
      deliveryAgentEmail: deliveryAgentId  // Note: Your backend expects an email, not an ID
    };
    
    return this.http.put<any>(`${this.baseUrl}/assign-delivery-agent`, assignmentData);
  }

}