import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async register() {
    try {
      await this.authService.register(this.email, this.password);
      const toast = await this.toastCtrl.create({
        message: 'Registro exitoso ✅',
        duration: 2000,
        color: 'success'
      });
      toast.present();
      this.router.navigate(['/home']);
    } catch (err: any) {
      const toast = await this.toastCtrl.create({
        message: 'Error: ' + err.message,
        duration: 3000,
        color: 'danger'
      });
      toast.present();
    }
  }
}
