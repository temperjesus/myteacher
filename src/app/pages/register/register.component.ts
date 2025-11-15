import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  role: 'estudiante' | 'tutor' = 'estudiante';
  studyLevel = '';
  bio = '';

  loading = false;
  errorMsg = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMsg = '';
    if (!this.name || !this.email || !this.password) {
      this.errorMsg = 'Completa todos los campos obligatorios.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMsg = 'Las contraseñas no coinciden.';
      return;
    }

    this.loading = true;

    this.auth.register({
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
      studyLevel: this.role === 'estudiante' ? this.studyLevel : undefined,
      bio: this.role === 'tutor' ? this.bio : undefined,
    }).subscribe({
      next: res => {
        this.loading = false;
        if (res.user.role === 'tutor') {
          this.router.navigate(['/tutor/dashboard']);
        } else {
          this.router.navigate(['/student/dashboard']);
        }
      },
      error: err => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Error en el registro.';
      }
    });
  }
}
