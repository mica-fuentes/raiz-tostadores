// Raíz Tostadores · El Mirador
// Generado desde referencia/claude-design/Ficha.dc.html con herramientas/dc-a-react.js.
// La lógica (datos, estado y renderVals) es la del diseño, sin cambios; render() es su markup en JSX.
import React from 'react';
import { texto } from '../texto.jsx';
import fincaHuila from '../assets/fotos/finca-huila.webp';
import v60 from '../assets/fotos/v60.webp';

const RECIPES = [
  { label: 'V60', nums: [['15 g', 'Café'], ['250 ml', 'Agua'], ['93 °C', 'Temperatura'], ['3:00', 'Minutos'], ['Media', 'Molienda'], ['1:16', 'Proporción']], steps: ['Enjuagá el filtro con agua caliente y descartá esa agua.', 'Volcá el café, sumá 40 ml de agua y esperá 30 segundos.', 'Agregá el resto en espiral, en tres tandas.', 'Cuando termina de caer, a la taza.'] },
  { label: 'Espresso', nums: [['18 g', 'Café'], ['36 g', 'En taza'], ['93 °C', 'Temperatura'], ['0:28', 'Segundos'], ['Fina', 'Molienda'], ['1:2', 'Proporción']], steps: ['Distribuí el café y compactá parejo.', 'Extraé 36 g de bebida en 26 a 30 segundos.', 'Si sale ácido, molé más fino; si sale amargo, más grueso.'] },
  { label: 'Prensa francesa', nums: [['30 g', 'Café'], ['500 ml', 'Agua'], ['94 °C', 'Temperatura'], ['4:00', 'Minutos'], ['Gruesa', 'Molienda'], ['1:16', 'Proporción']], steps: ['Volcá el café y toda el agua.', 'A los 4 minutos, rompé la costra con una cuchara.', 'Bajá el émbolo despacio y serví enseguida.'] },
  { label: 'Moka', nums: [['20 g', 'Café'], ['200 ml', 'Agua'], ['Caliente', 'Agua de base'], ['5:00', 'Minutos'], ['Fina', 'Molienda'], ['1:10', 'Proporción']], steps: ['Llená la base con agua caliente hasta la válvula.', 'Poné el café en el filtro sin compactar.', 'Fuego medio; retirá cuando empieza a burbujear.'] }
];
const GRINDS = ['Grano', 'Espresso', 'Filtro', 'Prensa'];

export default class Ficha extends React.Component {
  constructor(props) {
    super(props);
    this.state = { size: 0, grind: 2, mode: 'sub', qty: 1, freq: 4, tab: 0, tracking: false, lx: 50, ly: 50, cart: 0, bump: 0, toastOn: false, toast: '' };
  }
  componentWillUnmount() { clearTimeout(this.tt); }
  renderVals() {
    const s = this.state;
    const fmt = (n) => '$' + n.toLocaleString('es-AR');
    const once = s.size ? 45000 : 12500;
    const sub = s.size ? 40500 : 11250;
    const sz = s.size ? '1 kg' : '250 g';
    const r = RECIPES[s.tab];
    return {
      cart: s.cart,
      cartCls: 'cartn' + (s.bump ? (s.bump % 2 ? ' bump' : ' bump2') : ''),
      mediaCls: 'pmedia wander' + (s.tracking ? ' tracking' : ''),
      lx: s.lx + '%',
      ly: s.ly + '%',
      move: (e) => { const b = e.currentTarget.getBoundingClientRect(); this.setState({ tracking: true, lx: Math.round(((e.clientX - b.left) / b.width) * 100), ly: Math.round(((e.clientY - b.top) / b.height) * 100) }); },
      leave: () => this.setState({ tracking: false }),
      sizeLabel: sz,
      sizes: ['250 g', '1 kg'].map((z, k) => ({ label: z, on: s.size === k, cls: 'chip' + (s.size === k ? ' on' : ''), pick: () => this.setState({ size: k }) })),
      grinds: GRINDS.map((g, k) => ({ label: g, on: s.grind === k, cls: 'chip' + (s.grind === k ? ' on' : ''), pick: () => this.setState({ grind: k }) })),
      isSub: s.mode === 'sub',
      isOnce: s.mode === 'once',
      subCls: 'opt' + (s.mode === 'sub' ? ' on' : ''),
      onceCls: 'opt' + (s.mode === 'once' ? ' on' : ''),
      pickSub: () => this.setState({ mode: 'sub' }),
      pickOnce: () => this.setState({ mode: 'once' }),
      subPrice: fmt(sub),
      oncePrice: fmt(once),
      freqs: [2, 4].map((f) => ({ label: 'Cada ' + f + ' semanas', on: s.freq === f, cls: 'chip' + (s.freq === f ? ' on' : ''), pick: () => this.setState({ freq: f }) })),
      subCta: 'Suscribirme · ' + fmt(sub) + ' cada ' + s.freq + ' semanas',
      qty: s.qty,
      minus: () => this.setState((st) => ({ qty: Math.max(1, st.qty - 1) })),
      plus: () => this.setState((st) => ({ qty: Math.min(9, st.qty + 1) })),
      onceCta: 'Agregar al carrito · ' + fmt(once * s.qty),
      addCart: () => {
        clearTimeout(this.tt);
        this.setState((st) => ({ cart: st.cart + st.qty, bump: st.bump + 1, toastOn: true, toast: 'Agregaste ' + st.qty + ' × El Mirador ' + sz + ' · ' + GRINDS[st.grind].toLowerCase() }));
        this.tt = setTimeout(() => this.setState({ toastOn: false }), 2600);
      },
      tabs: RECIPES.map((x, k) => ({ label: x.label, on: s.tab === k, cls: 'chip' + (s.tab === k ? ' on' : ''), pick: () => this.setState({ tab: k }) })),
      recipeCls: 'recipe' + (s.tab % 2 ? ' b' : ''),
      rNums: r.nums.map((n) => ({ v: n[0], k: n[1] })),
      rSteps: r.steps,
      toastCls: 'toast' + (s.toastOn ? ' on' : ''),
      toastTxt: s.toast,
      noSubmit: (e) => e.preventDefault()
    };
  }

