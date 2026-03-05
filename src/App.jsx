// App.jsx (COMPLETO) — carrito editable + checkout (domicilio +$15) + enviar a WhatsApp
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ElectricBorder from "./components/ElectricBorder/ElectricBorder";
import "./App.css";

// Imágenes reales y funcionales para cada bebida
const imagenAzulitos =
  "https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=600";
const imagenMichelada =
  "https://images.pexels.com/photos/3692766/pexels-photo-3692766.jpeg?auto=compress&cs=tinysrgb&w=600";
const imagenMojito =
  "https://images.pexels.com/photos/993650/pexels-photo-993650.jpeg?auto=compress&cs=tinysrgb&w=600";
const imagenPanteraRosa =
  "https://images.pexels.com/photos/963486/pexels-photo-963486.jpeg?auto=compress&cs=tinysrgb&w=600";
const imagenHulk =
  "https://images.pexels.com/photos/1283215/pexels-photo-1283215.jpeg?auto=compress&cs=tinysrgb&w=600";

// Datos de las 5 bebidas
const drinks = [
  {
    id: 1,
    name: "Azulitos",
    price: 75,
    image: imagenAzulitos,
    variations: [
      { id: 11, name: "Azulito clásico", price: 75, image: imagenAzulitos },
      { id: 12, name: "Azulito con vodka", price: 90, image: imagenAzulitos },
    ],
  },
  {
    id: 2,
    name: "Micheladas",
    price: 95,
    image: imagenMichelada,
    variations: [
      { id: 21, name: "Michelada clásica", price: 95, image: imagenMichelada },
      { id: 22, name: "Michelada con chamoy", price: 105, image: imagenMichelada },
    ],
  },
  {
    id: 3,
    name: "Mojitos",
    price: 95,
    image: imagenMojito,
    variations: [
      { id: 31, name: "Mojito de menta", price: 95, image: imagenMojito },
      { id: 32, name: "Mojito de fresa", price: 100, image: imagenMojito },
    ],
  },
  {
    id: 4,
    name: "Panteras rosas",
    price: 110,
    image: imagenPanteraRosa,
    variations: [
      { id: 41, name: "Pantera rosa clásica", price: 110, image: imagenPanteraRosa },
      { id: 42, name: "Pantera rosa con vodka", price: 120, image: imagenPanteraRosa },
    ],
  },
  {
    id: 5,
    name: "Hulk",
    price: 120,
    image: imagenHulk,
    variations: [
      { id: 51, name: "Hulk clásico", price: 120, image: imagenHulk },
      { id: 52, name: "Hulk con tequila", price: 130, image: imagenHulk },
    ],
  },
];

function formatMXN(n) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
}

