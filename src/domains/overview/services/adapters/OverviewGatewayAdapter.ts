import { httpClientDI, type HttpClient, type IDefaultHttpResponse } from "@/core/@types/httpClient";
import { inject, injectable } from "inversify";
import type { IOverviewGateway, OverviewDonutInputDto, OverviewDonutOutputDto, OverviewSparkTotalInputDto, OverviewSparkTotalOutputDto } from "../ports/OverviewGateway";

@injectable()
export default class OverviewGatewayAdapter implements IOverviewGateway {
  @inject(httpClientDI) private readonly httpClient!: HttpClient
  
  async sparkTotal(input: OverviewSparkTotalInputDto): Promise<IDefaultHttpResponse<OverviewSparkTotalOutputDto | undefined> | undefined> {
    const response = await this.httpClient.get<IDefaultHttpResponse<OverviewSparkTotalOutputDto>>({
      url: `/overview/spark?inicio=${input.inicio}&fim=${input.fim}`
    });

    if (response.status != 200 || !response.body) return

    return response.body
  }
  async obterDonut(input: OverviewDonutInputDto): Promise<IDefaultHttpResponse<OverviewDonutOutputDto | undefined> | undefined> {
    const response = await this.httpClient.get<IDefaultHttpResponse<OverviewDonutOutputDto>>({
      url: `/overview/donut?inicio=${input.inicio}&fim=${input.fim}`
    });
  
    if (response.status != 200 || !response.body) return
  
    return response.body
      
  }
}