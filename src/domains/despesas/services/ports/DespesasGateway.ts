import type { IDefaultHttpResponse } from "@/core/@types/httpClient"
import type { IDespesas, IDespesasModel } from "../../types"

export interface IDespesasGateway {
    editarDespesas(despesa: IDespesasModel): Promise<boolean>
    obterDespesas(mes: number, ano: number): Promise<IDefaultHttpResponse<IDespesas[] | undefined> | undefined>
    excluirDespesa(id: string, mes?: number): Promise<boolean>
    criarDespesa(despesa: IDespesasModel): Promise<boolean>
}

export const DespesasGatewayDi = Symbol("DespesasGatewayDi")