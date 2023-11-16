import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBq-amFvN__jeZmvOTsO5aGqPcEO6LB3vk",
  authDomain: "sns-project-2d357.firebaseapp.com",
  projectId: "sns-project-2d357",
  storageBucket: "sns-project-2d357.appspot.com",
  messagingSenderId: "650771449616",
  appId: "1:650771449616:web:fac7cf50d92b6073c64795",
};

const app = initializeApp(firebaseConfig);

// Firebase와 연결된 인증 객체 가져오기
export const auth = getAuth(app);

// Storage와 Database에 대한 액세스 권한
export const storage = getStorage(app);
export const db = getFirestore(app);
