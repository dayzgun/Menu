// App.jsx (COMPLETO) — Validación de Efectivo Vacío + Botón Regresar + Scroll al Inicio
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

const imgSmash = "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600";
const imgBBQ = "https://images.pexels.com/photos/3616956/pexels-photo-3616956.jpeg?auto=compress&cs=tinysrgb&w=600";
const imgCrispy = "https://images.pexels.com/photos/3738730/pexels-photo-3738730.jpeg?auto=compress&cs=tinysrgb&w=600";
const imgAlitas = "https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=600";
const imgBoneless = "https://images.pexels.com/photos/2338013/pexels-photo-2338013.jpeg?auto=compress&cs=tinysrgb&w=600";
const imgPapas = "https://images.pexels.com/photos/115740/pexels-photo-115740.jpeg?auto=compress&cs=tinysrgb&w=600";
const imgAros = "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=600";
const imgDedos = "https://images.pexels.com/photos/3052362/pexels-photo-3052362.jpeg?auto=compress&cs=tinysrgb&w=600";
const imgBebida = "https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=600";
const imgMalteada = "https://images.pexels.com/photos/103566/pexels-photo-103566.jpeg?auto=compress&cs=tinysrgb&w=600";

const categoriesList = ["Todos", "Hamburguesas", "Alitas y Boneless", "Snacks", "Bebidas"];

