import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";  // Ícone de perfil de usuário

function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [orderId, setOrderId] = useState(null);  // Estado para armazenar o ID do pedido
    const [quantity, setQuantity] = useState(1);  // Estado para a quantidade do produto
    const navigate = useNavigate();  // Navegação programática
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:8080/ecommerce-management/v1/products");
                setProducts(response.data.content);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        };
        fetchProducts();

        // Verificar se o usuário está autenticado
        const token = localStorage.getItem('authToken'); // Já deve conter o token completo (com 'Bearer')
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }

        // Verificar se já existe um pedido no localStorage
        const storedOrderId = localStorage.getItem('orderId');
        if (storedOrderId) {
            setOrderId(storedOrderId);  // Se o pedido já existir no localStorage, recuperamos o ID
        }
    }, []);

    // Função para criar o pedido
    const createOrder = async (id_costumer) => {
        const accessToken = localStorage.getItem('authToken'); // O token já está completo com 'Bearer'
        if (!accessToken) {
            alert("Você precisa estar logado para criar um pedido.");
            navigate("/login");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/ecommerce-management/v1/orders/create", 
                { id_costumer },
                { headers: { Authorization: `${accessToken}` } }  // Envia o token completo com 'Bearer'
            );
            const newOrderId = response.data.id_order;
            setOrderId(newOrderId); // Armazenar o ID do pedido no estado
            localStorage.setItem('orderId', newOrderId); // Armazenar o ID no localStorage para persistência
            return newOrderId;
        } catch (error) {
            console.error("Erro ao criar o pedido:", error);
            alert("Erro ao criar o pedido. Verifique suas permissões.");
        }
    };

    // Função para adicionar item ao carrinho
    const addToCart = async (product) => {
        if (!isAuthenticated) {
            alert("Você precisa estar logado para adicionar itens ao carrinho.");
            navigate("/login");
            return;
        }

        // Verifica se já existe um pedido, caso contrário cria um novo
        if (!orderId) {
            const userId = localStorage.getItem('idUser');  // Certifique-se de armazenar o userId no storage
            const newOrderId = await createOrder(userId);  // Cria um novo pedido se não existir
            setOrderId(newOrderId); // Garantir que o orderId seja atualizado
        }

        // Adiciona o produto com a quantidade selecionada ao carrinho
        const cartItem = { ...product, quantity };
        setCart((prevCart) => [...prevCart, cartItem]);

        // Cria o item no pedido
        try {
            const accessToken = localStorage.getItem('authToken'); // O token já está completo com 'Bearer'
            if (!accessToken) {
                alert("Você precisa estar logado para adicionar itens ao pedido.");
                navigate("/login");
                return;
            }

            if (orderId) {
                await axios.post("http://localhost:8080/ecommerce-management/v1/orders/items/create", 
                    { 
                        quantity, 
                        id_order: orderId, // Passando o ID do pedido corretamente
                        id_product: product.id 
                    },
                    { headers: { Authorization: `${accessToken}` } }  // Envia o token completo com 'Bearer'
                );
                alert(`${product.name} foi adicionado ao carrinho com ${quantity} unidade(s)!`);
            } else {
                alert("Erro: Pedido não encontrado.");
            }
        } catch (error) {
            console.error("Erro ao adicionar item ao pedido:", error);
            alert("Erro ao adicionar item ao pedido.");
        }
    };

    const handleLogout = () => {
        // Limpar o localStorage e redirecionar para a página de login
        localStorage.removeItem('authToken');
        localStorage.removeItem('idUser');
        localStorage.removeItem('orderId'); // Remover o ID do pedido do localStorage
        setIsAuthenticated(false);
        setOrderId(null); // Limpar o estado do orderId
        navigate("/login");
    };

    const productImages = {
        1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvxHYbwHVx9nZs5UQhBVXMBygPuz7jjS_rIw&s",
        2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvxHYbwHVx9nZs5UQhBVXMBygPuz7jjS_rIw&s",
        3: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvxHYbwHVx9nZs5UQhBVXMBygPuz7jjS_rIw&s",
        4:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvxHYbwHVx9nZs5UQhBVXMBygPuz7jjS_rIw&s",
        5:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvxHYbwHVx9nZs5UQhBVXMBygPuz7jjS_rIw&s"
    };

    return (
        <div style={{ fontFamily: "Arial, sans-serif", height: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Barra de navegação */}
            <nav style={{
                background: "#333", color: "#fff", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
                <h1 style={{ margin: 0 }}>Grain & Flavor</h1>
                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    <button
                        onClick={() => navigate("/cart")}  // Usamos o navigate para redirecionar para a página do carrinho
                        style={{
                            background: "#007BFF",
                            color: "#fff",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "16px",
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        Carrinho ({cart.length})
                    </button>
                    <button
                        onClick={() => navigate("/profile")}  // Rota para página de dados do usuário
                        style={{
                            background: "#007BFF", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center"
                        }}
                    >
                        <FaUserCircle style={{ marginRight: "8px", fontSize: "20px" }} /> Meus Dados
                    </button>
                    <button
                        onClick={handleLogout}  // Ação de logout
                        style={{
                            background: "#DC3545", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center"
                        }}
                    >
                        Sair
                    </button>
                </div>
            </nav>

            {/* Conteúdo principal */}
            <div style={{ flex: 1, padding: "20px", overflowY: "auto", backgroundColor: "#f5f5f5" }}>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Produtos</h2>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "20px",
                        maxWidth: "1200px",
                        margin: "0 auto",
                    }}
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            style={{
                                background: "#fff",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                                padding: "15px",
                                textAlign: "center",
                            }}
                        >
                            <img
                                src={productImages[product.id] || "https://via.placeholder.com/300"}
                                alt={product.name}
                                style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px 8px 0 0" }}
                            />
                            <h3 style={{ fontSize: "20px", margin: "10px 0" }}>{product.name}</h3>
                            <p style={{ fontSize: "14px", color: "#555" }}>{product.description}</p>
                            <p style={{ fontSize: "16px", fontWeight: "bold" }}>R${(product.price / 100).toFixed(2)}</p>
                            <p style={{ fontSize: "14px", color: "#777" }}>Estoque: {product.stock_quantity}</p>

                            {/* Quantidade do produto */}
                            <div style={{ margin: "10px 0" }}>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, e.target.value))}
                                    min="1"
                                    style={{
                                        padding: "5px", fontSize: "14px", width: "60px", textAlign: "center",
                                        borderRadius: "5px", border: "1px solid #ccc"
                                    }}
                                />
                            </div>

                            <button
                                onClick={() => addToCart(product)}
                                style={{
                                    background: "#007BFF",
                                    color: "#fff",
                                    border: "none",
                                    padding: "10px 15px",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    marginTop: "10px",
                                }}
                            >
                                Adicionar ao Carrinho
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductsPage;
