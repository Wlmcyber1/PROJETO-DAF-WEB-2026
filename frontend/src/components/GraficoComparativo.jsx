import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function GraficoComparativo({ PF, PJ }) {
  const data = {
    labels: [
      "Simples Nacional (6%)",
      "INSS",
      "Imposto de Renda",
      "Total de Impostos",
      "Renda Líquida",
    ],
    datasets: [
      {
        label: "PF",
        backgroundColor: "#6a5acd",
        data: [
          null, 
          PF.inss ?? 0,
          PF.ir ?? 0,
          PF.imposto ?? 0,
          PF.liquido ?? 0,
        ],
      },
      {
        label: "PJ",
        backgroundColor: "#a6b1ff",
        data: [
          PJ.simples6 ?? 0,
          PJ.inss ?? 0,
          PJ.ir ?? 0,
          PJ.totalImpostos ?? 0,
          PJ.liquido ?? 0,
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Comparativo PF × PJ" },
    },
    scales: {
      x: { type: "category" },
      y: {
        type: "linear",
        beginAtZero: true,
        ticks: { callback: (value) => `R$ ${value}` },
      },
    },
  };

  return <Bar data={data} options={options} />;
}