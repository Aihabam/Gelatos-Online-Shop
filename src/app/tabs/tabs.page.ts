import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Injectable } from '@angular/core';
import {  IonTabBar, IonTabs, ModalController, NavController, ToastController } from '@ionic/angular';
import { timeStamp } from 'console';

import { AuthService } from '../Api/auth.service';
import { UserService } from '../Api/user.service';
import { BasketPage } from '../basket/basket.page';

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
  basketTotalItems:any;
  constructor(private auth:AuthService,private user:UserService,private toast:ToastController,private navCon:NavController,private modal:ModalController) {

  


  }
  ionViewDidEnter(){
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
    this.bindTotalItemsInBasket(user['uid'])
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
  basketClicked(){
    if (this.loggedIn){
       this.displayBasket();
    }else{
      this.navCon.navigateForward('/login');
    }
   
  }
  async displayBasket(){
    const basket = await this.modal.create({
      component:BasketPage
    });
    return await basket.present();
  }
 bindTotalItemsInBasket(uid:string){    
    this.user.getItemsInBasket(uid).subscribe((e) => {
      this.basketTotalItems = e.length;
    })
 }

}
