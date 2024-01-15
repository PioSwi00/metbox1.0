import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from  'src/app/services/products.service'

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {
  product: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const productId = params.get('id'); // Załóżmy, że używasz 'id' jako parametru
      this.loadProductDetails(productId);
    });
  }

  loadProductDetails(productId: string | null) {
    if (productId) {
      this.productService.getProducts().subscribe(
        (product) => {
          this.product = product;
        },
        (error) => {
          console.error('Error loading product details', error);
        }
      );
    }
  }
}
