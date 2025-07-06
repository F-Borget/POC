import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ProjetService } from '../projet.service';
import { WorkSessionService } from '../work-session.service';
import { UserService } from '../user.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-gestionmanager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './gestionmanager.component.html',
  styleUrl: './gestionmanager.component.css'
})
export class GestionmanagerComponent implements OnInit {
  selectedDate: Date | null = new Date();
  isPopupOpen: boolean = false;
  projets: Array<{ id: number; name: string; color: string }> = [];
  tasks: Array<{ startHour: number; endHour: number; projetId: number; color: string; date: Date }> = [];
  hours: number[] = Array.from({ length: 14 }, (_, i) => i + 7);

  selectedProject: number | null = null;
  startHour: number | null = null;
  endHour: number | null = null;

  selectedUser: number | null = null; // Utilisateur sélectionné
  managedUsers: any[] = []; // Liste des utilisateurs gérés

  constructor(
    private projetService: ProjetService,
    private workSessionService: WorkSessionService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadManagedUsers();
  }

  /** Charge les utilisateurs gérés par le manager */
  loadManagedUsers() {
    this.userService.getManagedUsers().subscribe({
      next: (users) => {
        this.managedUsers = users;
        if (users.length > 0) {
          this.selectedUser = users[0].id;
          this.loadProjets();
        }
      },
      error: (err) => console.warn('❌ Erreur lors de la récupération des utilisateurs gérés:', err)
    });
  }

  /** Chargement des projets */
  loadProjets() {
    this.projetService.getProjets().subscribe({
      next: (data) => {
        this.projets = data ?? [];
        this.loadWorkSessions();
      },
      error: (err) => console.warn('❌ Erreur lors de la récupération des projets:', err)
    });
  }

  /** Chargement des sessions de travail pour l'utilisateur sélectionné */
  loadWorkSessions() {
    if (!this.selectedUser) return;

    this.workSessionService.getWorkSessionsByUser(this.selectedUser).subscribe({
      next: (data) => {
        this.tasks = data.map(session => ({
          startHour: Number(session.startHour.split(':')[0]),
          endHour: Number(session.endHour.split(':')[0]),
          projetId: session.projet.id,
          color: this.getProjectColor(session.projet.id),
          date: new Date(session.date)
        }));
      },
      error: (err) => console.warn('❌ Erreur lors de la récupération des sessions:', err)
    });
  }

  /** Mise à jour de l'affichage en fonction de l'utilisateur sélectionné */
  onUserSelect() {
    console.log("📢 Utilisateur sélectionné :", this.selectedUser);
    this.loadWorkSessions();
  }

  getProjectColor(projetId: number): string {
    const projet = this.projets.find(p => p.id === projetId);
    return projet ? projet.color : '#ccc';
  }

  getTasksAtHour(hour: number) {
    return this.tasks.filter(task =>
      task.startHour <= hour && task.endHour > hour && this.isSameDate(task.date, this.selectedDate)
    );
  }

  isSameDate(date1: Date | null, date2: Date | null): boolean {
    if (!date1 || !date2) return false;
    return date1.toDateString() === date2.toDateString();
  }

  onDateSelect(event: Date | null) {
    this.selectedDate = event || new Date();
    this.loadWorkSessions();
  }

  getProjectName(projetId: number): string {
    const projet = this.projets.find(p => p.id === projetId);
    return projet ? projet.name : 'Projet inconnu';
  }

  openPopup() {
    this.isPopupOpen = true;
  }

  saveTask() {
    if (!this.selectedProject || !this.startHour || !this.endHour || this.startHour >= this.endHour) {
      console.warn("❌ Veuillez sélectionner un projet et des heures valides !");
      return;
    }

    const formattedStartHour = this.formatTime(this.startHour);
    const formattedEndHour = this.formatTime(this.endHour);

    const workSession = {
      projet: { id: this.selectedProject },
      date: this.selectedDate?.toLocaleDateString('fr-CA'), // YYYY-MM-DD
      startHour: formattedStartHour,
      endHour: formattedEndHour
    };

    console.log("📢 Envoi de la session :", workSession);

    this.workSessionService.addWorkSession(workSession).subscribe({
      next: () => {
        console.log("✅ Session de travail enregistrée !");
        this.closePopup();
        this.loadWorkSessions();
      },
      error: (err) => console.error("❌ Erreur lors de l'ajout :", err)
    });
  }

  /** Formatte l'heure en HH:mm:ss */
  formatTime(hour: number): string {
    return hour.toString().padStart(2, '0') + ":00:00";
  }

  closePopup() {
    this.isPopupOpen = false;
  }

  /** Génération PDF */
  exportMonthlyPDF() {
    const pdf = new jsPDF();
    const dateRef = this.selectedDate ?? new Date();

    pdf.setFontSize(18);
    pdf.text(
      `Récapitulatif du mois - ${dateRef.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}`,
      14, 20
    );

    const sessionsByDay: { [key: string]: any[] } = {};
    this.tasks.forEach(task => {
      const day = this.formatDate(task.date);
      if (!sessionsByDay[day]) sessionsByDay[day] = [];
      sessionsByDay[day].push(task);
    });

    const tableData: any[] = [];
    Object.keys(sessionsByDay).sort().forEach(day => {
      sessionsByDay[day].forEach(task => {
        tableData.push([
          new Date(day).toLocaleDateString('fr-FR'),
          this.getProjectName(task.projetId),
          `${task.startHour}:00 - ${task.endHour}:00`
        ]);
      });
    });

    autoTable(pdf, {
      head: [['Date', 'Projet', 'Plage horaire']],
      body: tableData,
      startY: 30
    });

    pdf.save(`recapitulatif_${dateRef.getMonth() + 1}_${dateRef.getFullYear()}.pdf`);
  }

  private formatDate(date: Date): string {
    if (!date) return '';

    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().split('T')[0]; // Récupère uniquement la partie YYYY-MM-DD
  }
}
