import { httpClientDI, type HttpClient, type IDefaultHttpResponse } from "@/core/@types/httpClient";
import type { ReceitaInputDto, ReceitaOutputDto, ReceitasGateway } from "../ports/ReceitasGateway";
import { inject, injectable } from "inversify";

@injectable()
export default class ReceitasGatewayAdapter implements ReceitasGateway {
  @inject(httpClientDI) private readonly httpClient!: HttpClient
  
  async obter(mes: number, ano: number): Promise<IDefaultHttpResponse<ReceitaInputDto[] | undefined> | undefined> {
    const response = await this.httpClient.get<IDefaultHttpResponse<ReceitaInputDto[] | undefined>>({
      url: `/get-income`,
      queryParams: {mes: mes, ano: ano}
    });

    if (response.status != 200 || !response.body) return 

    return response.body
  }

  async criar(input: ReceitaInputDto): Promise<IDefaultHttpResponse<boolean | undefined> | undefined> {
    const response = await this.httpClient.post<IDefaultHttpResponse<boolean | undefined> | undefined>({
      url: '/create-income',
      body: input
    });

    if (response.status != 200) return

    return response.body 
  }

}