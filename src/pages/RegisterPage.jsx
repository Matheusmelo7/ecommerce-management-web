import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        pass: "",
        phone: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();  // Usando o hook useNavigate

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita o reload da página

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
        <div className="register-container">
            <div className="register-box">
                <h1>Cadastro</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nome"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="pass"
                        placeholder="Senha"
                        value={formData.pass}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Telefone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Cadastrar</button>
                </form>
                {errorMessage && <p className="error">{errorMessage}</p>}
                <p>
                    Já tem uma conta? <a href="/login">Faça login</a>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
