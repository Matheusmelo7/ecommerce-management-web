import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";  // Ícone de perfil de usuário

function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();
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
        const token = localStorage.getItem('authToken'); // ou qualquer outro método de autenticação
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const addToCart = (product) => {
        if (!isAuthenticated) {
            // Se não estiver autenticado, redireciona para o login
            alert("Você precisa estar logado para adicionar itens ao carrinho.");
            navigate("/login");
        } else {
            setCart((prevCart) => [...prevCart, product]);
            alert(`${product.name} foi adicionado ao carrinho!`);
        }
    };

    const handleLogout = () => {
        // Limpar o localStorage e redirecionar para a página de login
        localStorage.removeItem('authToken');
        localStorage.removeItem('idUser');
        setIsAuthenticated(false);
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
                    <a href="#cart" style={{
                        color: "#fff", textDecoration: "none", fontSize: "18px", display: "flex", alignItems: "center"
                    }}>
                        Carrinho ({cart.length})
                    </a>
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
