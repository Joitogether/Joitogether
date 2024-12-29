import { apiAxios } from '@/utils/request'

export const createPaymentAPI = async (data) => {
  try {
    const response = await apiAxios.post('/payments/encrypt', data)
    return response.data.data
  } catch {
    return null
  }
}
export const saveTopupAPI = async (uid, deposit) => {
  try {
    const response = await apiAxios.post(`/topups/orderdetail/${uid}`, deposit)
    return response.data.data
  } catch {
    return null
  }
}

export const getTopupRecordAPI = async (uid) => {
  try {
    const response = await apiAxios.get(`/topups/records/${uid}`)
    return response.data.data
  } catch {
    return null
  }
}

export const addDepositAPI = async (uid, data) => {
  try {
    return await apiAxios.post(`/payments/deposit/${uid}`, data)
  } catch {
    return null
  }
}

export const getNewebpayStatusAPI = async () => {
  try {
    const response = await apiAxios.post('/topups/newebpay_return')
    return response.data
  } catch {
    return null
  }
}
