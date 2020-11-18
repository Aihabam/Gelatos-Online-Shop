import {
  Component,
  OnInit
} from '@angular/core';
import {
  ModalController,
  NavController,
  ToastController
} from '@ionic/angular';
import {
  ICreateOrderRequest,
  IPayPalConfig
} from 'ngx-paypal/lib/models/paypal-models';
import {
  Observable
} from 'rxjs';
import {
  environment
} from 'src/environments/environment';
import {
  AuthService
} from '../Api/auth.service';
import { BackOfficeService } from '../Api/back-office.service';
import {
  UserService
} from '../Api/user.service';
import {
  BasketPage
} from '../basket/basket.page';
import {
  ValidateService
} from '../Services/validate.service';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.page.html',
  styleUrls: ['./check-out.page.scss'],
})
export class CheckOutPage implements OnInit {
  loading: boolean;
  paid: boolean;
  confirmed: boolean;
  firstName:string;
  uid:string;
  phoneNumber: string;
  shippingAddress: string;
  itemsInBasket: Observable < any[] > ;
  totalItems: any;
  totalAmount: any;
  orderItems  = [];
  orderCreated:boolean;
  confirmAble:boolean;
  constructor(private modal: ModalController,private navCon:NavController,private backOffice:BackOfficeService, private auth: AuthService, private user: UserService, private toast: ToastController) {}

  ngOnInit() {
    this.setStartState();

  }
  setStartState() {
    this.confirmAble = false;
    this.orderCreated = false;
    this.loading = true;
    this.paid = false;
    this.confirmed = false;
    this.phoneNumber = '';
    this.shippingAddress = '';
    this.getUserId();
  }
  getUserId() {
    this.auth.getUser()
      .then((user) => {
        this.uid = user['uid'];
        this.user.getUserInformation(user['uid'])
          .then((userInfo) => {
            
            this.firstName = userInfo['firstName'];
            this.phoneNumber = userInfo['phoneNumber'];
            this.shippingAddress = userInfo['address'];
            this.confirmAble = true;
            this.getAndBindNewOderItems(user['uid']);
          });
      }).catch(() => {
        this.showMessage('Something went wrong, please try again later.')
      });
  }
  // Get user id and call getItemsInBasket to get their basket items from database
  getAndBindNewOderItems(uid: string) {

    this.itemsInBasket = this.user.getItemsInBasket(uid);
    this.loading = false;
    this.itemsInBasket.subscribe((e) => {
      this.totalItems = e.length;
      this.totalAmount = 0;
      e.forEach((item) => {
        // add all items to array for order record
        this.orderItems.push(item);
        // make a total price by counting each item, this will happen every time the list items changed, thats how firebase value changes work
        this.totalAmount += item['price'];
      });
    });
    this.loading = false;

  }
  confirmClicked() {
    if (ValidateService.isEmpty(this.phoneNumber)) {
      this.showMessage('Please enter your phone number');
    } else if (ValidateService.isEmpty(this.shippingAddress)) {
      this.showMessage('Please enter your address');
    } else if(this.totalItems < 5) {
      this.showMessage('Minimum order 5 items');
    }else{
      this.loading = true;
      let order = {
        firstName:this.firstName,
        phoneNumber:this.phoneNumber,
        shippingAddress:this.shippingAddress,
        customerId: this.uid,
        totalItems:this.totalItems,
        totalAmount:this.totalAmount,
        items:this.orderItems,
        createdOn:Date.now(),
        status:'preparing'
      }
      this.backOffice.createOrder(order)
      .then(() => {
        this.user.recordOrder(this.uid,order)
        .then(() => {
          this.loading = false;
          this.confirmed = true;
          this.orderCreated = true;
          this.user.clearUserBasket(this.uid);
        });
      }).catch((e) => {
        this.showMessage('Something went wrong, please try again later.')

      });
      
    }
  }
  async displayBasket() {
    // create the modal and display it 
    const basket = await this.modal.create({
      component: BasketPage
    });
    return await basket.present();
  }
  async showMessage(message: string) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
    });
    return await toast.present();
  }
  closeClicked(){
    this.navCon.navigateRoot('tabs/shop')
  }
}