import type { IDespesasGateway } from "../ports/DespesasGateway";
import type { IDespesas, IDespesasModel } from "../../types";
import { inject, injectable } from "inversify";
import { httpClientDI, type HttpClient, type IDefaultHttpResponse } from "@/core/@types/httpClient";

@injectable()
export default class DespesasGatewayAdapters implements IDespesasGateway {
    @inject(httpClientDI) private readonly httpClient!: HttpClient
    async editarDespesas(despesa: IDespesasModel): Promise<boolean> {
        const response = await this.httpClient.post<boolean>({
            url: `/editarDespesa`,
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
            url: `/criarDespesa`,
            body: despesa
        });

        if (response.status != 200) return false

        return true
    }
    
    async excluirDespesa(params: IDespesasModel): Promise<boolean> {
        const despesaId = params.id;
        const mesId = params.despesaId;
    
        // Fazendo a requisição POST com o corpo contendo os parâmetros
        const response = await this.httpClient.post<boolean>({
            url: `/delete-despesa`,
            body: { despesaId: despesaId, mesId: mesId }
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
            url: `/despesasPorMes`,
            queryParams: {mes: mes, ano: ano}
        });

        if (response.status != 200 || !response.body) return 

        return response.body
    }
}