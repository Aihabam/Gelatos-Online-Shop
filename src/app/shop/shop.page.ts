import { Component } from '@angular/core';
import { ToastController, NavController, ActionSheetController } from '@ionic/angular';
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


  // this function will be called every time the user enters the page 
  ionViewDidEnter(){
    this.loading = true;
    this.onAuth();

  }
  // Check if user logged in
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
  // get the products from the database
  bindProducts(){
 this.products =  this.productsService.getProducts();
   this.products.subscribe((e) => {
    if (e.length > 0){
      this.loading = false; 

    }
   });
  }
  // add to basket clicked 
  addToBasketClicked(itemName,itemPrice,itemImg,$event){
    // if logged in then add item to user basket
    if (this.loggedIn){
      $event.target.disabled = true;
      $event.target.textContent = 'ADDING...';
      this.user.addToUserBasket(this.uid,{name:itemName,price:itemPrice,img:itemImg,id:this.user.getPushId()})
      .then(() => {
        this.showMessage(itemName+' Added to basket')
        $event.target.disabled = false;
        $event.target.textContent = 'ADD TO BASKET';
      }).catch(() => {
        $event.target.disabled = false;
        $event.target.textContent = 'ADD TO BASKET';
      });
    }else{
      // ask user to login or create account
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
  // popup login or create account message
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
 