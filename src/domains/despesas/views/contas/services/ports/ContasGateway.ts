
export type ContaInputDto = {
  id: string
  nome: string
  conta: string
  agencia: string
  usuario: string
  saldo: string
}

export type ContaOutputto = {
  id: string
  nome: string
  conta: string
  agencia: string
  usuario: string
  saldo: string
}

export interface ContasGateway {
  obter(): Promise<boolean>
  criar(input: ContaInputDto): Promise<boolean>
  editar(input: ContaInputDto): Promise<boolean>
}

export const ContasGatewayDi = Symbol("ContasGatewayDi")