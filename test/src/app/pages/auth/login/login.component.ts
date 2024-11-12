import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable, first } from 'rxjs'
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  schemas: [NO_ERRORS_SCHEMA]
})
export class LoginComponent {

  defaultAuth: any = {
    email: '',
    password: '',
  };
  message: string = '';
  loginForm!: FormGroup;
  hasError: boolean | undefined;
  returnUrl: string | undefined;
  isLoading$: Observable<boolean>;


  private unsubscribe: Subscription[] = []; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isLoading$ = this.authService.isLoading$;

    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
  }


  get f() {
    //@ts-ignore
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        this.defaultAuth.email,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320),
        ]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  submit(event: Event) {
    if (this.loginForm.valid) {
      event.preventDefault();
      console.log('se entra');
      this.hasError = false;
      const loginSubscr = this.authService
        .login(this.f['email'].value, this.f['password'].value)
        .pipe(first())
        .subscribe((user: any | undefined) => {
          //@ts-ignore
          if (user.error) {
            //@ts-ignore
            this.message =  user.error.message
            this.hasError = true;
          } else {
            this.router.navigate([this.returnUrl]);
          }
        });
      this.unsubscribe.push(loginSubscr);
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
