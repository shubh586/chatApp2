import { HOST } from "../utils/constant.js";
import axios from "axios";
export const apiClient = axios.create({
  baseURL: HOST,
  withCredentials: true,
});
