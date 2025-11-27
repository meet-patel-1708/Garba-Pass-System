import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PassService {
  private baseUrl = "http://localhost:8080/api/admin/pass";
  
  public generatedOtp: string = '';
  private isOtpSent: boolean = false;
  
  private ACCOUNT_SID = 'account-sid';
  private AUTH_TOKEN = 'auth-token';
  private FROM_NUMBER = 'phone-number';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Pass Generation
  generatePass(organizerAdharCardNumber: number, count: number, price: number, prefix: string = 'GARBA'): Observable<any> {
    const params = {
      organizerAdharCard: organizerAdharCardNumber.toString(),
      count: count.toString(),
      price: price.toString(),
      prefix: prefix
    };
    
    return this.http.post(
      `http://localhost:8080/api/admin/generated/generate`,
      null,
      { params }
    );
  }

  // Get Available Passes
  getAvailablePasses(organizerAdharCardNumber: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/admin/generated/available/${organizerAdharCardNumber}`);
  }

  // Sell Pass
  sellPass(serialNumber: string, buyerId: number): Observable<any> {
    return this.http.post(
      `http://localhost:8080/api/admin/generated/sell/${serialNumber}`,
      null,
      { params: { buyerId: buyerId.toString() } }
    );
  }

  // Block Pass by ID
  blockPass(passId: number): Observable<any> {
    return this.http.put(
      `http://localhost:8080/api/admin/generated/block/${passId}`,
      null
    );
  }

  // Block Pass by Serial Number (NEW)
  blockPassBySerial(serialNumber: string): Observable<any> {
    return this.http.put(
      `http://localhost:8080/api/admin/generated/block_by_serial/${serialNumber}`,
      null
    );
  }

  // Unblock Pass
  unblockPass(passId: number): Observable<any> {
    return this.http.put(
      `http://localhost:8080/api/admin/generated/unblock/${passId}`,
      null
    );
  }

  // Count Total Passes
  countTotalPasses(organizerAdharCardNumber: number): Observable<number> {
    return this.http.get<number>(`http://localhost:8080/api/admin/generated/total_pass/${organizerAdharCardNumber}`);
  }

  // Count Total Sold Passes
  countTotalSoldPass(organizerAdharCardNumber: number): Observable<number> {
    return this.http.get<number>(`http://localhost:8080/api/admin/generated/total_sold_pass/${organizerAdharCardNumber}`);
  }

  // Get Pass by Serial Number
  getPassBySerial(serial: string): Observable<any> {
    return this.http.get(`http://localhost:8080/api/admin/generated/getPass/${serial}`);
  }

  // Get Purchase Pass
  getPurchasePass(): Observable<any> {
    return this.http.get(`http://localhost:8080/api/user/pass`);
  }

  // Get Pass by Identity Card
  getPassByIdentityCard(identityCardNumber: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/user/fetchPass/${identityCardNumber}`);
  }

  // **NEW: Allow Entry - Decrements remaining days**
  allowEntry(serialNumber: string): Observable<any> {
    return this.http.post(
      `http://localhost:8080/api/entry/scan?serialNumber=${serialNumber}`,
      null,
      {responseType:'text'}
    );
  }

  // OTP Generation
  generateOtp(): string {
    this.generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    return this.generatedOtp;
  }

  // Send OTP to Mobile
  async sendOtpToMobile(mobile: string): Promise<boolean> {
    const otp = this.generateOtp();
    const message = `Your OTP is: ${otp}. Verify it to continue.`;
    const url = `https://api.twilio.com/2010-04-01/Accounts/${this.ACCOUNT_SID}/Messages.json`;
    
    const body = new URLSearchParams();
    body.append('To', `+91${mobile}`);
    body.append('From', this.FROM_NUMBER);
    body.append('Body', message);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + btoa(`${this.ACCOUNT_SID}:${this.AUTH_TOKEN}`),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
      });
      
      if (response.ok) {
        this.isOtpSent = true;
        return true;
      } else {
        console.error(await response.json());
        return false;
      }
    } catch (error) {
      console.error('Twilio error:', error);
      return false;
    }
  }

  // Verify OTP
  verifyOtp(enteredOtp: string): boolean {
    if (!this.isOtpSent) return false;
    return this.generatedOtp === enteredOtp;
  }

  // Fetch Pass Details for Admin
  fetchPassDetails(identityCardNumber: string): Observable<any> {
    return this.http.get(`http://localhost:8080/api/user/fetch_pass_by_admin/${identityCardNumber}`);
  }
}