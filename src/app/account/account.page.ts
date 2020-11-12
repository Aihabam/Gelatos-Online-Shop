import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../Api/auth.service';
import { UserService } from '../Api/user.service';
import { ValidateService } from '../Services/validate.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  uid:string;
  email:string;
  firstName:string;
  lastName:string;
  phoneNumber:string
  address:string;
  editMode:boolean;
  loading:boolean;
  loggingOut:boolean;
  constructor(private navCon:NavController,private auth:AuthService,private user:UserService,private toast:ToastController) { }

  ngOnInit() {
    this.setStartState();
  
  }
  setStartState(){
    this.editMode = false;
    this.loading = true;
    this.firstName = '';
    this.lastName = '';
    this.phoneNumber = '';
    this.address = '';
    this.loggingOut = false;
    this.getUserAccount();
  }
  getUserAccount(){
   this.auth.getUser()
   .then((user) => {
     if (user){
      this.email = user['email'];
      this.uid = user['uid'];
      this.getUserAccountInfo(user['uid']);
     }else{
       this.navCon.navigateRoot('/login');
       this.showMessage('Unauthorized');
     }
   }).catch(() => {
    this.showMessage('Something went wrong, please try again later.');
   });
  }
  getUserAccountInfo(uid:string){
    this.user.getUserInformation(uid)
    .then((userInfo) => {
      if (userInfo){
        this.firstName = userInfo['firstName'];
        this.lastName = userInfo['lastName'];
        this.address = userInfo['address'];
        this.phoneNumber = userInfo['phoneNumber'];
      }
      this.loading = false;
      this.setAccountMode();      
    }).catch((e) => {
      console.log(e);
      
      this.showMessage('Something went wrong, please try again later.');

    });
  }
  updateUserAccountInfo(){
    if (this.editMode){
      if (ValidateService.isEmpty(this.firstName)){
         this.showMessage('Please enter your first name');
      }else if (ValidateService.isEmpty(this.lastName)){
        this.showMessage('Please enter your last name');
      }else if (ValidateService.isEmpty(this.phoneNumber)){
        this.showMessage('Please enter your phone number');
      }else if (!ValidateService.isNumbers(this.phoneNumber)){
       this.showMessage('Please enter valid phone number');
      }else if (ValidateService.isEmpty(this.address)){
        this.showMessage('Please enter your address');
      }else{
        let userInfo = {
          firstName:this.firstName,
          lastName:this.lastName,
          address:this.address,
          phoneNumber:this.phoneNumber,
        }
        this.user.updateUserInformation(this.uid,userInfo)
        .then(() => {
           this.showMessage('Saved');
           this.setStartState();
        }).catch(() => {
          this.showMessage('Something went wrong, please try again later.');
  
        });
      }

    }else{
      this.editMode = true;
    }
 
  }
  setAccountMode(){
    if(this.firstName && this.lastName && this.phoneNumber && this.address){
      this.editMode = false;
    }else{
      this.editMode = true;
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
  logoutClicked(){
    this.loggingOut = true;
    this.auth.signOutUser()
    .then(() => {
      window.location.replace('/')
    }).catch(() => {
      this.loggingOut = false;
      this.showMessage('Something went wrong, please try again later.');

    });
  }
}
