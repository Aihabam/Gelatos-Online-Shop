import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductsService } from '../Api/products.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {


  products:Observable<any[]>;
  loading:boolean;
  constructor(private productsService:ProductsService) { }

  ngOnInit() {
    this.loading = true;
   this.bindProducts();
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
   $event.target.disabled = true;
   $event.target.textContent = 'ADDING...';
   setTimeout(() => {
    $event.target.disabled = false;
    $event.target.textContent = 'ADD TO BASKET';
   }, 2000);
   
  }

}
