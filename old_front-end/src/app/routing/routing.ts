import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { HomeComponent } from '../components/home/home.component';
import { LoginComponent } from '../components/login/login.component';


const appRoutes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
    { path: 'login', component: LoginComponent},

    // otherwise redirect to home
    { path: '**', redirectTo: '/login' }
];

export const Routing = RouterModule.forRoot(appRoutes);