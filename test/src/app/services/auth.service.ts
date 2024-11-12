import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize, tap } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { Router } from '@angular/router';
import { AuthHttpService } from './auth-http.service'
import { AuthModel } from '../models/auth.model';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private unsubscribe: Subscription[] = []; 
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  private expirationTimeout: any; 


  currentUser$: Observable<any>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): any | null {
    return this.currentUserSubject ? this.currentUserSubject.value : null;
  }

  set currentUserValue(user: any) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private authHttpService: AuthHttpService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  // public methods
  login(email: string, password: string): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(email, password).pipe(
      map((auth: any) => {
        const result = this.setAuthFromLocalStorage(auth);
        return result;
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.authLocalStorageToken);
    }
    window.location.replace('/auth/login')
  }

  getUserByToken(): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.token) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.authHttpService.getUserByToken(auth.token).pipe(
      map((data: any) => {
        if (data.user) {
          this.currentUserSubject.next(data.user);
        } else {
          this.logout();
        }
        return data.user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  findToken(token: string): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.findToken(token).pipe(
        map((auth: any) => {
          const result = this.setAuthFromLocalStorage(auth);
          return result;
        }),
        switchMap(() => this.getUserByToken()),
        catchError((err) => {
          console.error('err', err);
          return of(undefined);
        }),
        finalize(() => this.isLoadingSubject.next(false))
    );
  }

  private setAuthFromLocalStorage(auth: any): boolean {
    if (auth && auth.token) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  public getAuthFromLocalStorage(): any | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
