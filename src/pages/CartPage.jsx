import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // Ícone para voltar para a ProductsPage
import QRCodeStyling from "qr-code-styling"; // Biblioteca para gerar QR Code fake

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState({
    street: "",
    neighborhood: "",
    city: "",
    state: "",
    number: "",
    complement: "",
  });
  const [showForm, setShowForm] = useState(false); // Para exibir o formulário de endereço
  const [showPix, setShowPix] = useState(false); // Para mostrar a página de PIX
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null); // Para armazenar o QR code gerado
  const [showCart, setShowCart] = useState(true); // Para controlar a exibição da grid de carrinho
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(null); // Armazena o id do pedido, agora no estado

  useEffect(() => {
    const fetchCartItems = async () => {
      const customerId = localStorage.getItem("idUser"); // Obtemos o id do cliente do localStorage
      const accessToken = localStorage.getItem("authToken"); // Obtemos o token de autenticação
      const orderIdFromStorage = localStorage.getItem("orderId"); // Obtemos o ID do pedido, se existir

      if (!customerId || !accessToken) {
        alert("Você precisa estar logado para ver os itens do carrinho.");
        navigate("/login");
        return;
      }

      try {
        if (!orderIdFromStorage) {
          // Se não houver pedido existente, criamos um novo
          const response = await axios.post(
            "http://localhost:8080/ecommerce-management/v1/orders/create",
            { id_costumer: customerId },
            { headers: { Authorization: `${accessToken}` } }
          );
          const newOrderId = response.data.id_order;
          localStorage.setItem("orderId", newOrderId); // Armazenamos o ID do novo pedido
          setOrderId(newOrderId); // Definimos o estado do orderId
        } else {
          setOrderId(orderIdFromStorage); // Recupera o ID do pedido do localStorage
        }

        const response = await axios.get(
          `http://localhost:8080/ecommerce-management/v1/orders/order/${orderIdFromStorage}`,
          { headers: { Authorization: `${accessToken}` } }
        );
        setCartItems(response.data[0].order_items_entity); // Acessamos os itens do pedido
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar os itens do carrinho", error);
        setError("Erro ao carregar os itens do carrinho.");
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [navigate]);

  const handleCepChange = async (event) => {
    const newCep = event.target.value;
    setCep(newCep);

    if (newCep.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${newCep}/json/`);
        const { logradouro, bairro, localidade, uf } = response.data;
        setAddress({
          ...address,
          street: logradouro,
          neighborhood: bairro,
          city: localidade,
          state: uf,
        });
      } catch (error) {
        alert("Erro ao consultar o CEP.");
      }
    }
  };

  const handleFinalizeOrder = async () => {
    const customerId = localStorage.getItem("idUser");
    const accessToken = localStorage.getItem("authToken");
    const { number, complement } = address;

    const fullAddress = `${address.street}, ${number} - ${complement}, ${address.neighborhood}, ${address.city} - ${address.state}`;

    try {
      const response = await axios.post(
        `http://localhost:8080/ecommerce-management/v1/orders/${orderId}/finalize`, // Use o ID do pedido real
        {
          id_order: orderId,
          delivery_address: fullAddress,
        },
        { headers: { Authorization: `${accessToken}` } }
      );

      setShowPix(true); // Exibe a página de PIX com o QR Code
      setShowForm(false); // Esconde o formulário de endereço
      setShowCart(false); // Esconde a grid de carrinho
      generateQRCode(); // Gerar o QR Code após finalizar o pedido
    } catch (error) {
      alert("Erro ao finalizar o pedido.");
    }
  };

  const generateQRCode = () => {
    const qrCode = new QRCodeStyling({
      width: 200,
      height: 200,
      data: "https://www.example.com/pix-payment", // URL do pagamento fake
      dotsOptions: {
        color: "#000000",
        type: "rounded",
      },
      backgroundOptions: {
        color: "#ffffff",
      },
    });

    // Gerar a URL do QR code em base64
    qrCode.getDataUrl().then((url) => {
      setQrCodeDataUrl(url); // Armazenar a URL gerada
    });
  };

  const handlePixConfirmed = async () => {
    // Verificar se há um orderId no estado antes de atualizar
    if (!orderId) {
      alert("Pedido não encontrado.");
      return;
    }

    try {
      // Atualizar o status do pedido para pago
      await axios.put(
        `http://localhost:8080/ecommerce-management/v1/orders/${orderId}/complete-payment`,
        { id_order: orderId },
        { headers: { Authorization: `${localStorage.getItem("authToken")}` } }
      );

      alert("Pagamento confirmado! Redirecionando para a página de produtos...");
      localStorage.removeItem("orderId"); // Remover o ID do pedido do localStorage após a confirmação do pagamento
      navigate("/"); // Redireciona para a página de produtos
    } catch (error) {
      alert("Erro ao confirmar o pagamento.");
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Barra de navegação */}
      <nav
        style={{
          background: "#333",
          color: "#fff",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={() => navigate("/")} // Usamos o navigate para voltar para a página de produtos
            style={{
              background: "#007BFF",
              color: "#fff",
              border: "none",
              padding: "8px 15px", // Tamanho menor
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "5px", // Distância entre o ícone e o texto
            }}
          >
            <FaArrowLeft style={{ fontSize: "18px" }} /> {/* Ícone menor */}
            Voltar para Produtos
          </button>
        </div>
        <h1 style={{ margin: 0 }}>Grain & Flavor</h1>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <button
            onClick={() => navigate("/cart")} // Usamos o navigate para redirecionar para a página do carrinho
            style={{
              background: "#007BFF",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
            }}
          >
            Carrinho ({cartItems.length})
          </button>
        </div>
      </nav>

      {/* Conteúdo principal */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
          backgroundColor: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Carrinho de Compras</h2>
        {cartItems.length === 0 ? (
          <p>Seu carrinho está vazio.</p>
        ) : (
          <div style={{ overflowX: "auto", display: showCart ? "block" : "none" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                tableLayout: "fixed",
                marginBottom: "20px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    Produto
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    Descrição
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    Quantidade
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    Preço
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.idOrderCostumer}>
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                      }}
                    >
                      {item.productsEntity.name}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                      }}
                    >
                      {item.productsEntity.description}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      {item.quantity}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      R${(item.price / 100).toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      R${(item.total / 100).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => setShowForm(true)} // Mostra o formulário
                style={{
                  background: "#28a745",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        )}

        {/* Exibe o formulário de endereço quando o usuário clica em "Finalizar Compra" */}
        {showForm && (
          <div>
            <h3>Preencha o endereço:</h3>
            <label>CEP:</label>
            <input
              type="text"
              value={cep}
              onChange={handleCepChange}
              maxLength="8"
              placeholder="Digite o CEP"
              style={{ width: "200px", padding: "10px", marginBottom: "10px" }}
            />
            <div>
              <label>Rua:</label>
              <input
                type="text"
                value={address.street}
                readOnly
                style={{
                  width: "300px",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              />
            </div>
            <div>
              <label>Bairro:</label>
              <input
                type="text"
                value={address.neighborhood}
                readOnly
                style={{
                  width: "300px",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              />
            </div>
            <div>
              <label>Cidade:</label>
              <input
                type="text"
                value={address.city}
                readOnly
                style={{
                  width: "300px",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              />
            </div>
            <div>
              <label>Estado:</label>
              <input
                type="text"
                value={address.state}
                readOnly
                style={{
                  width: "300px",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              />
            </div>
            <div>
              <label>Número:</label>
              <input
                type="text"
                value={address.number}
                onChange={(e) =>
                  setAddress({ ...address, number: e.target.value })
                }
                placeholder="Número"
                style={{
                  width: "100px",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              />
            </div>
            <div>
              <label>Complemento:</label>
              <input
                type="text"
                value={address.complement}
                onChange={(e) =>
                  setAddress({ ...address, complement: e.target.value })
                }
                placeholder="Complemento"
                style={{
                  width: "300px",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              />
            </div>
            <button
              onClick={handleFinalizeOrder}
              style={{
                background: "#28a745",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Finalizar Pedido
            </button>
          </div>
        )}

        {/* Página de PIX */}
        {showPix && (
          <div style={{ textAlign: "center" }}>
            <h2>Pagamento via PIX</h2>
            <p>Escaneie o QR Code para realizar o pagamento.</p>
            <div>
              {/* Exibindo o QR Code */}
              <img
                src={qrCodeDataUrl}
                alt="QR Code"
                style={{ width: "200px", height: "200px", margin: "20px auto" }}
              />
            </div>
            <button
              onClick={handlePixConfirmed}
              style={{
                background: "#28a745",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              PIX Confirmado
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
