import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isCollapsed = new BehaviorSubject<boolean>(true);
  isCollapsed$ = this.isCollapsed.asObservable();

  toggleSidebar(state: boolean) {
    this.isCollapsed.next(state);
  }
}
