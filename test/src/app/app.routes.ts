import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth/login',
        component: LoginComponent,
    },
    {
        path: '',
        canActivate: [AuthGuard],
        component: MainComponent,
    },
];
