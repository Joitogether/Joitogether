import { apiAxios } from '@/utils/request.js'

export const getCartItemsAPI = async (uid) => {
  const response = await apiAxios.get(`/carts/${uid}`)
  return response.data
}

export const clearCartAPI = async (uid) => {
  const response = await apiAxios.delete(`/carts/${uid}/clear`)
  return response
}

export const getWalletBalanceAPI = async (uid) => {
  const response = await apiAxios.get(`/payments/wallet/${uid}`)
  return response.data
}

export const spendWalletBalanceAPI = async (uid, amount) => {
  const response = await apiAxios.put(`payments/wallet/${uid}/debit`, { amount })
  return response.data
}

export const createOrderAPI = async (orderData) => {
  const response = await apiAxios.post('/orders', orderData)
  return response
}

export const checkPendingOrderAPI = async (uid) => {
  const response = await apiAxios.get(`/orders/pending/${uid}`)
  return response.data
}

export const getOrderAPI = async (order_id) => {
  const response = await apiAxios.get(`/orders/${order_id}`)
  return response.data
}

export const updateOrderCompleteAPI = async (order_id) => {
  const response = await apiAxios.put(`/orders/${order_id}/complete`, { order_status: 'completed' })
  return response
}

export const registerApplicationAPI = async (activity_id) => {
  const response = await apiAxios.post(`/applications/register/${activity_id}`)
  return response
}
