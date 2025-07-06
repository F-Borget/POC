import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/register';

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<any[]> {
    const token = localStorage.getItem('token');
    console.log("📢 Token envoyé :", token);

    let newurl = `${this.apiUrl}/accounts`;
    console.log(newurl);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any[]>(newurl, { headers });
  }

  addAccounts(account: any): Observable<any> {
    const token = localStorage.getItem('token');
    console.log("📢 Token envoyé :", token);

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    return this.http.post<any>(this.apiUrl, account, { headers });
  }

  deleteAccount(id: string): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const newUrl = `${this.apiUrl}/accounts/${id}`;

    console.log("📢 Suppression de l'utilisateur :", newUrl);

    return this.http.delete<void>(newUrl, { headers });
  }

  updateAccounts(account: any): Observable<any> {
    const token = localStorage.getItem('token');
    console.log("📢 Token envoyé :", token);

    const newUrl = `${this.apiUrl}/accounts/${account.id}`;
    console.log(newUrl);

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    return this.http.put(newUrl, account, { headers });
  }

  getManagedUsers(): Observable<any[]> {
    const token = localStorage.getItem('token');
    console.log("📢 Token envoyé pour récupérer les utilisateurs gérés :", token);

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    const newUrl = `${this.apiUrl}/accounts/managed-users`;

    console.log("📢 Récupération des utilisateurs gérés depuis :", newUrl);

    return this.http.get<any[]>(newUrl, { headers });
  }
}