// Modal Component
function Modal({ open, title, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <motion.div
        className="modal-content"
        onMouseDown={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </motion.div>
    </div>
  );
}

export default function App() {
  // cart: { [variationId]: qty }
  const [cart, setCart] = useState({});
  const [activeModal, setActiveModal] = useState(null); // "variations" | "cart" | "checkout"
  const [activeDrinkId, setActiveDrinkId] = useState(null);

  // Toast pro
  const [toast, setToast] = useState(null); // { title, subtitle, type }

  // cantidades dentro del modal de variaciones (antes de agregar)
  const [quantities, setQuantities] = useState({});

  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // ✅ Checkout info (se guarda)
  const DELIVERY_FEE = 15;
  const WHATSAPP_NUMBER = "5215564882704"; // +52 México, wa.me requiere el 52

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    notes: "",
  });

  const [geo, setGeo] = useState({
    status: "idle", // idle | loading | ok | error
    lat: null,
    lng: null,
    link: "",
    error: "",
  });

  // Cargar datos guardados
  useEffect(() => {
    try {
      const savedCustomer = localStorage.getItem("lacarpita_customer");
      const savedGeo = localStorage.getItem("lacarpita_geo");
      if (savedCustomer) setCustomer(JSON.parse(savedCustomer));
      if (savedGeo) setGeo(JSON.parse(savedGeo));
    } catch {
      // ignore
    }
  }, []);

  // Guardar datos cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem("lacarpita_customer", JSON.stringify(customer));
    } catch {
      // ignore
    }
  }, [customer]);

  useEffect(() => {
    try {
      localStorage.setItem("lacarpita_geo", JSON.stringify(geo));
    } catch {
      // ignore
    }
  }, [geo]);

  const handleAddToCart = (product) => {
    const qty = quantities[product.id] || 1;

    setCart((prev) => ({ ...prev, [product.id]: (prev[product.id] || 0) + qty }));

    setToast({
      type: "success",
      title: "Agregado al carrito",
      subtitle: `${qty} × ${product.name}`,
    });

    setTimeout(() => setToast(null), 2600);
    setQuantities({});
  };

  const handleQuantityChange = (productId, delta) => {
    const currentQty = quantities[productId] || 1;
    const newQty = Math.max(1, currentQty + delta);
    setQuantities({ ...quantities, [productId]: newQty });
  };

  // ✅ Editar cantidades DIRECTO en el carrito
  const incrementCartItem = (productId) => {
    const pid = Number(productId);
    setCart((prev) => ({ ...prev, [pid]: (prev[pid] || 0) + 1 }));
  };

  const decrementCartItem = (productId) => {
    const pid = Number(productId);
    setCart((prev) => {
      const next = { ...prev };
      const current = next[pid] || 0;
      if (current <= 1) delete next[pid];
      else next[pid] = current - 1;
      return next;
    });
  };

  const removeItem = (productId) => {
    const pid = Number(productId);
    setCart((prev) => {
      const next = { ...prev };
      delete next[pid];
      return next;
    });
  };

  const clearCart = () => setCart({});

  const openCart = () => setActiveModal("cart");
  const openVariations = (drinkId) => {
    setActiveDrinkId(drinkId);
    setActiveModal("variations");
  };

  const closeModal = () => {
    setActiveModal(null);
    setActiveDrinkId(null);
  };

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const productId = Number(id);
        let product = null;
        let drinkImage = null;

        for (const drink of drinks) {
          const foundVariation = drink.variations.find((v) => v.id === productId);
          if (foundVariation) {
            product = foundVariation;
            drinkImage = drink.image;
            break;
          }
        }

        if (!product) return null;

        return {
          id: productId,
          qty,
          name: product.name,
          price: product.price,
          image: drinkImage,
          subtotal: product.price * qty,
        };
      })
      .filter(Boolean);
  }, [cart]);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const total = subtotal + (cartCount > 0 ? DELIVERY_FEE : 0);

  const activeDrink = useMemo(() => {
    if (!activeDrinkId) return null;
    return drinks.find((d) => d.id === activeDrinkId) || null;
  }, [activeDrinkId]);

  const startCheckout = () => {
    setActiveModal("checkout");
  };

  const takeLocation = () => {
    if (!("geolocation" in navigator)) {
      setToast({
        type: "error",
        title: "Ubicación no disponible",
        subtitle: "Tu navegador no soporta GPS.",
      });
      setTimeout(() => setToast(null), 2600);
      return;
    }

    setGeo((g) => ({ ...g, status: "loading", error: "" }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const link = `https://maps.google.com/?q=${lat},${lng}`;

        setGeo({
          status: "ok",
          lat,
          lng,
          link,
          error: "",
        });

        setToast({
          type: "success",
          title: "Ubicación guardada",
          subtitle: "Se agregó tu ubicación (GPS).",
        });
        setTimeout(() => setToast(null), 2600);
      },
      (err) => {
        setGeo((g) => ({
          ...g,
          status: "error",
          error: err?.message || "No se pudo obtener ubicación",
        }));

        setToast({
          type: "error",
          title: "No se pudo tomar ubicación",
          subtitle: "Activa GPS y permisos del navegador.",
        });
        setTimeout(() => setToast(null), 2600);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const buildWhatsAppMessage = () => {
    const lines = [];

    lines.push("🟣 *LA CARPITA — NUEVO PEDIDO*");
    lines.push("");
    lines.push("📦 *Entrega:* Envío a domicilio");
    lines.push(`🚚 *Costo envío:* ${formatMXN(DELIVERY_FEE)}`);
    lines.push("");

    lines.push("🧾 *Pedido:*");
    cartItems.forEach((it) => {
      lines.push(`• ${it.qty} × ${it.name} — ${formatMXN(it.price)} c/u = ${formatMXN(it.subtotal)}`);
    });
    lines.push("");
    lines.push(`💵 *Subtotal:* ${formatMXN(subtotal)}`);
    lines.push(`🚚 *Envío:* ${formatMXN(DELIVERY_FEE)}`);
    lines.push(`✅ *Total:* ${formatMXN(total)}`);
    lines.push("");
    lines.push("👤 *Datos del cliente:*");
    lines.push(`• Nombre: ${customer.name || "-"}`);
    lines.push(`• Tel: ${customer.phone || "-"}`);
    lines.push(`• Referencias/Notas: ${customer.notes || "-"}`);
    lines.push("");

    if (geo?.status === "ok" && geo.link) {
      lines.push("📍 *Ubicación (GPS):*");
      lines.push(geo.link);
    } else {
      lines.push("📍 *Ubicación (GPS):* No enviada");
    }

    return lines.join("\n");
  };

  const sendToWhatsApp = () => {
    if (cartCount === 0) return;

    if (!customer.name.trim() || !customer.phone.trim()) {
      setToast({
        type: "error",
        title: "Faltan datos",
        subtitle: "Escribe Nombre y Teléfono para enviar.",
      });
      setTimeout(() => setToast(null), 2600);
      return;
    }

    const digits = customer.phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setToast({
        type: "error",
        title: "Teléfono inválido",
        subtitle: "Pon al menos 10 dígitos.",
      });
      setTimeout(() => setToast(null), 2600);
      return;
    }

    const msg = buildWhatsAppMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

    window.open(url, "_blank", "noopener,noreferrer");

    setOrderConfirmed(true);
    setTimeout(() => {
      setOrderConfirmed(false);
      setCart({});
      closeModal();
    }, 1800);
  };

  return (
    <div className="app-container">
      <header className="header">
        <ElectricBorder
          color="#ba68c8"
          speed={1.2}
          chaos={0.15}
          borderRadius={25}
          style={{
            width: "260px",
            height: "70px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="brand">
            <span className="brand-line">LA CARPITA</span>
            <span className="brand-sub">CANTINA · BAR</span>
          </div>
        </ElectricBorder>
      </header>

      <section className="menu-section">
        <div className="drinks-grid">
          {drinks.map((drink, index) => (
            <motion.div
              key={drink.id}
              className="drink-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ y: -3 }}
            >
              <div className="drink-title">{drink.name}</div>

              <div className="drink-image-container">
                <img
                  src={drink.image}
                  alt={drink.name}
                  className="drink-image"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/150/000000/FFFFFF?text=Imagen+no+disponible";
                  }}
                />
              </div>

              <div className="drink-price">{formatMXN(drink.price)}</div>

              <button className="add-button" onClick={() => openVariations(drink.id)}>
                Ver sabores
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <button className="cart-fab" onClick={() => setActiveModal("cart")}>
        <span className="cart-icon">🛒</span>
        {Object.values(cart).reduce((a, b) => a + b, 0) > 0 && (
          <span className="cart-badge">{Object.values(cart).reduce((a, b) => a + b, 0)}</span>
        )}
        <span className="cart-text">Confirmar pedido</span>
      </button>

      {/* ✅ Toast pro */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`toast toast--${toast.type}`}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            role="status"
            aria-live="polite"
          >
            <div className="toast__icon" aria-hidden="true">
              ✓
            </div>

            <div className="toast__content">
              <div className="toast__title">{toast.title}</div>
              <div className="toast__subtitle">{toast.subtitle}</div>
            </div>

            <button className="toast__close" onClick={() => setToast(null)} aria-label="Cerrar">
              ✕
            </button>

            <div className="toast__bar" />
          </motion.div>
        )}
      </AnimatePresence>

      {orderConfirmed && (
        <motion.div
          className="order-confirmation-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          Enviando a WhatsApp… ✅
        </motion.div>
      )}

      <AnimatePresence>
        {/* MODAL VARIACIONES */}
        {activeModal === "variations" && activeDrink && (
          <Modal open={true} title={activeDrink.name} onClose={closeModal}>
            <div className="variations-container">
              {activeDrink.variations.map((variation) => (
                <div key={variation.id} className="variation-card">
                  <div className="variation-info-container">
                    <img src={variation.image} alt={variation.name} className="variation-image" />
                    <div className="variation-info">
                      <h4>{variation.name}</h4>
                      <p>{formatMXN(variation.price)}</p>
                    </div>
                  </div>

                  <div className="quantity-controls">
                    <button
                      className="quantity-button"
                      onClick={() => handleQuantityChange(variation.id, -1)}
                    >
                      −
                    </button>

                    <span className="quantity-value">{quantities[variation.id] || 1}</span>

                    <button
                      className="quantity-button"
                      onClick={() => handleQuantityChange(variation.id, 1)}
                    >
                      +
                    </button>

                    <button
                      className="select-button"
                      onClick={() => {
                        handleAddToCart(variation);
                        closeModal();
                      }}
                    >
                      Seleccionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Modal>
        )}

        {/* MODAL CARRITO */}
        {activeModal === "cart" && (
          <Modal open={true} title="Confirmar pedido" onClose={closeModal}>
            {Object.values(cart).reduce((a, b) => a + b, 0) === 0 ? (
              <div className="empty-cart">
                <p className="empty-icon">🛒</p>
                <p>No hay productos en el carrito.</p>
              </div>
            ) : (
              (() => {
                const cartItems = Object.entries(cart)
                  .map(([id, qty]) => {
                    const productId = Number(id);
                    let product = null;
                    let drinkImage = null;

                    for (const drink of drinks) {
                      const foundVariation = drink.variations.find((v) => v.id === productId);
                      if (foundVariation) {
                        product = foundVariation;
                        drinkImage = drink.image;
                        break;
                      }
                    }

                    if (!product) return null;

                    return {
                      id: productId,
                      qty,
                      name: product.name,
                      price: product.price,
                      image: drinkImage,
                      subtotal: product.price * qty,
                    };
                  })
                  .filter(Boolean);

                const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
                const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
                const total = subtotal + (cartCount > 0 ? DELIVERY_FEE : 0);

                return (
                  <>
                    <div className="cart-items">
                      {cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                          <div className="item-image">
                            <img
                              src={item.image}
                              alt={item.name}
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/35/000000/FFFFFF?text=No+img";
                              }}
                            />
                          </div>

                          <div className="item-details">
                            <h4>{item.name}</h4>
                            <p className="item-unit-price">{formatMXN(item.price)} c/u</p>

                            <div className="cart-qty">
                              <button
                                className="cart-qty-btn"
                                onClick={() =>
                                  setCart((prev) => {
                                    const pid = Number(item.id);
                                    const next = { ...prev };
                                    const current = next[pid] || 0;
                                    if (current <= 1) delete next[pid];
                                    else next[pid] = current - 1;
                                    return next;
                                  })
                                }
                                aria-label="Disminuir"
                              >
                                −
                              </button>

                              <span className="cart-qty-value">{item.qty}</span>

                              <button
                                className="cart-qty-btn"
                                onClick={() =>
                                  setCart((prev) => {
                                    const pid = Number(item.id);
                                    return { ...prev, [pid]: (prev[pid] || 0) + 1 };
                                  })
                                }
                                aria-label="Aumentar"
                              >
                                +
                              </button>

                              <button
                                className="cart-remove"
                                onClick={() =>
                                  setCart((prev) => {
                                    const next = { ...prev };
                                    delete next[Number(item.id)];
                                    return next;
                                  })
                                }
                                aria-label="Quitar producto"
                                title="Quitar"
                              >
                                Quitar
                              </button>
                            </div>
                          </div>

                          <div className="item-actions">
                            <p className="item-subtotal">{formatMXN(item.subtotal)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="cart-summary">
                      <div className="total-row">
                        <span>Subtotal:</span>
                        <span className="total-amount">{formatMXN(subtotal)}</span>
                      </div>
                      <div className="total-row" style={{ marginTop: 6, opacity: 0.9, fontSize: 13 }}>
                        <span>Envío:</span>
                        <span className="total-amount">{formatMXN(DELIVERY_FEE)}</span>
                      </div>
                      <div className="total-row" style={{ marginTop: 8 }}>
                        <span>Total:</span>
                        <span className="total-amount">{formatMXN(total)}</span>
                      </div>
                    </div>

                    <div className="cart-actions">
                      <button className="checkout-button" onClick={startCheckout}>
                        Realizar pedido
                      </button>
                      <button className="clear-button" onClick={() => setCart({})}>
                        Vaciar carrito
                      </button>
                    </div>
                  </>
                );
              })()
            )}
          </Modal>
        )}

        {/* MODAL CHECKOUT */}
        {activeModal === "checkout" && (
          <Modal open={true} title="Confirmacion de entrega" onClose={closeModal}>
            {Object.values(cart).reduce((a, b) => a + b, 0) === 0 ? (
              <div className="empty-cart">
                <p className="empty-icon">🛒</p>
                <p>No hay productos en el carrito.</p>
              </div>
            ) : (
              <div className="checkout-wrap">
                {/* Entrega */}
                <div className="checkout-card">
                  <div className="checkout-title">Método de entrega</div>

                  <div className="delivery-pill">
                    <div className="delivery-left">
                      <span className="dot" />
                      <div className="delivery-name">Envío a domicilio</div>
                    </div>
                    <div className="delivery-price">+ {formatMXN(DELIVERY_FEE)}</div>
                  </div>

                  <div className="small-help">
                    Toca <b>Tomar dirección</b> para enviar tu ubicación (GPS) por WhatsApp.
                  </div>

                  <div className="geo-row" style={{ marginTop: 10 }}>
                    <button className="geo-button" onClick={takeLocation} type="button">
                      {geo.status === "loading" ? "Tomando ubicación…" : "Tomar dirección 📍"}
                    </button>
                  </div>

                  {(geo.status === "ok" || geo.status === "error") && (
                    <div className="geo-chip">
                      {geo.status === "ok" ? (
                        <>
                          ✅ Ubicación lista:{" "}
                          <span style={{ opacity: 0.9 }}>
                            {geo.lat?.toFixed?.(6)}, {geo.lng?.toFixed?.(6)}
                          </span>
                          <br />
                          {geo.link}
                        </>
                      ) : (
                        <>⚠️ {geo.error || "No se pudo obtener ubicación."}</>
                      )}
                    </div>
                  )}
                </div>

                {/* Datos */}
                <div className="checkout-card">
                  <div className="checkout-title">Tus datos</div>

                  <div className="form-grid">
                    <input
                      className="input"
                      placeholder="Nombre"
                      value={customer.name}
                      onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
                    />
                    <input
                      className="input"
                      placeholder="Teléfono (10 dígitos)"
                      value={customer.phone}
                      onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
                      inputMode="tel"
                    />
                    <textarea
                      className="textarea"
                      placeholder="Referencias / Notas (calle, colonia, color de casa, etc.)"
                      value={customer.notes}
                      onChange={(e) => setCustomer((c) => ({ ...c, notes: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Resumen */}
                <div className="checkout-card">
                  <div className="checkout-title">Resumen</div>

                  <div className="checkout-summary">
                    <div className="line-row">
                      <span>Subtotal</span>
                      <span>{formatMXN(subtotal)}</span>
                    </div>
                    <div className="line-row">
                      <span>Envío</span>
                      <span>{formatMXN(DELIVERY_FEE)}</span>
                    </div>
                    <div className="line-row">
                      <strong>Total</strong>
                      <strong>{formatMXN(total)}</strong>
                    </div>

                    <button className="send-button" onClick={sendToWhatsApp}>
                      Enviar pedido por WhatsApp
                    </button>

                    <div className="small-help" style={{ marginTop: 6 }}>
                      Por favor confirme su entrega por whatsapp, ¡gracias por su orden!
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}