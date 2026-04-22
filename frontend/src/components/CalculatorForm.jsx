import React, { useState } from "react";
import InfoModal from "./InfoModal";

export default function CalculatorForm({ onCompare }) {
  const [renda, setRenda] = useState("");
  const [custos, setCustos] = useState("");
  const [profissao, setProfissao] = useState("Psicólogo(a)");
  const [sendEmail, setSendEmail] = useState(false);
  const [emailUser, setEmailUser] = useState("");
  const [emailNAF, setEmailNAF] = useState("");
  const [errors, setErrors] = useState({});
  const [showInfo, setShowInfo] = useState(false);

  function validate() {
    const e = {};
    const rendaNum = Number(renda);
    const custosNum = Number(custos);

    if (!renda) e.renda = "Renda mensal é obrigatória.";
    else if (rendaNum <= 0 || rendaNum > 15000)
      e.renda = "Informe um valor entre R$ 1 e R$ 15.000.";

    if (custos === "" || Number.isNaN(custosNum))
      e.custos = "Custos mensais obrigatórios.";
    else if (custosNum < 0) e.custos = "Custos não podem ser negativos.";

    if (!profissao) e.profissao = "Profissão obrigatória.";
    
    

    if (sendEmail) {
      if (!emailUser) e.emailUser = "Informe um e-mail para envio.";
      else if (!/^\S+@\S+\.\S+$/.test(emailUser))
        e.emailUser = "E-mail inválido.";
    }

    if (emailNAF && !/^\S+@\S+\.\S+$/.test(emailNAF))
      e.emailNAF = "E-mail NAF inválido.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onCompare({
      rendaMensal: Number(renda),
      custosMensais: Number(custos),
      profissao,
      sendEmail,
      emailUser,
      emailNAF,
    });
  }

  return (
  <form
    id="calculatorForm"
    onSubmit={handleSubmit}
    className="animate__animated animate__fadeInUp p-4 rounded-3 shadow-lg"
    style={{ backgroundColor: "white", color: "#333" }}
  >
    <div
      className="mb-4 text-center text-white rounded-3"
      style={{
        background: "linear-gradient(135deg, #6a5acd, #a6b1ff)",
        padding: "20px"
      }}
    >
      <h4 className="fw-bold mb-0">Simulação</h4>
    </div>

    <table className="table table-borderless align-middle">
      <tbody>
        <tr>
          <td style={{ width: "35%" }}>
            <label className="form-label mb-0" style={{ color: "#5a3ec8" }}>
              Renda Mensal (R$) — até R$ 15.000
            </label>
          </td>
          <td>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Ex: 5000.00"
              className={`form-control rounded-3 ${errors.renda ? "is-invalid" : ""}`}
              value={renda}
              onChange={(e) => setRenda(e.target.value)}
            />
            <div className="invalid-feedback">{errors.renda}</div>
          </td>
        </tr>

        <tr>
          <td>
            <label className="form-label mb-0" style={{ color: "#5a3ec8" }}>
              Total de Custos Mensais (R$)
            </label>
          </td>
          <td>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Ex: 1200.00"
              className={`form-control rounded-3 ${errors.custos ? "is-invalid" : ""}`}
              value={custos}
              onChange={(e) => setCustos(e.target.value)}
            />
            <div className="invalid-feedback">{errors.custos}</div>
          </td>
        </tr>

        <tr>
          <td>
            <label className="form-label mb-0" style={{ color: "#5a3ec8" }}>
              Profissão:
            </label>
          </td>
          <td>
            <select
              className="form-select rounded-3"
              value={profissao}
              onChange={(e) => setProfissao(e.target.value)}
            >
              <option value= "Psicólogo(a)">Psicólogo(a)</option>
              <option value="Advogado(a)">Advogado(a)</option>
              <option value="Arquiteto(a)">Arquiteto(a)</option>
            </select>
          </td>
        </tr>

        <tr>
          <td colSpan="2">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="sendEmailSwitch"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="sendEmailSwitch">
                Deseja receber os cálculos por e-mail?
              </label>
            </div>
          </td>
        </tr>

        {sendEmail && (
          <tr>
            <td>
              <label className="form-label mb-0" style={{ color: "#5a3ec8" }}>
                Seu e-mail:
              </label>
            </td>
            <td>
              <input
                type="email"
                className={`form-control rounded-3 ${errors.emailUser ? "is-invalid" : ""}`}
                value={emailUser}
                onChange={(e) => setEmailUser(e.target.value)}
              />
              <div className="invalid-feedback">{errors.emailUser}</div>
            </td>
          </tr>
        )}

        <tr>
          <td>
            <label className="form-label mb-0" style={{ color: "#5a3ec8" }}>
              Enviar e-mail para o NAF (opcional)
            </label>
          </td>
          <td>
            <input
              type="email"
              className={`form-control rounded-3 ${errors.emailNAF ? "is-invalid" : ""}`}
              placeholder="email@naf.exemplo"
              value={emailNAF}
              onChange={(e) => setEmailNAF(e.target.value)}
            />
            <div className="invalid-feedback">{errors.emailNAF}</div>
            <div className="form-text">
              Se informado, o resultado será preparado para envio ao NAF.
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div className="d-flex justify-content-end mt-3">
      <button
        className="btn fw-bold rounded-pill px-4"
        type="submit"
        style={{ backgroundColor: "#6a5acd", color: "white" }}
      >
        Comparar PF × PJ
      </button>
    </div>

    <InfoModal show={showInfo} onHide={() => setShowInfo(false)} />
  </form>
);
}