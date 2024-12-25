
import { ContainerModule } from "inversify";
import DespesasGatewayAdapters from "../services/adapters/DespesasGateway";
import { DespesasGatewayDi, type IDespesasGateway } from "../services/ports/DespesasGateway";
import DespesaFactory, { DespesaFactoryDi, type IDespesaFactory } from "../DespesaFactory";

export const despesasContainer = new ContainerModule((bind) => {
    bind<IDespesasGateway>(DespesasGatewayDi).to(DespesasGatewayAdapters)

    bind<IDespesaFactory>(DespesaFactoryDi).to(DespesaFactory)
})