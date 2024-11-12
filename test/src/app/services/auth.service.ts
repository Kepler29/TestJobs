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


  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authHttpService: AuthHttpService,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  // public methods
  login(email: string, password: string): Observable<UserType> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(email, password).pipe(
      map((auth: AuthModel) => {
        this.setAuthFromLocalStorage(auth); 
        return auth; 
      }),
      tap((auth: AuthModel) => {
        if (auth && auth.authToken) {
          this.setSession(auth.authToken); 
        }
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(err);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.authLocalStorageToken);
      sessionStorage.removeItem(this.authLocalStorageToken); 
      clearTimeout(this.expirationTimeout);  
      this.router.navigate(['/auth/login'], {
        queryParams: {},
      });
    }
  }


  private setSession(token: string) {
    const decodedToken: any = jwtDecode(token);
    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(decodedToken.exp);

    const expiresIn = expirationDate.getTime() - new Date().getTime();


    this.expirationTimeout = setTimeout(() => {
      this.handleTokenExpired();
    }, expiresIn);
  }

  private handleTokenExpired() {
    this.logout();  
  }

  getUserByToken(): Observable<UserType> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.authHttpService.getUserByToken(auth.authToken).pipe(
      map((user: UserType) => {
        if (user) {
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    if (isPlatformBrowser(this.platformId)) {
      if (auth && auth.authToken) {
        localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
        this.setSession(auth.authToken); 
        return true;
      }
      return false;
    }
    return false;
  }

  getAuthFromLocalStorage(): AuthModel | undefined {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const lsValue = localStorage.getItem(this.authLocalStorageToken);
        if (!lsValue) {
          return undefined;
        }
  
        const authData: AuthModel = JSON.parse(lsValue);
        return authData;
      } catch (error) {
        console.error(error);
        return undefined;
      }
    }
    return undefined; 
  }
  

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    clearTimeout(this.expirationTimeout); 
  }
}
