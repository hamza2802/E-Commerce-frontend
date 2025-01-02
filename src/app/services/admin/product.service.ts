import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = 'http://localhost:8080/e-commerce/products';
    private apiUrl1 = 'http://localhost:8080/e-commerce/products/add';

    constructor(private http: HttpClient) {}

    getProducts(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    addProduct(product: any): Observable<any> {
        console.log(product);  // Log the formData for debugging
        
        return this.http.post<any>(this.apiUrl1, product);
    }

    updateProduct(product: any): Observable<any> {
      console.log(product);
      
      return this.http.put<any>(`${this.apiUrl}/${product.productId}`, product);  // Correct API call with product ID
  }
  
  
}
