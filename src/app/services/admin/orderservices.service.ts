import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderservicesService {

  private baseUrl = 'http://localhost:8080/e-commerce/orders';

  constructor(private http: HttpClient) {}

  getOrdersByStatus(status: string): Observable<any[]> {
    const url = `${this.baseUrl}/${status.toLowerCase()}`; // Correct query parameter handling
    return this.http.get<any[]>(url);
  }
}