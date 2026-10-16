"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

const A = "/assets";

type Product = {
  name: string;
  image: string;
  price: string;
  transfer: string;
  installments: string;
  rating?: string;
  description?: string;
};

function productSlug(name: string) {
  return name.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const payments = ["47b95.png", "33e54.png", "237db.png", "7efac.png", "846fc.png", "1f0f0.png", "5ac1f.png", "cb14e.png", "3b594.png", "0125d.png", "eb7c8.png", "bdf1e.png", "73113.png", "68a6b.png", "b71a6.png", "eb258.png", "5d8fa.png", "e02b0.png", "ab95a.png"];

function ProductDetail({ product, onBuy, onBack }: { product: Product; onBuy: (product: Product) => void; onBack: () => void }) {
  return (
    <main className="product-detail-page">
      <div className="content">
        <button className="back-link" onClick={onBack}>← Volver a la tienda</button>
        <div className="product-detail-grid">
          <section className="product-gallery" aria-label={`Galería de ${product.name}`}>
            <span className="detail-shipping">Envío gratis</span>
            <img src={`${A}/${product.image}`} alt={product.name} />
            <div className="gallery-thumbs"><button className="gallery-thumb active"><img src={`${A}/${product.image}`} alt="Vista principal" /></button><button className="gallery-thumb"><img src={`${A}/${product.image}`} alt="Vista alternativa" /></button></div>
          </section>
          <section className="product-purchase-panel">
            <p className="breadcrumbs">Inicio &nbsp;›&nbsp; Productos &nbsp;›&nbsp; {product.name}</p>
            <span className="detail-kicker">Producto seleccionado</span>
            <h1>{product.name}</h1>
            <p className="sku">SKU: EFM-{productSlug(product.name).slice(0, 8).toUpperCase()}</p>
            <div className="detail-price"><strong>{product.price}</strong><del>$ {product.price.replace("$", "")}</del></div>
            <p className="payment-title">Elegí cómo pagar</p>
            <div className="payment-options"><div><strong>Transferencia</strong><b>{product.transfer}</b><small>15% de descuento</small></div><div><strong>6 cuotas sin interés</strong><b>{product.installments}</b><small>Tarjetas de crédito y débito</small></div></div>
            <div className="detail-shipping-line"><span>✓</span><div><strong>Envío gratis</strong><small>Recibilo en todo el país</small></div></div>
            <div className="detail-actions"><div className="detail-quantity"><button aria-label="Reducir cantidad">−</button><span>1</span><button aria-label="Aumentar cantidad">+</button></div><button className="detail-buy" onClick={() => onBuy(product)}>AGREGAR AL CARRITO <span>→</span></button></div>
            <ul className="trust-list"><li>Compra segura y protegida</li><li>Cambios y devoluciones simples</li><li>Atención personalizada de {storeName}</li></ul>
          </section>
        </div>
        <section className="detail-description"><div className="description-heading"><h2>Descripción</h2><div className="social-mini">f &nbsp; X &nbsp; p</div></div><div className="description-highlight"><p><strong>Todo lo que necesitás para equipar tu moto.</strong> Producto seleccionado por nuestro equipo para ofrecerte calidad, compatibilidad y una compra simple.</p><p>{product.description || `Conocé todos los detalles de ${product.name}. Ideal para renovar tu moto con piezas confiables y excelente terminación.`}</p></div></section>
        <section className="reviews"><div><h2>¿Qué dicen otros moteros sobre este producto?</h2><p className="stars">★★★★★ <span>0 reseñas</span></p></div><button>Escribir reseña</button><div className="empty-reviews"><span>☆</span><strong>Todavía no hay reseñas</strong><p>Sé el primero en compartir tu experiencia con este producto.</p></div></section>
      </div>
    </main>
  );
}

function ProductCard({ product, onBuy, onOpen }: { product: Product; onBuy: (product: Product) => void; onOpen: (product: Product) => void }) {
  return (
    <article className="product-card">
      <div className="product-image">
        <button className="product-image-link" onClick={() => onOpen(product)} aria-label={`Ver ${product.name}`}><img src={`${A}/${product.image}`} alt={product.name} /></button>
        <span className="shipping"><img src={`${A}/64d19.svg`} alt="" /> Envío gratis</span>
        <span className="installment-badge">HASTA 6 CUOTAS SIN INTERÉS</span>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        {product.rating && <div className="rating">★★★★★ <span>{product.rating}</span></div>}
        <strong className="price">{product.price}</strong>
        <span className="transfer">{product.transfer} con transferencia</span>
        <span className="installments">{product.installments} sin interés</span>
        <button onClick={() => onBuy(product)}>Comprar <img src={`${A}/${product.rating ? "99616.svg" : "0a355.svg"}`} alt="" /></button>
      </div>
    </article>
  );
}

function ProductSection({ title, products, dark = false, onBuy, onOpen }: { title: string; products: Product[]; dark?: boolean; onBuy: (product: Product) => void; onOpen: (product: Product) => void }) {
  return (
    <section className={dark ? "products-section products-dark" : "products-section"}>
      <div className="content">
        <div className="section-heading">
          <h2>{title}</h2>
          <div className="section-arrows"><img src={`${A}/287b1.svg`} alt="" /><span>Deslizá para ver más</span><img src={`${A}/29b3a.svg`} alt="" /></div>
        </div>
        <div className="product-row">
          {products.map((product) => <ProductCard key={product.name} product={product} onBuy={onBuy} onOpen={onOpen} />)}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [email, setEmail] = useState("");
  const [filters, setFilters] = useState(["", "", "", ""]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const publicStore = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("store") : null;
  const catalogUrl = publicStore ? `/api/catalog?store=${encodeURIComponent(publicStore)}` : "/api/catalog";
  const { data: store } = useSWR<{ name: string; email: string; phone: string; storeName?: string; storeEmail?: string; storePhone?: string; design?: { brandColor?: string; headingFont?: string; bodyFont?: string; borderStyle?: string; headerMessage?: string; headerLink?: string; logoPath?: string; heroTitle?: string; headerTitle?: string; productsTitle?: string; footerText?: string; sectionOrder?: string[] } }>(publicStore ? `/api/public-store?store=${encodeURIComponent(publicStore)}` : "/api/public-store", (url) => fetch(url).then((response) => response.ok ? response.json() : null));
  const design = store?.design ?? {};
  const storeName = store?.storeName || store?.name || "Mi tienda";
  const storeEmail = store?.storeEmail || store?.email || "";
  const storePhone = store?.storePhone || store?.phone || "";
  const { data: managedProducts = [] } = useSWR<Array<Product & { id: string }>>(catalogUrl, async (url) => {
    const response = await fetch(url);
    if (!response.ok) return [];
    const payload: unknown = await response.json();
    return Array.isArray(payload) ? payload : [];
  });
  const liveProducts = Array.isArray(managedProducts) ? managedProducts.map((product) => ({ ...product, image: product.image || (product as Product & { imageUrl?: string }).imageUrl || "21840.png", price: `$${Number(product.price).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`, transfer: product.transfer || "Consultá por transferencia", installments: "Hasta 6 cuotas sin interés" })) : [];

  useEffect(() => {
    const syncProductRoute = () => {
      const slug = window.location.pathname.startsWith("/producto/") ? window.location.pathname.split("/").pop() : null;
      const catalog = liveProducts;
      setSelectedProduct(slug ? catalog.find((product) => productSlug(product.name) === slug) || null : null);
    };
    syncProductRoute();
    window.addEventListener("popstate", syncProductRoute);
    return () => window.removeEventListener("popstate", syncProductRoute);
  }, [liveProducts]);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return null;
    const term = search.toLowerCase();
    return liveProducts.filter((p) => p.name.toLowerCase().includes(term));
  }, [search, liveProducts]);

  function openProduct(product: Product) {
    window.history.pushState({}, "", `/producto/${productSlug(product.name)}`);
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeProduct() {
    window.history.pushState({}, "", "/");
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addToCart(product: Product) {
    setCart((items) => [...items, product]);
    setNotice(`${product.name} se agregó al carrito`);
    window.setTimeout(() => setNotice(""), 2600);
  }

  function changeQuantity(name: string, delta: number) {
    setCart((items) => {
      const index = items.findIndex((item) => item.name === name);
      if (index < 0) return items;
      const next = [...items];
      if (delta < 0) next.splice(index, 1);
      else next.push(next[index]);
      return next;
    });
  }

  function cartTotal() {
    return cart.reduce((total, item) => total + Number(item.price.replace(/[$.]/g, "").replace(",00", "")), 0);
  }

  function subscribe(event: FormEvent) {
    event.preventDefault();
    if (!email.includes("@")) return setNotice("Ingresá un email válido");
    setNotice("¡Gracias por suscribirte!");
    setEmail("");
  }

  return (
    <div className="site-shell" style={{ "--brand-color": design.brandColor || "#42b85a", "--heading-font": design.headingFont || "Open Sans", "--body-font": design.bodyFont || "Open Sans", "--panel-radius": design.borderStyle === "Redondeado" ? "12px" : design.borderStyle === "Píldora" ? "999px" : "4px" } as React.CSSProperties}>
      {notice && <div className="toast" role="status">{notice}</div>}
      <header>
        <div className="header-main content">
          <button className="menu-toggle" aria-label="Abrir menú" onClick={() => setMenuOpen(!menuOpen)}><span /><span /><span /></button>
          <a href="#inicio" className="logo" aria-label={storeName}>{design.logoPath ? <img src={design.logoPath} alt={design.headerTitle || storeName} /> : <span className="store-logo-text">{design.headerTitle || storeName}</span>}</a>
          <form className="search" onSubmit={(event) => event.preventDefault()}>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="¿Qué estás buscando?" aria-label="Buscar productos" />
            <button aria-label="Buscar"><img src={`${A}/c4d6c.svg`} alt="" /></button>
          </form>
          <button className="account"><img src={`${A}/37ca5.svg`} alt="" /><span>Mi cuenta</span></button>
          <button className="cart" onClick={() => setCartOpen(true)} aria-label="Ver carrito">
            <img src={`${A}/3530c.svg`} alt="" /><b>{cart.length}</b>
          </button>
        </div>
        <nav className={menuOpen ? "nav open" : "nav"}>
          <div className="content">
            {["INICIO", "NOVEDADES", "CUBIERTAS", "REPUESTOS", "INDUMENTARIA", "CASCOS", "ACCESORIOS", "MARCAS", "CONTACTO"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{item}</a>
            ))}
          </div>
        </nav>
        <div className="promo"><img src={`${A}/abbc6.svg`} alt="" /> {design.headerMessage || "ENVÍOS GRATIS A TODO EL PAÍS EN COMPRAS SUPERIORES A $33.000"} {design.headerLink && <a href={design.headerLink}>Ver más</a>} <img src={`${A}/b48f5.svg`} alt="" /></div>
      </header>

      {cartOpen && (
        <div className="cart-overlay" role="presentation" onClick={() => setCartOpen(false)}>
          <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" onClick={(event) => event.stopPropagation()}>
            <div className="cart-drawer-head"><div><span className="eyebrow">Tu compra</span><h2 id="cart-title">Mi carrito <small>{cart.length} {cart.length === 1 ? "producto" : "productos"}</small></h2></div><button className="cart-close" onClick={() => setCartOpen(false)} aria-label="Cerrar carrito">×</button></div>
            {cart.length === 0 ? <div className="cart-empty"><div className="cart-empty-icon">+</div><h3>Tu carrito está vacío</h3><p>Sumá productos para equipar tu moto y disfrutá envío gratis desde $33.000.</p><button className="cart-continue" onClick={() => setCartOpen(false)}>Seguir comprando</button></div> : <>
              <div className="cart-items">{Array.from(new Set(cart.map((item) => item.name))).map((name) => { const item = cart.find((product) => product.name === name)!; const quantity = cart.filter((product) => product.name === name).length; return <div className="cart-item" key={name}><img src={`${A}/${item.image}`} alt="" /><div className="cart-item-copy"><h3>{item.name}</h3><strong>{item.price}</strong><div className="quantity"><button onClick={() => changeQuantity(name, -1)} aria-label={`Quitar ${item.name}`}>−</button><span>{quantity}</span><button onClick={() => changeQuantity(name, 1)} aria-label={`Agregar ${item.name}`}>+</button></div></div></div>; })}</div>
              <div className="shipping-box"><span className="shipping-check">✓</span><div><strong>Envío gratis disponible</strong><p>Superando los $33.000 en todo el país</p></div></div>
              <div className="cart-summary"><div><span>Subtotal</span><strong>${cartTotal().toLocaleString("es-AR")}</strong></div><div><span>Envío</span><strong className="free">Gratis</strong></div><div className="cart-total"><span>Total</span><strong>${cartTotal().toLocaleString("es-AR")}</strong></div><button className="checkout-button" onClick={() => setNotice("¡Perfecto! Continuá con tus datos de envío")}>Continuar compra <span>→</span></button><p className="secure-note">Compra segura · Hasta 6 cuotas sin interés</p></div>
            </>}
          </aside>
        </div>
      )}

      {selectedProduct ? <ProductDetail product={selectedProduct} onBuy={addToCart} onBack={closeProduct} /> : <main id="inicio">
        <section className="finder content">
          <h2>{design.heroTitle || `ENCONTRÁ TODO EN ${storeName.toUpperCase()}`}</h2>
          <div className="finder-fields">
            {["Elegí una categoría", "Elegí una subcategoría", "Elegí una marca", "Elegí un modelo"].map((label, index) => (
              <label className="select-wrap" key={label}>
                <select value={filters[index]} onChange={(event) => setFilters(filters.map((value, i) => i === index ? event.target.value : value))}>
                  <option value="">{label}</option>
                  <option>Cubiertas</option><option>Cascos</option><option>Indumentaria</option>
                </select>
                <img src={`${A}/b5801.svg`} alt="" />
              </label>
            ))}
            <button onClick={() => setNotice(filters.some(Boolean) ? "Filtros aplicados" : "Elegí al menos una opción")}>Buscar</button>
          </div>
        </section>

        {filteredProducts !== null && (
          <ProductSection title={`Resultados para “${search}”`} products={filteredProducts} onBuy={addToCart} onOpen={openProduct} />
        )}

        {liveProducts.length > 0 && <ProductSection title={design.productsTitle || `Productos destacados de ${storeName}`} products={liveProducts} onBuy={addToCart} onOpen={openProduct} />}

        <section className="categories content">
          {[
            ["9aff3.png", "Cubiertas", "cubiertas"],
            ["5001b.png", "Repuestos", "repuestos"],
            ["2eceb.png", "Indumentaria", "indumentaria"],
            ["a5bce.png", "Accesorios", "accesorios"],
          ].map(([image, label, id]) => (
            <a href={`#${id}`} className="category" key={label}>
              <img src={`${A}/${image}`} alt={label} />
              <div><h2>{label}</h2><span>VER MÁS</span></div>
            </a>
          ))}
        </section>

        {liveProducts.length > 0 && <div id="novedades"><ProductSection title="Productos de la tienda" products={liveProducts} onBuy={addToCart} onOpen={openProduct} /></div>}

        {liveProducts.length > 0 && <div id="cubiertas"><ProductSection title="Productos disponibles" products={liveProducts} onBuy={addToCart} onOpen={openProduct} /></div>}

        {liveProducts.length > 0 && <div id="equipamiento" className="rider-area">
          <ProductSection title={`Productos de ${storeName}`} products={liveProducts} dark onBuy={addToCart} onOpen={openProduct} />
        </div>}

        <section className="benefits content">
          {[
            ["Envíos gratis a partir de los $33.000 a todo el país", "¡Envíos en el día en CABA y GBA!"],
            ["En cuotas al mismo precio", "Pagá en hasta 6 cuotas sin interés"],
            ["Atención profesional y personalizada", "Un equipo experto disponible para vos"],
            ["Cambios y devoluciones", "Hasta 30 días para devolver tu compra gratis"],
          ].map(([title, detail], index) => <div key={title}><i><img src={`${A}/${["b4d29.svg", "6d1c2.svg", "a1161.svg", "a1c08.svg"][index]}`} alt="" /></i><strong>{title}</strong><span>{detail}</span></div>)}
        </section>

        <section className="tire-finder content">
          <div className="tire-copy">
            <h2>Encontrá el neumático para tu moto</h2>
            <div>
              {["Ancho", "Relación de aspecto", "Rodado"].map((label) => <label className="tire-select" key={label}><select><option>{label}</option><option>Seleccionar</option></select><img src={`${A}/49724.svg`} alt="" /></label>)}
              <button onClick={() => setNotice("Completá las medidas para buscar")}>BUSCAR</button>
            </div>
          </div>
          <img src={`${A}/07c27.png`} alt="Encontrá el neumático para tu moto" />
        </section>
      </main>}

      <footer id="contacto">
        <div className="footer-main content">
          <div><h3>Información</h3><a>Quiénes somos</a><a>Medios de envío</a><a>Devoluciones y cambios</a><a>Medios de pago</a></div>
          <div><h3>Productos</h3><a>Los más elegidos</a><a>Indumentaria</a><a>Cubiertas</a><a>Cascos</a><a>Repuestos</a></div>
          <div><h3>Contactános</h3>{storePhone && <a href={`tel:${storePhone}`}>{storePhone}</a>}{storeEmail && <a href={`mailto:${storeEmail}`}>{storeEmail}</a>}</div>
          <div><h3>Newsletter</h3><p>Recibí novedades y promociones</p><form onSubmit={subscribe}><input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Ingresá tu email..." /><button>ENVIAR</button></form></div>
        </div>
        <div className="payment-area content">
          <span>Medios de pago</span>
          <div>{payments.map((payment) => <img key={payment} src={`${A}/${payment}`} alt="" />)}</div>
          <div className="seals"><img key="afip-seal" src={`${A}/f5f76.png`} alt="AFIP" /></div>
        </div>
        <div className="copyright">{design.footerText || `Copyright ${storeName} - 2026. Todos los derechos reservados.`}</div>
      </footer>
      <a className="whatsapp" href="https://wa.me/5491125369000" target="_blank" rel="noreferrer" aria-label="Contactar por WhatsApp"><img src={`${A}/98f76.svg`} alt="" /></a>
    </div>
  );
}
