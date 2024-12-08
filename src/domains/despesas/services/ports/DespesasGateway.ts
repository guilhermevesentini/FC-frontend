import type { IDefaultHttpResponse } from "@/core/@types/httpClient"
import type { IDespesas, IDespesasModel } from "../../types"

export interface IDespesasGateway {
    editarDespesas(despesa: IDespesasModel): Promise<boolean>
    obterDespesaById(id: string):  Promise<IDespesas | undefined>
    obterDespesas(): Promise<IDefaultHttpResponse<IDespesas[]> | undefined>
    excluirDespesa(id: string, mes?: number): Promise<boolean>
    criarDespesa(despesa: IDespesas): Promise<boolean>
    obterDespesasPorMes(mes: number, ano: number): Promise<IDefaultHttpResponse<IDespesas[] | undefined> | undefined>
}

export const DespesasGatewayDi = Symbol("DespesasGatewayDi")