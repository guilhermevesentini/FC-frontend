
import { ContainerModule } from "inversify";
import DespesasGatewayAdapters from "../services/adapters/DespesasGateway";
import { DespesasGatewayDi, type IDespesasGateway } from "../services/ports/DespesasGateway";
import obterDespesasPorMes, { obterDespesasPorMesDi, type IObterDespesasPorMes } from "../handlers/obter/obterDespesasPorMes";
import DespesaFactory, { DespesaFactoryDi, type IDespesaFactory } from "../views/lista/DespesaFactory";


export const despesasContainer = new ContainerModule((bind) => {
    bind<IDespesasGateway>(DespesasGatewayDi).to(DespesasGatewayAdapters)

    bind<IObterDespesasPorMes>(obterDespesasPorMesDi).to(obterDespesasPorMes)

    bind<IDespesaFactory>(DespesaFactoryDi).to(DespesaFactory)
})