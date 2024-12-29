import { httpClientDI, HttpStatusCode, type HttpClient, type IDefaultHttpResponse, type IHttpResponse } from "@/core/@types/httpClient";
import { inject, injectable } from "inversify";
import 'reflect-metadata';
import type { IResponseLoginValidation, IRuleLoginForm } from "../../../../domains/login/types";

export const LoginPageGatewayDi = Symbol("LoginPageGatewayDi")

export interface ILoginPageGateway {
    validarUsuario(params: IRuleLoginForm): Promise<IDefaultHttpResponse<string | undefined> | undefined>;
    cadastrarNovoUsuario(params: IRuleLoginForm): Promise<IDefaultHttpResponse<boolean | null> | undefined>;
    obterUsuario(usuario: string): Promise<IDefaultHttpResponse<IResponseLoginValidation> | undefined>
}

@injectable()
export default class LoginPageHttpRequest implements ILoginPageGateway {
    @inject(httpClientDI) private readonly httpClient!: HttpClient

    async cadastrarNovoUsuario(params: IRuleLoginForm): Promise<IDefaultHttpResponse<boolean | null> | undefined> {
        const response = await this.httpClient.post<IDefaultHttpResponse<boolean | null> | undefined>({
            url: "/create-user",
            body: params,
            headers: { "Content-Type": "application/json" }
        });

        if (!response.status) return
        
        return response.body
    }

    async validarUsuario(params: IRuleLoginForm): Promise<IDefaultHttpResponse<string | undefined> | undefined> {

        const response = await this.httpClient.post<IDefaultHttpResponse<string | undefined> | undefined>({
            url: `/auth/login`,
            body: params
        });

        if (response.status != HttpStatusCode.success) return 
        
        return response.body
    }

    async obterUsuario(usuario: string): Promise<IDefaultHttpResponse<IResponseLoginValidation> | undefined> {
        const response = await this.httpClient.get<IDefaultHttpResponse<IResponseLoginValidation>>({
            url: `/find-user/${usuario}`
        });
        
        if (response.status != HttpStatusCode.success) return 

        return response.body
    }
}