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
  workingOnIt:boolean;
  joinButtonText:string;
  constructor(private dataBase:AngularFireDatabase,private toast:ToastController) { }

  ngOnInit() {
    this.email = '';
    this.workingOnIt = false;
    this.joinButtonText =  'SUBSCRIBE';
  }
  joinButtonClicked(){
    if (ValidateService.isEmpty(this.email)){
      this.showMessage('Please enter your email address');
    }else if (!ValidateService.isValidEmail(this.email)){
      this.showMessage('Please enter valid email address.')
    }else{
      this.joinButtonText = 'PLEASE WAIT...';
      this.workingOnIt = true;
      this.dataBase.database.ref('news-letter-subscribers')
      .push().set({email:this.email})
      .then(() => {
        this.showMessage('You have successfully subscribed for our news letter.');
        this.email = '';
        this.workingOnIt = false;
        this.joinButtonText =  'SUBSCRIBE';
      }).catch(() => {
        this.workingOnIt = false;
        this.joinButtonText =  'SUBSCRIBE';
      this.showMessage('Something went wrong, please try again later.')
      });
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
