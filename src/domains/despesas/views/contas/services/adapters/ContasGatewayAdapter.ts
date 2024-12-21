import { inject, injectable } from "inversify";
import type { ContaInputDto, ContasGateway } from "../ports/ContasGateway";
import { httpClientDI, type HttpClient } from "@/core/@types/httpClient";

@injectable()
export default class ContasGatewayAdapter implements ContasGateway {
  @inject(httpClientDI) private readonly httpClient!: HttpClient
  
  async obter(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  async criar(input: ContaInputDto): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  async editar(input: ContaInputDto): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  
}