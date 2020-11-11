import { Component, Injectable } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

import { AuthService } from '../Api/auth.service';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  basketModal:any;
  loggedIn:boolean;
  disabledClicks:boolean;
  constructor(private auth:AuthService,private toast:ToastController,private navCon:NavController) {
    this.setStartState();

  }
  setStartState(){
    this.loggedIn = false;
    this.disabledClicks = true;
    this.onAuth();
  }
  onAuth(){
  this.auth.getUser()
  .then((user) => {
    if (user){
    this.loggedIn = true;
    }
    this.disabledClicks = false;

  }).catch((error) => {
    this.showMessage('Something went wrong');
  });
  }
  accountOnClick(){
   this.loggedIn?this.navCon.navigateForward('/account'):this.navCon.navigateForward('/login');
  }
  async showMessage(message:string){
    const toast = await this.toast.create({
      message:message,
      duration:2000,
    });
    return await toast.present();
  }

}
