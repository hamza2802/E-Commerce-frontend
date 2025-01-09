import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http'; 
import { BehaviorSubject, Observable, of } from 'rxjs'; 
import { tap, catchError } from 'rxjs/operators'; 
 
@Injectable({ 
  providedIn: 'root', 
}) 
export class CartService { 
  private baseUrl = 'http://localhost:8080/e-commerce/cart'; 
  private cartItems: any[] = [];  // Always initialized as an array 
  private cartItemCountSubject = new BehaviorSubject<number>(0); 
 
  productDetails :any = ''; 
 
  constructor(private http: HttpClient) { }  
 
  // Fetch cart items from the backend 
  getCartItems(): Observable<any[]> { 
    return this.http.get<any>(this.baseUrl).pipe( 
      tap((response) => { 
        console.log('Fetched cart items from backend:', response); // Log to verify the response 
   
        // Extract cartItems from the response object 
        if (response && Array.isArray(response.cartItems)) { 
          this.cartItems = response.cartItems; // Use cartItems directly 
          this.cartItemCountSubject.next(this.cartItems.length);  // Update the count 
        } else { 
          console.error('Cart items are not an array:', response.cartItems); 
          this.cartItems = []; // Fallback to empty array 
        } 
      }), 
      catchError((error) => { 
        console.error('Error fetching cart items', error); 
        return of([]); // Return an empty array in case of error 
      }) 
    ); 
  } 
   
   
 
 
  // Add product to cart or update quantity if it already exists 
  addToCart(product: any): Observable<any> { 
    this.productDetails = product; 
    console.log(this.productDetails); 
     
    console.log('Product to add:', product); 
    console.log(product.stock); 
   
    if (product.stock < 1) { 
      console.log(product.stock); 
       
      console.error('Cannot add product to cart: Out of stock.'); 
      return of(); // Return an empty observable to block further processing 
    } 
   
    const existingCartItem = this.cartItems.find( 
      (item) => Number(item.productId) === Number(product.productId) 
    ); 
   
    console.log('Existing cart item:', existingCartItem); 
   
    if (existingCartItem) { 
      return this.updateCartItemQuantity(existingCartItem.cartItemId, existingCartItem.quantity + 1); 
    } else { 
      const cartItem = { productId: product.productId, quantity: 1 }; 
      return this.http.post<any>(`${this.baseUrl}/add`, cartItem).pipe( 
        tap((newCartItem) => { 
          this.cartItems.push(newCartItem); 
          this.cartItemCountSubject.next(this.cartItems.length); 
        }), 
        catchError((error) => { 
          console.error('Error adding product to cart', error); 
          throw error; 
        }) 
      ); 
    } 
  } 
   
   
 
  // Update the quantity of a product in the cart 
  // Update the quantity of a product in the cart 
updateCartItemQuantity(cartItemId: number, quantity: number): Observable<void> { 
  console.log('Requested Quantity:', quantity, 'Available Stock:', this.productDetails.stock, 'Cart Item ID:', cartItemId); 
 
  // Validate if the quantity exceeds the available stock 
  if (quantity > this.productDetails.stock) { 
    alert('Cannot update cart: Requested quantity exceeds available stock.'); 
    return of(); // Return an empty observable to prevent further processing 
  } 
 
  // Proceed with the update if quantity is within stock 
  return this.http.put<void>(`${this.baseUrl}/update/${cartItemId}`, quantity).pipe( 
    catchError((error) => { 
      console.error('Error updating cart item quantity', error); 
      throw error; 
    }) 
  ); 
} 
 
   
 
  // Remove a product from the cart 
  removeCartItem(cartItemId: number): Observable<void> { 
    return this.http.delete<void>(`${this.baseUrl}/remove/${cartItemId}`).pipe( 
      catchError((error) => { 
        console.error('Error removing cart item', error); 
        throw error; 
      }) 
    ); 
  } 
 
  // Get the count of items in the cart 
  getCartItemCount(): Observable<number> { 
    return this.cartItemCountSubject.asObservable();
  } 
 
  // Clear the cart 
  clearCart(): Observable<void> { 
    return this.http.delete<void>(`${this.baseUrl}/clear`).pipe( 
      catchError((error) => { 
        console.error('Error clearing the cart', error); 
        throw error; 
      }) 
    ); 
  } 
}