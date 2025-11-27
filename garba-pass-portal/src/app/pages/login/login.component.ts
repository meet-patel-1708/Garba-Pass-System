import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  auth = inject(AuthService);
  router = inject(Router);

  mobileNumber = '';
  identityCardNumber = '';
  errorMsg = '';
  isLoading = false;

  onLogin() {
    this.errorMsg = '';
    this.isLoading = true;
    if (!this.mobileNumber || this.mobileNumber.length !== 10) {
      this.errorMsg = 'Please enter a valid 10-digit mobile number';
      return;
    }

    // Validate Aadhar number
    if (!this.identityCardNumber || this.identityCardNumber.length !== 12) {
      this.errorMsg = 'Please enter a valid 12-digit Aadhar card number';
      return;
    }

    // Start loading
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      // Simulate success
      console.log('Login attempt:', {
        mobile: this.mobileNumber,
        aadhar: this.identityCardNumber
      });
      // Or simulate error
      // this.errorMsg = 'Invalid credentials. Please try again.';
    }, 2000);

    
    this.auth.login({ 
    phone: this.mobileNumber, 
    identityCardNumber: this.identityCardNumber 
  }).subscribe({
    next: (res) => {
      console.log('login response:', res);
      
      this.auth.saveToken(res.token);
      localStorage.setItem('userRole', res.role);
      localStorage.setItem('userId', res.userID);
      localStorage.setItem('identityCardNumber', this.identityCardNumber); // ← Save it
      
      console.log('Saved to localStorage:', {
        role: res.role,
        userId: res.userID,
        identityCardNumber: this.identityCardNumber
      });
      
      if (res.role === 'ADMIN') {
        this.router.navigate(['/dashboard', this.identityCardNumber]);
      } else if (res.role === 'ORGANIZER') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/home']);
      }
      
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Login error:', err);
      this.errorMsg = err?.error?.message || 'Invalid Phone or Aadhaar Number!';
      this.isLoading = false;
    }
  });
}
}