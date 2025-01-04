
import { ContainerModule } from "inversify"
import { LoginPageGatewayDi, type ILoginPageGateway } from "../services/ports/LoginPageGateway"
import LoginPageHttpRequest from "../services/login/LoginPageHttpRequest"


export const loginContainer = new ContainerModule((bind) => {
    bind<ILoginPageGateway>(LoginPageGatewayDi).to(LoginPageHttpRequest)
})