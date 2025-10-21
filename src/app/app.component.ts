import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
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
}
