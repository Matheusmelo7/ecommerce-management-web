import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // Importando corretamente o ícone

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        pass: "",
        phone: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");  // Novo estado para erro da senha
    const navigate = useNavigate();  // Usando o hook useNavigate

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Validação da senha
        if (name === "pass") {
            const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordValidation.test(value)) {
                setPasswordError("A senha deve ter pelo menos 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial.");
            } else {
                setPasswordError("");  // Limpa o erro se a senha for válida
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita o reload da página

        if (passwordError) {
            alert("Corrija os erros no formulário.");
            return; // Não envia o formulário se houver erro na senha
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/ecommerce-management/v1/costumers/create",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Usuário cadastrado com sucesso:", response.data);
            alert("Usuário cadastrado com sucesso!");

            // Redireciona para a página de login após o sucesso
            navigate("/login"); // Redirecionando para a página de login
        } catch (error) {
            console.error("Erro ao cadastrar o usuário:", error.response?.data || error.message);
            setErrorMessage("Erro ao cadastrar o usuário. Tente novamente.");
        }
    };

    return (
        <div style={{ fontFamily: "Arial, sans-serif", height: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Barra de navegação */}
            <nav style={{ background: "#333", color: "#fff", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    <button
                        onClick={() => navigate("/")}  // Usamos o navigate para voltar para a página de produtos
                        style={{
                            background: "#007BFF",
                            color: "#fff",
                            border: "none",
                            padding: "8px 15px",  // Tamanho menor
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",  // Distância entre o ícone e o texto
                        }}
                    >
                        <FaArrowLeft style={{ fontSize: "18px" }} /> {/* Ícone menor */}
                        Voltar para Produtos
                    </button>
                </div>
                <h1 style={{ margin: 0 }}>Grain & Flavor</h1>
                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    <button
                        onClick={() => navigate("/login")}  // Rota para página de login
                        style={{
                            background: "#007BFF",
                            color: "#fff",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "16px",
                        }}
                    >
                        Já tem uma conta? Faça login
                    </button>
                </div>
            </nav>

            {/* Conteúdo principal */}
            <div style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                boxSizing: "border-box", // Garantindo que o padding seja considerado
                padding: "20px",  // Ajustando o padding para melhor visualização
                height: "calc(100vh - 60px)",  // Ajustando a altura para evitar espaços vazios
            }}>
                <div style={{
                    maxWidth: "400px", width: "100%", background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
                }}>
                    <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Cadastro</h2>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nome"
                            value={formData.name}
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
                        {passwordError && <p style={{ color: "red", fontSize: "12px" }}>{passwordError}</p>}
                        <input
                            type="text"
                            name="phone"
                            placeholder="Telefone"
                            value={formData.phone}
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
                            Cadastrar
                        </button>
                    </form>
                    {errorMessage && <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>{errorMessage}</p>}
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
