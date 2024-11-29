import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; // Importa o componente Navbar

function LoginPage() {
    const [formData, setFormData] = useState({ email: "", pass: "" });
    const [errorMessage, setErrorMessage] = useState("");
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

    return (
        <div style={{ fontFamily: "Arial, sans-serif", height: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Barra de navegação */}
            <Navbar cartLength={0} /> {/* Passando o tamanho do carrinho como 0 para a página de login */}

            {/* Conteúdo principal */}
            <div style={{ flex: 1, padding: "20px", overflowY: "auto", backgroundColor: "#f5f5f5" }}>
                <div className="login-container">
                    <div className="login-box">
                        <h1>Login</h1>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <input
                                type="password"
                                name="pass"
                                placeholder="Senha"
                                value={formData.pass}
                                onChange={handleChange}
                            />
                            <button type="submit">Entrar</button>
                        </form>
                        {errorMessage && <p className="error">{errorMessage}</p>}
                        <p>
                            Não tem uma conta? <a href="/register">Cadastre-se</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
