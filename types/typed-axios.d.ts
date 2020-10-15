import { AxiosRequestConfig } from 'axios';
import { NuxtAxiosInstance } from '@nuxtjs/axios/types';

declare module 'typed-axios' {
  interface TypedNuxtAxiosInstance extends NuxtAxiosInstance {
    $request<T = unknown>(config: AxiosRequestConfig): Promise<T>;
    $get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
    $delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
    $head<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
    $options<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
    $post<T = unknown>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    $put<T = unknown>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    $patch<T = unknown>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  }
}
