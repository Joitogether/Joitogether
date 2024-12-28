import { apiAxios } from '@/utils/request'

export const handleTopupAPI = async (data) => {
  try {
    const response = await apiAxios.post('/payments/topup/process', data)
    return response.data.data
  } catch (err) {
    console.error('處理訂單儲存錯誤：', err)
  }
}
export const createPaymentAPI = async (data) => {
  try {
    const response = await apiAxios.post('/payments/encrypt', data)
    return response.data.data
  } catch (err) {
    console.error('API 錯誤：', err)
    throw err
  }
}
export const addDepositAPI = async (uid, data) => {
  try {
    const response = await apiAxios.post(`/payments/wallet/${uid}/deposit`, data)
    return response
  } catch (err) {
    return err.response.data
  }
}

export const getWalletTransactionAPI = async (uid) => {
  const response = await apiAxios.get(`/payments/wallet/${uid}/transactions`)
  return response.data.data
}
// 建立訂單，暫時用不到
export const saveTopupAPI = async (uid, deposit) => {
  try {
    const response = await apiAxios.post(`/topups/orderdetail/${uid}`, deposit)
    console.log('儲值紀錄：', response.data.data)
    return response.data.data
  } catch (err) {
    console.error(err)
  }
}

export const getTopupRecordAPI = async (uid) => {
  const recordResponse = await apiAxios.get(`/topups/records/${uid}`)
  const walletResponse = await apiAxios.get(`/payments/wallet/${uid}`)
  return {
    recordData: recordResponse.data.data,
    walletBalance: walletResponse.data,
  }
}

// export const getNewebpayStatusAPI = async () => {
//   try {
//     const response = await apiAxios.post('/topups/newebpay_return')
//     console.log('藍新回傳資訊：', response)
//     return response.data
//   } catch (error) {
//     console.error('取得藍新狀態失敗：', error)
//     throw error
//   }
// }

//更新topup_record table status狀態＋新增錢包交易＋更新錢包餘額，成功會拿到201
export const updateTopupStatusAPI = async (uid, data) => {
  try {
    const response = await apiAxios.put(`/topups/updatestatus/${uid}`, data)
    // res拿到：wallet_id, action, amount, updated_balance, created_at,
    return response.data
  } catch (error) {
    console.error('更新儲值紀錄狀態失敗', error)
  }
}
