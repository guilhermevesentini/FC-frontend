import { defineStore } from "pinia";
import { container } from "@/inversify.config";
import { OverviewGatewayDi, type IOverviewGateway, type OverviewSparkTotalOutputDto } from "@/domains/overview/services/ports/OverviewGateway";
import type { ISparksOverviewStore } from "./types";

export const idStore = "useSparksOverviewStore";

export const sparksInitalState: OverviewSparkTotalOutputDto = {
    balanco: {
      value: 0,
      values: []
    },
    pendente: {
      value: 0,
      values: []
    },
    totalDespesas: {
      value: 0,
      values: []
    },
    totalReceitas: {
      value: 0,
      values: []
    }
}

export const useSparksOverviewStore = defineStore(idStore, {
  state: (): ISparksOverviewStore => ({
    sparks: sparksInitalState,
    loading: false
  }),

  getters: {},
  actions: {
    setLoading(val: boolean) {
      this.loading = val
    },
    setSparks(data: OverviewSparkTotalOutputDto | undefined) {
      if (!data) return
      
      this.sparks = {
        totalDespesas: { value: data.totalDespesas?.value || 0, values: data.totalDespesas?.values || [] },
        totalReceitas: { value: data.totalReceitas?.value || 0, values: data.totalReceitas?.values || [] },
        pendente: { value: data.pendente?.value || 0, values: data.pendente?.values || [] },
        balanco: { value: data.balanco?.value || 0, values: data.balanco?.values || [] },
      };
    },
    async fetchObterSparks(input: { inicio: string, fim: string }) {
      try {
        this.setLoading(true)
        const response = await container.get<IOverviewGateway>(OverviewGatewayDi).sparkTotal(input);
        
        if (response?.statusCode != 200) return
  
        this.setSparks(response.result || undefined)      
      } finally {
        this.setLoading(false)
      }
    }
  }
});
