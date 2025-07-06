import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService{
  private baseUrl = 'http://localhost:8080/api/day';

  constructor(private http: HttpClient) {}

  getCalendar(username: string): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + "/user/" + username);
  }

    saveHours(day: any): Observable<any> {
      console.log('Données envoyées:', day);
    return this.http.post<any>(this.baseUrl, day);
  }

}
