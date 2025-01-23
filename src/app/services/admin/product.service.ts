import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = 'http://localhost:8080/e-commerce/products';
    private apiUrl1 = 'http://localhost:8080/e-commerce/products/add';
    private apiUrl2 = 'http://localhost:8080/e-commerce/products/active';
    private apiUrl3 ='http://localhost:8080/e-commerce/products/uploadProductCSV'; // For uploading CSV file
   private apiUrl4 = 'http://localhost:8080/e-commerce/products/uploadProductImageCSV'; // For uploading images from CSV file

    constructor(private http: HttpClient) {}

    getProducts(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl2);
    }

    addProduct(product: any): Observable<any> {
        console.log(product);  // Log the formData for debugging
        
        return this.http.post<any>(this.apiUrl1, product);
    }

    updateProduct(product: any): Observable<any> {
      console.log(product);
      
      return this.http.put<any>(`${this.apiUrl}/${product.productId}`, product);  // Correct API call with product ID
  }
  
  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`);
}

uploadProductsCSV(formData: FormData) { 
    return this.http.post(`${this.apiUrl3}`, formData); 
  }

  uploadImagesFromCsv(productId: number, formData: FormData): Observable<any> {
    const url = `${this.apiUrl4}?productId=${productId}`; 
    return this.http.post(url, formData); 
  }
}