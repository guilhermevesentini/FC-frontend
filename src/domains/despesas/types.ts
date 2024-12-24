import { EcolorsPaletteMapper } from "@/core/@types/enums"

export interface IDespesasModel {
  id: string
  nome: string
  recorrente: string | null
  vencimento: Date | string | undefined
  frequencia: string
  replicar: boolean
  mes: number
  ano: number
  categoria: string
  valor: string
  status: string
  descricao: string  
  observacao: string    
  despesaId: string
}

export interface IDespesaMeses {
  mes: number;
  ano: number
  valor: string
  status: string
  categoria: string
  descricao: string  
  despesaId: string | null
  vencimento: Date | string | undefined;
  observacao: string
}

export interface IDespesas {
  id: string | null;
  nome: string;
  recorrente: string | null
  vencimento: Date | string | undefined
  frequencia: string
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
  categoria: '',
  replicar: false,
  valor: '0.00',
  recorrente: null,
  vencimento: new Date(),
  frequencia: '',
  observacao: '',
  despesaId: ''
}

export const navItemsDespesas = [
  {
    label: "Overview",
    name: '/Despesas/overview'    
  },
  {
    label: "Receitas",
    name: '/Despesas/receitas'    
  },
  {
    label: "Despesas",
    name: '/Despesas/despesas'    
  },
  {
    label: "Contas",
    name: '/Despesas/contas'    
  },
  // {
  //   label: "Config",
  //   name: '/Despesas/config'    
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