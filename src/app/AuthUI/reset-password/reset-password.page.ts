import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { async } from 'rxjs/internal/scheduler/async';
import { AuthService } from 'src/app/Api/auth.service';
import { ValidateService } from 'src/app/Services/validate.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  email:string;
  workingOnIt:boolean;
  sendButtonText:string;
  constructor(private navCon:NavController,private auth:AuthService,private toast:ToastController) { }

  ngOnInit() {
    this.email = '';
    this.workingOnIt = false;
    this.sendButtonText =  'SEND';
  }
  sendButtonClicked(){
    if (ValidateService.isEmpty(this.email)){
      this.showMessage('Please enter your email address');
    }else if (!ValidateService.isValidEmail(this.email)){
      this.showMessage('Please enter valid email address.')
    }else{
      this.sendButtonText = 'PLEASE WAIT...';
      this.workingOnIt = true;
      this.auth.sendResetPasswordLink(this.email)
      .then(() => {
       this.navCon.navigateRoot('/tabs/home');
      }).catch((error) => {
        this.workingOnIt = false;
        this.sendButtonText =  'SEND';
        this.showMessage(error);
      });
  }
}
  closeClicked(){
    this.navCon.back();
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
