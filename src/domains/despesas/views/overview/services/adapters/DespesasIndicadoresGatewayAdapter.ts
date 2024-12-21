import { httpClientDI, type HttpClient, type IDefaultHttpResponse } from "@/core/@types/httpClient";
import type { DespesasDonutInputDto, DespesasDonutOutputDto, DespesasSparkTotalInputDto, DespesasSparkTotalOutputDto, IDespesasIndicadoresGateway } from "../ports/DespesasIndicadoresGateway";
import { inject, injectable } from "inversify";

@injectable()
export default class DespesasIndicadoresGatewayAdapter implements IDespesasIndicadoresGateway {
  @inject(httpClientDI) private readonly httpClient!: HttpClient
  
  async sparkTotal(input: DespesasSparkTotalInputDto): Promise<IDefaultHttpResponse<DespesasSparkTotalOutputDto>> {
    const response = await this.httpClient.get<IDefaultHttpResponse<DespesasSparkTotalOutputDto>>({
      url: `/expense/overview/spark?inicio=${input.inicio}&fim=${input.fim}`
    });

    if (response.status != 200 || !response.body) return {
      result: {
        balanco: 0,
        pago: 0,
        pendente: 0,
        total: 0
      },
      statusCode: 400
    }

    return response.body
  }
  async obterDonut(input: DespesasDonutInputDto): Promise<IDefaultHttpResponse<DespesasDonutOutputDto>> {
    const response = await this.httpClient.get<IDefaultHttpResponse<DespesasDonutOutputDto>>({
      url: `/expense/overview/donut?inicio=${input.inicio}&fim=${input.fim}`
    });
  
    if (response.status != 200 || !response.body) return {
      result: {
        labels: [],
        values: [],
      },
      statusCode: 400
    }
  
    return response.body
      
  }
}