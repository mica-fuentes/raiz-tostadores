// Raíz Tostadores · Tienda
// Generado desde referencia/claude-design/Tienda.dc.html con herramientas/dc-a-react.js.
// La lógica (datos, estado y renderVals) es la del diseño, sin cambios; render() es su markup en JSX.
import React from 'react';
import { texto } from '../texto.jsx';
import tostadora from '../assets/fotos/tostadora.webp';

const ORIG = [
  { id: 'el-mirador', name: 'El Mirador', region: 'Huila', country: 'Colombia', alt: '1700 m', proc: 'Lavado', notes: 'Chocolate con leche, caramelo y manzana roja.', fondo: '#A0583E', ink: '#FBF8F3', price: 12500, metodo: ['Espresso', 'Filtro'], perfil: ['Chocolate y dulce'], m: [4, 3, 3] },
  { id: 'caparao', name: 'Caparaó', region: 'Minas Gerais', country: 'Brasil', alt: '1200 m', proc: 'Natural', notes: 'Chocolate amargo, avellanas y cuerpo denso.', fondo: '#3A2A21', ink: '#FBF8F3', price: 12500, metodo: ['Espresso', 'Prensa'], perfil: ['Chocolate y dulce'], m: [3, 1, 5] },
  { id: 'san-ignacio', name: 'San Ignacio', region: 'Cajamarca', country: 'Perú', alt: '1600 m', proc: 'Lavado', notes: 'Nuez, miel y notas florales.', fondo: '#686B4D', ink: '#FBF8F3', price: 12000, metodo: ['Filtro', 'Prensa'], perfil: ['Chocolate y dulce', 'Floral'], m: [4, 2, 3] },
  { id: 'buku', name: 'Buku', region: 'Guji', country: 'Etiopía', alt: '2000 m', proc: 'Natural', notes: 'Frutilla, jazmín y arándanos.', fondo: '#E4C7B9', ink: '#3A2A21', price: 14000, metodo: ['Filtro'], perfil: ['Frutal', 'Floral'], m: [3, 5, 2] },
  { id: 'santa-cruz', name: 'Santa Cruz', region: 'Chiapas', country: 'México', alt: '1500 m', proc: 'Maceración carbónica', notes: 'Cacao, frutos rojos y vino.', fondo: '#7C4450', ink: '#FBF8F3', price: 13500, metodo: ['Filtro'], perfil: ['Frutal'], m: [3, 4, 3] }
];
const FM = ['Todos', 'Espresso', 'Filtro', 'Prensa'];
const FP = ['Todos', 'Chocolate y dulce', 'Frutal', 'Floral'];
const ML = ['Dulzor', 'Acidez', 'Cuerpo'];

