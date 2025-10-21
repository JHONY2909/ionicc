import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User | null = null;

  constructor(private auth: Auth, private router: Router) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
    });
  }

  // ✅ Obtener instancia de Auth para uso externo
  getAuth() {
    return this.auth;
  }

  // ✅ Registrar usuario nuevo (email y contraseña)
  async register(email: string, password: string) {
    return await createUserWithEmailAndPassword(this.auth, email, password);
  }

  // ✅ Iniciar sesión con email y contraseña
  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  // ✅ Iniciar sesión con Google
  async loginWithGoogle() {
    console.log('🔐 Configurando proveedor de Google...');
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');

    console.log('📱 Iniciando popup de autenticación...');
    const result = await signInWithPopup(this.auth, provider);
    console.log('👤 Usuario autenticado:', result.user.email);

    return result;
  }

  // ✅ Cerrar sesión
  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  // ✅ Obtener usuario actual
  getUser() {
    return this.currentUser;
  }
}
