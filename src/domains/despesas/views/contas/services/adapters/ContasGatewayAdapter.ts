import { inject, injectable } from "inversify";
import type { ContaInputDto, ContaOutputDto, ContasGateway } from "../ports/ContasGateway";
import { httpClientDI, type HttpClient, type IDefaultHttpResponse } from "@/core/@types/httpClient";

@injectable()
export default class ContasGatewayAdapter implements ContasGateway {  
  @inject(httpClientDI) private readonly httpClient!: HttpClient
  
  async obterBancos(): Promise<any> {
    const response = await this.httpClient.get<any>({
      url: 'get-banks'
    });
    
    return response
  }

  async obter(): Promise<IDefaultHttpResponse<ContaOutputDto[]> | undefined> {
    const response = await this.httpClient.get<IDefaultHttpResponse<ContaOutputDto[]> | undefined>({
      url: `/get-bank-account`
    });

    if (response.status != 200) return

    return response.body
  }
  
  async criar(input: ContaInputDto): Promise<boolean> {
    const response = await this.httpClient.post<boolean>({
      url: `/create-bank-account`,
      body: input
    });

    if (response.status != 200) return false

    return true 
  }
  
  async editar(input: ContaInputDto): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async delete(input: {id: string}): Promise<boolean> {
    const response = await this.httpClient.post<IDefaultHttpResponse<boolean>>({
      url: '/delete-bank-account',
      body: input
    });

    if (response.status != 200) return false

    return true 
  }  
}