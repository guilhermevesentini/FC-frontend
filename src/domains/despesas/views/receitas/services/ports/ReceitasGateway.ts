import type { IDefaultHttpResponse } from "@/core/@types/httpClient"

export type ReceitaInputDto = {
  id: string
  nome: string
  recorrente: string 
  frequencia: string
  recebimento: Date
  replicar: boolean
  meses?: ReceitaMesOutputDto[]
} & ReceitaMesOutputDto;

export type ReceitaMesOutputDto = {
  mes: number
  ano: number
  categoria: string
  contaId: string
  recebimento: Date
  valor: string
  status: string
  descricao: string  
  observacao: string    
  incomeId: string
}

export type ReceitaModelDto = {
  id: string
  nome: string
  recorrente: string 
  frequencia: string
  recebimento: Date
  replicar: boolean
  meses?: ReceitaMesOutputDto[]
} & ReceitaMesOutputDto;

export type ReceitaOutputDto = ReceitaInputDto[]

export interface ReceitasGateway {
  criar(input: ReceitaInputDto): Promise<IDefaultHttpResponse<boolean | undefined> | undefined>
  obter(mes: number, ano: number): Promise<IDefaultHttpResponse<ReceitaModelDto[] | undefined> | undefined>
}

export const ReceitasGatewayDi = Symbol("ReceitasGatewayDi")