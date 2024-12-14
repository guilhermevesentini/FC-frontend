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
    label: "Despesas",
    name: '/Despesas/lista'    
  },
  {
    label: "Config",
    name: '/Despesas/config'    
  }
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
  { label: 'Casa', value: '1', color: "#007bb5" },         // Azul Escuro
  { label: 'Educação', value: '2', color: "#006bb3" },     // Azul mais escuro
  { label: 'Cartão', value: '3', color: "#1e7e34" },       // Verde Escuro
  { label: 'Carro', value: '4', color: "#e0a800" },        // Amarelo Escuro
  { label: 'Família', value: '5', color: "#d1006c" },      // Rosa Escuro
  { label: 'Eletrônicos', value: '6', color: "#7a3be1" },   // Roxo Escuro
  { label: 'Viagens', value: '7', color: "#e67e22" },      // Laranja Escuro
  { label: 'Financiamentos', value: '8', color: "#1abc9c" }, // Verde Escuro Claro
  { label: 'Parcelado', value: '9', color: "#e74c3c" },     // Vermelho Escuro
];


// const EColors = {
//   1: "#FF5733",
//   2: ""
// }

// export const ECategoriaColorsMapper: Record<string, string> = [
//   [ECategoriaOptions]
// ]