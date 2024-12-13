import { inject, injectable } from "inversify";
import type { IDespesas, IDespesasModel } from "../../types";

export const obterDespesasPorMesDi = Symbol("obterDespesasPorMes")

export interface IObterDespesasPorMes {
  obter(despesasList: IDespesas[], periodo: number): Promise<IDespesasModel[]>
}

@injectable()
export default class obterDespesasPorMes implements IObterDespesasPorMes {

	async obter(despesasList: IDespesas[], periodo: number): Promise<IDespesasModel[]> {
		if (!despesasList) return []
				
		const despesasDoMes: IDespesasModel[] = [];		

		if (despesasList && despesasList.length >= 1) {
			despesasList.map((despesa) => {
				if (despesa.meses) {
					despesa.meses.forEach((mes) => {
						if (mes.ano === mes.ano && mes.mes === periodo) {
							despesasDoMes.push({
								mes: mes.mes || 0,
								status: mes.status || '2',
								valor: mes.valor || '0.00',
								nome: despesa.nome || '',
								descricao: mes.descricao || '',
								vencimento: mes.vencimento,
								recorrente: despesa.recorrente || '1',
								frequencia: despesa.frequencia,
								ano: mes.ano || 0,
								replicar: despesa.replicar || false,                                
								despesaId: mes.despesaId || '',
								observacao: mes.observacao || '',
								id: despesa.id || '',
							});
						}
					});
				}
			});
		}

		if (!despesasDoMes.length) return []

		return despesasDoMes;
	}
}