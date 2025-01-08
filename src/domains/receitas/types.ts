import { EcolorsPaletteMapper } from "@/core/@types/enums";
import type { ReceitaInputDto } from "./services/ports/ReceitasGateway";

export enum ETipoReceitaDrawer {
  criar = '1',
  editar = '2'
}

export const ReceitasInitialState: ReceitaInputDto = {
  id: '',
  status: '',
  ano: 0,
  nome: '',
  mes: 0,
  descricao: '',
  categoria: '',
  replicar: false,
  valor: '0.00',
  recebimento: undefined,
  contaId: '',
  incomeId: '',
  tipoLancamento: '1',
  range: ['', ''],
  observacao: ''
}

export const ECategoriaReceitasOptions = [
  { label: 'Salário', value: '1', color: EcolorsPaletteMapper.AzulClaro },
  { label: 'Freelance', value: '2', color: EcolorsPaletteMapper.RoxoMedio },     
  { label: 'Desconhecido', value: '3', color: EcolorsPaletteMapper.AzulRoyal },  
];