
import { Container } from "inversify";
import { axiosContainer } from "./core/container";
import { loginContainer } from "./domains/login/container/loginContainer";

const container = new Container()

container.load(axiosContainer)
container.load(loginContainer)

export {
  container
}