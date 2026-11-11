// Raíz Tostadores · Home
// Generado desde referencia/claude-design/Main.dc.html con herramientas/dc-a-react.js.
// La lógica (datos, estado y renderVals) es la del diseño, sin cambios; render() es su markup en JSX.
import React from 'react';
import { texto } from '../texto.jsx';
import tazaVentana from '../assets/fotos/taza-ventana.webp';
import tostadora from '../assets/fotos/tostadora.webp';
import envasado from '../assets/fotos/envasado.webp';
import motoChacarita from '../assets/fotos/moto-chacarita.webp';

const ORIG = [
  { id: 'el-mirador', name: 'El Mirador', region: 'Huila', country: 'Colombia', alt: '1700 m', proc: 'Lavado', roast: 'medio', notes: ['Chocolate con leche', 'Caramelo', 'Manzana roja'], fondo: '#A0583E', ink: '#FBF8F3', pill: 'light', price: 12500 },
  { id: 'caparao', name: 'Caparaó', region: 'Minas Gerais', country: 'Brasil', alt: '1200 m', proc: 'Natural', roast: 'medio-oscuro', notes: ['Chocolate amargo', 'Avellanas', 'Cuerpo denso'], fondo: '#3A2A21', ink: '#FBF8F3', pill: 'light', price: 12500 },
  { id: 'san-ignacio', name: 'San Ignacio', region: 'Cajamarca', country: 'Perú', alt: '1600 m', proc: 'Lavado', roast: 'medio', notes: ['Nuez', 'Miel', 'Notas florales'], fondo: '#686B4D', ink: '#FBF8F3', pill: 'light', price: 12000 },
  { id: 'buku', name: 'Buku', region: 'Guji', country: 'Etiopía', alt: '2000 m', proc: 'Natural', roast: 'claro', notes: ['Frutilla', 'Jazmín', 'Arándanos'], fondo: '#E4C7B9', ink: '#3A2A21', pill: 'solid', price: 14000 },
  { id: 'santa-cruz', name: 'Santa Cruz', region: 'Chiapas', country: 'México', alt: '1500 m', proc: 'Maceración carbónica', roast: 'claro', notes: ['Cacao', 'Frutos rojos', 'Vino'], fondo: '#7C4450', ink: '#FBF8F3', pill: 'light', price: 13500 }
];
const QUIZ = [
  { t: '¿Cómo preparás el café?', opts: [['Espresso o moka', 'Molienda fina', [2, 3, 1, 0, 1]], ['Filtro', 'V60, Chemex, goteo', [2, 0, 2, 3, 2]], ['Prensa francesa', 'Molienda gruesa', [1, 2, 2, 0, 1]], ['No sé todavía', 'Te ayudamos', [2, 1, 2, 1, 1]]] },
  { t: '¿Qué sabores te tientan?', opts: [['Chocolate y caramelo', 'Dulce y redondo', [3, 2, 2, 0, 1]], ['Frutas rojas', 'Jugoso y vivo', [1, 0, 0, 2, 3]], ['Flores y cítricos', 'Liviano y aromático', [0, 0, 1, 3, 1]], ['Nueces y especias', 'Tostado y profundo', [1, 3, 2, 0, 0]]] },
  { t: '¿Cómo lo tomás?', opts: [['Solo', 'Sin nada', [2, 0, 2, 3, 2]], ['Con leche', 'Latte, cortado', [1, 3, 1, 0, 1]], ['Depende del día', 'Un poco de todo', [2, 2, 2, 1, 1]]] },
  { t: '¿Qué tan intenso lo querés?', opts: [['Suave', 'Para varias tazas', [1, 0, 2, 3, 1]], ['Medio', 'Equilibrado', [3, 1, 2, 1, 2]], ['Intenso', 'Que se sienta', [1, 3, 0, 0, 2]]] }
];
const MOLIENDA = ['molienda fina, lista para la máquina', 'molienda media, ya viene lista', 'molienda gruesa, sin borra en la taza', 'te asesoramos con la molienda'];
const QTY = [{ label: '250 g', sub: 11250, once: 12500 }, { label: '1 kg', sub: 40500, once: 45000 }, { label: '2 kg', sub: 81000, once: 90000 }];
const NOTES = ['Chocolate con leche', 'Manzana roja', 'Avellanas', 'Frutilla', 'Jazmín', 'Miel', 'Cacao', 'Caramelo', 'Nuez', 'Arándanos'];

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { oi: 0, paused: false, tracking: false, lx: 68, ly: 45, qa: [], so: -1, sq: 1, sf: 4 };
  }
  componentDidMount() {
    this.rm = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.rm) this.setState({ paused: true });
    this.arm();
  }
  componentDidUpdate(pp, ps) {
    const s = this.state;
    if (ps.oi !== s.oi || ps.paused !== s.paused || ps.tracking !== s.tracking) this.arm();
  }
  componentWillUnmount() { clearTimeout(this.t); }
  arm() {
    clearTimeout(this.t);
    if (!this.state.paused && !this.state.tracking) {
      this.t = setTimeout(() => this.setState((s) => ({ oi: (s.oi + 1) % ORIG.length })), 5000);
    }
  }
  renderVals() {
    const s = this.state;
    const fmt = (n) => '$' + n.toLocaleString('es-AR');
    const o = ORIG[s.oi];
    const auto = !s.paused && !s.tracking;
    const bagData = (x) => x.region + ' · ' + x.alt;

    // quiz
    const step = s.qa.length;
    const done = step >= QUIZ.length;
    const sc = [0, 0, 0, 0, 0];
    s.qa.forEach((a, qi) => QUIZ[qi].opts[a][2].forEach((w, k) => { sc[k] += w; }));
    let li = 0;
    sc.forEach((v, k) => { if (v > sc[li]) li = k; });
    const L = ORIG[li];
    const q = done ? null : QUIZ[step];
    let r = { name: '', place: '', data: '', pct: '', bagCls: 'bag', aria: '', reasons: [], sub: () => {} };
    if (done) {
      const lab = (qi) => QUIZ[qi].opts[s.qa[qi]][0];
      r = {
        name: L.name,
        place: L.region + ', ' + L.country + ' · ' + L.proc.toLowerCase() + ' · tueste ' + L.roast,
        data: bagData(L),
        pct: Math.min(98, Math.round(58 + (sc[li] / 12) * 40)) + '% match',
        bagCls: 'bag tr-' + L.id,
        aria: 'Bolsa de ' + L.name,
        reasons: [
          { pre: lab(0), txt: MOLIENDA[s.qa[0]] + '.' },
          { pre: lab(1), txt: L.notes.join(', ').toLowerCase() + '.' },
          { pre: lab(2) + ', ' + lab(3).toLowerCase(), txt: 'tueste ' + L.roast + '.' }
        ],
        sub: () => this.setState({ so: li, sq: 1 })
      };
    }
    let qLead = 'Cuatro preguntas. A medida que respondés, el fondo toma el color del café que más se te parece.';
    if (step > 0 && !done) qLead = 'Por ahora vas para ' + L.name + ' (' + L.country + '). Seguí respondiendo.';
    if (done) qLead = 'Lo podés pedir una vez o sumarlo a tu suscripción con 10% off.';

    // suscripción
    const co = s.so < 0 ? o : ORIG[s.so];
    const qty = QTY[s.sq];
    const month = s.sf === 2 ? qty.sub * 2 : qty.sub;
    const cSave = 'Por envío. Ahorrás ' + fmt(qty.once - qty.sub) + ' frente a la compra única; son unos ' + fmt(month) + ' por mes.' + (s.so < 0 ? ' Con «Sorprendeme», cada envío es un origen distinto.' : '');

    return {
      o,
      lxp: s.lx + '%',
      lyp: s.ly + '%',
      heroClass: 'hero' + (s.tracking ? ' tracking' : ''),
      pillCls: o.pill,
      move: (e) => {
        const b = e.currentTarget.getBoundingClientRect();
        this.setState({ tracking: true, lx: Math.round(((e.clientX - b.left) / b.width) * 1000) / 10, ly: Math.round(((e.clientY - b.top) / b.height) * 1000) / 10 });
      },
      leave: () => this.setState({ tracking: false }),
      lenses: ORIG.map((x, i) => ({ cls: 'lens tr-' + x.id + (i === s.oi ? ' on' : '') })),
      heroBags: ORIG.map((x, i) => ({ cls: 'hbag' + (i === s.oi ? ' on' : ''), bagCls: 'bag tr-' + x.id, aria: 'Bolsa de ' + x.name, name: x.name, data: bagData(x) })),
      switches: ORIG.map((x, i) => ({
        name: x.name,
        meta: x.country + ' · ' + x.alt,
        on: i === s.oi,
        cls: 'sw' + (i === s.oi ? ' on' : ''),
        barCls: 'sw-bar' + (auto ? ' auto' : ''),
        pick: () => this.setState({ oi: i, paused: true })
      })),
      notesLoop: NOTES.concat(NOTES),
      shop: ORIG.map((x) => ({
        name: x.name,
        meta: x.country + ' · ' + x.alt,
        data: bagData(x),
        notes: x.notes.join(' · '),
        price: 'Desde ' + fmt(x.price),
        bagCls: 'bag tr-' + x.id,
        aria: 'Bolsa de ' + x.name,
        addLabel: 'Agregar ' + x.name + ' al carrito'
      })),
      qBg: step > 0 ? L.fondo : '#3A2A21',
      qInk: step > 0 ? L.ink : '#FBF8F3',
      qCircleCls: 'qcircle tr-' + L.id + (step > 0 ? ' on' : ''),
      qSize: (220 + step * 130) + 'px',
      qLead,
      qOpen: !done,
      qDone: done,
      qDots: QUIZ.map((x, i) => ({ cls: 'qdot' + (i < step ? ' on' : '') })),
      qStepTxt: 'Pregunta ' + Math.min(step + 1, QUIZ.length) + ' de ' + QUIZ.length,
      qTitle: q ? q.t : '',
      qOpts: q ? q.opts.map((op, i) => ({ label: op[0], sub: op[1], pick: () => this.setState((st) => ({ qa: st.qa.concat([i]) })) })) : [],
      qCanBack: step > 0 && !done,
      qBack: () => this.setState((st) => ({ qa: st.qa.slice(0, -1) })),
      qReset: () => this.setState({ qa: [] }),
      r,
      cBagWrap: 'cbag s' + s.sq,
      cBagCls: 'bag tr-' + co.id,
      cAria: 'Bolsa de ' + co.name + ', ' + qty.label,
      cName: co.name,
      cData: qty.label + ' · cada ' + s.sf + ' sem.',
      cSurprise: s.so < 0,
      cSurpriseCls: 'chip' + (s.so < 0 ? ' on' : ''),
      pickSurprise: () => this.setState({ so: -1 }),
      cDots: ORIG.map((x, i) => ({ cls: 'dot tr-' + x.id + (s.so === i ? ' on' : ''), label: x.name, on: s.so === i, pick: () => this.setState({ so: i }) })),
      cQty: QTY.map((x, i) => ({ label: x.label, on: s.sq === i, cls: 'chip' + (s.sq === i ? ' on' : ''), pick: () => this.setState({ sq: i }) })),
      cFreq: [2, 4].map((f) => ({ label: 'Cada ' + f + ' semanas', on: s.sf === f, cls: 'chip' + (s.sf === f ? ' on' : ''), pick: () => this.setState({ sf: f }) })),
      cPrice: fmt(qty.sub),
      cSave,
      noSubmit: (e) => e.preventDefault()
    };
  }

  render() {
    const { cAria, cBagCls, cBagWrap, cData, cDots, cFreq, cName, cPrice, cQty, cSave, cSurprise, cSurpriseCls, heroBags, heroClass, leave, lenses, lxp, lyp, move, noSubmit, notesLoop, o, pickSurprise, pillCls, qBack, qBg, qCanBack, qCircleCls, qDone, qDots, qInk, qLead, qOpen, qOpts, qReset, qSize, qStepTxt, qTitle, r, shop, switches } = this.renderVals();
    return (
      <div className="raiz" id="top">
        <section className={heroClass} style={{ backgroundColor: o.fondo, color: o.ink, "--lx": lxp, "--ly": lyp }} onPointerMove={move} onPointerLeave={leave} aria-label="Orígenes de esta semana">
          {lenses.map((l, i) => (
            <div key={i} className={l.cls} aria-hidden="true"></div>
          ))}
          <header className="hdr">
            <div className="wrap hdr-in">
              <a href="#top" className="logo-link" aria-label="Raíz Tostadores, inicio">
                <span className="logo"></span>
              </a>
              <nav className="nav" aria-label="Principal">
                <a href="./tienda/">Tienda</a>
                <a href="./suscripcion/">Suscripción</a>
                <a href="#quiz">Encontrá tu café</a>
                <a href="#ritmo">Cómo tostamos</a>
              </nav>
              <div className="hdr-r">
                <a href="./cuenta/" className="tlink hide-s">Mi cuenta</a>
                <a href="#carrito" className="tlink">Carrito<span className="cartn">0</span></a>
                <a href="./suscripcion/" className={`pill cta-s ${pillCls}`}>Suscribirme</a>
                <details className="mmenu">
                  <summary className="pill" aria-label="Abrir menú">Menú</summary>
                  <nav className="mmenu-panel" aria-label="Menú">
                    <a href="./tienda/">Tienda</a>
                    <a href="./suscripcion/">Suscripción</a>
                    <a href="./">Encontrá tu café</a>
                    <a href="./cuenta/">Mi cuenta</a>
                    <a href="#carrito">Carrito</a>
                  </nav>
                </details>
              </div>
            </div>
          </header>
          <div className="wrap hero-in">
            <div className="hero-copy">
              <p className="tag">Tostadores de café · Chacarita</p>
              <h1 className="h-hero serif">{"Lo que hay\ndebajo de\ncada taza."}</h1>
              <p className="lead">Café de especialidad de origen único, tostado cada lunes. Cada café tiene su paisaje: pasá el cursor y mirá qué hay debajo.</p>
              <div className="ctas">
                <a href="./suscripcion/" className={`pill ${pillCls}`}>Armar mi suscripción</a>
                <a href="#quiz" className="pill">Encontrá tu café</a>
              </div>
            </div>
            <div className="stage">
              {heroBags.map((b, i) => (
                <div key={i} className={b.cls}>
                  <div className={b.bagCls} role="img" aria-label={b.aria}>
                    <div className="blabel" aria-hidden="true">
                      <span className="logo"></span>
                      <hr />
                      <span className="bname">{texto(b.name)}</span>
                      <span className="bdata">{texto(b.data)}</span>
                    </div>
                  </div>
                  <div className="sticker" aria-hidden="true">Tostado<br />lun 5/10</div>
                </div>
              ))}
            </div>
          </div>
          <div className="switch">
            <div className="wrap">
              <div className="sw-row" role="tablist" aria-label="Elegí un origen">
                {switches.map((s, i) => (
                  <button key={i} className={s.cls} type="button" role="tab" aria-selected={s.on} onClick={s.pick}>
                    {s.on ? <span className={s.barCls}></span> : null}
                    <span className="sw-name">{texto(s.name)}</span>
                    <span className="sw-meta">{texto(s.meta)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
        <div className="marq" aria-hidden="true">
          <div className="marq-track">
            {notesLoop.map((n, i) => (
              <span key={i} className="marq-item">{texto(n)}<span className="leaf"></span></span>
            ))}
          </div>
        </div>
        <section className="sec" id="tienda">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <p className="eyebrow muted">La tanda de esta semana</p>
                <h2 className="h2 serif">{"Cinco orígenes,\nun mismo lunes."}</h2>
              </div>
              <a href="./tienda/" className="pill dark-outline">Ver toda la tienda</a>
            </div>
            <div className="shop-row">
              {shop.map((c, i) => (
                <article key={i} className="card">
                  <div className={c.bagCls} role="img" aria-label={c.aria}>
                    <div className="blabel" aria-hidden="true">
                      <span className="logo"></span>
                      <hr />
                      <span className="bname">{texto(c.name)}</span>
                      <span className="bdata">{texto(c.data)}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="c-name">
                      <a href="./ficha/" style={{ textDecoration: "none" }}>{texto(c.name)}</a>
                    </h3>
                    <span className="c-place">{texto(c.meta)}</span>
                    <p className="c-notes">{texto(c.notes)}</p>
                    <div className="c-foot">
                      <span className="c-price">{texto(c.price)}</span>
                      <button className="add" type="button" aria-label={c.addLabel}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
                          <path d="M9 3v12M3 9h12"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="quiz" id="quiz" style={{ backgroundColor: qBg, color: qInk }}>
          <div className={qCircleCls} style={{ width: qSize, height: qSize }} aria-hidden="true"></div>
          <div className="wrap sec quiz-in">
            <div className="quiz-copy">
              <p className="tag">Quiz · 1 minuto</p>
              <h2 className="h2 big serif">{"Encontrá\ntu café."}</h2>
              <p className="lead" aria-live="polite">{texto(qLead)}</p>
            </div>
            <div className="qcard">
              {qOpen ? <div className="qwrap">
                <div className="qdots">
                  {qDots.map((d, i) => (
                    <span key={i} className={d.cls}></span>
                  ))}
                </div>
                <p className="qstep">{texto(qStepTxt)}</p>
                <h3 className="qtitle">{texto(qTitle)}</h3>
                <div className="qopts">
                  {qOpts.map((op, i) => (
                    <button key={i} className="qopt" type="button" onClick={op.pick}>
                      <b>{texto(op.label)}</b>
                      <span>{texto(op.sub)}</span>
                    </button>
                  ))}
                </div>
                {qCanBack ? <button className="qback" type="button" onClick={qBack}>Volver a la pregunta anterior</button> : null}
              </div> : null}
              {qDone ? <div className="res">
                <div className="res-bag">
                  <div className={r.bagCls} role="img" aria-label={r.aria}>
                    <div className="blabel" aria-hidden="true">
                      <span className="logo"></span>
                      <hr />
                      <span className="bname">{texto(r.name)}</span>
                      <span className="bdata">{texto(r.data)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="qstep">Tu café ideal</p>
                  <div className="res-head">
                    <h3 className="qtitle">{texto(r.name)}</h3>
                    <span className="match">{texto(r.pct)}</span>
                  </div>
                  <p className="res-place">{texto(r.place)}</p>
                  <ul className="why">
                    {r.reasons.map((w, i) => (
                      <li key={i}><b>{texto(w.pre)}</b>{" → "}{texto(w.txt)}</li>
                    ))}
                  </ul>
                  <div className="ctas">
                    <a href="#suscripcion" className="pill solid" onClick={r.sub}>Suscribirme con este café</a>
                    <button className="qback" type="button" onClick={qReset}>Repetir el quiz</button>
                  </div>
                </div>
              </div> : null}
            </div>
          </div>
        </section>
        <section className="band" aria-label="Suscripción">
          <figure className="ph band-ph">
            <img src={tazaVentana} alt="Persona con una taza de café junto a una ventana, a la mañana" />
          </figure>
          <div className="band-txt">
            <p className="tag">Suscripción</p>
            <p className="band-q serif">El café llega cuando lo necesitás, no cuando te acordás.</p>
            <p className="lead" style={{ fontWeight: "500" }}>Elegís cada cuánto y nosotros nos ocupamos: tostamos el lunes y el miércoles está en tu casa.</p>
            <a href="./suscripcion/" className="pill light">Armar mi suscripción</a>
          </div>
        </section>
        <section className="sec" id="suscripcion">
          <div className="wrap sub-in">
            <div>
              <p className="eyebrow muted">Suscripción</p>
              <h2 className="h2 serif">{"Café que\nllega solo."}</h2>
              <ol className="steps">
                <li>
                  <span className="n">1</span>
                  <div>
                    <b>Elegí cantidad y frecuencia</b>
                    <span>Cada 2 o 4 semanas, molido a punto o en grano.</span>
                  </div>
                </li>
                <li>
                  <span className="n">2</span>
                  <div>
                    <b>Nosotros tostamos el lunes</b>
                    <span>Tu café sale de la tanda de esa semana, nunca de un estante.</span>
                  </div>
                </li>
                <li>
                  <span className="n">3</span>
                  <div>
                    <b>Lo manejás desde tu cuenta</b>
                    <span>Salteás un envío, cambiás de café o pausás. Sin permanencia.</span>
                  </div>
                </li>
              </ol>
            </div>
            <div className="calc">
              <div className="calc-stage">
                <div className={cBagWrap}>
                  <div className={cBagCls} role="img" aria-label={cAria}>
                    <div className="blabel" aria-hidden="true">
                      <span className="logo"></span>
                      <hr />
                      <span className="bname">{texto(cName)}</span>
                      <span className="bdata">{texto(cData)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="calc-ctrl">
                <div>
                  <p className="lbl">Café</p>
                  <div className="dots">
                    <button className={cSurpriseCls} type="button" aria-pressed={cSurprise} onClick={pickSurprise}>Sorprendeme</button>
                    {cDots.map((d, i) => (
                      <button key={i} className={d.cls} type="button" aria-label={d.label} aria-pressed={d.on} onClick={d.pick}></button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="lbl">Cantidad por envío</p>
                  <div className="seg">
                    {cQty.map((q, i) => (
                      <button key={i} className={q.cls} type="button" aria-pressed={q.on} onClick={q.pick}>{texto(q.label)}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="lbl">Frecuencia</p>
                  <div className="seg">
                    {cFreq.map((f, i) => (
                      <button key={i} className={f.cls} type="button" aria-pressed={f.on} onClick={f.pick}>{texto(f.label)}</button>
                    ))}
                  </div>
                </div>
                <div aria-live="polite">
                  <p className="price serif">{texto(cPrice)}</p>
                  <p className="save">{texto(cSave)}</p>
                </div>
                <a href="./suscripcion/" className="pill solid big">Armar mi suscripción</a>
              </div>
            </div>
          </div>
        </section>
        <section className="sec ritmo" id="ritmo">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <p className="eyebrow muted">Cómo trabajamos</p>
                <h2 className="h2 serif">Una tanda por semana.</h2>
              </div>
            </div>
            <div className="days">
              <div className="dayw">
                <figure className="ph day-ph">
                  <img src={tostadora} alt="Tostadora volcando café recién tostado en la bandeja de enfriado" />
                </figure>
                <div className="day">
                  <p className="dname serif">Lunes</p>
                  <p className="dtext">Tostamos solo lo que se pidió hasta el domingo. Nada espera en un estante.</p>
                </div>
              </div>
              <div className="dayw">
                <figure className="ph day-ph">
                  <img src={envasado} alt="Manos envasando café en grano en una bolsa" />
                </figure>
                <div className="day">
                  <p className="dname serif">Martes</p>
                  <p className="dtext">El café reposa un día y lo envasamos con su fecha de tueste.</p>
                </div>
              </div>
              <div className="dayw">
                <figure className="ph day-ph">
                  <img src={motoChacarita} alt="Moto de reparto en una calle empedrada de Chacarita" />
                </figure>
                <div className="day">
                  <p className="dname serif">Miércoles</p>
                  <p className="dtext">Sale en moto por CABA y por correo al resto del país.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className="foot">
          <div className="wrap foot-top">
            <div>
              <h2 className="h2 serif">{"Avisame cuando\nsalga la tanda."}</h2>
              <form className="news" onSubmit={noSubmit}>
                <label className="sr" htmlFor="mail-aviso">Tu mail</label>
                <input id="mail-aviso" type="email" placeholder="tu@mail.com" />
                <button className="pill light" type="submit">Avisame</button>
              </form>
            </div>
            <div className="fcols">
              <div>
                <p className="fh">Tienda</p>
                <a href="./tienda/">Cafés</a>
                <a href="#suscripcion">Suscripción</a>
                <a href="#quiz">Encontrá tu café</a>
              </div>
              <div>
                <p className="fh">Ayuda</p>
                <a href="#envios">Envíos</a>
                <a href="#moliendas">Moliendas</a>
                <a href="#contacto">Contacto</a>
              </div>
              <div>
                <p className="fh">Raíz</p>
                <a href="#ritmo">Cómo tostamos</a>
                <a href="#instagram">Instagram</a>
                <a href="#ritmo">Chacarita, CABA</a>
              </div>
            </div>
          </div>
          <div className="giant" aria-hidden="true">
            <span className="logo"></span>
          </div>
        </footer>
      </div>
    );
  }
}
