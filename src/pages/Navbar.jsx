// Navbar.jsx
import React from 'react';

function Navbar({ cartLength }) {
    return (
        <nav style={{ background: "#333", color: "#fff", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ margin: 0 }}>Grain & Flavor</h1>
            <a href="#cart" style={{ color: "#fff", textDecoration: "none", fontSize: "18px" }}>
                Carrinho ({cartLength})
            </a>
        </nav>
    );
}

export default Navbar;
