export interface IResponseLoginValidation {
  id: number
  password: string
  token: string
  email: string
  _id: string
}

export interface IResponseLoginValidation {
  id: number
  token: string
  username: string
  email: string
  _id: string
}

export interface ILoginUser {
  _id?: string,
  id?: number,
  username: string
  email: string,
}

export  interface IRuleLoginForm {
  email: string
  username?: string
  password: string
}

export type IRecuperarSenha = {
  email: string
}

export type IAlterarForm = {
  senhaAtual: string
  novaSenha: string
  confirmarSenha: string
}

export type IAlterarInputSenha = {
  email: string
  senha: string
  novaSenha: string
}