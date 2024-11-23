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
  providerData: {
    providerId: 'password', // 驗證提供者類型
    uid: 'testuser@example.com', // 驗證提供者的ID
    displayName: '測試用戶', // 驗證提供者中的名稱
    email: 'testuser@example.com', // 驗證提供者中的電子郵件
    photoURL: 'https://via.placeholder.com/150', // 驗證提供者中的頭像
    phoneNumber: '0987654321', // 驗證提供者中的手機號碼
  },
  roles: ['user'], // 用戶角色（例：user, admin）
  stsTokenManager: {
    refreshToken: 'abcd-efgh-ijkl-mnop-qrstuv', // 刷新Token
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // JWT訪問Token
    expirationTime: 1732382501288, // Token過期時間
  },
}
