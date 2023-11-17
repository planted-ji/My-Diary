import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAOf5mk70U5CdImPFZZQrRy3yh4wnUpY8s",
  authDomain: "my-personal-diary-project.firebaseapp.com",
  projectId: "my-personal-diary-project",
  storageBucket: "my-personal-diary-project.appspot.com",
  messagingSenderId: "432057627733",
  appId: "1:432057627733:web:6eb703be75f44c5d2450dc",
};

const app = initializeApp(firebaseConfig);

// Firebase와 연결된 인증 객체 가져오기
export const auth = getAuth(app);

// Storage와 Database에 대한 액세스 권한
export const storage = getStorage(app);
export const db = getFirestore(app);
