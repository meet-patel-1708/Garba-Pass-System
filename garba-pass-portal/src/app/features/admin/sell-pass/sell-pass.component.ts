import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PassService } from '../../../services/pass.service';
declare var Razorpay :any;
@Component({
  selector: 'app-sell-pass',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sell-pass.component.html',
  styleUrl: './sell-pass.component.css'
})
export class SellPassComponent implements OnInit {
  availablePasses: any[] = [];
  filteredPasses: any[] = [];
  searchTerm: string = '';
  selectedPass: any = null;
  buyerAdharCard: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  organizerAdharCard: string = '';
  showSellModal: boolean = false;

  // otp
  mobileNumber:string = '';
  otpSent:boolean = false;
  otpVerifed:boolean=false;
  enteredOtp:string='';
  isVerifyOtp:boolean=false;
  isSendingOtp:boolean=false;
  constructor(private passService: PassService) {}

  ngOnInit() {
    this.organizerAdharCard = localStorage.getItem('identityCardNumber') || '';
    if (this.organizerAdharCard) {
      this.loadAvailablePasses();
    } else {
      this.errorMessage = 'Organizer identity not found. Please login again.';
    }
  }

  loadAvailablePasses() {
    this.isLoading = true;
    const adharNumber = Number(this.organizerAdharCard);

    this.passService.getAvailablePasses(adharNumber).subscribe({
      next: (passes) => {
        this.availablePasses = passes;
        this.filteredPasses = passes;
        this.isLoading = false;
        console.log('✅ Loaded passes:', passes);
      },
      error: (err) => {
        console.error('❌ Error loading passes:', err);
        this.errorMessage = 'Failed to load available passes.';
        this.isLoading = false;
      }
    });
  }

  searchPasses() {
    if (!this.searchTerm.trim()) {
      this.filteredPasses = this.availablePasses;
      return;
    }

    this.filteredPasses = this.availablePasses.filter(pass =>
      pass.serialNumber.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openSellModal(pass: any) {
    this.selectedPass = pass;
    this.showSellModal = true;
    this.clearMessages();
  }

  closeSellModal() {
    this.showSellModal = false;
    this.selectedPass = null;
    this.buyerAdharCard = '';
    this.clearMessages();
  }
  async sendOtp(){
    if(!this.mobileNumber || this.mobileNumber.length !==10){
      this.errorMessage = 'Please Enter a valid 10 digit mobile number';
      return;
    }
    if(!/^\d{10}$/.test(this.mobileNumber)){
      this.errorMessage = 'Mobile Number must be contains only digits';
      return;
    }
    this.isSendingOtp = true;
    this.clearMessages();

    try{
      const res = await this.passService.sendOtpToMobile(this.mobileNumber);
      if(res){
        this.otpSent=true;
        this.successMessage = 'OTP sent successfully to '+ this.mobileNumber;
        setTimeout(()=>this.successMessage='',3000);
      }else{
        this.errorMessage = 'Failed to send otp. Please try again';
      }
    }catch(error){
      console.log('error send otp:',error);
      this.errorMessage = 'Failed to send otp. please check the mobile number';
    }
    finally{
      this.isSendingOtp = false;
    }
  }
  verifyOtp(){
    if (!this.enteredOtp || this.enteredOtp.length !== 6) {
      this.errorMessage = 'Please enter a valid 6-digit OTP.';
      return;
    }
    this.isVerifyOtp = true;
    this.clearMessages();

    const isValid = this.passService.verifyOtp(this.enteredOtp);
    setTimeout(()=>{
      if(isValid){
        this.otpVerifed = true;
        this.successMessage='OTP verified successfully!';
        setTimeout(()=>this.successMessage='',3000);
      }else{
        this.errorMessage='Invalid otp. Please try again.';
      }
      this.isVerifyOtp = false;
    },500);
  }
  async resendOtp(){
    this.enteredOtp = '';
    await this.sendOtp();
  }
  proceesToPayment(){
    if(!this.buyerAdharCard || this.buyerAdharCard.length !==12){
      this.errorMessage = 'Please enter a valid 12-digit Aadhar card number.';
      return;
    }
    if (!this.otpVerifed) {
      this.errorMessage = 'Please verify OTP before proceeding.';
      return;
    }

    this.clearMessages();
    this.initiatePayment();
  }
  initiatePayment(){
    const amount = this.selectedPass.price*100;
    const options={
      key:'rzp_test_Rc7igg8OKTE9NH',
      amount:amount,
      currency:'INR',
      name:'Garba Pass',
      description:`Pass:${this.selectedPass.serialNumber}`,
      image:'',
      handler:(res:any)=>{
        console.log('Payment Successfull:',res);
        this.handlePaymentSuccess(res);
      },
      prefill:{
        contact:this.mobileNumber,
      },
      theme:{
        color:'#3399cc'
      },
      modal:{
        ondismiss:()=>{
          this.errorMessage = 'Payment cancelled.';
        }
      }
    };
    const razorpay = new Razorpay(options);
    razorpay.open();
  }
  handlePaymentSuccess(paymentResponse: any) {
    this.isLoading = true;
    const buyerId = Number(this.buyerAdharCard);

    this.passService.sellPass(this.selectedPass.serialNumber, buyerId).subscribe({
      next: (response) => {
        this.successMessage = `✅ Pass ${this.selectedPass.serialNumber} sold successfully!`;
        console.log('Payment Response:', paymentResponse);
        console.log('Pass Sold Response:', response);
        console.log('✅ User passId and price updated in database');
        
        this.otpSent = false;
        this.otpVerifed = false;
        this.enteredOtp = '';
        this.mobileNumber = '';
        this.closeSellModal();
        this.loadAvailablePasses();
        this.isLoading = false;

        setTimeout(() => this.successMessage = '', 5000);
      },
      error: (err) => {
        console.error('❌ Error selling pass:', err);
        this.errorMessage = err.error?.message || 'Failed to complete sale. Please contact support.';
        this.isLoading = false;
      }
    });
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}