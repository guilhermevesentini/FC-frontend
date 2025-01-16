import type { OverviewSparkTotalOutputDto } from "@/domains/overview/services/ports/OverviewGateway"

export type ISparksOverviewStore = {
  sparks: OverviewSparkTotalOutputDto
  loading: boolean
}