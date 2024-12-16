import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../model/interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authUrl = "http://localhost:5001/api/auth"
  loggedIn = new BehaviorSubject<boolean>(false)

  constructor(private http: HttpClient, private router: Router) { }

  login(userData: IUser){
    return this.http.post(`${this.authUrl}/login`, userData)
  }

  register(userData: IUser){
    return this.http.post(`${this.authUrl}/register`, userData)
  }

  isLoggedIn(){
    return this.loggedIn.asObservable()
  }

  logout(){
    this.loggedIn.next(false)
    localStorage.removeItem('token')
    this.router.navigate(['/login'])
  }
}
