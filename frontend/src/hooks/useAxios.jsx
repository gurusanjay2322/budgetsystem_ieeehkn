import { useState, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

export default function useAxios() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async ({ url, method = "GET", data = null, params = {} }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance({
        url,
        method,
        data,
        params,
      });

      return response.data;
    } catch (err) {
      setError(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, request };
}