const menuItems = [
  {
    id: 1,
    name: "Classic Smash Burger",
    description: "Carne de res 100% premium costrada a la plancha, doble queso americano, pepinillos, cebolla morada y aderezo.",
    category: "Hamburguesas",
    image: imgSmash,
    badge: "🔥 Más pedido",
    variations: [
      { id: 11, name: "Sencilla (1 carne)", price: 95 },
      { id: 12, name: "Doble (2 carnes)", price: 135 },
      { id: 13, name: "Triple (3 carnes)", price: 165 },
    ],
    removals: [
      { id: 'r1', name: "Sin pepinillos" },
      { id: 'r2', name: "Sin cebolla morada" },
      { id: 'r3', name: "Sin aderezo de la casa" },
    ],
    extras: [
      { id: 'e1', name: "Tocino Ahumado Extra", price: 20 },
      { id: 'e2', name: "Extra Queso Americano", price: 15 },
    ]
  },
  {
    id: 2,
    name: "Texas BBQ Bacon Burger",
    description: "Carne de res, aros de cebolla empanizados, doble tocino ahumado, queso Monterrey Jack y salsa BBQ artesanal.",
    category: "Hamburguesas",
    image: imgBBQ,
    badge: "⭐ Recomendado",
    variations: [
      { id: 21, name: "Sencilla (1 carne)", price: 125 },
      { id: 22, name: "Doble (2 carnes)", price: 165 },
    ],
    removals: [
      { id: 'r4', name: "Sin aros de cebolla dentro" },
      { id: 'r5', name: "Salsa BBQ aparte" },
      { id: 'r6', name: "Sin tocino" },
    ],
    extras: [
      { id: 'e3', name: "Doble Tocino (4 tiras)", price: 25 },
      { id: 'e4', name: "Bañada en Queso Cheddar", price: 25 },
    ]
  },
  {
    id: 3,
    name: "Crispy Chicken Sandwich",
    description: "Pechuga de pollo crujiente, ensalada de col (coleslaw) fresca, pepinillos y mayonesa picante en pan brioche tostado.",
    category: "Hamburguesas",
    image: imgCrispy,
    variations: [
      { id: 31, name: "Sabor Original", price: 110 },
      { id: 32, name: "Sabor Buffalo Picante", price: 115 },
    ],
    removals: [
      { id: 'r7', name: "Sin ensalada de col" },
      { id: 'r8', name: "Sin pepinillos" },
      { id: 'r9', name: "Sin mayonesa picante" },
    ],
    extras: [
      { id: 'e5', name: "Queso Suizo Derretido", price: 15 },
      { id: 'e6', name: "Tocino", price: 20 },
    ]
  },
  {
    id: 4,
    name: "Alitas Clásicas",
    description: "Alitas fritas al momento, crujientes por fuera y jugosas por dentro. Acompañadas de aderezo Ranch, apio y zanahoria.",
    category: "Alitas y Boneless",
    image: imgAlitas,
    badge: "🔥 Más pedido",
    variations: [
      { id: 41, name: "6 Piezas (1 salsa)", price: 115 },
      { id: 42, name: "10 Piezas (Hasta 2 salsas)", price: 175 },
      { id: 43, name: "20 Piezas (Hasta 3 salsas)", price: 320 },
    ],
    removals: [
      { id: 'r10', name: "Salsa aparte (No bañadas)" },
      { id: 'r11', name: "Sin vegetales (Apio/Zanahoria)" },
    ],
    extras: [
      { id: 'e7', name: "Extra Aderezo Ranch", price: 15 },
      { id: 'e8', name: "Extra Aderezo Blue Cheese", price: 15 },
    ]
  },
  {
    id: 5,
    name: "Boneless de Pechuga",
    description: "Trozos de pechuga de pollo empanizados y bañados en tu salsa favorita. Sin hueso y pura carne.",
    category: "Alitas y Boneless",
    image: imgBoneless,
    variations: [
      { id: 51, name: "Media Orden (250g - 1 salsa)", price: 120 },
      { id: 52, name: "Orden Completa (500g - 2 salsas)", price: 195 },
    ],
    removals: [
      { id: 'r12', name: "Salsa aparte" },
    ],
    extras: [
      { id: 'e9', name: "Bañados en Queso Extra", price: 25 },
      { id: 'e10', name: "Porción extra de Ranch", price: 15 },
    ]
  },
  {
    id: 6,
    name: "Papas a la Francesa",
    description: "Nuestras clásicas papas de corte delgado, fritas al momento y sazonadas con nuestra sal secreta.",
    category: "Snacks",
    image: imgPapas,
    variations: [
      { id: 61, name: "Tamaño Regular", price: 55 },
      { id: 62, name: "Tamaño Grande para compartir", price: 85 },
    ],
    removals: [
      { id: 'r13', name: "Sin sal" },
    ],
    extras: [
      { id: 'e11', name: "Bañadas en Queso Cheddar Líquido", price: 20 },
      { id: 'e12', name: "Trocitos de Tocino", price: 15 },
    ]
  },
  {
    id: 7,
    name: "Aros de Cebolla Crujientes",
    description: "Aros de cebolla dulce empanizados con un toque de cerveza, acompañados de aderezo BBQ o Ranch.",
    category: "Snacks",
    image: imgAros,
    variations: [
      { id: 71, name: "Orden Regular (8 pzs)", price: 75 },
    ],
    removals: [],
    extras: [
      { id: 'e13', name: "Ranch Extra", price: 15 },
      { id: 'e14', name: "BBQ Extra", price: 15 },
    ]
  },
  {
    id: 8,
    name: "Dedos de Queso Mozzarella",
    description: "Bastones de queso mozzarella empanizados, derretidos por dentro. Servidos con salsa marinara italiana.",
    category: "Snacks",
    image: imgDedos,
    badge: "✨ Nuevo",
    variations: [
      { id: 81, name: "Orden (5 Piezas)", price: 85 },
      { id: 82, name: "Orden Grande (8 Piezas)", price: 125 },
    ],
    removals: [
      { id: 'r14', name: "Sin salsa marinara" },
    ],
    extras: [
      { id: 'e15', name: "Salsa Marinara Extra", price: 15 },
    ]
  },
  {
    id: 9,
    name: "Refrescos y Aguas",
    description: "Bebidas bien frías para acompañar tu comida.",
    category: "Bebidas",
    image: imgBebida,
    variations: [
      { id: 91, name: "Coca Cola Regular (Lata)", price: 30 },
      { id: 92, name: "Coca Cola Sin Azúcar (Lata)", price: 30 },
      { id: 93, name: "Sprite (Lata)", price: 30 },
      { id: 94, name: "Agua Natural (Botella 600ml)", price: 25 },
    ],
    removals: [],
    extras: [
      { id: 'e16', name: "Vaso con hielo", price: 5 },
    ]
  },
  {
    id: 10,
    name: "Malteadas Clásicas",
    description: "Cremosas malteadas hechas con helado real, leche entera y decoradas con crema batida.",
    category: "Bebidas",
    image: imgMalteada,
    variations: [
      { id: 101, name: "Vainilla Francesa", price: 75 },
      { id: 102, name: "Chocolate Intenso", price: 75 },
      { id: 103, name: "Fresa Natural", price: 75 },
      { id: 104, name: "Oreo Cookies & Cream", price: 85 },
    ],
    removals: [
      { id: 'r15', name: "Sin crema batida (Chantilly)" },
      { id: 'r16', name: "Sin cereza" },
    ],
    extras: [
      { id: 'e17', name: "Chispas de chocolate", price: 10 },
      { id: 'e18', name: "Extra Oreo", price: 12 },
    ]
  },
];

