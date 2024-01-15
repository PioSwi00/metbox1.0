import { Injectable } from '@angular/core';
import { AngularFireDatabase} from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private db: AngularFireDatabase) {}


  addProduct(product: any) {
    return this.db.list('products').push(product);
  }

  getProducts() {
    return this.db.list('products').valueChanges();
  }

  updateProduct(productId: string, updates: any) {
    return this.db.object(`products/${productId}`).update(updates);
  }
}
