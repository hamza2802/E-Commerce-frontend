import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryAgentService {

  private apiUrl = 'http://localhost:8080/e-commerce/delivery-agents';  // Replace with your backend URL

  constructor(private http: HttpClient) {}

  // Fetch all delivery agents from the backend
  getDeliveryAgents(page: number, size: number): Observable<any> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  // Add a new delivery agent to the backend
  addDeliveryAgent(agent: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, agent);
  }
  updateDeliveryAgent(agent: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${agent.id}`, agent);
  }

}


