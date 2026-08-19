import axios from "axios";

export const mainApi = axios.create({
  baseURL: "http://localhost:5005",
  headers: {
    "Content-Type": "application/json",
  },
});
