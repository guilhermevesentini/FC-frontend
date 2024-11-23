import { inject, injectable } from "inversify"
import type { IDespesas, IDespesasModel } from "../../types"
import { ObterDespesaPorUsuarioDi, type IObterDespesaPorUsuario } from "@/core/controller/Despesas/obter/usuarios/ObterDespesaPorUsuario"
import { DespesasGatewayDi, type IDespesasGateway } from "../../services/ports/DespesasGateway"

//simulando tratamento do backend

export const editarDespesaHandlerDi = Symbol("editarDespesaHandlerDi")

export interface IEditarDespesaHandler {
  editar(despesa: IDespesasModel): Promise<boolean>
}

@injectable()
export default class editarDespesaHandler implements IEditarDespesaHandler {
  constructor(
    @inject(ObterDespesaPorUsuarioDi) private readonly despesasUsuario: IObterDespesaPorUsuario,
    @inject(DespesasGatewayDi) private readonly despesasGateway: IDespesasGateway    
  ) {}

  protected async editarSingle(despesaSelecionada: IDespesasModel): Promise<boolean> {
    if (!despesaSelecionada) return false
    
    return await this.despesasGateway.editarDespesas(despesaSelecionada);
  }

  protected async editarAll(despesas: IDespesas[], model: IDespesasModel): Promise<boolean> {

    const despesaSelecionada = despesas?.find((despesaAtual) => despesaAtual.id === model.id);

    if(!despesaSelecionada) return false

    Object.assign(despesaSelecionada, {
      frequencia: model.frequencia,
      nome: model.nome,
      recorrente: model.recorrente,
      replicar: model.replicar,
      vencimento: model.vencimento
    });

  despesaSelecionada.meses.forEach((mes) => {
      mes.descricao = model.descricao;
      mes.observacao = model.observacao;
      mes.status = model.status;
      mes.valor = model.valor;
  });

    const response = await this.despesasGateway.salvarDespesas(despesaSelecionada);
    
    if (!response) return false

    return true    
  }

  async editar(despesa: IDespesasModel): Promise<boolean> {
    const despesasList = await this.despesasUsuario.obter();

    if (!despesasList) return false

    if (!despesa.replicar) {
      return this.editarSingle(despesa)
    } else {
      return this.editarAll(despesasList, despesa)
    }
  }
}