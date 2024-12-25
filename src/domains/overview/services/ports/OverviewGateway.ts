import type { IDefaultHttpResponse } from "@/core/@types/httpClient"

export type OverviewSparksOutputItem = {
  value: number,
  values: number[]
}

export type OverviewSparkTotalInputDto = {
  inicio: string
  fim: string
}
export type OverviewSparkTotalOutputDto = {
  total: OverviewSparksOutputItem 
  pendente: OverviewSparksOutputItem
  pago: OverviewSparksOutputItem
  balanco: OverviewSparksOutputItem
}

export type OverviewDonutInputDto = {
  inicio: string
  fim: string
}
export type OverviewDonutOutputDto = {
  labels: string[] 
  values: number[]
}

export interface IOverviewGateway {
  sparkTotal(input: OverviewSparkTotalInputDto): Promise<IDefaultHttpResponse<OverviewSparkTotalOutputDto | undefined> | undefined>
  obterDonut(input: OverviewDonutInputDto): Promise<IDefaultHttpResponse<OverviewDonutOutputDto | undefined> | undefined>
}

export const OverviewGatewayDi = Symbol("OverviewGatewayDi")