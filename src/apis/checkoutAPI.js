import { apiAxios } from '@/utils/request.js'

export const getCartItemsAPI = async (uid) => {
  const response = await apiAxios.get(`/carts/${uid}`)
  return response.data
}

export const getWalletBalanceAPI = async (uid) => {
  const response = await apiAxios.get(`/payments/wallet/${uid}`)
  return response.data
}

export const getOrderAPI = async (order_id) => {
  const response = await apiAxios.get(`/orders/${order_id}`)
  return response.data.data
}

export const processOrder = async (orderData) => {
  const response = await apiAxios.post('payments/order/process', orderData)
  return response.data
}
