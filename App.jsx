import { useState, useEffect } from "react";

const STORAGE_KEY = "nfc_profiles";

function getProfiles() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveProfile(id, data) {
  const profiles = getProfiles();
  profiles[id] = data;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

// ── LANDING PAGE ──────────────────────────────────────────────────────────────
function Landing({ onBuy, onRegister, onScanDemo }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0a0a0a 0%, #1a0a00 50%, #0a0a0a 100%)",
      fontFamily: "'Segoe UI', sans-serif",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <header style={{
        padding: "20px 28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,120,0,0.15)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg,#ff7800,#ff3300)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>🏍️</div>
          <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: 1 }}>SafeTag</span>
        </div>
        <button onClick={onRegister} style={{
          background: "transparent", border: "1.5px solid #ff7800",
          color: "#ff7800", borderRadius: 8, padding: "8px 18px",
          cursor: "pointer", fontWeight: 700, fontSize: 14,
        }}>
          Ya tengo mi sticker →
        </button>
      </header>

      {/* Hero */}
      <main style={{ flex: 1, padding: "60px 28px 40px", maxWidth: 480, margin: "0 auto", width: "100%" }}>
        <div style={{
          background: "rgba(255,120,0,0.08)",
          border: "1px solid rgba(255,120,0,0.2)",
          borderRadius: 16, padding: "12px 18px",
          display: "inline-flex", alignItems: "center", gap: 8,
          fontSize: 13, color: "#ff9a40", marginBottom: 28,
        }}>
          <span>📡</span> Tecnología NFC · Sin app · Sin contraseña
        </div>

        <h1 style={{ fontSize: 42, fontWeight: 900, lineHeight: 1.1, margin: "0 0 20px" }}>
          Tu info de<br />
          <span style={{ color: "#ff7800" }}>emergencia</span><br />
          en un sticker
        </h1>

        <p style={{ fontSize: 16, color: "#aaa", lineHeight: 1.7, margin: "0 0 40px" }}>
          Colócalo en tu casco, billetera o llaves. Cualquier persona con un celular puede escanear y ver tus datos vitales al instante — sin descargar nada.
        </p>

        {/* Cards de uso */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 40 }}>
          {[
            { icon: "🏍️", label: "Motociclistas" },
            { icon: "🐾", label: "Mascotas" },
            { icon: "👴", label: "Adultos mayores" },
            { icon: "🚴", label: "Ciclistas" },
          ].map(c => (
            <div key={c.label} style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12, padding: "16px 14px",
              display: "flex", alignItems: "center", gap: 10,
              fontSize: 14, color: "#ddd",
            }}>
              <span style={{ fontSize: 22 }}>{c.icon}</span> {c.label}
            </div>
          ))}
        </div>

        {/* CTA principal */}
        <button onClick={onBuy} style={{
          width: "100%", padding: "18px",
          background: "linear-gradient(135deg,#ff7800,#ff3300)",
          border: "none", borderRadius: 14, color: "#fff",
          fontSize: 18, fontWeight: 800, cursor: "pointer",
          marginBottom: 14, letterSpacing: 0.5,
          boxShadow: "0 8px 32px rgba(255,100,0,0.4)",
        }}>
          🛒 Comprar mi sticker NFC — $25.000
        </button>

        <button onClick={onRegister} style={{
          width: "100%", padding: "16px",
          background: "rgba(255,255,255,0.06)",
          border: "1.5px solid rgba(255,255,255,0.15)",
          borderRadius: 14, color: "#fff",
          fontSize: 16, fontWeight: 700, cursor: "pointer",
        }}>
          Ya tengo mi sticker · Llenar mis datos
        </button>

        {/* Demo */}
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <button onClick={onScanDemo} style={{
            background: "none", border: "none", color: "#ff7800",
            fontSize: 14, cursor: "pointer", textDecoration: "underline",
          }}>
            Ver demo de escaneo →
          </button>
        </div>
      </main>
    </div>
  );
}

