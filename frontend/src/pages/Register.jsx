import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import planejamento from "../images/planejamento.png";

export default function Register() {
  const api = axios.create({
    baseURL: "http://localhost:5000/auth",
    timeout: 1000,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "O nome é obrigatório";
    if (!formData.email) newErrors.email = "O e-mail é obrigatório";
    if (!formData.password) newErrors.password = "A senha é obrigatória";
    if (formData.password.length < 8) newErrors.password = "Mínimo 8 caracteres";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "As senhas não conferem";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      api.post("/register", { email: formData.email, password: formData.password })
        .then(() => navigate("/login"))
        .catch((error) => console.error(error));
    }
  };

  return (
    /*Inicio estilização */ 
    <div className="container-fluid p-0 vh-100 d-flex animate__animated animate__fadeIn" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
          .register-card { background: white; border-radius: 24px; padding: 40px; width: 100%; max-width: 450px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
          .illustration-side { background-color: #ffffff; display: flex; align-items: center; justify-content: center; flex: 1; }
          .form-side { background-color: #1A2530; display: flex; align-items: center; justify-content: center; padding: 20px; flex: 1; }
          .form-control { background-color: #f0f2f5; border: none; padding: 12px; border-radius: 12px; font-size: 0.9rem; }
          .form-control:focus { background-color: #fff; border-color: #6c63ff; box-shadow: none; }
          .btn-primary-custom { background: #6c63ff; border: none; padding: 12px; border-radius: 12px; font-weight: 600; transition: all 0.3s; color: white; }
          .btn-primary-custom:hover { background: #5a52d5; transform: translateY(-2px); }
          .password-hints { font-size: 0.7rem; color: #6c757d; line-height: 1.2; margin-top: 8px; }
        `}
      </style>
        
      <div className="form-side">
        <div className="register-card">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark mb-1">Criar Conta</h2>
            <p className="text-muted small">Registe-se para aceder à Calculadora do NAF</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary">Nome Completo</label>
              <input type="text" className={`form-control ${errors.name ? "is-invalid" : ""}`} placeholder="" name="name" value={formData.name} onChange={handleChange} />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary">E-mail Profissional</label>
              <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} placeholder="" name="email" value={formData.email} onChange={handleChange} />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label small fw-bold text-secondary">Crie sua senha</label>
                <input type="password" className={`form-control ${errors.password ? "is-invalid" : ""}`} name="password" value={formData.password} onChange={handleChange} />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                <p className="password-hints">
                  Sua senha deve ter entre 8, conter letras (pelo menos uma maiuscula), números e não deve conter espaços ou emojis.
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label small fw-bold text-secondary">Repita sua senha</label>
                <input type="password" className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
              </div>
            </div>

            <div className="d-grid gap-2 mt-4">
              <button type="submit" className="btn btn-primary-custom">Finalizar Cadastro</button>
            </div>
          </form>

          <p className="text-center mt-4 small">
            Já possui uma conta? <Link to="/login" className="fw-bold text-decoration-none" style={{ color: "#6c63ff" }}>Entrar agora</Link>
          </p>
        </div>
      </div>

      <div className="illustration-side d-none d-lg-flex">
        <div className="text-center" style={{ width: '85%' }}>
          <img src={planejamento} alt="Planejamento NAF" style={{ width: "100%", height: "auto" }} />
          <div className="mt-4 px-5">
            <h4 className="fw-bold" style={{ color: "#1A2530" }}></h4>
            <p className="text-muted"></p>
          </div>
        </div>
      </div>
    </div>
  );
}