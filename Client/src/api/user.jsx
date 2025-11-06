import axios from "axios";

const API_URL = "http://localhost:3000/api/users";

// ดึง tenant ตาม authId ที่เก็บไว้
export const getTenantByAuthId = async () => {
//   const authId = localStorage.getItem("authId"); // เก็บตอน login
  const res = await axios.get(`${API_URL}/test12345`);
  return res.data;
};
