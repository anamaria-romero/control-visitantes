import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RegistroVigilante.css";
import logo from "../assets/logo.png";
import vigilanteHombre from "../assets/vigilante-hombre.png";
import vigilanteMujer from "../assets/vigilante-mujer.png";
import Mensaje from "./Mensaje";

const RegistroVigilante = () => {
    const [documento, setDocumento] = useState("");
    const [nombre, setNombre] = useState("");
    const [genero, setGenero] = useState(null);
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

        if (!documento || !nombre || !genero) {
            setMensaje({
                texto: "Por favor complete todos los campos y seleccione un género",
                tipo: "error",
            });
            return;
        }

        const infoVigilante = {
            documento,
            nombre,
            genero,
        };

        try {
            const res = await fetch("http://localhost:3001/api/vigilantes/registrar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(infoVigilante),
            });

            if (!res.ok) throw new Error("Error al registrar vigilante");

            localStorage.setItem("vigilante", JSON.stringify(infoVigilante));
            navigate("/home");
        } catch (error) {
            console.error("Error:", error);
            setMensaje({ texto: "Error al registrar el vigilante", tipo: "error" });
        }
    };

    return (
        <div className="entrada-container">
            <div className="entrada-form">
                <img
                    src={logo}
                    alt="Logo"
                    className="logo-form"
                    onClick={() => navigate("/")}
                    style={{ cursor: "pointer" }}
                />
                <h2>
                    <span className="titulo-negro">REGISTRO</span>{" "}
                    <span className="titulo-azul">VIGILANTE</span>
                </h2>

                {mensaje.texto && <Mensaje tipo={mensaje.tipo} texto={mensaje.texto} />}

                <form onSubmit={handleSubmit}>
                    <label>Documento de Identidad:</label>
                    <input
                        type="text"
                        placeholder="Número de documento"
                        value={documento}
                        onChange={(e) => setDocumento(e.target.value)}
                    />

                    <label>Nombre:</label>
                    <input
                        type="text"
                        placeholder="Nombre completo"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />

                    <label>Seleccione su ícono:</label>
                    <div className="iconos-genero">
                        <img
                            src={vigilanteHombre}
                            alt="Hombre"
                            className={`icono-genero ${genero === "hombre" ? "seleccionado" : ""}`}
                            onClick={() => setGenero("hombre")}
                        />
                        <img
                            src={vigilanteMujer}
                            alt="Mujer"
                            className={`icono-genero ${genero === "mujer" ? "seleccionado" : ""}`}
                            onClick={() => setGenero("mujer")}
                        />
                    </div>

                    <button className="submit" type="submit">REGISTRAR</button>
                </form>
            </div>
        </div>
    );
};

export default RegistroVigilante;
