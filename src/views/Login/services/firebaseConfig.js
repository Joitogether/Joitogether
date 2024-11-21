// firebase 初始化配置
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDF4tbZWcaAUra9qYsqSOMOLZgWjnS46nA',
  authDomain: 'login-demo1-9d3cb.firebaseapp.com',
  projectId: 'login-demo1-9d3cb',
  storageBucket: 'login-demo1-9d3cb.firebasestorage.app',
  messagingSenderId: '426188985322',
  appId: '1:426188985322:web:94d7e4b003a13e8c3c5893',
  measurementId: 'G-0ESWEH0N90',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const storage = getStorage(app)

export { auth, storage }
