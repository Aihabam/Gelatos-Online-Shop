import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastController } from '@ionic/angular';
import { ValidateService } from '../Services/validate.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
  email:string;
  firstName:string;
  lastName:string;
  phoneNumber:string
  message:string;
  workingOnIt:boolean;
  sendButtonText:string;
  constructor(private toast:ToastController,private dataBase:AngularFireDatabase) { }

  ngOnInit() {
    this.email = '';
    this.firstName = '';
    this.lastName = '';
    this.phoneNumber = '';
    this.message = '';
    this.workingOnIt = false;
    this.sendButtonText = 'SEND';

  }
  sendClicked(){
    if (ValidateService.isEmpty(this.email)){
      this.showMessage('Please enter your email address');
    }else if (!ValidateService.isValidEmail(this.email)){
      this.showMessage('Please enter valid email address.')

    }else  if (ValidateService.isEmpty(this.firstName)){
      this.showMessage('Please enter your first name');
   }else if (ValidateService.isEmpty(this.lastName)){
     this.showMessage('Please enter your last name');
   }else if (ValidateService.isEmpty(this.phoneNumber)){
     this.showMessage('Please enter your phone number');
   }else if (!ValidateService.isNumbers(this.phoneNumber)){
    this.showMessage('Please enter valid phone number');
   }else if (ValidateService.isEmpty(this.message)){
     this.showMessage('Please enter your message');
   }else{
     this.sendButtonText = 'PLEASE WAIT...';
     this.workingOnIt = true;
     let message = {
       firstName:this.firstName,
       lastName:this.lastName,
       text:this.message,
       phoneNumber:this.phoneNumber,
     }
     
     this.dataBase.database.ref('messages').push().set(message)
     .then(() => {
       this.email = '';
       this.firstName = '';
       this.lastName = '';
       this.phoneNumber = '';
       this.message = '';
       this.workingOnIt = false;
       this.sendButtonText = 'SEND';
       this.showMessage('Thanks so much for reaching out! We received your message and will get back to you as soon as possible.')
     }).catch(() => {
       this.workingOnIt = false;
       this.sendButtonText = 'SEND';
       this.showMessage('Something went wrong, please try again later');
     })
     
   }

  }
  async showMessage(message:string){
    const toast = await this.toast.create({
      message:message,
      duration:2000,
      position:'top'
    });
    return await toast.present();
  }

}
