// // 用戶驗證--註冊、上傳大頭照
// import { auth, db } from './firebaseConfig.js'
// import { createUserWithEmailAndPassword } from 'firebase/auth'
// import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'

// // 密碼驗證-檢查密碼唯一性
// async function hashPassword(password) {
//   if (!crypto || !crypto.subtle || !crypto.subtle.digest) {
//     throw new Error('瀏覽器不支持密碼哈希算法')
//   }

//   const encoder = new TextEncoder()
//   const data = encoder.encode(password)
//   const hashBuffer = await crypto.subtle.digest('SHA-256', data)
//   const hashArray = Array.from(new Uint8Array(hashBuffer))
//   return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
// }

// // 用戶註冊
// const registerUser = async (email, password) => {
//   try {
//     const hashedPassword = await hashPassword(password)
//     if (!hashedPassword) throw new Error('無法生成密碼哈希值')

//     // 檢查是否有相同的密碼
//     const passwordsRef = collection(db, 'passwords')
//     const q = query(passwordsRef, where('hashedPassword', '==', hashedPassword))
//     const querySnapshot = await getDocs(q)

//     if (!querySnapshot.empty) {
//       throw new Error('密碼已被使用，請重新選擇另外一組新密碼')
//     }
//     // 創建新用戶
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password)

//     // 儲存哈希值
//     await addDoc(passwordsRef, {
//       hashedPassword: hashedPassword,
//       timestamp: serverTimestamp(),
//     })

//     return userCredential.user
//   } catch (error) {
//     console.log('用戶註冊失敗：', error.message)
//     if (error.code) {
//       console.error('Firebase 錯誤代碼：', error.code)
//     }
//     throw error
//   }
// }

// export default registerUser

// 註冊功能-不含密碼唯一性驗證
import { auth } from './firebaseConfig.js'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    console.log('用戶註冊失敗：' + error.message)
    throw error
  }
}

export default registerUser
