import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private baseUrl = 'http://localhost:8080/e-commerce/orders';

  

  constructor(private http: HttpClient) {}

  getAssignedOrders(page: number, size: number): Observable<any> {
    const url = `${this.baseUrl}/assigned-to-me?page=${page}&size=${size}`;
    return this.http.get<any>(url);
  }

  markAsDelivered(orderId: number): Observable<any> {
    const url = `${this.baseUrl}/mark-as-delivered/${orderId}`;
    return this.http.put<any>(url, {});
  }

  markAsOutForDelivery(orderId: number): Observable<any> {
    const url = `${this.baseUrl}/out-for-delivery/${orderId}`;
    return this.http.put<any>(url, {});
  }
}