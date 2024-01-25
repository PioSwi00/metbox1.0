import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {
  productDetails: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private db: AngularFireDatabase // Wstrzykiwanie AngularFireDatabase
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params['name']) {
        const productName = params['name']; // Pobranie nazwy produktu z parametrów adresu URL

        // Pobranie szczegółów produktu z bazy danych na podstawie nazwy
        this.getProductDetails(productName);
      }
    });
  }

  getProductDetails(productName: string) {
    const productRef = this.db.object(`/Produkty/${productName}`); // Referencja do produktu w bazie danych

    productRef.valueChanges().subscribe((product: any) => {
      if (product) {
        this.productDetails = product;
      } else {
        // Obsługa przypadku, gdy nie znaleziono produktu o podanej nazwie
        console.log('Nie znaleziono produktu o podanej nazwie.');
      }
    });
  }

}
