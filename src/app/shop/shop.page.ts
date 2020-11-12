import { Component, OnInit } from '@angular/core';
import { ToastController, NavController, ActionSheetController } from '@ionic/angular';
import { timeStamp } from 'console';
import { Observable } from 'rxjs';
import { AuthService } from '../Api/auth.service';
import { ProductsService } from '../Api/products.service';
import { UserService } from '../Api/user.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage  {


  products:Observable<any[]>;
  loading:boolean;
  loggedIn:boolean;
  uid:string;
  constructor(private productsService:ProductsService,private user:UserService,private auth:AuthService,private toast:ToastController,private navCon:NavController,private actionSheetController: ActionSheetController) { }


  ionViewDidEnter(){
    this.loading = true;
    this.onAuth();

  }
  onAuth(){
   this.auth.getUser()
   .then((user) => {
     if (user){
       this.loggedIn = true;
       this.uid = user['uid'];
     }else{
       this.loggedIn = false;
     }
    this.bindProducts();
   }).catch(() => {
    this.showMessage('Something went wrong');

   });
  }
  bindProducts(){
 this.products =  this.productsService.getProducts();
   this.products.subscribe((e) => {
    if (e.length > 0){
      this.loading = false; 

    }
   });
  }
  addToBasketClicked(itemName,itemPrice,itemImg,$event){
    if (this.loggedIn){
      $event.target.disabled = true;
      $event.target.textContent = 'ADDING...';
      this.user.addToUserBasket(this.uid,{name:itemName,price:itemPrice,img:itemImg})
      .then(() => {
        this.showMessage(itemName+' Added to basket')
        $event.target.disabled = false;
        $event.target.textContent = 'ADD TO BASKET';
      }).catch(() => {
        $event.target.disabled = false;
        $event.target.textContent = 'ADD TO BASKET';
      });
    }else{
   this.askToLoginOrCreateAccount();
    }

   
  }
  async showMessage(message:string){
    const toast = await this.toast.create({
      message:message,
      duration:2000,
    });
    return await toast.present();
  }
  async askToLoginOrCreateAccount() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Do you have account?',
      buttons: [{
        text: 'Login',
        handler: () => {
          this.navCon.navigateForward('/login');
        }
      }, {
        text: 'Create Account',
        handler: () => {
          this.navCon.navigateForward('/create-account');
         }
      },]
    });
    await actionSheet.present();
  }


}
 