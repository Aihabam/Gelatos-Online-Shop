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
  // Set start state is a function that will set all the settings to their default state
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
  // Get the current user account
  getUserAccount(){
   this.auth.getUser()
   .then((user) => {
     if (user){
      this.email = user['email'];
      this.uid = user['uid'];
      // get the 
      this.getUserAccountInfo(user['uid']);
     }else{
       this.navCon.navigateRoot('/login');
       this.showMessage('Unauthorized');
     }
   }).catch(() => {
    this.showMessage('Something went wrong, please try again later.');
   });
  }
  // Get the current user account info  by current user id
  getUserAccountInfo(uid:string){
    this.user.getUserInformation(uid)
    .then((userInfo) => {
      if (userInfo){
        //  bind the info of the current user
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
  // Update current user info 
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
          // update success 
           this.showMessage('Saved');
           this.setStartState();
        }).catch(() => {
          // update failed
          this.showMessage('Something went wrong, please try again later.');
  
        });
      }

    }else{
      this.editMode = true;
    }
 
  }
  // set the mode for the account view editable or not editable 
  setAccountMode(){
    if(this.firstName && this.lastName && this.phoneNumber && this.address){
      this.editMode = false;
    }else{
      this.editMode = true;
    }
  }
  // Close button clicked navigate to shop page 
  closeClicked(){
    this.navCon.navigateRoot('/tabs/shop')
  }
  async showMessage(message:string){
    const toast = await this.toast.create({
      message:message,
      duration:2000,
      position:'top'
    });
    return await toast.present();
  }
  // Log out user and reload the app (the website) 
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
