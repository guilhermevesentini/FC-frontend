
import { ContainerModule } from "inversify"
import { LoginPageGatewayDi, type ILoginPageGateway } from "../views/logar/services/ILoginPageHttpRequest"
import LoginPageHttpRequest from "../views/logar/services/LoginPageHttpRequest"


export const loginContainer = new ContainerModule((bind) => {
    bind<ILoginPageGateway>(LoginPageGatewayDi).to(LoginPageHttpRequest)
})