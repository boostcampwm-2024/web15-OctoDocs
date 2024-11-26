import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const Get = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  const response = await axiosInstance.get(url, config);
  return response;
};

export const Post = async <T, D>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  const response = await axiosInstance.post(url, data, config);
  return response;
};

export const Delete = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  const response = await axiosInstance.delete(url, config);
  return response;
};

export const Patch = async <T, D>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  const response = await axiosInstance.patch(url, data, config);
  return response;
};

export const Put = async <T, D>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  const response = await axiosInstance.put(url, data, config);
  return response;
};
