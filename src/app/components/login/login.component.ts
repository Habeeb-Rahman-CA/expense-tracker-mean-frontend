import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule} from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,MatCardModule,MatFormFieldModule, FormsModule, MatButtonModule, MatInputModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  authService = inject(AuthService)
  loginForm: FormGroup;
  router = inject(Router)

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login({email, password}).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          alert('Login Successful!');
          this.router.navigate(['/dashboard'])
        },
        error: (err) => {
          alert("Login failed")
          console.error('Login failed:', err);
        }
      });
    }
  }

}
