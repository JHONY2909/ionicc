import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Estudiante {
  id?: string;
  nombre: string;
  correo: string;
  curso: string;
  telefono: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private path = 'estudiantes';

  constructor(private firestore: Firestore) {}

  // 🔹 Obtener todos los estudiantes
  getStudents(): Observable<Estudiante[]> {
    const estudiantesRef = collection(this.firestore, this.path);
    return collectionData(estudiantesRef, { idField: 'id' }) as Observable<Estudiante[]>;
  }

  // 🔹 Agregar un nuevo estudiante
  addStudent(estudiante: Estudiante) {
    const estudiantesRef = collection(this.firestore, this.path);
    return addDoc(estudiantesRef, estudiante);
  }

  // 🔹 Actualizar un estudiante
  updateStudent(estudiante: Estudiante) {
    const estudianteDoc = doc(this.firestore, `${this.path}/${estudiante.id}`);
    return updateDoc(estudianteDoc, { ...estudiante });
  }

  // 🔹 Eliminar un estudiante
  deleteStudent(id: string) {
    const estudianteDoc = doc(this.firestore, `${this.path}/${id}`);
    return deleteDoc(estudianteDoc);
  }
}
