// Raíz Tostadores · Armar suscripción
// Generado desde referencia/claude-design/Suscripcion.dc.html con herramientas/dc-a-react.js.
// La lógica (datos, estado y renderVals) es la del diseño, sin cambios; render() es su markup en JSX.
import React from 'react';
import { texto } from '../texto.jsx';

const ORIG = [
  { id: 'el-mirador', name: 'El Mirador', region: 'Huila', notes: 'Chocolate, manzana', fondo: '#A0583E', ink: '#FBF8F3', pill: 'light', fit: [0, 1] },
  { id: 'caparao', name: 'Caparaó', region: 'Minas Gerais', notes: 'Chocolate amargo', fondo: '#3A2A21', ink: '#FBF8F3', pill: 'light', fit: [0, 2] },
  { id: 'san-ignacio', name: 'San Ignacio', region: 'Cajamarca', notes: 'Nuez, miel', fondo: '#686B4D', ink: '#FBF8F3', pill: 'light', fit: [1, 2] },
  { id: 'buku', name: 'Buku', region: 'Guji', notes: 'Frutilla, jazmín', fondo: '#E4C7B9', ink: '#3A2A21', pill: 'solid', fit: [1] },
  { id: 'santa-cruz', name: 'Santa Cruz', region: 'Chiapas', notes: 'Cacao, frutos rojos', fondo: '#7C4450', ink: '#FBF8F3', pill: 'light', fit: [1] }
];
const METODOS = [['Espresso o moka', 'Molienda fina', 'espresso', 'molido para espresso'], ['Filtro: V60, Chemex, goteo', 'Molienda media', 'filtro', 'molido para filtro'], ['Prensa francesa', 'Molienda gruesa', 'prensa', 'molido para prensa'], ['Grano entero', 'Lo molés en casa', 'grano', 'en grano']];
const QTY = [['Para probar · 250 g', 'Ideal para conocernos', 11250, '250 g'], ['1 kg', 'Una taza por día, aprox.', 40500, '1 kg'], ['2 kg', 'Para casa con varios cafeteros', 81000, '2 kg']];
const ENVIOS = [['Moto en CABA', 'Llega 48 h después del tueste', 'Gratis'], ['Correo a todo el país', '3 a 5 días hábiles', '[COSTO]']];
const FECHAS = [['Lun 12/10', ['Lun 12', 'Mar 13', 'Mié 14']], ['Lun 19/10', ['Lun 19', 'Mar 20', 'Mié 21']]];
const PAGOS = [['Mercado Pago', 'Débito automático en cada envío'], ['Tarjeta de crédito o débito', 'Visa, Mastercard, Amex']];
const STEPS = ['Método', 'Cantidad y frecuencia', 'Tu café', 'Resumen y pago'];

