import { apiAxios } from '@/utils/request.js'

export const getCartItemsAPI = async (uid) => {
  const response = await apiAxios.get(`/carts/${uid}`)
  // console.log('購物車資料獲取成功', response.data)
  return response.data
}

export const getWalletBalanceAPI = async (uid) => {
  const response = await apiAxios.get(`/payments/wallet/${uid}`)
  return response.data
}

export const createOrderAPI = async (orderData) => {
  const response = await apiAxios.post('/orders', orderData)
  // console.log('訂單資料傳送成功', response.data)
  return response
}
