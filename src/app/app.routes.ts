import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

    {
        path: 'auth/login',
        canActivate: [guestGuard],
        loadComponent: () =>
            import('./features/auth/login.component').then(
                (m)=> m.LoginComponent
            )
    },
    {
        path: 'auth/register',
        canActivate: [guestGuard],
        loadComponent: () =>
        import('./features/auth/register.component').then(
            (m) => m.RegisterPageComponent
        ),
    },
    {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
    ],
  },{
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'projects/:projectId',
        loadComponent: () =>
          import('./features/projects/project-home.component').then(
            (m) => m.ProjectHomeComponent
          ),
      },
    ],
  },
    {
        path: '**',
        redirectTo: '',
    },
];
