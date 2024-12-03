import axios from "axios";

export const UserRateApi = async (rating_id) => {
  try {
    const response = await axios.get(`http://localhost:3030/ratings/${rating_id}`)
  }
};