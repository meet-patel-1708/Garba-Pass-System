import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PassService } from '../../../services/pass.service';

@Component({
  selector: 'app-verify-pass',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify-pass.component.html',
  styleUrls: ['./verify-pass.component.css']
})
export class VerifyPassComponent {

  serialNumber: string = '';
  otp: string = '';

  pass: any = null;
  otpSent: boolean = false;

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private passService: PassService) {}

  // 1️⃣ Fetch pass using serial number
  fetchPass() {
    this.resetMessages();
    this.passService.getPassBySerial(this.serialNumber).subscribe({
      next: (res) => {
        this.pass = res;
      },
      error: () => {
        this.errorMessage = "❌ Invalid serial number!";
      }
    });
  }

  // 2️⃣ Send OTP using Promise (NO SUBSCRIBE)
  async sendOtp() {
    this.resetMessages();

    if (!this.pass?.mobile) {
      this.errorMessage = "❌ Mobile number not found!";
      return;
    }

    const sent = await this.passService.sendOtpToMobile(this.pass.mobile);

    if (sent) {
      this.otpSent = true;
      this.successMessage = "📩 OTP sent successfully!";
    } else {
      this.errorMessage = "❌ Failed to send OTP!";
    }
  }

  // 3️⃣ Verify OTP using boolean (NO SUBSCRIBE)
  verifyOtp() {
    this.resetMessages();

    const valid = this.passService.verifyOtp(this.otp);

    if (valid) {
      this.successMessage = "✅ PASS VERIFIED SUCCESSFULLY!";
    } else {
      this.errorMessage = "❌ Wrong OTP! Try again.";
    }
  }

  resetMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
