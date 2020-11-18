import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';


@Injectable({
  providedIn: 'root'
})
export class BackOfficeService {

  constructor(private firebase:AngularFireDatabase) {


   }
   // Create new order for the back office so they can prepare it
   public createOrder(order:object){
     return new Promise((resolve,reject) => {
      this.firebase.database.ref('back-office').child('orders')
      .push().set(order)
      .then(() => {
         resolve();
      }).catch((e) => {
        reject(e);
      });
     });
 
   }
}
