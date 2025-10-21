import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from './services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, CommonModule],
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Verificar estado de autenticación al iniciar la app
    console.log('🚀 App inicializada, verificando autenticación...');

    // Escuchar cambios en el estado de autenticación
    this.authService.getAuth().onAuthStateChanged((user) => {
      console.log('🔐 Estado de autenticación cambió:', user ? 'Usuario logueado' : 'Usuario no logueado');

      this.isAuthenticated = !!user; // Actualizar estado de autenticación

      if (user) {
        console.log('👤 Usuario autenticado:', user.email);
        // Si estamos en login/register y el usuario está autenticado, redirigir a home
        const currentUrl = this.router.url;
        if (currentUrl === '/login' || currentUrl === '/register' || currentUrl === '/') {
          console.log('🏠 Redirigiendo a home desde app.component...');
          this.router.navigate(['/home']);
        }
      } else {
        console.log('🚪 Usuario no autenticado, asegurando estar en login...');
        // Si no estamos en login/register, redirigir a login
        const currentUrl = this.router.url;
        if (currentUrl !== '/login' && currentUrl !== '/register') {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  async logout() {
    try {
      await this.authService.logout();
      console.log('✅ Logout exitoso');
    } catch (error) {
      console.error('❌ Error al hacer logout:', error);
    }
  }
}
