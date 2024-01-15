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
        console.log('All products:', products);
        this.products = products.filter((product: any) => product.Owner === userUid);

        // Usunięcie cudzysłowów z pól Name i State
        this.products.forEach((product: any) => {
          product.Name = product.Name.replace(/["']/g, " ");
          product.State = product.State.replace(/["']/g, " ");
        });

        console.log('User products:', this.products);
      });
    }

    getProgressBarValue(products: any[]): number {
      const stateValues = ["Przyjęcie zamówienia", "Rozpoczęcie produkcji", "Produkcja", "Przygotowanie do wysłania", "Wysyłka"];
      const totalStates = stateValues.length;

      if (products && products.length > 0) {

        const productState = products[0].state; // Assuming state is a property of the product object

        const index = stateValues.indexOf(productState);
        if (index !== -1) {
          // Adding 1 to index and dividing by the total number of states to get the percentage
          return ((index + 1) / totalStates) * 100;
        }
      }

      // Return 0 or any default value if the state is not found or products array is empty
      return 0;
    }




    async logout(){
     await this.authService.logout();
      this.router.navigateByUrl('/',{ replaceUrl:true });
    }
    async changeImage(){}

}
