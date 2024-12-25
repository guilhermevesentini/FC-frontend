
import { ContainerModule } from "inversify";
import { OverviewGatewayDi, type IOverviewGateway } from "../services/ports/OverviewGateway";
import OverviewGatewayAdapter from "../services/adapters/OverviewGatewayAdapter";

export const overviewContainer = new ContainerModule((bind) => {
    bind<IOverviewGateway>(OverviewGatewayDi).to(OverviewGatewayAdapter)
})