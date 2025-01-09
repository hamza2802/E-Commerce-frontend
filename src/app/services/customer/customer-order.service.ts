import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerOrderService {
  private baseUrl = 'http://localhost:8080/e-commerce/orders';

  constructor(private http: HttpClient) {}

  createOrder(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, {});
  }

  getOrders(page: number, size: number): Observable<any[]> {
    console.log("hi");
    
    return this.http.get<any[]>(`${this.baseUrl}/user?page=${page}&size=${size}`);
  }

}

