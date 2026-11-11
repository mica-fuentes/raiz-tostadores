// Inserta un valor calculado dentro de un texto, envuelto en un <span>.
//
// Claude Design renderiza cada {{valor}} así, y el CSS del diseño depende de eso:
// por ejemplo `.qopt span{font-size:14px}` también alcanza al <span> que queda dentro de
// `<b>{{op.label}}</b>`. Sin este envoltorio el sitio se vería distinto al diseño.
// Como en el original, null, undefined y booleanos no se muestran.
export function texto(valor) {
  if (valor === null || valor === undefined || typeof valor === 'boolean') return null;
  return <span>{String(valor)}</span>;
}