  render() {
    const { addCart, cart, cartCls, freqs, grinds, isOnce, isSub, leave, lx, ly, mediaCls, minus, move, noSubmit, onceCls, onceCta, oncePrice, pickOnce, pickSub, plus, qty, rNums, rSteps, recipeCls, sizeLabel, sizes, subCls, subCta, subPrice, tabs, toastCls, toastTxt } = this.renderVals();
    return (
      <div className="raiz">
        <header className="hdr static">
          <div className="wrap hdr-in">
            <a href="../" className="logo-link" aria-label="Raíz Tostadores, inicio">
              <span className="logo"></span>
            </a>
            <nav className="nav" aria-label="Principal">
              <a href="../tienda/" className="on">Tienda</a>
              <a href="../suscripcion/">Suscripción</a>
              <a href="../">Encontrá tu café</a>
              <a href="../">Cómo tostamos</a>
            </nav>
            <div className="hdr-r">
              <a href="../cuenta/" className="tlink hide-s">Mi cuenta</a>
              <a href="#carrito" className="tlink">Carrito<span className={cartCls}>{texto(cart)}</span></a>
              <a href="../suscripcion/" className="pill solid cta-s">Suscribirme</a>
              <details className="mmenu">
                <summary className="pill" aria-label="Abrir menú">Menú</summary>
                <nav className="mmenu-panel" aria-label="Menú">
                  <a href="../tienda/">Tienda</a>
                  <a href="../suscripcion/">Suscripción</a>
                  <a href="../">Encontrá tu café</a>
                  <a href="../cuenta/">Mi cuenta</a>
                  <a href="#carrito">Carrito</a>
                </nav>
              </details>
            </div>
          </div>
        </header>
        <section className="wrap prod">
          <div className={mediaCls} style={{ "--lx": lx, "--ly": ly }} onPointerMove={move} onPointerLeave={leave}>
            <div className="lens tr-el-mirador" aria-hidden="true"></div>
            <span className="pnum serif">N.º 01</span>
            <div className="pbag">
              <div className="bag tr-el-mirador bob" role="img" aria-label={`Bolsa de El Mirador, ${sizeLabel}`}>
                <div className="blabel" aria-hidden="true">
                  <span className="logo"></span>
                  <hr />
                  <span className="bname">El Mirador</span>
                  <span className="bdata">Huila · 1700 m</span>
                </div>
              </div>
              <div className="sticker" aria-hidden="true">Tostado<br />lun 5/10</div>
            </div>
          </div>
          <div className="pinfo">
            <p className="crumbs"><a href="../tienda/">Tienda</a>{" / Colombia"}</p>
            <h1 className="h1 serif">El Mirador</h1>
            <p className="pmeta">Huila, Colombia · 1700 m · Lavado · Tueste medio</p>
            <p className="pnotes serif">Chocolate con leche, caramelo y manzana roja. Dulce y limpio.</p>
            <div className="meters">
              <div className="meter">
                <span>Dulzor</span>
                <div className="meter-bar" role="img" aria-label="Dulzor: 4 de 5">
                  <i className="on"></i>
                  <i className="on"></i>
                  <i className="on"></i>
                  <i className="on"></i>
                  <i></i>
                </div>
              </div>
              <div className="meter">
                <span>Acidez</span>
                <div className="meter-bar" role="img" aria-label="Acidez: 3 de 5">
                  <i className="on"></i>
                  <i className="on"></i>
                  <i className="on"></i>
                  <i></i>
                  <i></i>
                </div>
              </div>
              <div className="meter">
                <span>Cuerpo</span>
                <div className="meter-bar" role="img" aria-label="Cuerpo: 3 de 5">
                  <i className="on"></i>
                  <i className="on"></i>
                  <i className="on"></i>
                  <i></i>
                  <i></i>
                </div>
              </div>
            </div>
            <div>
              <p className="lbl">Peso</p>
              <div className="seg">
                {sizes.map((z, i) => (
                  <button key={i} className={z.cls} type="button" aria-pressed={z.on} onClick={z.pick}>{texto(z.label)}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="lbl">Molienda</p>
              <div className="seg">
                {grinds.map((g, i) => (
                  <button key={i} className={g.cls} type="button" aria-pressed={g.on} onClick={g.pick}>{texto(g.label)}</button>
                ))}
              </div>
            </div>
            <div className="modes" role="radiogroup" aria-label="Cómo lo querés">
              <button className={subCls} type="button" role="radio" aria-checked={isSub} onClick={pickSub}>
                <span className="radio"></span>
                <span className="opt-t">
                  <b>Suscripción<span className="save-tag">−10%</span></b>
                  <span>Cada 2 o 4 semanas, sin permanencia</span>
                </span>
                <span className="opt-p">{texto(subPrice)}</span>
              </button>
              <button className={onceCls} type="button" role="radio" aria-checked={isOnce} onClick={pickOnce}>
                <span className="radio"></span>
                <span className="opt-t">
                  <b>Compra única</b>
                  <span>Llega 48 h después del tueste</span>
                </span>
                <span className="opt-p">{texto(oncePrice)}</span>
              </button>
            </div>
            {isSub ? <>
              <div>
                <p className="lbl">Frecuencia</p>
                <div className="seg">
                  {freqs.map((f, i) => (
                    <button key={i} className={f.cls} type="button" aria-pressed={f.on} onClick={f.pick}>{texto(f.label)}</button>
                  ))}
                </div>
              </div>
              <a href="../suscripcion/" className="pill solid big">{texto(subCta)}</a>
            </> : null}
            {isOnce ? <div className="buyrow">
              <div className="stepper">
                <button type="button" aria-label="Restar una bolsa" onClick={minus}>−</button>
                <span aria-live="polite">{texto(qty)}</span>
                <button type="button" aria-label="Sumar una bolsa" onClick={plus}>+</button>
              </div>
              <button className="pill solid big" type="button" onClick={addCart}>{texto(onceCta)}</button>
            </div> : null}
            <p className="fine">Envío gratis en moto en CABA. Sale de la tanda del lunes 5/10.</p>
          </div>
        </section>
        <section className="sec origen">
          <div className="wrap">
            <figure className="ph finca-ph">
              <img src={fincaHuila} alt="Cafetales en las laderas de Huila con cerezas maduras en primer plano" />
              <figcaption>Huila, Colombia</figcaption>
            </figure>
          </div>
          <div className="wrap origen-in">
            <div>
              <p className="eyebrow muted">De dónde viene</p>
              <h2 className="h2 serif">{"Una finca\na 1700 metros."}</h2>
              <dl className="facts">
                <div>
                  <dt>Productor</dt>
                  <dd>[Nombre del productor]</dd>
                </div>
                <div>
                  <dt>Región</dt>
                  <dd>Huila, Colombia</dd>
                </div>
                <div>
                  <dt>Variedades</dt>
                  <dd>Caturra y Castillo</dd>
                </div>
                <div>
                  <dt>Proceso</dt>
                  <dd>Lavado</dd>
                </div>
                <div>
                  <dt>Cosecha</dt>
                  <dd>[Meses de cosecha]</dd>
                </div>
                <div>
                  <dt>Tueste</dt>
                  <dd>Medio · lunes 5/10</dd>
                </div>
              </dl>
            </div>
            <figure style={{ margin: "0" }}>
              <svg className="alt-svg" viewBox="0 0 640 380" role="img" aria-label="Altura de los cinco orígenes: Caparaó 1200 m, Santa Cruz 1500 m, San Ignacio 1600 m, El Mirador 1700 m y Buku 2000 m.">
                <path d="M0 380 C70 350 120 280 190 210 C250 150 280 80 330 50 C380 80 420 150 480 210 C540 270 590 320 640 336 L640 380 Z" fill="#E3D4C1"></path>
                <g fontFamily="DM Sans, sans-serif" fontSize="13" fontWeight="600">
                  <line x1="0" y1="290" x2="640" y2="290" stroke="#C8B49A" strokeWidth="1.5" strokeDasharray="4 6"></line>
                  <text x="0" y="282" fill="#6E5A4E">Caparaó · 1200 m</text>
                  <line x1="0" y1="215" x2="640" y2="215" stroke="#C8B49A" strokeWidth="1.5" strokeDasharray="4 6"></line>
                  <text x="0" y="207" fill="#6E5A4E">Santa Cruz · 1500 m</text>
                  <line x1="0" y1="190" x2="640" y2="190" stroke="#C8B49A" strokeWidth="1.5" strokeDasharray="4 6"></line>
                  <text x="0" y="182" fill="#6E5A4E">San Ignacio · 1600 m</text>
                  <line x1="0" y1="165" x2="640" y2="165" stroke="#A95F44" strokeWidth="2.5"></line>
                  <circle cx="452" cy="165" r="9" fill="#A95F44"></circle>
                  <circle cx="452" cy="165" r="18" fill="none" stroke="#A95F44" strokeWidth="1.5" opacity=".5"></circle>
                  <text x="476" y="157" fill="#8E4A33" fontSize="15" fontWeight="700">El Mirador · 1700 m</text>
                  <line x1="0" y1="90" x2="640" y2="90" stroke="#C8B49A" strokeWidth="1.5" strokeDasharray="4 6"></line>
                  <text x="0" y="82" fill="#6E5A4E">Buku · 2000 m</text>
                </g>
              </svg>
              <figcaption className="alt-cap">A más altura, el grano madura más lento y concentra más azúcares.</figcaption>
            </figure>
          </div>
        </section>
        <section className="sec">
          <div className="wrap recipe-wrap">
            <figure className="ph v60-ph">
              <img src={v60} alt="Agua cayendo sobre el café en un V60 de cerámica" />
            </figure>
            <div>
              <p className="eyebrow muted">Cómo prepararlo</p>
              <h2 className="h2 serif">Tu receta de partida.</h2>
              <div className="tabs" role="tablist" aria-label="Método">
                {tabs.map((t, i) => (
                  <button key={i} className={t.cls} type="button" role="tab" aria-selected={t.on} onClick={t.pick}>{texto(t.label)}</button>
                ))}
              </div>
              <div className={recipeCls}>
                <div className="nums">
                  {rNums.map((n, i) => (
                    <div key={i} className="num">
                      <b>{texto(n.v)}</b>
                      <span>{texto(n.k)}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <ol className="rsteps">
                    {rSteps.map((st, i) => (
                      <li key={i}>{texto(st)}</li>
                    ))}
                  </ol>
                  <p className="fine" style={{ marginTop: "24px" }}>Receta de referencia: a validar con el tostador.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="wrap" style={{ paddingBottom: "120px" }}>
          <p className="eyebrow muted">También te puede gustar</p>
          <div className="related">
            <a href="../tienda/" className="rel">
              <div className="bag tr-buku" role="img" aria-label="Bolsa de Buku"></div>
              <div>
                <b>Buku</b>
                <span>Frutilla, jazmín y arándanos</span>
              </div>
            </a>
            <a href="../tienda/" className="rel">
              <div className="bag tr-santa-cruz" role="img" aria-label="Bolsa de Santa Cruz"></div>
              <div>
                <b>Santa Cruz</b>
                <span>Cacao, frutos rojos y vino</span>
              </div>
            </a>
            <a href="../tienda/" className="rel">
              <div className="bag tr-san-ignacio" role="img" aria-label="Bolsa de San Ignacio"></div>
              <div>
                <b>San Ignacio</b>
                <span>Nuez, miel y notas florales</span>
              </div>
            </a>
          </div>
        </section>
        <footer className="foot">
          <div className="wrap foot-top">
            <div>
              <h2 className="h2 serif">{"Avisame cuando\nsalga la tanda."}</h2>
              <form className="news" onSubmit={noSubmit}>
                <label className="sr" htmlFor="mail-f">Tu mail</label>
                <input id="mail-f" type="email" placeholder="tu@mail.com" />
                <button className="pill light" type="submit">Avisame</button>
              </form>
            </div>
            <div className="fcols">
              <div>
                <p className="fh">Tienda</p>
                <a href="../tienda/">Cafés</a>
                <a href="../suscripcion/">Suscripción</a>
                <a href="../">Encontrá tu café</a>
              </div>
              <div>
                <p className="fh">Ayuda</p>
                <a href="#envios">Envíos</a>
                <a href="#moliendas">Moliendas</a>
                <a href="#contacto">Contacto</a>
              </div>
              <div>
                <p className="fh">Raíz</p>
                <a href="../">Cómo tostamos</a>
                <a href="#instagram">Instagram</a>
                <a href="../cuenta/">Mi cuenta</a>
              </div>
            </div>
          </div>
          <div className="giant" aria-hidden="true">
            <span className="logo"></span>
          </div>
        </footer>
        <div className={toastCls} role="status"><span className="leaf"></span>{texto(toastTxt)}</div>
      </div>
    );
  }
}
