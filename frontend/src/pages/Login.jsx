import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import moca_telefone from "../images/moca_telefone.png"; 

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div 
      className="container-fluid p-0 vh-100 d-flex animate__animated animate__fadeInUp" 
      style={{ 
        overflow: "hidden",
        backgroundColor: "#FFFFFF", 
        fontFamily: "'Poppins', sans-serif"
      }}
    >
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');`}
      </style>

      <div className="row w-100 m-0">
        
        {/* COLUNA DA ESQUERDA: FORMULÁRIO */}
        <div className="col-lg-6 d-flex justify-content-center align-items-center">
          <div
            className="card shadow-lg border-0 p-5 animate__animated animate__zoomIn"
            style={{
              maxWidth: "450px",
              width: "90%",
              borderRadius: "24px", 
              backgroundColor: "#FFFFFF",
              boxShadow: "0 10px 50px rgba(0,0,0,0.04)" 
            }}
          >
            <div className="text-center mb-4"> 
              <h2 className="fw-bold mb-1" style={{ color: "#1A2530", fontSize: "1.7rem" }}>Login</h2>
              <p className="text-muted mt-0 mb-0" style={{ fontSize: "0.95rem" }}>
                Bem-vinda de volta ao seu painel tributário
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-medium" style={{ color: "#4b5563", fontSize: "0.9rem" }}>Email</label>
                <input
                  type="email"
                  className={`form-control form-control-lg rounded-3 ${errors.email ? "is-invalid" : ""}`}
                  style={{ backgroundColor: "#f9fafb", fontSize: "0.95rem", border: "1px solid #e5e7eb" }}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nome@exemplo.com"
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium" style={{ color: "#4b5563", fontSize: "0.9rem" }}>Senha</label>
                <input
                  type="password"
                  className={`form-control form-control-lg rounded-3 ${errors.password ? "is-invalid" : ""}`}
                  style={{ backgroundColor: "#f9fafb", fontSize: "0.95rem", border: "1px solid #e5e7eb" }}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>

              <div className="d-grid mb-3">
                <button
                  type="submit"
                  className="btn fw-bold rounded-3"
                  style={{ 
                    backgroundColor: "#6c63ff", 
                    color: "white",
                    padding: "14px",
                    border: "none"
                  }}
                >
                  Entrar na conta
                </button>
              </div>
            </form>

            <p className="text-center mt-3 mb-0" style={{ fontSize: "0.9rem" }}>
              Ainda não tem conta?{" "}
              <Link to="/register" style={{ color: "#6c63ff", fontWeight: "600", textDecoration: "none" }}>
                Criar cadastro
              </Link>
            </p>
          </div>
        </div>

        {/* COLUNA DA DIREITA: ILUSTRAÇÃO */}
        <div 
          className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center" 
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <img 
            src={moca_telefone} 
            alt="Moça no telefone" 
            className="img-fluid animate__animated animate__fadeIn" 
            style={{ 
              maxHeight: "75vh", 
              objectFit: "contain",
              mixBlendMode: "multiply" 
            }} 
          />
        </div>

      </div>
    </div>
  );
}