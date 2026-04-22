import React, { useState } from "react";
import GraficoComparativo from "./GraficoComparativo";

export default function CompareResult({ result, onSendEmailNAF, onBack }) {
  const [sending, setSending] = useState(false);
  if (!result) return null;

  const { PF, PJ, input } = result;

  async function handleSendToNAF() {
    setSending(true);
    try {
      const res = await fetch("http://localhost:5000/email/send-calculation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailUser: input.emailUser,
          emailNAF: input.emailNAF,
          profissao: input.profissao,
          rendaMensal: input.rendaMensal,
          custosMensais: input.custosMensais,
          PF,
          PJ,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Resultado enviado ao NAF com sucesso!");
        onSendEmailNAF && onSendEmailNAF({ success: true });
      } else {
        alert(data.error || "Erro ao enviar email");
        onSendEmailNAF && onSendEmailNAF({ success: false });
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar email");
      onSendEmailNAF && onSendEmailNAF({ success: false });
    }
    setSending(false);
  }

  return (
    <div className="card shadow-lg border-0 rounded-3 p-4">
      <h4 className="section-title">Resultado da Simulação</h4>

      {/* Informações de entrada */}
      <div className="mb-3">
        <p><strong>Profissão:</strong> {input.profissao}</p>
        <p><strong>Renda informada:</strong> R$ {input.rendaMensal}</p>
        <p><strong>Custos mensais:</strong> R$ {input.custosMensais}</p>
      </div>

      {/* Tabela detalhada */}
      <table className="table table-hover align-middle">
        <thead style={{ backgroundColor: "#a6b1ff", color: "white" }}>
          <tr>
            <th>Categoria</th>
            <th>PF</th>
            <th>PJ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="label">Simples Nacional (6%)</td>
            <td>—</td>
            <td>R$ {PJ.simples6}</td>
          </tr>
          <tr>
            <td className="label">INSS</td>
            <td>R$ {PF.inss}</td>
            <td>R$ {PJ.inss}</td>
          </tr>
          <tr>
            <td className="label">Imposto de Renda</td>
            <td>{PF.isentoIR ? "Isento" : `R$ ${PF.ir}`}</td>
            <td>{PJ.isentoIR ? "Isento" : `R$ ${PJ.ir}`}</td>
          </tr>
          <tr>
            <td className="label">Total de Impostos</td>
            <td>R$ {PF.imposto}</td>
            <td>R$ {PJ.totalImpostos}</td>
          </tr>
          <tr>
            <td className="label">Renda Líquida</td>
            <td>R$ {PF.liquido}</td>
            <td>R$ {PJ.liquido}</td>
          </tr>
        </tbody>
      </table>

      <div className="data-block mt-4">
        <p>
          <strong>Conclusão:</strong>{" "}
          {PJ.liquido > PF.liquido ? "PJ compensa mais" : "PF compensa mais"}
        </p>
      </div>

      <hr />
      <GraficoComparativo PF={PF} PJ={PJ} />
      <hr />

      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-secondary rounded-pill px-4"
          onClick={onBack}
        >
          Voltar
        </button>
        <button
          className="btn rounded-pill px-4"
          style={{ backgroundColor: "#6a5acd", color: "white" }}
          onClick={handleSendToNAF}
          disabled={sending}
        >
          {sending ? "Enviando..." : "Enviar ao NAF"}
        </button>
      </div>
    </div>
  );
}