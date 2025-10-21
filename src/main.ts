import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { IonicModule } from '@ionic/angular';
import { environment } from './environments/environment';

// 🔥 Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';

// ✅ Importar iconos de Ionicons
import { addIcons } from 'ionicons';
import {
  schoolOutline,
  checkmarkCircle,
  mailOutline,
  lockClosedOutline,
  logInOutline,
  logoGoogle,
  school,
  mail,
  lockClosed,
  rocket,
  arrowBack,
  logOutOutline
} from 'ionicons/icons';

// Registrar iconos
addIcons({
  schoolOutline,
  checkmarkCircle,
  mailOutline,
  lockClosedOutline,
  logInOutline,
  logoGoogle,
  school,
  mail,
  lockClosed,
  rocket,
  arrowBack,
  logOutOutline
});

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(IonicModule.forRoot()),

    // ✅ Firebase debe ir así (sin importProvidersFrom)
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ],
}).catch(err => console.error(err));
