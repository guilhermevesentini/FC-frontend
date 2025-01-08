import { inject, injectable } from "inversify";
import 'reflect-metadata'
import type { CategoriaDto, CategoriasGateway, DeletarCategoriasInputDto, ObterCategoriasInputDto } from "../ports/CategoriasGateway";
import { httpClientDI, type HttpClient, type IDefaultHttpResponse } from "@/core/@types/httpClient";

@injectable()
export default class CategoriasGatewayAdapter implements CategoriasGateway {
  @inject(httpClientDI) private readonly httpClient!: HttpClient
  
  async obter(input: ObterCategoriasInputDto): Promise<IDefaultHttpResponse<CategoriaDto[]> | undefined> {
    const response = await this.httpClient.get<IDefaultHttpResponse<CategoriaDto[]> | undefined>({
      url: `/get-categories/`,
      queryParams: {tipo: input.tipo}
    });

    if (response.status != 200) return

    return response.body
  }
  async criar(input: CategoriaDto): Promise<IDefaultHttpResponse<boolean> | undefined> {
    const response = await this.httpClient.post<IDefaultHttpResponse<boolean> | undefined>({
      url: `/create-category`,
      body: input
    });

    if (response.status != 200) return

    return response.body
  }

  async editar(input: CategoriaDto): Promise<IDefaultHttpResponse<boolean> | undefined> {
    const response = await this.httpClient.post<IDefaultHttpResponse<boolean> | undefined>({
      url: `/edit-category`,
      body: input
    });

    if (response.status != 200) return

    return response.body
  }
  async deletar(input: DeletarCategoriasInputDto): Promise<IDefaultHttpResponse<boolean> | undefined> {
    const response = await this.httpClient.post<IDefaultHttpResponse<boolean> | undefined>({
      url: `/delete-category`,
      body: input
    });

    if (response.status != 200) return

    return response.body
  }
}