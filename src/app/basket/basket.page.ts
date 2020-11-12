import { Component, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
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
  loading:boolean;
  message = '';
  constructor(private auth:AuthService,private user:UserService,private navCon:NavController) { }

  ngOnInit() {
  this.setSelectedTab();
  this.bindNewOderItems();
   
  }
  setSelectedTab(){
    this.selectedTab = 'new';
  }
  bindNewOderItems(){
    this.loading = true;
    this.auth.getUser()
    .then((user) => {
        if (user){
          this.uid = user['uid'];
          this.itemsInBasket =  this.user.getItemsInBasket(user['uid']);
          this.loading = false;
          this.itemsInBasket.subscribe((e) => {
                     
           if (e.length >= 0){
             console.log(e.length);
             this.message = 'Slide left any item to remove';
           }else{
            this.message = 'No items yet.';

           }
          });
        }
    }).catch(() => {
      this.message = 'Something went wrong';

    });
  }
  removeItem(key){
    console.log(key);
    
    this.user.removeItemFromBasket(this.uid,key);
    

  }



}
