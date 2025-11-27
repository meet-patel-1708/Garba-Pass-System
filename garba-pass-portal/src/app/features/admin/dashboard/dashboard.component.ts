import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from '../../../core/auth/auth.service';
import { PassService } from '../../../services/pass.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  stats = {
    total: 0,
    sold: 0,
    active: 0,
    blocked: 0
  }

  animatedStats = {
    total: 0,
    sold: 0,
    active: 0,
    blocked: 0
  }

  identityCardNumber: string = '';
  isLoading = false;
  isMenuOpen = false;

  constructor(private passService: PassService) {}

  ngOnInit() {
    console.log('Dashboard ngOnInit called');
    
    this.identityCardNumber = this.route.snapshot.paramMap.get('identityCardNumber') || '';
    console.log('From route param:', this.identityCardNumber);
    
    if (!this.identityCardNumber) {
      this.identityCardNumber = localStorage.getItem('identityCardNumber') || '';
      console.log('From localStorage:', this.identityCardNumber);
    }

    if (this.identityCardNumber) {
      console.log('Fetching total passes for:', this.identityCardNumber);
      this.getTotalPass();
      this.getTotalSoldPass();
    } else {
      console.error('❌ Identity card number not found!');
    }
  }

  getTotalPass() {
    this.isLoading = true;
    const adharNumber = Number(this.identityCardNumber);
    
    console.log('Calling API with Adhar Number:', adharNumber);
    
    this.passService.countTotalPasses(adharNumber).subscribe({
      next: (total) => {
        console.log('✅ API Response - Total passes:', total);
        this.stats.total = total;
        
        this.animateStats();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error fetching total passes:', err);
        this.isLoading = false;
        
        if (err.status === 404) {
          alert('API endpoint not found. Please check backend.');
        } else if (err.status === 0) {
          alert('Cannot connect to server. Is the backend running?');
        }
      }
    });
  }

  getTotalSoldPass() {
    const adharNumber = Number(this.identityCardNumber);
    console.log('Calling API for sold passes with Adhar Number:', adharNumber);
    
    this.passService.countTotalSoldPass(adharNumber).subscribe({
      next: (total) => {
        console.log('✅ API Response - Sold passes:', total);
        this.stats.sold = total;
        this.animateStats();
      },
      error: (err) => {
        console.error('❌ Error fetching sold passes:', err);
        
        if (err.status === 404) {
          alert('API endpoint not found. Please check backend.');
        } else if (err.status === 0) {
          alert('Cannot connect to server. Is the backend running?');
        }
      }
    });
  }

  animateStats() {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = this.easeOutCubic(currentStep / steps);

      this.animatedStats = {
        total: Math.floor(this.stats.total * progress),
        sold: Math.floor(this.stats.sold * progress),
        active: Math.floor(this.stats.active * progress),
        blocked: Math.floor(this.stats.blocked * progress)
      };

      if (currentStep >= steps) {
        clearInterval(interval);
        this.animatedStats = { ...this.stats };
      }
    }, stepDuration);
  }

  easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}