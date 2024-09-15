import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ReaderComponent } from './pages/reader/reader.component';

export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
    }, 
    {
        path: 'reader', 
        component: ReaderComponent,
    }, 
    {
        path: '**', 
        redirectTo: '/home',
        pathMatch: 'full',
    }, 
];
