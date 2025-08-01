import React, { useState, useEffect } from "react";
import "./RegistroSalida.css";
import logo from "../assets/logo.png";
import Mensaje from "./Mensaje";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const RegistroSalida = () => {
  const [documento, setDocumento] = useState("");
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (mensaje.texto) {
      const timer = setTimeout(() => {
        setMensaje({ texto: "", tipo: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!documento.trim()) {
      setMensaje({
        texto: "Por favor ingresa un número de documento",
        tipo: "error",
      });
      return;
    }

    const now = new Date();
    const fechaSalida = now.toISOString().split("T")[0];
    const horaSalida = now.toTimeString().split(" ")[0];

    const registroSalida = {
      documento,
      fechaSalida,
      horaSalida,
    };

    try {
      const respuesta = await fetch(`${API_URL}/api/visitantes/salida`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registroSalida),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.error || "Error al registrar salida");
      }

      setMensaje({ texto: "Salida registrada correctamente", tipo: "exito" });
      setDocumento("");
    } catch (error) {
      console.error("Error:", error);
      setMensaje({ texto: error.message, tipo: "error" });
    }
  };

  return (
    <div className="salida-container">
      <div className="salida-form">
        <img
          src={logo}
          alt="Logo"
          className="logo-form"
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer" }}
        />

        <h2>
          <span className="titulo-negro">REGISTRO</span>{" "}
          <span className="titulo-azul">SALIDA</span>
        </h2>

        {mensaje.texto && <Mensaje tipo={mensaje.tipo} texto={mensaje.texto} />}

        <form onSubmit={handleSubmit}>
          <label>Documento de Identidad:</label>
          <input
            type="text"
            placeholder="Número de documento"
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
            required
          />

          <button className="submit" type="submit">
            REGISTRAR SALIDA
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistroSalida;