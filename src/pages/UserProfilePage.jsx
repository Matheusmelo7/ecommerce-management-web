import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function UserProfilePage() {
    const [userData, setUserData] = useState(null);
    const [userOrders, setUserOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false); // Para capturar erros
    const navigate = useNavigate();

    const userId = localStorage.getItem("idUser"); // Substitua com o id real do usuário que está logado

    // Função para configurar os headers de autenticação
    const getAuthHeaders = () => {
        const token = localStorage.getItem("authToken");
        if (token) {
            return {
                Authorization: `${token}`, // Incluindo o token de autenticação
            };
        }
        return {};
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/ecommerce-management/v1/costumers/${userId}`, {
                    headers: getAuthHeaders(), // Incluindo o token de autenticação nos headers
                });
                setUserData(response.data);
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
                setIsError(true); // Define o erro se não conseguir buscar os dados
            }
        };

        fetchUserData();
    }, [userId]);

    const handleViewOrders = async () => {
        setIsLoading(true);
        setIsError(false); // Reseta o erro
        try {
            const response = await axios.get(`http://localhost:8080/ecommerce-management/v1/orders/costumer/${userId}`, {
                headers: getAuthHeaders(), // Incluindo o token de autenticação nos headers
            });
            setUserOrders(response.data);
        } catch (error) {
            console.error("Erro ao buscar pedidos:", error);
            setIsError(true); // Define o erro se não conseguir buscar os pedidos
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ fontFamily: "Arial, sans-serif", height: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Barra de navegação */}
            <nav style={{
                background: "#333", color: "#fff", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap"
            }}>
                <h1 style={{ margin: 0, flex: 1 }}>Grain & Flavor</h1>
                <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
                    <button
                        onClick={() => navigate("/")} // Navega de volta para a página de produtos
                        style={{
                            background: "#007BFF",
                            color: "#fff",
                            border: "none",
                            padding: "8px 15px",  // Tamanho menor
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "14px",
                        }}
                    >
                        Voltar para Produtos
                    </button>
                </div>
            </nav>

            {/* Conteúdo principal */}
            <div style={{ flex: 1, padding: "20px", overflowY: "auto", backgroundColor: "#f5f5f5" }}>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Meus Dados</h2>
                {userData ? (
                    <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}>
                        <p><strong>Nome:</strong> {userData.name}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>Telefone:</strong> {userData.phone}</p>
                        <p><strong>Criado em:</strong> {new Date(userData.create_at).toLocaleDateString()}</p>

                        <button
                            onClick={handleViewOrders}
                            style={{
                                backgroundColor: "#007BFF",
                                color: "#fff",
                                border: "none",
                                padding: "10px 20px",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "16px",
                                marginTop: "20px",
                            }}
                        >
                            {isLoading ? "Carregando pedidos..." : "Ver Meus Pedidos"}
                        </button>
                    </div>
                ) : (
                    isError && (
                        <div style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
                            <p>Erro ao carregar os dados do usuário.</p>
                        </div>
                    )
                )}

                {/* Lista de Pedidos */}
                {userOrders.length > 0 && (
                    <div style={{ marginTop: "40px" }}>
                        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Meus Pedidos</h2>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                                gap: "20px",
                                maxWidth: "1200px",
                                margin: "0 auto",
                            }}
                        >
                            {userOrders.map((order) => (
                                <div
                                    key={order.id_order}
                                    style={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                                        padding: "15px",
                                        textAlign: "center",
                                    }}
                                >
                                    <h3 style={{ fontSize: "20px", margin: "10px 0" }}>Pedido #{order.id_order}</h3>
                                    <p><strong>Status:</strong> {order.status}</p>
                                    <p><strong>Valor Total:</strong> R${order.value_total}</p>
                                    <p><strong>Endereço de Entrega:</strong> {order.delivery_address || "Não especificado"}</p>

                                    <h4 style={{ marginTop: "10px" }}>Itens do Pedido</h4>
                                    {order.order_items_entity.map((item, index) => (
                                        <div key={index} style={{ marginBottom: "10px" }}>
                                            <p>{item.productsEntity.name} - {item.quantity}x </p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserProfilePage;
