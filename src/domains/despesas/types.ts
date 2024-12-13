export interface IDespesasModel {
  id: string
  nome: string
  recorrente: string | null
  vencimento: Date | string | undefined
  frequencia: string
  replicar: boolean
  mes: number
  ano: number
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