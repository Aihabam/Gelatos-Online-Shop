import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal/lib/models/paypal-models';
import { environment } from 'src/environments/environment';
import { BasketPage } from '../basket/basket.page';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.page.html',
  styleUrls: ['./check-out.page.scss'],
})
export class CheckOutPage implements OnInit {
  public payPalConfig?: IPayPalConfig;

  constructor(private modal:ModalController) { }

  ngOnInit() {
    this.initConfig();
  }
  setStartState(){

  }
  private initConfig(): void {
    this.payPalConfig = {
    currency: 'USD',
    clientId: environment.payPal.id,
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: '9.99',
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: '9.99'
              }
            }
          },
          items: [
            {
              name: 'Gelatos',
              quantity: '1',
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'USD',
                value: '9.99',
              },
            }
          ]
        }
      ]
    },
    advanced: {
      commit: 'true'
    },
    style: {
      label: 'paypal',
      layout: 'vertical'
    },
    onApprove: (data, actions) => {
      console.log('onApprove - transaction was approved, but not authorized', data, actions);
      actions.order.get().then(details => {
        console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data) => {
      console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);

    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
    },
    onError: err => {
      console.log('OnError', err);
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
    },
  };
  }
  async displayBasket(){
    // create the modal and display it 
    const basket = await this.modal.create({
      component:BasketPage
    });
    return await basket.present();
  }
}
