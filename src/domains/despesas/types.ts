import { EcolorsPaletteMapper } from "@/core/@types/enums"

export enum ETipoDespesaDrawer {
  criar = '1',
  editar = '2'
}

export interface IDespesasModel {
  id: string | null
  nome: string
  vencimento: Date | string | undefined
  replicar: boolean
  tipoLancamento: string
  range?: {
    inicio: string | undefined
    fim: string | undefined
  }
  contaId: string
  mes: number
  ano: number
  categoria: string
  valor: string
  status: string
  descricao: string  
  observacao: string    
  despesaId: string  | null
}

export interface IDespesaMeses {
  mes: number;
  ano: number
  valor: string
  status: string
  contaId: string
  categoria: string
  descricao: string  
  despesaId: string | null
  vencimento: Date | string | undefined;
  observacao: string
}

export interface IDespesas {
  id: string | null;
  nome: string
  vencimento: Date | string | undefined
  tipoLancamento: string
  range?: {
    inicio: string | undefined
    fim: string | undefined
  }
  replicar: boolean
  meses: IDespesaMeses[] | [];
}

export const DespesaInitialState: IDespesasModel = {
  id: '',
  status: '',
  ano: 0,
  nome: '',
  mes: 0,
  descricao: '',
  contaId: '',
  categoria: '',
  replicar: false,
  valor: '0.00',
  vencimento: undefined,
  observacao: '',
  despesaId: '',
  tipoLancamento: '1'
}

export const navItemsDespesas = [
  {
    label: "Overview",
    name: '/overview'    
  },
  {
    label: "Receitas",
    name: '/receitas'    
  },
  {
    label: "Despesas",
    name: '/despesas'    
  },
  {
    label: "Contas",
    name: '/contas'    
  },
  // {
  //   label: "Config",
  //   name: '/Config'    
  // }
];


export const configDespesaId = {
  quantidade: 16,
  tipo: 'string'
}

export const ESelectOptions = [
  { label: 'Sim', value: '1' },
  { label: 'Não', value: '2' }
];

export const EFrequenciaOptions = [
  { label: 'Mensal', value: '1' },
  { label: 'Semanal', value: '2' },
  { label: 'Semestral', value: '3' },
];

export const ETipoOptions = [
  { label: 'Único', value: '1' },
  { label: 'Parcelado', value: '2' },
  { label: 'Recorrente', value: '3' },
];

export const ECategoriaOptions = [
  { label: 'Casa', value: '1', color: EcolorsPaletteMapper.AzulEletrico },         // Azul Escuro
  { label: 'Educação', value: '2', color: EcolorsPaletteMapper.AzulIntenso },     // Azul mais escuro
  { label: 'Cartão', value: '3', color: EcolorsPaletteMapper.VerdeEscuro },       // Verde Escuro
  { label: 'Carro', value: '4', color: EcolorsPaletteMapper.AmareloDourado },        // Amarelo Escuro
  { label: 'Família', value: '5', color: EcolorsPaletteMapper.Rosa },      // Rosa Escuro
  { label: 'Eletrônicos', value: '6', color: EcolorsPaletteMapper.Roxo },   // Roxo Escuro
  { label: 'Viagens', value: '7', color: EcolorsPaletteMapper.Laranja },      // Laranja Escuro
  { label: 'Financiamentos', value: '8', color: EcolorsPaletteMapper.VerdeAzulado }, // Verde Escuro Claro
  { label: 'Parcelado', value: '9', color: EcolorsPaletteMapper.VermelhoClaro },     // Vermelho Escuro
];


// const EColors = {
//   1: "#FF5733",
//   2: ""
// }

// export const ECategoriaColorsMapper: Record<string, string> = [
//   [ECategoriaOptions]
// ]