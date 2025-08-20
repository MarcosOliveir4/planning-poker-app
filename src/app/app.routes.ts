import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'new-session', pathMatch: 'full' },
  {
    path: 'new-session',
    loadComponent: () =>
      import('./pages/new-session').then((m) => m.NewSession),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
