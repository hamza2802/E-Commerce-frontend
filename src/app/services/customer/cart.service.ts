import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = 'http://localhost:8080/e-commerce/cart';
  private cartItems: any[] = [];
  private cartItemCountSubject = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  getCartItems(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      tap((items) => {
        this.cartItems = items;
        this.cartItemCountSubject.next(this.cartItems.length);
      })
    );
  }
  

  addToCart(product: any): Observable<any> {
    const cartItem = { productId: product.productId, quantity: 1 }; // Replace `id` with the correct product ID property
    return this.http.post(`${this.baseUrl}/add`, cartItem).pipe(
      tap(() => this.cartItemCountSubject.next(this.cartItems.length + 1))
    );
  }

  updateCartItemQuantity(cartItemId: number, quantity: number): Observable<void> {
    console.log("ello");
    
    console.log(cartItemId);
    
    return this.http.put<void>(`${this.baseUrl}/update/${cartItemId}`, quantity);
  }

  removeCartItem(cartItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove/${cartItemId}`);
  }

  getCartItemCount(): Observable<number> {
    return this.cartItemCountSubject.asObservable();
  }
}
