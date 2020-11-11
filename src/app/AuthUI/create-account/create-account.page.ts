import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/Api/auth.service';
import { ValidateService } from 'src/app/Services/validate.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {

  email:string;
  password:string;
  passwordConfirmation:string;
  workingOnIt:boolean;
  createAccountButtonText:string;
  constructor(private navCon:NavController,private auth:AuthService,private toast:ToastController) { }

  ngOnInit() {
    this.email = '';
    this.password = '';
    this.passwordConfirmation  = '';
    this.workingOnIt = false;
    this.createAccountButtonText =  'CREATE';
 }
 createAccountClicked(){
  if (ValidateService.isEmpty(this.email)){
    this.showMessage('Please enter your email address');
  }else if (!ValidateService.isValidEmail(this.email)){
    this.showMessage('Please enter valid email address.')
  }else if (ValidateService.isEmpty(this.password)){
    this.showMessage('Please enter your password.')
  }else if (ValidateService.isEmpty(this.passwordConfirmation)){
    this.showMessage('Please confirm your password.')
  }else if (this.password !== this.passwordConfirmation){
    this.showMessage('Password and password confirmation are not match.')
  }else{
    this.createAccountButtonText = 'PLEASE WAIT...';
    this.workingOnIt = true;
    this.auth.createUserAccount(this.email,this.passwordConfirmation)
    .then(() => {
     this.navCon.navigateRoot('/account');
    }).catch((error) => {
      this.workingOnIt = false;
      this.createAccountButtonText =  'CREATE';
      this.showMessage(error);
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
closeClicked(){
  this.navCon.back();
}

}
