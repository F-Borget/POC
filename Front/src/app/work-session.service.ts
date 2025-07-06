import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkSessionService {
  private apiUrl = 'http://localhost:8080/work-sessions';

  constructor(private http: HttpClient) {}

  getWorkSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/me`, {
      headers: this.getHeaders()
    });
  }

  addWorkSession(session: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, session, {
      headers: this.getHeaders()
    });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getWorkSessionsByUser(selectedUser: number): Observable<any[]> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    const newUrl = `http://localhost:8080/work-sessions/user/${selectedUser}`;

    console.log("📢 Récupération des sessions de travail pour l'utilisateur :", selectedUser);

    return this.http.get<any[]>(newUrl, { headers });
  }
}
