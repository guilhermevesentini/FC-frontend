import { ContainerModule } from "inversify"
import { ReceitasGatewayDi, type ReceitasGateway } from "../services/ports/ReceitasGateway"
import ReceitasGatewayAdapter from "../services/adapters/ReceitasGatewayAdapter"
import type { IReceitasFactory } from "../ReceitasFactory"
import ReceitaFactory, { ReceitasFactoryDi } from "../ReceitasFactory"

export const receitasContainer = new ContainerModule((bind) => {
    bind<ReceitasGateway>(ReceitasGatewayDi).to(ReceitasGatewayAdapter)
    bind<IReceitasFactory>(ReceitasFactoryDi).to(ReceitaFactory)
})