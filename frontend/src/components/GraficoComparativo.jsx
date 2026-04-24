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

export default function GraficoComparativo({ PF, PJ, profissao }) {
  const isAdvocacia = profissao === "Advogado(a)";

  // Para advocacia: mostra INSS desconto + patronal separados
  const inssPJ = isAdvocacia
    ? (PJ.inssDesconto ?? 0) + (PJ.inssPatronal ?? 0)
    : (PJ.inss ?? 0);

  const labelDAS = isAdvocacia ? "DAS (4,5% Anexo IV)" : "DAS (6% Anexo III)";

  const data = {
    labels: [
      labelDAS,
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
          PJ.das ?? 0,
          inssPJ,
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
      title: {
        display: true,
        text: `Comparativo PF × PJ — ${profissao ?? ""}`,
      },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            ctx.raw !== null
              ? `R$ ${Number(ctx.raw).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
              : "N/A",
        },
      },
    },
    scales: {
      x: { type: "category" },
      y: {
        type: "linear",
        beginAtZero: true,
        ticks: {
          callback: (value) =>
            `R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}
