
import { ContainerModule } from "inversify";
import { ContasGatewayDi, type ContasGateway } from "../services/ports/ContasGateway";
import ContasGatewayAdapter from "../services/adapters/ContasGatewayAdapter";

export const contasContainer = new ContainerModule((bind) => {
    bind<ContasGateway>(ContasGatewayDi).to(ContasGatewayAdapter)
})