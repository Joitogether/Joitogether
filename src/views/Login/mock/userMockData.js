// 用戶註冊資料（給前端的版本）
export const mockUserProfile = {
  uid: 'abcd1234efgh5678ijkl', // 唯一用戶ID
  email: 'testuser@example.com', // 用戶註冊的電子郵件
  emailVerified: true, // 電子郵件是否已驗證
  fullName: '測試用戶', // 用戶姓名
  displayName: '用戶123', // 使用者代號
  phoneNumber: '0987654321', // 用戶手機號碼
  photoURL: 'https://via.placeholder.com/150', // 用戶頭像URL
  metadata: {
    createdAt: '1732381951301', // 用戶註冊時間（時間戳）
    lastLoginAt: '1732382501288', // 最後一次登入時間（時間戳）
  },
}

// 用戶註冊資料（給後端的版本）
export const mock_user_profile_for_backend = {
  uid: 'abcd1234efgh5678ijkl', // 唯一用戶ID
  email: 'testuser@example.com', // 用戶註冊的電子郵件
  email_verified: true, // 電子郵件是否已驗證
  full_name: '測試用戶', // 用戶姓名
  display_name: '用戶123', // 使用者代號
  phone_number: '0987654321', // 用戶手機號碼
  photo_url: 'https://via.placeholder.com/150', // 用戶頭像URL
  metadata: {
    created_at: '1732381951301', // 用戶註冊時間（時間戳）
    last_login_at: '1732382501288', // 最後一次登入時間（時間戳）
  },
}