export default class Tienda extends React.Component {
  constructor(props) {
    super(props);
    this.state = { cart: 0, bump: 0, toast: '', toastOn: false, fm: 'Todos', fp: 'Todos', sizes: [0, 0, 0, 0, 0], hi: -1, hx: 50, hy: 50 };
  }
  componentWillUnmount() { clearTimeout(this.tt); }
  renderVals() {
    const s = this.state;
    const fmt = (n) => '$' + Math.round(n).toLocaleString('es-AR');
    const ok = (o) => (s.fm === 'Todos' || o.metodo.includes(s.fm)) && (s.fp === 'Todos' || o.perfil.includes(s.fp));
    const n = ORIG.filter(ok).length;
    return {
      cart: s.cart,
      cartCls: 'cartn' + (s.bump ? (s.bump % 2 ? ' bump' : ' bump2') : ''),
      fm: FM.map((x) => ({ label: x, on: s.fm === x, cls: 'chip' + (s.fm === x ? ' on' : ''), pick: () => this.setState({ fm: x }) })),
      fp: FP.map((x) => ({ label: x, on: s.fp === x, cls: 'chip' + (s.fp === x ? ' on' : ''), pick: () => this.setState({ fp: x }) })),
      countTxt: n === 5 ? 'Los 5 cafés de esta tanda.' : (n === 0 ? 'Ningún café coincide: probá con otra combinación.' : n + (n === 1 ? ' café coincide' : ' cafés coinciden') + ' con lo que buscás.'),
      rows: ORIG.map((o, i) => {
        const tr = s.hi === i;
        const kg = s.sizes[i] === 1;
        return {
          cls: 'shelf' + (i % 2 ? ' rev' : '') + (ok(o) ? '' : ' dim'),
          mediaCls: 'shelf-media wander' + (tr ? ' tracking' : ''),
          lensCls: 'lens tr-' + o.id,
          fondo: o.fondo,
          ink: o.ink,
          lx: (tr ? s.hx : 50) + '%',
          ly: (tr ? s.hy : 50) + '%',
          delay: (-i * 3.7) + 's',
          move: (e) => { const b = e.currentTarget.getBoundingClientRect(); this.setState({ hi: i, hx: Math.round(((e.clientX - b.left) / b.width) * 100), hy: Math.round(((e.clientY - b.top) / b.height) * 100) }); },
          leave: () => this.setState({ hi: -1 }),
          num: '0' + (i + 1),
          bagCls: 'bag tr-' + o.id,
          aria: 'Bolsa de ' + o.name,
          name: o.name,
          data: o.region + ' · ' + o.alt,
          meta: o.region + ', ' + o.country + ' · ' + o.alt + ' · ' + o.proc,
          notesTxt: o.notes,
          meters: o.m.map((v, k) => ({ label: ML[k], aria: ML[k] + ': ' + v + ' de 5', cells: [0, 1, 2, 3, 4].map((c) => ({ cls: c < v ? 'on' : '' })) })),
          tags: o.metodo.map((x) => 'Para ' + x.toLowerCase()),
          sizes: ['250 g', '1 kg'].map((z, k) => ({ label: z, on: s.sizes[i] === k, cls: 'chip' + (s.sizes[i] === k ? ' on' : ''), pick: () => this.setState((st) => { const a = st.sizes.slice(); a[i] = k; return { sizes: a }; }) })),
          priceTxt: fmt(kg ? o.price * 3.6 : o.price),
          add: () => {
            clearTimeout(this.tt);
            this.setState((st) => ({ cart: st.cart + 1, bump: st.bump + 1, toastOn: true, toast: 'Agregaste ' + o.name + ' · ' + (st.sizes[i] === 1 ? '1 kg' : '250 g') }));
            this.tt = setTimeout(() => this.setState({ toastOn: false }), 2600);
          }
        };
      }),
      toastCls: 'toast' + (s.toastOn ? ' on' : ''),
      toastTxt: s.toast,
      noSubmit: (e) => e.preventDefault()
    };
  }

