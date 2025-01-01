import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private baseUrl = '/http://localhost:8080/e-commerce/users/getuser'; // Update this URL to match your API endpoint

  constructor(private http: HttpClient) {}

  /**
   * Fetches paginated customers from the backend.
   * @param page The current page number (0-indexed).
   * @param size The number of customers per page.
   * @returns Observable of the paginated customer response.
   */
  getCustomers(page: number, size: number): Observable<any> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(this.baseUrl, { params });
  }
}
