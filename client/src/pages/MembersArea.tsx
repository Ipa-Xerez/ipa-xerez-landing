import { useState } from "react";
import { trpc } from "../utils/trpc";
import { useLocation } from "wouter";

export default function MembersArea() {
  const [memberNumber, setMemberNumber] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [currentMember, setCurrentMember] = useState<any>(null);
  const [, navigate] = useLocation();

  const validateMember = trpc.members.validateMemberNumber.useQuery(
    { memberNumber },
    { enabled: false }
  );

  const handleLogin = async () => {
    if (!memberNumber.trim()) {
      alert("Por favor ingresa tu número de socio");
      return;
    }

    try {
      const result = await validateMember.refetch();
      if (result.data) {
        setCurrentMember(result.data);
        setAuthenticated(true);
      } else {
        alert("Número de socio no encontrado");
      }
    } catch (error) {
      alert("Error al validar el número de socio");
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setCurrentMember(null);
    setMemberNumber("");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  if (!authenticated) {
    return (
      <div style={{ padding: 40, maxWidth: 400, margin: "0 auto", marginTop: 40 }}>
        <h2>Acceso Área de Socios</h2>
        <p style={{ color: "#666", marginBottom: 20 }}>
          Ingresa tu número de socio para acceder al área privada
        </p>
        <input
          type="text"
          placeholder="Número de socio"
          value={memberNumber}
          onChange={(e) => setMemberNumber(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleLogin()}
          style={{ width: "100%", padding: 10, marginTop: 10, boxSizing: "border-box" }}
        />
        <button
          onClick={handleLogin}
          style={{
            marginTop: 20,
            padding: 10,
            width: "100%",
            background: "#003366",
            color: "white",
            cursor: "pointer",
            border: "none",
            borderRadius: 4,
          }}
        >
          Acceder
        </button>
        <button
          onClick={handleBackToHome}
          style={{
            marginTop: 10,
            padding: 10,
            width: "100%",
            background: "#ccc",
            color: "#333",
            cursor: "pointer",
            border: "none",
            borderRadius: 4,
          }}
        >
          Volver al sitio
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <h1>Área de Socios</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            background: "#d32f2f",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Cerrar sesión
        </button>
      </div>

      <div style={{ background: "#f5f5f5", padding: 20, borderRadius: 8, marginBottom: 30 }}>
        <h3>Bienvenido, {currentMember?.fullName}</h3>
        <p><strong>Número de socio:</strong> {currentMember?.memberNumber}</p>
        <p><strong>Email:</strong> {currentMember?.email || "No registrado"}</p>
        <p><strong>Teléfono:</strong> {currentMember?.phone || "No registrado"}</p>
        <p><strong>Estado:</strong> {currentMember?.status === "active" ? "Activo" : "Inactivo"}</p>
      </div>

      <div style={{ background: "#e3f2fd", padding: 20, borderRadius: 8 }}>
        <h3>Documentos Privados</h3>
        <p style={{ color: "#666" }}>
          Aquí encontrarás los documentos exclusivos para socios de IPA Xerez.
        </p>
        <p style={{ marginTop: 10, fontSize: 14, color: "#999" }}>
          Próximamente: Estatutos, regulaciones y documentos internos.
        </p>
      </div>
    </div>
  );
}
