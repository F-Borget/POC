import { Component, OnInit } from '@angular/core';
import { NgClass, NgIf } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { SidebarService } from "../sidebar.service";
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    NgClass
  ],
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isCollapsed = true;
  user: any = null;
  showLogout: boolean = false;

  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe(
      user => {
        console.log("🟢 Utilisateur connecté :", user);
        this.user = user;
      },
      error => console.error("🔴 Erreur lors de la récupération de l'utilisateur :", error)
    );
  }

  goToProfile() {
    if (this.user) {
      console.log("🟢 Redirection vers le profil...");
      this.router.navigate(['/profile']);
    }
  }

  logout(event: Event) {
    event.stopPropagation();
    this.authService.logout();
    this.user = null;
    console.log("🔴 Déconnecté");
    this.router.navigate(['/login']);
  }

  expandSidebar() {
    this.isCollapsed = false;
    this.sidebarService.toggleSidebar(false);
  }

  collapseSidebar() {
    this.isCollapsed = true;
    this.sidebarService.toggleSidebar(false);
  }
}
