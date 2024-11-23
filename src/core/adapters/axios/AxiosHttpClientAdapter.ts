import { injectable } from "inversify";
import type { DeleteHttpClientParams, GetHttpClientParams, HttpClient, IHttpResponse, PatchHttpClientParams, PostHttpClientParams, PutHttpClientParams } from "../../@types/httpClient";
import axiosInstance from "./axiosInstance";
import "reflect-metadata";


@injectable()
export class AxiosHttpClientAdapter implements HttpClient {

    async get<T>(params: GetHttpClientParams): Promise<IHttpResponse<T>> {
        const response = await axiosInstance.get<T>(params.url, {
            params: params.queryParams,
        });

        return {
            status: response.status,
            body: response.data,
        };
    }

    async post<T>(params: PostHttpClientParams): Promise<IHttpResponse<T>> {
        const response = await axiosInstance.post<T>(params.url, params.body);

        return {
            status: response.status,
            body: response.data,
        };
    }

    async put<T>(params: PutHttpClientParams): Promise<IHttpResponse<T>> {
        const response = await axiosInstance.put<T>(params.url, params.data);

        return {
            status: response.status,
            body: response.data,
        };
    }

    async patch<T>(params: PatchHttpClientParams): Promise<IHttpResponse<T>> {
        const response = await axiosInstance.patch<T>(params.url, params.data);

        return {
            status: response.status,
            body: response.data,
        };
    }

    async delete<T>(params: DeleteHttpClientParams): Promise<IHttpResponse<T>> {
        const response = await axiosInstance.delete<T>(params.url, {
            params: params.queryParams,
        });

        return {
            status: response.status,
            body: response.data,
        };
    }
}