  render() {
    const { cart, cartCls, countTxt, fm, fp, noSubmit, rows, toastCls, toastTxt } = this.renderVals();
    return (
      <div className="raiz">
        <header className="hdr static">
          <div className="wrap hdr-in">
            <a href="../" className="logo-link" aria-label="Raíz Tostadores, inicio">
              <span className="logo"></span>
            </a>
            <nav className="nav" aria-label="Principal">
              <a href="../tienda/" className="on" aria-current="page">Tienda</a>
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
        <section className="top">
          <div className="wrap top-in">
            <div>
              <p className="eyebrow muted">Tienda · tanda del lunes 5/10</p>
              <h1 className="h1 serif">{"Cinco cafés,\nuna tanda."}</h1>
              <p className="lead">Tostamos el lunes lo que se pidió hasta el domingo. Cuando un origen se termina, vuelve en la próxima cosecha.</p>
            </div>
            <div className="filters">
              <div>
                <p className="lbl">Lo preparás en</p>
                <div className="seg">
                  {fm.map((f, i) => (
                    <button key={i} className={f.cls} type="button" aria-pressed={f.on} onClick={f.pick}>{texto(f.label)}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="lbl">Te gusta lo</p>
                <div className="seg">
                  {fp.map((f, i) => (
                    <button key={i} className={f.cls} type="button" aria-pressed={f.on} onClick={f.pick}>{texto(f.label)}</button>
                  ))}
                </div>
              </div>
              <p className="count" aria-live="polite">{texto(countTxt)}</p>
            </div>
          </div>
        </section>
        <section className="wrap" style={{ paddingBottom: "56px" }}>
          <figure className="ph tanda-ph">
            <img src={tostadora} alt="Tostadora volcando la tanda del lunes en la bandeja de enfriado" />
            <figcaption>Así sale la tanda de cada lunes</figcaption>
          </figure>
        </section>
        <section className="wrap shelves" aria-label="Cafés">
          {rows.map((r, i) => (
            <article key={i} className={r.cls}>
              <div className={r.mediaCls} style={{ backgroundColor: r.fondo, color: r.ink, "--lx": r.lx, "--ly": r.ly, animationDelay: r.delay }} onPointerMove={r.move} onPointerLeave={r.leave}>
                <div className={r.lensCls} aria-hidden="true"></div>
                <span className="shelf-num serif">{"N.º "}{texto(r.num)}</span>
                <div className="shelf-bag">
                  <div className={r.bagCls} role="img" aria-label={r.aria}>
                    <div className="blabel" aria-hidden="true">
                      <span className="logo"></span>
                      <hr />
                      <span className="bname">{texto(r.name)}</span>
                      <span className="bdata">{texto(r.data)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="shelf-info">
                <p className="eyebrow muted">{texto(r.meta)}</p>
                <h2 className="h3 big3">
                  <a href="../ficha/" className="nlink">{texto(r.name)}</a>
                </h2>
                <p className="shelf-notes serif">{texto(r.notesTxt)}</p>
                <div className="meters">
                  {r.meters.map((m, i) => (
                    <div key={i} className="meter">
                      <span>{texto(m.label)}</span>
                      <div className="meter-bar" role="img" aria-label={m.aria}>
                        {m.cells.map((c, i) => (
                          <i key={i} className={c.cls}></i>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="stags">
                  {r.tags.map((t, i) => (
                    <span key={i} className="stag">{texto(t)}</span>
                  ))}
                </div>
                <div className="shelf-buy">
                  <div className="seg">
                    {r.sizes.map((z, i) => (
                      <button key={i} className={z.cls} type="button" aria-pressed={z.on} onClick={z.pick}>{texto(z.label)}</button>
                    ))}
                  </div>
                  <span className="shelf-price">{texto(r.priceTxt)}</span>
                  <button className="pill solid" type="button" onClick={r.add}>Agregar</button>
                  <a href="../ficha/" className="ulink">Ver ficha</a>
                </div>
              </div>
            </article>
          ))}
        </section>
        <section className="wrap">
          <div className="quizband">
            <div className="quizband-media">
              <div className="lens tr-buku" aria-hidden="true"></div>
            </div>
            <div className="quizband-txt">
              <p className="eyebrow" style={{ color: "#D4A089", margin: "0" }}>Quiz · 1 minuto</p>
              <h2 className="h2 serif">¿No sabés cuál elegir?</h2>
              <p className="lead">Cuatro preguntas y te recomendamos uno, con el porqué.</p>
              <div>
                <a href="../" className="pill light">Hacer el quiz</a>
              </div>
            </div>
          </div>
        </section>
        <footer className="foot">
          <div className="wrap foot-top">
            <div>
              <h2 className="h2 serif">{"Avisame cuando\nsalga la tanda."}</h2>
              <form className="news" onSubmit={noSubmit}>
                <label className="sr" htmlFor="mail-t">Tu mail</label>
                <input id="mail-t" type="email" placeholder="tu@mail.com" />
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