function formatMXN(n) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
}

function Modal({ open, title, onClose, onBack, children }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <motion.div
      className="modal-overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="modal-header">
          <div className="modal-header-left">
            {onBack && (
              <button
                type="button"
                className="back-button"
                onClick={onBack}
                aria-label="Regresar a Mi Orden"
              >
                ←
              </button>
            )}
            <h2 className="modal-title">{title}</h2>
          </div>
          <button type="button" className="close-button" onClick={onClose}>✕</button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [cart, setCart] = useState([]); 
  const [activeModal, setActiveModal] = useState(null); 
  const [activeItem, setActiveItem] = useState(null);
  const [toast, setToast] = useState(null); 

  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedRemovals, setSelectedRemovals] = useState({});
  const [selectedExtras, setSelectedExtras] = useState({});
  const [itemNotes, setItemNotes] = useState("");
  const [itemQty, setItemQty] = useState(1);

  const DELIVERY_FEE = 20; 
  const WHATSAPP_NUMBER = "5215564882704"; 

  const [customer, setCustomer] = useState({ name: "", phone: "", street: "", references: "" });
  const [geo, setGeo] = useState({ status: "idle", lat: null, lng: null, link: "", error: "", accuracy: null });
  const [deliveryOption, setDeliveryOption] = useState("domicilio"); 
  const [paymentOption, setPaymentOption] = useState("efectivo"); 
  const [cashAmount, setCashAmount] = useState("");
  const [cashError, setCashError] = useState(false); // ✅ Nuevo estado para detectar si intentó enviar vacío
  const [generalNotes, setGeneralNotes] = useState("");

  // Siempre iniciar desde arriba del todo y en "Todos"
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    setActiveCategory("Todos");
  }, []);

  useEffect(() => {
    if (activeModal !== null) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [activeModal]);

  useEffect(() => {
    try {
      const savedCustomer = localStorage.getItem("food_delivery_customer");
      if (savedCustomer) {
        const parsed = JSON.parse(savedCustomer);
        setCustomer({
          name: parsed.name || "",
          phone: parsed.phone || "",
          street: parsed.street || parsed.address || "", 
          references: parsed.references || ""
        });
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("food_delivery_customer", JSON.stringify(customer)); } catch {}
  }, [customer]);

  const openProductModal = (item) => {
    setActiveItem(item);
    setSelectedVariation(item.variations[0]); 
    setSelectedRemovals({});
    setSelectedExtras({});
    setItemNotes("");
    setItemQty(1);
    setActiveModal("product");
  };

  const currentItemPrice = useMemo(() => {
    if (!selectedVariation) return 0;
    let total = selectedVariation.price;
    if (activeItem?.extras) {
      activeItem.extras.forEach(ext => {
        if (selectedExtras[ext.id]) total += ext.price;
      });
    }
    return total;
  }, [selectedVariation, selectedExtras, activeItem]);

  const handleAddToCart = () => {
    const removalsArr = activeItem.removals?.filter(r => selectedRemovals[r.id]).map(r => r.name) || [];
    const extrasArr = activeItem.extras?.filter(e => selectedExtras[e.id]) || [];

    const cartLineItem = {
      cartItemId: Date.now().toString(), 
      productId: activeItem.id,
      productName: activeItem.name,
      variation: selectedVariation,
      removals: removalsArr,
      extras: extrasArr,
      notes: itemNotes.trim(),
      qty: itemQty,
      unitPrice: currentItemPrice,
      subtotal: currentItemPrice * itemQty
    };

    setCart(prev => [...prev, cartLineItem]);
    
    setToast({ 
      type: "success", 
      title: "✅ Producto agregado",
      subtitle: `${itemQty}x ${activeItem.name}`
    });
    
    setTimeout(() => setToast(null), 2500);
    setActiveModal(null);
  };

  const updateCartItemQty = (cartItemId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty, subtotal: item.unitPrice * newQty };
      }
      return item;
    }));
  };

  const removeCartItem = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const handleGoToCheckout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCashError(false);
    setActiveModal("checkout");
  };

  const displayedItems = activeCategory === "Todos" 
    ? menuItems 
    : menuItems.filter(i => i.category === activeCategory);

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
  const totalPagar = cartSubtotal + (deliveryOption === "domicilio" ? DELIVERY_FEE : 0);

  const takeLocation = () => {
    if (!("geolocation" in navigator)) {
      setToast({ type: "error", title: "Oops!", subtitle: "No pudimos obtener tu GPS." });
      setTimeout(() => setToast(null), 2500);
      return;
    }
    
    setGeo((g) => ({ ...g, status: "loading" }));
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const accuracy = Math.round(pos.coords.accuracy);
        
        if (accuracy > 100) {
          setToast({ 
            type: "error", 
            title: "GPS Inexacto 📍", 
            subtitle: `Margen de error de ${accuracy}m. Asegúrate de escribir bien tus referencias.` 
          });
          setTimeout(() => setToast(null), 4000);
        } else {
          setToast({ type: "success", title: "¡Te encontramos!", subtitle: "Ubicación detectada con buena precisión." });
          setTimeout(() => setToast(null), 2500);
        }

        setGeo({ 
          status: "ok", 
          lat: pos.coords.latitude, 
          lng: pos.coords.longitude, 
          accuracy: accuracy,
          link: `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}` 
        });
      },
      (error) => {
        console.warn("Error de GPS:", error.message);
        setGeo((g) => ({ ...g, status: "error" }));
        setToast({ type: "error", title: "Señal débil", subtitle: "Asegúrate de tener el GPS encendido en tu dispositivo." });
        setTimeout(() => setToast(null), 3500);
      },
      { 
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0 
      }
    );
  };

  const sendToWhatsApp = () => {
    if (cartCount === 0) return;

    if (!customer.name.trim() || customer.phone.length < 10) {
      setToast({ type: "error", title: "Datos incompletos", subtitle: "Ingresa tu nombre y un teléfono de 10 dígitos." });
      setTimeout(() => setToast(null), 2500);
      return;
    }

    if (deliveryOption === "domicilio" && (!customer.street.trim() || !customer.references.trim())) {
      setToast({ type: "error", title: "Dirección incompleta", subtitle: "Ingresa tu calle, número y referencias para el envío." });
      setTimeout(() => setToast(null), 2500);
      return;
    }

    // ✅ VALIDACIÓN CLARA CUANDO EFECTIVO ESTÁ VACÍO O ES MENOR AL TOTAL
    if (paymentOption === "efectivo") {
      const amount = Number(cashAmount);
      if (!cashAmount.toString().trim() || isNaN(amount)) {
        setCashError(true);
        setToast({ 
          type: "error", 
          title: "Falta el monto 💵", 
          subtitle: `Indica con cuánto vas a pagar (Mínimo ${formatMXN(totalPagar)})` 
        });
        setTimeout(() => setToast(null), 2800);
        return;
      }
      if (amount < totalPagar) {
        setCashError(true);
        setToast({ 
          type: "error", 
          title: "Monto insuficiente 💵", 
          subtitle: `Te faltan ${formatMXN(totalPagar - amount)} para cubrir el total` 
        });
        setTimeout(() => setToast(null), 2800);
        return;
      }
    }

    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit', hour12: true };
    const formattedDate = new Date().toLocaleString('es-MX', dateOptions).replace(" a. m.", " a.m.").replace(" p. m.", " p.m.");

    let msg = `🏪 *Pedido La Carpita*\n`;
    msg += `🕒 Fecha y hora del pedido: *${formattedDate}*\n\n`;
    
    cart.forEach((item, index) => {
      msg += `🍔 *${index + 1}- (x${item.qty}) ${item.productName} — ${formatMXN(item.subtotal)}*\n`;
      if (item.variation && item.variation.name) msg += `${item.variation.name}\n`;
      if (item.removals.length > 0) msg += `Sin: ${item.removals.join(", ")}\n`;
      if (item.extras.length > 0) msg += `+ Extra: ${item.extras.map(e => e.name).join(", ")}\n`;
      if (item.notes) msg += `Notas: ${item.notes}\n`;
      msg += `\n`;
    });

    msg += `-----------------------\n`;
    msg += `💰 Subtotal: ${formatMXN(cartSubtotal)}\n`;
    if (deliveryOption === 'domicilio') {
      msg += `🛵 Envío: ${formatMXN(DELIVERY_FEE)}\n`;
    }
    msg += `✅ Total: ${formatMXN(totalPagar)}\n`;
    msg += `-----------------------\n`;

    const nombrePago = paymentOption.charAt(0).toUpperCase() + paymentOption.slice(1);
    msg += `💳 Método de pago: *${nombrePago}*\n`;
    if (paymentOption === 'efectivo') {
      msg += `💵 Pagas con: ${formatMXN(Number(cashAmount))}\n`;
      msg += `🔄 Cambio: ${formatMXN(Number(cashAmount) - totalPagar)}\n`;
    }
    msg += `-----------------------\n`;

    msg += `👤 Nombre: *${customer.name}*\n`;
    msg += `📞 Teléfono: *${customer.phone}*\n`;
    
    if (deliveryOption === 'domicilio') {
      msg += `📍 Ubicación: *${customer.street} - ${customer.references}*\n`;
      if (geo.link) {
        msg += `📌 Mapa GPS: ${geo.link}\n`;
      }
      msg += `🚚 Entrega: *A Domicilio*\n\n`;
      msg += `📍 *IMPORTANTE:* Por favor, compártenos tu ubicación por WhatsApp para llegar exactamente a tu domicilio.\n`;
    } else {
      msg += `📍 Ubicación: *Sucursal La Carpita*\n`;
      msg += `🚚 Entrega: *Pasar por Sucursal*\n`;
    }

    if (generalNotes.trim()) {
      msg += `📝 Notas Extras: *${generalNotes}*\n`;
    } else {
      msg += `📝 Notas Extras: *Ninguna*\n`;
    }
    
    msg += `-----------------------\n`;
    msg += `⏱️ Tiempo de preparacion: *15 min a 30 min dependiendo cantidad de producto y clientes en espera*\n`;
    msg += `⚠️ *Todo alimento se prepara al momento de su orden*\n`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");

    setCart([]);
    setCashAmount("");
    setCashError(false);
    setActiveModal(null);
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="brand">
          <span className="brand-line">GRILL<span>&</span>BITES</span>
        </div>
        <div className="categories-bar">
          {categoriesList.map(cat => (
            <button 
              key={cat} 
              type="button"
              className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <section className="menu-section">
        <div className="drinks-grid">
          {displayedItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="drink-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => openProductModal(item)}
            >
              <div className="drink-image-container">
                {item.badge && <span className="item-badge">{item.badge}</span>}
                <img src={item.image} alt={item.name} className="drink-image" />
              </div>
              <div className="drink-info">
                <div className="drink-title">{item.name}</div>
                <div className="drink-description">{item.description}</div>
                <div className="drink-price">Desde {formatMXN(item.variations[0].price)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <button 
        type="button"
        className={`cart-fab ${cartCount === 0 ? 'empty' : ''}`} 
        onClick={() => setActiveModal("cart")}
      >
        <span className="cart-icon">🛒</span>
        {cartCount > 0 ? (
          <>
            <span className="cart-badge">{cartCount}</span>
            <span className="cart-text">Pedir {formatMXN(totalPagar)}</span>
          </>
        ) : (
          <span className="cart-text">Orden</span>
        )}
      </button>

      <AnimatePresence>
        {toast && (
          <motion.div 
            key="toast-notification"
            className="toast" 
            style={{ backgroundColor: toast.type === 'error' ? '#FF3B30' : '#222' }} 
            initial={{ opacity: 0, y: 100, x: "-50%" }} 
            animate={{ opacity: 1, y: 0, x: "-50%" }} 
            exit={{ opacity: 0, y: 100, x: "-50%" }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
          >
            <div className="toast-title">{toast.title}</div>
            {toast.subtitle && <div className="toast-subtitle">{toast.subtitle}</div>}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* MODAL PRODUCTO */}
        {activeModal === "product" && activeItem && (
          <Modal key="modal-product" open={true} title={activeItem.name} onClose={() => setActiveModal(null)}>
            <div className="modal-body">
              <div className="options-section">
                <div className="section-title"><span>Elige tu tamaño</span> <span className="req">Obligatorio</span></div>
                {activeItem.variations.map(vari => (
                  <label key={vari.id} className="option-row">
                    <div className="option-info">
                      <input type="radio" name="variation" checked={selectedVariation?.id === vari.id} onChange={() => setSelectedVariation(vari)} />
                      <span className="option-name">{vari.name}</span>
                    </div>
                    <span className="option-price">{formatMXN(vari.price)}</span>
                  </label>
                ))}
              </div>

              {activeItem.removals && activeItem.removals.length > 0 && (
                <div className="options-section">
                  <div className="section-title"><span>¿Le quitamos algo?</span></div>
                  {activeItem.removals.map(rem => (
                    <label key={rem.id} className="option-row">
                      <div className="option-info">
                        <input type="checkbox" checked={selectedRemovals[rem.id] || false} onChange={(e) => setSelectedRemovals({...selectedRemovals, [rem.id]: e.target.checked})} />
                        <span className="option-name">{rem.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {activeItem.extras && activeItem.extras.length > 0 && (
                <div className="options-section">
                  <div className="section-title"><span>¡Agrégale un Extra!</span></div>
                  {activeItem.extras.map(ext => (
                    <label key={ext.id} className="option-row">
                      <div className="option-info">
                        <input type="checkbox" checked={selectedExtras[ext.id] || false} onChange={(e) => setSelectedExtras({...selectedExtras, [ext.id]: e.target.checked})} />
                        <span className="option-name">{ext.name}</span>
                      </div>
                      <span className="option-price">+{formatMXN(ext.price)}</span>
                    </label>
                  ))}
                </div>
              )}

              <div className="options-section" style={{marginBottom: 0}}>
                <div className="section-title"><span>Instrucciones especiales</span></div>
                <textarea 
                  className="textarea-notes" 
                  rows="2" 
                  placeholder="Ej. La hamburguesa sin aderezo, las alitas bien doradas..." 
                  value={itemNotes} 
                  onChange={(e) => setItemNotes(e.target.value)} 
                />
              </div>
            </div>

            <div className="add-to-cart-bar">
              <div className="quantity-selector">
                <button className="quantity-btn" type="button" onClick={() => setItemQty(Math.max(1, itemQty - 1))}>−</button>
                <span className="quantity-number">{itemQty}</span>
                <button className="quantity-btn" type="button" onClick={() => setItemQty(itemQty + 1)}>+</button>
              </div>
              <button className="btn-agregar" type="button" onClick={handleAddToCart}>
                <span>Agregar</span>
                <span>{formatMXN(currentItemPrice * itemQty)}</span>
              </button>
            </div>
          </Modal>
        )}

        {/* MODAL CARRITO */}
        {activeModal === "cart" && (
          <Modal key="modal-cart" open={true} title="Mi Orden" onClose={() => setActiveModal(null)}>
            {cartCount === 0 ? (
              <div className="modal-body" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <div className="empty-cart" style={{textAlign: 'center', padding: '40px 0'}}>
                  <div style={{fontSize: '50px', marginBottom: '15px', opacity: 0.5}}>🛒</div>
                  <p style={{color: '#6B7280', fontSize: '16px'}}>Aún no tienes antojos agregados.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="modal-body">
                  <div className="summary-box" style={{marginTop: 10, borderBottom: '2px solid var(--stroke)'}}>
                    <div className="summary-title" style={{color: 'var(--accent)', fontSize: '16px'}}>🧾 Resumen del total:</div>
                    <div className="total-row">
                      <span>Costo de los productos</span>
                      <span>{formatMXN(cartSubtotal)}</span>
                    </div>
                    <div className="total-row">
                      <span>Envío a domicilio</span>
                      <span>{formatMXN(DELIVERY_FEE)}</span>
                    </div>
                    <div className="total-row grand-total">
                      <span>Total a pagar</span>
                      <span>{formatMXN(totalPagar)}</span>
                    </div>
                  </div>

                  <div className="cart-items" style={{marginTop: 10}}>
                    <div className="summary-title" style={{fontSize: '14px', marginBottom: '10px', color: 'var(--text-secondary)'}}>Detalle de tu orden:</div>
                    {cart.map(item => (
                      <div key={item.cartItemId} className="cart-item">
                        <div className="cart-item-header">
                          <span className="cart-item-name">{item.qty}x {item.productName} ({item.variation.name})</span>
                          <span className="cart-item-price">{formatMXN(item.subtotal)}</span>
                        </div>
                        
                        {(item.removals.length > 0 || item.extras.length > 0 || item.notes) && (
                          <div className="cart-item-modifiers">
                            {item.removals.map(r => <div key={r}>Sin {r.replace('Sin ', '')}</div>)}
                            {item.extras.map(e => <div key={e.id}>+ {e.name}</div>)}
                            {item.notes && <div className="cart-item-note">"{item.notes}"</div>}
                          </div>
                        )}

                        <div className="cart-item-bottom">
                          <div className="cart-stepper">
                            <button className="stepper-btn" type="button" onClick={() => updateCartItemQty(item.cartItemId, -1)}>−</button>
                            <span className="stepper-val">{item.qty}</span>
                            <button className="stepper-btn" type="button" onClick={() => updateCartItemQty(item.cartItemId, 1)}>+</button>
                          </div>
                          <button className="cart-remove-btn" type="button" onClick={() => removeCartItem(item.cartItemId)}>Quitar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="checkout-footer">
                  <button
                    className="checkout-button"
                    type="button"
                    onClick={handleGoToCheckout}
                    onTouchEnd={handleGoToCheckout}
                  >
                    Terminar pedido
                  </button>
                </div>
              </>
            )}
          </Modal>
        )}

        {/* MODAL DATOS DE ENTREGA Y PAGO */}
        {activeModal === "checkout" && (
          <Modal
            key="modal-checkout"
            open={true}
            title="Entrega y Pago"
            onBack={() => setActiveModal("cart")}
            onClose={() => setActiveModal(null)}
          >
            <div className="modal-body" style={{paddingTop: 10}}>
              
              {/* TUS DATOS */}
              <div className="checkout-box premium-card">
                <h3 className="box-title">👤 Tus Datos</h3>
                <div className="input-group">
                  <label className="input-label">Nombre completo</label>
                  <input className="input-clean" placeholder="Ej. Juan Pérez" value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})} />
                </div>
                <div className="input-group">
                  <label className="input-label">Número de teléfono</label>
                  <input className="input-clean" placeholder="10 dígitos" type="tel" maxLength="10" value={customer.phone} onChange={(e) => setCustomer({...customer, phone: e.target.value.replace(/\D/g,'')})} />
                </div>
              </div>

              {/* MÉTODOS DE ENTREGA */}
              <div className="checkout-box premium-card">
                <h3 className="box-title">🚚 Método de Entrega</h3>
                
                <div className="segmented-control">
                  <button 
                    type="button"
                    className={`segment-btn ${deliveryOption === 'domicilio' ? 'active' : ''}`} 
                    onClick={() => setDeliveryOption('domicilio')}
                  >
                    Envío (+${DELIVERY_FEE})
                  </button>
                  <button 
                    type="button"
                    className={`segment-btn ${deliveryOption === 'sucursal' ? 'active' : ''}`} 
                    onClick={() => setDeliveryOption('sucursal')}
                  >
                    Pasar a recoger
                  </button>
                </div>

                <AnimatePresence>
                  {deliveryOption === 'domicilio' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{overflow: 'hidden'}}>
                      
                      <div className="input-row" style={{marginTop: 15}}>
                        <div className="input-group half">
                          <label className="input-label">Calle y número</label>
                          <input className="input-clean" placeholder="Ej. Juárez 123" value={customer.street} onChange={(e) => setCustomer({...customer, street: e.target.value})} />
                        </div>
                        <div className="input-group half">
                          <label className="input-label">Colonia / Referencias</label>
                          <input className="input-clean" placeholder="Ej. Centro, casa azul" value={customer.references} onChange={(e) => setCustomer({...customer, references: e.target.value})} />
                        </div>
                      </div>
                      
                      <button className="geo-btn-modern primary-soft" type="button" onClick={takeLocation}>
                        <span className="icon">📍</span> Usar mi ubicación actual GPS
                      </button>
                      
                      {geo.status === "ok" && geo.accuracy <= 100 && <p className="success-inline">✅ Ubicación detectada correctamente</p>}
                      {geo.status === "ok" && geo.accuracy > 100 && <p className="success-inline" style={{color: '#FF9500'}}>⚠️ Revisa el mapa, tu señal GPS es débil</p>}
                      
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* MÉTODOS DE PAGO */}
              <div className="checkout-box premium-card">
                <h3 className="box-title">💳 Método de Pago</h3>
                
                <div className="payment-grid">
                  <div className={`payment-card ${paymentOption === 'efectivo' ? 'active' : ''}`} onClick={() => setPaymentOption('efectivo')}>
                    <span className="payment-icon">💵</span>
                    <span className="payment-name">Efectivo</span>
                  </div>
                  <div className={`payment-card ${paymentOption === 'tarjeta' ? 'active' : ''}`} onClick={() => { setPaymentOption('tarjeta'); setCashError(false); }}>
                    <span className="payment-icon">💳</span>
                    <span className="payment-name">Tarjeta</span>
                  </div>
                  <div className={`payment-card ${paymentOption === 'transferencia' ? 'active' : ''}`} onClick={() => { setPaymentOption('transferencia'); setCashError(false); }}>
                    <span className="payment-icon">📱</span>
                    <span className="payment-name">Transf.</span>
                  </div>
                </div>

                <AnimatePresence>
                  {paymentOption === 'efectivo' && (
                    <motion.div className="cash-input-modern" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <div className="cash-wrapper">
                        <label className="input-label" style={{marginBottom: 8, paddingLeft: 0}}>¿Con cuánto vas a pagar?</label>
                        <div 
                          className={`cash-field ${
                            (cashError && cashAmount === "") || (cashAmount !== "" && Number(cashAmount) < totalPagar) 
                              ? "error-border" 
                              : cashAmount !== "" && Number(cashAmount) >= totalPagar 
                              ? "success-border" 
                              : ""
                          }`}
                        >
                          <span>$</span>
                          <input 
                            type="number" 
                            inputMode="decimal" 
                            placeholder={`Mínimo $${totalPagar}`} 
                            value={cashAmount} 
                            onChange={(e) => {
                              setCashAmount(e.target.value);
                              if (e.target.value !== "") setCashError(false);
                            }} 
                          />
                        </div>

                        {/* ✅ MENSAJE DE ESTADO DE EFECTIVO (VACÍO, INSUFICIENTE O CAMBIO) */}
                        {cashAmount === "" && cashError && (
                          <div className="cash-message">
                            <span className="error">⚠️ Ingresa con cuánto vas a pagar (Mínimo {formatMXN(totalPagar)})</span>
                          </div>
                        )}

                        {cashAmount !== "" && (
                          <div className="cash-message">
                            {Number(cashAmount) < totalPagar ? (
                              <span className="error">⚠️ Faltan {formatMXN(totalPagar - Number(cashAmount))} para cubrir el total</span>
                            ) : (
                              <span className="success">✅ Cambio a entregar: {formatMXN(Number(cashAmount) - totalPagar)}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* NOTAS DEL PEDIDO */}
              <div className="checkout-box premium-card">
                <h3 className="box-title">💬 Notas del Pedido (Opcional)</h3>
                <div className="input-group" style={{marginBottom: 0}}>
                   <label className="input-label">Instrucciones extra</label>
                   <textarea className="input-clean" placeholder="¿Alguna especificación para la cocina o el repartidor?" rows="2" value={generalNotes} onChange={(e) => setGeneralNotes(e.target.value)} />
                </div>
              </div>

              {/* RESUMEN FINAL INLINE */}
              <div className="final-receipt">
                <div className="receipt-row">
                  <span>Subtotal</span>
                  <span>{formatMXN(cartSubtotal)}</span>
                </div>
                {deliveryOption === "domicilio" && (
                  <div className="receipt-row">
                    <span>Envío</span>
                    <span>+{formatMXN(DELIVERY_FEE)}</span>
                  </div>
                )}
                <div className="receipt-row total">
                  <span>Total a Pagar</span>
                  <span>{formatMXN(totalPagar)}</span>
                </div>
              </div>

            </div>

            <div className="checkout-footer">
              <button className="wa-btn-premium" type="button" onClick={sendToWhatsApp}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                Enviar por WhatsApp
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}