import type { IDefaultHttpResponse } from "@/core/@types/httpClient";
import type { IAlterarInputSenha, IRecuperarSenha, IResponseLoginValidation, IRuleLoginForm } from "../../types";

export interface ILoginPageGateway {
  validarUsuario(params: IRuleLoginForm): Promise<IDefaultHttpResponse<string | undefined> | undefined>
  cadastrarNovoUsuario(params: IRuleLoginForm): Promise<IDefaultHttpResponse<boolean | null> | undefined>
  obterUsuario(usuario: string): Promise<IDefaultHttpResponse<IResponseLoginValidation> | undefined>
  recuperarSenha(form: IRecuperarSenha): Promise<IDefaultHttpResponse<boolean> | undefined>
  alterarSenha(form: IAlterarInputSenha): Promise<IDefaultHttpResponse<boolean> | undefined>
}

export const LoginPageGatewayDi = Symbol("LoginPageGatewayDi")