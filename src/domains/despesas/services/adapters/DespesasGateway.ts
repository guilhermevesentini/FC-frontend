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

    async obterDespesaById(id: string): Promise<IDespesas | undefined> {
        const response = await this.httpClient.get<IDespesas>({
            url: `/despesas/${id}`
        });
        
        if(response.status != 200) return

        return response.body
    }

    async criarDespesa(despesa: IDespesas): Promise<boolean> {        
        const response = await this.httpClient.post<boolean>({
            url: `/create-expense`,
            body: despesa
        });

        if (response.status != 200) return false

        return true
    }
    
    async excluirDespesa(id: string, mes?: number): Promise<boolean> {
        const despesaId = id;
    
        // Fazendo a requisição POST com o corpo contendo os parâmetros
        const response = await this.httpClient.post<boolean>({
            url: `/delete-expense`,
            body: { despesaId: despesaId, mes: mes }
        });
    
        // Verificando se a resposta foi bem-sucedida
        if (response.status !== 200) {
            return false;
        }
    
        return true;
    }
    
    async obterDespesas(): Promise<IDefaultHttpResponse<IDespesas[]> | undefined> {
        const response = await this.httpClient.get<IDefaultHttpResponse<IDespesas[]> | undefined>({
            url: `/despesas`
        });

        if (response.status != 200) return

        return response.body
    }

    async obterDespesasPorMes(mes: number, ano: number): Promise<IDefaultHttpResponse<IDespesas[] | undefined> | undefined> {
        const response = await this.httpClient.get<IDefaultHttpResponse<IDespesas[] | undefined>>({
            url: `/get-expense-per-month`,
            queryParams: {mes: mes, ano: ano}
        });

        if (response.status != 200 || !response.body) return 

        return response.body
    }
}