// ── FORMULARIO DE REGISTRO ────────────────────────────────────────────────────
function RegisterForm({ onSaved }) {
  const [step, setStep] = useState(1); // 1=código, 2=datos
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    nombre: "", foto: "", sangre: "", alergias: "",
    condiciones: "", medicamentos: "",
    contacto1Nombre: "", contacto1Tel: "",
    contacto2Nombre: "", contacto2Tel: "",
    eps: "", poliza: "",
  });

  const validarCodigo = () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 4) {
      setCodeError("El código debe tener al menos 4 caracteres");
      return;
    }
    setCodeError("");
    setStep(2);
  };

  const handleChange = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleGuardar = () => {
    saveProfile(code.trim().toUpperCase(), { ...form, updatedAt: Date.now() });
    setSaved(true);
    setTimeout(() => onSaved(code.trim().toUpperCase()), 1800);
  };

  const inputStyle = {
    width: "100%", padding: "13px 14px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10, color: "#fff", fontSize: 15,
    outline: "none", boxSizing: "border-box",
  };

  const labelStyle = { fontSize: 12, color: "#888", marginBottom: 5, display: "block", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" };

  if (saved) return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 16, padding: 28,
    }}>
      <div style={{ fontSize: 64 }}>✅</div>
      <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 24, margin: 0 }}>¡Datos guardados!</h2>
      <p style={{ color: "#aaa", textAlign: "center" }}>Tu sticker ya está listo para usarse.</p>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      fontFamily: "'Segoe UI', sans-serif", color: "#fff",
    }}>
      <header style={{
        padding: "18px 24px", display: "flex", alignItems: "center", gap: 12,
        borderBottom: "1px solid rgba(255,120,0,0.15)",
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg,#ff7800,#ff3300)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
        }}>🏍️</div>
        <span style={{ fontWeight: 800, fontSize: 18 }}>SafeTag</span>
      </header>

      <div style={{ padding: "32px 24px", maxWidth: 480, margin: "0 auto" }}>
        {step === 1 ? (
          <>
            <h2 style={{ fontWeight: 900, fontSize: 26, margin: "0 0 8px" }}>Activa tu sticker</h2>
            <p style={{ color: "#888", fontSize: 14, margin: "0 0 32px" }}>
              Ingresa el código que viene impreso en tu sticker NFC.
            </p>
            <div style={{
              background: "rgba(255,120,0,0.08)", border: "1px solid rgba(255,120,0,0.25)",
              borderRadius: 12, padding: 20, marginBottom: 28, textAlign: "center",
            }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📦</div>
              <p style={{ color: "#ccc", fontSize: 14, margin: 0 }}>
                El código está en la parte trasera del sticker, ej: <strong style={{ color: "#ff7800" }}>SAFE-0042</strong>
              </p>
            </div>
            <label style={labelStyle}>Código del sticker</label>
            <input
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Ej: SAFE-0042"
              style={{ ...inputStyle, fontSize: 18, letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}
            />
            {codeError && <p style={{ color: "#ff4444", fontSize: 13, margin: "0 0 12px" }}>{codeError}</p>}
            <button onClick={validarCodigo} style={{
              width: "100%", marginTop: 16, padding: "16px",
              background: "linear-gradient(135deg,#ff7800,#ff3300)",
              border: "none", borderRadius: 12, color: "#fff",
              fontSize: 16, fontWeight: 800, cursor: "pointer",
            }}>
              Continuar →
            </button>
          </>
        ) : (
          <>
            <div style={{
              background: "rgba(255,120,0,0.1)", border: "1px solid rgba(255,120,0,0.3)",
              borderRadius: 8, padding: "10px 14px", marginBottom: 24,
              fontSize: 13, color: "#ff9a40", display: "flex", alignItems: "center", gap: 8,
            }}>
              🔑 Sticker: <strong>{code.toUpperCase()}</strong>
            </div>

            <h2 style={{ fontWeight: 900, fontSize: 24, margin: "0 0 6px" }}>Tus datos de emergencia</h2>
            <p style={{ color: "#777", fontSize: 13, margin: "0 0 28px" }}>Solo se mostrará lo que tú llenes.</p>

            {/* Datos personales */}
            <Section title="👤 Datos personales">
              <Field label="Nombre completo" style={inputStyle} labelStyle={labelStyle}
                value={form.nombre} onChange={v => handleChange("nombre", v)} placeholder="Ej: Carlos Ramírez" />
              <Field label="Tipo de sangre" style={inputStyle} labelStyle={labelStyle}
                value={form.sangre} onChange={v => handleChange("sangre", v)} placeholder="Ej: O+" />
            </Section>

            {/* Médico */}
            <Section title="🏥 Información médica">
              <Field label="Alergias a medicamentos" style={inputStyle} labelStyle={labelStyle}
                value={form.alergias} onChange={v => handleChange("alergias", v)} placeholder="Ej: Penicilina, Ibuprofeno" />
              <Field label="Condiciones o enfermedades" style={inputStyle} labelStyle={labelStyle}
                value={form.condiciones} onChange={v => handleChange("condiciones", v)} placeholder="Ej: Diabetes tipo 2, Epilepsia" />
              <Field label="Medicamentos que toma" style={inputStyle} labelStyle={labelStyle}
                value={form.medicamentos} onChange={v => handleChange("medicamentos", v)} placeholder="Ej: Metformina 500mg" />
            </Section>

            {/* Contactos */}
            <Section title="📞 Contactos de emergencia">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Nombre contacto 1" style={inputStyle} labelStyle={labelStyle}
                  value={form.contacto1Nombre} onChange={v => handleChange("contacto1Nombre", v)} placeholder="Mamá / Papá..." />
                <Field label="Teléfono" style={inputStyle} labelStyle={labelStyle}
                  value={form.contacto1Tel} onChange={v => handleChange("contacto1Tel", v)} placeholder="300..." />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Nombre contacto 2" style={inputStyle} labelStyle={labelStyle}
                  value={form.contacto2Nombre} onChange={v => handleChange("contacto2Nombre", v)} placeholder="Esposa / Amigo..." />
                <Field label="Teléfono" style={inputStyle} labelStyle={labelStyle}
                  value={form.contacto2Tel} onChange={v => handleChange("contacto2Tel", v)} placeholder="310..." />
              </div>
            </Section>

            {/* EPS */}
            <Section title="💊 EPS / Seguro">
              <Field label="EPS o aseguradora" style={inputStyle} labelStyle={labelStyle}
                value={form.eps} onChange={v => handleChange("eps", v)} placeholder="Ej: Sura, Sanitas" />
              <Field label="Número de póliza (opcional)" style={inputStyle} labelStyle={labelStyle}
                value={form.poliza} onChange={v => handleChange("poliza", v)} placeholder="Ej: 123456789" />
            </Section>

            <button onClick={handleGuardar} style={{
              width: "100%", padding: "18px",
              background: "linear-gradient(135deg,#ff7800,#ff3300)",
              border: "none", borderRadius: 14, color: "#fff",
              fontSize: 17, fontWeight: 800, cursor: "pointer",
              marginTop: 8, boxShadow: "0 8px 24px rgba(255,100,0,0.35)",
            }}>
              💾 Guardar mis datos
            </button>
            <p style={{ color: "#555", fontSize: 12, textAlign: "center", marginTop: 12 }}>
              Puedes actualizar tus datos en cualquier momento con el mismo código.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: "#ff9a40", margin: "0 0 14px", letterSpacing: 0.5 }}>{title}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, style, labelStyle }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} style={style} />
    </div>
  );
}

