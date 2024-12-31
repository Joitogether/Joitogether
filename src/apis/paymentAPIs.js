import { apiAxios } from '@/utils/request.js'

// Shopping Page
export const getUserCartDetailsAPI = async (userId) => {
  const { data } = await apiAxios.get(`/carts/${userId}`)
  return data.data
}

export const deleteUserCartDetailsAPI = async (userId, activityId) => {
  const { data } = await apiAxios.delete(`/carts/${userId}/${activityId}`)
  return data
}

export const updateCartSelectionAPI = async (id, isSelected) => {
  const { data } = await apiAxios.put(`/carts/${id}/update-selection`, { isSelected })
  return data
}

// Checkout Page
export const getCheckoutItemsAPI = async (uid) => {
  const { data } = await apiAxios.get(`/carts//${uid}/selected`)
  return data.data
}

export const getWalletBalanceAPI = async (uid) => {
  const { data } = await apiAxios.get(`/payments/wallet/${uid}`)
  return data.data
}

export const getOrderAPI = async (order_id) => {
  const { data } = await apiAxios.get(`/orders/${order_id}`)
  return data.data
}

export const processOrder = async (orderData) => {
  const { data } = await apiAxios.post('payments/order/process', orderData)
  return data
}
