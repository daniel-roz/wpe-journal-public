import { Routes } from '@angular/router';
import { Category } from './category';
import { Home } from './home';
import { Journal } from './journal';

export const routes: Routes = [
  { path: '', component: Home },
  { path: ':category', component: Category },
  { path: ':category/:id', component: Journal },
  { path: '**', redirectTo: '' },
];
