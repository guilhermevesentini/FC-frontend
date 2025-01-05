
export interface IGerarId {
  quantidade: number;
  tipo: string;
}

export default function useGerarId({ quantidade }: IGerarId) {
  const idBytes = new Uint8Array(quantidade);
  crypto.getRandomValues(idBytes);
  const idProduto: string = Array.from(idBytes, (b) =>
    b.toString(16).padStart(2, "0")
  ).join("");

  return idProduto;
}
