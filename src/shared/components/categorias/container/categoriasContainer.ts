
import { ContainerModule } from "inversify";
import { CategoriasGatewayDi, type CategoriasGateway } from "../services/ports/CategoriasGateway";
import CategoriasGatewayAdapter from "../services/adapters/CategoriasGatewayAdapter";

export const categoriasContainer = new ContainerModule((bind) => {
    bind<CategoriasGateway>(CategoriasGatewayDi).to(CategoriasGatewayAdapter)
})