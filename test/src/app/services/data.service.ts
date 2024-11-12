import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthModel } from '../models/auth.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserModel } from '../models/user.model';
import { AuthService } from './auth.service';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  auth:any;
  headers:any;

  constructor(private http: HttpClient,
    private authService: AuthService) {
    this.auth = this.authService.getAuthFromLocalStorage();
    this.headers = new HttpHeaders({
    'Authorization': 'Bearer ' + this.auth.token,
    });
    }

  // public methods
  import(params: FormData): Observable<any> {
    console.log(params)
    return this.http.post<any>(`${API_URL}/file/import`, params, { headers: this.headers});
  }

  show(): Observable<any> {
    return this.http.get<any>(`${API_URL}/file/show`, { headers: this.headers});
  }

}
