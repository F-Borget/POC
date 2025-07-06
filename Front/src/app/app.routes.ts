import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CalendarComponent } from './calendar/calendar.component';
import {PageadminComponent} from './pageadmin/pageadmin.component'
import {PagemanagerComponent} from './pagemanager/pagemanager.component'
import {SidebarComponent} from "./sidebar/sidebar.component";
import {AuthGuard} from "./auth.guard";
import { GestionmanagerComponent } from './gestionmanager/gestionmanager.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: 'pageadmin', component: PageadminComponent },
  { path: 'pagemanager', component: PagemanagerComponent },
  { path: 'gestionmanager', component: GestionmanagerComponent },
  { path: 'sidebar', component: SidebarComponent },
  { path: '**', redirectTo: '/login' }
];
