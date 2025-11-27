import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, NgIf,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user = {
  fullName: '',
  phone: '',
  identityCardNumber: '',
  photoUrl: '',
  role: 'USER',  // default
  password: '',
  confirmPassword: ''
};

  router = inject(Router);
  successMessage = '';
  errorMessage = '';
  constructor(private http:HttpClient){}
  register(form:NgForm){
    this.successMessage = '';
    this.errorMessage = '';

    if(!form.valid){
      this.errorMessage="❌ Please fill all fields correctly!";
      return;
    }
    if(this.user.password !== this.user.confirmPassword){
      this.errorMessage="❌ Password Do Not Match!";
      return;
    }
    if(this.user.role=='ADMIN'){
      this.http.post('http://localhost:8080/api/auth/admin/register',this.user).subscribe({
        next:(res)=>{
          this.successMessage="Registration Successfully!";
          if(this.user.role==='ADMIN'){
            this.router.navigate(['/dashboard']);
          }
          else if(this.user.role==='ORGANIZER'){
            this.router.navigate(['/dashboard']);
          }
          else{
            this.router.navigate(['/register']);
          }
          form.reset();
        },
        error:(err)=>{
          console.log("Backend error ===>",err);
          this.errorMessage="Registeration failed!";
        }
      })
    }else{
      this.http.post('http://localhost:8080/api/user/register', this.user).subscribe({
        next:(res)=>{
          this.successMessage="Registration Successfully!";
          if(this.user.role ==='USER'){
            this.router.navigate(['/home']);
          }
          else{
            this.router.navigate(['/register']);
          }
          form.reset();
        },
        error: (err) => {
          console.log("BACKEND ERROR ===>", err);
          this.errorMessage = "Registration Failed!";
        }
      });
    }
  }
}
