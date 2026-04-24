import React, { useState } from "react";
import GraficoComparativo from "./GraficoComparativo";
import { generateComparativoPDF } from "../util/generatePDF";

export default function CompareResult({ result, onSendEmailNAF, onBack }) {
  const [sending, setSending]       = useState(false);
  const [gerandoPDF, setGerandoPDF] = useState(false);

  if (!result) return null;

  const { PF, PJ, input } = result;
  const isAdvocacia = input.profissao === "Advogado(a)";

  const labelDAS = isAdvocacia
    ? "Simples Nacional (4,5% — Anexo IV)"
    : "Simples Nacional (6% — Anexo III)";

  // ── Gerar e baixar PDF ─────────────────────────────────────────────────────
  async function handleGerarPDF() {
    setGerandoPDF(true);
    try {
      generateComparativoPDF({ PF, PJ, input });
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Não foi possível gerar o PDF. Tente novamente.");
    } finally {
      setGerandoPDF(false);
    }
  }

  // ── Enviar ao NAF ──────────────────────────────────────────────────────────
  async function handleSendToNAF() {
    setSending(true);
    try {
      const res = await fetch("http://localhost:5000/email/send-calculation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailUser: input.emailUser,
          emailNAF:  input.emailNAF,
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
        <p><strong>Renda informada:</strong> R$ {input.rendaMensal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
        <p><strong>Custos mensais:</strong> R$ {input.custosMensais.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
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
            <td className="label">{labelDAS}</td>
            <td>—</td>
            <td>R$ {PJ.das?.toFixed(2)}</td>
          </tr>

          <tr>
            <td className="label">
              INSS {isAdvocacia ? "(sócio — 11% sobre pró-labore)" : "(11% sobre pró-labore)"}
            </td>
            <td>R$ {PF.inss?.toFixed(2)}</td>
            <td>R$ {isAdvocacia ? PJ.inssDesconto?.toFixed(2) : PJ.inss?.toFixed(2)}</td>
          </tr>

          {isAdvocacia && (
            <tr>
              <td className="label">INSS Patronal — CPP (20% sobre pró-labore)</td>
              <td>—</td>
              <td>R$ {PJ.inssPatronal?.toFixed(2)}</td>
            </tr>
          )}

          <tr>
            <td className="label">Pró-labore (base PJ)</td>
            <td>—</td>
            <td>R$ {PJ.prolabore?.toFixed(2)}</td>
          </tr>

          <tr>
            <td className="label">Imposto de Renda</td>
            <td>{PF.isentoIR ? "Isento" : `R$ ${PF.ir?.toFixed(2)}`}</td>
            <td>{PJ.isentoIR ? "Isento" : `R$ ${PJ.ir?.toFixed(2)}`}</td>
          </tr>

          <tr style={{ fontWeight: "bold", backgroundColor: "#f3f0ff" }}>
            <td className="label">Total de Impostos</td>
            <td>R$ {PF.imposto?.toFixed(2)}</td>
            <td>R$ {PJ.totalImpostos?.toFixed(2)}</td>
          </tr>

          <tr style={{ fontWeight: "bold" }}>
            <td className="label">Renda Líquida</td>
            <td>R$ {PF.liquido?.toFixed(2)}</td>
            <td>R$ {PJ.liquido?.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* Conclusão */}
      <div
        className="data-block mt-3 p-3 rounded-3"
        style={{
          backgroundColor: PJ.liquido > PF.liquido ? "#eaf5ea" : "#fff3e0",
          border: "1px solid #ddd",
        }}
      >
        <p className="mb-0">
          <strong>Conclusão:</strong>{" "}
          {PJ.liquido > PF.liquido
            ? `PJ compensa mais — você fica com R$ ${(PJ.liquido - PF.liquido).toFixed(2)} a mais por mês.`
            : `PF compensa mais — você fica com R$ ${(PF.liquido - PJ.liquido).toFixed(2)} a mais por mês.`}
        </p>
        {isAdvocacia && (
          <p className="mt-2 mb-0 text-muted" style={{ fontSize: "0.85rem" }}>
            * Para Advogados(as): o Simples Nacional Anexo IV não inclui CPP no DAS.
            O INSS patronal de 20% sobre o pró-labore é recolhido separadamente.
          </p>
        )}
      </div>

      <hr />
      <GraficoComparativo PF={PF} PJ={PJ} profissao={input.profissao} />
      <hr />

      {/* ── Botões de ação ─────────────────────────────────────────────────── */}
      <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">

        {/* Voltar */}
        <button
          className="btn btn-secondary rounded-pill px-4"
          onClick={onBack}
        >
          Voltar
        </button>

        <div className="d-flex gap-2 flex-wrap">

          {/* ── Baixar PDF ── */}
          <button
            className="btn rounded-pill px-4 fw-bold d-flex align-items-center gap-2"
            style={{
              backgroundColor: gerandoPDF ? "#b0a8e0" : "#4a3a9c",
              color: "white",
              border: "none",
              transition: "background-color 0.2s",
            }}
            onClick={handleGerarPDF}
            disabled={gerandoPDF}
            title="Baixar o comparativo em PDF"
          >
            {gerandoPDF ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />
                Gerando PDF...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
                </svg>
                Baixar PDF
              </>
            )}
          </button>

          {/* Enviar ao NAF */}
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
    </div>
  );
}
