
import { ContainerModule } from "inversify"
import { LoginPageGatewayDi, type ILoginPageGateway } from "../services/ports/LoginPageGateway"
import LoginPageGatewayAdapter from "../services/adapters/LoginPageGatewayAdapter"


export const loginContainer = new ContainerModule((bind) => {
    bind<ILoginPageGateway>(LoginPageGatewayDi).to(LoginPageGatewayAdapter)
})