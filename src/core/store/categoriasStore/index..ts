import { defineStore } from "pinia";
import { container } from "@/inversify.config";
import { CategoriasGatewayDi, type CategoriaDto, type CategoriasGateway } from "@/shared/components/categorias/services/ports/CategoriasGateway";
import type { ETipoCategory } from "@/core/@types/enums";
import type { ICategoriasStore } from "./types";

export const idStore = "useCategoriasStore";

export const useCategoriasStore = defineStore(idStore, {
  state: (): ICategoriasStore => ({
    categoriasList: [],
    categoriasOpt: []
  }),

  getters: {
    
  },
  actions: {
    setCategoriasList(data: CategoriaDto[] | undefined) {
      if (!data) return
      this.categoriasList = data
      this.setCategoriasOPT(data)
    },
    setCategoriasOPT(data: CategoriaDto[]) {
      if (!data) return

      this.categoriasOpt = data.map((categoria: CategoriaDto) => {
        return {
          label: categoria.nome,
          value: categoria.id as string,
          cor: categoria.color
        }
      })
    },
    async fetchCategoriasLista(tipo: ETipoCategory) {
      const response = await container.get<CategoriasGateway>(CategoriasGatewayDi).obter({ tipo: tipo });
      
      if (response?.statusCode != 200) return

      this.setCategoriasList(response.result || [])      
    }
  }
});
