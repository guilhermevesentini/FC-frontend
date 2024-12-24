
import { Container } from "inversify";
import { axiosContainer } from "./core/container";
import { loginContainer } from "./domains/login/container/loginContainer";
import { receitasContainer } from "./domains/despesas/views/receitas/container/receitasContainer";
import { contasContainer } from "./domains/despesas/views/contas/container/contasContainer";
import { despesasContainer } from "./domains/despesas/container/despesasContainer";
import { overviewContainer } from "./domains/despesas/views/overview/container/overviewContainer";

const container = new Container()

container.load(axiosContainer)
container.load(loginContainer)
container.load(receitasContainer)
container.load(contasContainer)
container.load(despesasContainer)
container.load(overviewContainer)

export {
  container
}