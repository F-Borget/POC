import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [FormsModule, NgIf], 
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {}

  login() {
    console.log("🔵 Tentative de connexion avec : ", this.username, this.password);

    this.authService.login(this.username, this.password).subscribe(
      response => {
        console.log("🟢 Connexion réussie !");
        this.toastr.success('Connexion réussie !', 'Succès');
        localStorage.setItem('token', response.jwtToken); 
        this.router.navigate(['/calendar']);
      },
      error => {
        console.log("🔴 Connexion échouée !");
        this.toastr.error('Identifiants incorrects', 'Erreur');
      }
    );
  }
}
