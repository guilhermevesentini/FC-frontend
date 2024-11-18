import dayjs from 'dayjs';
import type { Ref } from 'vue';

dayjs.locale('pt-br');

const obterIdUsuario = (): string | undefined => {
  const storage = localStorage.getItem('user')

  if (!storage) return

  const usuarioId = JSON.parse(storage);

  return usuarioId._id
}

const removerAcentos = (texto: string) => {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const filtrarItems = (lista: any[], filtroAtual: Ref<string>, currentPage: Ref<number>, itemsPerPage: Ref<number>) => {
  try {
    const termoBusca = removerAcentos(filtroAtual.value.trim().toLowerCase());
    let filteredItems = lista;
    
    if(!filteredItems || filteredItems.length <= 0) return

    if (termoBusca) {
      
      filteredItems = filteredItems.filter((produto: any) => {
        return (
          removerAcentos(produto.nome).includes(termoBusca)
        );
      });
    }
            
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    return filteredItems.length >= 1 ? filteredItems.slice(startIndex, startIndex + itemsPerPage.value) : filteredItems;
  } catch (err) {
    throw new Error(
      'Erro ao carregar os produtos'
    );
  }
};

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY');
}

const formatCurrency = (value: string | number): string => {
  const val = typeof value === 'string' ? Number(value) : value;

  if (isNaN(val)) {
    return 'R$ 0,00';
  }

  const valorFormatado = val.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return valorFormatado;
};

const currencyToInt = (value: string | number): number => {
  if (typeof value === "string") {
    const cleanValue = value.replace(/[^\d,.-]/g, '').replace(',', '.');

    const formattedValue = parseFloat(cleanValue) || 0;

    return parseFloat(formattedValue.toFixed(2));
  }

  return parseFloat(value.toFixed(2));
};

const formatToCurrency = (value: string | number): string => {
  const numberValue = typeof value === 'string' ? parseFloat(value) / 100 : value / 100;
  return numberValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};
  
const parseToInt = (value: string): number => {
  if (!value) {
    return 0;
  }

  const normalizedValue = value.replace(',', '.');

  if (normalizedValue.startsWith('.')) {
    return 0;
  }

  const cleanedValue = normalizedValue.replace(/[^0-9.]/g, "");

  const parsedValue = parseFloat(cleanedValue);
  if (isNaN(parsedValue)) {
    return 0;
  }

  return Math.round(parsedValue * 100);
};

export {
  obterIdUsuario,
  removerAcentos,
  formatDate,
  formatCurrency,
  filtrarItems,
  currencyToInt,
  parseToInt,
  formatToCurrency
}

