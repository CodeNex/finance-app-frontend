import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ImprintComponent } from './pages/imprint/imprint.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'homeComponent', component: HomeComponent,
    children: [
      {path: ''}
    ]
   },
  { path: 'imprintComponent', component: ImprintComponent },
];
