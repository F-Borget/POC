import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {
  private apiUrl = 'http://localhost:8080/projets';
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = this.tokenSubject.value;

    if (!token) {
      console.warn("❌ Aucun token JWT trouvé !");
      return new HttpHeaders();
    }

    console.log("📢 Token récupéré :", token);

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }


  addProjets(projet: any): Observable<any> {
    const headers = this.getHeaders();

    if (!headers.has('Authorization')) {
      console.error("🔴 Aucun token JWT trouvé !");
      return throwError(() => new Error("Aucun token trouvé"));
    }

    console.log("📢 Envoi de la requête POST /projets avec data :", projet);

    return this.http.post<any>(this.apiUrl, projet, { headers }).pipe(
      tap(response => console.log("✅ Projet ajouté :", response)),
      catchError(error => {
        console.error("❌ Erreur lors de l'ajout du projet :", error);
        return throwError(() => error);
      })
    );
  }

  getProjets(): Observable<any> {
    const headers = this.getHeaders();

    if (!headers.has('Authorization')) {
      console.error("🔴 Aucun token JWT trouvé !");
      return throwError(() => new Error("Aucun token trouvé"));
    }

    console.log("📢 Envoi de la requête GET /projets avec headers :", headers);

    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      tap(response => console.log("✅ Réponse reçue de /projets :", response)),
      catchError(error => {
        console.error("❌ Erreur lors de l'appel API GET /projets :", error);
        return throwError(() => error);
      })
    );
  }

  createProjet(projet: { name: string; managerId: number }): Observable<any> {
    const headers = this.getHeaders();

    if (!headers.has('Authorization')) {
      console.error("🔴 Aucun token JWT trouvé !");
      return throwError(() => new Error("Aucun token trouvé"));
    }

    console.log("📢 Envoi de la requête POST /projets avec data :", projet);

    return this.http.post<any>(this.apiUrl, projet, { headers }).pipe(
      tap(response => console.log("✅ Projet créé :", response)),
      catchError(error => {
        console.error("❌ Erreur lors de l'ajout du projet :", error);
        return throwError(() => error);
      })
    );
  }

  addWorkSession(workSession: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, workSession, { headers: this.getHeaders() });
  }

  // 🔵 Récupérer les sessions de travail
  getWorkSessions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  deleteProjets(id: string): Observable<void> {
    const headers = this.getHeaders();

    if (!headers.has('Authorization')) {
      console.error("🔴 Aucun token JWT trouvé !");
      return throwError(() => new Error("Aucun token trouvé"));
    }

    console.log(`📢 Suppression du projet ID ${id}...`);

    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }).pipe(
      tap(() => console.log(`✅ Projet ID ${id} supprimé avec succès !`)),
      catchError(error => {
        console.error(`❌ Erreur lors de la suppression du projet ID ${id} :`, error);
        return throwError(() => error);
      })
    );
  }
}
