import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email = '';
  password = '';
  role: 'estudiante' | 'tutor' = 'estudiante';

  constructor(private router: Router) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      alert('Ingresa correo y contraseña');
      return;
    }

    // Aquí luego llamaremos al AuthService contra tu API.
    if (this.role === 'tutor') {
      this.router.navigate(['/tutor/dashboard']);
    } else {
      this.router.navigate(['/student/dashboard']);
    }
  }
}
