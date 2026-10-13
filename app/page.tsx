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

const newProducts: Product[] = [
  { name: "Kit de plásticos completos Motokit rojo Honda New Titan 150", image: "21840.png", price: "$183.000,00", transfer: "$155.550,00", installments: "6 x $30.500" },
  { name: "Campera moto Radikal Concept impermeable con protecciones", image: "f48b1.png", price: "$163.000,00", transfer: "$138.550,00", installments: "6 x $27.167" },
  { name: "Kit de plásticos completos Motokit negro Yamaha XTZ 125", image: "1e6c9.png", price: "$187.000,00", transfer: "$158.950,00", installments: "6 x $31.167" },
  { name: "Campera moto turismo Radikal Speed Tres Capas Impermeable", image: "64690.png", price: "$234.000,00", transfer: "$198.900,00", installments: "6 x $39.000", rating: "5,0 (6)" },
  { name: "Campera moto Radikal Ride Fuse impermeable con protecciones", image: "a39ad.png", price: "$193.500,00", transfer: "$164.475,00", installments: "6 x $32.250", rating: "5,0 (1)" },
  { name: "Kit de plásticos completos Motokit negro para motos 110cc", image: "40337.png", price: "$250.000,00", transfer: "$212.500,00", installments: "6 x $41.667" },
];

const popularProducts: Product[] = [
  { name: "Cubierta 80 100 14 Pirelli Super City", image: "d771d.png", price: "$77.250,00", transfer: "$65.662,50", installments: "6 x $12.875", rating: "5,0 (7)" },
  { name: "Kit de plásticos completos Motokit rojo Honda XR 250 Tornado", image: "14f81.png", price: "$218.000,00", transfer: "$185.300,00", installments: "6 x $36.333" },
  { name: "Cubierta moto 4.10-18 DM Pro MR923 trasera", image: "f0059.png", price: "$61.750,00", transfer: "$52.487,50", installments: "6 x $10.292", rating: "4,9 (8)" },
  { name: "Kit de plásticos completos Motokit negro Honda New Wave 110", image: "df3d4.png", price: "$337.000,00", transfer: "$286.450,00", installments: "6 x $56.167" },
  { name: "Cubierta 2.75 18 Pirelli Super City", image: "5543a.png", price: "$89.250,00", transfer: "$75.862,50", installments: "6 x $14.875", rating: "4,9 (16)" },
  { name: "Kit de plásticos completos Motokit azul Yamaha XTZ 125", image: "40337.png", price: "$168.500,00", transfer: "$143.225,00", installments: "6 x $28.083" },
];

const riderProducts: Product[] = [
  { name: "Campera de lluvia moto Radikal Clear", image: "d4e52.png", price: "$68.250,00", transfer: "$58.012,50", installments: "6 x $11.375" },
  { name: "Campera moto turismo Radikal Speed Tres Capas", image: "64690.png", price: "$234.000,00", transfer: "$198.900,00", installments: "6 x $39.000", rating: "5,0 (6)" },
  { name: "Casco LS2 integral 352 Rookie solid negro", image: "294e4.png", price: "$211.000,00", transfer: "$179.350,00", installments: "6 x $35.167" },
  { name: "Casco Moto Rebatible Radikal Kick Solid Flip Up", image: "b3ab2.png", price: "$271.000,00", transfer: "$230.350,00", installments: "6 x $45.167" },
  { name: "Casco MAC integral FF069 Force solid negro mate", image: "57f05.png", price: "$210.000,00", transfer: "$178.500,00", installments: "6 x $35.000" },
  { name: "Guantes impermeables Radikal Ride Smart Touch", image: "98755.png", price: "$58.250,00", transfer: "$49.512,50", installments: "6 x $9.708" },
];

