import { FormEvent, useMemo, useState } from "react";

const A = "/assets";

type Product = {
  name: string;
  image: string;
  price: string;
  transfer: string;
  installments: string;
  rating?: string;
};

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

function ProductCard({ product, onBuy }: { product: Product; onBuy: (product: Product) => void }) {
  return (
    <article className="product-card">
      <div className="product-image">
        <img src={`${A}/${product.image}`} alt={product.name} />
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

function ProductSection({ title, products, dark = false, onBuy }: { title: string; products: Product[]; dark?: boolean; onBuy: (product: Product) => void }) {
  return (
    <section className={dark ? "products-section products-dark" : "products-section"}>
      <div className="content">
        <div className="section-heading">
          <h2>{title}</h2>
          <div className="section-arrows"><img src={`${A}/287b1.svg`} alt="" /><span>Deslizá para ver más</span><img src={`${A}/29b3a.svg`} alt="" /></div>
        </div>
        <div className="product-row">
          {products.map((product) => <ProductCard key={product.name} product={product} onBuy={onBuy} />)}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Product[]>([]);
  const [notice, setNotice] = useState("");
  const [email, setEmail] = useState("");
  const [filters, setFilters] = useState(["", "", "", ""]);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return null;
    const term = search.toLowerCase();
    return [...newProducts, ...popularProducts, ...riderProducts].filter((p) => p.name.toLowerCase().includes(term));
  }, [search]);

  function addToCart(product: Product) {
    setCart((items) => [...items, product]);
    setNotice(`${product.name} se agregó al carrito`);
    window.setTimeout(() => setNotice(""), 2600);
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
          <button className="cart" onClick={() => setNotice(cart.length ? `${cart.length} producto(s) en tu carrito` : "Tu carrito está vacío")} aria-label="Ver carrito">
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

      <main id="inicio">
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
          <ProductSection title={`Resultados para “${search}”`} products={filteredProducts} onBuy={addToCart} />
        )}

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

        <div id="novedades"><ProductSection title="¡Novedades y reingresos!" products={newProducts} onBuy={addToCart} /></div>

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

        <div id="cubiertas"><ProductSection title="Los más elegidos" products={popularProducts} onBuy={addToCart} /></div>

        <a className="wide-banner content" href="#equipamiento">
          <img src={`${A}/bd780.png`} alt="Un modelo para cada necesidad" />
        </a>

        <div id="equipamiento" className="rider-area" style={{ backgroundImage: `url(${A}/9b7ed.png)` }}>
          <ProductSection title="PARA EQUIPARTE A VOS" products={riderProducts} dark onBuy={addToCart} />
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
      </main>

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
          <div><h3>Contactános</h3><a>+54 9 11 2536 9000</a><a>0810 199 6686 (MOTO)</a><a>contacto@motomercado.com.ar</a></div>
          <div><h3>Newsletter</h3><p>Recibí novedades y promociones</p><form onSubmit={subscribe}><input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Ingresá tu email..." /><button>ENVIAR</button></form></div>
        </div>
        <div className="payment-area content">
          <span>Medios de pago</span>
          <div>{payments.map((payment) => <img key={payment} src={`${A}/${payment}`} alt="" />)}</div>
          <div className="seals"><img src={`${A}/f5f76.png`} alt="AFIP" /><img src={`${A}/3bf29.png`} alt="Sello Motomercado" /></div>
        </div>
        <div className="copyright">Copyright Motomercado - 2026. Todos los derechos reservados.</div>
      </footer>
      <a className="whatsapp" href="https://wa.me/5491125369000" target="_blank" rel="noreferrer" aria-label="Contactar por WhatsApp"><img src={`${A}/98f76.svg`} alt="" /></a>
    </div>
  );
}
