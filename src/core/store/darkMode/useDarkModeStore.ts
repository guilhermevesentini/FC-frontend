import { defineStore } from "pinia";

export const idStore = "useDarkModeTheme";

export type IDarkModeStore = {
  thema: string
}
export const useDarkModeStore = defineStore(idStore, {
  state: (): IDarkModeStore => ({
    thema: 'light',
  }),

  getters: {},
  actions: {
    setTheme(val: string) {
      this.thema = val
    }
  }
});
