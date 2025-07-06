import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import {SidebarService} from "../sidebar.service";


@Component({
  selector: 'app-pageadmin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './pageadmin.component.html',
  styleUrl: './pageadmin.component.css'
})
export class PageadminComponent implements OnInit {
  userForm: FormGroup;
  accounts: any[] = []; // Liste des comptes récupérés depuis l'API
  isCollapsed = true;
  errorMessage='';

  constructor(private fb: FormBuilder, private userService: UserService, private sidebarService: SidebarService) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstname: ['', [Validators.required, Validators.minLength(1)]],
      lastname: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    this.loadAccounts(); // Charger les comptes au démarrage
    this.sidebarService.isCollapsed$.subscribe(state => {
      this.isCollapsed = state;
    });
  }

  loadAccounts() {
    this.userService.getAccounts().subscribe((data: any) => {
      this.accounts = data;
    });
  }

  addAccount() {
    if (this.userForm.valid) {
      const newAccount = {
        username: this.userForm.value.username,
        password: this.userForm.value.password,
        firstname: this.userForm.value.firstname,
        lastname: this.userForm.value.lastname,
        role: 'ROLE_USER',
        managerId: null
      };
      this.userService.addAccounts(newAccount).subscribe({
        next: (response) => {
          console.log("✅ Réponse du backend :", response);
          this.accounts.push(newAccount);
          this.userForm.reset();
          this.errorMessage = response.message; 
        },
        error: (error) => {
          console.error("❌ Erreur :", error);
          this.errorMessage = `Erreur ${error.status}: ${error.message}`;
        }
      });
    }
  }

  deleteAccount(accountId: string) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) { // Confirmation avant suppression
      this.userService.deleteAccount(accountId).subscribe({
        next: () => {
          this.accounts = this.accounts.filter(acc => acc.id !== accountId);
          console.log(`✅ Compte supprimé : ${accountId}`);
        },
        error: (error) => {
          console.error("❌ Erreur lors de la suppression :", error);
        }
      });
    }
  }

  // Promotion d'un utilisateur (User → Manager / Manager → Admin)
  promoteUser(account: any) {
    let newRole = account.role;
    let newManagerId = account.managerId;

    if (account.role === 'ROLE_MANAGER') { 
      newRole = 'ROLE_ADMIN';
    } else if (account.role === 'ROLE_USER') {
      newManagerId = null;
      newRole = 'ROLE_MANAGER';
    }

    const updatedAccount = { ...account, role: newRole };

    this.userService.updateAccounts(updatedAccount).subscribe(
      (response) => {
        account.role = newRole;
        account.managerId = newManagerId; // Met à jour l'affichage après la réponse du serveur
      },
      (error) => console.error('Erreur promotion:', error)
    );
  }

  // Rétrogradation d'un manager (Admin → Manager / Manager → User)
  demoteUser(account: any) {
    let newRole = account.role;
    let newManagerId = account.managerId;

    if (account.role === 'ROLE_MANAGER') {
      newRole = 'ROLE_USER';
      newManagerId = null;
    } else if (account.role === 'ROLE_ADMIN') {
      newRole = 'ROLE_MANAGER';
    }

    const updatedAccount = { ...account, role: newRole, managerId: newManagerId };

    this.userService.updateAccounts(updatedAccount).subscribe(
      (response) => {
        account.role = newRole;
        account.managerId = newManagerId;
      },
      (error) => console.error('Erreur rétrogradation:', error)
    );
  }


  //Liste des managers disponibles
  getAvailableManagers() {
    return this.accounts.filter(account => account.role === 'ROLE_MANAGER');
  }

  onManagerChange(event: any, account: any) {
    const newManagerId = event.target.value;

    console.log(`📢 Changement du manager pour ${account.username} -> Nouveau manager ID: ${newManagerId}`);

    // Mise à jour de l'utilisateur avec le nouveau manager
    const updatedAccount = { ...account, managerId: newManagerId || null };

    this.userService.updateAccounts(updatedAccount).subscribe({
      next: () => {
        console.log("✅ Manager mis à jour avec succès !");
        this.loadAccounts(); // Recharge les utilisateurs pour voir le changement
      },
      error: (err) => console.error("❌ Erreur lors de la mise à jour du manager :", err)
    });
  }

}
