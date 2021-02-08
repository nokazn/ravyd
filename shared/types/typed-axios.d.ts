import type { AxiosRequestConfig } from 'axios';
import { NuxtAxiosInstance } from '@nuxtjs/axios/types';

// TODO: 書き換える
// type Params = Record<string, unknown> | undefined;
type Params = unknown;

declare module 'typed-axios' {
  type TypedAxiosRequestConfig<P extends Params, D = unknown> = AxiosRequestConfig & {
    params?: P;
    data?: D;
  };
  interface TypedNuxtAxiosInstance extends NuxtAxiosInstance {
    $request<R = unknown, D = unknown, P extends Params = unknown>(config: TypedAxiosRequestConfig<P, D>): Promise<R>;
    $get<R = unknown, P extends Params = unknown>(url: string, config?: TypedAxiosRequestConfig<P>): Promise<R>;
    $delete<R = unknown, P extends Params = unknown>(url: string, config?: TypedAxiosRequestConfig<P>): Promise<R>;
    $head<R = unknown, P extends Params = unknown>(url: string, config?: TypedAxiosRequestConfig<P>): Promise<R>;
    $options<R = unknown, P extends Params = unknown>(url: string, config?: TypedAxiosRequestConfig<P>): Promise<R>;
    $post<R = unknown, D = unknown, P extends Params = unknown>(
      url: string,
      data?: D,
      config?: TypedAxiosRequestConfig<P>,
    ): Promise<R>;
    $put<R = unknown, D = unknown, P extends Params = unknown>(
      url: string,
      data?: D,
      config?: TypedAxiosRequestConfig<P>,
    ): Promise<R>;
    $patch<R = unknown, D = unknown, P extends Params = unknown>(
      url: string,
      data?: D,
      config?: TypedAxiosRequestConfig<P>,
    ): Promise<R>;
  }
}
