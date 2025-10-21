import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
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
  
  // MODAL PERSONALIZADO
  showModal = false;
  showEdit = false;
  modalData: Estudiante = { nombre: '', correo: '', curso: '', telefono: '' };

  constructor(
    private studentService: StudentService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    // FIX: Inicializar modalData correctamente
    this.modalData = { 
      nombre: '', 
      correo: '', 
      curso: '', 
      telefono: '' 
    };
  }

  ngOnInit() {
    this.loadStudents();
  }

  // CARGAR ESTUDIANTES
  loadStudents() {
    this.studentService.getStudents().subscribe(data => {
      this.estudiantes = data;
      this.estudiantesFiltrados = data;
    });
  }

  // ABRIR MODAL NUEVO
  openAddModal() {
    this.showEdit = false;
    this.modalData = { nombre: '', correo: '', curso: '', telefono: '' };
    this.showModal = true;
  }

  // ABRIR MODAL EDITAR
  openEditModal(estudiante: Estudiante) {
    this.showEdit = true;
    this.modalData = { ...estudiante };
    this.showModal = true;
  }

  // CERRAR MODAL
  closeModal() {
    this.showModal = false;
  }

  // GUARDAR ESTUDIANTE
  async saveStudent() {
    // VALIDACIÓN
    if (!this.modalData.nombre.trim() || !this.modalData.correo.trim() ||
        !this.modalData.curso.trim() || !this.modalData.telefono.trim()) {
      this.showToast('⚠️ Todos los campos son obligatorios', 'warning');
      return;
    }

    // VALIDAR EMAIL
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.modalData.correo)) {
      this.showToast('❌ El correo no es válido', 'danger');
      return;
    }

    try {
      if (this.showEdit && this.modalData.id) {
        // EDITAR
        await this.studentService.updateStudent(this.modalData);
        this.showToast('✅ Estudiante actualizado', 'success');
      } else {
        // NUEVO
        await this.studentService.addStudent(this.modalData);
        this.showToast('🎉 Estudiante registrado', 'success');
      }
      
      this.closeModal();
      this.loadStudents(); // RECARGAR LISTA
    } catch (error) {
      this.showToast('❌ Error al guardar', 'danger');
    }
  }

  // ELIMINAR
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
            this.showToast('🗑️ Estudiante eliminado', 'danger');
            this.loadStudents();
          },
        },
      ],
    });
    await alert.present();
  }

  // TOAST
  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }

  // INICIALES
  getInitials(nombre: string): string {
    return nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}