import type { ETipoCategory } from "@/core/@types/enums"
import type { IDefaultHttpResponse } from "@/core/@types/httpClient"


export type CategoriaDto = {
  id: string | undefined
  nome: string
}

export type ObterCategoriasInputDto = {
  tipo: ETipoCategory
}

export type DeletarCategoriasInputDto = {
  id: string
}

export interface CategoriasGateway {
  obter(input: ObterCategoriasInputDto): Promise<IDefaultHttpResponse<CategoriaDto[]> | undefined>
  criar(input: CategoriaDto): Promise<IDefaultHttpResponse<boolean> | undefined>
  deletar(input: DeletarCategoriasInputDto): Promise<IDefaultHttpResponse<boolean> | undefined>
}

export const CategoriasGatewayDi = Symbol("CategoriasGatewayDi")