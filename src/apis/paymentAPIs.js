import { apiAxios } from '@/utils/request.js'

// Shopping Page
export const getUserCartDetailsAPI = async (userId) => {
  try {
    const response = await apiAxios.get(`/carts/${userId}`)
    return response.data.data
  } catch {
    return null
  }
}

export const deleteUserCartDetailsAPI = async (userId, activityId) => {
  try {
    const response = await apiAxios.delete(`/carts/${userId}/${activityId}`)
    return response.data
  } catch {
    return null
  }
}

export const updateCartSelectionAPI = async (id, isSelected) => {
  try {
    const response = await apiAxios.put(`/carts/${id}/update-selection`, { isSelected })
    return response.data
  } catch {
    return null
  }
}

// Checkout Page
export const getCheckoutItemsAPI = async (uid) => {
  try {
    const response = await apiAxios.get(`/carts//${uid}/selected`)
    return response.data.data
  } catch {
    return null
  }
}

export const getWalletBalanceAPI = async (uid) => {
  try {
    const response = await apiAxios.get(`/payments/wallet/${uid}`)
    return response.data.data
  } catch {
    return null
  }
}

export const getOrderAPI = async (order_id) => {
  try {
    const response = await apiAxios.get(`/orders/${order_id}`)
    return response.data.data
  } catch {
    return null
  }
}

export const processOrder = async (orderData) => {
  try {
    const response = await apiAxios.post('payments/order/process', orderData)
    return response.data
  } catch {
    return null
  }
}