const brands = ["edfce.png", "1f61e.png", "cb9fc.png", "f2f54.png", "81330.png", "8bcee.png", "d1f64.png", "b6d52.png", "1392d.png", "8997d.png"];
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
            <ul className="trust-list"><li>Compra segura y protegida</li><li>Cambios y devoluciones simples</li><li>Atención personalizada de El Flaco Motos</li></ul>
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
  const { data: managedProducts = [] } = useSWR<Array<Product & { id: string }>>("/api/catalog", (url) => fetch(url).then((response) => response.json()));
  const liveProducts = managedProducts.map((product) => ({ ...product, image: product.image || "21840.png", price: `$${Number(product.price).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`, transfer: product.transfer || "Consultá por transferencia", installments: "Hasta 6 cuotas sin interés" }));

  useEffect(() => {
    const syncProductRoute = () => {
      const slug = window.location.pathname.startsWith("/producto/") ? window.location.pathname.split("/").pop() : null;
      const catalog = [...liveProducts, ...newProducts, ...popularProducts, ...riderProducts];
      setSelectedProduct(slug ? catalog.find((product) => productSlug(product.name) === slug) || null : null);
    };
    syncProductRoute();
    window.addEventListener("popstate", syncProductRoute);
    return () => window.removeEventListener("popstate", syncProductRoute);
  }, [liveProducts]);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return null;
    const term = search.toLowerCase();
    return [...liveProducts, ...newProducts, ...popularProducts, ...riderProducts].filter((p) => p.name.toLowerCase().includes(term));
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
    <div className="site-shell">
      {notice && <div className="toast" role="status">{notice}</div>}
      <header>
        <div className="header-main content">
          <button className="menu-toggle" aria-label="Abrir menú" onClick={() => setMenuOpen(!menuOpen)}><span /><span /><span /></button>
          <a href="#inicio" className="logo"><img src={`${A}/ab5e2.png`} alt="Motomercado" /></a>
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
        <div className="promo"><img src={`${A}/abbc6.svg`} alt="" /> ENVÍOS GRATIS A TODO EL PAÍS EN COMPRAS SUPERIORES A $33.000 <img src={`${A}/b48f5.svg`} alt="" /></div>
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
        <section className="hero content">
          <a href="#novedades" className="hero-main"><img src={`${A}/38ad7.png`} alt="Equipamiento para moto Radikal" /></a>
          <div className="hero-side">
            <a href="#cubiertas"><img src={`${A}/f845f.png`} alt="Cubiertas para moto" /></a>
            <a href="#cascos"><img src={`${A}/60a4c.png`} alt="Cascos para moto" /></a>
            <a href="#repuestos"><img src={`${A}/5f46c.png`} alt="Repuestos para moto" /></a>
          </div>
        </section>

        <section className="finder content">
          <h2>ENCONTRÁ TODO PARA TU MOTO</h2>
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

        {liveProducts.length > 0 && <ProductSection title="Productos destacados de El Flaco Motos" products={liveProducts} onBuy={addToCart} onOpen={openProduct} />}

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

        <div id="novedades"><ProductSection title="¡Novedades y reingresos!" products={newProducts} onBuy={addToCart} onOpen={openProduct} /></div>

        <section className="brands">
          <div className="content">
            <h2>Nuestras marcas</h2>
            <div className="brand-carousel">
              <img className="carousel-arrow" src={`${A}/3a7d0.svg`} alt="" />
              <div className="brand-row">{brands.map((brand) => <img key={brand} src={`${A}/${brand}`} alt="Marca de Motomercado" />)}</div>
              <img className="carousel-arrow" src={`${A}/b6a6c.svg`} alt="" />
            </div>
          </div>
        </section>

        <div id="cubiertas"><ProductSection title="Los más elegidos" products={popularProducts} onBuy={addToCart} onOpen={openProduct} /></div>

        <a className="wide-banner content" href="#equipamiento">
          <img src={`${A}/bd780.png`} alt="Un modelo para cada necesidad" />
        </a>

        <div id="equipamiento" className="rider-area" style={{ backgroundImage: `url(${A}/9b7ed.png)` }}>
          <ProductSection title="PARA EQUIPARTE A VOS" products={riderProducts} dark onBuy={addToCart} onOpen={openProduct} />
        </div>

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
        <div className="social">
          {[
            ["https://instagram.com/motomercado.arg", "9befb.svg", "Instagram"],
            ["https://www.facebook.com/motomercado.arg", "8a28b.svg", "Facebook"],
            ["https://www.youtube.com/@motomercado9992", "60cd4.svg", "YouTube"],
            ["https://www.tiktok.com/@motomercado.arg", "0690b.svg", "TikTok"],
          ].map(([href, icon, label]) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}><img src={`${A}/${icon}`} alt="" /></a>)}
        </div>
        <div className="footer-main content">
          <div><h3>Información</h3><a>Quiénes somos</a><a>Medios de envío</a><a>Devoluciones y cambios</a><a>Medios de pago</a></div>
          <div><h3>Productos</h3><a>Los más elegidos</a><a>Indumentaria</a><a>Cubiertas</a><a>Cascos</a><a>Repuestos</a></div>
          <div><h3>Contactános</h3><a>3462-221781 / 3462-389514</a><a>Venado Tuerto - Santa Fé</a><a>info@elflacomotos.com.ar</a></div>
          <div><h3>Newsletter</h3><p>Recibí novedades y promociones</p><form onSubmit={subscribe}><input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Ingresá tu email..." /><button>ENVIAR</button></form></div>
        </div>
        <div className="payment-area content">
          <span>Medios de pago</span>
          <div>{payments.map((payment) => <img key={payment} src={`${A}/${payment}`} alt="" />)}</div>
          <div className="seals"><img key="afip-seal" src={`${A}/f5f76.png`} alt="AFIP" /></div>
        </div>
        <div className="copyright">Copyright DiseArte - 2026. Todos los derechos reservados.</div>
      </footer>
      <a className="whatsapp" href="https://wa.me/5491125369000" target="_blank" rel="noreferrer" aria-label="Contactar por WhatsApp"><img src={`${A}/98f76.svg`} alt="" /></a>
    </div>
  );
}
