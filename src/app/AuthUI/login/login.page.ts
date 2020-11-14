import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/Api/auth.service';
import { ValidateService } from 'src/app/Services/validate.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email:string;
  password:string;
  workingOnIt:boolean;
  loginButtonText:string;
  constructor(private navCon:NavController,private auth:AuthService,private toast:ToastController) { 

  }

  ngOnInit() {
     this.email = '';
     this.password = '';
     this.workingOnIt = false;
     this.loginButtonText =  'LOG ME IN';
  }
  loginClicked(){
    if (ValidateService.isEmpty(this.email)){
      this.showMessage('Please enter your email address');
    }else if (!ValidateService.isValidEmail(this.email)){
      this.showMessage('Please enter valid email address.')
    }else if (ValidateService.isEmpty(this.password)){
      this.showMessage('Please enter your password.')
    }else{
      this.loginButtonText = 'PLEASE WAIT...';
      this.workingOnIt = true;
      this.auth.doLogin(this.email,this.password)
      .then(() => {
       this.navCon.navigateRoot('/tabs/shop');
      }).catch((error) => {
        this.workingOnIt = false;
        this.loginButtonText =  'LOG ME IN';
        this.showMessage(error);
      });
    }
  
  }
  createAccountClicked(){
    this.navCon.navigateForward('create-account')

  }
  resetPasswordClicked(){
    this.navCon.navigateForward('reset-password')
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
