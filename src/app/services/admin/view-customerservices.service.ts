import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';



export interface CustomerDetails {
  email: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  city: string;
  state?: string;  // Use ? if the property is optional
  address?: string; // Use ? if the property is optional
  pincode?: string;
}

@Injectable({
  providedIn: 'root'
})


export class ViewCustomerservicesService {
  private apiUrl = 'http://localhost:8080/e-commerce/customers/all'; 

  constructor(private http: HttpClient) {}

  
// BehaviorSubject to hold and share total customer count 
private totalCustomersSubject = new BehaviorSubject<number>(0); 
   
// Observable for components to subscribe to 
totalCustomers$ = this.totalCustomersSubject.asObservable();
setTotalCustomers(count: number): void { 
  this.totalCustomersSubject.next(count); 
}

  getCustomers(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`);
  }
}