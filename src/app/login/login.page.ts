import { Component, OnInit,ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginPage implements OnInit {
  credentials!:FormGroup;
  constructor(
    private fb:FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService:AuthService,
    private router: Router
    )
    {


    }
  get email(){
    return this.credentials.get('email');
  }

  get password(){
    return this.credentials.get('password')
  }



  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  async register() {
    const loading=await this.loadingController.create();
    await loading.present();
    const user = await this.authService.register(this.credentials.value);
    await loading.dismiss();

    if(user){
      this.router.navigateByUrl('/home',{replaceUrl:true});
    }else{
      this.showAlert('Rejestracja nieudana', 'Wprowadź poprawny email i hasło!')
    }

  }
  async loginWithGoogle() {
    const loading = await this.loadingController.create();
    await loading.present();
    const user = await this.authService.loginWithGoogle();
    await loading.dismiss();

    if (user) {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } else {
      this.showAlert('Google Login failed', 'Try Again!')
    }
  }
  async login() {

    const loading=await this.loadingController.create();
    await loading.present();
    const user = await this.authService.login(this.credentials.value);
    await loading.dismiss();

    if(user){
      this.router.navigateByUrl('/home',{replaceUrl:true});
    }else{
      this.showAlert('Login failed', 'Wprowadź dane logowania ponownie, lub jeśli nie masz konta, to wprowadź je po raz 1!')
    }
  }
  async showAlert(header:string,message:string){
    const alert=await this.alertController.create(
      {
        header,
        message,
        buttons:['OK']
      });
      await alert.present();

  }

}
