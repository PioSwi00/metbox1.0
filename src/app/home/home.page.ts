import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AvatarService } from '../services/avatar.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AngularFireDatabase} from '@angular/fire/compat/database';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomePage implements OnInit{
  profile=null;
  products: any = [];

  constructor(

    private avatarService:AvatarService,
    private loadingController:LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private db: AngularFireDatabase ) { }

    async ngOnInit() {
      this.loadData();

    }

    async loadData() {
      const user = await this.authService.getUser();
        console.log('Logged in user:', user);
      if (user) {
        const userUid = user.uid;

        this.getProductsForUser(userUid);
      } else {

      }

    }
    getProductsForUser(userUid: string) {
      const productsRef = this.db.list('/Produkty');
      productsRef.valueChanges().subscribe((products: any[]) => {


        this.products = products.filter((product: any) => product.Owner === userUid);

        this.products.forEach((product: any) => {
          product.Name = product.Name.replace(/["']/g, " ");
          product.State = product.State.replace(/["']/g, " ");


          switch (product.State) {
            case "Zamówienie Przyjęte":
              product.ProgressBarValue = 20;
              break;
            case "Rozpoczęcie produkcji":
              product.ProgressBarValue = 40;
              break;
            case "Produkcja":
              product.ProgressBarValue = 60;
              break;
            case "Przygotowanie do wysłania":
              product.ProgressBarValue = 80;
              break;
            case "Send":
              product.ProgressBarValue = 100;
              break;
            default:
              product.ProgressBarValue = 0;
              break;
          }
        });


        console.log('User products:', this.products);
      });
    }
    showProductDetails(productName: string) {
      console.log('Product Name:', productName);
      this.router.navigateByUrl('/product-details/' + encodeURIComponent(productName));
    }





    async logout(){
     await this.authService.logout();
      this.router.navigateByUrl('/',{ replaceUrl:true });
    }
    async changeImage(){}

}
