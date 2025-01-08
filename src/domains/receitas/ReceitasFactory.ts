import { injectable } from "inversify";
import type { ReceitaInputDto, ReceitaModelDto } from "./services/ports/ReceitasGateway";

export const ReceitasFactoryDi = Symbol("ReceitasFactoryDi");

export interface IReceitasFactory {
  create(receitas: ReceitaInputDto[]): ReceitaModelDto[] | undefined;
}

@injectable()
export default class ReceitaFactory implements IReceitasFactory {
  create(receitas: ReceitaInputDto[]): ReceitaModelDto[] {
    if (!receitas || receitas.length === 0) return [];

    const model = receitas.flatMap((receita) => 
      receita.meses
        ?.filter((mes) => mes.incomeId === receita.id)
        .map((mes) => ({
          mes: mes.mes ?? 0,
          status: mes.status ?? '2',
          valor: Number(mes.valor).toFixed(2) ?? '0.00',
          nome: receita.nome ?? '',
          descricao: mes.descricao ?? '',
          tipoLancamento: receita.tipoLancamento ?? '1',
          categoria: mes.categoria ?? '',
          range: [receita.range?.[0] || '', receita.range?.[1] || ''],
          recebimento: mes.recebimento,
          ano: mes.ano ?? 0,
          contaId: receita.contaId,
          replicar: receita.replicar ?? false,
          incomeId: mes.incomeId ?? '',
          observacao: mes.observacao ?? '',
          id: receita.id ?? '',
        })) || []
    );

    //TODO: erro de tipagem range

    return model.length ? model : []; //vericiar erro
  }
}

