import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Injectable } from '@angular/core';
import {  IonTabBar, IonTabs, ModalController, NavController, ToastController } from '@ionic/angular';


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
    // this function will be called every time the user enters the page 

  ionViewDidEnter(){
    this.setStartState(); 
  }
  // set default state 
  setStartState(){
    this.loggedIn = false;
    this.disabledClicks = true;
    this.onAuth();
  }
  // check if logged in
  onAuth(){
  this.auth.getUser()
  .then((user) => {
    if (user){
    this.loggedIn = true;
    // user logged in, get total items in basket
    this.bindTotalItemsInBasket(user['uid'])
    }
    // Enable the nav bar button basket and account
    this.disabledClicks = false;

  }).catch((error) => {
    this.showMessage('Something went wrong');
  });
}
   
// account clicked if user logged in navigate to account if not logged in navigate to login
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
  // basket clicked if user logged in open basket modal if not logged in navigate to login
  basketClicked(){
    if (this.loggedIn){
       this.displayBasket();
    }else{
      this.navCon.navigateForward('/login');
    }
   
  }
  async displayBasket(){
    // create the modal and display it 
    const basket = await this.modal.create({
      component:BasketPage
    });
    return await basket.present();
  }
  // set the total items to basket button
 bindTotalItemsInBasket(uid:string){    
    this.user.getItemsInBasket(uid).subscribe((e) => {
      this.basketTotalItems = e.length;
    })
 }

}
