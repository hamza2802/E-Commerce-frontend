import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class SearchservicesService {

  private searchQuerySubject = new BehaviorSubject<string>('');
  
  constructor(private productService: ProductService) { }

  updateSearchQuery(query: string): void {
    this.searchQuerySubject.next(query);
  }

  getSearchQuery(): Observable<string> {
    return this.searchQuerySubject.asObservable();
  }

  searchProducts(query: string): Observable<any[]> {
    return this.productService.getAllProducts().pipe(
      map(products => {
        const searchQuery = query.toLowerCase();
        return products.filter(product => {
          const productName = product?.productName || '';
          const category = product?.category || '';
          return productName.toLowerCase().includes(searchQuery) ||
                 category.toLowerCase().includes(searchQuery);
        });
      })
    );
  }
}