// ── VISTA DE ESCANEO ──────────────────────────────────────────────────────────
function ProfileView({ profileId, onBack }) {
  const profiles = getProfiles();
  const p = profiles[profileId];

  if (!p) return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a", color: "#fff",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: 28, gap: 16,
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{ fontSize: 56 }}>❓</div>
      <h2 style={{ fontWeight: 800, margin: 0 }}>Sticker no registrado</h2>
      <p style={{ color: "#888", textAlign: "center" }}>
        Este sticker aún no tiene datos. Si es tuyo, ve a SafeTag y regístralo.
      </p>
      <button onClick={onBack} style={{
        marginTop: 8, padding: "12px 28px",
        background: "linear-gradient(135deg,#ff7800,#ff3300)",
        border: "none", borderRadius: 10, color: "#fff",
        fontSize: 15, fontWeight: 700, cursor: "pointer",
      }}>Registrar ahora</button>
    </div>
  );

  const Pill = ({ text, color = "#ff7800" }) => text ? (
    <span style={{
      background: `${color}22`, border: `1px solid ${color}55`,
      borderRadius: 20, padding: "5px 14px", fontSize: 14,
      color: color, display: "inline-block", margin: "3px 3px 3px 0",
    }}>{text}</span>
  ) : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg,#1a0000 0%,#0a0a0a 40%)",
      fontFamily: "'Segoe UI', sans-serif", color: "#fff",
    }}>
      {/* Banner emergencia */}
      <div style={{
        background: "linear-gradient(135deg,#cc0000,#ff3300)",
        padding: "14px 24px", textAlign: "center",
        fontSize: 15, fontWeight: 800, letterSpacing: 1,
      }}>
        🚨 PERFIL DE EMERGENCIA · SAFETAG
      </div>

      <div style={{ padding: "28px 24px", maxWidth: 480, margin: "0 auto" }}>
        {/* Avatar y nombre */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%", margin: "0 auto 14px",
            background: "linear-gradient(135deg,#ff7800,#cc3300)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, border: "3px solid rgba(255,120,0,0.4)",
          }}>🏍️</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 4px" }}>
            {p.nombre || "Sin nombre"}
          </h1>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,0,0,0.15)", border: "1px solid rgba(255,0,0,0.4)",
            borderRadius: 20, padding: "6px 16px", fontSize: 16, fontWeight: 800, color: "#ff4444",
          }}>
            🩸 {p.sangre || "No registrado"}
          </div>
        </div>

        {/* Alergias — destacado */}
        {p.alergias && (
          <div style={{
            background: "rgba(255,60,0,0.12)", border: "2px solid rgba(255,60,0,0.4)",
            borderRadius: 14, padding: "16px 18px", marginBottom: 16,
          }}>
            <div style={{ fontSize: 12, color: "#ff6633", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>
              ⚠️ ALERGIAS A MEDICAMENTOS
            </div>
            <div style={{ fontSize: 15, color: "#ffaa88", fontWeight: 600 }}>{p.alergias}</div>
          </div>
        )}

        {/* Condiciones */}
        {p.condiciones && (
          <Card icon="🏥" title="Condiciones médicas">
            <div style={{ color: "#ddd", fontSize: 15 }}>{p.condiciones}</div>
          </Card>
        )}

        {/* Medicamentos */}
        {p.medicamentos && (
          <Card icon="💊" title="Medicamentos actuales">
            <div style={{ color: "#ddd", fontSize: 15 }}>{p.medicamentos}</div>
          </Card>
        )}

        {/* Contactos */}
        {(p.contacto1Nombre || p.contacto2Nombre) && (
          <Card icon="📞" title="Contactos de emergencia">
            {p.contacto1Nombre && (
              <ContactRow name={p.contacto1Nombre} tel={p.contacto1Tel} />
            )}
            {p.contacto2Nombre && (
              <ContactRow name={p.contacto2Nombre} tel={p.contacto2Tel} />
            )}
          </Card>
        )}

        {/* EPS */}
        {p.eps && (
          <Card icon="💳" title="EPS / Seguro médico">
            <div style={{ color: "#ddd", fontSize: 15 }}>{p.eps}</div>
            {p.poliza && <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>Póliza: {p.poliza}</div>}
          </Card>
        )}

        <div style={{
          textAlign: "center", marginTop: 28, padding: "16px",
          background: "rgba(255,255,255,0.03)", borderRadius: 10,
          fontSize: 12, color: "#555",
        }}>
          SafeTag · Sticker ID: {profileId}<br />
          Si encontraste este objeto, por favor contacta a los números arriba.
        </div>

        {onBack && (
          <button onClick={onBack} style={{
            width: "100%", marginTop: 14, padding: "14px",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 10, color: "#888", fontSize: 14, cursor: "pointer",
          }}>
            ← Volver
          </button>
        )}
      </div>
    </div>
  );
}

