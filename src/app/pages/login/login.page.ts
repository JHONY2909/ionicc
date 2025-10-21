import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  emailFocused: boolean = false;
  passwordFocused: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  async login() {
    // Validación de entrada
    if (!this.email.trim() || !this.password.trim()) {
      await this.showToast('Por favor, completa todos los campos', 'danger');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      await this.authService.login(this.email, this.password);
      await this.showToast('Inicio de sesión exitoso 🎉', 'success');
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 2000); // Retraso para mostrar el toast
    } catch (err: any) {
      await this.showToast(`Error: ${err.message || 'No se pudo iniciar sesión'}`, 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  async loginGoogle() {
    console.log('🔄 Iniciando proceso de login con Google...');

    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión con Google...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      console.log('📡 Llamando a authService.loginWithGoogle()...');
      const result = await this.authService.loginWithGoogle();
      console.log('✅ Login con Google exitoso, resultado:', result);

      // Verificar que el usuario esté autenticado
      const currentUser = this.authService.getUser();
      console.log('👤 Usuario actual después del login:', currentUser?.email);

      await this.showToast('Inicio de sesión con Google exitoso ✅', 'success');

      console.log('⏳ Esperando 2 segundos antes de redirigir...');
      setTimeout(() => {
        console.log('🚀 Redirigiendo a /home...');
        this.router.navigate(['/home']).then(success => {
          console.log('✅ Navegación exitosa:', success);
          if (!success) {
            console.error('❌ Error en navegación - posible problema de rutas');
            // Intentar navegación alternativa
            this.router.navigateByUrl('/home').then(altSuccess => {
              console.log('🔄 Navegación alternativa exitosa:', altSuccess);
            }).catch(altErr => {
              console.error('❌ Error en navegación alternativa:', altErr);
            });
          }
        }).catch(err => {
          console.error('❌ Error al navegar:', err);
          // Intentar navegación forzada
          console.log('🔄 Intentando navegación forzada...');
          window.location.href = '/home';
        });
      }, 2000); // Retraso para mostrar el toast

    } catch (err: any) {
      console.error('❌ Error en login con Google:', err);
      await this.showToast(`Error: ${err.message || 'No se pudo iniciar sesión con Google'}`, 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'bottom',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }
}