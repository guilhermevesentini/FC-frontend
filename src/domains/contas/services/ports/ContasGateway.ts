import type { IDefaultHttpResponse } from "@/core/@types/httpClient"

export type ContaInputDto = {
  id: string
  banco: number | undefined
  nomeBanco: string
  nome: string
  conta: string | undefined
  agencia: string
  saldo: string
  contaPrincipal: boolean
}

export type ContaOutputDto = {
  id: string
  banco: number | undefined
  nomeBanco: string
  nome: string
  conta: string | undefined
  agencia: string
  saldo: string
  contaPrincipal: boolean
  label?: string; // Opcional, se necessário
  value?: string; // Opcional, se necessário
}

export interface ContasGateway {
  obter(): Promise<IDefaultHttpResponse<ContaOutputDto[]> | undefined>
  criar(input: ContaInputDto): Promise<boolean>
  editar(input: ContaInputDto): Promise<boolean>
  obterBancos(): Promise<any>
  delete(input: {id: string}): Promise<boolean> 
}

export const ContasGatewayDi = Symbol("ContasGatewayDi")