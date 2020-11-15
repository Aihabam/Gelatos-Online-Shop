import { Component, OnInit } from '@angular/core';
import { ToastController, NavController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../Api/auth.service';
import { UserService } from '../Api/user.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.page.html',
  styleUrls: ['./basket.page.scss'],
})
export class BasketPage implements OnInit {

  selectedTab:string;
  uid:string;
  itemsInBasket:Observable<any[]>;
  totalItems = 0;
  totalAmount = 0;
  loading:boolean;
  message = '';
  constructor(private auth:AuthService,private user:UserService,private navCon:NavController,private toast:ToastController,private modal:ModalController) { }

  ngOnInit() {
    // Check if the user is in the check out page, then select the previous  orders tab
   if (window.location.pathname === '/check-out'){
     this.setSelectedTab('history');
   }else{
this.setSelectedTab('new');
   }
  this.bindNewOderItems();
  }
  // Set selected tab to new Oder as default
  setSelectedTab(tabName:string){
    this.selectedTab = tabName;
  }
  // Get user id and call getItemsInBasket to get their basket items from database
  bindNewOderItems(){
    this.loading = true;
    this.auth.getUser()
    .then((user) => {
        if (user){
          this.uid = user['uid'];
          this.itemsInBasket =  this.user.getItemsInBasket(user['uid']);
          this.loading = false;
          this.itemsInBasket.subscribe((e) => {
          this.totalItems = e.length;
          this.totalAmount = 0;
          e.forEach((item) => {
            // make a total price by counting each item, this will happen every time the list items changed, thats how firebase value changes work
            this.totalAmount += item['price'];
            
          })
          
           if (e.length > 0){
            // there are items in the basket show  message on how to remove an item
             console.log(e.length);
             this.message = 'Slide left any item to remove';
           }else{
             // there are no items added yet show no items message
            this.message = 'No items yet.';

           }
          });
        }
    }).catch(() => {
      // there is an error while getting the user information show error message
      this.message = 'Something went wrong';

    });
  }
   // remove and item from the basket by passing the id of it and call removeItemFromBasket in the user service 
  removeItem(id:string){    
    this.user.removeItemFromBasket(this.uid,id)
    .then(() => {
    this.itemsInBasket.subscribe((e) => {
      // check if no more item left
     if (e.length < 0){
      this.message = 'No items yet.'; 
     }
     
    });
    }).catch(() => {
      // error while removing an item 
      this.showMessage('Something went wrong')
    });
    

  }
  async showMessage(message:string){
    const toast = await this.toast.create({
      message:message,
      duration:2000,
      position:'top'
    });
    return await toast.present();
  }
  // Check out button clicked
  checkOutClicked(){
    this.modal.dismiss();
    this.navCon.navigateForward('/check-out');
  }
  // Close the basket modal
  closeClicked(){
    this.modal.dismiss();

  }



}
