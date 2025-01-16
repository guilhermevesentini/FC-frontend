
import { Container } from "inversify";
import { axiosContainer } from "./core/container";
import { loginContainer } from "./domains/login/container/loginContainer";
import { receitasContainer } from "./domains/receitas/container/receitasContainer";
import { despesasContainer } from "./domains/despesas/container/despesasContainer";
import { overviewContainer } from "./domains/overview/container/overviewContainer";
import { contasContainer } from "./domains/contas/container/contasContainer";
import { categoriasContainer } from "./core/container/categoriasContainer";

const container = new Container()

container.load(axiosContainer)
container.load(loginContainer)
container.load(receitasContainer)
container.load(contasContainer)
container.load(despesasContainer)
container.load(overviewContainer)
container.load(categoriasContainer)

export {
  container
}