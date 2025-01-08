import type { CategoriaDto } from "@/shared/components/categorias/services/ports/CategoriasGateway"

export type ESelectOpt = {
  label: string
  value: string
  cor?: string
}

export type ICategoriasStore = {
  categoriasList: CategoriaDto[]
  categoriasOpt: ESelectOpt[]
}