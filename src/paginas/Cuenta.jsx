// Raíz Tostadores · Mi suscripción
// Generado desde referencia/claude-design/Cuenta.dc.html con herramientas/dc-a-react.js.
// La lógica (datos, estado y renderVals) es la del diseño, sin cambios; render() es su markup en JSX.
import React from 'react';
import { texto } from '../texto.jsx';

const ORIG = [
  { id: 'el-mirador', name: 'El Mirador', region: 'Huila', alt: '1700 m', notes: 'chocolate con leche y manzana roja', fondo: '#A0583E', ink: '#FBF8F3' },
  { id: 'caparao', name: 'Caparaó', region: 'Minas Gerais', alt: '1200 m', notes: 'chocolate amargo y avellanas', fondo: '#3A2A21', ink: '#FBF8F3' },
  { id: 'san-ignacio', name: 'San Ignacio', region: 'Cajamarca', alt: '1600 m', notes: 'nuez, miel y notas florales', fondo: '#686B4D', ink: '#FBF8F3' },
  { id: 'buku', name: 'Buku', region: 'Guji', alt: '2000 m', notes: 'frutilla, jazmín y arándanos', fondo: '#E4C7B9', ink: '#3A2A21' },
  { id: 'santa-cruz', name: 'Santa Cruz', region: 'Chiapas', alt: '1500 m', notes: 'cacao, frutos rojos y vino', fondo: '#7C4450', ink: '#FBF8F3' }
];
const TRIED = { 'el-mirador': 'Probado en julio', 'buku': 'Probado en septiembre', 'santa-cruz': 'Probado en agosto' };

export default class Cuenta extends React.Component {
  constructor(props) {
    super(props);
    this.state = { next: 2, paused: false, skipped: false, picking: false, tracking: false, lx: 50, ly: 50, toastOn: false, toast: '' };
  }
  componentWillUnmount() { clearTimeout(this.tt); }
  say(t) {
    clearTimeout(this.tt);
    this.setState({ toastOn: true, toast: t });
    this.tt = setTimeout(() => this.setState({ toastOn: false }), 2600);
  }
  renderVals() {
    const s = this.state;
    const c = ORIG[s.next];
    const tried = Object.keys(TRIED).length;
    return {
      c,
      statusCls: 'status' + (s.paused ? ' paused' : ''),
      mediaCls: 'smedia wander' + (s.tracking ? ' tracking' : ''),
      lx: s.lx + '%', ly: s.ly + '%',
      move: (e) => { const b = e.currentTarget.getBoundingClientRect(); this.setState({ tracking: true, lx: Math.round(((e.clientX - b.left) / b.width) * 100), ly: Math.round(((e.clientY - b.top) / b.height) * 100) }); },
      leave: () => this.setState({ tracking: false }),
      lenses: ORIG.map((x, i) => ({ cls: 'lens tr-' + x.id, op: i === s.next ? 1 : 0 })),
      bagCls: 'bag bob tr-' + c.id,
      bagAria: 'Bolsa de ' + c.name,
      isNew: !TRIED[c.id],
      badgeCls: 'badge' + (s.paused ? ' off' : ''),
      badgeTxt: s.paused ? 'Pausada' : 'Activa',
      active: !s.paused,
      paused: s.paused,
      nextLbl: s.paused ? 'Tu suscripción está en pausa' : 'Próximo envío · ' + c.name,
      nextDate: s.paused ? 'Sin envíos' : (s.skipped ? 'Miércoles 11/11' : 'Miércoles 14/10'),
      detail: s.paused ? 'No te cobramos nada mientras esté pausada. La reanudás cuando quieras y entra en la tanda siguiente.' : c.name + ' (' + c.region + ', ' + c.alt + '): ' + c.notes + '. 1 kg molido para filtro, $40.500.',
      ringOff: (301.6 * (s.skipped ? 0.59 : 0.18)).toFixed(1),
      ringTxt: s.skipped ? 'Tostamos en 33 días' : 'Tostamos en 5 días',
      ringSub: s.skipped ? 'Salteaste el envío de octubre' : 'Lunes 12/10, en la tanda de esa semana',
      skipTxt: s.skipped ? 'Deshacer salteo' : 'Saltear este envío',
      toggleSkip: () => { const k = !s.skipped; this.setState({ skipped: k }); this.say(k ? 'Salteaste el envío del 14/10' : 'Volvimos a agendar el 14/10'); },
      picking: s.picking,
      togglePick: () => this.setState((st) => ({ picking: !st.picking })),
      togglePause: () => { const k = !s.paused; this.setState({ paused: k, picking: false }); this.say(k ? 'Pausaste tu suscripción' : 'Tu suscripción está activa de nuevo'); },
      dots: ORIG.map((x, i) => ({ cls: 'dot tr-' + x.id + (s.next === i ? ' on' : ''), label: x.name, on: s.next === i, pick: () => { this.setState({ next: i }); this.say('Tu próximo café es ' + x.name); } })),
      mapaTitle: 'Probaste ' + tried + ' de ' + ORIG.length + ' orígenes.',
      mapaPct: Math.round((tried / ORIG.length) * 100) + '%',
      mapa: ORIG.map((x, i) => ({
        cls: 'tile' + (TRIED[x.id] ? '' : ' no'),
        bagCls: 'bag tr-' + x.id,
        aria: 'Bolsa de ' + x.name + (TRIED[x.id] ? ', probado' : ', todavía no probado'),
        name: x.name,
        data: x.region + ' · ' + x.alt,
        when: TRIED[x.id] || (s.next === i ? 'Llega en tu próximo envío' : 'Todavía no'),
        can: !TRIED[x.id] && s.next !== i,
        pick: () => { this.setState({ next: i, paused: false }); this.say(x.name + ' llega en tu próximo envío'); }
      })),
      toastCls: 'toast' + (s.toastOn ? ' on' : ''),
      toastTxt: s.toast,
      noSubmit: (e) => e.preventDefault()
    };
  }

