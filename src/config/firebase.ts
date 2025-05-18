import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Substitua estas configurações pelas suas credenciais do Firebase
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "seu-messaging-sender-id",
  appId: "seu-app-id"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Storage
export const storage = getStorage(app);

export default app; 