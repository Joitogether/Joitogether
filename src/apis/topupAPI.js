import { apiAxios } from '@/utils/request'

export const handleTopupAPI = async (data) => {
  try {
    const response = await apiAxios.post('/topups/encrypt/process', data)
    return response.data.data
  } catch (err) {
    console.error('處理訂單儲存錯誤：', err)
  }
}
export const createPaymentAPI = async (data) => {
  try {
    const response = await apiAxios.post('/payments/encrypt', data)
    return response.data.data
  } catch {
    return null
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

export const getTopupRecordAPI = async (uid) => {
  try {
    const response = await apiAxios.get(`/topups/records/${uid}`)
    return response.data.data
  } catch {
    return null
  }
}
