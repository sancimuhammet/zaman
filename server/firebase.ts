import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, addDoc, getDocs, getDoc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import type { SimulationForm, SimulationResults } from '@shared/schema';

const firebaseConfig = {
  apiKey: "AIzaSyBtLB0VnW7Ady_oYcQ5G1hhvWFxt3Bglfs",
  authDomain: "zaman-9903a.firebaseapp.com",
  projectId: "zaman-9903a",
  storageBucket: "zaman-9903a.firebasestorage.app",
  messagingSenderId: "4629085164",
  appId: "1:4629085164:web:a9d4b2dea329b50ebe9ec9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export interface FirebaseSimulation extends SimulationForm {
  id?: string;
  title: string;
  results: SimulationResults;
  category: string;
  successRate: number;
  createdAt: Timestamp;
}

export class FirebaseStorage {
  private simulationsCollection = collection(db, 'simulations');

  async createSimulation(data: Omit<FirebaseSimulation, 'id' | 'createdAt'>): Promise<FirebaseSimulation> {
    const simulationData = {
      ...data,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(this.simulationsCollection, simulationData);
    
    return {
      id: docRef.id,
      ...simulationData
    };
  }

  async getAllSimulations(): Promise<FirebaseSimulation[]> {
    const q = query(this.simulationsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirebaseSimulation));
  }

  async getSimulation(id: string): Promise<FirebaseSimulation | null> {
    const docRef = doc(this.simulationsCollection, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as FirebaseSimulation;
    }
    
    return null;
  }

  async deleteSimulation(id: string): Promise<void> {
    const docRef = doc(this.simulationsCollection, id);
    await deleteDoc(docRef);
  }
}

export const firebaseStorage = new FirebaseStorage();