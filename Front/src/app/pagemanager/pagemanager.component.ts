import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { ProjetService } from '../projet.service';

interface Account {
  id: string;
  username: string;
  role: string;
  managerId?: string;
}

@Component({
  selector: 'app-page-manager',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './pagemanager.component.html',
  styleUrl: './pagemanager.component.css'
})
export class PagemanagerComponent implements OnInit {
  projectForm: FormGroup;
  accounts: Account[] = [];
  managers: Account[] = [];
  projects: any[] = [];
  managerId: string = '123'; // Implémentation future

  constructor(private fb: FormBuilder, private userService: UserService, private projetService: ProjetService) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
    this.loadProjects();
  }

  loadAccounts() {
    this.userService.getAccounts().subscribe((data: Account[]) => {
      this.accounts = data.filter((acc: Account) => acc.role === 'ROLE_USER');
      this.managers = data.filter((acc: Account) => acc.role === 'ROLE_MANAGER');
    });
  }

  loadProjects() {
    this.projetService.getProjets().subscribe((data: any) => {
      this.projects = data;
    });
  }

  addProject() {
    if (this.projectForm.valid) {
      const newProject = {
        name: this.projectForm.value.name,
        managerId: this.managerId
      };
      this.projetService.addProjets(newProject).subscribe({
        next: (addedProject) => {
          this.projects.push(addedProject);
          this.projectForm.reset();
        },
        error: (error) => {
          console.error("Erreur lors de l'ajout du projet:", error);
        }
      });
    }
  }

  deleteProject(id: string) {
    this.projetService.deleteProjets(id).subscribe(() => {
      this.projects = this.projects.filter(project => project.id !== id);
    }, error => {
      console.error("Erreur lors de la suppression du projet:", error);
    });
  }

  assignManager(event: any, account: Account) {
    const newManagerId = event.target.value ? event.target.value : null;
    account.managerId = newManagerId;

    this.userService.updateAccounts(account).subscribe(
      (updatedAccount) => {},
      (error) => {
        console.error('Erreur lors de la mise à jour du manager:', error);
      }
    );
  }
}
