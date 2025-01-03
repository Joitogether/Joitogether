import { apiAxios } from '@/utils/request'

export const handleTopupAPI = async (data) => {
  const response = await apiAxios.post('/topups/encrypt/process', data)
  return response.data.data
}
export const createPaymentAPI = async (data) => {
  const response = await apiAxios.post('/payments/encrypt', data)
  return response.data.data
}

export const addDepositAPI = async (uid, data) => {
  const response = await apiAxios.post(`/payments/wallet/${uid}/deposit`, data)
  return response
}

export const getWalletTransactionAPI = async (uid) => {
  const response = await apiAxios.get(`/payments/wallet/${uid}/transactions`)
  return response.data.data
}

export const getTopupRecordAPI = async (uid) => {
  const response = await apiAxios.get(`/topups/records/${uid}`)
  return response.data.data
}
