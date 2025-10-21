import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, AlertController, ToastController } from '@ionic/angular';
import { StudentService, Estudiante } from '../../services/student';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  estudiantes: Estudiante[] = [];
  estudiantesFiltrados: Estudiante[] = [];
  searchTerm: string = '';

  constructor(
    private studentService: StudentService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.studentService.getStudents().subscribe(data => {
      this.estudiantes = data;
      this.estudiantesFiltrados = data; // inicialmente muestra todo
    });
  }

  // 🔹 Filtrar lista por búsqueda
  filtrarEstudiantes() {
    const term = this.searchTerm.toLowerCase();
    this.estudiantesFiltrados = this.estudiantes.filter(e =>
      e.nombre.toLowerCase().includes(term) ||
      e.correo.toLowerCase().includes(term) ||
      e.curso.toLowerCase().includes(term)
    );
  }

  // 🔹 Abrir modal para agregar estudiante
  async openAddModal() {
    const modal = await this.modalCtrl.create({
      component: AddStudentModal,
    });
    await modal.present();
  }

  // 🔹 Abrir modal para editar estudiante
  async openEditModal(estudiante: Estudiante) {
    const modal = await this.modalCtrl.create({
      component: AddStudentModal,
      componentProps: { estudiante },
    });
    await modal.present();
  }

  // 🔹 Eliminar estudiante
  async deleteStudent(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar',
      message: '¿Seguro que deseas eliminar este estudiante?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.studentService.deleteStudent(id);
            this.showToast('Estudiante eliminado correctamente 🗑️', 'danger');
          },
        },
      ],
    });
    await alert.present();
  }

  // 🔹 Toast genérico
  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}

// 🔸 Modal agregar / editar estudiante
@Component({
  selector: 'app-add-student-modal',
  template: `
  <ion-header>
    <ion-toolbar color="primary">
      <ion-title>{{ estudiante.id ? 'Editar Estudiante' : 'Nuevo Estudiante' }}</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <ion-item>
      <ion-input placeholder="Nombre" [(ngModel)]="estudiante.nombre" required></ion-input>
    </ion-item>
    <ion-item>
      <ion-input placeholder="Correo" type="email" [(ngModel)]="estudiante.correo" required></ion-input>
    </ion-item>
    <ion-item>
      <ion-input placeholder="Curso" [(ngModel)]="estudiante.curso" required></ion-input>
    </ion-item>
    <ion-item>
      <ion-input placeholder="Teléfono" [(ngModel)]="estudiante.telefono" required></ion-input>
    </ion-item>

    <ion-button expand="block" color="success" (click)="save()">
      {{ estudiante.id ? 'Actualizar' : 'Guardar' }}
    </ion-button>
    <ion-button expand="block" fill="clear" (click)="close()">Cancelar</ion-button>
  </ion-content>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class AddStudentModal {
  @Input() estudiante: Estudiante = { nombre: '', correo: '', curso: '', telefono: '' };

  constructor(
    private modalCtrl: ModalController,
    private studentService: StudentService,
    private toastCtrl: ToastController
  ) {}

  async save() {
    if (!this.estudiante.nombre.trim() || !this.estudiante.correo.trim() ||
        !this.estudiante.curso.trim() || !this.estudiante.telefono.trim()) {
      this.showToast('⚠️ Todos los campos son obligatorios', 'warning');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.estudiante.correo)) {
      this.showToast('❌ El correo ingresado no es válido', 'danger');
      return;
    }

    if (this.estudiante.id) {
      await this.studentService.updateStudent(this.estudiante);
      this.showToast('Estudiante actualizado correctamente ✅', 'warning');
    } else {
      await this.studentService.addStudent(this.estudiante);
      this.showToast('Estudiante agregado correctamente 🎉', 'success');
    }

    this.close();
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
