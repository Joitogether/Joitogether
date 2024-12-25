import { apiAxios } from '@/utils/request'

export const createPaymentAPI = async (data) => {
  try {
    const response = await apiAxios.post('/payments/encrypt', data)
    return response.data.data
  } catch (err) {
    console.error('API 錯誤：', err)
    throw err
  }
}
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
  const response = await apiAxios.get(`/topups/records/${uid}`)
  return response.data.data
}

export const addDepositAPI = async (uid, data) => {
  try {
    const response = await apiAxios.post(`/payments/wallet/${uid}/deposit`, data)
    console.log('加值結果', response)

    return response
  } catch (err) {
    return err.response.data
  }
}

export const getWalletBalanceAPI = async (uid) => {
  const response = await apiAxios.get(`/payments/wallet/${uid}`)
  return response.data.data
}

export const getNewebpayStatusAPI = async () => {
  try {
    const response = await apiAxios.post('/topups/newebpay_return')
    console.log('藍新回傳資訊：', response)
    return response.data
  } catch (error) {
    console.error('取得藍新狀態失敗：', error)
    throw error
  }
}
