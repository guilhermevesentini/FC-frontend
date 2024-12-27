import type { IDefaultHttpResponse } from "@/core/@types/httpClient"

export type ReceitaInputDto = {
  id: string
  nome: string
  recebimento: Date | undefined
  replicar: boolean
  tipoLancamento: string
  range?: {
    inicio: string | undefined
    fim: string | undefined
  }
  meses?: ReceitaMesOutputDto[]
} & ReceitaMesOutputDto;

export type ReceitaMesOutputDto = {
  mes: number
  ano: number
  categoria: string
  contaId: string
  recebimento: Date | undefined
  valor: string
  status: string
  descricao: string  
  observacao: string    
  incomeId: string
}

export type ReceitaModelDto = {
  meses?: ReceitaMesOutputDto[]
} & ReceitaInputDto & ReceitaMesOutputDto;

export type ReceitaOutputDto = ReceitaInputDto[]

export interface ReceitasGateway {
  criar(input: ReceitaInputDto): Promise<IDefaultHttpResponse<boolean | undefined> | undefined>
  obter(mes: number, ano: number): Promise<IDefaultHttpResponse<ReceitaModelDto[] | undefined> | undefined>
  editar(input: ReceitaInputDto): Promise<IDefaultHttpResponse<boolean | undefined> | undefined>
}

export const ReceitasGatewayDi = Symbol("ReceitasGatewayDi")