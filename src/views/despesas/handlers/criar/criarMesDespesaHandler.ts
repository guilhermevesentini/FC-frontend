import { type IDespesaMeses, type IDespesasModel } from "../../types"
import { injectable } from "inversify";

export const criarMesDespesaHandlerDi = Symbol("criarMesDespesaHandlerDi")

export interface ICriarMesDespesaHandler {
  criar(despesa: IDespesasModel): IDespesaMeses[]
}

@injectable()
export default class criarMesDespesaHandler implements ICriarMesDespesaHandler {  
  criar(despesa: IDespesasModel): IDespesaMeses[] {
    const ano = new Date(despesa.vencimento as Date).getFullYear();

    return [{
      mes: despesa.mes,
      valor: despesa.valor || '0.00',
      ano: ano,
      status: despesa.status || '2',
      descricao: despesa.descricao || '',
      despesaId: despesa.id || null,
      vencimento: despesa.vencimento || new Date(),
      observacao: despesa.observacao || ''
    }]
  }
}