  render() {
    const { active, badgeCls, badgeTxt, bagAria, bagCls, c, detail, dots, isNew, leave, lenses, lx, ly, mapa, mapaPct, mapaTitle, mediaCls, move, nextDate, nextLbl, noSubmit, paused, picking, ringOff, ringSub, ringTxt, skipTxt, statusCls, toastCls, toastTxt, togglePause, togglePick, toggleSkip } = this.renderVals();
    return (
      <div className="raiz">
        <header className="hdr static">
          <div className="wrap hdr-in">
            <a href="../" className="logo-link" aria-label="Raíz Tostadores, inicio">
              <span className="logo"></span>
            </a>
            <nav className="nav" aria-label="Principal">
              <a href="../tienda/">Tienda</a>
              <a href="../suscripcion/">Suscripción</a>
              <a href="../">Encontrá tu café</a>
              <a href="../">Cómo tostamos</a>
            </nav>
            <div className="hdr-r">
              <a href="../cuenta/" className="tlink hide-s" aria-current="page">Mi cuenta</a>
              <a href="#carrito" className="tlink">Carrito<span className="cartn">0</span></a>
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
        <div className="wrap">
          <div className="top">
            <h1 className="h1 serif">Hola, Mica.</h1>
            <nav className="acc-nav" aria-label="Tu cuenta">
              <a href="#sus" className="chip on" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>Mi suscripción</a>
              <a href="#hist" className="chip" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>Pedidos</a>
              <a href="#datos" className="chip" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>Dirección y pago</a>
            </nav>
          </div>
          <section className={statusCls} id="sus" aria-label="Tu suscripción">
            <div className={mediaCls} style={{ backgroundColor: c.fondo, color: c.ink, "--lx": lx, "--ly": ly }} onPointerMove={move} onPointerLeave={leave}>
              {lenses.map((l, i) => (
                <div key={i} className={l.cls} style={{ opacity: l.op, transition: "opacity .9s" }} aria-hidden="true"></div>
              ))}
              <div className="sbag">
                <div className={bagCls} role="img" aria-label={bagAria}>
                  <div className="blabel" aria-hidden="true">
                    <span className="logo"></span>
                    <hr />
                    <span className="bname">{texto(c.name)}</span>
                    <span className="bdata">1 kg · filtro</span>
                  </div>
                </div>
                {isNew ? <div className="sticker new" aria-hidden="true">Nuevo<br />para vos</div> : null}
              </div>
            </div>
            <div className="sinfo">
              <div className="st-row">
                <span className={badgeCls}><i></i>{texto(badgeTxt)}</span>
                <span className="cancel">Suscripción desde julio · cada 4 semanas</span>
              </div>
              <div>
                <p className="nextlbl">{texto(nextLbl)}</p>
                <p className="nextdate serif" aria-live="polite">{texto(nextDate)}</p>
              </div>
              <p className="sdet">{texto(detail)}</p>
              {active ? <div className="ringrow">
                <svg className="ring" viewBox="0 0 110 110" aria-hidden="true">
                  <circle cx="55" cy="55" r="48" fill="none" stroke="#E3D8CA" strokeWidth="8"></circle>
                  <circle className="ring-fg" cx="55" cy="55" r="48" fill="none" stroke="#A95F44" strokeWidth="8" strokeLinecap="round" style={{ "--off": ringOff }}></circle>
                </svg>
                <div>
                  <b>{texto(ringTxt)}</b>
                  <span>{texto(ringSub)}</span>
                </div>
              </div> : null}
              <div className="actions">
                {active ? <>
                  <button className="pill" type="button" onClick={toggleSkip}>{texto(skipTxt)}</button>
                  <button className="pill" type="button" aria-expanded={picking} onClick={togglePick}>Cambiar café</button>
                  <button className="pill" type="button" onClick={togglePause}>Pausar</button>
                </> : null}
                {paused ? <button className="pill solid" type="button" onClick={togglePause}>Reanudar suscripción</button> : null}
              </div>
              {picking ? <div className="picker">
                <p>Próximo envío:</p>
                {dots.map((d, i) => (
                  <button key={i} className={d.cls} type="button" aria-label={d.label} aria-pressed={d.on} onClick={d.pick}></button>
                ))}
              </div> : null}
              <a href="#cancelar" className="cancel">Cancelar suscripción</a>
            </div>
          </section>
          <section className="sec" aria-labelledby="mapa-t">
            <div className="mapa-head">
              <div>
                <p className="eyebrow muted">Tu mapa de orígenes</p>
                <h2 className="h2 serif" id="mapa-t">{texto(mapaTitle)}</h2>
                <div className="mbar" aria-hidden="true">
                  <i style={{ width: mapaPct }}></i>
                </div>
              </div>
              <p className="lead" style={{ fontWeight: "500", maxWidth: "24em" }}>Cada bolsa que probás se pinta. Las que faltan las podés pedir para el próximo envío.</p>
            </div>
            <div className="mapa">
              {mapa.map((t, i) => (
                <div key={i} className={t.cls}>
                  <div className={t.bagCls} role="img" aria-label={t.aria}>
                    <div className="blabel" aria-hidden="true">
                      <span className="logo"></span>
                      <hr />
                      <span className="bname">{texto(t.name)}</span>
                      <span className="bdata">{texto(t.data)}</span>
                    </div>
                  </div>
                  <div>
                    <b>{texto(t.name)}</b>
                    <br />
                    <span>{texto(t.when)}</span>
                  </div>
                  {t.can ? <button className="ulink" type="button" onClick={t.pick}>Pedir en el próximo envío</button> : null}
                </div>
              ))}
            </div>
          </section>
          <section id="hist" aria-labelledby="hist-t" style={{ paddingBottom: "40px" }}>
            <p className="eyebrow muted" id="hist-t">Pedidos</p>
            <table className="hist">
              <thead>
                <tr>
                  <th scope="col">Fecha</th>
                  <th scope="col">Café</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>16 sep</td>
                  <td><span className="sw tr-buku" aria-hidden="true"></span>Buku</td>
                  <td>1 kg</td>
                  <td>Entregado</td>
                </tr>
                <tr>
                  <td>19 ago</td>
                  <td><span className="sw tr-santa-cruz" aria-hidden="true"></span>Santa Cruz</td>
                  <td>1 kg</td>
                  <td>Entregado</td>
                </tr>
                <tr>
                  <td>22 jul</td>
                  <td><span className="sw tr-el-mirador" aria-hidden="true"></span>El Mirador</td>
                  <td>1 kg</td>
                  <td>Entregado</td>
                </tr>
              </tbody>
            </table>
            <div className="datos" id="datos">
              <div className="dato">
                <div>
                  <p className="nextlbl">Envío</p>
                  <p>Av. Dorrego 1234, Chacarita · moto</p>
                </div>
                <a href="#editar-envio" className="ulink">Editar</a>
              </div>
              <div className="dato">
                <div>
                  <p className="nextlbl">Pago</p>
                  <p>Mercado Pago · débito por envío</p>
                </div>
                <a href="#editar-pago" className="ulink">Editar</a>
              </div>
            </div>
          </section>
        </div>
        <div style={{ height: "80px" }}></div>
        <footer className="foot">
          <div className="wrap foot-top">
            <div>
              <h2 className="h2 serif">{"Avisame cuando\nsalga la tanda."}</h2>
              <form className="news" onSubmit={noSubmit}>
                <label className="sr" htmlFor="mail-c">Tu mail</label>
                <input id="mail-c" type="email" placeholder="tu@mail.com" />
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
