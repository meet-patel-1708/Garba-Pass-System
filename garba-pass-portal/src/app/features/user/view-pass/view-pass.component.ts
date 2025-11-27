import { Component, OnInit } from '@angular/core';
import { PassService } from '../../../services/pass.service';
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { NgFor, NgIf } from '@angular/common';

interface Pass {
  name: string;
  mobile: string;
  aadharCard: string;
  passId: string;
  price: string;
  totalDays: number;
  remainingDays: number;
  usedDays: number;
  currentDay: number;
  issuedAt?: string;
}

@Component({
  selector: 'app-view-pass',
  templateUrl: './view-pass.component.html',
  styleUrls: ['./view-pass.component.css'],
  imports: [FooterComponent, NavbarComponent, NgIf, NgFor]
})
export class ViewPassComponent implements OnInit {
  pass: Pass | null = null;
  loading: boolean = false;
  identityCardNumber: string = '';
  errorMsg: string = '';
  blurPass: boolean = false;
  days: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  constructor(private passService: PassService) {}

  ngOnInit(): void {
    this.identityCardNumber = localStorage.getItem("identityCardNumber") || '';
    console.log('Identity Card Number:', this.identityCardNumber);
    
    if (this.identityCardNumber) {
      this.getPassByIdentityCardNumber();
    }
  }

  isAllowedTime(): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= 19 || currentHour <= 0;
  }

  getPassByIdentityCardNumber() {
    this.loading = true;
    this.errorMsg = '';
    
    const trimIdentityCard = this.identityCardNumber.trim();
    console.log('Searching For:', trimIdentityCard);
    console.log('Length:', trimIdentityCard.length);

    this.passService.getPassByIdentityCard(trimIdentityCard).subscribe({
      next: (res) => {
        console.log('Raw Response:', res);
        
        if (res && res.fullName) {
          // Get pass details from the Pass entity via passId
          this.fetchFullPassDetails(res.passId, res);
        } else {
          this.errorMsg = 'Pass Not found';
          this.loading = false;
        }
      },
      error: (err) => {
        console.log("Backend Error:", err);
        this.errorMsg = "Cannot find pass";
        this.loading = false;
      }
    });
  }

  // Fetch full pass details including remainingDays from the Pass entity
  fetchFullPassDetails(passId: string, userData: any) {
    this.passService.getPassBySerial(passId).subscribe({
      next: (passData) => {
        console.log('Pass Data:', passData);
        
        const totalDays = 9;
        const remainingDays = passData.remainingDays || totalDays;
        const usedDays = totalDays - remainingDays;
        const currentDay = usedDays + 1; // Current day is the next day to use

        this.pass = {
          name: userData.fullName,
          mobile: userData.phone,
          aadharCard: userData.identityCardNumber,
          passId: userData.passId,
          price: userData.price,
          totalDays: totalDays,
          remainingDays: remainingDays,
          usedDays: usedDays,
          currentDay: currentDay,
          issuedAt: passData.issuedAt
        };

        console.log('Pass Object Created:', this.pass);
        this.loading = false;
      },
      error: (err) => {
        console.log('Error fetching pass details:', err);
        
        // Fallback: Create pass without full details
        this.pass = {
          name: userData.fullName,
          mobile: userData.phone,
          aadharCard: userData.identityCardNumber,
          passId: userData.passId,
          price: userData.price,
          totalDays: 9,
          remainingDays: 9,
          usedDays: 0,
          currentDay: 1
        };
        
        this.loading = false;
      }
    });
  }

  getDayClass(day: number): string {
    if (!this.pass) return 'upcoming';
    
    const usedDays = this.pass.usedDays;
    const currentDay = this.pass.currentDay;

    if (day <= usedDays) {
      // Days that have been completed
      return 'completed';
    } else if (day === currentDay && this.pass.remainingDays > 0) {
      // Current day (today)
      return 'active';
    } else {
      // Future days
      return 'upcoming';
    }
  }

  getDayStatus(day: number): string {
    if (!this.pass) return '';
    
    const usedDays = this.pass.usedDays;
    const currentDay = this.pass.currentDay;

    if (day <= usedDays) {
      return '✓ Used';
    } else if (day === currentDay && this.pass.remainingDays > 0) {
      return '● Today';
    } else if (this.pass.remainingDays === 0) {
      return '○ Expired';
    } else {
      return '○ Upcoming';
    }
  }
}