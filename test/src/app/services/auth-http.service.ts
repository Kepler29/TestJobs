import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthModel } from '../models/auth.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserModel } from '../models/user.model';

const API_USERS_URL = `${environment.apiUrl}/auth`;
const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {

  constructor(private http: HttpClient) {}

  // public methods
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${API_URL}/auth/login`, {
      email,
      password,
    });
  }

  findToken(token: string): Observable<any> {
    return this.http.post<any>(`${API_URL}/password/find/token`, {
      token
    });
  }

  getUserByToken(token: string): Observable<UserModel> {
    const httpHeaders = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });
    return this.http.get<any>(`${API_URL}/auth/me`, {
      headers: httpHeaders,
    });
  }
}
