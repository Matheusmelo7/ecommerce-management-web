import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // Importando corretamente o ícone

function LoginPage() {
    const [formData, setFormData] = useState({ email: "", pass: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [forgotPasswordMessage, setForgotPasswordMessage] = useState(""); // Estado para a mensagem de recuperação de senha
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8080/ecommerce-management/v1/costumers/sign-in",
                formData,
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("Login bem-sucedido:", response.data);
            alert("Login realizado com sucesso!");

            // Armazenando o token no localStorage
            localStorage.setItem("authToken", response.data.access_token);
            localStorage.setItem("idUser", response.data.id);

            // Redireciona para a página inicial (produtos) após o login bem-sucedido
            navigate("/");
        } catch (error) {
            setErrorMessage("Erro no login. Verifique suas credenciais.");
        }
    };

    // Função para enviar a solicitação de recuperação de senha
    const handleForgotPassword = async () => {
        if (!formData.email) {
            setForgotPasswordMessage("Por favor, preencha o campo de e-mail antes de recuperar a senha.");
            return;
        }

        try {
            await axios.post("http://localhost:8080/ecommerce-management/v1/costumers/forgot-password", {
                email: formData.email,
            });
            setForgotPasswordMessage("Instruções para recuperação de senha foram enviadas para o seu e-mail.");
        } catch (error) {
            setForgotPasswordMessage("Erro ao tentar enviar a solicitação de recuperação de senha.");
        }
    };

    return (
        <div style={{ fontFamily: "Arial, sans-serif", height: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Barra de navegação padronizada */}
            <nav style={{
                background: "#333", color: "#fff", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    <button
                        onClick={() => navigate("/")}  // Navegar para a página de produtos
                        style={{
                            background: "#007BFF", color: "#fff", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer", fontSize: "14px",
                            display: "flex", alignItems: "center", gap: "5px"
                        }}
                    >
                        <FaArrowLeft style={{ fontSize: "18px" }} /> {/* Ícone de voltar */}
                        Voltar para Produtos
                    </button>
                </div>
                <h1 style={{ margin: 0 }}>Grain & Flavor</h1>
            </nav>

            {/* Conteúdo principal */}
            <div style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                backgroundColor: "#f5f5f5",
                boxSizing: "border-box", // Garantindo que o padding seja considerado
            }}>
                <div style={{
                    maxWidth: "400px", width: "100%", background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
                }}>
                    <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{
                                padding: "10px",
                                fontSize: "14px",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                            }}
                        />
                        <input
                            type="password"
                            name="pass"
                            placeholder="Senha"
                            value={formData.pass}
                            onChange={handleChange}
                            required
                            style={{
                                padding: "10px",
                                fontSize: "14px",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                background: "#28a745",
                                color: "#fff",
                                padding: "10px 20px",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "16px",
                            }}
                        >
                            Entrar
                        </button>
                    </form>
                    {errorMessage && <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>{errorMessage}</p>}
                    <p style={{ textAlign: "center", marginTop: "20px" }}>
                        Não tem uma conta? <a href="/register">Cadastre-se</a>
                    </p>
                    <p style={{ textAlign: "center", marginTop: "10px" }}>
                        <a href="#" onClick={handleForgotPassword}>Esqueci minha senha</a>
                    </p>
                    {forgotPasswordMessage && (
                        <p style={{ color: forgotPasswordMessage.includes("Erro") ? "red" : "green", textAlign: "center" }}>
                            {forgotPasswordMessage}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
