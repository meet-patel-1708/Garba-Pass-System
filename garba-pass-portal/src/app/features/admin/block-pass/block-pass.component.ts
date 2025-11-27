import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PassService } from '../../../services/pass.service';

@Component({
  selector: 'app-block-pass',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './block-pass.component.html',
  styleUrl: './block-pass.component.css'
})
export class BlockPassComponent {

  serialNumber: string = '';
  pass: any = null;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private passService: PassService) {}

  fetchPass() {
    this.errorMessage = "";
    this.successMessage = "";
    this.pass = null;

    if (!this.serialNumber.trim()) {
      this.errorMessage = "Please enter serial number!";
      return;
    }

    this.passService.getPassBySerial(this.serialNumber).subscribe({
      next: (res: any) => this.pass = res,
      error: () => this.errorMessage = "No pass found!"
    });
  }

  blockPass() {
    this.passService.blockPass(Number(this.pass.passId)).subscribe({
      next: () => {
        this.pass.blocked = true;
        this.successMessage = "Pass blocked successfully!";
      },
      error: () => this.errorMessage = "Failed to block pass!"
    });
  }

  unblockPass() {
    this.passService.unblockPass(Number(this.pass.passId)).subscribe({
      next: () => {
        this.pass.blocked = false;
        this.successMessage = "Pass unblocked successfully!";
      },
      error: () => this.errorMessage = "Failed to unblock pass!"
    });
  }
}
