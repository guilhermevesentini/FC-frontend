import { useBreakpoints } from "@vueuse/core";

export default function useBreakpointsElement() {
  const breakpoints = useBreakpoints({
    xs: 400,
    sm: 768,
    md: 992,
    lg: 1200,
    xl: 1920
  })

  return {
    breakpoints
  }
}