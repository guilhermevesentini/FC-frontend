import type { IDespesasGateway } from "../ports/DespesasGateway";
import type { IDespesas, IDespesasModel } from "../../types";
import { inject, injectable } from "inversify";
import { httpClientDI, type HttpClient, type IDefaultHttpResponse } from "@/core/@types/httpClient";

@injectable()
export default class DespesasGatewayAdapters implements IDespesasGateway {
    @inject(httpClientDI) private readonly httpClient!: HttpClient
    async editarDespesas(despesa: IDespesasModel): Promise<boolean> {
        const response = await this.httpClient.post<boolean>({
            url: `/edit-expense`,
            body: despesa
        });

        if (response.status != 200) return false

        return true  
    } 

    async criarDespesa(despesa: IDespesasModel): Promise<boolean> {        
        const response = await this.httpClient.post<boolean>({
            url: `/create-expense`,
            body: despesa
        });

        if (response.status != 200) return false

        return true
    }
    
    async excluirDespesa(id: string, mes?: number): Promise<boolean> {
        const despesaId = id;
    
        const response = await this.httpClient.post<boolean>({
            url: `/delete-expense`,
            body: { despesaId: despesaId, mes: mes }
        });
    
        if (response.status !== 200) {
            return false;
        }
    
        return true;
    }
    
    async obterDespesas(mes: number, ano: number): Promise<IDefaultHttpResponse<IDespesas[] | undefined> | undefined> {
        const response = await this.httpClient.get<IDefaultHttpResponse<IDespesas[] | undefined>>({
            url: `/get-expense`,
            queryParams: {mes: mes, ano: ano}
        });

        if (response.status != 200 || !response.body) return 

        return response.body
    }
}