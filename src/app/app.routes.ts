import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: 'auth/login',
        loadComponent: () =>
            import('./features/auth/login.component').then(
                (m)=> m.LoginComponent
            )
    },
    {
        path: 'auth/register',
        loadComponent: () =>
        import('./features/auth/register.component').then(
            (m) => m.RegisterPageComponent
        ),
    },
    {
        path: '',
        loadComponent: () =>
        import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
        ),
    },
    {
        path: '**',
        redirectTo: '',
    },
];
