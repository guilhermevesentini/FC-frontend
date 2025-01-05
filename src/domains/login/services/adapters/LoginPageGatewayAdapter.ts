import { httpClientDI, HttpStatusCode, type HttpClient, type IDefaultHttpResponse, type IHttpResponse } from "@/core/@types/httpClient";
import { inject, injectable } from "inversify";
import 'reflect-metadata';
import type { IAlterarInputSenha, IRecuperarSenha, IResponseLoginValidation, IRuleLoginForm } from "../../types";
import type { ILoginPageGateway } from "../ports/LoginPageGateway";

@injectable()
export default class LoginPageGatewayAdapter implements ILoginPageGateway {
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

    async recuperarSenha(form: IRecuperarSenha): Promise<IDefaultHttpResponse<boolean> | undefined> {
        const response = await this.httpClient.get<IDefaultHttpResponse<boolean> | undefined>({
            url: `/recover-password/${form.email}`
        });
        
        if (response.status != HttpStatusCode.success) return

        return response.body
    }

    async alterarSenha(form: IAlterarInputSenha): Promise<IDefaultHttpResponse<boolean> | undefined> {
        const response = await this.httpClient.post<IDefaultHttpResponse<boolean> | undefined>({
            url: `/change-password`,
            body: {form}
        });
        
        if (response.status != HttpStatusCode.success) return

        return response.body
    }
}