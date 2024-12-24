import { apiAxios } from "@/utils/request";

export const createPaymentAPI = async(data) => {
  try {

    const response = await apiAxios.post('/payments/encrypt', data)
    return response.data.data

  } catch (err) {
    console.error('API 錯誤：', err)
    throw err
  }
}
export const saveTopupAPI = async(uid, data) => {
  try {
    const response = await apiAxios.post(`/topups/orderdetail/${uid}`, data)
    console.log('儲值紀錄：', response.data.data);
    return response.data.data
  } catch (err) {
    console.error(err);
  }
}

export const getTopupRecordAPI = async(uid) => {
  const response = await apiAxios.get(`/topups/records/${uid}`)
  return response.data.data;
}


export const addDepositAPI = async(uid) => {
  try {
    const response = await apiAxios.post(`/payments/deposit/${uid}`, data)
    console.log('加值結果', response);

    return response
  } catch (err) {
    return err.response.data
  }
}

export const getWalletBalanceAPI = async (uid) => {
  const response = await apiAxios.get(`/payments/wallet/${uid}`)
  return response.data.data
}
