import { apiAxios } from '@/utils/request.js'

// Shopping Page
export const getUserCartDetailsAPI = async (userId) => {
  const response = await apiAxios.get(`/carts/${userId}`)
  return response.data
}

export const deleteUserCartDetailsAPI = async (userId, activityId) => {
  const response = await apiAxios.delete(`/carts/${userId}/${activityId}`)
  return response.data
}

export const updateCartSelectionAPI = async (id, isSelected) => {
  const response = await apiAxios.put(`/carts/${id}/update-selection`, { isSelected })
  return response.data
}

// Checkout Page
export const getCheckoutItemsAPI = async (uid) => {
  const response = await apiAxios.get(`/carts//${uid}/selected`)
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