export default class Suscripcion extends React.Component {
  constructor(props) {
    super(props);
    this.state = { step: 0, metodo: -1, qty: 1, freq: 4, choice: 'sur', pick: 0, envio: 0, fecha: 0, pago: 0, rot: 0, tracking: false, lx: 50, ly: 50 };
  }
  componentDidMount() {
    const rm = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!rm) this.iv = setInterval(() => { if (this.state.choice === 'sur' && this.state.step < 4) this.setState((s) => ({ rot: (s.rot + 1) % ORIG.length })); }, 2600);
  }
  componentWillUnmount() { clearInterval(this.iv); }
  renderVals() {
    const s = this.state;
    const fmt = (n) => '$' + n.toLocaleString('es-AR');
    const po = s.choice === 'yo' ? ORIG[s.pick] : ORIG[s.rot];
    const m = s.metodo >= 0 ? METODOS[s.metodo] : null;
    const q = QTY[s.qty];
    const go = (st) => this.setState({ step: st });
    const nextOff = s.step === 0 && s.metodo < 0;
    const tags = [];
    if (m) tags.push(m[3]);
    if (s.step >= 1) tags.push(q[3]);
    if (s.step >= 1) tags.push('cada ' + s.freq + ' semanas');
    const f = FECHAS[s.fecha][1];
    const radio = (on) => 'opt' + (on ? ' on' : '');
    return {
      showProg: s.step < 4,
      bars: STEPS.map((x, i) => ({ cls: i <= s.step ? 'on' : '' })),
      progTxt: s.step < 3 ? 'Paso ' + (s.step + 1) + ' de 3 · ' + STEPS[s.step] : 'Último paso · ' + STEPS[3],
      inFlow: s.step < 4,
      isDone: s.step === 4,
      s0: s.step === 0, s1: s.step === 1, s2: s.step === 2, s3: s.step === 3,
      po,
      panelCls: 'panel wander' + (s.tracking ? ' tracking' : ''),
      lx: s.lx + '%', ly: s.ly + '%',
      move: (e) => { const b = e.currentTarget.getBoundingClientRect(); this.setState({ tracking: true, lx: Math.round(((e.clientX - b.left) / b.width) * 100), ly: Math.round(((e.clientY - b.top) / b.height) * 100) }); },
      leave: () => this.setState({ tracking: false }),
      lenses: ORIG.map((x) => ({ cls: 'lens tr-' + x.id, op: x.id === po.id ? 1 : 0 })),
      bagWrap: 'bagw s' + (s.step >= 1 ? s.qty : 1),
      bagCls: 'bag bob tr-' + po.id,
      bagAria: 'Bolsa de ' + po.name,
      bagData: (s.step >= 1 ? q[3] : po.region) + (m ? ' · ' + m[2] : ''),
      ptags: tags,
      pnote: s.choice === 'sur' ? 'Con «Sorprendeme», cada envío es un origen distinto: lo ves rotar acá.' : po.name + ' · ' + po.notes.toLowerCase() + '.',
      metodos: METODOS.map((x, i) => ({ label: x[0], sub: x[1], on: s.metodo === i, cls: radio(s.metodo === i), pick: () => this.setState({ metodo: i }) })),
      qtys: QTY.map((x, i) => ({ label: x[0], sub: x[1], price: fmt(x[2]), on: s.qty === i, cls: radio(s.qty === i), pick: () => this.setState({ qty: i }) })),
      freqs: [2, 4].map((x) => ({ label: 'Cada ' + x + ' semanas', on: s.freq === x, cls: 'chip' + (s.freq === x ? ' on' : ''), pick: () => this.setState({ freq: x }) })),
      isSur: s.choice === 'sur', isYo: s.choice === 'yo',
      surCls: radio(s.choice === 'sur'), yoCls: radio(s.choice === 'yo'),
      pickSur: () => this.setState({ choice: 'sur' }),
      pickYo: () => this.setState({ choice: 'yo' }),
      metodoCorto: m ? m[2] : 'tu método',
      cafes: ORIG.map((x, i) => ({ name: x.name, notes: x.notes, img: 'pk-img tr-' + x.id, ideal: s.metodo >= 0 && s.metodo < 3 && x.fit.includes(s.metodo), on: s.pick === i, cls: 'pk' + (s.pick === i ? ' on' : ''), pick: () => this.setState({ pick: i }) })),
      sumRows: [
        { k: 'Café', v: s.choice === 'sur' ? 'Sorprendeme' : ORIG[s.pick].name, edit: () => go(2), aria: 'Editar café' },
        { k: 'Método', v: m ? m[2].charAt(0).toUpperCase() + m[2].slice(1) : '—', edit: () => go(0), aria: 'Editar método' },
        { k: 'Cantidad', v: q[3], edit: () => go(1), aria: 'Editar cantidad' },
        { k: 'Frecuencia', v: 'Cada ' + s.freq + ' semanas', edit: () => go(1), aria: 'Editar frecuencia' }
      ],
      price: fmt(q[2]),
      envios: ENVIOS.map((x, i) => ({ label: x[0], sub: x[1], price: x[2], on: s.envio === i, cls: radio(s.envio === i), pick: () => this.setState({ envio: i }) })),
      fechas: FECHAS.map((x, i) => ({ label: x[0], on: s.fecha === i, cls: 'chip' + (s.fecha === i ? ' on' : ''), pick: () => this.setState({ fecha: i }) })),
      pagos: PAGOS.map((x, i) => ({ label: x[0], sub: x[1], on: s.pago === i, cls: radio(s.pago === i), pick: () => this.setState({ pago: i }) })),
      canBack: s.step > 0, noBack: s.step === 0,
      back: () => this.setState((st) => ({ step: Math.max(0, st.step - 1) })),
      nextOff,
      nextCls: 'pill solid' + (nextOff ? ' off' : ''),
      nextTxt: s.step === 3 ? 'Confirmar · ' + fmt(q[2]) + ' por envío' : (s.step === 2 ? 'Ver resumen' : 'Siguiente'),
      next: () => { if (!nextOff) this.setState((st) => ({ step: Math.min(4, st.step + 1) })); },
      minis: ORIG.map((x, i) => ({ cls: 'bag tr-' + x.id, delay: (0.15 + i * 0.12) + 's', rot: [-8, 4, -3, 7, -5][i] + 'deg' })),
      doneTxt: 'Tostamos tu primer café el ' + f[0].toLowerCase() + ' y te llega el ' + f[2].toLowerCase() + '. Te mandamos todo por mail.',
      d1: f[0], d2: f[1], d3: f[2],
      doneCta: 'pill ' + po.pill
    };
  }

  render() {
    const { back, bagAria, bagCls, bagData, bagWrap, bars, cafes, canBack, d1, d2, d3, doneCta, doneTxt, envios, fechas, freqs, inFlow, isDone, isSur, isYo, leave, lenses, lx, ly, metodoCorto, metodos, minis, move, next, nextCls, nextOff, nextTxt, noBack, pagos, panelCls, pickSur, pickYo, pnote, po, price, progTxt, ptags, qtys, s0, s1, s2, s3, showProg, sumRows, surCls, yoCls } = this.renderVals();
    return (
      <div className="raiz">
        <header className="fhdr">
          <a href="../" className="logo-link" aria-label="Raíz Tostadores, inicio">
            <span className="logo"></span>
          </a>
          <div className="prog">
            {showProg ? <>
              <div className="prog-bars" aria-hidden="true">
                {bars.map((b, i) => (
                  <i key={i} className={b.cls}></i>
                ))}
              </div>
              <p className="prog-txt">{texto(progTxt)}</p>
            </> : null}
          </div>
          <a href="../" className="exit">{"Salir "}<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"></path></svg></a>
        </header>
        {inFlow ? <div className="flow">
          <aside className={panelCls} style={{ backgroundColor: po.fondo, color: po.ink, "--lx": lx, "--ly": ly }} onPointerMove={move} onPointerLeave={leave} aria-label="Tu suscripción">
            {lenses.map((l, i) => (
              <div key={i} className={l.cls} style={{ opacity: l.op, transition: "opacity .9s" }} aria-hidden="true"></div>
            ))}
            <div className={bagWrap}>
              <div className={bagCls} role="img" aria-label={bagAria}>
                <div className="blabel" aria-hidden="true">
                  <span className="logo"></span>
                  <hr />
                  <span className="bname">{texto(po.name)}</span>
                  <span className="bdata">{texto(bagData)}</span>
                </div>
              </div>
            </div>
            <div className="psum">
              {ptags.map((t, i) => (
                <span key={i} className="ptag">{texto(t)}</span>
              ))}
            </div>
            <p className="pnote">{texto(pnote)}</p>
          </aside>
          <div className="form">
            {s0 ? <div className="step">
              <h1 className="qh serif">¿Cómo preparás tu café?</h1>
              <p className="sub">Te lo mandamos molido a punto para ese método, o en grano.</p>
              <div className="opts" role="radiogroup" aria-label="Método">
                {metodos.map((m, i) => (
                  <button key={i} className={m.cls} type="button" role="radio" aria-checked={m.on} onClick={m.pick}>
                    <span className="radio"></span>
                    <span className="opt-t">
                      <b>{texto(m.label)}</b>
                      <span>{texto(m.sub)}</span>
                    </span>
                  </button>
                ))}
              </div>
              <a href="../" className="ulink" style={{ alignSelf: "flex-start" }}>¿No sabés qué elegir? Hacé el quiz en un minuto</a>
            </div> : null}
            {s1 ? <div className="step b">
              <h1 className="qh serif">¿Cuánto café y cada cuánto?</h1>
              <p className="sub">Precios con 10% off sobre la compra única.</p>
              <div className="opts" role="radiogroup" aria-label="Cantidad">
                {qtys.map((q, i) => (
                  <button key={i} className={q.cls} type="button" role="radio" aria-checked={q.on} onClick={q.pick}>
                    <span className="radio"></span>
                    <span className="opt-t">
                      <b>{texto(q.label)}</b>
                      <span>{texto(q.sub)}</span>
                    </span>
                    <span className="opt-p">{texto(q.price)}</span>
                  </button>
                ))}
              </div>
              <div>
                <p className="lbl">Frecuencia</p>
                <div className="seg">
                  {freqs.map((f, i) => (
                    <button key={i} className={f.cls} type="button" aria-pressed={f.on} onClick={f.pick}>{texto(f.label)}</button>
                  ))}
                </div>
              </div>
            </div> : null}
            {s2 ? <div className="step">
              <h1 className="qh serif">Elegí tu café.</h1>
              <div className="opts2" role="radiogroup" aria-label="Cómo elegir el café">
                <button className={surCls} type="button" role="radio" aria-checked={isSur} onClick={pickSur}>
                  <span className="radio"></span>
                  <span className="opt-t">
                    <b>Sorprendeme<span className="rec">Recomendado</span></b>
                    <span>Cada envío, un origen distinto. Te avisamos antes de tostar.</span>
                  </span>
                </button>
                <button className={yoCls} type="button" role="radio" aria-checked={isYo} onClick={pickYo}>
                  <span className="radio"></span>
                  <span className="opt-t">
                    <b>Elijo yo</b>
                    <span>Siempre el mismo café, lo cambiás cuando quieras.</span>
                  </span>
                </button>
              </div>
              {isYo ? <div className="picks">
                {cafes.map((c, i) => (
                  <button key={i} className={c.cls} type="button" aria-pressed={c.on} onClick={c.pick}>
                    <span className={c.img} aria-hidden="true"></span>
                    <b>{texto(c.name)}</b>
                    <span>{texto(c.notes)}</span>
                    {c.ideal ? <em>{"Ideal para "}{texto(metodoCorto)}</em> : null}
                  </button>
                ))}
              </div> : null}
            </div> : null}
            {s3 ? <div className="step b">
              <h1 className="qh serif">Revisá y confirmá.</h1>
              <div className="sumbox">
                {sumRows.map((r, i) => (
                  <div key={i} className="srow">
                    <span>{texto(r.k)}</span>
                    <b>{texto(r.v)}</b>
                    <button className="ulink" type="button" onClick={r.edit} aria-label={r.aria}>Editar</button>
                  </div>
                ))}
                <div className="stot">
                  <span>Por envío</span>
                  <b>{texto(price)}</b>
                </div>
              </div>
              <p className="sh">Envío</p>
              <div className="grid2">
                <div className="field">
                  <label htmlFor="dir">Dirección</label>
                  <input id="dir" type="text" placeholder="Calle y número" />
                </div>
                <div className="field">
                  <label htmlFor="cp">Código postal</label>
                  <input id="cp" type="text" placeholder="1427" />
                </div>
              </div>
              <div className="opts">
                {envios.map((e, i) => (
                  <button key={i} className={e.cls} type="button" role="radio" aria-checked={e.on} onClick={e.pick}>
                    <span className="radio"></span>
                    <span className="opt-t">
                      <b>{texto(e.label)}</b>
                      <span>{texto(e.sub)}</span>
                    </span>
                    <span className="opt-p">{texto(e.price)}</span>
                  </button>
                ))}
              </div>
              <p className="sh">Primer tueste</p>
              <div className="seg">
                {fechas.map((d, i) => (
                  <button key={i} className={d.cls} type="button" aria-pressed={d.on} onClick={d.pick}>{texto(d.label)}</button>
                ))}
              </div>
              <p className="sh">Pago</p>
              <div className="opts">
                {pagos.map((p, i) => (
                  <button key={i} className={p.cls} type="button" role="radio" aria-checked={p.on} onClick={p.pick}>
                    <span className="radio"></span>
                    <span className="opt-t">
                      <b>{texto(p.label)}</b>
                      <span>{texto(p.sub)}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div> : null}
            <div className="navrow">
              {canBack ? <button className="ulink" type="button" onClick={back}>← Atrás</button> : null}
              {noBack ? <span></span> : null}
              <button className={nextCls} type="button" aria-disabled={nextOff} onClick={next}>{texto(nextTxt)}</button>
            </div>
            {s3 ? <p className="fine">Sin permanencia: salteás, cambiás o pausás desde Mi cuenta.</p> : null}
          </div>
        </div> : null}
        {isDone ? <section className="done" style={{ backgroundColor: po.fondo, color: po.ink }}>
          <div className="done-in">
            <div className="drop" aria-hidden="true">
              {minis.map((m, i) => (
                <div key={i} className="mini" style={{ animationDelay: m.delay, "--r": m.rot }}>
                  <div className={m.cls}></div>
                </div>
              ))}
            </div>
            <p className="tag">Suscripción confirmada</p>
            <h1 className="h1 serif">{"Listo. Ya sos\nparte de la tanda."}</h1>
            <p className="lead">{texto(doneTxt)}</p>
            <div className="tl">
              <span className="tl-line" aria-hidden="true"></span>
              <div>
                <b>{texto(d1)}</b>
                <span>Tostamos tu café</span>
              </div>
              <div>
                <b>{texto(d2)}</b>
                <span>Reposa y se envasa</span>
              </div>
              <div>
                <b>{texto(d3)}</b>
                <span>Llega a tu casa</span>
              </div>
            </div>
            <div className="ctas" style={{ justifyContent: "center" }}>
              <a href="../cuenta/" className={doneCta}>Ir a mi suscripción</a>
              <a href="../tienda/" className="pill">Seguir mirando la tienda</a>
            </div>
          </div>
        </section> : null}
      </div>
    );
  }
}
