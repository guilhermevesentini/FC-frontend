import { inject, injectable } from "inversify";
import type { IDespesas, IDespesasModel } from "../../types";
import { ObterDespesaPorUsuarioDi, type IObterDespesaPorUsuario } from "@/core/controller/Despesas/obter/usuarios/ObterDespesaPorUsuario";

export const obterDespesasPorMesDi = Symbol("obterDespesasPorMes")

export interface IObterDespesasPorMes {
  obter(despesasList: IDespesas[], periodo: number): Promise<IDespesasModel[]>
}

@injectable()
export default class obterDespesasPorMes implements IObterDespesasPorMes {
	@inject(ObterDespesaPorUsuarioDi) private readonly obterUsuario!: IObterDespesaPorUsuario

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
								customerId: despesa?.customerId,
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