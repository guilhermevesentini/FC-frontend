import type { IDefaultHttpResponse } from "@/core/@types/httpClient"

export type DespesaSparksOutputItem = {
  value: number,
  values: number[]
}

export type DespesasSparkTotalInputDto = {
  inicio: string
  fim: string
}
export type DespesasSparkTotalOutputDto = {
  total: DespesaSparksOutputItem 
  pendente: DespesaSparksOutputItem
  pago: DespesaSparksOutputItem
  balanco: DespesaSparksOutputItem
}

export type DespesasDonutInputDto = {
  inicio: string
  fim: string
}
export type DespesasDonutOutputDto = {
  labels: string[] 
  values: number[]
}

export interface IDespesasIndicadoresGateway {
  sparkTotal(input: DespesasSparkTotalInputDto): Promise<IDefaultHttpResponse<DespesasSparkTotalOutputDto>>
  obterDonut(input: DespesasDonutInputDto): Promise<IDefaultHttpResponse<DespesasDonutOutputDto>>
}

export const DespesasIndicadoresGatewayDi = Symbol("DespesasIndicadoresGatewayDi")