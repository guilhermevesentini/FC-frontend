import { AxiosHttpClientAdapter } from "@/core/adapters/axios/AxiosHttpClientAdapter"
import { httpClientDI, type HttpClient } from "@/core/@types/httpClient"
import { ContainerModule } from "inversify"


export const axiosContainer = new ContainerModule((bind) => {
    bind<HttpClient>(httpClientDI).to(AxiosHttpClientAdapter)
})