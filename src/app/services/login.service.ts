import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = 'http://localhost:8080/e-commerce/login'; // Replace with your Spring Boot endpoint

  constructor(private http: HttpClient) {}

  signIn(signInData: any): Observable<any> {
    console.log("Hello");
    console.log(signInData);
    return this.http.post(this.baseUrl, signInData);
  }
}
