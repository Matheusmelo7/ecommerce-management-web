import { useState } from "react";
import axios from "axios";

function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/ecommerce-management/v1/costumers/forgot-password", { email }, {
                headers: { "Content-Type": "application/json" },
            });
            setMessage("E-mail de recuperação enviado com sucesso!");
        } catch (error) {
            setMessage("Erro ao enviar e-mail de recuperação. Tente novamente.");
        }
    };

    return (
        <div className="cafeteria-theme">
            <h1>Recuperação de Senha</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Enviar</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ForgotPasswordPage;
