
import { ContainerModule } from "inversify";
import { DespesasIndicadoresGatewayDi, type IDespesasIndicadoresGateway } from "../services/ports/DespesasIndicadoresGateway";
import DespesasIndicadoresGatewayAdapter from "../services/adapters/DespesasIndicadoresGatewayAdapter";


export const overviewContainer = new ContainerModule((bind) => {
    bind<IDespesasIndicadoresGateway>(DespesasIndicadoresGatewayDi).to(DespesasIndicadoresGatewayAdapter)
})