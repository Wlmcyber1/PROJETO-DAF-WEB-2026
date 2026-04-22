import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function InfoModal({ show, onHide }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Informações</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>Renda Mensal</h6>
        <p className="small">É o valor que você espera receber por mês com o seu trabalho. No caso da psicologia, pode ser o total recebido das consultas, atendimentos ou serviços prestados, antes de descontar as despesas.</p>
        <h6>Custos Mensais</h6>
        <p className="small">São os gastos mensais necessários para o seu trabalho acontecer, como aluguel da sala, internet, energia, telefone, material de escritório, entre outros. Essas despesas podem ser usadas para reduzir a base de cálculo do imposto (no caso da pessoa física).</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Fechar</Button>
      </Modal.Footer>
    </Modal>
  );
}
