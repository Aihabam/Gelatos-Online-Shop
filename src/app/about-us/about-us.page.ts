import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastController } from '@ionic/angular';
import { ValidateService } from '../Services/validate.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {
  email:string;
  // Working on it is boolean to disable the input and the button while sending the email to the database
  workingOnIt:boolean;
  joinButtonText:string;
  constructor(private dataBase:AngularFireDatabase,private toast:ToastController) { }

  // set default state once the page started
  ngOnInit() {
    this.email = '';
    this.workingOnIt = false;
    this.joinButtonText =  'SUBSCRIBE';
  }
  // User clicked on join news letter button, validate the email and subscribe the user by sending the email to the database
  joinButtonClicked(){
    if (ValidateService.isEmpty(this.email)){
      this.showMessage('Please enter your email address');
    }else if (!ValidateService.isValidEmail(this.email)){
      this.showMessage('Please enter valid email address.')
    }else{
      /*
      Email is validated, set processing state and send the email

      */
      this.joinButtonText = 'PLEASE WAIT...';
      this.workingOnIt = true;
      this.dataBase.database.ref('news-letter-subscribers')
      .push().set({email:this.email})
      .then(() => {
        // The email was sent to the database, show message to the user and return to the  default state
        this.showMessage('You have successfully subscribed for our news letter.');
        this.email = '';
        this.workingOnIt = false;
        this.joinButtonText =  'SUBSCRIBE';
      }).catch(() => {
        // There was an error while sending the email to the database, return to  default state and show error message
        this.workingOnIt = false;
        this.joinButtonText =  'SUBSCRIBE';
      this.showMessage('Something went wrong, please try again later.')
      });
    }

  }
  // show message function
  async showMessage(message:string){
    const toast = await this.toast.create({
      message:message,
      duration:2000,
      position:'top'
    });
    return await toast.present();
  }

}
