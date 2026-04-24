import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CalculatorForm from "../components/CalculatorForm";
import CompareResult from "../components/CompareResult";
import { compareTaxes } from "../util/tax";

export default function Home() {
  const [result, setResult] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => navigate("/login");

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  function handleCompare(data) {
    const comparison = compareTaxes({
      rendaMensal: data.rendaMensal,
      custosMensais: data.custosMensais,
      profissao: data.profissao, // ← CORRIGIDO: era omitido, agora passado corretamente
    });
    setResult({
      ...comparison,
      input: { ...data },
    });
  }

  const faqs = [
    { 
      q: "Como a calculadora decide qual modelo é melhor?", 
      a: "O sistema compara automaticamente as alíquotas do IRPF (Pessoa Física) com as do Simples Nacional (Pessoa Jurídica), considerando sua renda e custos para mostrar onde você paga menos imposto." 
    },
    { 
      q: "Por que informar os custos mensais é importante?", 
      a: "Gastos como aluguel, luz e insumos podem ser deduzidos ou impactar o lucro real. Informá-los garante que a simulação reflita sua realidade financeira atual." 
    },
    { 
      q: "A simulação segue as regras de qual ano?", 
      a: "Os cálculos são baseados nas tabelas tributárias vigentes para o ano de 2026, focando nas categorias de profissionais liberais atendidas pelo sistema." 
    },
    { 
      q: "O resultado gerado serve como documento oficial?", 
      a: "Não. Esta é uma ferramenta de apoio ao planejamento e educação fiscal. Para declarações oficiais ou mudanças de regime tributário, consulte sempre um contador." 
    }
  ];

  return (
    <div
      className="container-fluid p-0 min-vh-100 d-flex flex-column animate__animated animate__fadeIn"
      style={{ backgroundColor: "#f8f9fa", fontFamily: "'Poppins', sans-serif", color: "#1A2530" }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
          .navbar-custom { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(0, 0, 0, 0.05); padding: 15px 8%; position: sticky; top: 0; z-index: 1000; }
          .hero-section { background: linear-gradient(135deg, #6c63ff 0%, #5a52d5 100%); padding: 80px 0; margin-bottom: -80px; color: white; text-align: center; }
          .faq-item { background: white; border-radius: 15px; margin-bottom: 15px; border: 1px solid rgba(0,0,0,0.03); }
          .faq-question { padding: 20px; cursor: pointer; display: flex; justify-content: space-between; font-weight: 600; }
          .footer-custom { background: #1A2530; color: white; padding: 60px 0 30px; margin-top: auto; }
          .footer-link { color: rgba(255,255,255,0.7); text-decoration: none; transition: 0.3s; font-size: 0.9rem; }
          .footer-link:hover { color: #6c63ff; padding-left: 5px; }
          .footer-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 1.5rem; position: relative; }
          .footer-title::after { content: ''; display: block; width: 30px; height: 2px; background: #6c63ff; margin-top: 8px; }
        `}
      </style>

      <nav className="navbar-custom d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <div style={{ backgroundColor: "#6c63ff", padding: "8px 12px", borderRadius: "8px", color: "white", fontWeight: "bold", marginRight: "10px" }}>NAF</div>
          <span className="fw-bold fs-5">Calculadora Web de PJ e PF</span>
        </div>
        <button onClick={handleLogout} className="btn btn-sm fw-bold rounded-pill px-4" style={{ backgroundColor: "rgba(108, 99, 255, 0.1)", color: "#6c63ff" }}>Sair</button>
      </nav>

      <div className="hero-section">
        <div className="container px-4">
          <h2 className="fw-bold mb-3">Educação Fiscal e Planejamento Tributário</h2>
          <p className="opacity-75 mx-auto fs-5" style={{ maxWidth: "800px" }}>Compare a carga tributária entre Pessoa Física e Jurídica de forma simples.</p>
        </div>
      </div>

      <div className="container pb-5" style={{ position: "relative", zIndex: 10 }}>
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="mb-5 shadow-lg border-0 bg-white" style={{ borderRadius: "24px", padding: "10px" }}>
              {!result ? (
                <CalculatorForm onCompare={handleCompare} />
              ) : (
                <CompareResult result={result} onBack={() => setResult(null)} />
              )}
            </div>

            <div className="mt-5 pt-4">
              <h4 className="fw-bold mb-4 text-center">Perguntas Frequentes</h4>
              {faqs.map((item, index) => (
                <div className="faq-item shadow-sm" key={index}>
                  <div className="faq-question" onClick={() => toggleFaq(index)}>
                    {item.q}
                    <span style={{ transform: openFaq === index ? 'rotate(180deg)' : 'none', transition: '0.3s' }}>▼</span>
                  </div>
                  {openFaq === index && (
                    <div className="px-4 pb-4 text-muted animate__animated animate__fadeIn" style={{ fontSize: "0.95rem" }}>
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="footer-custom">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-4 col-md-6">
              <h5 className="footer-title">Sobre o NAF</h5>
              <p className="small opacity-75">
                O Núcleo de Apoio Contábil e Fiscal é uma iniciativa para oferecer suporte tributário e promover a educação fiscal para a sociedade e profissionais liberais através do Centro Universitário Christus.
              </p>
            </div>
            
            <div className="col-lg-4 col-md-6">
              <h5 className="footer-title">Bases de Consulta</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="https://www.gov.br/receitafederal/pt-br" target="_blank" rel="noreferrer" className="footer-link">Receita Federal do Brasil</a></li>
                <li className="mb-2"><a href="https://www8.receita.fazenda.gov.br/SimplesNacional/" target="_blank" rel="noreferrer" className="footer-link">Portal do Simples Nacional</a></li>
                <li className="mb-2"><a href="https://www.gov.br/empresas-e-negocios/pt-br/empreendedor" target="_blank" rel="noreferrer" className="footer-link">Portal do Empreendedor</a></li>
              </ul>
            </div>

            <div className="col-lg-4 col-md-12">
              <h5 className="footer-title">Institucional</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="https://unichristus.edu.br" target="_blank" rel="noreferrer" className="footer-link">Página Inicial Unichristus</a></li>
              </ul>
            </div>
          </div>
          
          <hr className="my-4 opacity-25" />
          
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <span className="small opacity-50">© 2026 - Desenvolvido para a Disciplina de Frameworks Web.</span>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <span className="badge rounded-pill" style={{ backgroundColor: "rgba(108, 99, 255, 0.2)", color: "#6c63ff", padding: "8px 15px" }}>ADS Unichristus</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
