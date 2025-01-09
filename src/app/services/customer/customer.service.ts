import { Injectable } from '@angular/core';  
import { HttpClient, HttpHeaders } from '@angular/common/http';  
import { BehaviorSubject, Observable } from 'rxjs';  
  
@Injectable({  
  providedIn: 'root',  
})  
export class CustomerService {  
  private apiUrl = 'http://localhost:8080/e-commerce/customers/details'; // Replace with your backend URL  
  private loggedInUserSubject = new BehaviorSubject<any | null>(null); // Store logged-in user details  
  
  private apiUrl1 = 'http://localhost:8080/e-commerce/customers/edit'  
  
  constructor(private http: HttpClient) {}  
  
  // Fetch logged-in user's details  
  getLoggedInUser() {  
    return this.http.get<any>(this.apiUrl);  
  }  
  
  // Store logged-in user details  
  setLoggedInUser(user: any) {  
    this.loggedInUserSubject.next(user);  
  }  
  
  // Get logged-in user details as observable  
  getUserDetails() {  
    return this.loggedInUserSubject.asObservable();  
  }  
  
  saveCustomerDetails(customer: any): Observable<any> {  
    return this.http.put<any>(this.apiUrl1, customer);  
  }  
  
  getCustomerDetails(): Observable<any> {  
    return this.http.get<any>(`${this.apiUrl}`);  
  }  

 

  
}

