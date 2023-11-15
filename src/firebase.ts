import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBq-amFvN__jeZmvOTsO5aGqPcEO6LB3vk",
  authDomain: "sns-project-2d357.firebaseapp.com",
  projectId: "sns-project-2d357",
  storageBucket: "sns-project-2d357.appspot.com",
  messagingSenderId: "650771449616",
  appId: "1:650771449616:web:fac7cf50d92b6073c64795",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
