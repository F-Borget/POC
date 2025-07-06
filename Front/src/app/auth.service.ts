import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';

interface LoginResponse {
  jwtToken: string;
}

interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    const credentials = { username, password };

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
        tap(response => {
          console.log("📢 Token reçu après connexion :", response.jwtToken);
          localStorage.setItem('token', response.jwtToken);
          this.loadUserData();
        })
    );
  }

  loadUserData() {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("🔴 Aucun token JWT trouvé !");
      return;
    }

    console.log("🟢 Token envoyé :", token);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any>('http://localhost:8080/me', { headers }).subscribe(
        user => {
          console.log("🟢 Données utilisateur chargées :", user);
          this.userSubject.next(user);
        },
        error => console.error("🔴 Erreur lors de la récupération de l'utilisateur :", error)
    );
  }

  getUser(): Observable<any> {
    return this.userSubject.asObservable();
  }

  logout() {
    console.log("🔴 Déconnexion...");
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }
}
