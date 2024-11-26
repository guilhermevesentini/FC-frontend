
import { ContainerModule } from "inversify"
import LoginPageHttpRequest, { LoginPageGatewayDi, type ILoginPageGateway } from "../services/login/LoginPageHttpRequest"


export const loginContainer = new ContainerModule((bind) => {
    bind<ILoginPageGateway>(LoginPageGatewayDi).to(LoginPageHttpRequest)
})