import type { CategoriaDto } from "@/core/services/ports/CategoriasGateway"

export type ESelectOpt = {
  label: string
  value: string
  cor?: string
}

export type ICategoriasStore = {
  categoriasList: CategoriaDto[]
  categoriasOpt: ESelectOpt[]
}