import { Component } from '@angular/core';
import {RouterOutlet, RouterModule, Router} from "@angular/router";
import { CalendarComponent } from './calendar/calendar.component';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import {PageadminComponent} from './pageadmin/pageadmin.component'
import { ReactiveFormsModule } from '@angular/forms';
import {SidebarComponent} from "./sidebar/sidebar.component";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    CalendarComponent,
    LoginComponent,
    PageadminComponent,
    ReactiveFormsModule,
    SidebarComponent,
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';

  hideSidebar = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const pagesSansSidebar = ['/login', '/loginadmin'];
      this.hideSidebar = pagesSansSidebar.includes(this.router.url);
    });
  }
}
