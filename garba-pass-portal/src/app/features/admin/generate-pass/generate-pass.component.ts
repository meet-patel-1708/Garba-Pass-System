import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PassService } from '../../../services/pass.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-generate-pass',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './generate-pass.component.html',
  styleUrl: './generate-pass.component.css'
})
export class GeneratePassComponent {
  message = "";
  organizerAdharCardNumber = 0; // Get this from logged-in user
  count = 0;
  price = 100.00;
  prefix = 'GARBA';

  constructor(private passService: PassService) {}

  generatePasses() {
    this.passService.generatePass(
      this.organizerAdharCardNumber,
      this.count,
      this.price,
      this.prefix
    ).subscribe({
      next: (response) => {
        this.message = `Successfully generated ${response.length} passes!`;
        console.log('Generated passes:', response);
      },
      error: (error) => {
        this.message = 'Error generating passes: ' + error.message;
        console.error('Error:', error);
      }
    });
  }
}
