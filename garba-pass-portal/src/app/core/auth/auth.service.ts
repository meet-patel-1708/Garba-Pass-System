import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  private Base_url = "http://localhost:8080/api/auth";
  login(data:{phone:string,identityCardNumber:string}):Observable<any>{
    return this.http.post(`${this.Base_url}/login`,data);
  }
  saveToken(token:string){
    localStorage.setItem('jwt',token);
  }
  getToken():string|null{
    return localStorage.getItem('jwt');
  }

  logout(){
    localStorage.removeItem('jwt');
  }
}
