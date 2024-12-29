import { ref } from "vue";
import ApexCharts from "apexcharts";

const currentTheme = ref("light"); // Tema inicial
const chartInstances = new Set(); // Conjunto para armazenar instâncias dos gráficos

export function useThemeManager() {
  // Alterar o tema global
  const toggleTheme = () => {
    const isDarkMode = document.documentElement.classList.contains("dark");

    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      currentTheme.value = "light";
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      currentTheme.value = "dark";
    }

    // Atualizar todas as instâncias de gráficos
    updateChartsTheme();
    localStorage.setItem("theme", currentTheme.value);
  };

  // Adicionar uma instância de gráfico
  const registerChart = (chartInstance) => {
    chartInstances.add(chartInstance);
    chartInstance.updateOptions({
      theme: {
        mode: currentTheme.value,
      },
    });
  };

  // Remover uma instância de gráfico
  const unregisterChart = (chartInstance) => {
    chartInstances.delete(chartInstance);
  };

  // Atualizar o tema de todos os gráficos registrados
  const updateChartsTheme = () => {
    chartInstances.forEach((chartInstance) => {
      chartInstance.updateOptions({
        theme: {
          mode: currentTheme.value,
        },
      });
    });
  };

  return {
    currentTheme,
    toggleTheme,
    registerChart,
    unregisterChart,
  };
}
