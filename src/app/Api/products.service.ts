import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {


  constructor(private dataBase:AngularFireDatabase) {

   }
   /*
   Get products from firebase database using  valueChanges()
What is it? - Returns an Observable of data as a synchronized array of JSON objects. All Snapshot metadata is stripped and just the method provides only the data.

Why would you use it? - When you just need a list of data. No snapshot metadata is attached to the resulting array which makes it simple to render to a view.
   */
   getProducts(){
      return this.dataBase.list('products').valueChanges();
   }
}
