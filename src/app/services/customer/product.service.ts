import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:8080/e-commerce/products/active'; // Replace with your API endpoint

  constructor(private http: HttpClient) { }

  // Method to fetch mobile phones from the backend
  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl); // Adjust based on your API response
  }
}
