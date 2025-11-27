import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PassService } from '../../../services/pass.service';

interface Pass {
  name: string;
  mobile: string;
  aadharCard: string;
  passId: string;
  price: string;
}

@Component({
  selector: 'app-manage-pass',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-pass.component.html',
  styleUrl: './manage-pass.component.css'
})
export class ManagePassComponent {
  constructor(private passService: PassService) {}

  identityCardNumber: string = '';
  isSendingOtp: boolean = false;
  pass: Pass | null = null;
  otpSent: boolean = false;
  otpVerified: boolean = false;
  enteredOtp: string = '';
  isVerifyingOtp: boolean = false;
  isLoading: boolean = false;
  errorMsg: string = '';
  successMessage: string = '';
  isProcessingEntry: boolean = false;

  // Step 1: Fetch pass details and send OTP
  async fetchPassDetails() {
    if (!this.identityCardNumber || this.identityCardNumber.length !== 12) {
      this.errorMsg = 'Please enter a valid 12-digit Aadhar card number';
      return;
    }

    this.isLoading = true;
    this.isSendingOtp = true;
    this.errorMsg = '';
    this.successMessage = '';

    const trimIdentityCard = this.identityCardNumber.trim();
    console.log('Searching For:', trimIdentityCard);
    console.log('Length:', trimIdentityCard.length);

    this.passService.fetchPassDetails(trimIdentityCard).subscribe({
      next: async (res) => {
        if (res && res.fullName) {
          this.pass = {
            name: res.fullName,
            mobile: res.phone,
            aadharCard: res.identityCardNumber,
            passId: res.passId,
            price: res.price,
          };

          console.log('Pass found:', this.pass);

          // Send OTP to the mobile number
          const otpSent = await this.passService.sendOtpToMobile(this.pass.mobile);
          
          if (otpSent) {
            this.otpSent = true;
            this.successMessage = `OTP sent to ${this.maskMobile(this.pass.mobile)}`;
            setTimeout(() => this.successMessage = '', 3000);
          } else {
            this.errorMsg = 'Failed to send OTP. Please try again.';
          }
        } else {
          this.errorMsg = 'Pass not found';
          this.pass = null;
        }
        this.isLoading = false;
        this.isSendingOtp = false;
      },
      error: (err) => {
        console.log('Backend Error:', err);
        this.errorMsg = 'Cannot find pass';
        this.isLoading = false;
        this.isSendingOtp = false;
        this.pass = null;
      }
    });
  }

  // Step 2: Verify OTP
  verifyOtp() {
    if (!this.enteredOtp || this.enteredOtp.length !== 6) {
      this.errorMsg = 'Please enter a valid 6-digit OTP.';
      return;
    }

    this.isVerifyingOtp = true;
    this.clearMessages();

    const isValid = this.passService.verifyOtp(this.enteredOtp);

    setTimeout(() => {
      if (isValid) {
        this.otpVerified = true;
        this.successMessage = '✅ OTP verified successfully! Pass details confirmed.';
      } else {
        this.errorMsg = '❌ Invalid OTP. Please try again.';
      }
      this.isVerifyingOtp = false;
    }, 500);
  }

  // NEW: Allow Entry - Decrements remaining days
  allowEntry() {
    if (!this.pass || !this.pass.passId) {
      this.errorMsg = 'No pass selected';
      return;
    }

    this.isProcessingEntry = true;
    this.clearMessages();

    this.passService.allowEntry(this.pass.passId).subscribe({
      next: (response) => {
        this.successMessage = `✅ Entry granted successfully! Pass updated.${response}`;
        console.log('Entry allowed:', response);
        
        // Optionally reset after a delay
        setTimeout(() => {
          this.resetForm();
        }, 3000);
        
        this.isProcessingEntry = false;
      },
      error: (err) => {
        console.error('Entry error:', err);
        this.errorMsg = err.error?.message || '❌ Failed to grant entry. Please try again.';
        this.isProcessingEntry = false;
      }
    });
  }

  // NEW: Block Pass
  blockPass() {
    if (!this.pass || !this.pass.passId) {
      this.errorMsg = 'No pass selected';
      return;
    }

    if (!confirm(`Are you sure you want to block pass ${this.pass.passId}?`)) {
      return;
    }

    this.isProcessingEntry = true;
    this.clearMessages();

    this.passService.blockPassBySerial(this.pass.passId).subscribe({
      next: (response) => {
        this.successMessage = '🚫 Pass blocked successfully!';
        console.log('Pass blocked:', response);
        
        setTimeout(() => {
          this.resetForm();
        }, 2000);
        
        this.isProcessingEntry = false;
      },
      error: (err) => {
        console.error('Block error:', err);
        this.errorMsg = '❌ Failed to block pass. Please try again.';
        this.isProcessingEntry = false;
      }
    });
  }

  // Resend OTP
  async resendOtp() {
    if (!this.pass || !this.pass.mobile) {
      this.errorMsg = 'No mobile number available';
      return;
    }

    this.isSendingOtp = true;
    this.enteredOtp = '';
    this.clearMessages();

    const otpSent = await this.passService.sendOtpToMobile(this.pass.mobile);

    if (otpSent) {
      this.successMessage = `OTP resent to ${this.maskMobile(this.pass.mobile)}`;
      setTimeout(() => this.successMessage = '', 3000);
    } else {
      this.errorMsg = 'Failed to resend OTP. Please try again.';
    }

    this.isSendingOtp = false;
  }

  // Reset form
  resetForm() {
    this.identityCardNumber = '';
    this.pass = null;
    this.otpSent = false;
    this.otpVerified = false;
    this.enteredOtp = '';
    this.isProcessingEntry = false;
    this.clearMessages();
  }

  // Helper: Mask mobile number
  maskMobile(mobile: string): string {
    if (!mobile) return '';
    return `+91 ${mobile.substring(0, 2)}****${mobile.substring(6)}`;
  }

  // Clear messages
  clearMessages() {
    this.errorMsg = '';
    this.successMessage = '';
  }
}