function Card({ icon, title, children }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
      borderRadius: 14, padding: "16px 18px", marginBottom: 12,
    }}>
      <div style={{ fontSize: 12, color: "#888", fontWeight: 700, letterSpacing: 0.5, marginBottom: 10 }}>
        {icon} {title.toUpperCase()}
      </div>
      {children}
    </div>
  );
}

function ContactRow({ name, tel }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: "rgba(255,120,0,0.08)", borderRadius: 8, padding: "10px 12px", marginBottom: 8,
    }}>
      <span style={{ fontSize: 14, color: "#ddd" }}>{name}</span>
      <a href={`tel:${tel}`} style={{
        background: "linear-gradient(135deg,#ff7800,#ff3300)",
        border: "none", borderRadius: 6, color: "#fff",
        padding: "6px 14px", fontSize: 14, fontWeight: 700,
        textDecoration: "none",
      }}>📲 {tel}</a>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("landing"); // landing | register | profile | buy
  const [profileId, setProfileId] = useState(null);

  // Simular URL param: ?id=SAFE-0001
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) { setProfileId(id.toUpperCase()); setScreen("profile"); }
  }, []);

  const demoProfile = () => {
    saveProfile("DEMO-001", {
      nombre: "Carlos Ramírez",
      sangre: "O+",
      alergias: "Penicilina, Diclofenaco",
      condiciones: "Diabetes tipo 2",
      medicamentos: "Metformina 500mg (2 veces al día)",
      contacto1Nombre: "María Ramírez (Mamá)",
      contacto1Tel: "3001234567",
      contacto2Nombre: "Jorge Ramírez (Hermano)",
      contacto2Tel: "3109876543",
      eps: "Sura",
      poliza: "POL-2024-00821",
    });
    setProfileId("DEMO-001");
    setScreen("profile");
  };

  if (screen === "landing") return (
    <Landing
      onBuy={() => setScreen("buy")}
      onRegister={() => setScreen("register")}
      onScanDemo={demoProfile}
    />
  );

  if (screen === "buy") return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a", color: "#fff",
      fontFamily: "'Segoe UI', sans-serif", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, gap: 20,
    }}>
      <div style={{ fontSize: 60 }}>🛒</div>
      <h2 style={{ fontWeight: 900, fontSize: 26, margin: 0, textAlign: "center" }}>
        Comprar Sticker NFC
      </h2>
      <div style={{
        background: "rgba(255,120,0,0.08)", border: "1px solid rgba(255,120,0,0.25)",
        borderRadius: 16, padding: 24, width: "100%", maxWidth: 400,
      }}>
        <div style={{ fontSize: 40, marginBottom: 8, textAlign: "center" }}>📦</div>
        <h3 style={{ textAlign: "center", margin: "0 0 8px", color: "#ff9a40" }}>Kit SafeTag Moto</h3>
        <ul style={{ color: "#bbb", fontSize: 14, lineHeight: 2, paddingLeft: 20 }}>
          <li>1 sticker NFC resistente al agua</li>
          <li>1 sticker NFC de respaldo</li>
          <li>Código único de activación</li>
          <li>Soporte para actualizar datos</li>
        </ul>
        <div style={{ textAlign: "center", fontSize: 28, fontWeight: 900, color: "#ff7800", margin: "12px 0" }}>$25.000 COP</div>
        <button style={{
          width: "100%", padding: "16px",
          background: "linear-gradient(135deg,#ff7800,#ff3300)",
          border: "none", borderRadius: 12, color: "#fff",
          fontSize: 16, fontWeight: 800, cursor: "pointer",
        }}>Pedir por WhatsApp 📲</button>
      </div>
      <button onClick={() => setScreen("landing")} style={{
        background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 14,
      }}>← Volver</button>
    </div>
  );

  if (screen === "register") return (
    <RegisterForm onSaved={id => { setProfileId(id); setScreen("profile"); }} />
  );

  if (screen === "profile") return (
    <ProfileView profileId={profileId} onBack={() => setScreen("landing")} />
  );
}
