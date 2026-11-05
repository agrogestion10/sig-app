// SIG · Portal, Panel de control, Liquidación laboral, Crédito interno y Certificaciones
'use strict';

Object.assign(CFG_TEXTO, {
  CREDITO_TASA_ANUAL: 'Crédito: tasa de interés anual (%)', CREDITO_PLAZO_MAX_MESES: 'Crédito: plazo máximo (meses)', CREDITO_MONTO_MAX: 'Crédito: monto máximo por productor (L)',
  CREDITO_MORA_PCT_MENSUAL: 'Crédito: recargo por mora (% mensual sobre lo atrasado)', CREDITO_GERENCIA_HASTA: 'Crédito: gerencia aprueba hasta (L); arriba, el comité',
  CREDITO_APROBACION_MODO: 'Crédito: quién aprueba (Gerencia / Gerencia hasta monto / Comité)', COMITE_VOTOS_MINIMOS: 'Comité de crédito: votos a favor para aprobar (vacío = mayoría)',
  CREDITO_DESTINOS: 'Crédito: destinos (uno por renglón)', PRIMA_FT_USD_LB: 'Prima de Comercio Justo (USD por libra)', PRIMA_PCT_PRODUCTIVIDAD: 'Prima: % mínimo para productividad y calidad',
  RENDIMIENTO_PERGAMINO_ORO: 'Rendimiento de pergamino seco a oro (0.8 = 80 %)', FACTOR_CAFE_UVA: 'Factor de café uva a pergamino seco', FACTOR_CAFE_PERGAMINO_HUMEDO: 'Factor de pergamino húmedo a seco',
  HUMEDAD_MAXIMA: 'Humedad máxima aceptada (%)', QUEJAS_DIAS_RESPUESTA: 'Quejas: días para responder', QUEJAS_DIAS_URGENTE: 'Quejas urgentes: días para responder',
  KOBO_ENLACES: 'Formularios de Kobo (uno por renglón: Nombre | enlace)',
  KOBO_SERVIDOR: 'Servidor de KoboToolbox', KOBO_PADRON: 'Kobo: código del formulario «Padrón»', KOBO_INSPECCION: 'Kobo: código del formulario «Inspección interna»',
  KOBO_ACOPIO: 'Kobo: código del formulario «Acopio»', KOBO_CAPACITACION: 'Kobo: código del formulario «Capacitación»', KOBO_BENEFICIADO: 'Kobo: código del formulario «Beneficiado»',
  KOBO_DESPACHO: 'Kobo: código del formulario «Despacho y venta»', KOBO_PRIMA: 'Kobo: código del formulario «Uso de la prima»', KOBO_SEGUIMIENTO: 'Kobo: código del formulario «Seguimiento de NC»',
  KOBO_QUEJAS: 'Kobo: código del formulario «Quejas»', KOBO_EVALUACION: 'Kobo: código del formulario «Evaluación de inspector»',
  TIPO_CAMBIO: 'Tipo de cambio (lempiras por dólar)', TOLERANCIA_ESTIMADO: 'Diferencia aceptada entre estimado y entregas (%)', COSECHA_INICIO_MES: 'Mes en que empieza la cosecha (10 = octubre)', MESES_TRANSICION: 'Meses de transición orgánica después de un producto prohibido',
  CREDITO_MORA_PCT_MENSUAL: 'Crédito: mora (% mensual sobre lo atrasado)', CREDITO_DIAS_GRACIA: 'Crédito: días de gracia antes de cobrar mora',
  CREDITO_PRECIO_QQ_REF: 'Crédito: precio de referencia por quintal para la capacidad de pago (vacío = promedio del acopio)', CREDITO_PCT_CAPACIDAD: 'Crédito: % del ingreso de la cosecha que puede ir a pagar deudas',
  CREDITO_PROVISION: 'Crédito: provisión por días de atraso (un renglón por tramo: días: %)', CREDITO_DIAS_RECORDATORIO: 'Crédito: avisar las cuotas que vencen en los próximos días',
  HUMEDAD_BASE_ACOPIO: 'Acopio: humedad base; arriba de esta se descuenta (%)', DESCUENTO_PUNTO_HUMEDAD: 'Acopio: % de descuento por cada punto de humedad arriba de la base',
  SOBREPRECIO_ORGANICO_LB: 'Acopio: sobreprecio orgánico (L por libra)', SOBREPRECIO_FT_LB: 'Acopio: sobreprecio Comercio Justo (L por libra)',
  RETENCION_CREDITO_PCT: 'Acopio: % de cada entrega que se descuenta para el crédito interno (0 = solo si se escribe)', BODEGAS: 'Bodegas o centros de acopio (una por renglón)', BASCULA_DIAS_AVISO: 'Avisar cuántos días antes de que venza la calibración de una báscula',
  DOCUMENTOS_DIAS_AVISO: 'Avisar cuántos días antes de que venza un documento del productor',
  INSUMOS_PROHIBIDOS: 'Insumos prohibidos para orgánico (uno por renglón)', INSUMOS_PERMITIDOS: 'Insumos permitidos (uno por renglón)',
  CULTIVO_ACOPIO: 'Cultivo que acopia la organización', FACTOR_CACAO_BABA: 'Factor de cacao en baba a cacao seco (0.35 = 35 %)', CACAO_HUMEDAD_BASE: 'Cacao: humedad base; arriba de esta se descuenta (%)',
  CACAO_FERMENTADO_MIN: 'Cacao: mínimo de granos bien fermentados en la prueba de corte (%)', CACAO_MOHO_MAX: 'Cacao: máximo de granos con moho en la prueba de corte (%)', PRIMA_FT_CACAO_USD_LB: 'Prima de Comercio Justo del cacao (USD por libra de cacao seco)',
  CORREO_AVISOS: 'Correo que recibe los avisos (separar varios con coma)', QUEJAS_CORREO: 'Correo del comité de quejas (si es distinto)'
});

const SEC = { cre: 'Crédito interno', cer: 'Certificaciones', adm: 'Administración' };
['credito', 'creditos', 'cred', 'cartera', 'condiciones', 'edocta', 'recordatorios', 'fondos', 'reportescre'].forEach(r => SECCION_DE[r] = 'cre');
['padron', 'prod', 'prodf', 'parcela', 'inspeccion', 'insp', 'inspecciones', 'nc', 'acopio', 'acopios', 'despacho', 'balance', 'prima', 'reg', 'quejas', 'queja', 'catalogo', 'kobo', 'eudr', 'insumos', 'lotes', 'lote', 'recibo', 'inventario', 'basculas', 'actas', 'asistencia', 'paquete'].forEach(r => SECCION_DE[r] = 'cer');
SECCION_DE.panel = ''; SECCION_DE.bandeja = '';

const tarjeta = (h, b, s, n) => `<a class="tarjeta" href="${h}">${n ? `<span class="num">${n}</span>` : ''}<b>${b}</b><span>${s}</span></a>`;
const cuenta = async (tabla, filtro) => { let x = sb.from(tabla).select('id', { count: 'exact', head: true }).eq('org_id', S.org.id); if (filtro) x = filtro(x); const r = await x; return r.count || 0; };
const cfgN = (k, d) => num(S.cfg[k] ?? d) || d;
const nombreUsuario = () => S.maestro ? 'Usuario maestro' : S.perfil.nombre;
const diasEntre = (a, b) => Math.round((new Date(b + 'T12:00') - new Date(a + 'T12:00')) / 864e5);
const sumarMeses = (f, m) => { const d = new Date(f + 'T12:00'); const dia = d.getDate(); d.setMonth(d.getMonth() + m); if (d.getDate() < dia) d.setDate(0); return d.toISOString().slice(0, 10); };

// ---------- catálogos en memoria (productores y certificaciones) ----------
async function prods(refrescar) {
  if (!refrescar && S._prods?.org === S.org.id) return S._prods.lista;
  const lista = await q(sb.from('productores').select('id,codigo,nombre,comunidad,certificaciones,estado_cert,activo,cultivo').eq('org_id', S.org.id).order('nombre'));
  S._prods = { org: S.org.id, lista }; return lista;
}
// Todas las parcelas de la organización de una vez (así quedan guardadas para trabajar sin señal)
async function parcelasOrg(refrescar) {
  if (!refrescar && S._parcs?.org === S.org.id && Date.now() - S._parcs.t < 120000) return S._parcs.lista;
  const lista = await q(sb.from('parcelas').select('id,productor_id,nombre,area_ha,datos,lat,lon,poligono').eq('org_id', S.org.id).order('nombre').limit(20000));
  S._parcs = { org: S.org.id, lista, t: Date.now() }; return lista;
}
const basculasActivas = () => q(sb.from('basculas').select('id,nombre,bodega,vence').eq('org_id', S.org.id).eq('activa', true).order('nombre')).catch(() => []);
const nuevoId = () => (crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); }));
async function certs(todas) {
  if (S._certs?.org !== S.org.id) S._certs = { org: S.org.id, lista: await q(sb.from('catalogo_cert').select('*').eq('org_id', S.org.id).order('orden')) };
  return todas ? S._certs.lista : S._certs.lista.filter(c => c.activa);
}
const nombreCert = c => S._certs?.lista.find(x => x.codigo === c)?.nombre || c || 'Convencional';
const etiquetaProd = p => `${p.nombre}${p.codigo ? ' (' + p.codigo + ')' : ''}${p.comunidad ? ' · ' + p.comunidad : ''}`;
function campoProd(lista, sel, nombre = 'productor') {
  const id = 'dl' + Math.random().toString(36).slice(2, 8), act = lista.find(p => p.id === sel);
  return `<input name="${nombre}_txt" list="${id}" required placeholder="Escribí el nombre o código" value="${esc(act ? etiquetaProd(act) : '')}" autocomplete="off"><datalist id="${id}">${lista.filter(p => p.activo).map(p => `<option value="${esc(etiquetaProd(p))}">`).join('')}</datalist>`;
}
const leerProd = (lista, txt) => lista.find(p => etiquetaProd(p) === txt) || lista.find(p => norm(p.nombre) === norm(txt)) || lista.find(p => p.codigo && norm(p.codigo) === norm(txt));
const checksCert = (lista, marcadas = [], nombre = 'certs') => `<div class="rejilla" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:4px 12px">${lista.map(c => `<label style="font-weight:400;color:var(--texto);display:flex;gap:6px;align-items:center"><input type="checkbox" name="${nombre}" value="${esc(c.codigo)}" style="width:auto" ${marcadas.includes(c.codigo) ? 'checked' : ''}>${esc(c.nombre)}</label>`).join('')}</div>`;
const leerChecks = (f, nombre = 'certs') => [...f.querySelectorAll(`input[name="${nombre}"]:checked`)].map(x => x.value);
const estadoChip = (t, clase) => `<span class="estado e-${clase || t}">${esc(t)}</span>`;

// =====================================================================
// PORTAL
// =====================================================================
// Aviso de privacidad y términos de uso: el administrador de cada organización acepta la versión vigente (/privacidad.html)
const TERMINOS_VERSION = '2026-11-04';
async function revisarTerminos() {
  if (!esAdmin() || S.org.es_maestra || S.sinSenal) return;
  const { data: o } = await sb.from('organizaciones').select('terminos_version').eq('id', S.org.id).maybeSingle();
  if (!o || o.terminos_version === TERMINOS_VERSION || !$('.saludo')) return;
  $('.saludo').insertAdjacentHTML('afterend', `<div class="caja" id="terminos" style="border:2px solid var(--ambar)"><h2 style="margin-top:0">${o.terminos_version ? 'Cambió el aviso de privacidad' : 'Antes de empezar: aviso de privacidad y términos de uso'}</h2>
    <p>El sistema guarda datos de los productores (identidad, teléfono, ubicación de las fincas, entregas y créditos). El aviso explica de quién son esos datos, para qué se usan, quién los ve y qué le toca a ${esc(S.org.nombre)} y a AgroGestión. Como administrador, te toca revisarlo y aceptarlo en nombre de la organización.</p>
    <p><a href="/privacidad.html" target="_blank" rel="noopener">Leer el aviso de privacidad y los términos de uso</a></p>
    <label style="display:flex;gap:8px;align-items:flex-start;font-weight:400"><input type="checkbox" id="tAcepto" style="width:auto;margin-top:4px">Leí el aviso y lo acepto en nombre de ${esc(S.org.nombre)}. La organización informará a sus productores y contará con su autorización.</label>
    <div class="acciones"><button id="tBtn" disabled>Aceptar</button></div></div>`);
  $('#tAcepto').onchange = e => $('#tBtn').disabled = !e.target.checked;
  $('#tBtn').onclick = async () => {
    try { await q(sb.rpc('aceptar_terminos', { o: S.org.id, v: TERMINOS_VERSION })); $('#terminos').remove(); aviso('Listo, quedó aceptado. Se guardó en la bitácora.'); }
    catch (e) { aviso(falla(e), true); }
  };
}
RUTAS[''] = async function portal() {
  S.seccion = '';
  const adm = puedeSec('adm'), cre = puedeSec('cre'), cer = puedeSec('cer'), jefe = esJefe();
  const hora = +new Date().toLocaleString('en-US', { timeZone: 'America/Tegucigalpa', hour: 'numeric', hour12: false });
  const saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches';
  const nombre = S.maestro ? '' : (S.perfil?.nombre || '').trim().split(/\s+/)[0];
  const fechaLarga = new Date().toLocaleDateString('es-HN', { timeZone: 'America/Tegucigalpa', weekday: 'long', day: 'numeric', month: 'long' });
  const ic = {
    adm: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
    cre: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .9-3 2s1.3 1.7 3 2 3 .9 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6v2M12 16v2"/></svg>',
    cer: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 19c0-8 6-13 15-13-1 9-6 14-13 14"/><path d="M8 17c2.5-4 5.5-7 9-9"/></svg>',
    mas: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    lupa: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>'
  };
  const rap = [
    cer && ['#/acopio', 'Registrar acopio'], adm && ['#/compra', 'Nueva solicitud'], cer && ['#/inspeccion', 'Nueva inspección'],
    cre && jefe && ['#/cartera', 'Registrar pago de crédito'], cre && !jefe && ['#/credito', 'Solicitud de crédito']
  ].filter(Boolean);
  app().innerHTML = `<div class="saludo"><div><h1>${saludo}${nombre ? ', ' + esc(nombre) : ''}</h1><p class="nota">${esc(fechaLarga.charAt(0).toUpperCase() + fechaLarga.slice(1))} · ${esc(S.org.nombre)}</p></div>
    <form role="search" class="buscador" id="fBus"><label for="bus" class="oculto">Buscar</label>${ic.lupa}<input id="bus" type="search" autocomplete="off" placeholder="Buscar productor, recibo, crédito o solicitud"><div id="busRes" class="busRes" hidden></div></form></div>
  ${(adm || cre || cer) ? `<section class="caja pendientes" aria-labelledby="hoyT"><div class="filaT"><h2 id="hoyT">Para atender hoy</h2><span class="nota" id="hoyN">Revisando…</span></div><ul id="hoyL"></ul></section>` : ''}
  ${rap.length ? `<section aria-labelledby="rapT"><h2 id="rapT">Accesos rápidos</h2><div class="rapidos">${rap.map(([h, t], i) => `<a href="${h}" class="boton${i ? ' sec' : ''}">${ic.mas}${t}</a>`).join('')}</div></section>` : ''}
  <section aria-labelledby="secT"><h2 id="secT">Secciones</h2><div class="secciones">
    ${adm ? `<a href="#/adm" class="seccionT"><span class="icono">${ic.adm}</span><b>Administración</b><span class="nota">Compras, fondos, facturas, vacaciones y presupuesto</span><span class="estadoSec" id="eadm"></span></a>` : ''}
    ${cre ? `<a href="#/cre" class="seccionT"><span class="icono">${ic.cre}</span><b>Crédito interno</b><span class="nota">De la solicitud del productor al desembolso y la recuperación</span><span class="estadoSec" id="ecre"></span></a>` : ''}
    ${cer ? `<a href="#/cer" class="seccionT"><span class="icono">${ic.cer}</span><b>Certificaciones</b><span class="nota">Padrón, inspecciones, acopio, balance de masas y prima</span><span class="estadoSec" id="ecer"></span></a>` : ''}
    ${!adm && !cre && !cer ? '<div class="caja">Todavía no tenés secciones habilitadas. Pedile al administrador que te las active.</div>' : ''}
  </div></section>
  ${jefe && (cre || cer) ? `<section aria-labelledby="numT"><div class="filaT"><h2 id="numT">Hoy en números</h2><span class="nota">Solo lo ve gerencia · el detalle está en cada panel</span></div><div class="numeros" id="nums"></div></section>` : ''}
  <footer class="pieEstado" id="pieE"></footer>`;

  revisarTerminos();
  // Pie: señal, Kobo y versión
  const pie = () => { const el = $('#pieE'); if (!el) return; const n = OFF.cola().length, sin = !navigator.onLine || S.sinSenal, k = S.cfg.KOBO_ULTIMA_SINC ? Date.parse(S.cfg.KOBO_ULTIMA_SINC) : 0, m = k ? Math.round((Date.now() - k) / 60000) : null;
    el.innerHTML = `<span><i class="punto ${sin ? 'p-ambar' : 'p-verde'}"></i>${sin ? 'Sin señal' : 'Con señal'}${n ? ` · <a href="#/bandeja">${n} por enviar</a>` : ' · nada por enviar'}</span>${cer && m !== null ? `<span>Kobo: actualizado ${m < 1 ? 'hace un momento' : m < 60 ? `hace ${m} min` : m < 1440 ? `hace ${Math.round(m / 60)} h` : 'el ' + fechaHora(k)}</span>` : ''}<span>Versión ${window.SIG_V || 2} · <a href="#/guia">Guía de uso</a> · <a href="/privacidad.html" target="_blank" rel="noopener">Privacidad</a></span>`; };
  pie();

  // Buscador: productores en memoria y números de documento
  const bus = $('#bus'), res = $('#busRes'); let t0;
  const buscar = async () => {
    const v = bus.value.trim(); if (v.length < 2) { res.hidden = true; return; }
    const items = [];
    if (cre || cer) (await prods().catch(() => [])).filter(p => norm(p.nombre).includes(norm(v)) || (p.codigo && norm(p.codigo).includes(norm(v)))).slice(0, 6).forEach(p => items.push([`#/prod/${p.id}`, `${p.codigo ? p.codigo + ' · ' : ''}${p.nombre}`, p.comunidad || 'Productor']));
    if (/\d/.test(v)) {
      const pat = '%' + v.replace(/[%_]/g, '') + '%', busca = (t, ruta, etiqueta) => q(sb.from(t).select('id,numero').eq('org_id', S.org.id).ilike('numero', pat).limit(4)).then(l => l.forEach(x => items.push([ruta(x.id), x.numero, etiqueta]))).catch(() => {});
      await Promise.all([cer && busca('acopio', id => '#/recibo/' + id, 'Recibo de acopio'), cre && busca('creditos', id => '#/cred/' + id, 'Crédito'), adm && busca('solicitudes', id => '#/solicitud/' + id, 'Solicitud'), cer && busca('inspecciones', id => '#/insp/' + id, 'Inspección')].filter(Boolean));
    }
    res.innerHTML = items.length ? items.map(([h, t, s]) => `<a href="${h}"><b>${esc(t)}</b><span class="nota">${esc(s)}</span></a>`).join('') : '<p class="nota" style="margin:8px 12px">No se encontró nada.</p>';
    res.hidden = false;
  };
  bus.oninput = () => { clearTimeout(t0); t0 = setTimeout(buscar, 250); };
  $('#fBus').onsubmit = e => { e.preventDefault(); const a = res.querySelector('a'); if (a) location.hash = a.getAttribute('href'); };
  bus.onblur = () => setTimeout(() => { if (res) res.hidden = true; }, 200);

  // Pendientes: cada uno por su lado, para que lo que falle no tape lo demás
  const pend = [], rojo = [], ponerSec = (s, txt, clase) => { const el = $('#e' + s); if (el && txt) { el.textContent = txt; el.className = 'estadoSec ' + (clase || ''); } };
  const tareas = [];
  if (Object.keys(TIPOS_REV).some(apruebo)) tareas.push(q(sb.rpc('por_revisar', { o: S.org.id })).then(l => {
    const p = l.filter(x => x.revision === 'Pendiente' && apruebo(x.tabla)); if (!p.length) return;
    pend.push({ n: 1, sec: 'Aprobación', t: `${p.length} registro${p.length > 1 ? 's' : ''} por aprobar`, d: [...new Set(p.map(x => TIPOS_REV[x.tabla]))].join(' · '), h: '#/aprobar', a: 'Revisar', c: 'p-ambar' });
  }));
  if (adm && jefe) tareas.push(q(sb.from('solicitudes').select('id,creado,tipo').eq('org_id', S.org.id).eq('estado', 'Pendiente').order('creado').limit(200)).then(l => {
    if (!l.length) return; const dias = diasEntre(l[0].creado.slice(0, 10), hoy());
    pend.push({ n: 2, sec: 'Administración', t: `${l.length} solicitud${l.length > 1 ? 'es' : ''} por autorizar`, d: dias ? `La más vieja es de hace ${dias} día${dias > 1 ? 's' : ''}` : 'De hoy', h: '#/solicitudes', a: 'Autorizar', c: dias > 3 ? 'p-rojo' : 'p-ambar' });
    ponerSec('adm', `${l.length} por autorizar`, 'ambar');
  }));
  if (cre && jefe) tareas.push((async () => {
    const [porRes, { cre: cs, de }] = await Promise.all([cuenta('creditos', x => x.in('estado', ['Solicitado', 'En evaluación', 'Aprobado'])), creditosConPagos(x => x.eq('estado', 'Desembolsado'))]);
    const atr = cs.map(c => ({ c, e: estadoCredito(c, de(c.id)) })).filter(x => x.e.atraso > 0.5).sort((a, b) => b.e.dias - a.e.dias);
    const pronto = cs.map(c => ({ c, e: estadoCredito(c, de(c.id)) })).filter(x => !x.e.atraso && x.e.prox && diasEntre(hoy(), x.e.prox.fecha) <= cfgN('CREDITO_DIAS_RECORDATORIO', 7));
    if (atr.length) pend.push({ n: 0, sec: 'Crédito', t: `${atr.length} crédito${atr.length > 1 ? 's' : ''} con cuotas atrasadas`, d: atr.slice(0, 2).map(x => `${x.c.numero} · ${x.c.productores?.nombre || ''} · ${x.e.dias} días`).join(' · '), h: '#/recordatorios', a: 'Mandar recordatorio', c: 'p-rojo' });
    if (pronto.length) pend.push({ n: 3, sec: 'Crédito', t: `${pronto.length} cuota${pronto.length > 1 ? 's' : ''} vence${pronto.length > 1 ? 'n' : ''} esta semana`, d: pronto.slice(0, 2).map(x => `${x.c.numero} · ${x.e.prox.fecha}`).join(' · '), h: '#/recordatorios', a: 'Recordar', c: 'p-ambar' });
    if (porRes) pend.push({ n: 2, sec: 'Crédito', t: `${porRes} crédito${porRes > 1 ? 's' : ''} por resolver o desembolsar`, d: 'Evaluación, aprobación o desembolso', h: '#/creditos', a: 'Revisar', c: 'p-ambar' });
    ponerSec('cre', atr.length ? `${atr.length} con cuotas atrasadas` : porRes ? `${porRes} por resolver` : 'Al día', atr.length ? 'rojo' : porRes ? 'ambar' : 'verde');
    const num = $('#nums'); if (num) num.insertAdjacentHTML('beforeend', `<div class="caja"><span class="nota">Cartera vigente</span><b>${L(cs.reduce((t, x) => t + estadoCredito(x, de(x.id)).saldo, 0))}</b><span class="nota">${cs.length} crédito${cs.length === 1 ? '' : 's'}</span></div>`);
  })());
  if (cer) tareas.push((async () => {
    const [ncV, qj, bas, docs] = await Promise.all([
      q(sb.from('no_conformidades').select('numero,productor_id,plazo').eq('org_id', S.org.id).eq('estado', 'Abierta').lt('plazo', hoy()).order('plazo')).catch(() => []),
      jefe ? q(sb.from('quejas').select('id,fecha').eq('org_id', S.org.id).neq('estado', 'Cerrada')).catch(() => []) : [],
      q(sb.from('basculas').select('nombre,vence').eq('org_id', S.org.id).eq('activa', true)).catch(() => null),
      q(sb.from('documentos_productor').select('tipo,vence').eq('org_id', S.org.id).not('vence', 'is', null).lte('vence', sumarMeses(hoy(), 1))).catch(() => [])]);
    if (ncV.length) pend.push({ n: 1, sec: 'Certificaciones', t: `${ncV.length} no conformidad${ncV.length > 1 ? 'es' : ''} con el plazo vencido`, d: ncV.slice(0, 2).map(x => `${x.numero || ''} · venció el ${x.plazo}`).join(' · '), h: '#/nc', a: 'Revisar', c: 'p-rojo' });
    if (qj.length) pend.push({ n: 2, sec: 'Certificaciones', t: `${qj.length} queja${qj.length > 1 ? 's' : ''} abierta${qj.length > 1 ? 's' : ''}`, d: `Hay ${cfgN('QUEJAS_DIAS_RESPUESTA', 15)} días para responder cada una`, h: '#/quejas', a: 'Responder', c: 'p-ambar' });
    if (bas && !bas.length) pend.push({ n: 4, sec: 'Certificaciones', t: 'Ninguna báscula registrada', d: 'La certificadora pide la fecha de calibración', h: '#/basculas', a: 'Registrar', c: 'p-gris' });
    const basM = (bas || []).filter(b => !b.vence || diasEntre(hoy(), b.vence) <= cfgN('BASCULA_DIAS_AVISO', 30));
    if (basM.length) pend.push({ n: 3, sec: 'Certificaciones', t: `${basM.length} báscula${basM.length > 1 ? 's' : ''} con la calibración por vencer`, d: basM.map(b => `${b.nombre}: ${b.vence || 'sin fecha'}`).join(' · '), h: '#/basculas', a: 'Actualizar', c: 'p-ambar' });
    if (docs.length) pend.push({ n: 3, sec: 'Certificaciones', t: `${docs.length} documento${docs.length > 1 ? 's' : ''} de productores vencido${docs.length > 1 ? 's' : ''} o por vencer`, d: 'Compromisos, contratos y documentos de la tierra', h: '#/pnl/cer', a: 'Ver', c: docs.some(d => d.vence < hoy()) ? 'p-rojo' : 'p-ambar' });
    const partes = [ncV.length && `${ncV.length} vencida${ncV.length > 1 ? 's' : ''}`, qj.length && `${qj.length} queja${qj.length > 1 ? 's' : ''}`].filter(Boolean);
    ponerSec('cer', partes.length ? partes.join(' · ') : 'Al día', ncV.length ? 'rojo' : partes.length ? 'ambar' : 'verde');
    const num = $('#nums');
    if (num && jefe) {
      const [aco, desp, uso] = await Promise.all([q(sb.from('acopio').select('psec_lb').eq('org_id', S.org.id).gte('fecha', new Date(Date.now() - 6 * 864e5).toLocaleDateString('en-CA', { timeZone: 'America/Tegucigalpa' }))).catch(() => []), q(sb.from('despachos').select('prima_usd').eq('org_id', S.org.id).gt('prima_usd', 0)).catch(() => []), q(sb.from('prima_uso').select('monto_usd').eq('org_id', S.org.id)).catch(() => [])]);
      const qq = aco.reduce((t, a) => t + num0(a.psec_lb), 0) / 100, prima = desp.reduce((t, x) => t + num0(x.prima_usd), 0) - uso.reduce((t, x) => t + num0(x.monto_usd), 0);
      num.insertAdjacentHTML('afterbegin', `<div class="caja"><span class="nota">${nomProducto()} acopiado en los últimos 7 días</span><b>${qqTxt(qq)}</b><span class="nota">${secoTxt()} · ${aco.length} entrega${aco.length === 1 ? '' : 's'}</span></div>`);
      num.insertAdjacentHTML('beforeend', `<div class="caja"><span class="nota">Prima disponible</span><b>USD ${prima.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b><span class="nota">Comercio Justo</span></div>`);
    }
  })());
  const cola = OFF.cola().length;
  if (cola) pend.push({ n: 1, sec: 'Este teléfono', t: `${cola} registro${cola > 1 ? 's' : ''} sin mandar`, d: 'Se guardaron sin señal', h: '#/bandeja', a: 'Mandar', c: 'p-ambar' });
  await Promise.all(tareas.map(t => t.catch(() => {})));
  const ul = $('#hoyL'); if (!ul) return;
  pend.sort((a, b) => a.n - b.n);
  $('#hoyN').textContent = pend.length ? `${pend.length} pendiente${pend.length > 1 ? 's' : ''}` : '';
  ul.innerHTML = pend.length ? pend.map(p => `<li><i class="punto ${p.c}"></i><div class="txt"><b>${esc(p.t)}</b><span class="nota">${esc(p.d)}</span></div><span class="nota sec">${esc(p.sec)}</span><a href="${p.h}">${esc(p.a)}</a></li>`).join('') : '<li class="aldia"><i class="punto p-verde"></i><div class="txt"><b>Todo al día</b><span class="nota">No hay nada pendiente en tus secciones.</span></div></li>';
};
const num0 = v => num(v);

// =====================================================================
// PANEL DE CONTROL
// =====================================================================
RUTAS.panel = async function panel() {
  if (!esAdmin()) return RUTAS['']();
  const anio = new Date().getFullYear(), mes = hoy().slice(0, 7), ini = anio + '-01-01';
  const [pend, aut, pres, fac, cre, pagos, nprod, ncert, aco, qAb, ncAb] = await Promise.all([
    cuenta('solicitudes', x => x.eq('estado', 'Pendiente')),
    q(sb.from('solicitudes').select('monto').eq('org_id', S.org.id).eq('estado', 'Autorizada').in('tipo', ['compra', 'fondo']).gte('creado', mes + '-01')),
    q(sb.from('ejecucion_presupuesto').select('aprobado,ejecutado,comprometido').eq('org_id', S.org.id).eq('anio', anio)),
    q(sb.from('facturas').select('total,isv,retencion').eq('org_id', S.org.id).eq('mes_fiscal', mes)),
    q(sb.from('creditos').select('id,monto_aprobado,plan,estado').eq('org_id', S.org.id).eq('estado', 'Desembolsado')),
    q(sb.from('pagos_credito').select('credito_id,capital,interes').eq('org_id', S.org.id)),
    cuenta('productores', x => x.eq('activo', true)),
    cuenta('productores', x => x.eq('activo', true).eq('estado_cert', 'Aprobado')),
    q(sb.from('acopio').select('psec_lb').eq('org_id', S.org.id).gte('fecha', ini)),
    cuenta('quejas', x => x.neq('estado', 'Cerrada')),
    cuenta('no_conformidades', x => x.eq('estado', 'Abierta'))
  ]);
  const s = (a, k) => a.reduce((t, x) => t + num(x[k]), 0);
  const aprobado = s(pres, 'aprobado'), usado = s(pres, 'ejecutado') + s(pres, 'comprometido');
  const cartera = cre.map(c => estadoCredito(c, pagos.filter(p => p.credito_id === c.id)));
  const saldo = cartera.reduce((t, c) => t + c.saldo, 0), enMora = cartera.filter(c => c.dias > 0).reduce((t, c) => t + c.saldo, 0);
  const dato = (t, v, sub, h) => `<a class="tarjeta" href="${h || '#/panel'}"><span>${t}</span><b style="font-size:22px;margin:4px 0">${v}</b><span>${sub || ''}</span></a>`;
  app().innerHTML = cabecera('Panel de control', '#/') + `
  <h2>Administración</h2><div class="tarjetas">
    ${dato('Solicitudes por resolver', pend, 'Compras, fondos, vacaciones…', '#/solicitudes')}
    ${dato('Autorizado este mes', L(s(aut, 'monto')), 'Compras y fondos', '#/solicitudes')}
    ${dato('Presupuesto ' + anio, aprobado ? Math.round(usado / aprobado * 100) + ' % usado' : 'Sin cargar', aprobado ? L(aprobado - usado) + ' disponible' : '', '#/presupuesto')}
    ${dato('Facturas del mes', fac.length, 'ISV ' + L(s(fac, 'isv')) + ' · retenciones ' + L(s(fac, 'retencion')), '#/facturas')}
  </div>
  <h2>Crédito interno</h2><div class="tarjetas">
    ${dato('Cartera vigente', L(saldo), cartera.length + ' créditos', '#/cartera')}
    ${dato('Cartera en mora', L(enMora), saldo ? (enMora / saldo * 100).toFixed(1) + ' % de la cartera' : '', '#/cartera')}
    ${dato('Recuperado (total)', L(s(pagos, 'capital')), 'Intereses ' + L(s(pagos, 'interes')), '#/cartera')}
  </div>
  <h2>Certificaciones</h2><div class="tarjetas">
    ${dato('Productores activos', nprod, ncert + ' aprobados en inspección', '#/padron')}
    ${dato('Acopio ' + anio, (s(aco, 'psec_lb') / 100).toLocaleString('es-HN', { maximumFractionDigits: 1 }) + ' qq', 'Pergamino seco equivalente', '#/balance')}
    ${dato('No conformidades abiertas', ncAb, '', '#/nc')}
    ${dato('Quejas sin cerrar', qAb, '', '#/quejas')}
  </div>`;
};

// =====================================================================
// LIQUIDACIÓN LABORAL (Código de Trabajo de Honduras)
// =====================================================================
function calcularLiquidacion(d) {
  const sal = num(d.salario), diario = sal / 30, dias = diasEntre(d.ingreso, d.salida) + 1, meses = dias / 30.4167, anios = dias / 365;
  const r = [];
  const agregar = (rubro, base, monto) => { if (monto > 0) r.push({ rubro, base, monto: Math.round(monto * 100) / 100 }); };
  const injust = d.motivo === 'Despido injustificado';
  if (injust) { // Preaviso, art. 116
    const p = meses < 3 ? 1 : meses < 6 ? 7 : meses < 12 ? 14 : anios < 2 ? 30 : 60;
    agregar('Preaviso (art. 116)', p + ' días de salario', p * diario);
  }
  // Cesantía, art. 120
  let ces = meses < 3 ? 0 : meses < 6 ? 10 : meses < 12 ? 20 : Math.min(30 * anios, 30 * num(S.leyes.CESANTIA_TOPE_MESES || 25));
  if (injust) agregar('Auxilio de cesantía (art. 120)', ces.toFixed(1) + ' días de salario', ces * diario);
  else if (d.motivo === 'Renuncia voluntaria' && anios >= 15) {
    const pct = num(S.leyes.RENUNCIA_15_PORC || 35);
    agregar(`Cesantía por renuncia con 15 años o más (${pct} %)`, (ces * pct / 100).toFixed(1) + ' días', ces * diario * pct / 100);
  }
  // Vacaciones proporcionales, art. 346 (días hábiles según años cumplidos)
  const cumplidos = Math.floor(anios), derecho = k => k <= 1 ? 10 : k === 2 ? 12 : k === 3 ? 15 : 20; // k = año de servicio en curso
  const desdeAniv = dias - cumplidos * 365, vacProp = desdeAniv / 365 * derecho(cumplidos + 1);
  agregar('Vacaciones proporcionales', vacProp.toFixed(1) + ' días', vacProp * diario);
  agregar('Vacaciones pendientes de años anteriores', num(d.vac_pendientes) + ' días', num(d.vac_pendientes) * diario);
  // Décimo tercer mes (enero–diciembre) y décimo cuarto (julio–junio)
  const anioS = d.salida.slice(0, 4), ini13 = d.ingreso > anioS + '-01-01' ? d.ingreso : anioS + '-01-01';
  const d13 = diasEntre(ini13, d.salida) + 1; agregar('Décimo tercer mes proporcional', d13 + ' días del año', sal * d13 / 365);
  const jul = d.salida >= anioS + '-07-01' ? anioS + '-07-01' : (anioS - 1) + '-07-01', ini14 = d.ingreso > jul ? d.ingreso : jul;
  const d14 = diasEntre(ini14, d.salida) + 1; agregar('Décimo cuarto mes proporcional', d14 + ' días desde julio', sal * d14 / 365);
  agregar('Salarios pendientes', num(d.dias_pendientes) + ' días', num(d.dias_pendientes) * diario);
  if (num(d.otros)) agregar('Otros (' + (d.otros_concepto || 'ajuste') + ')', '', num(d.otros));
  const deducciones = num(d.deducciones);
  const total = r.reduce((t, x) => t + x.monto, 0) - deducciones;
  const a = Math.floor(anios), m = Math.floor((anios - a) * 12);
  return { rubros: r, deducciones, total: Math.round(total * 100) / 100, antiguedad: `${a} año${a === 1 ? '' : 's'} y ${m} mes${m === 1 ? '' : 'es'}` };
}
RUTAS.laboral = async function formLaboral() {
  const emp = await q(sb.from('empleados').select('nombre,fecha_ingreso,salario,dias_vacaciones').eq('org_id', S.org.id).order('nombre'));
  app().innerHTML = cabecera('Liquidación laboral') + `<form class="caja" id="f"><div class="rejilla">
    <div><label>Empleado</label><input name="solicitante" list="dlEmp" required><datalist id="dlEmp">${emp.map(e => `<option value="${esc(e.nombre)}">`).join('')}</datalist></div>
    <div><label>Motivo</label><select name="motivo">${opciones(['Despido injustificado', 'Renuncia voluntaria', 'Mutuo acuerdo', 'Fin de contrato a plazo fijo'])}</select></div>
    <div><label>Fecha de ingreso</label><input type="date" name="ingreso" required></div>
    <div><label>Último día de trabajo</label><input type="date" name="salida" required value="${hoy()}"></div>
    <div><label>Salario mensual promedio de los últimos 6 meses (L)</label><input name="salario" required inputmode="decimal"></div>
    <div><label>Días de vacaciones de años anteriores sin gozar</label><input name="vac_pendientes" inputmode="decimal" value="0"></div>
    <div><label>Días de salario trabajados sin pagar</label><input name="dias_pendientes" inputmode="decimal" value="0"></div>
    <div><label>Otros pagos (L)</label><input name="otros" inputmode="decimal" value="0"></div>
    <div><label>Concepto de otros pagos</label><input name="otros_concepto"></div>
    <div><label>Deducciones: préstamos, adelantos (L)</label><input name="deducciones" inputmode="decimal" value="0"></div>
  </div><div id="res" style="margin-top:14px"></div>
  <p class="nota">Cálculo según el Código de Trabajo (preaviso art. 116, cesantía art. 120, vacaciones art. 346, décimo tercero y décimo cuarto mes). Revisalo con el contador o el abogado antes de pagar.</p>
  <div class="acciones"><button>Enviar a autorización</button></div></form>`;
  const f = $('#f');
  f.solicitante.onchange = () => { const e = emp.find(x => x.nombre === f.solicitante.value); if (e) { if (e.fecha_ingreso) f.ingreso.value = e.fecha_ingreso; if (e.salario) f.salario.value = e.salario; if (e.dias_vacaciones) f.vac_pendientes.value = e.dias_vacaciones; f.oninput(); } };
  f.oninput = () => {
    const d = datosForm(f); if (!d.ingreso || !d.salida || !num(d.salario) || d.salida < d.ingreso) { $('#res').innerHTML = ''; return; }
    const c = calcularLiquidacion(d);
    $('#res').innerHTML = `<p>Antigüedad: <b>${c.antiguedad}</b></p><div class="tabla"><table><thead><tr><th>Rubro</th><th>Base</th><th class="n">Monto</th></tr></thead><tbody>${c.rubros.map(x => `<tr><td>${esc(x.rubro)}</td><td>${esc(x.base)}</td><td class="n">${L(x.monto)}</td></tr>`).join('')}${c.deducciones ? `<tr><td>Deducciones</td><td></td><td class="n">− ${L(c.deducciones)}</td></tr>` : ''}</tbody><tfoot><tr><th colspan="2">Total a pagar</th><th class="n">${L(c.total)}</th></tr></tfoot></table></div>`;
  };
  f.onsubmit = async ev => {
    ev.preventDefault(); const d = datosForm(f);
    if (d.salida < d.ingreso) return aviso('La fecha de salida no puede ser antes del ingreso.', true);
    const c = calcularLiquidacion(d); ocupado(f, true);
    try { await guardarSolicitud({ tipo: 'laboral', solicitante: d.solicitante, correo: S.user.email, monto: c.total, descripcion: `Liquidación laboral · ${d.motivo}`, datos: { ...d, ...c } }); }
    catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
};

// =====================================================================
// CRÉDITO INTERNO
// =====================================================================
const MESES_FREC = { 'Mensual': 1, 'Trimestral': 3, 'Semestral': 6, 'Al vencimiento': 0 };
function armarPlan(monto, tasa, plazo, frecuencia, primera) {
  const P = num(monto), i = num(tasa) / 100, m = MESES_FREC[frecuencia] ?? 1;
  if (!m) { const int = P * i * plazo / 12; return [{ n: 1, fecha: primera, capital: P, interes: r2(int), cuota: r2(P + int), saldo: 0 }]; }
  const n = Math.max(1, Math.ceil(plazo / m)), r = i * m / 12, cuota = r ? P * r / (1 - Math.pow(1 + r, -n)) : P / n;
  let saldo = P; const plan = [];
  for (let k = 1; k <= n; k++) {
    const int = saldo * r; let cap = cuota - int; if (k === n) cap = saldo;
    saldo -= cap; plan.push({ n: k, fecha: sumarMeses(primera, (k - 1) * m), capital: r2(cap), interes: r2(int), cuota: r2(cap + int), saldo: r2(Math.max(saldo, 0)) });
  }
  return plan;
}
const r2 = x => Math.round(x * 100) / 100;
function estadoCredito(c, pagos, al = hoy()) {
  const plan = c.plan || [], pagado = pagos.reduce((t, p) => t + num(p.capital) + num(p.interes), 0);
  const capPag = pagos.reduce((t, p) => t + num(p.capital), 0), intPag = pagos.reduce((t, p) => t + num(p.interes), 0);
  let acum = 0, primeraImpaga = null, vencidas = 0, intVencido = 0;
  for (const cu of plan) { if (cu.fecha > al) break; acum += cu.cuota; intVencido += cu.interes; if (acum - pagado > 0.5) { vencidas++; if (!primeraImpaga) primeraImpaga = cu.fecha; } }
  const atraso = Math.max(0, acum - pagado), dias = primeraImpaga ? diasEntre(primeraImpaga, al) : 0;
  const prox = plan.find(q => q.fecha > al);
  // Mora: lo que falta de cada cuota vencida × tasa diaria × días de atraso después de la gracia
  const tasaDia = cfgN('CREDITO_MORA_PCT_MENSUAL', 2) / 100 / 30, gracia = cfgN('CREDITO_DIAS_GRACIA', 0);
  let cubierto = pagado, moraCalc = 0;
  for (const cu of plan) { if (cu.fecha > al) break; const falta = Math.max(0, num(cu.cuota) - Math.max(0, cubierto)); cubierto -= num(cu.cuota); const d = diasEntre(cu.fecha, al) - gracia; if (falta > 0.5 && d > 0) moraCalc += falta * tasaDia * d; }
  const moraPend = r2(Math.max(0, moraCalc - pagos.reduce((t, p) => t + num(p.mora), 0)));
  return { saldo: r2(Math.max(0, num(c.monto_aprobado) - capPag)), atraso: r2(atraso), dias: Math.max(0, dias), vencidas, prox, intPend: r2(Math.max(0, intVencido - intPag)), capPag, intPag, moraPend, primeraImpaga };
}

RUTAS.cre = async function menuCredito() {
  S.seccion = 'cre';
  const n = esJefe() ? await cuenta('creditos', x => x.in('estado', ['Solicitado', 'En evaluación', 'Aprobado'])) : 0;
  app().innerHTML = cabecera('Crédito interno', '#/') + `<div class="tarjetas">
    ${tarjeta('#/prodf', 'Registrar productor', 'Datos del socio (también sirve para certificaciones)')}
    ${tarjeta('#/credito', 'Solicitud de crédito', 'Monto, destino, plazo y garantía')}
    ${tarjeta('#/creditos', esJefe() ? 'Créditos por resolver' : 'Mis solicitudes', 'Evaluación técnica, aprobación y desembolso', n)}
    ${esJefe() ? tarjeta('#/cartera', 'Cartera y pagos', 'Saldos, mora y recuperación') : ''}
    ${esJefe() ? tarjeta('#/recordatorios', 'Recordatorios de cuotas', 'Atrasados y cuotas por vencer, con WhatsApp') : ''}
    ${esJefe() ? tarjeta('#/reportescre', 'Reportes de cartera', 'PAR 30 y 90, provisión, programado contra recuperado') : ''}
    ${esJefe() ? tarjeta('#/fondos', 'Fondos de crédito', 'De dónde sale el dinero y cuánto queda') : ''}
    ${esAdmin() ? tarjeta('#/condiciones', 'Condiciones y comité', 'Tasa, plazo y montos por destino; quién aprueba') : ''}
    ${tarjeta('#/padron', 'Productores', 'Padrón de socios')}
    ${puedePanel('cre') ? tarjeta('#/pnl/cre', 'Panel de control', 'Cartera, mora y archivo de PDF') : ''}
  </div>`;
};

RUTAS.credito = async function formCredito() {
  const [ps, conds] = await Promise.all([prods(), q(sb.from('condiciones_credito').select('*').eq('org_id', S.org.id).eq('activa', true).order('orden'))]);
  const max = cfgN('CREDITO_MONTO_MAX', 100000), plazoMax = cfgN('CREDITO_PLAZO_MAX_MESES', 24);
  const destinos = conds.length ? conds.map(x => x.destino) : (lista(S.cfg.CREDITO_DESTINOS).length ? lista(S.cfg.CREDITO_DESTINOS) : ['Mantenimiento de finca', 'Otro']);
  app().innerHTML = cabecera('Solicitud de crédito') + `<form class="caja" id="f"><div class="rejilla">
    <div class="ancho"><label>Productor</label>${campoProd(ps)}<p class="nota">¿No aparece? <a href="#/prodf">Registralo primero</a>.</p></div>
    <div><label>Destino</label><select name="destino">${opciones(destinos)}</select></div>
    <div><label>Monto solicitado (L)</label><input name="monto" required inputmode="decimal"></div>
    <div><label>Plazo (meses)</label><input name="plazo" required inputmode="numeric" value="12"></div>
    <div><label>Forma de pago</label><select name="frecuencia">${opciones(Object.keys(MESES_FREC))}</select></div>
    <div><label>Garantía</label><select name="garantia">${opciones(['Fiduciaria (fiador)', 'Prendaria', 'Hipotecaria', 'Contrato de entrega de cosecha', 'Sin garantía'])}</select></div>
    <div class="ancho"><label>Detalle del uso y de la garantía</label><textarea name="comentario"></textarea></div>
  </div><p class="nota" id="cond"></p>
  <div class="acciones"><button>Registrar solicitud</button></div></form>`;
  const f = $('#f'), condDe = v => conds.find(x => x.destino === v);
  const mostrar = cambio => {
    const c = condDe(f.destino.value);
    if (!c) { $('#cond').textContent = `Máximo por productor: ${L(max)} · plazo máximo: ${plazoMax} meses · tasa vigente: ${cfgN('CREDITO_TASA_ANUAL', 18)} % anual.`; return; }
    $('#cond').innerHTML = `Condiciones para <b>${esc(c.destino)}</b>: de ${L(c.monto_min)} a ${L(c.monto_max)} · hasta ${c.plazo_max_meses} meses · ${num(c.tasa_anual)} % anual · pago ${esc(c.frecuencia).toLowerCase()}${c.garantia ? ' · garantía ' + esc(c.garantia).toLowerCase() : ''}.`;
    if (cambio) { f.plazo.value = c.plazo_max_meses; f.frecuencia.value = c.frecuencia; }
  };
  f.destino.onchange = () => mostrar(true); mostrar(true);
  f.onsubmit = async ev => {
    ev.preventDefault(); const d = datosForm(f), p = leerProd(ps, d.productor_txt), c = condDe(d.destino);
    const mn = c ? num(c.monto_min) : 0, mx = c ? num(c.monto_max) : max, pm = c ? c.plazo_max_meses : plazoMax;
    if (!p) return aviso('Elegí un productor de la lista.', true);
    if (num(d.monto) <= 0) return aviso('Poné el monto.', true);
    if (num(d.monto) < mn || num(d.monto) > mx) return aviso(`Para ${d.destino} el monto va de ${L(mn)} a ${L(mx)}.`, true);
    if (+d.plazo < 1 || +d.plazo > pm) return aviso(`Para ${d.destino} el plazo es de 1 a ${pm} meses.`, true);
    ocupado(f, true);
    try { const r = await q(sb.from('creditos').insert({ org_id: S.org.id, productor_id: p.id, monto_solicitado: num(d.monto), destino: d.destino, plazo_meses: +d.plazo, frecuencia: d.frecuencia, garantia: d.garantia, comentario: d.comentario, tasa_anual: c ? num(c.tasa_anual) : null }).select('id,numero').single()); avisar('credito', r.id); aviso('Solicitud registrada: ' + r.numero); location.hash = '#/cred/' + r.id; }
    catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
};

// Condiciones por destino y modo de aprobación (solo el administrador)
RUTAS.condiciones = async function verCondiciones() {
  if (!esAdmin()) return RUTAS.cre();
  const filas = await q(sb.from('condiciones_credito').select('*').eq('org_id', S.org.id).order('orden'));
  const fila = (c = {}) => `<tr data-id="${c.id || ''}"><td><input name="destino" value="${esc(c.destino)}"></td><td><input name="tasa_anual" inputmode="decimal" value="${esc(c.tasa_anual ?? 18)}" style="width:70px"></td><td><input name="plazo_max_meses" inputmode="numeric" value="${esc(c.plazo_max_meses ?? 12)}" style="width:70px"></td><td><input name="monto_min" inputmode="decimal" value="${esc(c.monto_min ?? 0)}"></td><td><input name="monto_max" inputmode="decimal" value="${esc(c.monto_max ?? '')}"></td><td><select name="frecuencia">${opciones(Object.keys(MESES_FREC), c.frecuencia || 'Mensual')}</select></td><td><input name="garantia" value="${esc(c.garantia)}"></td><td><input type="checkbox" name="activa" style="width:auto" ${c.activa === false ? '' : 'checked'}></td></tr>`;
  app().innerHTML = cabecera('Condiciones de crédito', '#/cre') + `<p class="nota">Cada destino tiene su tasa, plazo, montos y forma de pago. La solicitud de crédito las toma de aquí y no deja pasar lo que se sale de ellas. Un destino que ya no se usa se desmarca en «Activa».</p>
  <form id="f"><div class="tabla"><table><thead><tr><th>Destino</th><th>Tasa %</th><th>Plazo máx. (meses)</th><th>Monto mínimo (L)</th><th>Monto máximo (L)</th><th>Forma de pago</th><th>Garantía</th><th>Activa</th></tr></thead><tbody id="cuerpo">${filas.map(fila).join('')}</tbody></table></div>
  <div class="acciones"><button type="button" class="sec" id="otra">+ Otro destino</button><button>Guardar condiciones</button></div></form>
  <h2>Quién aprueba</h2><form class="caja" id="fm"><div class="rejilla">
    <div><label>Modo de aprobación</label><select name="CREDITO_APROBACION_MODO">${opciones(['Gerencia', 'Gerencia hasta monto', 'Comité'], S.cfg.CREDITO_APROBACION_MODO || 'Gerencia')}</select></div>
    <div><label>Gerencia aprueba hasta (L)</label><input name="CREDITO_GERENCIA_HASTA" inputmode="decimal" value="${esc(S.cfg.CREDITO_GERENCIA_HASTA || 50000)}"></div>
    <div><label>Votos a favor para aprobar (vacío = mayoría)</label><input name="COMITE_VOTOS_MINIMOS" inputmode="numeric" value="${esc(S.cfg.COMITE_VOTOS_MINIMOS || '')}"></div>
  </div><p class="nota">«Gerencia»: aprueban gerencia o el administrador. «Gerencia hasta monto»: arriba de ese monto vota el comité. «Comité»: todos los créditos los vota el comité. Quién es del comité se marca en <a href="#/usuarios">Usuarios</a>; si no hay nadie marcado, aprueba el administrador.</p><div class="acciones"><button>Guardar</button></div></form>`;
  $('#otra').onclick = () => $('#cuerpo').insertAdjacentHTML('beforeend', fila());
  if (!filas.length) $('#otra').click();
  $('#f').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target;
    const datos = [...$('#cuerpo').rows].map((tr, i) => { const g = n => tr.querySelector(`[name=${n}]`); return { id: tr.dataset.id, org_id: S.org.id, destino: g('destino').value.trim(), tasa_anual: num(g('tasa_anual').value), plazo_max_meses: parseInt(g('plazo_max_meses').value, 10) || 1, monto_min: num(g('monto_min').value), monto_max: num(g('monto_max').value), frecuencia: g('frecuencia').value, garantia: g('garantia').value.trim() || null, activa: g('activa').checked, orden: i + 1 }; }).filter(x => x.destino);
    const mal = datos.find(x => !x.monto_max || x.monto_max < x.monto_min); if (mal) return aviso(`Revisá los montos de «${mal.destino}».`, true);
    if (new Set(datos.map(x => x.destino)).size < datos.length) return aviso('Hay dos destinos con el mismo nombre.', true);
    ocupado(f, true);
    try {
      const viejos = datos.filter(x => x.id), nuevos = datos.filter(x => !x.id).map(({ id, ...x }) => x);
      if (viejos.length) await q(sb.from('condiciones_credito').upsert(viejos));
      if (nuevos.length) await q(sb.from('condiciones_credito').insert(nuevos));
      await q(sb.from('bitacora').insert({ org_id: S.org.id, usuario: nombreQuien(), accion: 'Cambió las condiciones de crédito' }));
      aviso('Condiciones guardadas.'); RUTAS.condiciones();
    } catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
  $('#fm').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target, d = datosForm(f); ocupado(f, true);
    try {
      await q(sb.from('configuracion').upsert(Object.entries(d).map(([clave, valor]) => ({ org_id: S.org.id, clave, valor })), { onConflict: 'org_id,clave' }));
      await q(sb.from('bitacora').insert({ org_id: S.org.id, usuario: nombreQuien(), accion: 'Cambió quién aprueba los créditos', detalle: d.CREDITO_APROBACION_MODO }));
      await cargarOrg(); aviso('Guardado.'); ocupado(f, false);
    } catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
};

RUTAS.creditos = async function verCreditos() {
  const filas = await q(sb.from('creditos').select('id,numero,creado,estado,monto_solicitado,monto_aprobado,destino,productores(nombre)').eq('org_id', S.org.id).order('creado', { ascending: false }).limit(300));
  const orden = { 'Solicitado': 0, 'En evaluación': 1, 'Aprobado': 2 };
  filas.sort((a, b) => (orden[a.estado] ?? 9) - (orden[b.estado] ?? 9));
  app().innerHTML = cabecera(esJefe() ? 'Créditos' : 'Mis solicitudes de crédito') + `<div class="filtros"><a class="boton" href="#/credito">+ Nueva solicitud</a></div>
  <div class="tabla"><table><thead><tr><th>Número</th><th>Fecha</th><th>Productor</th><th>Destino</th><th class="n">Solicitado</th><th class="n">Aprobado</th><th>Estado</th></tr></thead><tbody>
  ${filas.map(c => `<tr><td><a href="#/cred/${c.id}">${esc(c.numero)}</a></td><td>${fecha(c.creado)}</td><td>${esc(c.productores?.nombre)}</td><td>${esc(c.destino)}</td><td class="n">${L(c.monto_solicitado)}</td><td class="n">${c.monto_aprobado ? L(c.monto_aprobado) : ''}</td><td>${estadoChip(c.estado, claseCre(c.estado))}</td></tr>`).join('') || '<tr><td colspan="7" class="nota">Sin créditos.</td></tr>'}
  </tbody></table></div>`;
};
const claseCre = e => ({ 'Solicitado': 'Pendiente', 'En evaluación': 'Pendiente', 'Aprobado': 'Autorizada', 'Desembolsado': 'Autorizada', 'Pagado': 'Anulada', 'Rechazado': 'Rechazada', 'Anulado': 'Anulada', 'Reestructurado': 'Anulada', 'Castigado': 'Rechazada' }[e]);

RUTAS.cred = async function verCredito(id) {
  const c = await q(sb.from('creditos').select('*, productores(*)').eq('id', id).single());
  const pagos = esJefe() ? await q(sb.from('pagos_credito').select('*').eq('credito_id', id).order('fecha')) : [];
  const p = c.productores, ev = c.evaluacion || {}, est = ['Desembolsado', 'Pagado', 'Castigado', 'Reestructurado'].includes(c.estado) && c.plan ? estadoCredito(c, pagos) : null;
  const [otros, garantias, fondos] = await Promise.all([q(sb.from('creditos').select('id,numero,estado,plan,monto_aprobado').eq('productor_id', c.productor_id)), q(sb.from('credito_garantias').select('*').eq('credito_id', id).order('creado')).catch(() => []), q(sb.from('fondos_credito').select('id,nombre,activo').eq('org_id', S.org.id).order('nombre')).catch(() => [])]);
  const pagosOtros = esJefe() ? await q(sb.from('pagos_credito').select('credito_id,fecha,capital,interes,mora').in('credito_id', otros.map(o => o.id))) : [];
  const calif = esJefe() ? calificacion(otros.filter(o => o.id !== id || ['Pagado', 'Castigado', 'Reestructurado', 'Desembolsado'].includes(o.estado)), pagosOtros) : null;
  const optFondo = sel => `<option value="">Sin fondo</option>${fondos.filter(f => f.activo || f.id === sel).map(f => `<option value="${f.id}" ${f.id === sel ? 'selected' : ''}>${esc(f.nombre)}</option>`).join('')}`;
  const tasa = c.tasa_anual ?? cfgN('CREDITO_TASA_ANUAL', 18), limGer = cfgN('CREDITO_GERENCIA_HASTA', 50000);
  // Comité de crédito: si este crédito lo vota el comité, cuántos votos hacen falta y quién ya votó
  const modo = S.cfg.CREDITO_APROBACION_MODO || 'Gerencia', abierto = ['Solicitado', 'En evaluación'].includes(c.estado);
  const [com, votos] = await Promise.all([sb.rpc('comite_info', { o: S.org.id }).then(r => r.data || { miembros: 0, soy: false }), q(sb.from('votos_credito').select('*').eq('credito_id', id).order('fecha'))]);
  const montoRef = num(ev.monto_recomendado ?? c.monto_solicitado);
  const porComite = com.miembros > 0 && (modo === 'Comité' || (modo === 'Gerencia hasta monto' && montoRef > limGer));
  const minimo = num(S.cfg.COMITE_VOTOS_MINIMOS) || Math.max(1, Math.floor(com.miembros / 2) + 1);
  const aFavor = votos.filter(v => v.voto === 'A favor').length, enContra = votos.length - aFavor;
  const notaDecision = porComite ? `Este crédito lo vota el comité de crédito (se aprueba con ${minimo} voto${minimo > 1 ? 's' : ''} a favor). Desde aquí solo se puede rechazar.`
    : modo !== 'Gerencia' && !com.miembros ? `Gerencia aprueba hasta ${L(limGer)}; arriba de eso, el administrador (todavía no hay comité nombrado en Usuarios).`
    : S.rol === 'gerencia' ? `Gerencia aprueba hasta ${L(limGer)}; arriba de eso, ${modo === 'Gerencia' ? 'el administrador' : 'el comité'}.` : '';
  let acc = '';
  if (['Solicitado', 'En evaluación'].includes(c.estado)) acc += `<h2>Evaluación técnica</h2><form class="caja" id="fEv"><div class="rejilla">
    <div><label>Técnico</label><input name="tecnico" required value="${esc(ev.tecnico || (S.maestro ? '' : S.perfil.nombre))}"></div>
    <div><label>Fecha de la visita</label><input type="date" name="fecha" value="${esc(ev.fecha || hoy())}"></div>
    <div><label>Área en producción (ha)</label><input name="area" inputmode="decimal" value="${esc(ev.area)}"></div>
    <div><label>Producción esperada (qq ${secoTxt()})</label><input name="produccion" inputmode="decimal" value="${esc(ev.produccion)}"></div>
    <div><label>Ingreso esperado de la cosecha (L)</label><input name="ingreso" inputmode="decimal" value="${esc(ev.ingreso)}"></div>
    <div><label>Otras deudas (L)</label><input name="deudas" inputmode="decimal" value="${esc(ev.deudas)}"></div>
    <div><label>Recomendación</label><select name="recomendacion">${opciones(['Aprobar', 'Aprobar con menor monto', 'Rechazar'], ev.recomendacion)}</select></div>
    <div><label>Monto recomendado (L)</label><input name="monto_recomendado" inputmode="decimal" value="${esc(ev.monto_recomendado ?? c.monto_solicitado)}"></div>
    <div class="ancho"><label>Observaciones de la visita</label><textarea name="observaciones">${esc(ev.observaciones)}</textarea></div>
  </div><div class="caja" id="capac" style="background:var(--fondo2,#f8fafc)"><p class="nota">Calculando la capacidad de pago…</p></div><div class="acciones"><button>Guardar evaluación</button></div></form>`;
  if (esJefe() && ['Solicitado', 'En evaluación'].includes(c.estado)) acc += `<h2>Decisión</h2><form class="caja" id="fAp"><div class="rejilla">
    <div><label>Monto aprobado (L)</label><input name="monto" inputmode="decimal" value="${esc(ev.monto_recomendado ?? c.monto_solicitado)}"></div>
    <div><label>Tasa anual (%)</label><input name="tasa" inputmode="decimal" value="${tasa}"></div>
    <div><label>Plazo (meses)</label><input name="plazo" inputmode="numeric" value="${c.plazo_meses}"></div>
    <div><label>Fondo</label><select name="fondo_id">${optFondo(c.fondo_id)}</select></div>
    <div class="ancho"><label>Comentario</label><input name="comentario"></div>
  </div>${notaDecision ? `<p class="nota">${notaDecision}</p>` : ''}
  <div class="acciones">${porComite ? '' : '<button name="d" value="Aprobado">Aprobar</button>'}<button class="rojo" name="d" value="Rechazado">Rechazar</button></div></form>`;
  if (porComite || votos.length) acc += `<h2>Comité de crédito</h2><div class="caja"><p class="nota">${aFavor} a favor y ${enContra} en contra, de ${com.miembros} miembro${com.miembros === 1 ? '' : 's'}. Se aprueba con ${minimo} voto${minimo > 1 ? 's' : ''} a favor; el monto aprobado es el menor que propusieron quienes votaron a favor.</p>
    ${votos.length ? `<div class="tabla"><table><thead><tr><th>Miembro</th><th>Voto</th><th class="n">Monto que propone</th><th>Comentario</th><th>Fecha</th></tr></thead><tbody>${votos.map(v => `<tr><td>${esc(v.nombre)}</td><td>${estadoChip(v.voto, v.voto === 'A favor' ? 'Autorizada' : 'Rechazada')}</td><td class="n">${v.monto ? L(v.monto) : ''}</td><td>${esc(v.comentario)}</td><td>${fechaHora(v.fecha)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="nota">Todavía nadie ha votado.</p>'}
    ${abierto && porComite && com.soy && !votos.some(v => v.user_id === S.user.id) ? `<form id="fVoto" style="margin-top:12px"><div class="rejilla"><div><label>Tu voto</label><select name="voto"><option>A favor</option><option>En contra</option></select></div><div><label>Monto que aprobás (L)</label><input name="monto" inputmode="decimal" value="${montoRef}"></div><div class="ancho"><label>Comentario</label><input name="comentario"></div></div><div class="acciones"><button>Votar</button></div></form>` : ''}
    ${abierto && porComite && !com.soy ? '<p class="nota">Votan solo los miembros del comité (el administrador los marca en Usuarios).</p>' : ''}</div>`;
  if (esJefe() && c.estado === 'Aprobado') acc += `<h2>Desembolso</h2><form class="caja" id="fDes"><div class="rejilla">
    <div><label>Fecha del desembolso</label><input type="date" name="fecha" required value="${hoy()}"></div>
    <div><label>Fecha de la primera cuota</label><input type="date" name="primera" required value="${sumarMeses(hoy(), MESES_FREC[c.frecuencia] || c.plazo_meses)}"></div>
    <div><label>Fondo</label><select name="fondo_id">${optFondo(c.fondo_id)}</select></div>
    <div class="ancho"><label>Forma de entrega (cheque, transferencia, efectivo) y referencia</label><input name="referencia"></div>
  </div><div id="planPrev"></div><div class="acciones"><button>Registrar desembolso</button></div></form>`;
  if (esJefe() && ['Desembolsado', 'Castigado'].includes(c.estado) && est) {
    const moraSug = est.moraPend;
    acc += `<h2>Registrar pago</h2><form class="caja" id="fPag"><div class="rejilla">
    <div><label>Fecha</label><input type="date" name="fecha" required value="${hoy()}"></div>
    <div><label>Monto recibido (L)</label><input name="monto" required inputmode="decimal" value="${est.atraso || est.prox?.cuota || ''}"></div>
    <div><label>Recargo por mora (L)</label><input name="mora" inputmode="decimal" value="${moraSug}"><p class="nota">Calculada: ${cfgN('CREDITO_MORA_PCT_MENSUAL', 2)} % mensual sobre lo atrasado, después de ${cfgN('CREDITO_DIAS_GRACIA', 0)} días de gracia.</p></div>
    <div><label>Número de recibo</label><input name="recibo"></div>
  </div><p class="nota" id="repart"></p><div class="acciones"><button>Registrar pago</button></div></form>`;
  }
  acc += `<h2>Garantías y fiadores</h2>${garantias.length ? `<div class="tabla"><table><thead><tr><th>Tipo</th><th>Nombre o bien</th><th>Identidad</th><th>Teléfono</th><th>Detalle</th><th class="n">qq</th><th class="n">Valor</th><th>Documento</th></tr></thead><tbody>${garantias.map(g => `<tr><td>${esc(g.tipo)}</td><td>${esc(g.nombre || '')}</td><td>${esc(g.identidad || '')}</td><td>${esc(g.telefono || '')}</td><td>${esc(g.descripcion || '')}</td><td class="n">${g.qq_comprometidos ?? ''}</td><td class="n">${g.valor ? L(g.valor) : ''}</td><td>${g.documento ? `<a href="#" data-doc="${esc(g.documento)}">Ver</a>` : ''}</td></tr>`).join('')}</tbody></table></div>` : '<p class="nota">Todavía no se han registrado garantías.</p>'}
  ${!['Anulado', 'Rechazado', 'Pagado', 'Reestructurado'].includes(c.estado) ? `<form class="caja" id="fGar"><div class="rejilla">
    <div><label>Tipo</label><select name="tipo">${opciones(['Fiador', 'Cosecha comprometida', 'Prendaria', 'Hipotecaria', 'Pagaré firmado', 'Contrato', 'Otro'])}</select></div>
    <div><label>Nombre del fiador o del bien</label><input name="nombre"></div><div><label>Identidad</label><input name="identidad"></div><div><label>Teléfono</label><input name="telefono" inputmode="tel"></div>
    <div><label>Quintales comprometidos</label><input name="qq_comprometidos" inputmode="decimal"></div><div><label>Valor estimado (L)</label><input name="valor" inputmode="decimal"></div>
    <div class="ancho"><label>Detalle</label><input name="descripcion"></div><div class="ancho"><label>Documento firmado o foto (PDF o imagen)</label><input type="file" name="doc" accept="image/*,application/pdf"></div>
  </div><div class="acciones"><button>Agregar garantía</button></div></form>` : ''}`;
  if (esJefe() && ['Desembolsado', 'Castigado'].includes(c.estado) && est) {
    const deuda = r2(est.saldo + est.intPend + est.moraPend);
    acc += `<h2>Reestructurar</h2><form class="caja" id="fRee"><p class="nota">El saldo pasa a un crédito nuevo con su propio plan. Este queda como «Reestructurado» y se guarda todo su historial. Las garantías pasan al nuevo.</p><div class="rejilla">
    <div><label>Monto del crédito nuevo (L)</label><input name="monto" inputmode="decimal" value="${deuda}"><p class="nota">Saldo ${L(est.saldo)} + interés pendiente ${L(est.intPend)} + mora ${L(est.moraPend)}</p></div>
    <div><label>Tasa anual (%)</label><input name="tasa" inputmode="decimal" value="${tasa}"></div><div><label>Plazo (meses)</label><input name="plazo" inputmode="numeric" value="${c.plazo_meses}"></div>
    <div><label>Forma de pago</label><select name="frecuencia">${opciones(Object.keys(MESES_FREC), c.frecuencia)}</select></div><div><label>Primera cuota</label><input type="date" name="primera" value="${sumarMeses(hoy(), 1)}"></div>
    <div class="ancho"><label>Motivo</label><input name="motivo" required></div></div><p class="nota" id="reePrev"></p><div class="acciones"><button>Reestructurar</button></div></form>`;
  }
  if (esAdmin() && c.estado === 'Desembolsado') acc += `<h2>Pasar a incobrable</h2><form class="caja" id="fCas"><p class="nota">Solo cuando ya no se espera recuperarlo. Sale de la cartera vigente, pero se guarda todo y se le pueden seguir registrando pagos.</p><div class="rejilla"><div class="ancho"><label>Motivo</label><input name="motivo" required></div></div><div class="acciones"><button class="rojo">Castigar el crédito</button></div></form>`;
  app().innerHTML = cabecera(`Crédito ${c.numero}`, '#/creditos') + `<div class="caja">${estadoChip(c.estado, claseCre(c.estado))}
  <dl class="detalle"><dt>Productor</dt><dd><a href="#/prod/${p.id}">${esc(p.nombre)}</a> ${p.identidad ? '· ' + esc(p.identidad) : ''} ${p.comunidad ? '· ' + esc(p.comunidad) : ''}</dd>
  <dt>Solicitado</dt><dd>${L(c.monto_solicitado)} · ${c.plazo_meses} meses · ${esc(c.frecuencia)} · ${esc(c.destino)}</dd><dt>Garantía</dt><dd>${esc(c.garantia)}${c.comentario ? ' · ' + esc(c.comentario) : ''}</dd>
  ${ev.tecnico ? `<dt>Evaluación</dt><dd>${esc(ev.tecnico)} (${esc(ev.fecha)}): ${esc(ev.recomendacion)} ${ev.monto_recomendado ? L(ev.monto_recomendado) : ''}. ${esc(ev.observaciones || '')}</dd>` : ''}
  ${c.monto_aprobado ? `<dt>Aprobado</dt><dd>${L(c.monto_aprobado)} al ${c.tasa_anual} % anual · ${esc(c.resuelto_por)} · ${fechaHora(c.resuelto)}</dd>` : ''}
  ${c.fecha_desembolso ? `<dt>Desembolsado</dt><dd>${esc(c.fecha_desembolso)}</dd>` : ''}
  ${c.fondo_id ? `<dt>Fondo</dt><dd>${esc(fondos.find(f => f.id === c.fondo_id)?.nombre || '')}</dd>` : ''}
  ${c.origen_id ? `<dt>Viene de</dt><dd><a href="#/cred/${c.origen_id}">Crédito reestructurado</a></dd>` : ''}
  ${otros.find(o => o.estado === 'Desembolsado' && o.id !== id && c.estado === 'Reestructurado') ? `<dt>Pasó a</dt><dd>${otros.filter(o => o.estado === 'Desembolsado' && o.id !== id).map(o => `<a href="#/cred/${o.id}">${esc(o.numero)}</a>`).join(', ')}</dd>` : ''}
  ${c.castigo_fecha ? `<dt>Castigado</dt><dd>${esc(c.castigo_fecha)} · ${esc(c.castigo_motivo || '')}</dd>` : ''}
  ${calif ? `<dt>Historial</dt><dd>${chipCalif(calif)}</dd>` : ''}</dl>
  ${esJefe() ? `<p><a href="#/edocta/${p.id}">Ver estado de cuenta del productor</a></p>` : ''}
  ${est ? `<div class="tarjetas" style="margin-top:12px"><div class="tarjeta"><span>Saldo de capital</span><b>${L(est.saldo)}</b></div><div class="tarjeta"><span>Atrasado</span><b class="${est.atraso ? 'error' : ''}">${L(est.atraso)}</b><span>${est.dias ? est.dias + ' días de mora' : 'Al día'}</span></div>${est.moraPend ? `<div class="tarjeta"><span>Mora</span><b class="error">${L(est.moraPend)}</b></div>` : ''}<div class="tarjeta"><span>Próxima cuota</span><b>${est.prox ? L(est.prox.cuota) : '—'}</b><span>${est.prox ? esc(est.prox.fecha) : ''}</span></div></div>` : ''}
  </div>
  ${c.plan ? `<h2>Plan de pagos</h2><div class="tabla"><table><thead><tr><th>#</th><th>Fecha</th><th class="n">Capital</th><th class="n">Interés</th><th class="n">Cuota</th><th class="n">Saldo</th></tr></thead><tbody>${c.plan.map(x => `<tr${x.fecha < hoy() ? ' style="color:var(--gris)"' : ''}><td>${x.n}</td><td>${esc(x.fecha)}</td><td class="n">${L(x.capital)}</td><td class="n">${L(x.interes)}</td><td class="n">${L(x.cuota)}</td><td class="n">${L(x.saldo)}</td></tr>`).join('')}</tbody></table></div>` : ''}
  ${pagos.length ? `<h2>Pagos recibidos</h2><div class="tabla"><table><thead><tr><th>Fecha</th><th>Recibo</th><th class="n">Monto</th><th class="n">Mora</th><th class="n">Interés</th><th class="n">Capital</th></tr></thead><tbody>${pagos.map(x => `<tr><td>${esc(x.fecha)}</td><td>${esc(x.recibo)}</td><td class="n">${L(x.monto)}</td><td class="n">${L(x.mora)}</td><td class="n">${L(x.interes)}</td><td class="n">${L(x.capital)}</td></tr>`).join('')}</tbody></table></div>` : ''}
  ${acc}<div class="acciones"><button class="sec" onclick="print()">Imprimir</button>${esJefe() && ['Solicitado', 'En evaluación', 'Aprobado'].includes(c.estado) ? '<button class="sec" id="anular">Anular solicitud</button>' : ''}</div>`;

  const recargar = () => { avisar('credito', id); RUTAS.cred(id); };
  const fVoto = $('#fVoto'); if (fVoto) fVoto.onsubmit = async e => {
    e.preventDefault(); const d = datosForm(fVoto);
    if (d.voto === 'A favor' && num(d.monto) <= 0) return aviso('Poné el monto que aprobás.', true);
    if (d.voto === 'En contra' && !d.comentario) return aviso('Escribí por qué votás en contra.', true);
    if (!confirm(`¿Confirmás tu voto «${d.voto}»? Después no se puede cambiar.`)) return;
    ocupado(fVoto, true);
    try { await q(sb.from('votos_credito').insert({ org_id: S.org.id, credito_id: id, nombre: nombreQuien(), voto: d.voto, monto: d.voto === 'A favor' ? num(d.monto) : null, comentario: d.comentario || null })); aviso('Voto registrado.'); recargar(); }
    catch (er) { ocupado(fVoto, false); aviso(falla(er), true); }
  };
  const fEv = $('#fEv'); if (fEv) fEv.onsubmit = async e => {
    e.preventDefault(); const d = datosForm(fEv); ocupado(fEv, true);
    try { await q(sb.from('creditos').update({ evaluacion: d, estado: 'En evaluación' }).eq('id', id)); aviso('Evaluación guardada.'); recargar(); } catch (er) { ocupado(fEv, false); aviso(falla(er), true); }
  };
  const fAp = $('#fAp'); if (fAp) fAp.onsubmit = async e => {
    e.preventDefault(); const dec = e.submitter?.value || 'Aprobado', d = datosForm(fAp);
    if (dec === 'Aprobado') {
      if (num(d.monto) <= 0) return aviso('Poné el monto aprobado.', true);
      if (num(d.monto) > limGer && modo !== 'Gerencia' && com.miembros) return aviso(`Arriba de ${L(limGer)} el crédito lo vota el comité.`, true);
      if (S.rol === 'gerencia' && num(d.monto) > limGer) return aviso(`Este monto lo aprueba el administrador (gerencia hasta ${L(limGer)}).`, true);
    } else if (!d.comentario) return aviso('Escribí por qué se rechaza.', true);
    if (dec === 'Rechazado' && !confirm('¿Rechazar este crédito?')) return;
    ocupado(fAp, true);
    try { await q(sb.from('creditos').update(dec === 'Aprobado' ? { estado: dec, monto_aprobado: num(d.monto), tasa_anual: num(d.tasa), plazo_meses: +d.plazo, fondo_id: d.fondo_id || null, comentario: d.comentario || c.comentario } : { estado: dec, comentario: d.comentario }).eq('id', id)); aviso('Crédito ' + dec.toLowerCase() + '.'); recargar(); }
    catch (er) { ocupado(fAp, false); aviso(falla(er), true); }
  };
  const fDes = $('#fDes'); if (fDes) {
    const prev = () => { const d = datosForm(fDes); if (!d.primera) return; const pl = armarPlan(c.monto_aprobado, c.tasa_anual, c.plazo_meses, c.frecuencia, d.primera); $('#planPrev').innerHTML = `<p class="nota">${pl.length} cuota${pl.length > 1 ? 's' : ''} de ${L(pl[0].cuota)} · intereses totales ${L(pl.reduce((t, x) => t + x.interes, 0))}.</p>`; };
    fDes.oninput = prev; prev();
    fDes.onsubmit = async e => {
      e.preventDefault(); const d = datosForm(fDes); ocupado(fDes, true);
      try { await q(sb.from('creditos').update({ estado: 'Desembolsado', fecha_desembolso: d.fecha, primera_cuota: d.primera, fondo_id: d.fondo_id || null, plan: armarPlan(c.monto_aprobado, c.tasa_anual, c.plazo_meses, c.frecuencia, d.primera), comentario: [c.comentario, d.referencia].filter(Boolean).join(' · ') }).eq('id', id)); aviso('Desembolso registrado.'); recargar(); }
      catch (er) { ocupado(fDes, false); aviso(falla(er), true); }
    };
  }
  const fPag = $('#fPag'); if (fPag) {
    const repartir = () => {
      const d = datosForm(fPag), e2 = estadoCredito(c, pagos, d.fecha || hoy());
      let resto = num(d.monto), mora = Math.min(resto, num(d.mora)); resto -= mora;
      const interes = Math.min(resto, e2.intPend); resto -= interes;
      const capital = Math.min(resto, e2.saldo); return { mora: r2(mora), interes: r2(interes), capital: r2(capital), sobra: r2(resto - capital) };
    };
    fPag.oninput = () => { const r = repartir(); $('#repart').textContent = `Se aplica: mora ${L(r.mora)} · interés ${L(r.interes)} · capital ${L(r.capital)}${r.sobra > 0 ? ` · sobran ${L(r.sobra)} (más que el saldo)` : ''}.`; };
    fPag.oninput();
    fPag.onsubmit = async e => {
      e.preventDefault(); const d = datosForm(fPag), r = repartir();
      if (num(d.monto) <= 0) return aviso('Poné el monto recibido.', true);
      if (r.sobra > 0) return aviso('El pago es mayor que lo que se debe.', true);
      ocupado(fPag, true);
      try {
        await q(sb.from('pagos_credito').insert({ org_id: S.org.id, credito_id: id, fecha: d.fecha, monto: num(d.monto), mora: r.mora, interes: r.interes, capital: r.capital, recibo: d.recibo }));
        if (est.saldo - r.capital <= 0.01) await q(sb.from('creditos').update({ estado: 'Pagado' }).eq('id', id));
        await q(sb.from('bitacora').insert({ org_id: S.org.id, usuario: nombreUsuario(), accion: 'Pago de crédito', detalle: `${c.numero} · ${L(d.monto)}${d.recibo ? ' · recibo ' + d.recibo : ''}` }));
        aviso('Pago registrado.'); recargar();
      } catch (er) { ocupado(fPag, false); aviso(falla(er), true); }
    };
  }
  const cap = $('#capac'); if (cap) capacidadPago(c, otros).then(k => {
    cap.innerHTML = `<b>Capacidad de pago</b><p class="nota" style="margin:4px 0">Estimado de cosecha <b>${qqTxt(k.qq)}</b> × precio de referencia <b>${L(k.precio)}</b> por qq${k.precio && !cfgN('CREDITO_PRECIO_QQ_REF', 0) ? ' (promedio del acopio del último año)' : ''} = ingreso de <b>${L(k.ingreso)}</b>. Puede usar el ${k.pct} % para pagar deudas${k.cuotasOtros ? `, menos ${L(k.cuotasOtros)} de cuotas de otros créditos en los próximos 12 meses` : ''}: <b>${L(k.capacidad)}</b> al año.</p>
      ${!k.qq ? '<p class="nota error">El productor no tiene estimado de cosecha en sus parcelas: no se puede calcular.</p>' : !k.precio ? '<p class="nota error">Falta el precio de referencia (Configuración › precio de referencia por quintal).</p>' : `<p style="margin:4px 0">Monto máximo sugerido con este plazo y forma de pago: <b>${L(k.montoMax)}</b>${num(c.monto_solicitado) > k.montoMax ? ' · <span class="error">lo solicitado pasa la capacidad</span>' : ''}</p><button type="button" class="sec" id="usarCap">Usar estos números</button>`}`;
    const u = $('#usarCap'); if (u) u.onclick = () => { const f = $('#fEv'); f.produccion.value = k.qq; f.ingreso.value = k.ingreso; if (!f.deudas.value) f.deudas.value = k.cuotasOtros; f.monto_recomendado.value = Math.min(num(c.monto_solicitado), k.montoMax); if (num(c.monto_solicitado) > k.montoMax) f.recomendacion.value = 'Aprobar con menor monto'; };
  }).catch(() => { cap.innerHTML = '<p class="nota">No se pudo calcular la capacidad de pago.</p>'; });
  app().querySelectorAll('[data-doc]').forEach(a => a.onclick = async e => { e.preventDefault(); const { data, error } = await sb.storage.from('documentos').createSignedUrl(a.dataset.doc, 300); if (error) return aviso(falla(error), true); window.open(data.signedUrl, '_blank', 'noopener'); });
  const fGar = $('#fGar'); if (fGar) fGar.onsubmit = async e => {
    e.preventDefault(); const d = datosForm(fGar), arch = fGar.doc.files[0];
    if (!d.nombre && !d.descripcion && !arch) return aviso('Poné el nombre, el detalle o el documento.', true);
    if (arch && arch.size > 10 * 1024 * 1024) return aviso('El archivo pasa de 10 MB.', true);
    ocupado(fGar, true);
    try {
      let ruta = null;
      if (arch) { ruta = `${S.org.id}/garantias/${id}/${Date.now()}-${arch.name.replace(/[^\w.\-]+/g, '_')}`; const { error } = await sb.storage.from('documentos').upload(ruta, arch, { contentType: arch.type || undefined }); if (error) throw error; }
      await q(sb.from('credito_garantias').insert({ org_id: S.org.id, credito_id: id, tipo: d.tipo, nombre: d.nombre || null, identidad: d.identidad || null, telefono: d.telefono || null, descripcion: d.descripcion || null, qq_comprometidos: d.qq_comprometidos ? num(d.qq_comprometidos) : null, valor: d.valor ? num(d.valor) : null, documento: ruta }));
      aviso('Garantía agregada.'); recargar();
    } catch (er) { ocupado(fGar, false); aviso(falla(er), true); }
  };
  const fRee = $('#fRee'); if (fRee) {
    const prev = () => { const d = datosForm(fRee); if (!d.primera || num(d.monto) <= 0) return; const pl = armarPlan(num(d.monto), num(d.tasa), +d.plazo || 1, d.frecuencia, d.primera); $('#reePrev').textContent = `${pl.length} cuota${pl.length > 1 ? 's' : ''} de ${L(pl[0].cuota)} · intereses totales ${L(pl.reduce((t, x) => t + x.interes, 0))}.`; };
    fRee.oninput = prev; prev();
    fRee.onsubmit = async e => {
      e.preventDefault(); const d = datosForm(fRee);
      if (num(d.monto) <= 0 || !(+d.plazo > 0)) return aviso('Revisá el monto y el plazo.', true);
      if (!confirm(`¿Reestructurar ${c.numero} en un crédito nuevo de ${L(d.monto)} a ${d.plazo} meses?`)) return;
      ocupado(fRee, true);
      try { const nuevo = await q(sb.rpc('reestructurar_credito', { c: id, monto: num(d.monto), tasa: num(d.tasa), plazo: +d.plazo, frecuencia: d.frecuencia, primera: d.primera, plan: armarPlan(num(d.monto), num(d.tasa), +d.plazo, d.frecuencia, d.primera), motivo: d.motivo })); aviso('Crédito reestructurado.'); avisar('credito', id); archivarLuego(true); location.hash = '#/cred/' + nuevo; }
      catch (er) { ocupado(fRee, false); aviso(falla(er), true); }
    };
  }
  const fCas = $('#fCas'); if (fCas) fCas.onsubmit = async e => {
    e.preventDefault(); const d = datosForm(fCas);
    if (!confirm(`¿Pasar ${c.numero} a incobrable? Sale de la cartera vigente.`)) return;
    ocupado(fCas, true);
    try { await q(sb.from('creditos').update({ estado: 'Castigado', castigo_motivo: d.motivo, castigo_fecha: hoy() }).eq('id', id)); aviso('Crédito castigado.'); archivarLuego(true); recargar(); }
    catch (er) { ocupado(fCas, false); aviso(falla(er), true); }
  };
  const an = $('#anular'); if (an) an.onclick = async () => {
    const m = prompt('¿Por qué se anula?'); if (!m) return;
    try { await q(sb.from('creditos').update({ estado: 'Anulado', comentario: m }).eq('id', id)); aviso('Solicitud anulada.'); recargar(); } catch (er) { aviso(falla(er), true); }
  };
};

// ---------- historial, capacidad de pago y mensajes ----------
function atrasoMaximo(c, pagos) {
  const plan = c.plan || [], ps = pagos.filter(p => p.credito_id === c.id).slice().sort((a, b) => a.fecha < b.fecha ? -1 : 1);
  let acumC = 0, max = 0;
  for (const cu of plan) {
    if (cu.fecha > hoy()) break; acumC += num(cu.cuota);
    let s = 0, cuando = null; for (const p of ps) { s += num(p.capital) + num(p.interes); if (s >= acumC - 0.5) { cuando = p.fecha; break; } }
    max = Math.max(max, diasEntre(cu.fecha, cuando || hoy()));
  }
  return max;
}
function calificacion(creditos, pagos) {
  const usados = creditos.filter(c => ['Desembolsado', 'Pagado', 'Reestructurado', 'Castigado'].includes(c.estado));
  if (!usados.length) return { letra: '', txt: 'Sin historial de crédito' };
  if (usados.some(c => c.estado === 'Castigado')) return { letra: 'E', txt: 'Tiene un crédito pasado a incobrable' };
  const max = Math.max(0, ...usados.map(c => atrasoMaximo(c, pagos)));
  let letra = max <= 7 ? 'A' : max <= 30 ? 'B' : max <= 90 ? 'C' : 'D';
  if (usados.some(c => c.estado === 'Reestructurado') && letra < 'C') letra = 'C';
  return { letra, txt: `${usados.length} crédito${usados.length > 1 ? 's' : ''}; el mayor atraso fue de ${max} día${max === 1 ? '' : 's'}${usados.some(c => c.estado === 'Reestructurado') ? '; tuvo una reestructuración' : ''}` };
}
const chipCalif = k => k.letra ? `<span class="estado" title="${esc(k.txt)}" style="background:${{ A: '#dcfce7;color:#166534', B: '#e0f2fe;color:#075985', C: '#fef3c7;color:#92400e', D: '#fee2e2;color:#991b1b', E: '#1f2937;color:#fff' }[k.letra]}">Calificación ${k.letra}</span> <span class="nota">${esc(k.txt)}</span>` : `<span class="nota">${esc(k.txt)}</span>`;
async function capacidadPago(c, otros) {
  const [parc, aco] = await Promise.all([q(sb.from('parcelas').select('area_ha,datos').eq('productor_id', c.productor_id)),
    q(sb.from('acopio').select('precio_lb').eq('org_id', S.org.id).not('precio_lb', 'is', null).gte('fecha', sumarMeses(hoy(), -12)).limit(2000))]);
  const qq = parc.reduce((t, p) => t + estimadoParcela(p), 0);
  const precioAco = aco.length ? aco.reduce((t, a) => t + num(a.precio_lb), 0) / aco.length * 100 : 0;
  const precio = cfgN('CREDITO_PRECIO_QQ_REF', 0) || r2(precioAco), pct = cfgN('CREDITO_PCT_CAPACIDAD', 40);
  const ingreso = r2(qq * precio), hasta = sumarMeses(hoy(), 12);
  const cuotasOtros = r2(otros.filter(o => o.id !== c.id && o.estado === 'Desembolsado').reduce((t, o) => t + (o.plan || []).filter(x => x.fecha > hoy() && x.fecha <= hasta).reduce((s, x) => s + num(x.cuota), 0), 0));
  const capacidad = r2(ingreso * pct / 100 - cuotasOtros);
  const tasa = c.tasa_anual ?? cfgN('CREDITO_TASA_ANUAL', 18), pl = armarPlan(1000, tasa, c.plazo_meses, c.frecuencia, sumarMeses(hoy(), MESES_FREC[c.frecuencia] || c.plazo_meses));
  const anio = pl.filter(x => x.fecha <= hasta).reduce((t, x) => t + x.cuota, 0) || pl.reduce((t, x) => t + x.cuota, 0) / Math.max(1, c.plazo_meses / 12);
  const montoMax = capacidad > 0 && anio > 0 ? Math.floor(capacidad / (anio / 1000) / 100) * 100 : 0;
  return { qq: r2(qq), precio, precioAco: r2(precioAco), pct, ingreso, cuotasOtros, capacidad, montoMax };
}
const waLink = (tel, texto) => { const t = String(tel || '').replace(/\D/g, ''); return 'https://wa.me/' + (t ? (t.length === 8 ? '504' + t : t) : '') + '?text=' + encodeURIComponent(texto); };
async function creditosConPagos(filtro) {
  let qc = sb.from('creditos').select('*, productores(id,codigo,nombre,comunidad,telefono)').eq('org_id', S.org.id); if (filtro) qc = filtro(qc);
  const [cre, pagos] = await Promise.all([q(qc.limit(5000)), q(sb.from('pagos_credito').select('credito_id,fecha,monto,capital,interes,mora,recibo').eq('org_id', S.org.id).limit(20000))]);
  return { cre, pagos, de: id => pagos.filter(p => p.credito_id === id) };
}

RUTAS.edocta = async function estadoDeCuenta(prodId) {
  if (!esJefe()) return RUTAS.cre();
  const p = await q(sb.from('productores').select('*').eq('id', prodId).single());
  const { cre, de } = await creditosConPagos(x => x.eq('productor_id', prodId).in('estado', ['Desembolsado', 'Pagado', 'Reestructurado', 'Castigado', 'Aprobado']).order('creado'));
  const allP = cre.flatMap(c => de(c.id)), k = calificacion(cre, allP);
  const filas = cre.map(c => ({ c, e: c.plan ? estadoCredito(c, de(c.id)) : null }));
  const vig = filas.filter(x => ['Desembolsado', 'Castigado'].includes(x.c.estado) && x.e);
  const totSaldo = vig.reduce((t, x) => t + x.e.saldo, 0), totAtraso = vig.reduce((t, x) => t + x.e.atraso + x.e.moraPend, 0);
  const texto = [`*${S.org.nombre}*`, `Estado de cuenta al ${hoy()}`, `${p.codigo || ''} ${p.nombre}`, ...vig.map(x => `Crédito ${x.c.numero}: saldo ${L(x.e.saldo)}${x.e.atraso ? ` · atrasado ${L(x.e.atraso)}` : ' · al día'}${x.e.moraPend ? ` · mora ${L(x.e.moraPend)}` : ''}${x.e.prox ? ` · próxima cuota ${L(x.e.prox.cuota)} el ${x.e.prox.fecha}` : ''}`), vig.length ? `*Total que debe: ${L(totSaldo)}*` : 'No tiene créditos pendientes.'].join('\n');
  app().innerHTML = cabecera('Estado de cuenta', '#/prod/' + prodId) + `<div class="caja"><p style="margin:0"><b>${esc(S.org.nombre)}</b> · Estado de cuenta al ${esc(hoy())}</p>
    <p><b>${esc(p.codigo || '')} ${esc(p.nombre)}</b>${p.identidad ? ' · ' + esc(p.identidad) : ''}${p.comunidad ? ' · ' + esc(p.comunidad) : ''}</p><p>${chipCalif(k)}</p>
    <div class="tarjetas"><div class="tarjeta"><span>Saldo total</span><b>${L(totSaldo)}</b></div><div class="tarjeta"><span>Atrasado y mora</span><b class="${totAtraso ? 'error' : ''}">${L(totAtraso)}</b></div></div></div>
  ${filas.map(({ c, e }) => `<h2><a href="#/cred/${c.id}">${esc(c.numero)}</a> · ${esc(c.destino || '')} ${estadoChip(c.estado, claseCre(c.estado))}</h2>
    <div class="caja"><p>Desembolsado ${L(c.monto_aprobado)} el ${esc(c.fecha_desembolso || '—')} al ${num(c.tasa_anual)} % anual · ${c.plazo_meses} meses · pago ${esc(c.frecuencia).toLowerCase()}</p>
    ${e ? `<p>Saldo de capital <b>${L(e.saldo)}</b> · atrasado <b class="${e.atraso ? 'error' : ''}">${L(e.atraso)}</b>${e.dias ? ` (${e.dias} días)` : ''} · mora ${L(e.moraPend)} · interés pendiente ${L(e.intPend)}${e.prox ? ` · próxima cuota ${L(e.prox.cuota)} el ${esc(e.prox.fecha)}` : ''}</p>` : ''}
    ${de(c.id).length ? `<div class="tabla"><table><thead><tr><th>Fecha</th><th>Recibo</th><th class="n">Pagó</th><th class="n">Mora</th><th class="n">Interés</th><th class="n">Capital</th></tr></thead><tbody>${de(c.id).sort((a, b) => a.fecha < b.fecha ? -1 : 1).map(x => `<tr><td>${esc(x.fecha)}</td><td>${esc(x.recibo || '')}</td><td class="n">${L(x.monto)}</td><td class="n">${L(x.mora)}</td><td class="n">${L(x.interes)}</td><td class="n">${L(x.capital)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="nota">Sin pagos.</p>'}</div>`).join('') || '<p class="nota">Este productor no tiene créditos desembolsados.</p>'}
  <div class="acciones"><button onclick="print()">Imprimir</button><a class="boton sec" target="_blank" rel="noopener" href="${esc(waLink(p.telefono, texto))}">Mandar por WhatsApp</a></div>`;
};

RUTAS.recordatorios = async function verRecordatorios() {
  if (!esJefe()) return RUTAS.cre();
  const dias = cfgN('CREDITO_DIAS_RECORDATORIO', 7), { cre, de } = await creditosConPagos(x => x.in('estado', ['Desembolsado', 'Castigado']));
  const filas = cre.map(c => ({ c, e: estadoCredito(c, de(c.id)) })).map(x => ({ ...x, tipo: x.e.atraso > 0.5 ? 'Atrasado' : x.e.prox && diasEntre(hoy(), x.e.prox.fecha) <= dias ? 'Vence pronto' : null })).filter(x => x.tipo)
    .sort((a, b) => (a.tipo === b.tipo ? 0 : a.tipo === 'Atrasado' ? -1 : 1) || b.e.dias - a.e.dias);
  const msg = ({ c, e, tipo }) => tipo === 'Atrasado'
    ? `Buenos días, ${c.productores?.nombre}. Le escribimos de ${S.org.nombre}. Su crédito ${c.numero} tiene ${L(e.atraso)} atrasados${e.primeraImpaga ? ' desde el ' + e.primeraImpaga : ''}${e.moraPend ? ', más ' + L(e.moraPend) + ' de mora' : ''}. Le pedimos pasar a ponerse al día. Si ya pagó, no tome en cuenta este mensaje.`
    : `Buenos días, ${c.productores?.nombre}. Le escribimos de ${S.org.nombre} para recordarle que su cuota de ${L(e.prox.cuota)} del crédito ${c.numero} vence el ${e.prox.fecha}. Muchas gracias.`;
  app().innerHTML = cabecera('Recordatorios de cuotas', '#/cre') + `<p class="nota">Créditos atrasados y cuotas que vencen en los próximos ${dias} días. El botón abre WhatsApp con el mensaje listo; revisalo antes de mandarlo.</p>
  <div class="tabla"><table><thead><tr><th>Productor</th><th>Teléfono</th><th>Crédito</th><th>Situación</th><th class="n">Monto</th><th></th></tr></thead><tbody>
  ${filas.map(x => `<tr><td><a href="#/edocta/${x.c.productor_id}">${esc(x.c.productores?.nombre || '')}</a></td><td>${esc(x.c.productores?.telefono || '—')}</td><td><a href="#/cred/${x.c.id}">${esc(x.c.numero)}</a></td>
    <td>${x.tipo === 'Atrasado' ? `<span class="error">Atrasado ${x.e.dias} días</span>` : 'Vence el ' + esc(x.e.prox.fecha)}</td><td class="n">${L(x.tipo === 'Atrasado' ? x.e.atraso + x.e.moraPend : x.e.prox.cuota)}</td>
    <td>${x.c.productores?.telefono ? `<a class="boton sec" target="_blank" rel="noopener" href="${esc(waLink(x.c.productores.telefono, msg(x)))}">WhatsApp</a>` : '<span class="nota">Sin teléfono</span>'}</td></tr>`).join('') || '<tr><td colspan="6" class="nota">No hay cuotas atrasadas ni por vencer.</td></tr>'}</tbody></table></div>`;
};

RUTAS.fondos = async function verFondos() {
  if (!esJefe()) return RUTAS.cre();
  const [fondos, { cre, pagos }] = await Promise.all([q(sb.from('fondos_credito').select('*').eq('org_id', S.org.id).order('nombre')), creditosConPagos(x => x.not('fondo_id', 'is', null))]);
  const calc = f => {
    const cs = cre.filter(c => c.fondo_id === f.id), ids = new Set(cs.map(c => c.id));
    const salio = cs.filter(c => c.fecha_desembolso && !c.origen_id).reduce((t, c) => t + num(c.monto_aprobado), 0);
    const volvio = pagos.filter(p => ids.has(p.credito_id)).reduce((t, p) => t + num(p.capital), 0);
    const saldo = cs.filter(c => ['Desembolsado'].includes(c.estado)).reduce((t, c) => t + estadoCredito(c, pagos.filter(p => p.credito_id === c.id)).saldo, 0);
    return { salio, volvio, saldo, disp: num(f.monto_asignado) - salio + volvio, n: cs.length };
  };
  app().innerHTML = cabecera('Fondos de crédito', '#/cre') + `<div class="tabla"><table><thead><tr><th>Fondo</th><th>Fuente</th><th class="n">Asignado</th><th class="n">Prestado</th><th class="n">Recuperado</th><th class="n">En la calle</th><th class="n">Disponible</th></tr></thead><tbody>
  ${fondos.map(f => { const x = calc(f); return `<tr${f.activo ? '' : ' style="color:var(--gris)"'}><td>${esc(f.nombre)}</td><td>${esc(f.fuente || '')}</td><td class="n">${L(f.monto_asignado)}</td><td class="n">${L(x.salio)}</td><td class="n">${L(x.volvio)}</td><td class="n">${L(x.saldo)}</td><td class="n ${x.disp < 0 ? 'error' : ''}"><b>${L(x.disp)}</b></td></tr>`; }).join('') || '<tr><td colspan="7" class="nota">Todavía no hay fondos registrados.</td></tr>'}</tbody></table></div>
  <p class="nota">Disponible = asignado − lo prestado + el capital que ya volvió. Cada crédito se amarra a su fondo al aprobarlo o al desembolsarlo. Las reestructuraciones no cuentan como dinero nuevo.</p>
  ${esAdmin() ? `<h2>Agregar o cambiar un fondo</h2><form class="caja" id="f"><div class="rejilla">
    <div><label>Fondo</label><select name="id"><option value="">Fondo nuevo</option>${fondos.map(f => `<option value="${f.id}">${esc(f.nombre)}</option>`).join('')}</select></div>
    <div><label>Nombre</label><input name="nombre" required placeholder="Fondo rotatorio"></div><div><label>Fuente</label><input name="fuente" placeholder="Propio, proyecto, donante"></div>
    <div><label>Monto asignado (L)</label><input name="monto_asignado" inputmode="decimal" required></div><div><label>¿Activo?</label><select name="activo">${opciones(['Sí', 'No'])}</select></div>
    <div class="ancho"><label>Notas</label><input name="notas"></div></div><div class="acciones"><button>Guardar</button></div></form>` : ''}`;
  const f = $('#f'); if (!f) return;
  f.id.onchange = () => { const x = fondos.find(y => y.id === f.id.value) || {}; f.nombre.value = x.nombre || ''; f.fuente.value = x.fuente || ''; f.monto_asignado.value = x.monto_asignado ?? ''; f.notas.value = x.notas || ''; f.activo.value = x.activo === false ? 'No' : 'Sí'; };
  f.onsubmit = async ev => { ev.preventDefault(); const d = datosForm(f), reg = { nombre: d.nombre, fuente: d.fuente || null, monto_asignado: num(d.monto_asignado), activo: d.activo === 'Sí', notas: d.notas || null }; ocupado(f, true);
    try { if (d.id) await q(sb.from('fondos_credito').update(reg).eq('id', d.id)); else await q(sb.from('fondos_credito').insert({ ...reg, org_id: S.org.id })); aviso('Fondo guardado.'); RUTAS.fondos(); } catch (e) { ocupado(f, false); aviso(falla(e), true); } };
};

RUTAS.reportescre = async function reportesCartera() {
  if (!esJefe()) return RUTAS.cre();
  const [{ cre, pagos, de }, fondos] = await Promise.all([creditosConPagos(x => x.in('estado', ['Desembolsado', 'Pagado', 'Reestructurado', 'Castigado'])), q(sb.from('fondos_credito').select('id,nombre').eq('org_id', S.org.id))]);
  const vig = cre.filter(c => c.estado === 'Desembolsado').map(c => ({ c, e: estadoCredito(c, de(c.id)) }));
  const cast = cre.filter(c => c.estado === 'Castigado').map(c => ({ c, e: estadoCredito(c, de(c.id)) }));
  const total = vig.reduce((t, x) => t + x.e.saldo, 0), par = d => vig.filter(x => x.e.dias > d).reduce((t, x) => t + x.e.saldo, 0);
  const tabla = lista(S.cfg.CREDITO_PROVISION).map(l => l.split(':').map(s => num(s))).filter(x => x.length === 2).sort((a, b) => a[0] - b[0]);
  const pctProv = d => (tabla.filter(x => x[0] <= d).pop() || [0, 0])[1];
  const prov = vig.reduce((t, x) => t + x.e.saldo * pctProv(x.e.dias) / 100, 0);
  const meses = Array.from({ length: 12 }, (_, i) => sumarMeses(hoy().slice(0, 7) + '-01', i - 11).slice(0, 7));
  const prog = m => cre.reduce((t, c) => t + (c.plan || []).filter(x => x.fecha.startsWith(m)).reduce((s, x) => s + num(x.cuota), 0), 0);
  const rec = m => pagos.filter(p => p.fecha.startsWith(m)).reduce((t, p) => t + num(p.capital) + num(p.interes) + num(p.mora), 0);
  const porFondo = {}; vig.forEach(x => { const n = fondos.find(f => f.id === x.c.fondo_id)?.nombre || 'Sin fondo'; porFondo[n] = (porFondo[n] || 0) + x.e.saldo; });
  const pct = (a, b) => b ? (a / b * 100).toFixed(1) + ' %' : '—';
  app().innerHTML = cabecera('Reportes de cartera', '#/cre') + `<p class="nota">${esc(S.org.nombre)} · al ${esc(hoy())}</p><div class="tarjetas">
    <div class="tarjeta"><span>Cartera vigente</span><b>${L(total)}</b><span>${vig.length} créditos</span></div>
    <div class="tarjeta"><span>PAR 30 (atraso de más de 30 días)</span><b class="${par(30) ? 'error' : ''}">${pct(par(30), total)}</b><span>${L(par(30))}</span></div>
    <div class="tarjeta"><span>PAR 90</span><b class="${par(90) ? 'error' : ''}">${pct(par(90), total)}</b><span>${L(par(90))}</span></div>
    <div class="tarjeta"><span>Provisión estimada</span><b>${L(prov)}</b><span>${pct(prov, total)} de la cartera</span></div>
    <div class="tarjeta"><span>Cartera castigada</span><b>${L(cast.reduce((t, x) => t + x.e.saldo, 0))}</b><span>${cast.length} créditos</span></div></div>
  <h2>Programado contra recuperado (últimos 12 meses)</h2><div class="tabla"><table><thead><tr><th>Mes</th><th class="n">Cuotas programadas</th><th class="n">Recuperado</th><th class="n">Cumplimiento</th></tr></thead><tbody>
  ${meses.map(m => `<tr><td>${esc(m)}</td><td class="n">${L(prog(m))}</td><td class="n">${L(rec(m))}</td><td class="n">${pct(rec(m), prog(m))}</td></tr>`).join('')}</tbody></table></div>
  <h2>Provisión por antigüedad</h2><div class="tabla"><table><thead><tr><th>Atraso desde</th><th class="n">% a provisionar</th><th class="n">Saldo</th><th class="n">Provisión</th></tr></thead><tbody>
  ${tabla.map(([d, p], i) => { const hasta = tabla[i + 1] ? tabla[i + 1][0] - 1 : 1e9, s = vig.filter(x => x.e.dias >= d && x.e.dias <= hasta).reduce((t, x) => t + x.e.saldo, 0); return `<tr><td>${d === 0 ? 'Al día' : d + ' días'}</td><td class="n">${p} %</td><td class="n">${L(s)}</td><td class="n">${L(s * p / 100)}</td></tr>`; }).join('')}</tbody></table></div>
  <h2>Saldo por fondo</h2><div class="tabla"><table><thead><tr><th>Fondo</th><th class="n">Saldo</th><th class="n">%</th></tr></thead><tbody>${Object.entries(porFondo).map(([n, v]) => `<tr><td>${esc(n)}</td><td class="n">${L(v)}</td><td class="n">${pct(v, total)}</td></tr>`).join('') || '<tr><td colspan="3" class="nota">Sin cartera vigente.</td></tr>'}</tbody></table></div>
  ${cast.length ? `<h2>Créditos castigados</h2><div class="tabla"><table><thead><tr><th>Crédito</th><th>Productor</th><th>Fecha</th><th>Motivo</th><th class="n">Saldo</th></tr></thead><tbody>${cast.map(x => `<tr><td><a href="#/cred/${x.c.id}">${esc(x.c.numero)}</a></td><td>${esc(x.c.productores?.nombre || '')}</td><td>${esc(x.c.castigo_fecha || '')}</td><td>${esc(x.c.castigo_motivo || '')}</td><td class="n">${L(x.e.saldo)}</td></tr>`).join('')}</tbody></table></div>` : ''}
  <p class="nota">PAR = parte de la cartera con cuotas atrasadas por más de esos días. La tabla de provisión se ajusta en Configuración. La cartera castigada ya no cuenta en la cartera vigente, pero sus pagos siguen entrando como recuperación.</p>
  <div class="acciones"><button onclick="print()">Imprimir</button></div>`;
};

RUTAS.cartera = async function verCartera() {
  if (!esJefe()) return RUTAS.cre();
  const [cre, pagos] = await Promise.all([
    q(sb.from('creditos').select('id,numero,productor_id,monto_aprobado,plan,estado,fecha_desembolso,productores(nombre,comunidad)').eq('org_id', S.org.id).eq('estado', 'Desembolsado')),
    q(sb.from('pagos_credito').select('credito_id,capital,interes,mora,fecha').eq('org_id', S.org.id))
  ]);
  const filas = cre.map(c => ({ c, e: estadoCredito(c, pagos.filter(p => p.credito_id === c.id)) })).sort((a, b) => b.e.dias - a.e.dias);
  const total = filas.reduce((t, x) => t + x.e.saldo, 0), tramo = (a, b) => filas.filter(x => x.e.dias >= a && x.e.dias <= b).reduce((t, x) => t + x.e.saldo, 0);
  const t = [['Al día', tramo(0, 0)], ['1 a 30 días', tramo(1, 30)], ['31 a 60', tramo(31, 60)], ['61 a 90', tramo(61, 90)], ['Más de 90', tramo(91, 1e9)]];
  const mes = hoy().slice(0, 7), recMes = pagos.filter(p => p.fecha.startsWith(mes));
  app().innerHTML = cabecera('Cartera de crédito') + `<div class="tarjetas">
    <div class="tarjeta"><span>Cartera vigente</span><b style="font-size:22px">${L(total)}</b><span>${filas.length} créditos</span></div>
    <div class="tarjeta"><span>Cartera en riesgo (más de 30 días)</span><b style="font-size:22px">${total ? ((total - tramo(0, 30)) / total * 100).toFixed(1) : 0} %</b><span>${L(total - tramo(0, 30))}</span></div>
    <div class="tarjeta"><span>Recuperado este mes</span><b style="font-size:22px">${L(recMes.reduce((s, p) => s + num(p.capital), 0))}</b><span>Intereses ${L(recMes.reduce((s, p) => s + num(p.interes), 0))}</span></div>
  </div>
  <h2>Antigüedad de la mora</h2><div class="tabla"><table><thead><tr>${t.map(x => `<th class="n">${x[0]}</th>`).join('')}</tr></thead><tbody><tr>${t.map(x => `<td class="n">${L(x[1])}<br><span class="nota">${total ? (x[1] / total * 100).toFixed(1) : 0} %</span></td>`).join('')}</tr></tbody></table></div>
  <h2>Créditos vigentes</h2><div class="tabla"><table><thead><tr><th>Número</th><th>Productor</th><th>Comunidad</th><th class="n">Desembolsado</th><th class="n">Saldo</th><th class="n">Atrasado</th><th class="n">Días</th><th>Próxima cuota</th></tr></thead><tbody>
  ${filas.map(({ c, e }) => `<tr><td><a href="#/cred/${c.id}">${esc(c.numero)}</a></td><td><a href="#/edocta/${c.productor_id}">${esc(c.productores?.nombre)}</a></td><td>${esc(c.productores?.comunidad)}</td><td class="n">${L(c.monto_aprobado)}</td><td class="n">${L(e.saldo)}</td><td class="n ${e.atraso ? 'error' : ''}">${e.atraso ? L(e.atraso) : ''}</td><td class="n">${e.dias || ''}</td><td>${e.prox ? esc(e.prox.fecha) + ' · ' + L(e.prox.cuota) : ''}</td></tr>`).join('') || '<tr><td colspan="8" class="nota">No hay créditos desembolsados.</td></tr>'}
  </tbody></table></div>`;
};

// =====================================================================
// CERTIFICACIONES
// =====================================================================
RUTAS.cer = async function menuCert() {
  S.seccion = 'cer';
  setTimeout(() => sincronizarKobo(false), 0);
  const [nc, qj] = esJefe() ? await Promise.all([cuenta('no_conformidades', x => x.eq('estado', 'Abierta')), cuenta('quejas', x => x.neq('estado', 'Cerrada'))]) : [0, 0];
  app().innerHTML = cabecera('Certificaciones · café', '#/') + `<div class="caja nota" id="koboEstado" style="padding:10px 14px">Revisando Kobo…</div>
  <h2>Productores y fincas</h2><div class="tarjetas">
    ${tarjeta('#/padron', 'Padrón de productores', 'Socios, parcelas y certificaciones')}
    ${tarjeta('#/prodf', 'Registrar productor', 'Socio nuevo')}
    ${tarjeta('#/parcela', 'Registrar parcela', 'Punto GPS y polígono (obligatorio desde 4 ha)')}
  </div>
  <h2>Control interno</h2><div class="tarjetas">
    ${tarjeta('#/inspeccion', 'Inspección interna', 'Resultado anual y no conformidades')}
    ${tarjeta('#/inspecciones', 'Inspecciones', 'Historial')}
    ${tarjeta('#/nc', 'No conformidades', 'Seguimiento y cierre', nc)}
    ${tarjeta('#/insumos', 'Insumos aplicados', 'Qué se aplicó en cada parcela, revisado contra la lista')}
    ${tarjeta('#/capacitaciones', 'Capacitaciones', 'Ayudas memoria, asistencia y acuerdos')}
    ${tarjeta('#/guias', 'Guías y plan de capacitaciones', 'Lo que pide cada certificación y cuándo toca')}
    ${tarjeta('#/asistencia', 'Asistencia por productor', 'Quién llegó a cada capacitación')}
    ${tarjeta('#/quejas', 'Quejas y reclamos', 'Buzón, también anónimo', qj)}
  </div>
  <h2>Trazabilidad</h2><div class="tarjetas">
    ${tarjeta('#/acopio', 'Registrar acopio', 'Entrega de cada socio')}
    ${tarjeta('#/acopios', 'Acopio', 'Entregas registradas, recibos y pagos')}
    ${tarjeta('#/inventario', 'Inventario por lote y bodega', 'Lo que entró, lo que salió y lo que queda')}
    ${tarjeta('#/basculas', 'Básculas', 'Calibración y vencimiento')}
    ${tarjeta('#/reg/beneficiado', cultivos().length === 1 && cultivos()[0] === 'Cacao' ? 'Fermentación y secado' : 'Beneficiado y secado', cultivos().includes('Cacao') ? 'Fermentación, secado y prueba de corte de cada lote' : 'Proceso de cada lote')}
    ${tarjeta('#/despacho', 'Despacho y venta', 'Contratos y lotes vendidos')}
    ${tarjeta('#/lotes', 'Trazabilidad por lote', 'De qué fincas salió cada lote y a quién se vendió')}
    ${tarjeta('#/balance', 'Balance de masas', 'Comprado contra vendido por certificación')}
    ${tarjeta('#/prima', 'Prima de Comercio Justo', 'Generada, usada y disponible')}
    ${tarjeta('#/actas', 'Actas de asamblea', 'Lo que aprueba la asamblea y lo que se gastó')}
    ${esJefe() ? tarjeta('#/paquete', 'Paquete para la certificadora', 'Todo lo de la auditoría en un Excel y el mapa de parcelas') : ''}
  </div>
  <h2>Formularios de campo</h2><div class="tarjetas">${tarjeta('#/bandeja', 'Trabajo sin señal', 'Preparar el teléfono y ver lo que falta mandar', OFF.cola().length)}${tarjeta('#/kobo', 'Formularios de KoboToolbox', 'Para llenar en el campo, con o sin señal')}${esAdmin() ? tarjeta('#/catalogo', 'Catálogo de certificaciones', 'Activar o desactivar') : ''}</div>
  ${puedePanel('cer') ? `<h2>Panel de control</h2><div class="tarjetas">${tarjeta('#/pnl/cer', 'Panel de control', 'Números de certificaciones y archivo de PDF')}</div>` : ''}`;
};

RUTAS.padron = async function verPadron() {
  const [ps, parc, cs] = await Promise.all([prods(true), q(sb.from('parcelas').select('productor_id,area_ha,poligono').eq('org_id', S.org.id)), certs()]);
  const ha = {}, np = {}, sinPol = {};
  parc.forEach(p => { ha[p.productor_id] = (ha[p.productor_id] || 0) + num(p.area_ha); np[p.productor_id] = (np[p.productor_id] || 0) + 1; if (num(p.area_ha) >= 4 && !p.poligono) sinPol[p.productor_id] = 1; });
  app().innerHTML = cabecera('Padrón de productores') + `<div class="filtros"><input id="bus" placeholder="Buscar por nombre, código o comunidad"><select id="fc"><option value="">Todas las certificaciones</option>${cs.map(c => `<option value="${c.codigo}">${esc(c.nombre)}</option>`).join('')}</select><a class="boton" href="#/prodf">+ Nuevo productor</a><button class="sec" id="csv">Descargar CSV</button></div>
  <div class="tabla"><table><thead><tr><th>Código</th><th>Nombre</th><th>Comunidad</th><th class="n">Parcelas</th><th class="n">Hectáreas</th><th>Certificaciones</th><th>Inspección</th></tr></thead><tbody id="cuerpo"></tbody></table></div><p class="nota" id="tot"></p>`;
  const filtrar = () => { const t = norm($('#bus').value), c = $('#fc').value; return ps.filter(p => (!t || norm(p.nombre + p.codigo + p.comunidad).includes(t)) && (!c || p.certificaciones.includes(c))); };
  const pintar = () => {
    const f = filtrar();
    $('#cuerpo').innerHTML = f.map(p => `<tr${p.activo ? '' : ' style="opacity:.5"'}><td>${esc(p.codigo)}</td><td><a href="#/prod/${p.id}">${esc(p.nombre)}</a></td><td>${esc(p.comunidad)}</td><td class="n">${np[p.id] || 0}${sinPol[p.id] ? ' <span class="error" title="Parcela de 4 ha o más sin polígono">⚠</span>' : ''}</td><td class="n">${(ha[p.id] || 0).toFixed(2)}</td><td>${p.certificaciones.map(nombreCert).map(esc).join(', ')}</td><td>${p.estado_cert ? estadoChip(p.estado_cert, { Aprobado: 'Autorizada', Condicionado: 'Pendiente', 'No aprobado': 'Rechazada' }[p.estado_cert]) : ''}</td></tr>`).join('') || '<tr><td colspan="7" class="nota">Sin productores.</td></tr>';
    $('#tot').textContent = `${f.length} productores · ${f.reduce((t, p) => t + (ha[p.id] || 0), 0).toFixed(2)} ha`;
  };
  $('#bus').oninput = pintar; $('#fc').onchange = pintar; pintar();
  $('#csv').onclick = () => descargarCSV('padron.csv', ['codigo', 'nombre', 'identidad', 'comunidad', 'parcelas', 'hectareas', 'certificaciones', 'inspeccion'], filtrar().map(p => [p.codigo, p.nombre, p.identidad, p.comunidad, np[p.id] || 0, (ha[p.id] || 0).toFixed(2), p.certificaciones.map(nombreCert).join('; '), p.estado_cert]));
};
function descargarCSV(nombre, cols, filas) {
  const csv = [cols.join(','), ...filas.map(r => r.map(v => '"' + String(v ?? '').replace(/"/g, '""') + '"').join(','))].join('\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' })); a.download = nombre; a.click();
}

RUTAS.prodf = async function formProductor(id) {
  const p = id ? await q(sb.from('productores').select('*').eq('id', id).single()) : { cultivo: cultivos()[0], certificaciones: [] }, cs = await certs();
  const c = (k, t, tipo = 'text', extra = '') => `<div><label>${t}</label><input type="${tipo}" name="${k}" value="${esc(p[k])}" ${extra}></div>`;
  app().innerHTML = cabecera(id ? 'Editar productor' : 'Registrar productor', id ? '#/prod/' + id : undefined) + `<form class="caja" id="f"><div class="rejilla">
    ${c('nombre', 'Nombre completo', 'text', 'required')}${c('codigo', 'Código de socio')}${c('identidad', 'Número de identidad')}
    <div><label>Sexo</label><select name="sexo">${opciones(['', 'Mujer', 'Hombre'], p.sexo)}</select></div>${c('fecha_nacimiento', 'Fecha de nacimiento', 'date')}${c('telefono', 'Teléfono', 'tel')}
    ${c('comunidad', 'Comunidad o aldea')}${c('municipio', 'Municipio')}${c('departamento', 'Departamento')}${c('fecha_ingreso', 'Fecha de ingreso a la organización', 'date')}
    <div><label>Cultivo</label>${cultivos().length > 1 ? `<select name="cultivo">${opciones(['Café', 'Cacao'], cultivoProd(p))}</select>` : `<input name="cultivo" value="${esc(p.cultivo || cultivos()[0])}" readonly>`}</div>
    ${id ? `<div><label>Estado</label><select name="activo"><option value="true">Activo</option><option value="false" ${p.activo ? '' : 'selected'}>Retirado</option></select></div>` : ''}
    <div class="ancho"><label>Certificaciones en las que participa</label>${checksCert(cs, p.certificaciones)}</div>
  </div><p class="nota">Un solo cultivo por productor (café).</p><div class="acciones"><button>Guardar</button></div></form>`;
  $('#f').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target, d = datosForm(f); delete d.certs;
    d.certificaciones = leerChecks(f); ['fecha_nacimiento', 'fecha_ingreso'].forEach(k => d[k] = d[k] || null);
    if (id) d.activo = d.activo === 'true'; d.actualizado = new Date().toISOString();
    if (d.identidad && !/^\d{4}-?\d{4}-?\d{5}$/.test(d.identidad)) return aviso('El número de identidad debe tener 13 dígitos (0000-0000-00000).', true);
    ocupado(f, true);
    try {
      const r = id ? await q(sb.from('productores').update(d).eq('id', id).select('id').single()) : await q(sb.from('productores').insert({ ...d, org_id: S.org.id }).select('id').single());
      await prods(true); aviso('Productor guardado.'); location.hash = '#/prod/' + r.id;
    } catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
};

RUTAS.prod = async function verProductor(id) {
  const anio = new Date().getFullYear();
  const [p, parc, insp, nc, aco, cre] = await Promise.all([
    q(sb.from('productores').select('*').eq('id', id).single()), q(sb.from('parcelas').select('*').eq('productor_id', id).order('nombre')),
    q(sb.from('inspecciones').select('*').eq('productor_id', id).order('fecha', { ascending: false })), q(sb.from('no_conformidades').select('*').eq('productor_id', id).order('creado', { ascending: false })),
    q(sb.from('acopio').select('fecha,psec_lb,estado_cafe,peso_lb,certificacion,numero').eq('productor_id', id).gte('fecha', anio + '-01-01').order('fecha', { ascending: false })),
    q(sb.from('creditos').select('id,numero,estado,monto_aprobado,monto_solicitado').eq('productor_id', id).order('creado', { ascending: false }))
  ]);
  await certs();
  const haTot = parc.reduce((t, x) => t + num(x.area_ha), 0);
  app().innerHTML = cabecera(p.nombre, '#/padron') + revisionHTML('productores', p) + `<div class="caja"><dl class="detalle" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:0 14px">
    <div><dt>Código</dt><dd>${esc(p.codigo || '—')}</dd></div><div><dt>Identidad</dt><dd>${esc(p.identidad || '—')}</dd></div><div><dt>Teléfono</dt><dd>${esc(p.telefono || '—')}</dd></div>
    <div><dt>Ubicación</dt><dd>${esc([p.comunidad, p.municipio, p.departamento].filter(Boolean).join(', ') || '—')}</dd></div><div><dt>Ingreso</dt><dd>${esc(p.fecha_ingreso || '—')}</dd></div>
    <div><dt>Certificaciones</dt><dd>${p.certificaciones.map(nombreCert).map(esc).join(', ') || '—'}</dd></div><div><dt>Última inspección</dt><dd>${esc(p.estado_cert || 'Sin inspección')}</dd></div>
  </dl><div class="acciones"><a class="boton sec" href="#/prodf/${p.id}">Editar datos</a><a class="boton sec" href="#/parcela/nuevo/${p.id}">+ Parcela</a><a class="boton sec" href="#/inspeccion/${p.id}">+ Inspección</a><a class="boton sec" href="#/acopio/${p.id}">+ Acopio</a><a class="boton sec" href="#/credito">+ Crédito</a></div></div>
  <h2>Parcelas (${parc.length} · ${haTot.toFixed(2)} ha)</h2>
  ${parc.some(x => x.lat || x.poligono) ? '<div id="mapa" style="height:320px;border-radius:12px;border:1px solid var(--borde);margin-bottom:10px"></div>' : ''}
  <div class="tabla"><table><thead><tr><th>Parcela</th><th class="n">Área (ha)</th><th>Variedad</th><th class="n">Altitud</th><th>Ubicación</th><th>Polígono</th><th class="n">Estimado (qq)</th><th>Orgánico</th><th></th></tr></thead><tbody>
  ${parc.map(x => `<tr><td>${esc(x.nombre)}</td><td class="n">${num(x.area_ha).toFixed(2)}</td><td>${esc(x.variedad)}</td><td class="n">${x.altitud ?? ''}</td><td>${x.lat ? `${num(x.lat).toFixed(5)}, ${num(x.lon).toFixed(5)}` : '<span class="error">Sin punto</span>'}</td><td>${x.poligono ? 'Sí' : num(x.area_ha) >= 4 ? '<span class="error">Falta (4 ha o más)</span>' : 'No requerido'}</td><td class="n">${estimadoParcela(x) ? estimadoParcela(x).toLocaleString('es-HN') : ''}</td><td>${chipOrg(estadoOrganico(x))}</td><td><a href="#/parcela/${x.id}">Editar</a></td></tr>`).join('') || '<tr><td colspan="9" class="nota">Sin parcelas.</td></tr>'}
  </tbody></table></div>
  <p class="nota" id="estProd"></p>
  <div id="insProd"></div><div id="docsProd"></div>
  <h2>Inspecciones</h2><div class="tabla"><table><thead><tr><th>Fecha</th><th>Inspector</th><th>Certificaciones</th><th>Resultado</th><th>Observaciones</th></tr></thead><tbody>
  ${insp.map(x => `<tr><td><a href="#/insp/${x.id}">${esc(x.fecha)}</a></td><td>${esc(x.inspector)}</td><td>${x.certificaciones.map(nombreCert).map(esc).join(', ')}</td><td>${esc(x.resultado)}</td><td>${esc(x.observaciones)}</td></tr>`).join('') || '<tr><td colspan="5" class="nota">Sin inspecciones.</td></tr>'}</tbody></table></div>
  ${nc.length ? `<h2>No conformidades</h2><div class="tabla"><table><thead><tr><th>Requisito</th><th>Hallazgo</th><th>Acción</th><th>Plazo</th><th>Estado</th></tr></thead><tbody>${nc.map(x => `<tr><td>${esc(x.requisito)}</td><td>${esc(x.descripcion)}</td><td>${esc(x.accion)}</td><td>${esc(x.plazo)}</td><td>${estadoChip(x.estado, x.estado === 'Abierta' ? 'Pendiente' : 'Autorizada')}</td></tr>`).join('')}</tbody></table></div>` : ''}
  <h2>Acopio ${anio}: ${(aco.reduce((t, x) => t + num(x.psec_lb), 0) / 100).toFixed(2)} qq ${secoTxt(cultivoProd(p))}</h2>
  ${aco.length ? `<div class="tabla"><table><thead><tr><th>Número</th><th>Fecha</th><th>Producto</th><th class="n">Peso (lb)</th><th>Certificación</th></tr></thead><tbody>${aco.map(x => `<tr><td>${esc(x.numero)}</td><td>${esc(x.fecha)}</td><td>${esc(x.estado_cafe)}</td><td class="n">${num(x.peso_lb).toLocaleString('es-HN')}</td><td>${esc(nombreCert(x.certificacion))}</td></tr>`).join('')}</tbody></table></div>` : ''}
  ${cre.length ? `<h2>Créditos</h2><div class="tabla"><table><thead><tr><th>Número</th><th class="n">Monto</th><th>Estado</th></tr></thead><tbody>${cre.map(x => `<tr><td><a href="#/cred/${x.id}">${esc(x.numero)}</a></td><td class="n">${L(x.monto_aprobado || x.monto_solicitado)}</td><td>${esc(x.estado)}</td></tr>`).join('')}</tbody></table></div>${esJefe() ? `<div class="acciones"><a class="boton sec" href="#/edocta/${id}">Estado de cuenta</a></div>` : ''}` : ''}`;
  if ($('#mapa')) dibujarMapa($('#mapa'), parc);
  estimadoProductor(id).then(e => { const el = $('#estProd'); if (el) el.innerHTML = e.est ? `Cosecha actual (desde ${inicioCosecha()}): entregado <b>${qqTxt(e.ent)}</b> de un estimado de <b>${qqTxt(e.est)}</b>${e.ent > e.tope ? ' · <span class="error">pasa el estimado más la tolerancia</span>' : ''}.` : 'Sin estimado de cosecha: se pone en cada parcela.'; }).catch(() => {});
  fichaDocumentos(id).catch(() => {});
  q(sb.from('insumos_aplicados').select('fecha,producto,parcela_nombre,estado,cantidad,unidad').eq('productor_id', id).order('fecha', { ascending: false }).limit(50)).then(l => { const el = $('#insProd'); if (el) el.innerHTML = `<h2>Insumos aplicados</h2>${l.length ? `<div class="tabla"><table><thead><tr><th>Fecha</th><th>Parcela</th><th>Producto</th><th class="n">Cantidad</th><th>Revisión</th></tr></thead><tbody>${l.map(x => `<tr><td>${esc(x.fecha)}</td><td>${esc(x.parcela_nombre || 'Toda la finca')}</td><td>${esc(x.producto)}</td><td class="n">${x.cantidad ? num(x.cantidad).toLocaleString('es-HN') + ' ' + esc(x.unidad || '') : ''}</td><td>${chipInsumo(x.estado)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="nota">Sin aplicaciones registradas.</p>'}<div class="acciones"><a class="boton sec" href="#/insumos/${id}">+ Registrar insumo</a></div>`; }).catch(() => {});
}

// Mapa con Leaflet (se carga solo cuando se necesita)
async function leaflet() {
  if (window.L_) return window.L_;
  await new Promise((ok, mal) => {
    const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(css);
    const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js'; s.onload = ok; s.onerror = mal; document.head.appendChild(s);
  });
  window.L_ = window.L; return window.L_;
}
async function dibujarMapa(el, parcelas) {
  try {
    const Lf = await leaflet(), m = Lf.map(el), capas = [];
    Lf.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(m);
    parcelas.forEach(x => {
      if (x.poligono) try { capas.push(Lf.geoJSON(x.poligono, { style: { color: '#166534', weight: 2 } }).bindPopup(esc(x.nombre || 'Parcela')).addTo(m)); } catch (_) {}
      else if (x.lat && x.lon) capas.push(Lf.marker([num(x.lat), num(x.lon)]).bindPopup(esc(x.nombre || 'Parcela')).addTo(m));
    });
    const g = Lf.featureGroup(capas); if (capas.length) m.fitBounds(g.getBounds(), { maxZoom: 16, padding: [20, 20] }); else m.setView([14.6, -86.8], 7);
  } catch (e) { el.innerHTML = '<p class="nota" style="padding:10px">No se pudo cargar el mapa.</p>'; }
}

RUTAS.parcela = async function formParcela(id, prodId) {
  const nuevo = !id || id === 'nuevo', p = nuevo ? { productor_id: prodId } : await q(sb.from('parcelas').select('*').eq('id', id).single()), ps = await prods();
  const c = (k, t, extra = '') => `<div><label>${t}</label><input name="${k}" value="${esc(p[k])}" ${extra}></div>`;
  app().innerHTML = cabecera(nuevo ? 'Registrar parcela' : 'Editar parcela', p.productor_id ? '#/prod/' + p.productor_id : undefined) + `<form class="caja" id="f"><div class="rejilla">
    <div class="ancho"><label>Productor</label>${campoProd(ps, p.productor_id)}</div>
    ${c('nombre', 'Nombre de la parcela', 'required')}${c('area_ha', 'Área (hectáreas)', 'required inputmode="decimal"')}
    ${c('lat', 'Latitud (ej. 14.912345)', 'inputmode="decimal"')}${c('lon', 'Longitud (ej. -86.123456)', 'inputmode="decimal"')}
    ${c('altitud', 'Altitud (msnm)', 'inputmode="decimal"')}${c('variedad', 'Variedad de café')}${c('anio_siembra', 'Año de siembra', 'inputmode="numeric"')}
    <div><label>Sombra</label><select name="sombra">${opciones(['', 'Sin sombra', 'Sombra regulada', 'Sombra diversificada', 'Bosque'], p.sombra)}</select></div>
    <div><label>Estimado de cosecha (qq ${secoTxt()})</label><input name="estimado_qq" inputmode="decimal" value="${esc(p.datos?.estimado_qq ?? '')}"></div>
    <div><label>Fecha del último producto prohibido</label><input type="date" name="ultima_prohibida" value="${esc(p.datos?.ultima_prohibida || '')}"><p class="nota">${nuevo ? 'Dejala vacía si nunca se aplicó.' : esc(estadoOrganico(p).txt)}</p></div>
    <div class="ancho"><label>Polígono (GeoJSON, obligatorio desde 4 ha para EUDR)</label><textarea name="poligono" rows="4" placeholder='{"type":"Polygon","coordinates":[[[-86.1,14.9],…]]}'>${p.poligono ? esc(JSON.stringify(p.poligono)) : ''}</textarea></div>
  </div><div class="acciones"><button type="button" class="sec" id="gps">Usar mi ubicación actual</button><button>Guardar</button></div></form>`;
  const f = $('#f');
  $('#gps').onclick = () => navigator.geolocation ? navigator.geolocation.getCurrentPosition(pos => { f.lat.value = pos.coords.latitude.toFixed(7); f.lon.value = pos.coords.longitude.toFixed(7); if (pos.coords.altitude) f.altitud.value = Math.round(pos.coords.altitude); aviso('Ubicación tomada.'); }, () => aviso('No se pudo leer la ubicación del teléfono.', true), { enableHighAccuracy: true }) : aviso('Este equipo no tiene GPS.', true);
  f.onsubmit = async ev => {
    ev.preventDefault(); const d = datosForm(f), pr = leerProd(ps, d.productor_txt);
    if (!pr) return aviso('Elegí un productor de la lista.', true);
    let pol = null;
    if (d.poligono) { try { pol = JSON.parse(d.poligono); if (pol.type === 'Feature') pol = pol.geometry; if (!['Polygon', 'MultiPolygon'].includes(pol?.type)) throw 0; } catch (_) { return aviso('El polígono no es un GeoJSON válido (Polygon o MultiPolygon).', true); } }
    const lat = d.lat ? num(d.lat) : null, lon = d.lon ? num(d.lon) : null;
    if (lat !== null && (lat < 12.9 || lat > 16.6 || lon > -82.9 || lon < -89.5)) return aviso('Las coordenadas no caen en Honduras. Revisá latitud y longitud (la longitud lleva signo menos).', true);
    if (num(d.area_ha) >= 4 && !pol) return aviso('Para parcelas de 4 ha o más el polígono es obligatorio.', true);
    if (!pol && lat === null) return aviso('Poné al menos el punto GPS de la parcela.', true);
    const reg = { productor_id: pr.id, nombre: d.nombre, area_ha: num(d.area_ha), lat, lon, altitud: d.altitud ? num(d.altitud) : null, variedad: d.variedad, anio_siembra: d.anio_siembra ? +d.anio_siembra : null, sombra: d.sombra, poligono: pol, datos: { ...(p.datos || {}), estimado_qq: d.estimado_qq ? num(d.estimado_qq) : null, ultima_prohibida: d.ultima_prohibida || null } };
    ocupado(f, true);
    try { if (nuevo) await q(sb.from('parcelas').insert({ ...reg, org_id: S.org.id })); else await q(sb.from('parcelas').update(reg).eq('id', id)); aviso('Parcela guardada.'); location.hash = '#/prod/' + pr.id; }
    catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
  conectarRevision('productores', id);
};

RUTAS.inspeccion = async function formInspeccion(prodId) {
  const [ps, cs] = await Promise.all([prods(), certs()]);
  const p0 = ps.find(x => x.id === prodId);
  const sugeridos = [...lista(S.cfg.INSUMOS_PERMITIDOS), ...lista(S.cfg.INSUMOS_PROHIBIDOS)];
  app().innerHTML = cabecera('Inspección interna') + `<form class="caja" id="f"><div class="rejilla">
    <div class="ancho"><label>Productor</label>${campoProd(ps, prodId)}</div>
    <div><label>Fecha</label><input type="date" name="fecha" required value="${hoy()}"></div>
    <div><label>Inspector interno</label><input name="inspector" required value="${esc(S.maestro ? '' : S.perfil.nombre)}"></div>
    <div><label>Resultado</label><select name="resultado">${opciones(['Aprobado', 'Condicionado', 'No aprobado'])}</select></div>
    <div class="ancho"><label>Certificaciones inspeccionadas</label>${checksCert(cs, p0?.certificaciones || [])}</div>
    <div class="ancho"><label>Observaciones generales</label><textarea name="observaciones"></textarea></div>
  </div>
  <h2>Parcelas e historial orgánico</h2><p class="nota">Revisá con el productor la fecha del último producto prohibido (químico sintético) de cada parcela. Si cambia algo, corregilo aquí y queda guardado en la parcela.</p><div id="hist"><p class="nota">Elegí el productor.</p></div>
  <h2>Insumos aplicados en los últimos 12 meses</h2><p class="nota">Uno por uno. Se revisan contra las listas de Configuración; si alguno es prohibido, la parcela vuelve a empezar la transición y se abre la no conformidad sola.</p>
  <datalist id="dlIns">${sugeridos.map(x => `<option value="${esc(x)}">`).join('')}</datalist>
  <div id="insL"></div><div class="acciones"><button type="button" class="sec" id="masIns">+ Agregar insumo</button></div>
  <h2>No conformidades encontradas</h2><div id="ncs"></div><div class="acciones"><button type="button" class="sec" id="masNc">+ Agregar no conformidad</button></div>
  <div class="acciones"><button>Guardar inspección</button></div></form>
  <p class="nota">La lista de chequeo completa se llena en el campo con el formulario de Kobo «Inspección interna». Lo que se anota allá (insumos, historial de las parcelas y no conformidades) también pasa solo a cada módulo.</p>`;
  let n = 0, ni = 0, parcs = [];
  const f = $('#f');
  const optParc = () => '<option value="">Toda la finca</option>' + parcs.map(x => `<option value="${x.id}">${esc(x.nombre)}</option>`).join('');
  const cargar = async () => {
    const p = leerProd(ps, f.productor_txt.value);
    if (p) f.querySelectorAll('input[name=certs]').forEach(c => c.checked = p.certificaciones.includes(c.value));
    parcs = p ? (await parcelasOrg().catch(() => [])).filter(x => x.productor_id === p.id) : [];
    $('#hist').innerHTML = !p ? '<p class="nota">Elegí el productor.</p>' : !parcs.length ? '<p class="nota">Este productor no tiene parcelas en el padrón.</p>' : `<div class="tabla"><table><thead><tr><th>Parcela</th><th class="n">Área (ha)</th><th>Estado orgánico</th><th>Último producto prohibido</th><th>Nunca se aplicó</th></tr></thead><tbody>
      ${parcs.map(x => `<tr><td>${esc(x.nombre)}</td><td class="n">${num(x.area_ha).toFixed(2)}</td><td>${chipOrg(estadoOrganico(x))}</td><td><input type="date" name="up_${x.id}" value="${esc(x.datos?.ultima_prohibida || '')}"></td><td><input type="checkbox" name="nu_${x.id}" style="width:auto" ${!x.datos?.ultima_prohibida && /^(nunca|no|ninguna)/.test(norm(x.datos?.ultima_quimica || '')) ? 'checked' : ''}></td></tr>`).join('')}</tbody></table></div>`;
    f.querySelectorAll('select[name^=ip]').forEach(s => { const v = s.value; s.innerHTML = optParc(); s.value = v; });
  };
  const revIns = i => { const v = f['iprod' + i].value.trim(), el = $('#irev' + i); if (!el) return; if (!v) { el.innerHTML = ''; return; } const e = estadoInsumo(v); el.innerHTML = chipInsumo(e); };
  $('#masIns').onclick = () => {
    ni++; const i = ni;
    $('#insL').insertAdjacentHTML('beforeend', `<div class="cot rejilla"><div><label>Parcela</label><select name="ip${i}">${optParc()}</select></div>
      <div><label>Producto</label><input name="iprod${i}" list="dlIns"><span id="irev${i}"></span></div>
      <div><label>Tipo</label><select name="itipo${i}">${opciones(['Fertilizante', 'Abono orgánico', 'Enmienda', 'Fungicida', 'Insecticida', 'Herbicida', 'Control biológico', 'Otro'])}</select></div>
      <div><label>Fecha (aproximada)</label><input type="date" name="ifecha${i}" value="${hoy()}"></div>
      <div><label>Cantidad</label><input name="icant${i}" inputmode="decimal"></div>
      <div><label>Unidad</label><select name="iuni${i}">${opciones(['kg', 'lb', 'qq', 'sacos', 'litros', 'galones', 'ml'])}</select></div>
      <div><label>¿Tiene factura o comprobante?</label><select name="icomp${i}">${opciones(['', 'Sí', 'No'])}</select></div></div>`);
    f['iprod' + i].oninput = () => revIns(i);
  };
  $('#masNc').onclick = () => { n++; $('#ncs').insertAdjacentHTML('beforeend', `<div class="cot rejilla"><div><label>Requisito o norma</label><select name="req${n}">${opciones(['A. Generales', 'B. Producción orgánica', 'C. Sociales', 'D. EUDR', 'E. Producción y balance'])}</select></div><div class="ancho"><label>Hallazgo</label><input name="desc${n}"></div><div><label>Gravedad</label><select name="grav${n}">${opciones(['Menor', 'Mayor', 'Crítica'])}</select></div><div><label>Acción correctiva</label><input name="acc${n}"></div><div><label>Plazo</label><input type="date" name="plazo${n}"></div></div>`); };
  f.productor_txt.onchange = cargar; cargar();
  f.onsubmit = async ev => {
    ev.preventDefault(); const d = datosForm(f), p = leerProd(ps, d.productor_txt);
    if (!p) return aviso('Elegí un productor de la lista.', true);
    const ncs = []; for (let i = 1; i <= n; i++) if (d['desc' + i]) ncs.push({ requisito: d['req' + i], descripcion: d['desc' + i], gravedad: d['grav' + i], accion: d['acc' + i], plazo: d['plazo' + i] || null });
    const ins = []; for (let i = 1; i <= ni; i++) if (d['iprod' + i]) ins.push({ parcela_id: d['ip' + i] || null, producto: d['iprod' + i], tipo: d['itipo' + i], fecha: d['ifecha' + i] || d.fecha, cantidad: d['icant' + i] ? num(d['icant' + i]) : null, unidad: d['icant' + i] ? d['iuni' + i] : null, comprobante: d['icomp' + i] || null });
    const cambios = parcs.map(x => {
      const up = d['up_' + x.id] || '', nu = !!f['nu_' + x.id]?.checked, dd = { ...(x.datos || {}) };
      if (nu && up) return { err: `En «${x.nombre}» pusiste una fecha y también «nunca». Dejá solo una.` };
      if (up) { if (up === (dd.ultima_prohibida || '')) return null; dd.ultima_prohibida = up; }
      else if (nu) { if (!dd.ultima_prohibida && /^(nunca|no|ninguna)/.test(norm(dd.ultima_quimica || ''))) return null; dd.ultima_prohibida = null; dd.ultima_quimica = 'nunca'; }
      else { if (!dd.ultima_prohibida) return null; dd.ultima_prohibida = null; }
      dd.ultima_fuente = 'Inspección del ' + d.fecha; return { id: x.id, datos: dd };
    }).filter(Boolean);
    const malo = cambios.find(x => x.err); if (malo) return aviso(malo.err, true);
    const prohib = ins.filter(x => estadoInsumo(x.producto) === 'Prohibido').map(x => x.producto);
    if (prohib.length && !confirm(`${prohib.join(', ')} ${prohib.length > 1 ? 'están prohibidos' : 'está prohibido'} para orgánico. Al guardar se abre la no conformidad y la parcela vuelve a empezar la transición. ¿Guardar?`)) return;
    if (d.resultado !== 'Aprobado' && !ncs.length && !prohib.length && !d.observaciones) return aviso('Si no queda aprobado, anotá las no conformidades u observaciones.', true);
    ocupado(f, true);
    try {
      const i = await q(sb.from('inspecciones').insert({ id: nuevoId(), org_id: S.org.id, productor_id: p.id, fecha: d.fecha, inspector: d.inspector, resultado: d.resultado, certificaciones: leerChecks(f), observaciones: d.observaciones, datos: { origen: 'app', parcelas_revisadas: parcs.length, historial: cambios.map(c => ({ parcela: parcs.find(x => x.id === c.id)?.nombre, ultima_prohibida: c.datos.ultima_prohibida || null, nunca: c.datos.ultima_quimica === 'nunca' && !c.datos.ultima_prohibida })) } }).select('id').single());
      if (ncs.length) await q(sb.from('no_conformidades').insert(ncs.map(x => ({ ...x, id: nuevoId(), org_id: S.org.id, productor_id: p.id, inspeccion_id: i.id }))));
      for (const c of cambios) await q(sb.from('parcelas').update({ datos: c.datos }).eq('id', c.id));
      if (ins.length) await q(sb.from('insumos_aplicados').insert(ins.map(x => ({ ...x, id: nuevoId(), org_id: S.org.id, productor_id: p.id, inspeccion_id: i.id, origen: 'Inspección (app)', observaciones: 'Anotado en la inspección del ' + d.fecha + ' por ' + d.inspector }))));
      if (esJefe()) { await q(sb.from('productores').update({ estado_cert: d.resultado }).eq('id', p.id)); await prods(true); }
      if (i._local) { aviso('Sin señal: la inspección quedó guardada en el teléfono y se manda sola al volver la señal.'); S._parcs = null; location.hash = '#/bandeja'; return; }
      S._parcs = null; aviso('Inspección guardada' + (prohib.length ? '. Se abrió la no conformidad por insumo prohibido.' : '.')); archivarLuego(true); location.hash = '#/insp/' + i.id;
    } catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
};

RUTAS.insp = async function verInspeccion(id) {
  const i = await q(sb.from('inspecciones').select('*, productores(id,codigo,nombre,comunidad)').eq('id', id).single()); await certs();
  const [ncs, ins] = await Promise.all([q(sb.from('no_conformidades').select('*').eq('inspeccion_id', id).order('creado')), q(sb.from('insumos_aplicados').select('*').eq('inspeccion_id', id).order('fecha'))]);
  const d = i.datos || {}, hist = d.historial || [];
  const RESP = { si: 'Sí', no: 'No', na: 'No aplica' };
  const chequeo = Object.entries(d).filter(([k, v]) => /^[a-e]\d+$/.test(k) && v !== '' && v != null).sort(([a], [b]) => a[0] === b[0] ? +a.slice(1) - +b.slice(1) : a < b ? -1 : 1);
  const malas = chequeo.filter(([, v]) => v === 'no');
  app().innerHTML = cabecera('Inspección interna') + revisionHTML('inspecciones', i) + `<div class="caja"><p><b>${esc(i.productores?.codigo || '')} ${esc(i.productores?.nombre || '')}</b> · ${esc(i.productores?.comunidad || '')}</p>
    <p>${esc(i.fecha)} · Inspector: ${esc(i.inspector || '')} · Resultado: <b>${esc(i.resultado || '')}</b>${i.recomendacion ? ' (' + esc(i.recomendacion) + ')' : ''}</p>
    <p>Certificaciones: ${(i.certificaciones || []).map(nombreCert).map(esc).join(', ') || '—'}</p>${i.observaciones ? `<p>${esc(i.observaciones)}</p>` : ''}
    ${(d.alertas || []).length ? `<p class="nota" style="color:#92400e">${d.alertas.map(esc).join('<br>')}</p>` : ''}
    <div class="acciones"><a class="boton sec" href="#/prod/${i.productor_id}">Ver la ficha del productor</a></div></div>
  <h2>No conformidades (${ncs.length})</h2>${ncs.length ? `<div class="tabla"><table><thead><tr><th>Número</th><th>Requisito</th><th>Hallazgo</th><th>Gravedad</th><th>Acción</th><th>Plazo</th><th>Estado</th></tr></thead><tbody>${ncs.map(x => `<tr><td>${esc(x.numero || '')}</td><td>${esc(x.requisito || '')}</td><td>${esc(x.descripcion)}</td><td>${esc(x.gravedad || '')}</td><td>${esc(x.accion || '')}</td><td>${esc(x.plazo || '')}</td><td>${esc(x.estado || '')}</td></tr>`).join('')}</tbody></table></div>` : '<p class="nota">Sin no conformidades.</p>'}
  <h2>Insumos anotados (${ins.length})</h2>${ins.length ? `<div class="tabla"><table><thead><tr><th>Fecha</th><th>Parcela</th><th>Producto</th><th>Tipo</th><th class="n">Cantidad</th><th>Comprobante</th><th>Revisión</th></tr></thead><tbody>${ins.map(x => `<tr><td>${esc(x.fecha)}</td><td>${esc(x.parcela_nombre || 'Toda la finca')}</td><td>${esc(x.producto)}</td><td>${esc(x.tipo || '')}</td><td class="n">${x.cantidad ? num(x.cantidad).toLocaleString('es-HN') + ' ' + esc(x.unidad || '') : ''}</td><td>${esc(x.comprobante || '')}</td><td>${chipInsumo(x.estado)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="nota">No se anotaron insumos en esta inspección.</p>'}
  ${hist.length ? `<h2>Historial de parcelas corregido</h2><ul>${hist.map(h => `<li>${esc(h.parcela || h.hist_parcela || '')}: ${h.nunca || h.hist_cuando === 'nunca' ? 'nunca se aplicó un prohibido' : 'último prohibido ' + esc(h.ultima_prohibida || h.hist_fecha || '')}</li>`).join('')}</ul>` : ''}
  ${chequeo.length ? `<h2>Lista de chequeo (Kobo)</h2><p>${chequeo.length} preguntas contestadas · ${malas.length} con «No»${malas.length ? ': ' + malas.map(([k]) => k.toUpperCase()).join(', ') : ''}.</p>` : ''}`;
  conectarRevision('inspecciones', id);
};

RUTAS.inspecciones = async function verInspecciones() {
  const filas = await q(sb.from('inspecciones').select('*, productores(nombre,codigo)').eq('org_id', S.org.id).order('fecha', { ascending: false }).limit(500)); await certs();
  const cuenta3 = k => filas.filter(x => x.resultado === k).length;
  app().innerHTML = cabecera('Inspecciones internas') + `<div class="filtros"><a class="boton" href="#/inspeccion">+ Nueva inspección</a></div>
  <p>${filas.length} inspecciones · ${cuenta3('Aprobado')} aprobadas · ${cuenta3('Condicionado')} condicionadas · ${cuenta3('No aprobado')} no aprobadas</p>
  <div class="tabla"><table><thead><tr><th>Fecha</th><th>Productor</th><th>Inspector</th><th>Certificaciones</th><th>Resultado</th></tr></thead><tbody>
  ${filas.map(x => `<tr><td><a href="#/insp/${x.id}">${esc(x.fecha)}</a></td><td><a href="#/prod/${x.productor_id}">${esc(x.productores?.nombre)}</a></td><td>${esc(x.inspector)}</td><td>${x.certificaciones.map(nombreCert).map(esc).join(', ')}</td><td>${esc(x.resultado)}</td></tr>`).join('') || '<tr><td colspan="5" class="nota">Sin inspecciones.</td></tr>'}</tbody></table></div>`;
};

RUTAS.nc = async function verNC() {
  const filas = await q(sb.from('no_conformidades').select('*, productores(nombre)').eq('org_id', S.org.id).order('estado').order('plazo'));
  app().innerHTML = cabecera('No conformidades') + `<div class="tabla"><table><thead><tr><th>Productor</th><th>Requisito</th><th>Hallazgo</th><th>Acción</th><th>Plazo</th><th>Estado</th><th></th></tr></thead><tbody>
  ${filas.map(x => { const venc = x.estado === 'Abierta' && x.plazo && x.plazo < hoy(); return `<tr><td><b>${esc(x.numero || '')}</b><br><a href="#/prod/${x.productor_id}">${esc(x.productores?.nombre)}</a></td><td>${esc(x.requisito)}${x.gravedad ? '<br><span class="nota">' + esc(x.gravedad) + '</span>' : ''}</td><td>${esc(x.descripcion)}</td><td>${esc(x.accion)}</td><td class="${venc ? 'error' : ''}">${esc(x.plazo || '')}${venc ? ' (vencido)' : ''}</td><td>${estadoChip(x.estado, x.estado === 'Abierta' ? 'Pendiente' : 'Autorizada')}${x.cerrada ? '<br><span class="nota">' + esc(x.cerrada) + ' · ' + esc(x.verificacion) + '</span>' : ''}</td><td>${esJefe() && x.estado === 'Abierta' ? `<button class="sec" data-cerrar="${x.id}">Cerrar</button>` : ''}</td></tr>`; }).join('') || '<tr><td colspan="7" class="nota">Sin no conformidades.</td></tr>'}</tbody></table></div>`;
  app().querySelectorAll('[data-cerrar]').forEach(b => b.onclick = async () => {
    const v = prompt('¿Cómo se verificó que se corrigió?'); if (!v) return;
    try { await q(sb.from('no_conformidades').update({ estado: 'Cerrada', cerrada: hoy(), verificacion: v }).eq('id', b.dataset.cerrar)); aviso('No conformidad cerrada.'); RUTAS.nc(); } catch (e) { aviso(falla(e), true); }
  });
};

// ---------- acopio, despachos y balance de masas ----------
// Café, cacao o los dos: lo dice Configuración › «Cultivo que acopia»
function cultivos() { const v = norm(S.cfg.CULTIVO_ACOPIO || 'Café'); return v.includes('cacao') && v.includes('caf') ? ['Café', 'Cacao'] : v.includes('cacao') ? ['Cacao'] : ['Café']; }
const ESTADOS = { 'Café': ['Pergamino seco', 'Pergamino húmedo', 'Uva', 'Oro'], 'Cacao': ['Cacao seco', 'Cacao en baba'] };
const productoDe = estado => /^cacao/i.test(estado || '') ? 'Cacao' : 'Café';
function secoTxt(prod) { const p = prod || (cultivos().length === 1 ? cultivos()[0] : ''); return p === 'Cacao' ? 'cacao seco' : p === 'Café' ? 'pergamino seco' : 'equivalente seco'; }
const mayus = s => s.charAt(0).toUpperCase() + s.slice(1);
const nomProducto = () => cultivos().length > 1 ? 'Café y cacao' : cultivos()[0];
const cultivoProd = p => /cacao/i.test(p?.cultivo || '') ? 'Cacao' : 'Café';
function opcionesEstado(sel) {
  const cs = cultivos();
  return cs.length === 1 ? opciones(ESTADOS[cs[0]], sel) : cs.map(c => `<optgroup label="${c}">${opciones(ESTADOS[c], sel)}</optgroup>`).join('');
}
function aPergaminoSeco(estado, lb) {
  const p = num(lb);
  return r2(estado === 'Uva' ? p * cfgN('FACTOR_CAFE_UVA', 0.2) : estado === 'Pergamino húmedo' ? p * cfgN('FACTOR_CAFE_PERGAMINO_HUMEDO', 0.8) : estado === 'Oro' ? p / cfgN('RENDIMIENTO_PERGAMINO_ORO', 0.8) : estado === 'Cacao en baba' ? p * cfgN('FACTOR_CACAO_BABA', 0.35) : p);
}
const CORTE = [['fermentado', 'Bien fermentado'], ['violeta', 'Violeta'], ['pizarra', 'Pizarroso'], ['moho', 'Con moho'], ['danado', 'Dañado (insectos o germinado)']];
RUTAS.acopio = async function formAcopio(prodId) {
  const [ps, bas] = await Promise.all([prods(), basculasActivas(), certs()]);
  const bodegas = lista(S.cfg.BODEGAS); const pctRet = cfgN('RETENCION_CREDITO_PCT', 0);
  app().innerHTML = cabecera('Registrar acopio') + `<form class="caja" id="f"><div class="rejilla">
    <div class="ancho"><label>Productor</label>${campoProd(ps, prodId)}</div>
    <div><label>Fecha</label><input type="date" name="fecha" required value="${hoy()}"></div>
    <div><label>Certificación</label><select name="certificacion" id="cert"><option value="">Convencional</option></select></div>
    <div><label>${cultivos().length > 1 ? 'Producto' : 'Estado del ' + cultivos()[0].toLowerCase()}</label><select name="estado_cafe">${opcionesEstado()}</select></div>
    <div><label>Bodega o centro de acopio</label><select name="bodega">${opciones(['', ...bodegas], bodegas[0])}</select></div>
    <div><label>Báscula</label><select name="bascula_id"><option value="">—</option>${bas.map(b => `<option value="${b.id}" data-bodega="${esc(b.bodega || '')}">${esc(b.nombre)}${b.vence && b.vence < hoy() ? ' (calibración vencida)' : ''}</option>`).join('')}</select></div>
    <div><label>Peso neto (libras)</label><input name="peso_lb" required inputmode="decimal"></div>
    <div><label>Humedad (%)</label><input name="humedad" inputmode="decimal"></div>
    <div><label>Impurezas (%)</label><input name="impurezas" inputmode="decimal" placeholder="0"></div>
    <div><label>Defectos (%)</label><input name="defectos" inputmode="decimal" placeholder="0"></div>
    <div><label>Precio por libra (L)</label><input name="precio_lb" inputmode="decimal"></div>
    <div><label>Lote</label><input name="lote"></div>
    <fieldset class="ancho" id="corteBox" hidden><legend>Prueba de corte (% de los granos cortados)</legend><div class="rejilla">${CORTE.map(([k, n]) => `<div><label>${n}</label><input name="corte_${k}" inputmode="decimal"></div>`).join('')}</div><p class="nota">Se cortan a lo largo unos 100 granos y se cuenta cuántos hay de cada tipo.</p></fieldset>
    <div class="ancho" id="crBox" hidden><label>Descontar del crédito interno (L)</label><input name="retencion_credito" inputmode="decimal"><p class="nota" id="crNota"></p></div>
    <div class="ancho"><label>Observaciones</label><input name="observaciones"></div>
  </div><p class="nota" id="calc"></p><p class="nota" id="estim"></p><p class="nota" id="basN"></p><div class="acciones"><button>Registrar entrega</button></div></form>`;
  const f = $('#f'); let exig = null;
  const verCorte = () => { $('#corteBox').hidden = f.estado_cafe.value !== 'Cacao seco'; };
  const opc = () => { const p = leerProd(ps, f.productor_txt.value), v = f.certificacion.value;
    if (p && cultivos().length > 1 && productoDe(f.estado_cafe.value) !== cultivoProd(p)) { f.estado_cafe.value = ESTADOS[cultivoProd(p)][0]; verCorte(); } f.certificacion.innerHTML = '<option value="">Convencional</option>' + (p?.certificaciones || []).map(c => `<option value="${esc(c)}">${esc(nombreCert(c))}</option>`).join(''); if (p?.certificaciones.includes(v)) f.certificacion.value = v; };
  const verEstim = async () => { const p = leerProd(ps, f.productor_txt.value); if (!p) { $('#estim').textContent = ''; return; } const e = await estimadoProductor(p.id); $('#estim').innerHTML = e.est ? `Esta cosecha ha entregado <b>${qqTxt(e.ent)}</b> de un estimado de <b>${qqTxt(e.est)}</b> (puede llegar a ${qqTxt(e.tope)} con la tolerancia del ${e.tol} %).` : 'Este productor no tiene estimado de cosecha en sus parcelas.'; };
  const verCredito = async () => {
    const p = leerProd(ps, f.productor_txt.value); exig = null; $('#crBox').hidden = true; if (!p) return;
    try { const r = await q(sb.rpc('credito_exigible', { p: p.id, al: f.fecha.value || hoy() })); exig = r.find(x => num(x.exigible) > 0) || null; } catch (_) { exig = null; }
    if (!exig) return; $('#crBox').hidden = false; calcular();
  };
  const liquidar = d => {
    const peso = num(d.peso_lb), cac = d.estado_cafe === 'Cacao seco', hb = cac ? cfgN('CACAO_HUMEDAD_BASE', 7) : cfgN('HUMEDAD_BASE_ACOPIO', cfgN('HUMEDAD_MAXIMA', 12)), dp = cfgN('DESCUENTO_PUNTO_HUMEDAD', 1);
    const desc = Math.min(100, ((cac || ['Pergamino seco', 'Oro'].includes(d.estado_cafe)) && num(d.humedad) > hb ? (num(d.humedad) - hb) * dp : 0) + num(d.impurezas));
    const pag = r2(peso * (1 - desc / 100)), certsSel = d.certificacion ? [d.certificacion] : [];
    const sobre = (certsSel.some(esOrganica) ? cfgN('SOBREPRECIO_ORGANICO_LB', 0) : 0) + (certsSel.includes('fairtrade') ? cfgN('SOBREPRECIO_FT_LB', 0) : 0);
    const total = d.precio_lb ? r2(pag * (num(d.precio_lb) + sobre)) : 0;
    return { desc: r2(desc), pag, sobre, total };
  };
  const calcular = () => {
    const d = datosForm(f), ps2 = aPergaminoSeco(d.estado_cafe, d.peso_lb), cac = d.estado_cafe === 'Cacao seco', hm = cac ? cfgN('CACAO_HUMEDAD_BASE', 7) : cfgN('HUMEDAD_MAXIMA', 12), l = liquidar(d);
    if (exig) {
      const sug = r2(Math.min(num(exig.exigible), l.total * (pctRet || 100) / 100));
      if (!f.retencion_credito.dataset.tocado) f.retencion_credito.value = pctRet ? (l.total ? sug : '') : '';
      $('#crNota').innerHTML = `Tiene el crédito <b>${esc(exig.numero)}</b> con <b>${L(exig.exigible)}</b> por pagar (cuotas vencidas y la del próximo mes). ${pctRet ? `Se sugiere descontar el ${pctRet} % de la entrega.` : 'Escribí cuánto descontar, o dejalo vacío para no descontar.'}`;
    }
    const ret = Math.min(num(f.retencion_credito.value), l.total);
    $('#calc').innerHTML = num(d.peso_lb) ? `Equivale a <b>${ps2.toLocaleString('es-HN')} lb (${(ps2 / 100).toFixed(2)} qq)</b> de ${secoTxt(productoDe(d.estado_cafe))}` +
      (l.desc ? ` · descuento por calidad <b>${l.desc} %</b> · peso pagable <b>${l.pag.toLocaleString('es-HN')} lb</b>` : '') +
      (l.total ? ` · total <b>${L(l.total)}</b>${l.sobre ? ` (incluye sobreprecio de L ${l.sobre} por libra)` : ''}${ret ? ` · menos crédito ${L(ret)} · <b>neto a pagar ${L(l.total - ret)}</b>` : ''}` : '') +
      ((cac || ['Pergamino seco', 'Oro'].includes(d.estado_cafe)) && num(d.humedad) > hm ? ` · <span class="error">humedad arriba del ${hm} %</span>` : '') +
      (cac && d.corte_fermentado && num(d.corte_fermentado) < cfgN('CACAO_FERMENTADO_MIN', 70) ? ` · <span class="error">fermentación abajo del ${cfgN('CACAO_FERMENTADO_MIN', 70)} %</span>` : '') +
      (cac && d.corte_moho && num(d.corte_moho) > cfgN('CACAO_MOHO_MAX', 3) ? ` · <span class="error">moho arriba del ${cfgN('CACAO_MOHO_MAX', 3)} %</span>` : '') : '';
    const b = bas.find(x => x.id === f.bascula_id.value);
    $('#basN').innerHTML = b?.vence && b.vence < (d.fecha || hoy()) ? `<span class="error">La báscula «${esc(b.nombre)}» tiene la calibración vencida desde ${esc(b.vence)}. La entrega se registra, pero queda el aviso.</span>` : !bas.length ? 'No hay básculas registradas. Se agregan en Certificaciones › Básculas.' : '';
  };
  f.bodega.onchange = () => { const b = bas.find(x => x.bodega && norm(x.bodega) === norm(f.bodega.value)); if (b) f.bascula_id.value = b.id; calcular(); };
  f.bodega.onchange();
  f.retencion_credito.oninput = () => { f.retencion_credito.dataset.tocado = '1'; };
  f.productor_txt.oninput = () => { opc(); verEstim(); verCredito(); }; opc(); verEstim(); verCredito();
  f.estado_cafe.onchange = () => { verCorte(); calcular(); }; verCorte();
  f.oninput = calcular;
  f.onsubmit = async ev => {
    ev.preventDefault(); const d = datosForm(f), p = leerProd(ps, d.productor_txt);
    const corte = d.estado_cafe === 'Cacao seco' ? Object.fromEntries(CORTE.map(([k]) => [k, d['corte_' + k]]).filter(([, v]) => v !== '' && v != null).map(([k, v]) => [k, num(v)])) : null;
    CORTE.forEach(([k]) => delete d['corte_' + k]);
    if (!p) return aviso('Elegí un productor de la lista.', true);
    if (d.certificacion && !p.certificaciones.includes(d.certificacion)) return aviso('Ese productor no está en esa certificación.', true);
    if (d.certificacion && p.estado_cert === 'No aprobado') return aviso('El productor no aprobó la inspección interna: su entrega entra como convencional.', true);
    if (num(d.peso_lb) <= 0) return aviso('Poné el peso.', true);
    const e = await estimadoProductor(p.id), nuevo = aPergaminoSeco(d.estado_cafe, d.peso_lb) / 100;
    if (e.est > 0 && e.ent + nuevo > e.tope) {
      const motivo = prompt(`Con esta entrega ${p.nombre} llega a ${qqTxt(e.ent + nuevo)} y su estimado de cosecha es ${qqTxt(e.est)} (con la tolerancia del ${e.tol} %, hasta ${qqTxt(e.tope)}). Puede ser producto de otra finca. Escribí el motivo para registrarla de todos modos:`);
      if (!motivo) return aviso('No se registró la entrega.', true);
      d.observaciones = [d.observaciones, 'Pasa el estimado de cosecha: ' + motivo].filter(Boolean).join(' · ');
    }
    if (esOrganica(d.certificacion) && e.parc.length) {
      const eo = e.parc.map(estadoOrganico), orgs = eo.filter(x => x.ok).length;
      if (!orgs && !eo.some(x => x.ok === null)) return aviso('Ninguna parcela de este productor ha terminado la transición orgánica: su producto no se puede recibir como orgánico.', true);
      if (orgs < eo.length && !confirm(`${eo.length - orgs} de las ${eo.length} parcelas de este productor no están confirmadas como orgánicas (en transición o sin dato). ¿Registrar la entrega como ${nombreCert(d.certificacion)} de todos modos?`)) return;
    }
    const l = liquidar(d), ret = exig && d.retencion_credito ? Math.min(num(d.retencion_credito), l.total) : 0;
    if (ret > num(exig?.exigible) + 0.01 && !confirm(`Vas a descontar ${L(ret)} y lo que está por pagar del crédito es ${L(exig.exigible)}. ¿Descontar de todos modos?`)) return;
    ocupado(f, true);
    try {
      const r = await q(sb.from('acopio').insert({ id: nuevoId(), descuento_pct: l.desc, peso_pagable_lb: l.pag, sobreprecio_lb: d.precio_lb ? l.sobre : null, total: d.precio_lb ? l.total : null, neto_pagar: d.precio_lb ? r2(l.total - (exig ? ret : 0)) : null, org_id: S.org.id, productor_id: p.id, fecha: d.fecha, certificacion: d.certificacion || null, certificaciones: d.certificacion ? [d.certificacion] : [], estado_cafe: d.estado_cafe, peso_lb: num(d.peso_lb), humedad: d.humedad ? num(d.humedad) : null, impurezas: d.impurezas ? num(d.impurezas) : null, defectos: d.defectos ? num(d.defectos) : null, precio_lb: d.precio_lb ? num(d.precio_lb) : null, psec_lb: aPergaminoSeco(d.estado_cafe, d.peso_lb), producto: productoDe(d.estado_cafe), ...(corte && Object.keys(corte).length ? { datos: { corte } } : {}), lote: d.lote, bodega: d.bodega || null, bascula_id: d.bascula_id || null, retencion_credito: exig ? ret : 0, credito_id: ret ? exig.credito_id : null, observaciones: d.observaciones }).select('id,numero').single());
      if (r._local) aviso('Sin señal: la entrega quedó en el teléfono y se manda sola al volver la señal. El número oficial sale al mandarla.');
      else { aviso('Entrega registrada: ' + r.numero); archivarLuego(true); }
      location.hash = '#/recibo/' + r.id;
    } catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
};
RUTAS.recibo = async function verRecibo(id) {
  let a;
  try { a = await q(sb.from('acopio').select('*, productores(codigo,nombre,comunidad,telefono,identidad)').eq('id', id).single()); }
  catch (e) {
    const x = OFF.cola().find(y => y.tabla === 'acopio' && [].concat(y.cuerpo).some(z => z.id === id)); if (!x) throw e;
    const cu = [].concat(x.cuerpo).find(z => z.id === id), pr = (await prods()).find(z => z.id === cu.productor_id) || {};
    a = { ...cu, numero: 'Provisional ' + id.slice(0, 8).toUpperCase(), estado_pago: 'Pendiente', productores: pr, _local: true };
  }
  await certs().catch(() => []);
  const cr = a.credito_id ? (await sb.from('creditos').select('numero').eq('id', a.credito_id).maybeSingle().then(r => r, () => ({}))).data : null;
  const pr = a.productores || {}, fila = (k, v) => v === '' || v == null ? '' : `<tr><th style="text-align:left;width:45%">${k}</th><td>${v}</td></tr>`;
  const ps2 = num(a.psec_lb), certTxt = (a.certificaciones || []).map(nombreCert).join(', ') || 'Convencional';
  const prodA = a.producto || productoDe(a.estado_cafe), deQue = prodA === 'Cacao' ? 'cacao' : 'café', corte = a.datos?.corte;
  const corteTxt = corte ? CORTE.filter(([k]) => corte[k] != null).map(([k, n]) => `${n.split(' (')[0].toLowerCase()} ${corte[k]} %`).join(', ') : '';
  const texto = [`*${S.org.nombre}*`, `Recibo de ${deQue} ${a.numero} · ${a.fecha}`, `${pr.codigo || ''} ${pr.nombre || ''}`, `${a.estado_cafe}: ${num(a.peso_lb).toLocaleString('es-HN')} lb${a.humedad != null ? ' · humedad ' + a.humedad + ' %' : ''}`,
    corteTxt ? `Prueba de corte: ${corteTxt}` : '', num(a.descuento_pct) ? `Descuento por calidad: ${a.descuento_pct} % · peso pagable ${num(a.peso_pagable_lb).toLocaleString('es-HN')} lb` : '', `Certificación: ${certTxt}`,
    a.total != null ? `Total: ${L(a.total)}` : '', num(a.retencion_credito) ? `Abono al crédito ${cr?.numero || ''}: ${L(a.retencion_credito)}` : '', a.neto_pagar != null ? `*Neto a pagar: ${L(a.neto_pagar)}*` : '', a.lote ? `Lote: ${a.lote}` : ''].filter(Boolean).join('\n');
  const tel = String(pr.telefono || '').replace(/\D/g, ''), wa = 'https://wa.me/' + (tel ? (tel.length === 8 ? '504' + tel : tel) : '') + '?text=' + encodeURIComponent(texto);
  app().innerHTML = cabecera('Recibo de ' + deQue, '#/acopios') + revisionHTML('acopio', a) + `<div class="caja" id="recibo" style="max-width:560px">
    <p style="text-align:center;margin:0"><b>${esc(S.org.nombre)}</b><br>Recibo de entrega de ${deQue}</p>
    <p style="text-align:center;font-size:1.2em;margin:6px 0"><b>${esc(a.numero)}</b></p>${a._local ? '<p class="nota" style="text-align:center">Registrado sin señal. Está en la bandeja del teléfono; el número oficial sale cuando se mande.</p>' : ''}
    <div class="tabla"><table><tbody>
      ${fila('Fecha', esc(a.fecha))}${fila('Productor', `${esc(pr.codigo || '')} ${esc(pr.nombre || '')}`)}${fila('Comunidad', esc(pr.comunidad || ''))}${fila('Identidad', esc(pr.identidad || ''))}
      ${fila('Bodega', esc(a.bodega || ''))}${fila(prodA, esc(a.estado_cafe))}${fila('Certificación', esc(certTxt))}${fila('Lote', esc(a.lote || ''))}
      ${fila('Peso neto', num(a.peso_lb).toLocaleString('es-HN') + ' lb')}${fila('Humedad', a.humedad != null ? a.humedad + ' %' : '')}${fila('Impurezas', a.impurezas != null ? a.impurezas + ' %' : '')}${fila('Defectos', a.defectos != null ? a.defectos + ' %' : '')}${corteTxt ? fila('Prueba de corte', esc(corteTxt)) : ''}
      ${num(a.descuento_pct) ? fila('Descuento por calidad', a.descuento_pct + ' %') + fila('Peso pagable', num(a.peso_pagable_lb).toLocaleString('es-HN') + ' lb') : ''}
      ${fila('Equivale en ' + secoTxt(prodA), `${ps2.toLocaleString('es-HN')} lb (${(ps2 / 100).toFixed(2)} qq)`)}
      ${a.precio_lb != null ? fila('Precio por libra', 'L ' + num(a.precio_lb).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 4 })) : ''}${num(a.sobreprecio_lb) ? fila('Sobreprecio por libra', 'L ' + num(a.sobreprecio_lb).toFixed(2)) : ''}
      ${a.total != null ? fila('Total', `<b>${L(a.total)}</b>`) : ''}${num(a.retencion_credito) ? fila('Abono al crédito ' + esc(cr?.numero || ''), '− ' + L(a.retencion_credito)) : ''}
      ${a.neto_pagar != null ? fila('Neto a pagar', `<b style="font-size:1.15em">${L(a.neto_pagar)}</b>`) : ''}${fila('Pago', esc(a.estado_pago || 'Pendiente') + (a.pagado_fecha ? ' el ' + esc(a.pagado_fecha) : ''))}
    </tbody></table></div>
    ${a.observaciones ? `<p class="nota">${esc(a.observaciones)}</p>` : ''}
    <div style="display:flex;justify-content:space-between;gap:24px;margin-top:48px"><div style="flex:1;border-top:1px solid #333;text-align:center;padding-top:4px">Recibió</div><div style="flex:1;border-top:1px solid #333;text-align:center;padding-top:4px">Productor</div></div>
  </div><div class="acciones"><button id="imp">Imprimir</button><a class="boton sec" target="_blank" rel="noopener" href="${esc(wa)}">Mandar por WhatsApp</a>${esJefe() && a.estado_pago !== 'Pagado' && !a._local ? '<button class="sec" id="pagar">Marcar como pagado</button>' : ''}<a class="boton sec" href="#/acopio">Registrar otra entrega</a></div>`;
  $('#imp').onclick = () => window.print();
  const pg = $('#pagar'); if (pg) pg.onclick = async () => { if (!confirm(`¿Se le pagó ${a.neto_pagar != null ? L(a.neto_pagar) : 'la entrega'} a ${pr.nombre}?`)) return; try { await q(sb.from('acopio').update({ estado_pago: 'Pagado', pagado_fecha: hoy() }).eq('id', id)); aviso('Pago registrado.'); RUTAS.recibo(id); } catch (e) { aviso(falla(e), true); } };
  conectarRevision('acopio', id);
};
RUTAS.acopios = async function verAcopios(mes) {
  mes = mes || hoy().slice(0, 7); await certs();
  const filas = await q(sb.from('acopio').select('*, productores(nombre)').eq('org_id', S.org.id).gte('fecha', mes + '-01').lt('fecha', sumarMeses(mes + '-01', 1)).order('fecha', { ascending: false }));
  const s = k => filas.reduce((t, x) => t + num(x[k]), 0);
  app().innerHTML = cabecera('Acopio') + `<div class="filtros"><input type="month" id="mes" value="${mes}"><a class="boton" href="#/acopio">+ Registrar entrega</a></div>
  <div class="tabla"><table><thead><tr><th>Número</th><th>Fecha</th><th>Productor</th><th>Producto</th><th class="n">Peso (lb)</th><th class="n">Humedad</th><th class="n">${mayus(secoTxt())} (lb)</th><th>Certificación</th><th class="n">Total</th><th class="n">Neto a pagar</th><th>Pago</th></tr></thead><tbody>
  ${filas.map(x => `<tr><td><a href="#/recibo/${x.id}">${esc(x.numero)}</a></td><td>${esc(x.fecha)}</td><td>${esc(x.productores?.nombre)}</td><td>${esc(x.estado_cafe)}</td><td class="n">${num(x.peso_lb).toLocaleString('es-HN')}</td><td class="n">${x.humedad ?? ''}</td><td class="n">${num(x.psec_lb).toLocaleString('es-HN')}</td><td>${esc(nombreCert(x.certificacion))}${x.lote ? `<br><a class="nota" href="#/lote/${encodeURIComponent(x.lote)}">Lote ${esc(x.lote)}</a>` : ''}</td><td class="n">${x.total ? L(x.total) : ''}</td><td class="n">${x.neto_pagar != null ? L(x.neto_pagar) : ''}${num(x.retencion_credito) ? `<br><span class="nota">crédito ${L(x.retencion_credito)}</span>` : ''}</td><td>${esc(x.estado_pago || '')}</td></tr>`).join('') || '<tr><td colspan="11" class="nota">Sin entregas en este mes.</td></tr>'}
  </tbody>${filas.length ? `<tfoot><tr><th colspan="6">Total del mes</th><th class="n">${s('psec_lb').toLocaleString('es-HN')} lb (${(s('psec_lb') / 100).toFixed(2)} qq)</th><th></th><th class="n">${L(s('total'))}</th><th class="n">${L(s('neto_pagar'))}</th><th></th></tr></tfoot>` : ''}</table></div>`;
  $('#mes').onchange = e => location.hash = '#/acopios/' + e.target.value;
};

RUTAS.bandeja = async function verBandeja() {
  const c = OFF.cola(), tipo = { acopio: 'Entrega de acopio', inspecciones: 'Inspección interna', no_conformidades: 'No conformidad', insumos_aplicados: 'Insumo aplicado', parcelas: 'Historial de parcela', productores: 'Resultado de inspección' };
  const ps = await prods().catch(() => []), quien = id => ps.find(p => p.id === id)?.nombre || '';
  app().innerHTML = cabecera('Trabajo sin señal', '#/') + `<div class="caja"><p><b>${navigator.onLine && !S.sinSenal ? 'Hay señal.' : 'Sin señal.'}</b> ${c.length ? `Hay ${c.length} registro${c.length > 1 ? 's' : ''} guardado${c.length > 1 ? 's' : ''} en este teléfono.` : 'No hay nada pendiente de mandar.'}</p>
    <p class="nota">Sin señal se puede registrar la inspección interna, el acopio (con su recibo) y los insumos aplicados. Se guardan en el teléfono y se mandan solos cuando vuelve la señal. Antes de salir al campo, con señal, tocá «Preparar para el campo» para guardar productores, parcelas, básculas y configuración.</p>
    <div class="acciones"><button id="prep">Preparar para el campo</button>${c.length ? '<button class="sec" id="mandar">Mandar ahora</button>' : ''}${pedirInstalar ? '<button class="sec" id="instalar">Instalar la aplicación</button>' : ''}</div><p class="nota" id="prepN"></p></div>
  ${c.length ? `<div class="tabla"><table><thead><tr><th>Registrado</th><th>Qué es</th><th>Productor</th><th>Estado</th><th></th></tr></thead><tbody>
  ${c.map((x, i) => { const cu = [].concat(x.cuerpo)[0] || {}; return `<tr><td>${fechaHora(x.cuando)}</td><td>${esc(tipo[x.tabla] || x.tabla)}${[].concat(x.cuerpo).length > 1 ? ' (' + [].concat(x.cuerpo).length + ')' : ''}${x.tabla === 'acopio' ? ` · <a href="#/recibo/${cu.id}">recibo</a>` : ''}</td><td>${esc(quien(cu.productor_id))}</td><td>${x.error ? `<span class="error">${esc(x.error)}</span>` : i === 0 && enviando ? 'Enviando…' : 'Por enviar'}</td><td>${x.error ? `<button class="sec" data-quitar="${esc(x.n)}">Quitar</button>` : ''}</td></tr>`; }).join('')}</tbody></table></div>
  <p class="nota">Se mandan en orden. Si uno tiene problema, los demás esperan: revisá el motivo y, si no se puede arreglar, quitalo (se pierde lo que tenía) y registralo de nuevo con señal.</p>` : ''}`;
  $('#prep').onclick = async () => {
    const n = $('#prepN'); n.textContent = 'Guardando…';
    try {
      const [p2] = await Promise.all([prods(true), certs(), parcelasOrg(true), basculasActivas(), q(sb.from('condiciones_credito').select('*').eq('org_id', S.org.id).eq('activa', true).order('orden')).catch(() => [])]);
      await Promise.all(p2.filter(p => p.activo !== false).slice(0, 400).map(p => q(sb.rpc('credito_exigible', { p: p.id, al: hoy() })).catch(() => [])));
      guardarSesionLocal(); n.textContent = `Listo: ${p2.length} productores, ${(S._parcs?.lista || []).length} parcelas y la configuración quedaron en el teléfono.`;
    } catch (e) { n.textContent = falla(e); }
  };
  const m = $('#mandar'); if (m) m.onclick = async () => { await enviarCola(true); RUTAS.bandeja(); };
  const ins = $('#instalar'); if (ins) ins.onclick = async () => { pedirInstalar.prompt(); await pedirInstalar.userChoice.catch(() => {}); pedirInstalar = null; RUTAS.bandeja(); };
  app().querySelectorAll('[data-quitar]').forEach(b => b.onclick = () => { if (!confirm('¿Quitar este registro del teléfono? Lo que tenía se pierde.')) return; OFF.ponerCola(OFF.cola().filter(x => x.n !== b.dataset.quitar).map(x => ({ ...x, error: undefined }))); RUTAS.bandeja(); });
};
RUTAS.inventario = async function verInventario() {
  const desde = sumarMeses(hoy(), -24);
  const [aco, ben, des] = await Promise.all([
    q(sb.from('acopio').select('lote,bodega,psec_lb,certificaciones,fecha').eq('org_id', S.org.id).gte('fecha', desde).limit(10000)),
    q(sb.from('beneficiado').select('lote,peso_entrada_lb,peso_salida_lb,fecha_fin').eq('org_id', S.org.id).limit(5000)),
    q(sb.from('despachos').select('numero,fecha,lotes,psec_lb,tipo_cafe').eq('org_id', S.org.id).gte('fecha', desde).limit(2000)), certs()]);
  const I = {}, k = l => String(l || 'SIN LOTE').trim().toUpperCase();
  aco.forEach(a => { const x = I[k(a.lote)] ||= { lote: k(a.lote), bodegas: {}, entra: 0, sale: 0, certs: null, ultimo: a.fecha }; x.entra += num(a.psec_lb); const b = a.bodega || 'Sin bodega'; x.bodegas[b] = (x.bodegas[b] || 0) + num(a.psec_lb); x.certs = x.certs ? x.certs.filter(c => (a.certificaciones || []).includes(c)) : [...(a.certificaciones || [])]; if (a.fecha > x.ultimo) x.ultimo = a.fecha; });
  // Lo despachado por lote: «LOTE-1: 10 qq; LOTE-2» (si no dice cantidad, se reparte el despacho entre sus lotes)
  const sinCant = [];
  des.forEach(d => {
    const partes = String(d.lotes || '').split(/[;,\n]+/).map(s => s.trim()).filter(Boolean); if (!partes.length) { sinCant.push(d); return; }
    const conQ = partes.map(s => { const [l, c] = s.split(':'); const m = String(c || '').match(/([\d.]+)\s*(qq|lb)?/i); return { l: k(l), lb: m ? num(m[1]) * (/lb/i.test(m[2] || '') ? 1 : 100) : null }; });
    const libres = conQ.filter(x => x.lb === null), usado = conQ.reduce((t, x) => t + (x.lb || 0), 0), resto = Math.max(0, num(d.psec_lb) - usado);
    conQ.forEach(x => { const lb = x.lb ?? resto / libres.length; (I[x.l] ||= { lote: x.l, bodegas: {}, entra: 0, sale: 0, certs: [], ultimo: d.fecha }).sale += lb; });
  });
  const filas = Object.values(I).sort((a, b) => b.ultimo < a.ultimo ? -1 : 1);
  const tot = filas.reduce((t, x) => t + x.entra - x.sale, 0);
  const porBodega = {}; filas.forEach(x => { const disp = x.entra - x.sale; if (disp <= 0 || !x.entra) return; Object.entries(x.bodegas).forEach(([b, v]) => porBodega[b] = (porBodega[b] || 0) + disp * v / x.entra); });
  app().innerHTML = cabecera('Inventario por lote y bodega') + `<div class="tarjetas"><div class="tarjeta"><span>En existencia</span><b>${qqTxt(tot / 100)}</b><span>${secoTxt()}, últimos 24 meses</span></div>
    ${Object.entries(porBodega).map(([b, v]) => `<div class="tarjeta"><span>${esc(b)}</span><b>${qqTxt(v / 100)}</b></div>`).join('')}</div>
  <div class="filtros"><input id="bus" placeholder="Buscar lote"><label style="display:flex;gap:6px;align-items:center;font-weight:400"><input type="checkbox" id="soloEx" style="width:auto" checked> Solo con existencia</label></div>
  <div class="tabla"><table><thead><tr><th>Lote</th><th>Bodega</th><th>Certificación</th><th class="n">Entró</th><th class="n">Salió (despachos)</th><th class="n">Queda</th></tr></thead><tbody>
  ${filas.map(x => { const q2 = x.entra - x.sale; return `<tr data-t="${esc(norm(x.lote))}" data-ex="${q2 > 0.5 ? 1 : 0}"><td><a href="#/lote/${encodeURIComponent(x.lote)}"><b>${esc(x.lote)}</b></a></td><td>${Object.keys(x.bodegas).map(esc).join(', ') || '—'}</td><td>${(x.certs || []).map(nombreCert).map(esc).join(', ') || 'Convencional'}</td><td class="n">${qqTxt(x.entra / 100)}</td><td class="n">${x.sale ? qqTxt(x.sale / 100) : ''}</td><td class="n ${q2 < -0.5 ? 'error' : ''}"><b>${qqTxt(q2 / 100)}</b>${q2 < -0.5 ? '<br><span class="nota">salió más de lo que entró</span>' : ''}</td></tr>`; }).join('') || '<tr><td colspan="6" class="nota">Sin acopios con lote.</td></tr>'}</tbody></table></div>
  ${sinCant.length ? `<p class="nota">${sinCant.length} despacho(s) no dicen de qué lote salieron (${sinCant.map(d => esc(d.numero)).join(', ')}): no se restan de ningún lote.</p>` : ''}
  <p class="nota">Todo en ${secoTxt()}. Lo despachado se toma de la casilla «Lotes que salen» de cada despacho; si dice la cantidad (por ejemplo «LOTE-1: 20 qq») se usa esa, si no, el despacho se reparte entre los lotes que nombra. El control por certificación está en el Balance de masas.</p>`;
  const filtrar = () => { const t = norm($('#bus').value), ex = $('#soloEx').checked; app().querySelectorAll('tr[data-t]').forEach(tr => tr.hidden = (t && !tr.dataset.t.includes(t)) || (ex && tr.dataset.ex !== '1')); };
  $('#bus').oninput = filtrar; $('#soloEx').onchange = filtrar; filtrar();
};
RUTAS.basculas = async function verBasculas() {
  const filas = await q(sb.from('basculas').select('*').eq('org_id', S.org.id).order('activa', { ascending: false }).order('nombre'));
  const dias = cfgN('BASCULA_DIAS_AVISO', 30), bodegas = lista(S.cfg.BODEGAS);
  const estado = b => !b.vence ? '<span class="nota">Sin fecha</span>' : b.vence < hoy() ? '<span class="error">Vencida</span>' : diasEntre(hoy(), b.vence) <= dias ? `<span style="color:#92400e">Vence en ${diasEntre(hoy(), b.vence)} días</span>` : 'Vigente';
  app().innerHTML = cabecera('Básculas y calibración') + `${esJefe() ? `<form class="caja" id="f"><div class="rejilla">
    <div><label>Báscula</label><select name="id"><option value="">Nueva báscula</option>${filas.map(b => `<option value="${b.id}">${esc(b.nombre)}</option>`).join('')}</select></div>
    <div><label>Nombre</label><input name="nombre" required placeholder="Báscula de plataforma 1"></div>
    <div><label>Bodega</label><select name="bodega">${opciones(['', ...bodegas])}</select></div>
    <div><label>Capacidad</label><input name="capacidad" placeholder="500 kg"></div>
    <div><label>Última calibración</label><input type="date" name="ultima_calibracion"></div>
    <div><label>Vence</label><input type="date" name="vence"></div>
    <div><label>Certificado o quién la calibró</label><input name="certificado"></div>
    <div><label>¿En uso?</label><select name="activa">${opciones(['Sí', 'No'])}</select></div>
  </div><div class="acciones"><button>Guardar</button></div></form>` : ''}
  <div class="tabla"><table><thead><tr><th>Báscula</th><th>Bodega</th><th>Capacidad</th><th>Última calibración</th><th>Vence</th><th>Estado</th><th>Certificado</th></tr></thead><tbody>
  ${filas.map(b => `<tr${b.activa ? '' : ' style="color:var(--gris)"'}><td>${esc(b.nombre)}${b.activa ? '' : ' (fuera de uso)'}</td><td>${esc(b.bodega || '')}</td><td>${esc(b.capacidad || '')}</td><td>${esc(b.ultima_calibracion || '')}</td><td>${esc(b.vence || '')}</td><td>${b.activa ? estado(b) : ''}</td><td>${esc(b.certificado || '')}</td></tr>`).join('') || '<tr><td colspan="7" class="nota">Todavía no hay básculas registradas.</td></tr>'}</tbody></table></div>
  <p class="nota">Las certificadoras piden que la báscula del acopio esté calibrada. Cuando faltan ${dias} días o menos para que venza, sale el aviso en el panel de Certificaciones, y si está vencida, cada entrega pesada en ella queda con la nota. Las bodegas se ponen en Configuración.</p>`;
  const f = $('#f'); if (!f) return;
  f.id.onchange = () => { const b = filas.find(x => x.id === f.id.value) || {}; ['nombre', 'bodega', 'capacidad', 'ultima_calibracion', 'vence', 'certificado'].forEach(k => f[k].value = b[k] || ''); f.activa.value = b.activa === false ? 'No' : 'Sí'; };
  f.onsubmit = async ev => {
    ev.preventDefault(); const d = datosForm(f);
    if (d.vence && d.ultima_calibracion && d.vence < d.ultima_calibracion) return aviso('La fecha de vencimiento no puede ser antes de la calibración.', true);
    const reg = { nombre: d.nombre, bodega: d.bodega || null, capacidad: d.capacidad || null, ultima_calibracion: d.ultima_calibracion || null, vence: d.vence || null, certificado: d.certificado || null, activa: d.activa === 'Sí' };
    ocupado(f, true);
    try { if (d.id) await q(sb.from('basculas').update(reg).eq('id', d.id)); else await q(sb.from('basculas').insert({ ...reg, org_id: S.org.id })); aviso('Báscula guardada.'); RUTAS.basculas(); }
    catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
};

async function disponibleCert(cert, anio, producto = 'Café') {
  const r = await q(sb.from('balance_masas_producto').select('*').eq('org_id', S.org.id).eq('anio', anio).eq('producto', producto).eq('certificacion', cert || 'Convencional'));
  return r[0] ? num(r[0].disponible_psec_lb) : 0;
}
RUTAS.despacho = async function formDespacho() {
  const cs = await certs(), anio = new Date().getFullYear();
  const desp = await q(sb.from('despachos').select('*').eq('org_id', S.org.id).order('fecha', { ascending: false }).limit(100));
  app().innerHTML = cabecera('Despacho y venta') + `<form class="caja" id="f"><div class="rejilla">
    <div><label>Fecha</label><input type="date" name="fecha" required value="${hoy()}"></div>
    <div><label>Contrato</label><input name="contrato"></div><div><label>Comprador</label><input name="comprador" required></div>
    <div><label>Certificación con la que se vende</label><select name="certificacion" id="cert"><option value="">Convencional</option>${cs.map(c => `<option value="${esc(c.codigo)}">${esc(c.nombre)}</option>`).join('')}</select></div>
    <div><label>Qué se vende</label><select name="tipo_cafe">${opciones([...(cultivos().includes('Café') ? ['Oro', 'Pergamino seco'] : []), ...(cultivos().includes('Cacao') ? ['Cacao seco'] : [])])}</select></div>
    <div><label>Peso (libras)</label><input name="peso_lb" required inputmode="decimal"></div>
    <div><label>Precio (USD por libra)</label><input name="precio_usd_lb" inputmode="decimal"></div>
    <div><label>Lotes que salen</label><input name="lotes"></div>
    <div class="ancho"><label>GeoJSON de la venta para EUDR (opcional)</label><textarea name="geojson" rows="3"></textarea></div>
  </div><p class="nota" id="calc"></p><div class="acciones"><button>Registrar despacho</button></div></form>
  <h2>Despachos registrados</h2><div class="tabla"><table><thead><tr><th>Número</th><th>Fecha</th><th>Comprador</th><th>Certificación</th><th class="n">Peso (lb)</th><th class="n">Prima (USD)</th><th>EUDR</th></tr></thead><tbody>
  ${desp.map(x => `<tr><td>${esc(x.numero)}</td><td>${esc(x.fecha)}</td><td>${esc(x.comprador)}</td><td>${esc(nombreCert(x.certificacion))}</td><td class="n">${num(x.peso_lb).toLocaleString('es-HN')} ${esc(x.tipo_cafe)}</td><td class="n">${num(x.prima_usd).toFixed(2)}</td><td><a href="#/eudr/${x.id}">${x.dds_numero ? 'Declarado' : 'Revisar'}</a></td></tr>`).join('') || '<tr><td colspan="7" class="nota">Sin despachos.</td></tr>'}</tbody></table></div>`;
  const f = $('#f'), calc = d => { if (productoDe(d.tipo_cafe) === 'Cacao') return { ps: r2(num(d.peso_lb)), prima: d.certificacion === 'fairtrade' ? r2(num(d.peso_lb) * cfgN('PRIMA_FT_CACAO_USD_LB', 0.11)) : 0 }; const ps = d.tipo_cafe === 'Oro' ? num(d.peso_lb) / cfgN('RENDIMIENTO_PERGAMINO_ORO', 0.8) : num(d.peso_lb); const oro = d.tipo_cafe === 'Oro' ? num(d.peso_lb) : num(d.peso_lb) * cfgN('RENDIMIENTO_PERGAMINO_ORO', 0.8); return { ps: r2(ps), prima: d.certificacion === 'fairtrade' ? r2(oro * cfgN('PRIMA_FT_USD_LB', 0.2)) : 0 }; };
  f.oninput = async () => { const d = datosForm(f), c = calc(d); if (!num(d.peso_lb)) return $('#calc').textContent = ''; const disp = await disponibleCert(d.certificacion, +d.fecha.slice(0, 4) || anio, productoDe(d.tipo_cafe)); $('#calc').innerHTML = `Equivale a ${c.ps.toLocaleString('es-HN')} lb de ${secoTxt(productoDe(d.tipo_cafe))} · disponible en ${esc(nombreCert(d.certificacion))}: ${disp.toLocaleString('es-HN')} lb${c.ps > disp ? ' <b class="error">— no alcanza (sobreventa)</b>' : ''}${c.prima ? ` · prima de Comercio Justo: <b>USD ${c.prima.toFixed(2)}</b>` : ''}`; };
  f.onsubmit = async ev => {
    ev.preventDefault(); const d = datosForm(f), c = calc(d);
    let gj = null; if (d.geojson) { try { gj = JSON.parse(d.geojson); } catch (_) { return aviso('El GeoJSON no es válido.', true); } }
    const pr = productoDe(d.tipo_cafe), disp = await disponibleCert(d.certificacion, +d.fecha.slice(0, 4), pr);
    if (d.certificacion && c.ps > disp + 0.5) return aviso(`No se puede vender más ${pr.toLowerCase()} ${nombreCert(d.certificacion)} del que se compró (disponible ${disp.toLocaleString('es-HN')} lb de ${secoTxt(pr)}).`, true);
    ocupado(f, true);
    try { const r = await q(sb.from('despachos').insert({ org_id: S.org.id, fecha: d.fecha, contrato: d.contrato, comprador: d.comprador, certificacion: d.certificacion || null, certificaciones: d.certificacion ? [d.certificacion] : [], tipo_cafe: d.tipo_cafe, producto: productoDe(d.tipo_cafe), peso_lb: num(d.peso_lb), psec_lb: c.ps, precio_usd_lb: d.precio_usd_lb ? num(d.precio_usd_lb) : null, prima_usd: c.prima, lotes: d.lotes, geojson: gj }).select('numero').single()); aviso('Despacho registrado: ' + r.numero); RUTAS.despacho(); }
    catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
};
RUTAS.balance = async function verBalance(anio) {
  anio = +(anio || new Date().getFullYear()); await certs();
  const filas = await q(sb.from('balance_masas_producto').select('*').eq('org_id', S.org.id).eq('anio', anio).order('producto'));
  const varios = cultivos().length > 1 || new Set(filas.map(x => x.producto)).size > 1;
  app().innerHTML = cabecera('Balance de masas ' + anio) + `<div class="filtros"><select id="anio">${[anio - 1, anio, anio + 1].map(a => `<option ${a === anio ? 'selected' : ''}>${a}</option>`).join('')}</select></div>
  <div class="tabla"><table><thead><tr>${varios ? '<th>Producto</th>' : ''}<th>Certificación</th><th class="n">Comprado (lb ${varios ? 'equivalente seco' : secoTxt()})</th><th class="n">Vendido</th><th class="n">Disponible</th><th class="n">Disponible (qq)</th></tr></thead><tbody>
  ${filas.map(x => `<tr>${varios ? `<td>${esc(x.producto)}</td>` : ''}<td>${esc(nombreCert(x.certificacion === 'Convencional' ? null : x.certificacion))}</td><td class="n">${num(x.acopiado_psec_lb).toLocaleString('es-HN')}</td><td class="n">${num(x.vendido_psec_lb).toLocaleString('es-HN')}</td><td class="n ${num(x.disponible_psec_lb) < 0 ? 'error' : ''}">${num(x.disponible_psec_lb).toLocaleString('es-HN')}</td><td class="n">${(num(x.disponible_psec_lb) / 100).toFixed(2)}</td></tr>`).join('') || `<tr><td colspan="${varios ? 6 : 5}" class="nota">Sin movimientos en este año.</td></tr>`}
  </tbody></table></div><p class="nota">${cultivos().includes('Café') ? 'El café se lleva en pergamino seco: el uva, el húmedo y el oro se convierten con los factores de Configuración. ' : ''}${cultivos().includes('Cacao') ? 'El cacao se lleva en cacao seco: el cacao en baba se convierte con su factor de Configuración. ' : ''}Un disponible negativo indica sobreventa.</p>`;
  $('#anio').onchange = e => location.hash = '#/balance/' + e.target.value;
};
// ---------- documentos, actas, asistencia y paquete para la certificadora ----------
const TIPOS_DOC = ['Compromiso firmado', 'Contrato de entrega', 'Documento de la tierra', 'Identidad', 'Análisis de suelo', 'Plan de manejo', 'Otro'];
const estadoDoc = d => !d.vence ? ['Sin vencimiento', ''] : d.vence < hoy() ? ['Vencido', 'error'] : diasEntre(hoy(), d.vence) <= cfgN('DOCUMENTOS_DIAS_AVISO', 30) ? ['Vence pronto', 'error'] : ['Vigente', ''];
async function subirDocumento(arch, carpeta) {
  if (!arch) return null;
  if (arch.size > 10 * 1024 * 1024) throw new Error('El archivo pasa de 10 MB.');
  const ruta = `${S.org.id}/${carpeta}/${Date.now()}-${arch.name.replace(/[^\w.\-]+/g, '_')}`;
  const { error } = await sb.storage.from('documentos').upload(ruta, arch, { contentType: arch.type || undefined }); if (error) throw error; return ruta;
}
function verDocumentos(raiz) { raiz.querySelectorAll('[data-doc]').forEach(a => a.onclick = async e => { e.preventDefault(); const { data, error } = await sb.storage.from('documentos').createSignedUrl(a.dataset.doc, 300); if (error) return aviso(falla(error), true); window.open(data.signedUrl, '_blank', 'noopener'); }); }

// Documentos y capacitaciones dentro de la ficha del productor
async function fichaDocumentos(prodId) {
  const el = $('#docsProd'); if (!el) return;
  const [docs, asis] = await Promise.all([q(sb.from('documentos_productor').select('*').eq('productor_id', prodId).order('tipo')).catch(() => []), q(sb.from('capacitacion_asistentes').select('capacitacion_id, capacitaciones(fecha,tema)').eq('productor_id', prodId)).catch(() => [])]);
  el.innerHTML = `<h2>Documentos</h2>${docs.length ? `<div class="tabla"><table><thead><tr><th>Documento</th><th>Número</th><th>Emitido</th><th>Vence</th><th>Estado</th><th>Archivo</th></tr></thead><tbody>${docs.map(d => { const [e, c] = estadoDoc(d); return `<tr><td>${esc(d.tipo)}</td><td>${esc(d.numero || '')}</td><td>${esc(d.emitido || '')}</td><td>${esc(d.vence || '')}</td><td class="${c}">${e}</td><td>${d.archivo ? `<a href="#" data-doc="${esc(d.archivo)}">Ver</a>` : ''}</td></tr>`; }).join('')}</tbody></table></div>` : '<p class="nota">Sin documentos registrados.</p>'}
  <details class="carpeta"><summary>+ Agregar documento</summary><form class="caja" id="fDoc"><div class="rejilla">
    <div><label>Documento</label><select name="tipo">${opciones(TIPOS_DOC)}</select></div><div><label>Número</label><input name="numero"></div>
    <div><label>Emitido</label><input type="date" name="emitido"></div><div><label>Vence</label><input type="date" name="vence"></div>
    <div class="ancho"><label>Archivo (PDF o foto)</label><input type="file" name="arch" accept="image/*,application/pdf"></div><div class="ancho"><label>Notas</label><input name="notas"></div>
  </div><div class="acciones"><button>Guardar documento</button></div></form></details>
  <h2>Capacitaciones a las que asistió</h2>${asis.length ? `<ul>${asis.sort((a, b) => (b.capacitaciones?.fecha || '') < (a.capacitaciones?.fecha || '') ? -1 : 1).map(x => `<li>${esc(x.capacitaciones?.fecha || '')} · <a href="#/asistencia/${x.capacitacion_id}">${esc(x.capacitaciones?.tema || '')}</a></li>`).join('')}</ul>` : '<p class="nota">No aparece en ninguna lista de asistencia.</p>'}`;
  verDocumentos(el);
  const f = $('#fDoc'); f.onsubmit = async ev => {
    ev.preventDefault(); const d = datosForm(f);
    if (d.vence && d.emitido && d.vence < d.emitido) return aviso('La fecha de vencimiento es antes de la de emisión.', true);
    ocupado(f, true);
    try { const ruta = await subirDocumento(f.arch.files[0], 'productores/' + prodId); await q(sb.from('documentos_productor').insert({ org_id: S.org.id, productor_id: prodId, tipo: d.tipo, numero: d.numero || null, emitido: d.emitido || null, vence: d.vence || null, notas: d.notas || null, archivo: ruta })); aviso('Documento guardado.'); fichaDocumentos(prodId); }
    catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
}

RUTAS.actas = async function verActas() {
  const [actas, uso] = await Promise.all([q(sb.from('actas').select('*').eq('org_id', S.org.id).order('fecha', { ascending: false })), q(sb.from('prima_uso').select('acta_id,monto_usd,acta').eq('org_id', S.org.id))]);
  const usd = v => 'USD ' + num(v).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const usadoEn = id => uso.filter(u => u.acta_id === id).reduce((t, u) => t + num(u.monto_usd), 0);
  const sueltos = uso.filter(u => !u.acta_id);
  app().innerHTML = cabecera('Actas de asamblea y junta') + `${sueltos.length ? `<div class="caja nota error">${sueltos.length} gasto${sueltos.length > 1 ? 's' : ''} de la prima no ${sueltos.length > 1 ? 'están amarrados' : 'está amarrado'} a un acta registrada${sueltos.some(u => u.acta) ? ` (mencionan: ${[...new Set(sueltos.map(u => u.acta).filter(Boolean))].map(esc).join(', ')})` : ''}. Registrá el acta con ese mismo número y se amarran solos.</div>` : ''}
  <div class="tabla"><table><thead><tr><th>Número</th><th>Fecha</th><th>Tipo</th><th class="n">Asistentes</th><th class="n">Prima aprobada</th><th class="n">Prima usada</th><th>Acta</th></tr></thead><tbody>
  ${actas.map(a => { const u = usadoEn(a.id); return `<tr><td>${esc(a.numero)}</td><td>${esc(a.fecha)}</td><td>${esc(a.tipo)}</td><td class="n">${a.asistentes ?? ''}</td><td class="n">${a.prima_aprobada_usd != null ? usd(a.prima_aprobada_usd) : ''}</td><td class="n ${a.prima_aprobada_usd != null && u > num(a.prima_aprobada_usd) + 0.01 ? 'error' : ''}">${u ? usd(u) : ''}</td><td>${a.archivo ? `<a href="#" data-doc="${esc(a.archivo)}">Ver</a>` : ''}</td></tr>`; }).join('') || '<tr><td colspan="7" class="nota">Todavía no hay actas registradas.</td></tr>'}</tbody></table></div>
  ${esJefe() ? `<h2>Registrar acta</h2><form class="caja" id="f"><div class="rejilla">
    <div><label>Número</label><input name="numero" required placeholder="Acta 05-2026"></div><div><label>Fecha</label><input type="date" name="fecha" required value="${hoy()}"></div>
    <div><label>Tipo</label><select name="tipo">${opciones(['Asamblea', 'Junta directiva', 'Comité de prima'])}</select></div><div><label>Asistentes</label><input name="asistentes" inputmode="numeric"></div>
    <div><label>Prima que aprueba gastar (USD)</label><input name="prima_aprobada_usd" inputmode="decimal"></div><div class="ancho"><label>Acuerdos</label><textarea name="acuerdos"></textarea></div>
    <div class="ancho"><label>Acta escaneada (PDF o foto)</label><input type="file" name="arch" accept="image/*,application/pdf"></div>
  </div><div class="acciones"><button>Guardar acta</button></div></form>` : ''}`;
  verDocumentos(app());
  const f = $('#f'); if (f) f.onsubmit = async ev => {
    ev.preventDefault(); const d = datosForm(f); ocupado(f, true);
    try { const ruta = await subirDocumento(f.arch.files[0], 'actas'); await q(sb.from('actas').insert({ org_id: S.org.id, numero: d.numero, fecha: d.fecha, tipo: d.tipo, asistentes: d.asistentes ? +d.asistentes : null, prima_aprobada_usd: d.prima_aprobada_usd ? num(d.prima_aprobada_usd) : null, acuerdos: d.acuerdos || null, archivo: ruta })); aviso('Acta guardada.'); RUTAS.actas(); }
    catch (e) { ocupado(f, false); aviso(/duplicate/.test(e.message || '') ? 'Ya hay un acta con ese número.' : falla(e), true); }
  };
};

RUTAS.asistencia = async function verAsistencia(capId) {
  if (!capId) {
    const caps = await q(sb.from('capacitaciones').select('id,fecha,tema,mujeres,hombres, capacitacion_asistentes(count)').eq('org_id', S.org.id).order('fecha', { ascending: false }).limit(300));
    app().innerHTML = cabecera('Asistencia a capacitaciones') + `<p class="nota">Las listas que llegan de Kobo se pasan solas. Aquí se puede completar la lista de cualquier capacitación con los productores del padrón.</p><div class="tabla"><table><thead><tr><th>Fecha</th><th>Tema</th><th class="n">Mujeres</th><th class="n">Hombres</th><th class="n">Del padrón</th></tr></thead><tbody>
    ${caps.map(c => `<tr><td>${esc(c.fecha)}</td><td><a href="#/asistencia/${c.id}">${esc(c.tema)}</a></td><td class="n">${c.mujeres}</td><td class="n">${c.hombres}</td><td class="n">${c.capacitacion_asistentes?.[0]?.count ?? 0}</td></tr>`).join('') || '<tr><td colspan="5" class="nota">Sin capacitaciones.</td></tr>'}</tbody></table></div>`;
    return;
  }
  const [c, lista, ps] = await Promise.all([q(sb.from('capacitaciones').select('*').eq('id', capId).single()), q(sb.from('capacitacion_asistentes').select('*, productores(codigo,nombre,comunidad)').eq('capacitacion_id', capId).order('nombre')), prods()]);
  app().innerHTML = cabecera('Asistencia', '#/asistencia') + `<div class="caja"><b>${esc(c.tema)}</b> · ${esc(c.fecha)}${c.lugar ? ' · ' + esc(c.lugar) : ''}${c.facilitador ? ' · ' + esc(c.facilitador) : ''}</div>
  <div class="tabla"><table><thead><tr><th>Asistente</th><th>Código</th><th>Comunidad</th><th>Sexo</th></tr></thead><tbody>${lista.map(a => `<tr><td>${a.productor_id ? `<a href="#/prod/${a.productor_id}">${esc(a.productores?.nombre || a.nombre)}</a>` : esc(a.nombre || '')}</td><td>${esc(a.productores?.codigo || '')}</td><td>${esc(a.productores?.comunidad || '')}</td><td>${esc(a.sexo || '')}</td></tr>`).join('') || '<tr><td colspan="4" class="nota">Sin asistentes registrados.</td></tr>'}</tbody></table></div>
  <form class="caja" id="f"><div class="rejilla"><div class="ancho"><label>Agregar productor del padrón</label>${campoProd(ps).replace(' required', '')}</div><div class="ancho"><label>O alguien que no está en el padrón (nombre)</label><input name="nombre"></div><div><label>Sexo</label><select name="sexo">${opciones(['', 'Mujer', 'Hombre'])}</select></div></div><div class="acciones"><button>Agregar a la lista</button></div></form>`;
  const f = $('#f'); f.onsubmit = async ev => {
    ev.preventDefault(); const d = datosForm(f), p = d.productor_txt ? leerProd(ps, d.productor_txt) : null;
    if (d.productor_txt && !p) return aviso('Elegí un productor de la lista.', true);
    if (!p && !d.nombre) return aviso('Elegí un productor o escribí el nombre.', true);
    ocupado(f, true);
    try { await q(sb.from('capacitacion_asistentes').insert({ org_id: S.org.id, capacitacion_id: capId, productor_id: p?.id || null, nombre: p?.nombre || d.nombre, sexo: d.sexo || null })); aviso('Agregado a la lista.'); RUTAS.asistencia(capId); }
    catch (e) { ocupado(f, false); aviso(/duplicate|asis_unico/.test(e.message || '') ? 'Ese productor ya está en la lista.' : falla(e), true); }
  };
};

RUTAS.paquete = async function paqueteCertificadora() {
  if (!esJefe()) return RUTAS.cer();
  const cs = await certs(), anio = new Date().getFullYear();
  app().innerHTML = cabecera('Paquete para la certificadora') + `<form class="caja" id="f"><p class="nota">Un Excel con todo lo que suele pedir la auditoría (padrón, parcelas con su estado orgánico y EUDR, inspecciones, no conformidades, insumos, capacitaciones y asistencia, acopio por productor contra su estimado, ventas, balance de masas, uso de la prima con sus actas y documentos con vencimiento) y el GeoJSON de las parcelas. Queda guardado en el Archivo del panel.</p><div class="rejilla">
    <div><label>Certificación</label><select name="cert"><option value="todas">Todas</option>${cs.map(c => `<option value="${esc(c.codigo)}">${esc(c.nombre)}</option>`).join('')}</select></div>
    <div><label>Año</label><select name="anio">${[anio, anio - 1, anio - 2].map(a => `<option>${a}</option>`).join('')}</select></div></div>
    <div class="acciones"><button>Armar el paquete</button></div></form><div id="res"></div>`;
  const f = $('#f'); f.onsubmit = async ev => {
    ev.preventDefault(); const d = datosForm(f); ocupado(f, true); $('#res').innerHTML = '<p class="nota">Armando el paquete…</p>';
    try {
      const { data, error } = await sb.functions.invoke('archivo', { body: { org_id: S.org.id, accion: 'paquete', cert: d.cert, anio: +d.anio } });
      if (error) throw new Error((await error.context?.json?.().catch(() => null))?.error || error.message);
      $('#res').innerHTML = `<div class="caja"><p><b>Listo.</b> ${Object.entries(data.hojas).map(([k, v]) => `${esc(k)}: ${v}`).join(' · ')} · ${data.parcelas} parcelas en el mapa.</p><div class="acciones"><a class="boton" href="${esc(data.excel)}">Bajar el Excel</a><a class="boton sec" href="${esc(data.geojson)}">Bajar el GeoJSON</a></div><p class="nota">Los enlaces duran 10 minutos; después se bajan desde el Archivo del panel.</p></div>`;
    } catch (e) { $('#res').innerHTML = `<p class="error">${esc(falla(e))}</p>`; }
    ocupado(f, false);
  };
};

RUTAS.prima = async function verPrima() {
  const [desp, uso] = await Promise.all([q(sb.from('despachos').select('fecha,prima_usd,numero').eq('org_id', S.org.id).gt('prima_usd', 0)), q(sb.from('prima_uso').select('*').eq('org_id', S.org.id).order('fecha', { ascending: false }))]);
  const gen = desp.reduce((t, x) => t + num(x.prima_usd), 0), usado = uso.reduce((t, x) => t + num(x.monto_usd), 0), prod = uso.filter(x => x.categoria === 'Productividad y calidad').reduce((t, x) => t + num(x.monto_usd), 0), minPct = cfgN('PRIMA_PCT_PRODUCTIVIDAD', 25);
  const usd = v => 'USD ' + num(v).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  app().innerHTML = cabecera('Prima de Comercio Justo') + `<div class="tarjetas">
    <div class="tarjeta"><span>Generada</span><b style="font-size:22px">${usd(gen)}</b><span>${desp.length} despachos Fairtrade</span></div>
    <div class="tarjeta"><span>Usada</span><b style="font-size:22px">${usd(usado)}</b></div>
    <div class="tarjeta"><span>Disponible</span><b style="font-size:22px" class="${gen - usado < 0 ? 'error' : ''}">${usd(gen - usado)}</b></div>
    <div class="tarjeta"><span>Productividad y calidad</span><b style="font-size:22px" class="${usado && prod / usado * 100 < minPct ? 'error' : ''}">${usado ? (prod / usado * 100).toFixed(0) : 0} %</b><span>Mínimo ${minPct} %</span></div>
  </div><h2>Registrar uso de la prima</h2><form class="caja" id="f"><div class="rejilla">
    <div><label>Fecha</label><input type="date" name="fecha" required value="${hoy()}"></div><div class="ancho"><label>Concepto</label><input name="concepto" required></div>
    <div><label>Categoría</label><select name="categoria">${opciones(['Productividad y calidad', 'Servicios a socios', 'Comunidad y ambiente', 'Fortalecimiento de la organización'])}</select></div>
    <div><label>Monto (USD)</label><input name="monto_usd" required inputmode="decimal"></div><div><label>Acta de asamblea que lo aprueba</label><input name="acta"></div>
  </div><div class="acciones"><button>Registrar</button></div></form>
  <div class="tabla"><table><thead><tr><th>Fecha</th><th>Concepto</th><th>Categoría</th><th>Acta</th><th class="n">Monto</th></tr></thead><tbody>${uso.map(x => `<tr><td>${esc(x.fecha)}</td><td>${esc(x.concepto)}</td><td>${esc(x.categoria)}</td><td>${esc(x.acta)}${x.acta_id ? '' : ' <span class="error nota">sin acta registrada</span>'}</td><td class="n">${usd(x.monto_usd)}</td></tr>`).join('') || '<tr><td colspan="5" class="nota">Sin gastos registrados.</td></tr>'}</tbody></table></div><p class="nota">Las actas se registran en <a href="#/actas">Actas de asamblea</a>; cada gasto se amarra solo por el número del acta.</p>`;
  $('#f').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target, d = datosForm(f);
    if (num(d.monto_usd) > gen - usado + 0.01) return aviso('El gasto es mayor que la prima disponible.', true);
    if (!d.acta) return aviso('Anotá el acta de asamblea que aprueba el gasto.', true);
    ocupado(f, true);
    try { await q(sb.from('prima_uso').insert({ ...d, monto_usd: num(d.monto_usd), org_id: S.org.id })); aviso('Uso de la prima registrado.'); RUTAS.prima(); } catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
};

// ---------- registros sencillos: capacitaciones y beneficiado ----------
const REGISTROS = {
  capacitaciones: { titulo: 'Capacitaciones', orden: 'fecha', campos: [['fecha', 'Fecha', 'date', 1], ['tema', 'Tema', 'text', 1], ['facilitador', 'Facilitador'], ['lugar', 'Lugar'], ['mujeres', 'Mujeres que asistieron', 'int'], ['hombres', 'Hombres que asistieron', 'int'], ['certificaciones', 'Certificaciones o normas que cubre', 'certs'], ['acuerdos', 'Acuerdos y compromisos', 'area']], cols: ['fecha', 'tema', 'facilitador', 'lugar', 'mujeres', 'hombres'] },
  beneficiado: { titulo: 'Beneficiado y secado', orden: 'fecha_inicio', campos: [['lote', 'Lote', 'text', 1], ['fecha_inicio', 'Inicio', 'date'], ['fecha_fin', 'Fin', 'date'], ['metodo', 'Método de secado', 'sel', 0, ['Patio', 'Secadora solar', 'Secadora mecánica', 'Camas africanas']], ['peso_entrada_lb', 'Peso que entra (lb)', 'dec'], ['peso_salida_lb', 'Peso seco que sale (lb)', 'dec'], ['humedad_final', 'Humedad final (%)', 'dec'], ['aguas_mieles', 'Manejo de aguas mieles', 'sel', 0, ['Laguna de oxidación', 'Filtro', 'Fosa de infiltración', 'Se van a la quebrada o río']], ['observaciones', 'Observaciones', 'area']], cols: ['lote', 'fecha_inicio', 'fecha_fin', 'metodo', 'peso_entrada_lb', 'peso_salida_lb', 'humedad_final', 'aguas_mieles'] }
};
// Beneficiado del cacao: fermentación, secado y prueba de corte
const BENEFICIO_CACAO = { titulo: 'Fermentación y secado del cacao', orden: 'fecha_inicio', producto: 'Cacao', campos: [['lote', 'Lote', 'text', 1], ['fecha_inicio', 'Entra a fermentar', 'date'], ['fecha_fin', 'Sale seco', 'date'],
  ['fermentador', 'Fermentador', 'sel', 0, ['Cajón de madera', 'Cajones en escalera', 'Sacos', 'Montón', 'Otro']], ['dias_fermentacion', 'Días de fermentación', 'dec'], ['volteos', 'Volteos', 'int'],
  ['metodo', 'Método de secado', 'sel', 0, ['Patio', 'Marquesina o secadora solar', 'Camas africanas', 'Secadora mecánica']], ['dias_secado', 'Días de secado', 'dec'],
  ['peso_entrada_lb', 'Cacao en baba que entra (lb)', 'dec'], ['peso_salida_lb', 'Cacao seco que sale (lb)', 'dec'], ['humedad_final', 'Humedad final (%)', 'dec'],
  ['corte_fermentado', 'Prueba de corte: bien fermentado (%)', 'dec'], ['corte_violeta', 'Violeta (%)', 'dec'], ['corte_pizarra', 'Pizarroso (%)', 'dec'], ['corte_moho', 'Con moho (%)', 'dec'], ['corte_danado', 'Dañado (%)', 'dec'],
  ['observaciones', 'Observaciones', 'area']], cols: ['lote', 'fecha_inicio', 'fecha_fin', 'dias_fermentacion', 'volteos', 'dias_secado', 'peso_entrada_lb', 'peso_salida_lb', 'humedad_final', 'corte_fermentado'] };
RUTAS.reg = async function registro(tabla, prodSel) {
  const cs0 = cultivos(), cacaoBen = tabla === 'beneficiado' && cs0.includes('Cacao') && (cs0.length === 1 || prodSel === 'Cacao');
  const R = cacaoBen ? BENEFICIO_CACAO : REGISTROS[tabla]; if (!R) return RUTAS.cer();
  const cambio = tabla === 'beneficiado' && cs0.length > 1 ? `<div class="filtros">${['Café', 'Cacao'].map(c => `<a class="boton ${(c === 'Cacao') === cacaoBen ? '' : 'sec'}" href="#/reg/beneficiado/${c}">${c}</a>`).join('')}</div>` : '';
  const [filas, cs] = await Promise.all([q(sb.from(tabla).select('*').eq('org_id', S.org.id).order(R.orden, { ascending: false }).limit(300)), certs()]);
  const campo = ([k, t, tipo, req, ops]) => `<div class="${tipo === 'area' || tipo === 'certs' ? 'ancho' : ''}"><label>${t}</label>${tipo === 'area' ? `<textarea name="${k}"></textarea>` : tipo === 'certs' ? checksCert(cs, [], k) : tipo === 'sel' ? `<select name="${k}">${opciones(['', ...ops])}</select>` : `<input name="${k}" ${tipo === 'date' ? 'type="date"' : ''} ${['int', 'dec'].includes(tipo) ? 'inputmode="decimal"' : ''} ${req ? 'required' : ''}>`}</div>`;
  const etq = Object.fromEntries(R.campos.map(c => [c[0], c[1]]));
  const filasV = tabla === 'beneficiado' ? filas.filter(x => (x.producto || 'Café') === (cacaoBen ? 'Cacao' : 'Café')) : filas;
  app().innerHTML = cabecera(R.titulo) + cambio + `<form class="caja" id="f"><div class="rejilla">${R.campos.map(campo).join('')}</div><div class="acciones"><button>Registrar</button></div></form>
  <div class="tabla"><table><thead><tr>${R.cols.map(c => `<th>${esc(etq[c])}</th>`).join('')}</tr></thead><tbody>${filasV.map(x => `<tr>${R.cols.map(c => `<td>${esc(x[c] ?? '')}</td>`).join('')}</tr>`).join('') || `<tr><td colspan="${R.cols.length}" class="nota">Sin registros.</td></tr>`}</tbody></table></div>`;
  $('#f').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target, d = datosForm(f), reg = { org_id: S.org.id };
    R.campos.forEach(([k, , tipo]) => { reg[k] = tipo === 'certs' ? leerChecks(f, k) : ['int', 'dec'].includes(tipo) ? (d[k] ? num(d[k]) : (tipo === 'int' ? 0 : null)) : (d[k] || null); });
    if (tabla === 'beneficiado' && /río|quebrada/.test(reg.aguas_mieles || '')) aviso('Ojo: descargar aguas mieles a la quebrada o al río es una no conformidad grave.', true);
    const hMax = cacaoBen ? cfgN('CACAO_HUMEDAD_BASE', 7) : cfgN('HUMEDAD_MAXIMA', 12);
    if (tabla === 'beneficiado') reg.producto = cacaoBen ? 'Cacao' : 'Café';
    if (tabla === 'beneficiado' && reg.humedad_final > hMax) aviso(`La humedad final pasa del ${hMax} %.`, true);
    if (cacaoBen && reg.corte_fermentado != null && reg.corte_fermentado < cfgN('CACAO_FERMENTADO_MIN', 70)) aviso(`La prueba de corte da ${reg.corte_fermentado} % bien fermentado, abajo del mínimo de ${cfgN('CACAO_FERMENTADO_MIN', 70)} %.`, true);
    if (cacaoBen && reg.corte_moho != null && reg.corte_moho > cfgN('CACAO_MOHO_MAX', 3)) aviso(`La prueba de corte da ${reg.corte_moho} % de granos con moho, arriba del máximo de ${cfgN('CACAO_MOHO_MAX', 3)} %.`, true);
    ocupado(f, true);
    try { await q(sb.from(tabla).insert(reg)); aviso('Registro guardado.'); setTimeout(() => RUTAS.reg(tabla), 400); } catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
};

// ---------- quejas ----------
const URGENTES = ['Trabajo infantil', 'Trabajo forzoso', 'Abuso o acoso', 'Fraude o corrupción'];
RUTAS.queja = async function formQueja() {
  app().innerHTML = cabecera('Poner una queja o reclamo', esJefe() ? '#/quejas' : '#/cer') + `<form class="caja" id="f"><div class="rejilla">
    <div><label>Tipo</label><select name="tipo">${opciones(['Pago o precio', 'Calidad o pesaje', 'Trato del personal', 'Servicios a socios', ...URGENTES, 'Otro'])}</select></div>
    <div><label>¿Querés que sea anónima?</label><select name="anonima"><option value="no">No</option><option value="si">Sí, anónima</option></select></div>
    <div><label>Nombre (si no es anónima)</label><input name="nombre"></div><div><label>Teléfono o correo para responderte</label><input name="contacto"></div>
    <div class="ancho"><label>Qué pasó</label><textarea name="descripcion" required></textarea></div>
  </div><div class="acciones"><button>Enviar</button></div></form>`;
  $('#f').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target, d = datosForm(f), an = d.anonima === 'si'; ocupado(f, true);
    try { const idq = crypto.randomUUID(); await q(sb.from('quejas').insert({ id: idq, org_id: S.org.id, tipo: d.tipo, descripcion: d.descripcion, anonima: an, nombre: an ? null : d.nombre, contacto: an ? null : d.contacto, urgente: URGENTES.includes(d.tipo) })); avisar('queja', idq); aviso('Gracias. La queja quedó registrada.'); location.hash = esJefe() ? '#/quejas' : '#/cer'; }
    catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
};
RUTAS.quejas = async function verQuejas() {
  if (!esJefe()) return RUTAS.queja();
  const filas = await q(sb.from('quejas').select('*').eq('org_id', S.org.id).order('estado').order('fecha', { ascending: false }));
  const plazo = x => (x.urgente ? cfgN('QUEJAS_DIAS_URGENTE', 3) : cfgN('QUEJAS_DIAS_RESPUESTA', 30)) - diasEntre(x.fecha, hoy());
  app().innerHTML = cabecera('Quejas y reclamos') + `<div class="filtros"><a class="boton" href="#/queja">+ Registrar queja</a></div>
  <div class="tabla"><table><thead><tr><th>Número</th><th>Fecha</th><th>Tipo</th><th>Qué pasó</th><th>Quién</th><th>Estado</th><th></th></tr></thead><tbody>
  ${filas.map(x => { const p = plazo(x), ab = x.estado !== 'Cerrada'; return `<tr${x.urgente && ab ? ' style="background:#fef2f2"' : ''}><td>${esc(x.numero)}</td><td>${esc(x.fecha)}</td><td>${x.urgente ? '<b class="error">' + esc(x.tipo) + '</b>' : esc(x.tipo)}</td><td>${esc(x.descripcion)}${x.respuesta ? '<br><span class="nota">Respuesta: ' + esc(x.respuesta) + '</span>' : ''}</td><td>${x.anonima ? 'Anónima' : esc([x.nombre, x.contacto].filter(Boolean).join(' · '))}</td><td>${esc(x.estado)}${ab ? `<br><span class="nota ${p < 0 ? 'error' : ''}">${p < 0 ? 'Vencida hace ' + (-p) + ' días' : 'Quedan ' + p + ' días'}</span>` : ''}</td><td>${ab ? `<button class="sec" data-q="${x.id}">Responder</button>` : ''}</td></tr>`; }).join('') || '<tr><td colspan="7" class="nota">Sin quejas.</td></tr>'}</tbody></table></div>`;
  app().querySelectorAll('[data-q]').forEach(b => b.onclick = async () => {
    const r = prompt('Respuesta o acción tomada:'); if (!r) return; const cerrar = confirm('¿Cerrar la queja? (Cancelar = queda «En proceso»)');
    try { await q(sb.from('quejas').update({ respuesta: r, estado: cerrar ? 'Cerrada' : 'En proceso', cerrada: cerrar ? hoy() : null }).eq('id', b.dataset.q)); aviso('Queja actualizada.'); RUTAS.quejas(); } catch (e) { aviso(falla(e), true); }
  });
};

// ---------- catálogo y formularios de Kobo ----------
RUTAS.catalogo = async function verCatalogo() {
  const cs = await certs(true);
  app().innerHTML = cabecera('Catálogo de certificaciones', '#/cer') + `<div class="caja"><p class="nota">Marcá las certificaciones que usa esta organización. Las desmarcadas no aparecen en los formularios.</p>
  <div class="rejilla" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:6px 14px">${cs.map(c => `<label style="font-weight:400;color:var(--texto);display:flex;gap:8px;align-items:center"><input type="checkbox" data-c="${esc(c.codigo)}" style="width:auto" ${c.activa ? 'checked' : ''} ${esAdmin() ? '' : 'disabled'}>${esc(c.nombre)}</label>`).join('')}</div>
  ${esAdmin() ? `<h2>Agregar otra</h2><div class="filtros"><input id="nueva" placeholder="Nombre de la certificación"><button id="agr">Agregar</button></div>` : ''}</div>`;
  app().querySelectorAll('[data-c]').forEach(x => x.onchange = async () => { try { await q(sb.from('catalogo_cert').update({ activa: x.checked }).eq('org_id', S.org.id).eq('codigo', x.dataset.c)); S._certs = null; aviso('Listo.'); } catch (e) { aviso(falla(e), true); x.checked = !x.checked; } });
  const agr = $('#agr'); if (agr) agr.onclick = async () => { const n = $('#nueva').value.trim(); if (!n) return; try { await q(sb.from('catalogo_cert').insert({ org_id: S.org.id, codigo: norm(n).slice(0, 30), nombre: n, orden: 50 })); S._certs = null; aviso('Certificación agregada.'); RUTAS.catalogo(); } catch (e) { aviso(falla(e), true); } };
};
const FORM_KOBO = { PADRON: 'Padrón', INSPECCION: 'Inspección interna', ACOPIO: 'Acopio', CAPACITACION: 'Capacitación', BENEFICIADO: 'Beneficiado', DESPACHO: 'Despacho y venta', PRIMA: 'Uso de la prima', SEGUIMIENTO: 'Seguimiento de NC', QUEJAS: 'Quejas', EVALUACION: 'Evaluación de inspector' };
// Trae lo nuevo de Kobo (como mucho cada 10 minutos, o al tocar «Traer de Kobo ahora»)
async function sincronizarKobo(forzar) {
  const pintar = t => { const el = $('#koboEstado'); if (el) el.innerHTML = t; };
  const boton = ' <a href="#" onclick="sincronizarKobo(true);return false">Traer de Kobo ahora</a>';
  const ult = S.cfg.KOBO_ULTIMA_SINC ? Date.parse(S.cfg.KOBO_ULTIMA_SINC) : 0;
  const hace = d => { const m = Math.round((Date.now() - d) / 60000); return m < 1 ? 'hace un momento' : m < 60 ? `hace ${m} min` : m < 1440 ? `hace ${Math.round(m / 60)} h` : 'el ' + fechaHora(d); };
  if (!forzar && ult && Date.now() - ult < 10 * 60000) return pintar(`Kobo: actualizado ${hace(ult)}.` + boton);
  if (sincronizarKobo.corriendo) return;
  sincronizarKobo.corriendo = true; pintar('Trayendo los formularios de Kobo…');
  try {
    const { data, error } = await sb.functions.invoke('kobo', { body: { org_id: S.org.id, forzar: !!forzar } });
    if (error) { let m = error.message; try { m = (await error.context.json()).error || m; } catch (_) {} throw new Error(m); }
    if (data.error) throw new Error(data.error);
    if (data.estado === 'sin_token') return pintar('Kobo todavía no está conectado: falta la clave de Kobo' + (esAdmin() ? ' en <a href="#/config">Configuración</a>.' : '. Avisale al administrador.'));
    if (data.estado === 'en_curso') return pintar('Kobo: ya se están trayendo los datos. Esperá un momento.' + boton);
    const res = Object.entries(data.resumen || {}), nuevos = res.filter(([, v]) => v.nuevos), errores = res.flatMap(([k, v]) => (v.errores || []).map(e => k + ': ' + e));
    await cargarOrg(); S._prods = null;
    pintar((nuevos.length ? 'Kobo: llegaron ' + nuevos.map(([k, v]) => `${v.nuevos} de ${k}`).join(', ') + '.' : 'Kobo: al día, no hay envíos nuevos.') + (errores.length ? ` <span class="error">${errores.length} con problemas</span> (<a href="#/kobo">ver</a>).` : '') + boton);
  } catch (e) { pintar('<span class="error">No se pudo conectar con Kobo: ' + esc(falla(e)) + '</span>' + boton); }
  finally { sincronizarKobo.corriendo = false; }
}

RUTAS.kobo = async function verKobo() {
  const enl = lista(S.cfg.KOBO_ENLACES).map(x => x.split('|').map(y => y.trim())).filter(x => x[1]);
  let tabla = '';
  if (esJefe()) {
    const env = await q(sb.from('kobo_envios').select('formulario,uid,enviado,procesado,error').eq('org_id', S.org.id).order('recibido', { ascending: false }).limit(60));
    tabla = `<h2>Últimos envíos recibidos de Kobo</h2><div class="tabla"><table><thead><tr><th>Formulario</th><th>Envío</th><th>Enviado</th><th>Estado</th></tr></thead><tbody>${env.map(x => `<tr><td>${esc(FORM_KOBO[x.formulario] || x.formulario)}</td><td>#${esc(x.uid)}</td><td>${fechaHora(x.enviado)}</td><td>${x.error ? '<span class="error">' + esc(x.error) + '</span>' : x.procesado ? 'Registrado' : 'Pendiente'}</td></tr>`).join('') || '<tr><td colspan="4" class="nota">Todavía no ha llegado nada de Kobo.</td></tr>'}</tbody></table></div>`;
  }
  app().innerHTML = cabecera('Formularios de KoboToolbox') + `<div class="caja nota" id="koboEstado" style="padding:10px 14px">Revisando Kobo…</div><div class="caja"><p class="nota">Se llenan desde el teléfono, sin cuenta y sin señal (Kobo los guarda y los envía al volver la conexión). Lo que se envía llega solo a esta aplicación.</p>
  ${enl.length ? `<div class="tarjetas">${enl.map(([n, u]) => `<a class="tarjeta" href="${esc(/^https:\/\//.test(u) ? u : '#/kobo')}" target="_blank" rel="noopener"><b>${esc(n)}</b><span>Abrir el formulario</span></a>`).join('')}</div>` : '<p>Todavía no hay formularios configurados para esta organización.</p>'}
  ${esAdmin() ? '<p class="nota">Los enlaces, los códigos de los formularios y la clave de Kobo se cambian en <a href="#/config">Configuración</a>.</p>' : ''}</div><div id="koboConexion"></div>${tabla}`;
  sincronizarKobo(false);
  pintarConexionKobo(enl.length);
};

// =====================================================================
// GUÍA DE USO (v2/guia.html; se actualiza con cada cambio de la aplicación)
// =====================================================================
RUTAS.guia = async function verGuia(parte) {
  app().innerHTML = cabecera('Guía de uso', '#/') + '<div class="caja nota">Abriendo la guía…</div>';
  let html = RUTAS.guia.html;
  if (!html) {
    const base = '/' + ((window.SIG_RUTAS || {})[window.SIG_V] || 'v2/');
    try { html = RUTAS.guia.html = await (await fetch(base + 'guia.html?v=' + (window.SIG_V || '') + '.' + ((window.SIG_CACHE || {})[window.SIG_V] || ''))).text(); }
    catch (_) { app().innerHTML = cabecera('Guía de uso', '#/') + '<div class="caja">No se pudo abrir la guía sin señal. Abrila una vez con señal y después queda guardada.</div>'; return; }
  }
  const caja = document.createElement('div'); caja.innerHTML = html;
  const ve = s => s === 'todos' || (s === 'jefe' ? esJefe() : s === 'admin' ? esAdmin() : puedeSec(s));
  const secs = [...caja.querySelectorAll('section')].filter(s => ve(s.dataset.para));
  const fecha = caja.querySelector('#guiaDatos')?.dataset.actualizada || '';
  app().innerHTML = cabecera('Guía de uso', '#/') + `<p class="nota">Actualizada el ${esc(fecha.split('-').reverse().join('/'))} · se actualiza cada vez que cambia algo del sistema. Solo aparecen las partes que te tocan.</p>
  <div class="guia"><nav class="guiaIndice caja" aria-label="Partes de la guía"><input type="search" id="gBus" placeholder="Buscar en la guía" autocomplete="off"><ol>${secs.map(s => `<li><a href="#/guia/${s.id}" data-g="${s.id}">${esc(s.querySelector('h2')?.textContent || s.id)}</a></li>`).join('')}</ol><button type="button" class="sec" onclick="window.print()">Imprimir</button></nav>
  <div class="guiaTexto">${secs.map(s => `<section class="caja" id="g-${s.id}">${s.innerHTML}</section>`).join('')}<p class="nota" id="gNada" hidden>No se encontró nada con esa palabra.</p></div></div>`;
  const ir = id => { const el = document.getElementById('g-' + id); if (el) { el.scrollIntoView({ block: 'start' }); el.classList.add('guiaMarca'); setTimeout(() => el.classList.remove('guiaMarca'), 1600); } };
  app().querySelectorAll('[data-g]').forEach(a => a.onclick = e => { e.preventDefault(); history.replaceState(null, '', '#/guia/' + a.dataset.g); ir(a.dataset.g); });
  $('#gBus').oninput = e => {
    const v = norm(e.target.value.trim()); let hay = 0;
    app().querySelectorAll('.guiaTexto section').forEach(s => { const si = !v || norm(s.textContent).includes(v); s.hidden = !si; hay += si; });
    $('#gNada').hidden = !!hay;
  };
  if (parte) setTimeout(() => ir(parte), 50);
};

// Conectar Kobo (cada organización con su cuenta) y pasar los cambios del maestro a todas
async function pintarConexionKobo(hayEnlaces) {
  const el = $('#koboConexion'); if (!el || !esAdmin()) return;
  if (S.org.es_maestra) {
    if (!S.maestro) return;
    el.innerHTML = `<div class="caja"><h2>Formularios de las demás organizaciones</h2><p class="nota">Los formularios de esta organización son el modelo. Cuando cambiés uno aquí, con este botón la versión nueva pasa a todas las organizaciones que ya conectaron Kobo. Sus datos y sus listas no se tocan.</p><button id="actTodas">Actualizar formularios en todas</button><div id="actRes" class="nota" style="margin-top:10px"></div></div>`;
    $('#actTodas').onclick = actualizarFormsTodas; return;
  }
  const { data: tiene } = await sb.rpc('tiene_secreto', { o: S.org.id, k: 'KOBO_TOKEN' });
  if (!tiene) {
    el.innerHTML = `<div class="caja"><h2>Conectar Kobo</h2><p>Cada organización usa su propia cuenta de Kobo, gratis. Así los datos quedan a su nombre.</p><ol class="pasos"><li>Creá la cuenta en <a href="https://kf.kobotoolbox.org/accounts/signup/" target="_blank" rel="noopener">kf.kobotoolbox.org</a> con el correo de la organización.</li><li>Ya adentro, entrá a tu nombre (arriba a la derecha) › <b>Configuración de la cuenta</b> › <b>Seguridad</b> y copiá la <b>clave API</b>.</li><li>Pegala en <a href="#/config">Configuración</a>, en «Clave de Kobo», y guardá.</li><li>Volvé aquí y tocá «Crear los formularios».</li></ol></div>`;
    return;
  }
  el.innerHTML = `<div class="caja"><h2>${hayEnlaces ? 'Revisar los formularios en Kobo' : 'Crear los formularios en Kobo'}</h2><p class="nota">${hayEnlaces ? 'Si falta algún formulario en la cuenta de Kobo de la organización, se crea; los que ya están no se tocan.' : 'Se crean en la cuenta de Kobo de la organización los mismos formularios del sistema, listos para usar, con sus listas de productores y parcelas.'}</p><button id="conectar">${hayEnlaces ? 'Revisar y crear los que falten' : 'Crear los formularios'}</button><div id="conRes" class="nota" style="margin-top:10px"></div></div>`;
  $('#conectar').onclick = conectarKobo;
}
async function llamarKobo(cuerpo) {
  const { data, error } = await sb.functions.invoke('kobo', { body: { org_id: S.org.id, ...cuerpo } });
  if (error) { let m = error.message; try { m = (await error.context.json()).error || m; } catch (_) {} throw new Error(m); }
  if (data.error) throw new Error(data.error);
  return data;
}
async function conectarKobo() {
  const b = $('#conectar'), r = $('#conRes'); b.disabled = true; r.textContent = 'Creando los formularios en Kobo… tarda uno o dos minutos.';
  try {
    const d = await llamarKobo({ accion: 'conectar' });
    r.innerHTML = (d.hechos.length ? `Listo: se crearon ${d.hechos.length} formularios (${esc(d.hechos.join(', '))}).` : 'Todos los formularios ya estaban en Kobo.') + (d.errores.length ? `<br><span class="error">No se pudieron crear: ${esc(d.errores.join(' · '))}. Tocá el botón otra vez para reintentar.</span>` : '') + '<br>Ahora se suben las listas de productores y parcelas…';
    await cargarOrg();
    await sincronizarKobo(true);
    r.innerHTML += ' listo.';
    if (d.hechos.length) setTimeout(() => RUTAS.kobo(), 1500);
  } catch (e) { r.innerHTML = '<span class="error">' + esc(falla(e)) + '</span>'; }
  finally { b.disabled = false; }
}
async function actualizarFormsTodas() {
  const b = $('#actTodas'), r = $('#actRes'); b.disabled = true; r.textContent = 'Buscando las organizaciones con Kobo…';
  try {
    const { orgs } = await llamarKobo({ accion: 'actualizar_forms' });
    if (!orgs.length) { r.textContent = 'Ninguna otra organización ha conectado Kobo todavía.'; return; }
    if (!confirm(`Se va a pasar la versión actual de los formularios a ${orgs.length} organización${orgs.length > 1 ? 'es' : ''}. ¿Seguimos?`)) { r.textContent = ''; return; }
    const lin = [];
    for (const o of orgs) {
      r.innerHTML = lin.join('<br>') + (lin.length ? '<br>' : '') + `Actualizando ${esc(o.nombre)}…`;
      try { const d = await llamarKobo({ accion: 'actualizar_forms', destino: o.id }); lin.push(`${esc(o.nombre)}: ${d.hechos.length} formularios al día` + (d.errores.length ? ` <span class="error">(${esc(d.errores.join(' · '))})</span>` : '')); }
      catch (e) { lin.push(`${esc(o.nombre)}: <span class="error">${esc(falla(e))}</span>`); }
    }
    r.innerHTML = lin.join('<br>');
  } catch (e) { r.innerHTML = '<span class="error">' + esc(falla(e)) + '</span>'; }
  finally { b.disabled = false; }
}

// =====================================================================
// PANEL DE CONTROL DE CADA SECCIÓN (con clave) Y ARCHIVO DE RESPALDOS
// =====================================================================
const NOMBRE_SEC = { adm: 'Administración', cre: 'Crédito interno', cer: 'Certificaciones' };
const puedePanel = sec => S.maestro || esAdmin() || (S.perfil?.paneles || []).includes(sec);
// La clave queda solo en la memoria de esta pestaña; al recargar la página se vuelve a pedir
const CLAVE_PANEL = {};
const clavePanel = sec => S.maestro ? '' : CLAVE_PANEL[S.org.id + sec];
async function fnArchivo(cuerpo) {
  const { data, error } = await sb.functions.invoke('archivo', { body: { org_id: S.org.id, ...cuerpo } });
  if (error) { let m = error.message; try { m = (await error.context.json()).error || m; } catch (_) {} throw new Error(m); }
  if (data?.error) throw new Error(data.error);
  return data;
}
// Arma en segundo plano los PDF de lo que se registró o resolvió (como mucho una vez cada 20 segundos)
let ultimoArchivo = 0;
function archivarLuego(ya) {
  if (!S.user || !S.org) return;
  const ahora = Date.now();
  if (!ya && ahora - ultimoArchivo < 20000) return;
  ultimoArchivo = ahora;
  setTimeout(() => sb.functions.invoke('archivo', { body: { org_id: S.org.id, accion: 'pendientes' } }).catch(() => {}), ya ? 1500 : 3000);
}
const tamano = b => b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';

RUTAS.pnl = async function panelSeccion(sec) {
  if (!NOMBRE_SEC[sec]) return RUTAS['']();
  S.seccion = sec;
  const titulo = 'Panel de control · ' + NOMBRE_SEC[sec];
  if (!puedePanel(sec) || !puedeSec(sec)) { app().innerHTML = cabecera(titulo, '#/' + sec) + '<div class="caja">Este panel solo lo ven las personas que autoriza el administrador.</div>'; return; }
  if (!S.maestro && !clavePanel(sec)) {
    app().innerHTML = cabecera(titulo, '#/' + sec) + `<form class="caja" id="fc" style="max-width:420px"><p class="nota">Este panel tiene información reservada. Escribí la clave del panel de ${NOMBRE_SEC[sec]}.</p>
      <label>Clave del panel</label><input name="clave" type="password" required autocomplete="off"><div class="acciones"><button>Entrar al panel</button></div><p class="nota error" id="cErr"></p></form>`;
    $('#fc').onsubmit = async ev => {
      ev.preventDefault(); const f = ev.target, clave = f.clave.value; ocupado(f, true); $('#cErr').textContent = '';
      const { data, error } = await sb.rpc('panel_ok', { o: S.org.id, sec, clave });
      if (error || !data) { ocupado(f, false); $('#cErr').textContent = error ? error.message : 'Clave incorrecta.'; f.clave.select(); return; }
      CLAVE_PANEL[S.org.id + sec] = clave; RUTAS.pnl(sec);
    };
    $('#fc').clave.focus();
    return;
  }
  const datos = await ({ adm: datosPanelAdm, cre: datosPanelCre, cer: datosPanelCer }[sec])() + (sec === 'cer' ? await avisosCer() : '');
  app().innerHTML = cabecera(titulo, '#/' + sec) + datos + `<h2>Archivo</h2><div class="caja" id="archivo"><p class="nota">Abriendo el archivo…</p></div>`;
  pintarArchivo(sec);
};

const datoP = (t, v, sub, h) => `<a class="tarjeta" href="${h || 'javascript:void 0'}"><span>${t}</span><b style="font-size:22px;margin:4px 0">${v}</b><span>${sub || ''}</span></a>`;
const sumaP = (a, k) => a.reduce((t, x) => t + num(x[k]), 0);
const MESES_CORTO = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

async function datosPanelAdm() {
  const anio = new Date().getFullYear(), ini = anio + '-01-01', mes = hoy().slice(0, 7);
  const [sol, pres, fac] = await Promise.all([
    q(sb.from('solicitudes').select('id,numero,tipo,estado,monto,creado,solicitante').eq('org_id', S.org.id).gte('creado', ini).order('creado', { ascending: false }).limit(3000)),
    q(sb.from('ejecucion_presupuesto').select('*').eq('org_id', S.org.id).eq('anio', anio)),
    q(sb.from('facturas').select('total,isv,retencion,mes_fiscal').eq('org_id', S.org.id).gte('mes_fiscal', anio + '-01'))
  ]);
  const pend = sol.filter(s => s.estado === 'Pendiente'), aut = sol.filter(s => s.estado === 'Autorizada');
  const aprobado = sumaP(pres, 'aprobado'), usado = sumaP(pres, 'ejecutado') + sumaP(pres, 'comprometido');
  const facMes = fac.filter(f => f.mes_fiscal === mes);
  const porTipo = Object.entries(TIPOS).map(([k, n]) => { const t = sol.filter(s => s.tipo === k); return `<tr><td>${n}</td><td class="n">${t.length}</td><td class="n">${t.filter(s => s.estado === 'Pendiente').length}</td><td class="n">${L(sumaP(t.filter(s => s.estado === 'Autorizada'), 'monto'))}</td></tr>`; }).join('');
  const porMes = MESES_CORTO.map((m, i) => { const mm = anio + '-' + String(i + 1).padStart(2, '0'); return [m, sumaP(aut.filter(s => s.creado.slice(0, 7) === mm), 'monto')]; });
  const maxMes = Math.max(1, ...porMes.map(x => x[1]));
  return `<div class="tarjetas">
    ${datoP('Por resolver', pend.length, L(sumaP(pend, 'monto')) + ' en espera', '#/solicitudes')}
    ${datoP('Autorizado en ' + anio, L(sumaP(aut, 'monto')), aut.length + ' solicitudes', '#/solicitudes')}
    ${datoP('Presupuesto ' + anio, aprobado ? Math.round(usado / aprobado * 100) + ' % usado' : 'Sin cargar', aprobado ? L(aprobado - usado) + ' disponible' : '', '#/presupuesto')}
    ${datoP('Facturas del mes', facMes.length, 'ISV ' + L(sumaP(facMes, 'isv')) + ' · retenciones ' + L(sumaP(facMes, 'retencion')), '#/facturas')}
  </div>
  <h2>Solicitudes de ${anio}</h2><div class="tabla"><table><thead><tr><th>Tipo</th><th class="n">Hechas</th><th class="n">Por resolver</th><th class="n">Autorizado</th></tr></thead><tbody>${porTipo}</tbody></table></div>
  <h2>Autorizado por mes</h2><div class="caja"><div style="display:grid;grid-template-columns:repeat(12,1fr);gap:6px;align-items:end;height:150px">${porMes.map(([m, v]) => `<div title="${m}: ${L(v)}" style="display:flex;flex-direction:column;justify-content:flex-end;height:100%"><div style="background:var(--verde2);border-radius:4px 4px 0 0;height:${Math.round(v / maxMes * 120)}px;min-height:${v ? 2 : 0}px"></div><span class="nota" style="text-align:center">${m}</span></div>`).join('')}</div></div>
  ${pres.length ? `<h2>Presupuesto por línea</h2><div class="tabla"><table><thead><tr><th>Línea</th><th class="n">Aprobado</th><th class="n">Usado</th><th class="n">Disponible</th></tr></thead><tbody>${pres.map(p => { const u = num(p.ejecutado) + num(p.comprometido); return `<tr><td>${esc(p.linea)}${p.proyecto ? ' · <span class="nota">' + esc(p.proyecto) + '</span>' : ''}</td><td class="n">${L(p.aprobado)}</td><td class="n">${L(u)}</td><td class="n ${num(p.aprobado) - u < 0 ? 'error' : ''}">${L(num(p.aprobado) - u)}</td></tr>`; }).join('')}</tbody></table></div>` : ''}`;
}

async function datosPanelCre() {
  const [cre, pagos] = await Promise.all([
    q(sb.from('creditos').select('id,numero,estado,monto_solicitado,monto_aprobado,plan,destino,productores(nombre)').eq('org_id', S.org.id).limit(3000)),
    q(sb.from('pagos_credito').select('credito_id,capital,interes,mora,fecha').eq('org_id', S.org.id))
  ]);
  const vig = cre.filter(c => c.estado === 'Desembolsado').map(c => ({ c, e: estadoCredito(c, pagos.filter(p => p.credito_id === c.id)) }));
  const saldo = vig.reduce((t, x) => t + x.e.saldo, 0), mora = vig.filter(x => x.e.dias > 0), enMora = mora.reduce((t, x) => t + x.e.saldo, 0);
  const anio = String(new Date().getFullYear()), pagAnio = pagos.filter(p => String(p.fecha).startsWith(anio));
  const estados = ['Solicitado', 'En evaluación', 'Aprobado', 'Desembolsado', 'Pagado', 'Rechazado', 'Anulado'];
  const porDestino = {}; vig.forEach(x => { const d = x.c.destino || 'Sin destino'; porDestino[d] = (porDestino[d] || 0) + x.e.saldo; });
  return `<div class="tarjetas">
    ${datoP('Cartera vigente', L(saldo), vig.length + ' créditos', '#/cartera')}
    ${datoP('Cartera en mora', L(enMora), saldo ? (enMora / saldo * 100).toFixed(1) + ' % de la cartera' : '', '#/cartera')}
    ${datoP('Recuperado en ' + anio, L(sumaP(pagAnio, 'capital')), 'Intereses ' + L(sumaP(pagAnio, 'interes')) + ' · mora ' + L(sumaP(pagAnio, 'mora')), '#/cartera')}
    ${datoP('Por resolver', cre.filter(c => ['Solicitado', 'En evaluación'].includes(c.estado)).length, L(sumaP(cre.filter(c => ['Solicitado', 'En evaluación'].includes(c.estado)), 'monto_solicitado')) + ' solicitado', '#/creditos')}
  </div>
  <h2>Créditos por estado</h2><div class="tabla"><table><thead><tr><th>Estado</th><th class="n">Cantidad</th><th class="n">Monto</th></tr></thead><tbody>${estados.map(e => { const t = cre.filter(c => c.estado === e); return t.length ? `<tr><td>${estadoChip(e, claseCre(e))}</td><td class="n">${t.length}</td><td class="n">${L(sumaP(t, t[0].monto_aprobado ? 'monto_aprobado' : 'monto_solicitado'))}</td></tr>` : ''; }).join('') || '<tr><td colspan="3" class="nota">Sin créditos.</td></tr>'}</tbody></table></div>
  ${Object.keys(porDestino).length ? `<h2>Saldo por destino</h2><div class="tabla"><table><thead><tr><th>Destino</th><th class="n">Saldo</th><th class="n">% de la cartera</th></tr></thead><tbody>${Object.entries(porDestino).sort((a, b) => b[1] - a[1]).map(([d, v]) => `<tr><td>${esc(d)}</td><td class="n">${L(v)}</td><td class="n">${saldo ? (v / saldo * 100).toFixed(1) : 0} %</td></tr>`).join('')}</tbody></table></div>` : ''}
  <h2>Créditos en mora</h2><div class="tabla"><table><thead><tr><th>Crédito</th><th>Productor</th><th class="n">Saldo</th><th class="n">Atrasado</th><th class="n">Días</th></tr></thead><tbody>${mora.sort((a, b) => b.e.dias - a.e.dias).map(x => `<tr><td><a href="#/cred/${x.c.id}">${esc(x.c.numero)}</a></td><td>${esc(x.c.productores?.nombre)}</td><td class="n">${L(x.e.saldo)}</td><td class="n error">${L(x.e.atraso)}</td><td class="n">${x.e.dias}</td></tr>`).join('') || '<tr><td colspan="5" class="nota">Ningún crédito en mora.</td></tr>'}</tbody></table></div>`;
}

async function datosPanelCer() {
  const anio = new Date().getFullYear(), ini = anio + '-01-01';
  const [ps, parc, aco, des, prima, nc, qj, cap, cs] = await Promise.all([
    q(sb.from('productores').select('id,activo,estado_cert,sexo').eq('org_id', S.org.id)),
    q(sb.from('parcelas').select('area_ha,poligono').eq('org_id', S.org.id)),
    q(sb.from('acopio').select('psec_lb,certificaciones,certificacion,total').eq('org_id', S.org.id).gte('fecha', ini)),
    q(sb.from('despachos').select('psec_lb,prima_usd,certificacion').eq('org_id', S.org.id).gte('fecha', ini)),
    q(sb.from('prima_uso').select('monto_usd').eq('org_id', S.org.id)),
    cuenta('no_conformidades', x => x.eq('estado', 'Abierta')),
    cuenta('quejas', x => x.neq('estado', 'Cerrada')),
    q(sb.from('capacitaciones').select('hombres,mujeres').eq('org_id', S.org.id).gte('fecha', ini)),
    certs(true)
  ]);
  const act = ps.filter(p => p.activo), ha = sumaP(parc, 'area_ha'), sinPol = parc.filter(p => num(p.area_ha) >= 4 && !p.poligono).length;
  const qq = lb => (num(lb) / 100).toLocaleString('es-HN', { maximumFractionDigits: 1 }) + ' qq';
  const porCert = cs.map(c => ({ c, comprado: aco.filter(a => (a.certificaciones || [a.certificacion]).includes(c.codigo)).reduce((t, a) => t + num(a.psec_lb), 0), vendido: des.filter(d => d.certificacion === c.codigo).reduce((t, d) => t + num(d.psec_lb), 0) })).filter(x => x.comprado || x.vendido);
  const primaRec = sumaP(await q(sb.from('despachos').select('prima_usd').eq('org_id', S.org.id)), 'prima_usd'), primaUso = sumaP(prima, 'monto_usd');
  const usd = v => 'USD ' + num(v).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `<div class="tarjetas">
    ${datoP('Productores activos', act.length, act.filter(p => p.estado_cert === 'Aprobado').length + ' aprobados en inspección', '#/padron')}
    ${datoP('Área en fincas', ha.toLocaleString('es-HN', { maximumFractionDigits: 1 }) + ' ha', sinPol ? sinPol + ' parcelas de 4 ha o más sin polígono' : 'Polígonos al día', '#/padron')}
    ${datoP('Acopio ' + anio, qq(sumaP(aco, 'psec_lb')), 'Pagado ' + L(sumaP(aco, 'total')), '#/acopios')}
    ${datoP('Prima disponible', usd(primaRec - primaUso), 'Generada ' + usd(primaRec) + ' · usada ' + usd(primaUso), '#/prima')}
    ${datoP('No conformidades abiertas', nc, '', '#/nc')}
    ${datoP('Quejas sin cerrar', qj, '', '#/quejas')}
    ${datoP('Capacitaciones ' + anio, cap.length, (sumaP(cap, 'hombres') + sumaP(cap, 'mujeres')) + ' participantes (' + sumaP(cap, 'mujeres') + ' mujeres)', '#/capacitaciones')}
  </div>
  <h2>Balance por certificación (${anio})</h2><div class="tabla"><table><thead><tr><th>Certificación</th><th class="n">Comprado</th><th class="n">Vendido</th><th class="n">Disponible</th></tr></thead><tbody>${porCert.map(x => `<tr><td>${esc(x.c.nombre)}</td><td class="n">${qq(x.comprado)}</td><td class="n">${qq(x.vendido)}</td><td class="n ${x.comprado - x.vendido < 0 ? 'error' : ''}">${qq(x.comprado - x.vendido)}</td></tr>`).join('') || '<tr><td colspan="4" class="nota">Sin acopio ni ventas este año.</td></tr>'}</tbody></table></div>`;
}

async function pintarArchivo(sec, abierta) {
  const caja = $('#archivo'); if (!caja) return;
  let lista;
  try { lista = (await fnArchivo({ accion: 'listar', seccion: sec, clave: clavePanel(sec) })).archivos || []; }
  catch (e) { caja.innerHTML = `<p class="error">${esc(falla(e))}</p>`; if (/clave/i.test(e.message)) delete CLAVE_PANEL[S.org.id + sec]; return; }
  const carpetas = {}; lista.forEach(a => (carpetas[a.carpeta] = carpetas[a.carpeta] || []).push(a));
  const nombres = Object.keys(carpetas).sort((a, b) => a.localeCompare(b, 'es'));
  caja.innerHTML = `<p class="nota">Aquí queda el PDF de cada registro: uno cuando se hace y otro cuando se resuelve. No se puede borrar ni cambiar desde la aplicación.</p>
  <div class="filtros"><input id="busArc" placeholder="Buscar por número o nombre"><button class="sec" id="faltan">Guardar los que falten</button></div>
  ${nombres.map(n => `<details class="carpeta" ${abierta === n ? 'open' : ''} data-c="${esc(n)}"><summary><b>📁 ${esc(n)}</b> <span class="nota">${carpetas[n].length} archivo${carpetas[n].length === 1 ? '' : 's'}</span></summary>
    <div class="tabla" style="margin-top:8px"><table><tbody>${carpetas[n].map(a => `<tr data-t="${esc(norm(a.nombre + ' ' + (a.numero || '')))}"><td>${esc(a.nombre)}</td><td class="nota">${fechaHora(a.creado)}</td><td class="n nota">${tamano(a.bytes || 0)}</td><td class="n"><button class="sec" data-bajar="${a.id}">Descargar</button></td></tr>`).join('')}</tbody></table></div></details>`).join('') || '<p>Todavía no hay archivos. Se van guardando solos a medida que se registran cosas.</p>'}`;
  caja.querySelectorAll('[data-bajar]').forEach(b => b.onclick = async () => {
    b.disabled = true;
    try { const { url } = await fnArchivo({ accion: 'url', seccion: sec, clave: clavePanel(sec), id: b.dataset.bajar }); window.open(url, '_blank', 'noopener'); }
    catch (e) { aviso(falla(e), true); } finally { b.disabled = false; }
  });
  $('#busArc').oninput = e => {
    const t = norm(e.target.value);
    caja.querySelectorAll('details.carpeta').forEach(d => { let n = 0; d.querySelectorAll('tr[data-t]').forEach(tr => { const si = !t || tr.dataset.t.includes(t); tr.hidden = !si; n += si; }); d.hidden = !n; if (t && n) d.open = true; });
  };
  $('#faltan').onclick = async () => {
    const b = $('#faltan'); b.disabled = true; b.textContent = 'Guardando…'; let total = 0;
    try { for (let i = 0; i < 15; i++) { const r = await fnArchivo({ accion: 'pendientes' }); total += r.hechos || 0; if (!r.quedan) break; } aviso(total ? `Se guardaron ${total} PDF.` : 'No faltaba ninguno.'); pintarArchivo(sec); }
    catch (e) { aviso(falla(e), true); b.disabled = false; b.textContent = 'Guardar los que falten'; }
  };
}

// =====================================================================
// ESTIMADO DE COSECHA, EUDR POR DESPACHO Y AVISOS DE CONTROL INTERNO
// =====================================================================
// La cosecha empieza el mes de Configuración (10 = octubre) y va hasta el mes anterior del año siguiente
const inicioCosecha = (f = hoy()) => { const m = cfgN('COSECHA_INICIO_MES', 10), y = +f.slice(0, 4), mm = +f.slice(5, 7); return (mm >= m ? y : y - 1) + '-' + String(m).padStart(2, '0') + '-01'; };
const estimadoParcela = p => num(p.datos?.estimado_qq);
async function estimadoProductor(id) {
  const [todas, aco] = await Promise.all([parcelasOrg().catch(() => []), q(sb.from('acopio').select('psec_lb').eq('productor_id', id).gte('fecha', inicioCosecha())).catch(() => [])]);
  const parc = todas.filter(p => p.productor_id === id);
  const est = parc.reduce((t, p) => t + estimadoParcela(p), 0), ent = aco.reduce((t, a) => t + num(a.psec_lb), 0) / 100, tol = cfgN('TOLERANCIA_ESTIMADO', 20);
  return { est, ent, tope: est * (1 + tol / 100), tol, parc };
}
const qqTxt = v => num(v).toLocaleString('es-HN', { maximumFractionDigits: 2 }) + ' qq';

// Revisión EUDR de una parcela: [nivel, motivo]
function revisarEudr(p) {
  const r = [], ha = num(p.area_ha), dt = p.datos || {};
  if (!p.poligono && (p.lat === null || p.lat === undefined)) r.push(['error', 'Sin ubicación']);
  if (ha >= 4 && !p.poligono) r.push(['error', 'Falta el polígono (4 ha o más)']);
  if (dt.cultivo_2020 === 'no') r.push(['error', 'No era cafetal en 2020 (posible deforestación)']);
  if (dt.area_protegida === 'si') r.push(['error', 'Dentro de un área protegida']);
  if (dt.cultivo_2020 === 'no_sabe' || dt.area_protegida === 'no_sabe') r.push(['duda', 'Falta confirmar el uso en 2020 o si es área protegida']);
  if (num(p.anio_siembra) > 2020) r.push(['duda', 'Sembrada después de 2020: confirmar que antes no había bosque']);
  return r;
}
const chipEudr = r => r.length ? r.map(([n, t]) => `<span class="estado" style="background:${n === 'error' ? '#fee2e2;color:#991b1b' : '#fef3c7;color:#92400e'};display:inline-block;margin:0 4px 4px 0;white-space:normal">${esc(t)}</span>`).join('') : '<span class="estado e-Autorizada">Cumple</span>';

RUTAS.eudr = async function verEudr(id) {
  const d = await q(sb.from('despachos').select('*').eq('id', id).single());
  // Los lotes pueden venir como «LOTE-01: 0.5 qq» (desde Kobo): se toma solo el código
  const lotes = [...new Set(lista(d.lotes).map(x => x.split(':')[0].trim().toUpperCase()).filter(Boolean))];
  const aco = lotes.length ? await q(sb.from('acopio').select('productor_id,lote,psec_lb').eq('org_id', S.org.id).in('lote', lotes)) : [];
  const ids = [...new Set(aco.map(a => a.productor_id))];
  const parc = ids.length ? await q(sb.from('parcelas').select('*, productores(codigo,nombre)').in('productor_id', ids).order('nombre')) : [];
  const filas = parc.map(p => ({ p, r: revisarEudr(p) }));
  const malas = filas.filter(x => x.r.some(y => y[0] === 'error')).length, dudas = filas.filter(x => x.r.length && !x.r.some(y => y[0] === 'error')).length;
  const sinLote = lotes.filter(l => !aco.some(a => String(a.lote || '').toUpperCase() === l));
  const fc = { type: 'FeatureCollection', features: parc.filter(p => p.poligono || (p.lat !== null && p.lat !== undefined)).map(p => ({ type: 'Feature', geometry: p.poligono || { type: 'Point', coordinates: [num(p.lon), num(p.lat)] }, properties: { ProducerName: p.productores?.nombre || '', ProducerCountry: 'HN', ProductionPlace: p.nombre || '', Area: num(p.area_ha) } })) };
  app().innerHTML = cabecera('EUDR · despacho ' + d.numero, '#/despacho') + `<div class="caja"><dl class="detalle">
    <dt>Comprador</dt><dd>${esc(d.comprador)} · ${esc(d.fecha)} · ${num(d.peso_lb).toLocaleString('es-HN')} lb ${esc(d.tipo_cafe)}</dd>
    <dt>Lotes</dt><dd>${lotes.map(l => `<a href="#/lote/${encodeURIComponent(l)}">${esc(l)}</a>`).join(', ') || '—'}</dd><dt>Productores</dt><dd>${ids.length}</dd><dt>Parcelas</dt><dd>${parc.length}</dd></dl>
    ${!lotes.length ? '<p class="error">Este despacho no tiene lotes anotados. Sin lotes no se sabe de qué fincas salió el café: anotalos en el despacho.</p>' : ''}
    ${sinLote.length ? `<p class="error">Estos lotes no aparecen en ningún acopio: ${esc(sinLote.join(', '))}.</p>` : ''}
    ${parc.length ? `<p class="${malas ? 'error' : dudas ? '' : 'ok'}"><b>${malas ? `${malas} parcela${malas > 1 ? 's' : ''} no cumple${malas > 1 ? 'n' : ''}: corregí antes de declarar.` : dudas ? `${dudas} parcela${dudas > 1 ? 's' : ''} por revisar.` : 'Todas las parcelas cumplen.'}</b></p>` : ''}</div>
  <form class="caja" id="fd"><div class="rejilla"><div class="ancho"><label>Número de la declaración de debida diligencia (sistema TRACES de la Unión Europea)</label><input name="dds" value="${esc(d.dds_numero || '')}" placeholder="Se pega cuando la declaración ya está hecha"></div></div>
    <div class="acciones"><button>Guardar número</button><button type="button" class="sec" id="bajar" ${fc.features.length ? '' : 'disabled'}>Descargar ubicaciones (GeoJSON)</button></div>
    <p class="nota">El archivo trae un polígono por parcela (o el punto, si es de menos de 4 ha), con el nombre del productor, el país y el área. Se sube tal cual al hacer la declaración.</p></form>
  <h2>Parcelas de este despacho</h2><div class="tabla"><table><thead><tr><th>Productor</th><th>Parcela</th><th class="n">Área (ha)</th><th>Ubicación</th><th>Revisión</th></tr></thead><tbody>
  ${filas.map(({ p, r }) => `<tr><td><a href="#/prod/${p.productor_id}">${esc(p.productores?.codigo || '')} ${esc(p.productores?.nombre || '')}</a></td><td><a href="#/parcela/${p.id}">${esc(p.nombre)}</a></td><td class="n">${num(p.area_ha).toFixed(2)}</td><td>${p.poligono ? 'Polígono' : p.lat !== null && p.lat !== undefined ? 'Punto' : '—'}</td><td>${chipEudr(r)}</td></tr>`).join('') || '<tr><td colspan="5" class="nota">No hay parcelas para mostrar.</td></tr>'}</tbody></table></div>`;
  $('#bajar').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(fc)], { type: 'application/geo+json' })); a.download = `EUDR_${d.numero}.geojson`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); };
  $('#fd').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target; ocupado(f, true);
    try { await q(sb.from('despachos').update({ dds_numero: f.dds.value.trim() || null, geojson: fc }).eq('id', id)); aviso('Guardado.'); RUTAS.eudr(id); }
    catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
};

async function avisosCer() {
  const desde = sumarMeses(hoy(), -12), ini = inicioCosecha(), tol = cfgN('TOLERANCIA_ESTIMADO', 20);
  const [ps, parc, insp, nc, aco] = await Promise.all([
    q(sb.from('productores').select('id,codigo,nombre,certificaciones').eq('org_id', S.org.id).eq('activo', true)),
    q(sb.from('parcelas').select('id,productor_id,nombre,area_ha,poligono,datos').eq('org_id', S.org.id)),
    q(sb.from('inspecciones').select('productor_id,inspector,fecha').eq('org_id', S.org.id).gte('fecha', desde)),
    q(sb.from('no_conformidades').select('numero,productor_id,descripcion,plazo').eq('org_id', S.org.id).eq('estado', 'Abierta').lt('plazo', hoy()).order('plazo')),
    q(sb.from('acopio').select('productor_id,psec_lb').eq('org_id', S.org.id).gte('fecha', ini))
  ]);
  const P = Object.fromEntries(ps.map(p => [p.id, p]));
  const quien = id => P[id] ? `<a href="#/prod/${id}">${esc(P[id].codigo ? P[id].codigo + ' · ' : '')}${esc(P[id].nombre)}</a>` : '—';
  const conInsp = new Set(insp.map(i => i.productor_id));
  const sinInsp = ps.filter(p => (p.certificaciones || []).length && !conInsp.has(p.id));
  const sinPol = parc.filter(p => num(p.area_ha) >= 4 && !p.poligono);
  const apellidos = t => norm(String(t || '').trim().split(/\s+/).slice(-2).join(' '));
  const conflictos = insp.map(i => {
    const p = P[i.productor_id]; if (!p || !i.inspector) return null;
    if (norm(i.inspector) === norm(p.nombre)) return { i, p, motivo: 'Se inspeccionó su propia finca' };
    const a = apellidos(i.inspector); if (a.length > 6 && a === apellidos(p.nombre)) return { i, p, motivo: 'Tienen los mismos apellidos (posible familiar)' };
    return null;
  }).filter(Boolean);
  const ent = {}, est = {};
  aco.forEach(a => ent[a.productor_id] = (ent[a.productor_id] || 0) + num(a.psec_lb) / 100);
  parc.forEach(p => est[p.productor_id] = (est[p.productor_id] || 0) + estimadoParcela(p));
  const pasados = Object.keys(ent).filter(id => est[id] > 0 && ent[id] > est[id] * (1 + tol / 100));
  const sinEst = Object.keys(ent).filter(id => !est[id] && (P[id]?.certificaciones || []).length);
  const [insRev, basc, acoAl] = await Promise.all([q(sb.from('insumos_aplicados').select('fecha,producto,productor_id,parcela_nombre').eq('org_id', S.org.id).eq('estado', 'Revisar').gte('fecha', desde).order('fecha', { ascending: false })),
    q(sb.from('basculas').select('nombre,bodega,vence').eq('org_id', S.org.id).eq('activa', true)).catch(() => []),
    q(sb.from('acopio').select('id,numero,fecha,productor_id,datos').eq('org_id', S.org.id).gte('fecha', sumarMeses(hoy(), -2)).not('datos->alertas', 'is', null).order('fecha', { ascending: false }).limit(200)).catch(() => [])]);
  const diasB = cfgN('BASCULA_DIAS_AVISO', 30), bascMal = basc.filter(b => !b.vence || diasEntre(hoy(), b.vence) <= diasB);
  const conAlerta = acoAl.filter(a => (a.datos?.alertas || []).length);
  const [docsV, primaSin, actasT, asisA] = await Promise.all([
    q(sb.from('documentos_productor').select('productor_id,tipo,vence').eq('org_id', S.org.id).not('vence', 'is', null).lte('vence', sumarMeses(hoy(), 1)).order('vence')).catch(() => []),
    q(sb.from('prima_uso').select('fecha,concepto,acta,monto_usd').eq('org_id', S.org.id).is('acta_id', null).order('fecha', { ascending: false })).catch(() => []),
    q(sb.from('actas').select('id,numero,prima_aprobada_usd').eq('org_id', S.org.id).not('prima_aprobada_usd', 'is', null)).catch(() => []),
    q(sb.from('capacitacion_asistentes').select('productor_id, capacitaciones!inner(fecha)').eq('org_id', S.org.id).gte('capacitaciones.fecha', hoy().slice(0, 4) + '-01-01')).catch(() => [])]);
  const usoActa = actasT.length ? await q(sb.from('prima_uso').select('acta_id,monto_usd').in('acta_id', actasT.map(a => a.id))).catch(() => []) : [];
  const actasPasadas = actasT.map(a => ({ ...a, usado: usoActa.filter(u => u.acta_id === a.id).reduce((t, u) => t + num(u.monto_usd), 0) })).filter(a => a.usado > num(a.prima_aprobada_usd) + 0.01);
  const conCap = new Set(asisA.map(a => a.productor_id)), sinCap = ps.filter(p => (p.certificaciones || []).length && !conCap.has(p.id));
  const orgSinDato = parc.filter(p => (P[p.productor_id]?.certificaciones || []).some(esOrganica) && estadoOrganico(p).ok === null);
  const bloque = (titulo, n, nota, cols, filas) => `<details class="carpeta"><summary><b><span style="color:${n ? 'var(--rojo)' : 'var(--verde2)'}">●</span> ${titulo}</b> <span class="nota">${n || 'nada pendiente'}</span></summary>
    ${n ? `<p class="nota" style="margin:8px 0">${nota}</p><div class="tabla"><table><thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${filas}</tbody></table></div>` : ''}</details>`;
  return `<h2>Avisos de control interno</h2>` + [
    bloque('Productores certificados sin inspección en los últimos 12 meses', sinInsp.length, 'Cada productor certificado necesita al menos una inspección interna al año.', ['Productor', 'Certificaciones'],
      sinInsp.map(p => `<tr><td>${quien(p.id)}</td><td>${(p.certificaciones || []).map(nombreCert).map(esc).join(', ')}</td></tr>`).join('')),
    bloque('No conformidades con el plazo vencido', nc.length, 'Hay que cerrarlas o dar un plazo nuevo antes de la auditoría.', ['Número', 'Productor', 'Hallazgo', 'Plazo'],
      nc.map(x => `<tr><td>${esc(x.numero || '')}</td><td>${quien(x.productor_id)}</td><td>${esc(x.descripcion)}</td><td class="error">${esc(x.plazo)}</td></tr>`).join('')),
    bloque('Parcelas de 4 ha o más sin polígono', sinPol.length, 'La EUDR pide el polígono para estas parcelas. Sin él, su café no se puede vender a Europa.', ['Productor', 'Parcela', 'Área (ha)'],
      sinPol.map(p => `<tr><td>${quien(p.productor_id)}</td><td><a href="#/parcela/${p.id}">${esc(p.nombre)}</a></td><td class="n">${num(p.area_ha).toFixed(2)}</td></tr>`).join('')),
    bloque(`Entregaron más que su estimado de cosecha (desde ${ini})`, pasados.length, `Pasaron el estimado más la tolerancia del ${tol} %. Puede ser café de otra finca: revisar antes de venderlo como certificado.`, ['Productor', 'Estimado', 'Entregado', 'Exceso'],
      pasados.map(id => `<tr><td>${quien(id)}</td><td class="n">${qqTxt(est[id])}</td><td class="n">${qqTxt(ent[id])}</td><td class="n error">${Math.round((ent[id] / est[id] - 1) * 100)} %</td></tr>`).join('')),
    bloque('Entregan café certificado sin estimado de cosecha', sinEst.length, 'Sin estimado no se puede controlar cuánto puede entregar. Se pone en cada parcela.', ['Productor', 'Entregado esta cosecha'],
      sinEst.map(id => `<tr><td>${quien(id)}</td><td class="n">${qqTxt(ent[id])}</td></tr>`).join('')),
    bloque('Parcelas orgánicas sin fecha del último producto prohibido', orgSinDato.length, 'Sin esa fecha no se puede demostrar que la parcela cumplió la transición. Se pone en cada parcela.', ['Productor', 'Parcela'],
      orgSinDato.map(p => `<tr><td>${quien(p.productor_id)}</td><td><a href="#/parcela/${p.id}">${esc(p.nombre)}</a></td></tr>`).join('')),
    bloque('Insumos por revisar (no están en las listas)', insRev.length, 'Revisar si están permitidos y agregarlos a la lista correcta en Configuración.', ['Fecha', 'Productor', 'Parcela', 'Producto'],
      insRev.map(x => `<tr><td>${esc(x.fecha)}</td><td>${quien(x.productor_id)}</td><td>${esc(x.parcela_nombre || 'Toda la finca')}</td><td>${esc(x.producto)}</td></tr>`).join('')),
    bloque('Posible conflicto de interés del inspector', conflictos.length, 'Un inspector interno no debe inspeccionar su propia finca ni la de un familiar. Revisar y, si es el caso, repetir la inspección con otra persona.', ['Fecha', 'Inspector', 'Productor', 'Motivo'],
      conflictos.map(c => `<tr><td>${esc(c.i.fecha)}</td><td>${esc(c.i.inspector)}</td><td>${quien(c.p.id)}</td><td>${esc(c.motivo)}</td></tr>`).join('')),
    bloque('Básculas sin calibración vigente', bascMal.length, `Vencidas, sin fecha o que vencen en ${diasB} días o menos. Se actualizan en <a href="#/basculas">Básculas</a>.`, ['Báscula', 'Bodega', 'Vence'],
      bascMal.map(b => `<tr><td>${esc(b.nombre)}</td><td>${esc(b.bodega || '')}</td><td class="${!b.vence || b.vence < hoy() ? 'error' : ''}">${esc(b.vence || 'sin fecha')}</td></tr>`).join('')),
    bloque('Documentos de productores vencidos o por vencer', docsV.length, 'Compromisos, contratos y documentos de la tierra que la certificadora revisa. Se actualizan en la ficha de cada productor.', ['Productor', 'Documento', 'Vence'],
      docsV.map(d => `<tr><td>${quien(d.productor_id)}</td><td>${esc(d.tipo)}</td><td class="error">${esc(d.vence)}</td></tr>`).join('')),
    bloque('Gastos de la prima sin acta registrada', primaSin.length, 'Cada gasto de la prima tiene que estar aprobado por la asamblea. Registrá el acta en <a href="#/actas">Actas de asamblea</a> con el mismo número.', ['Fecha', 'Concepto', 'Acta que mencionan', 'USD'],
      primaSin.map(u => `<tr><td>${esc(u.fecha)}</td><td>${esc(u.concepto)}</td><td>${esc(u.acta || '—')}</td><td class="n">${num(u.monto_usd).toFixed(2)}</td></tr>`).join('')),
    bloque('Actas con más prima gastada que la aprobada', actasPasadas.length, 'Se gastó más de lo que aprobó la asamblea.', ['Acta', 'Aprobado (USD)', 'Gastado (USD)'],
      actasPasadas.map(a => `<tr><td>${esc(a.numero)}</td><td class="n">${num(a.prima_aprobada_usd).toFixed(2)}</td><td class="n error">${a.usado.toFixed(2)}</td></tr>`).join('')),
    bloque(`Productores certificados sin capacitación en ${hoy().slice(0, 4)}`, sinCap.length, 'Según las listas de asistencia. Si sí llegaron, agregalos en <a href="#/asistencia">Asistencia por productor</a>.', ['Productor'],
      sinCap.map(p => `<tr><td>${quien(p.id)}</td></tr>`).join('')),
    bloque('Entregas de los últimos dos meses que quedaron con aviso', conAlerta.length, 'Por ejemplo, café que llegó como certificado y se registró como convencional, o pesado en una báscula vencida.', ['Recibo', 'Fecha', 'Productor', 'Aviso'],
      conAlerta.map(a => `<tr><td><a href="#/recibo/${a.id}">${esc(a.numero)}</a></td><td>${esc(a.fecha)}</td><td>${quien(a.productor_id)}</td><td>${a.datos.alertas.map(esc).join('<br>')}</td></tr>`).join(''))
  ].join('');
}

// =====================================================================
// HISTORIAL ORGÁNICO, INSUMOS APLICADOS Y TRAZABILIDAD POR LOTE
// =====================================================================
// Fecha del último producto prohibido: la que se anota en la parcela o la del padrón de Kobo
function fechaProhibida(p) {
  const d = p.datos || {}, k = String(d.ultima_quimica ?? '').trim();
  const kobo = /^\d{4}-\d{2}-\d{2}/.test(k) ? k.slice(0, 10) : /^(19|20)\d{2}$/.test(k) ? k + '-12-31' : '';
  return [d.ultima_prohibida || '', kobo].filter(Boolean).sort().pop() || '';
}
function estadoOrganico(p) {
  const f = fechaProhibida(p), meses = cfgN('MESES_TRANSICION', 36), k = norm(p.datos?.ultima_quimica || '');
  if (!f) {
    if (/^(nunca|no|ninguna)/.test(k) || /mas/.test(k)) return { estado: 'Orgánica', txt: 'Según el padrón, sin productos prohibidos en el período', ok: true };
    return { estado: 'Sin dato', txt: 'Falta la fecha del último producto prohibido', ok: null };
  }
  const desde = sumarMeses(f, meses);
  if (hoy() >= desde) return { estado: 'Orgánica', txt: 'Orgánica desde ' + desde, ok: true, desde };
  const anio = Math.min(Math.floor(diasEntre(f, hoy()) / 365) + 1, Math.ceil(meses / 12));
  return { estado: 'En transición', txt: `Año ${anio} de transición: orgánica desde ${desde}`, ok: false, desde };
}
const chipOrg = e => `<span class="estado" style="background:${e.ok ? '#dcfce7;color:#166534' : e.ok === false ? '#fef3c7;color:#92400e' : '#e5e7eb;color:#374151'}" title="${esc(e.txt)}">${esc(e.estado)}</span>${e.desde && !e.ok ? `<br><span class="nota">orgánica desde ${esc(e.desde)}</span>` : ''}`;
const esOrganica = c => /org|usda|bio/i.test(c || '');

// Mismo criterio que la base de datos (función revisar_insumo)
function estadoInsumo(producto) {
  const t = norm(producto), en = k => lista(S.cfg[k]).some(x => norm(x) && t.includes(norm(x)));
  return en('INSUMOS_PROHIBIDOS') ? 'Prohibido' : en('INSUMOS_PERMITIDOS') ? 'Permitido' : 'Revisar';
}
const chipInsumo = e => `<span class="estado" style="background:${e === 'Permitido' ? '#dcfce7;color:#166534' : e === 'Prohibido' ? '#fee2e2;color:#991b1b' : '#fef3c7;color:#92400e'}">${esc(e || '')}</span>`;

RUTAS.insumos = async function verInsumos(prodId) {
  const [ps, filas] = await Promise.all([prods(), q(sb.from('insumos_aplicados').select('*, productores(codigo,nombre)').eq('org_id', S.org.id).order('fecha', { ascending: false }).limit(300))]);
  const sugeridos = [...lista(S.cfg.INSUMOS_PERMITIDOS), ...lista(S.cfg.INSUMOS_PROHIBIDOS)];
  app().innerHTML = cabecera('Insumos aplicados') + `<form class="caja" id="f"><div class="rejilla">
    <div class="ancho"><label>Productor</label>${campoProd(ps, prodId)}</div>
    <div><label>Parcela</label><select name="parcela_id" id="parc"><option value="">Toda la finca</option></select></div>
    <div><label>Fecha de la aplicación</label><input type="date" name="fecha" required value="${hoy()}"></div>
    <div><label>Producto</label><input name="producto" required list="dlIns"><datalist id="dlIns">${sugeridos.map(x => `<option value="${esc(x)}">`).join('')}</datalist></div>
    <div><label>Tipo</label><select name="tipo">${opciones(['Fertilizante', 'Abono orgánico', 'Enmienda', 'Fungicida', 'Insecticida', 'Herbicida', 'Control biológico', 'Otro'])}</select></div>
    <div><label>Cantidad</label><input name="cantidad" inputmode="decimal"></div>
    <div><label>Unidad</label><select name="unidad">${opciones(['kg', 'lb', 'qq', 'sacos', 'litros', 'galones', 'ml'])}</select></div>
    <div class="ancho"><label>Observaciones</label><input name="observaciones"></div>
  </div><p class="nota" id="revIns"></p><div class="acciones"><button>Registrar aplicación</button></div></form>
  <p class="nota">Las listas de insumos permitidos y prohibidos se ajustan en Configuración, según la certificadora. Si se aplica un producto prohibido, la parcela vuelve a empezar la transición y se abre una no conformidad sola.</p>
  <h2>Últimas aplicaciones</h2><div class="tabla"><table><thead><tr><th>Fecha</th><th>Productor</th><th>Parcela</th><th>Producto</th><th>Tipo</th><th class="n">Cantidad</th><th>Revisión</th><th>Origen</th></tr></thead><tbody>
  ${filas.map(x => `<tr><td>${esc(x.fecha)}</td><td><a href="#/prod/${x.productor_id}">${esc(x.productores?.codigo || '')} ${esc(x.productores?.nombre || '')}</a></td><td>${esc(x.parcela_nombre || 'Toda la finca')}</td><td>${esc(x.producto)}</td><td>${esc(x.tipo)}</td><td class="n">${x.cantidad ? num(x.cantidad).toLocaleString('es-HN') + ' ' + esc(x.unidad || '') : ''}</td><td>${chipInsumo(x.estado)}</td><td>${x.inspeccion_id ? `<a href="#/insp/${x.inspeccion_id}">${esc(x.origen || 'Inspección')}</a>` : esc(x.origen || 'Registro')}</td></tr>`).join('') || '<tr><td colspan="8" class="nota">Todavía no hay aplicaciones registradas.</td></tr>'}</tbody></table></div>`;
  const f = $('#f');
  const cargarParc = async () => {
    const p = leerProd(ps, f.productor_txt.value); f.parcela_id.innerHTML = '<option value="">Toda la finca</option>';
    if (!p) return;
    const pa = (await parcelasOrg().catch(() => [])).filter(x => x.productor_id === p.id);
    f.parcela_id.innerHTML += pa.map(x => `<option value="${x.id}">${esc(x.nombre)}</option>`).join('');
  };
  const rev = () => { const v = f.producto.value.trim(); if (!v) { $('#revIns').innerHTML = ''; return; } const e = estadoInsumo(v); $('#revIns').innerHTML = `${chipInsumo(e)} ${e === 'Prohibido' ? 'Este producto está en la lista de prohibidos para orgánico.' : e === 'Permitido' ? 'Está en la lista de permitidos.' : 'No está en ninguna lista: queda por revisar.'}`; };
  f.productor_txt.onchange = cargarParc; f.producto.oninput = rev; cargarParc();
  f.onsubmit = async ev => {
    ev.preventDefault(); const d = datosForm(f), p = leerProd(ps, d.productor_txt);
    if (!p) return aviso('Elegí un productor de la lista.', true);
    if (estadoInsumo(d.producto) === 'Prohibido' && !confirm(`${d.producto} está prohibido para orgánico. Al registrarlo, ${d.parcela_id ? 'la parcela vuelve' : 'las parcelas no cambian (no se eligió parcela), pero'} a empezar la transición y se abre una no conformidad. ¿Registrar?`)) return;
    ocupado(f, true);
    try {
      const r = await q(sb.from('insumos_aplicados').insert({ id: nuevoId(), org_id: S.org.id, productor_id: p.id, parcela_id: d.parcela_id || null, fecha: d.fecha, producto: d.producto, tipo: d.tipo, cantidad: d.cantidad ? num(d.cantidad) : null, unidad: d.unidad, observaciones: d.observaciones || null, origen: 'Registro' }).select('estado').single());
      if (r._local) { aviso('Sin señal: la aplicación quedó en el teléfono y se manda sola al volver la señal.'); ocupado(f, false); f.producto.value = ''; f.cantidad.value = ''; f.observaciones.value = ''; return; }
      aviso(r.estado === 'Prohibido' ? 'Registrado. Se abrió una no conformidad por insumo prohibido.' : 'Aplicación registrada.', r.estado === 'Prohibido'); archivarLuego(true); RUTAS.insumos();
    } catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
};

RUTAS.lotes = async function verLotes() {
  const desde = sumarMeses(hoy(), -24);
  const aco = await q(sb.from('acopio').select('lote,fecha,psec_lb,certificacion,productor_id').eq('org_id', S.org.id).gte('fecha', desde).not('lote', 'is', null).order('fecha', { ascending: false }).limit(5000));
  const L2 = {}; aco.forEach(a => { const k = String(a.lote).toUpperCase(); const x = L2[k] = L2[k] || { lote: k, qq: 0, prods: new Set(), desde: a.fecha, hasta: a.fecha, certs: new Set() }; x.qq += num(a.psec_lb) / 100; x.prods.add(a.productor_id); if (a.fecha < x.desde) x.desde = a.fecha; if (a.fecha > x.hasta) x.hasta = a.fecha; if (a.certificacion) x.certs.add(a.certificacion); });
  const filas = Object.values(L2); await certs();
  app().innerHTML = cabecera('Trazabilidad por lote') + `<div class="filtros"><input id="bus" placeholder="Buscar lote"></div>
  <div class="tabla"><table><thead><tr><th>Lote</th><th>Acopio</th><th class="n">Productores</th><th class="n">Pergamino seco</th><th>Certificaciones</th></tr></thead><tbody>
  ${filas.map(x => `<tr data-t="${esc(norm(x.lote))}"><td><a href="#/lote/${encodeURIComponent(x.lote)}"><b>${esc(x.lote)}</b></a></td><td>${esc(x.desde)}${x.hasta !== x.desde ? ' a ' + esc(x.hasta) : ''}</td><td class="n">${x.prods.size}</td><td class="n">${qqTxt(x.qq)}</td><td>${[...x.certs].map(nombreCert).map(esc).join(', ') || 'Convencional'}</td></tr>`).join('') || '<tr><td colspan="5" class="nota">No hay acopios con lote en los últimos dos años.</td></tr>'}</tbody></table></div>`;
  $('#bus').oninput = e => { const t = norm(e.target.value); app().querySelectorAll('tr[data-t]').forEach(tr => tr.hidden = t && !tr.dataset.t.includes(t)); };
};

RUTAS.lote = async function verLote(codigo) {
  const lote = String(codigo || '').toUpperCase();
  const [aco, ben, des] = await Promise.all([
    q(sb.from('acopio').select('*, productores(id,codigo,nombre,comunidad)').eq('org_id', S.org.id).ilike('lote', lote).order('fecha')),
    q(sb.from('beneficiado').select('*').eq('org_id', S.org.id).ilike('lote', lote).order('fecha_inicio')),
    q(sb.from('despachos').select('*').eq('org_id', S.org.id).ilike('lotes', '%' + lote + '%').order('fecha'))
  ]);
  await certs();
  const ids = [...new Set(aco.map(a => a.productor_id))];
  const parc = ids.length ? await q(sb.from('parcelas').select('*').in('productor_id', ids)) : [];
  const total = aco.reduce((t, a) => t + num(a.psec_lb), 0) / 100, porProd = {};
  aco.forEach(a => { const k = a.productor_id; porProd[k] = porProd[k] || { p: a.productores, qq: 0, n: 0 }; porProd[k].qq += num(a.psec_lb) / 100; porProd[k].n++; });
  const eudr = parc.map(revisarEudr), malas = eudr.filter(r => r.some(x => x[0] === 'error')).length;
  const org = parc.map(estadoOrganico), trans = org.filter(o => o.ok === false).length;
  app().innerHTML = cabecera('Lote ' + lote, '#/lotes') + `<div class="caja"><dl class="detalle">
    <dt>${nomProducto()} acopiado</dt><dd>${qqTxt(total)} de ${secoTxt()} · ${aco.length} entregas de ${ids.length} productores</dd>
    <dt>Certificaciones</dt><dd>${[...new Set(aco.flatMap(a => a.certificaciones?.length ? a.certificaciones : [a.certificacion]).filter(Boolean))].map(nombreCert).map(esc).join(', ') || 'Convencional'}</dd>
    <dt>Fincas</dt><dd>${parc.length} parcelas · EUDR: ${malas ? `<span class="error">${malas} no cumplen</span>` : 'todas cumplen o están por revisar'} · orgánico: ${trans ? `<span class="error">${trans} en transición</span>` : 'sin parcelas en transición'}</dd>
    <dt>Vendido en</dt><dd>${des.map(x => `<a href="#/eudr/${x.id}">${esc(x.numero)}</a> (${esc(x.fecha)}, ${esc(x.comprador)})`).join(' · ') || 'Todavía no se ha despachado'}</dd></dl>
    <div class="acciones"><button class="sec" onclick="print()">Imprimir hoja del lote</button></div></div>
  <h2>1. Productores y entregas</h2><div class="tabla"><table><thead><tr><th>Productor</th><th>Comunidad</th><th class="n">Entregas</th><th class="n">Pergamino seco</th></tr></thead><tbody>
  ${Object.values(porProd).map(x => `<tr><td><a href="#/prod/${x.p?.id}">${esc(x.p?.codigo || '')} ${esc(x.p?.nombre || '')}</a></td><td>${esc(x.p?.comunidad || '')}</td><td class="n">${x.n}</td><td class="n">${qqTxt(x.qq)}</td></tr>`).join('') || '<tr><td colspan="4" class="nota">No hay acopios con este lote.</td></tr>'}</tbody></table></div>
  <div class="tabla" style="margin-top:8px"><table><thead><tr><th>Recibo</th><th>Fecha</th><th>Productor</th><th>Producto</th><th class="n">Peso (lb)</th><th class="n">Humedad</th><th>Certificación</th></tr></thead><tbody>
  ${aco.map(a => `<tr><td>${esc(a.numero)}</td><td>${esc(a.fecha)}</td><td>${esc(a.productores?.nombre || '')}</td><td>${esc(a.estado_cafe)}</td><td class="n">${num(a.peso_lb).toLocaleString('es-HN')}</td><td class="n">${a.humedad ?? ''}</td><td>${esc(nombreCert(a.certificacion))}</td></tr>`).join('')}</tbody></table></div>
  <h2>2. Beneficiado y secado</h2><div class="tabla"><table><thead><tr><th>Inicio</th><th>Fin</th><th>Método</th><th class="n">Entrada (lb)</th><th class="n">Salida (lb)</th><th class="n">Humedad final</th></tr></thead><tbody>
  ${ben.map(b => `<tr><td>${esc(b.fecha_inicio || '')}</td><td>${esc(b.fecha_fin || '')}</td><td>${esc(b.metodo || '')}</td><td class="n">${b.peso_entrada_lb ? num(b.peso_entrada_lb).toLocaleString('es-HN') : ''}</td><td class="n">${b.peso_salida_lb ? num(b.peso_salida_lb).toLocaleString('es-HN') : ''}</td><td class="n">${b.humedad_final ?? ''}</td></tr>`).join('') || '<tr><td colspan="6" class="nota">Sin registro de beneficiado para este lote.</td></tr>'}</tbody></table></div>
  <h2>3. Despacho y venta</h2><div class="tabla"><table><thead><tr><th>Despacho</th><th>Fecha</th><th>Comprador</th><th>Contrato</th><th>Certificación</th><th>EUDR</th></tr></thead><tbody>
  ${des.map(x => `<tr><td>${esc(x.numero)}</td><td>${esc(x.fecha)}</td><td>${esc(x.comprador)}</td><td>${esc(x.contrato || '')}</td><td>${esc(nombreCert(x.certificacion))}</td><td><a href="#/eudr/${x.id}">${x.dds_numero ? 'Declarado: ' + esc(x.dds_numero) : 'Revisar'}</a></td></tr>`).join('') || '<tr><td colspan="6" class="nota">Este lote todavía no sale.</td></tr>'}</tbody></table></div>`;
};

// =====================================================================
// APROBACIÓN DE REGISTROS (quién aprueba qué se marca en Usuarios › Aprueba)
// =====================================================================
const apruebo = t => S.maestro || (S.perfil?.aprueba || []).includes(t);
const RUTA_REG = { productores: id => '#/prod/' + id, inspecciones: id => '#/insp/' + id, acopio: id => '#/recibo/' + id, capacitaciones: id => '#/cap/' + id, quejas: id => '#/queja/' + id };
const rutaReg = (t, id) => (RUTA_REG[t] || (x => `#/rev/${t}/${x}`))(id);
async function verPdfRegistro(t, id) {
  const v = window.open('', '_blank');
  try { const d = await fnArchivo({ accion: 'pdf_registro', tabla: t, id }); if (v) v.location = d.url; else location.href = d.url; }
  catch (e) { if (v) v.close(); aviso(falla(e), true); }
}
// Recuadro con el estado de revisión de un registro y sus botones
function revisionHTML(t, r) {
  if (!r || !r.revision) return '';
  const c = { Pendiente: 'p-ambar', Aprobado: 'p-verde', Devuelto: 'p-rojo' }[r.revision] || 'p-gris';
  const txt = r.revision === 'Pendiente' ? 'Pendiente de revisión' : r.revision === 'Aprobado' ? `Aprobado por ${esc(r.revisado_por || '')} el ${fechaHora(r.revisado_fecha)}` : `Devuelto por ${esc(r.revisado_por || '')}: ${esc(r.revision_obs || '')}`;
  const bot = [r.revision === 'Pendiente' && apruebo(t) ? `<button data-rv="Aprobado">Aprobar</button><button class="sec" data-rv="Devuelto">Devolver para corregir</button>` : '',
    r.revision === 'Devuelto' ? `<button class="sec" data-rv="reenviar">Ya se corrigió: volver a enviar</button>` : '',
    esJefe() || apruebo(t) ? `<button class="sec" data-rv="pdf">Ver PDF</button>` : ''].join('');
  return `<div class="caja revision" id="revBox"><span class="punto ${c}"></span><b>${txt}</b>${bot ? `<div class="acciones" style="margin-top:8px">${bot}</div>` : ''}</div>`;
}
function conectarRevision(t, id, recargar) {
  app().querySelectorAll('#revBox [data-rv]').forEach(b => b.onclick = async () => {
    const d = b.dataset.rv;
    if (d === 'pdf') return verPdfRegistro(t, id);
    try {
      if (d === 'reenviar') { await q(sb.rpc('reenviar_revision', { t, r: id })); aviso('Se mandó otra vez a revisión.'); }
      else {
        const obs = d === 'Devuelto' ? prompt('¿Qué hay que corregir? Lo va a ver quien lo registró.') : null;
        if (d === 'Devuelto' && !obs) return;
        if (d === 'Aprobado' && !confirm('¿Aprobar este registro? Se guarda el PDF final con tu nombre.')) return;
        await q(sb.rpc('revisar', { t, r: id, decision: d, obs }));
        aviso(d === 'Aprobado' ? 'Aprobado. El PDF final se está guardando en el Archivo.' : 'Devuelto con tus observaciones.'); archivarLuego(true);
      }
      recargar ? recargar() : ruta();
    } catch (e) { aviso(falla(e), true); }
  });
}
RUTAS.aprobar = async function porAprobar() {
  const filas = await q(sb.rpc('por_revisar', { o: S.org.id }));
  const pend = filas.filter(x => x.revision === 'Pendiente'), dev = filas.filter(x => x.revision === 'Devuelto');
  const grupos = Object.keys(TIPOS_REV).filter(t => pend.some(x => x.tabla === t));
  const fila = x => `<tr data-t="${x.tabla}" data-id="${x.registro_id}"><td>${fechaHora(x.creado)}</td><td><a href="${rutaReg(x.tabla, x.registro_id)}">${esc(x.resumen || 'Ver')}</a></td>
    <td style="white-space:nowrap">${x.revision === 'Pendiente' ? `<button class="sec" data-a="pdf">PDF</button> <button data-a="Aprobado">Aprobar</button> <button class="sec" data-a="Devuelto">Devolver</button>` : `<button class="sec" data-a="reenviar">Volver a enviar</button>`}</td></tr>`;
  app().innerHTML = cabecera('Por aprobar', '#/') + `<p class="nota">Lo que llegó de Kobo o se registró y te toca revisar. Abrí cada registro para verlo completo, o mirá su PDF. Al aprobarlo queda tu nombre y se guarda el PDF final en el Archivo. Si algo está mal, devolvelo con lo que hay que corregir.</p>
  ${pend.length ? grupos.map(t => `<h2>${esc(TIPOS_REV[t])} <span class="nota">(${pend.filter(x => x.tabla === t).length})</span></h2><div class="tabla"><table><thead><tr><th>Llegó</th><th>Registro</th><th></th></tr></thead><tbody>${pend.filter(x => x.tabla === t).map(fila).join('')}</tbody></table></div>`).join('')
    : `<div class="caja">${(S.perfil?.aprueba || []).length || S.maestro ? 'No hay nada pendiente de aprobar. Todo al día.' : 'No tenés tipos de registro para aprobar. El administrador los asigna en Usuarios › Aprueba.'}</div>`}
  ${dev.length ? `<h2>Devueltos para corregir <span class="nota">(${dev.length})</span></h2><div class="tabla"><table><thead><tr><th>Llegó</th><th>Registro</th><th></th></tr></thead><tbody>${dev.map(x => fila({ ...x, resumen: `${TIPOS_REV[x.tabla]} · ${x.resumen}` })).join('')}</tbody></table></div>` : ''}`;
  app().querySelectorAll('[data-a]').forEach(b => b.onclick = async () => {
    const tr = b.closest('tr'), t = tr.dataset.t, id = tr.dataset.id, a = b.dataset.a;
    if (a === 'pdf') return verPdfRegistro(t, id);
    try {
      if (a === 'reenviar') await q(sb.rpc('reenviar_revision', { t, r: id }));
      else {
        const obs = a === 'Devuelto' ? prompt('¿Qué hay que corregir?') : null;
        if (a === 'Devuelto' && !obs) return;
        await q(sb.rpc('revisar', { t, r: id, decision: a, obs }));
      }
      aviso(a === 'Aprobado' ? 'Aprobado.' : a === 'Devuelto' ? 'Devuelto.' : 'Enviado otra vez.'); archivarLuego(true); RUTAS.aprobar();
    } catch (e) { aviso(falla(e), true); }
  });
};
// Vista sencilla de cualquier registro que se revisa
RUTAS.rev = async function verRegistro(t, id) {
  if (!TIPOS_REV[t]) return RUTAS[''](); 
  const r = await q(sb.from(t).select('*').eq('id', id).single());
  const pr = r.productor_id ? (await prods()).find(p => p.id === r.productor_id) : null;
  const omit = new Set(['id', 'org_id', 'productor_id', 'revision', 'revisado_por', 'revisado_fecha', 'revision_obs', 'revision_historial', 'kobo_uid', 'credito_id', 'inspeccion_id', 'parcela_id', 'bascula_id', 'acta_id']);
  const val = v => v == null || v === '' ? '' : Array.isArray(v) ? (v.every(x => typeof x !== 'object') ? v.join(', ') : `${v.length} filas`) : typeof v === 'object' ? Object.entries(v).filter(([k, x]) => x != null && x !== '' && typeof x !== 'object').map(([k, x]) => `${k.replace(/_/g, ' ')}: ${x}`).join(' · ') : typeof v === 'boolean' ? (v ? 'Sí' : 'No') : String(v);
  const pares = Object.entries(r).filter(([k, v]) => !omit.has(k) && val(v) !== '');
  app().innerHTML = cabecera(TIPOS_REV[t], '#/aprobar') + revisionHTML(t, r) + `<div class="caja"><dl class="detalle">${pr ? `<dt>Productor</dt><dd><a href="#/prod/${pr.id}">${esc(pr.codigo || '')} ${esc(pr.nombre)}</a></dd>` : ''}${pares.map(([k, v]) => `<dt>${esc(k.charAt(0).toUpperCase() + k.slice(1).replace(/_/g, ' '))}</dt><dd>${esc(val(v))}</dd>`).join('')}</dl></div>
  ${(r.revision_historial || []).length ? `<h2>Historial de revisión</h2><div class="tabla"><table><thead><tr><th>Fecha</th><th>Quién</th><th>Decisión</th><th>Observaciones</th></tr></thead><tbody>${r.revision_historial.map(h => `<tr><td>${fechaHora(h.fecha)}</td><td>${esc(h.por || '')}</td><td>${esc(h.decision || '')}</td><td>${esc(h.obs || '')}</td></tr>`).join('')}</tbody></table></div>` : ''}`;
  conectarRevision(t, id, () => RUTAS.rev(t, id));
};

// =====================================================================
// CAPACITACIONES: guías (catálogo), ayuda memoria y cumplimiento por certificación
// =====================================================================
const PUBLICO_CAP = { productores: 'Productores', empleados: 'Empleados', junta: 'Junta directiva' };
const NORMA_CAP = { org_ue: 'Orgánico UE', usda: 'Orgánico USDA-NOP', bio_suisse: 'Bio Suisse', fairtrade: 'Comercio Justo (Fairtrade)', eudr: 'EUDR', rainforest: 'Rainforest Alliance' };
async function guiasCap(todas) {
  if (!S._guias || S._guias.org !== S.org.id) S._guias = { org: S.org.id, lista: await q(sb.from('catalogo_capacitaciones').select('*').eq('org_id', S.org.id).order('orden')) };
  return todas ? S._guias.lista : S._guias.lista.filter(g => g.activa);
}
const aniosFrecuencia = f => /tres/i.test(f || '') ? 3 : /dos/i.test(f || '') ? 2 : 1;
function estadoGuia(g, caps) {
  const dadas = caps.filter(c => c.codigo === g.codigo).sort((a, b) => a.fecha < b.fecha ? 1 : -1), ult = dadas[0]?.fecha;
  if (!ult) return { ult: '', prox: '', txt: 'Nunca se ha dado', c: 'p-rojo', n: 0, dadas };
  const d = new Date(ult + 'T12:00:00'); d.setFullYear(d.getFullYear() + aniosFrecuencia(g.frecuencia)); const prox = d.toISOString().slice(0, 10), dias = diasEntre(hoy(), prox);
  return { ult, prox, txt: dias < 0 ? 'Vencida' : dias <= 60 ? 'Toca pronto' : 'Al día', c: dias < 0 ? 'p-rojo' : dias <= 60 ? 'p-ambar' : 'p-verde', n: dadas.length, dadas };
}
RUTAS.guias = async function verGuias(codigo) {
  const vista = codigo === 'norma' ? 'norma' : 'publico'; if (codigo === 'norma') codigo = null;
  const [gs, caps] = await Promise.all([guiasCap(true), q(sb.from('capacitaciones').select('id,codigo,fecha,lugar,sector,hombres,mujeres,jovenes,revision').eq('org_id', S.org.id).not('codigo', 'is', null).order('fecha', { ascending: false }).limit(5000))]);
  if (codigo) {
    const g = gs.find(x => x.codigo === codigo); if (!g) return RUTAS.guias();
    const e = estadoGuia(g, caps), li = a => a?.length ? `<ol>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ol>` : '<p class="nota">—</p>';
    app().innerHTML = cabecera(`${g.codigo} · ${g.titulo}`, '#/guias') + `<div class="acciones"><a class="boton" href="#/capacitacion/${g.codigo}">Registrar ayuda memoria</a>${esAdmin() ? `<button class="sec" id="act">${g.activa ? 'Quitar de la lista' : 'Volver a usar'}</button>` : ''}</div>
    <div class="caja"><dl class="detalle"><dt>Público</dt><dd>${esc(g.publico_txt || PUBLICO_CAP[g.publico])}</dd><dt>Normas que la exigen</dt><dd>${esc(g.normas_txt || '')}</dd><dt>Requisito de referencia</dt><dd>${esc(g.requisito || '')}</dd>
    <dt>Frecuencia</dt><dd>${esc(g.frecuencia || '')}</dd><dt>Duración</dt><dd>${esc(g.duracion || '')}</dd><dt>Facilitador sugerido</dt><dd>${esc(g.facilitador || '')}</dd><dt>Metodología</dt><dd>${esc(g.metodologia || '')}</dd>
    <dt>Estado</dt><dd><span class="punto ${e.c}"></span>${e.txt}${e.ult ? ` · última vez ${esc(e.ult)} · toca de nuevo ${esc(e.prox)}` : ''}</dd></dl></div>
    <h2>Objetivo</h2><div class="caja">${esc(g.objetivo || '')}</div>
    <h2>Contenidos que se deben desarrollar</h2><div class="caja">${li(g.contenidos)}</div>
    <h2>Materiales</h2><div class="caja">${li(g.materiales)}</div>
    <h2>Evaluación de lo aprendido</h2><div class="caja">${li(g.evaluacion)}</div>
    <h2>Evidencias que se deben dejar</h2><div class="caja">${li(g.evidencias)}</div>
    <h2>Veces que se ha dado <span class="nota">(${e.n})</span></h2><div class="tabla"><table><thead><tr><th>Fecha</th><th>Lugar</th><th class="n">Participantes</th><th>Revisión</th></tr></thead><tbody>${e.dadas.map(c => `<tr><td><a href="#/cap/${c.id}">${esc(c.fecha)}</a></td><td>${esc([c.sector, c.lugar].filter(Boolean).join(' · '))}</td><td class="n">${(c.hombres || 0) + (c.mujeres || 0)}</td><td>${esc(c.revision || '')}</td></tr>`).join('') || '<tr><td colspan="4" class="nota">Todavía no se ha dado.</td></tr>'}</tbody></table></div>`;
    const b = $('#act'); if (b) b.onclick = async () => { try { await q(sb.from('catalogo_capacitaciones').update({ activa: !g.activa }).eq('id', g.id)); S._guias = null; aviso('Listo.'); RUTAS.guias(codigo); } catch (er) { aviso(falla(er), true); } };
    return;
  }
  const act = gs.filter(g => g.activa), est = Object.fromEntries(act.map(g => [g.codigo, estadoGuia(g, caps)]));
  const filaG = g => { const e = est[g.codigo]; return `<tr><td><a href="#/guias/${g.codigo}"><b>${esc(g.codigo)}</b> ${esc(g.titulo)}</a></td><td>${esc(g.frecuencia || '')}</td><td>${esc(e.ult)}</td><td><span class="punto ${e.c}"></span>${e.txt}${e.prox && e.txt !== 'Al día' ? ' · ' + esc(e.prox) : ''}</td></tr>`; };
  const tabla = l => `<div class="tabla"><table><thead><tr><th>Guía</th><th>Frecuencia</th><th>Última vez</th><th>Estado</th></tr></thead><tbody>${l.map(filaG).join('') || '<tr><td colspan="4" class="nota">Ninguna.</td></tr>'}</tbody></table></div>`;
  const normasUsadas = Object.keys(NORMA_CAP).filter(n => act.some(g => (g.normas || []).includes(n)));
  const resumen = n => { const l = act.filter(g => (g.normas || []).includes(n)), ok = l.filter(g => est[g.codigo].txt === 'Al día').length; return `<div class="caja"><span class="nota">${esc(NORMA_CAP[n])}</span><b>${ok} de ${l.length}</b><span class="nota">guías al día</span></div>`; };
  const v = vista;
  app().innerHTML = cabecera('Guías y plan de capacitaciones') + `<p class="nota">Las capacitaciones que exige cada certificación, cuándo se dio cada una por última vez y cuándo toca otra vez según su frecuencia. Al registrar la ayuda memoria con el código de la guía, este cuadro se actualiza solo.</p>
  <div class="numeros">${normasUsadas.map(resumen).join('')}</div>
  <div class="filtros"><a class="boton ${v === 'publico' ? '' : 'sec'}" href="#/guias">Por público</a><a class="boton ${v === 'norma' ? '' : 'sec'}" href="#/guias/norma">Por certificación</a><a class="boton sec" href="#/capacitacion">+ Registrar ayuda memoria</a></div>
  ${v === 'norma' ? normasUsadas.map(n => `<h2>${esc(NORMA_CAP[n])}</h2>${tabla(act.filter(g => (g.normas || []).includes(n)))}`).join('')
    : Object.entries(PUBLICO_CAP).map(([k, t]) => `<h2>${t}</h2>${tabla(act.filter(g => g.publico === k))}`).join('')}
  ${gs.some(g => !g.activa) ? `<p class="nota">Guías quitadas de la lista: ${gs.filter(g => !g.activa).map(g => `<a href="#/guias/${g.codigo}">${esc(g.codigo)}</a>`).join(', ')}</p>` : ''}`;
};
RUTAS.capacitaciones = async function verCapacitaciones() {
  const caps = await q(sb.from('capacitaciones').select('id,fecha,codigo,tema,publico,lugar,sector,hombres,mujeres,jovenes,revision').eq('org_id', S.org.id).order('fecha', { ascending: false }).limit(500));
  app().innerHTML = cabecera('Capacitaciones') + `<div class="filtros"><a class="boton" href="#/capacitacion">+ Registrar ayuda memoria</a><a class="boton sec" href="#/guias">Guías y plan</a><a class="boton sec" href="#/asistencia">Asistencia por productor</a></div>
  <p class="nota">Lo normal es llenar la ayuda memoria en Kobo el mismo día, con las fotos y la lista firmada. Aquí también se puede registrar o completar.</p>
  <div class="tabla"><table><thead><tr><th>Fecha</th><th>Capacitación</th><th>Público</th><th>Lugar</th><th class="n">H</th><th class="n">M</th><th class="n">Jóvenes</th><th>Revisión</th></tr></thead><tbody>
  ${caps.map(c => `<tr><td>${esc(c.fecha)}</td><td><a href="#/cap/${c.id}">${c.codigo ? '<b>' + esc(c.codigo) + '</b> ' : ''}${esc(c.tema)}</a></td><td>${esc(PUBLICO_CAP[c.publico] || c.publico || '')}</td><td>${esc([c.sector, c.lugar].filter(Boolean).join(' · '))}</td><td class="n">${c.hombres || 0}</td><td class="n">${c.mujeres || 0}</td><td class="n">${c.jovenes || 0}</td><td>${c.revision ? `<span class="punto ${{ Pendiente: 'p-ambar', Aprobado: 'p-verde', Devuelto: 'p-rojo' }[c.revision]}"></span>${esc(c.revision)}` : ''}</td></tr>`).join('') || '<tr><td colspan="8" class="nota">Todavía no hay capacitaciones.</td></tr>'}
  </tbody></table></div>`;
};
RUTAS.cap = async function verAyudaMemoria(id) {
  const c = await q(sb.from('capacitaciones').select('*').eq('id', id).single());
  const g = c.codigo ? (await guiasCap(true)).find(x => x.codigo === c.codigo) : null, asis = c.datos?.asistentes || [];
  const li = a => a?.length ? `<ol>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ol>` : '<p class="nota">—</p>';
  app().innerHTML = cabecera('Ayuda memoria de capacitación', '#/capacitaciones') + revisionHTML('capacitaciones', c) + `
  <div class="caja"><h2 style="margin-top:0">${c.codigo ? esc(c.codigo) + ' · ' : ''}${esc(c.tema)}</h2><p class="nota">${esc(g?.normas_txt || (c.certificaciones || []).map(x => NORMA_CAP[x] || x).join(' · '))}</p>
  <dl class="detalle"><dt>Público</dt><dd>${esc(PUBLICO_CAP[c.publico] || c.publico || '')}</dd><dt>Fecha</dt><dd>${esc(c.fecha)}</dd><dt>Horario</dt><dd>${esc([c.hora_inicio, c.hora_fin].filter(Boolean).join(' a '))}</dd>
  <dt>Modalidad</dt><dd>${esc(c.modalidad || '')}</dd><dt>Sector y lugar</dt><dd>${esc([c.sector, c.lugar].filter(Boolean).join(' · '))}</dd><dt>Facilitador/a</dt><dd>${esc(c.facilitador || '')}</dd>
  <dt>Institución que apoyó</dt><dd>${esc(c.institucion || '')}</dd><dt>Requisito</dt><dd>${esc(c.requisito || g?.requisito || '')}</dd><dt>Solicitada por</dt><dd>${esc(c.solicitada_por || '')}</dd><dt>Elaborada por</dt><dd>${esc(c.elaborada_por || '')}</dd></dl></div>
  <h2>Objetivo</h2><div class="caja">${esc(c.objetivo || g?.objetivo || '')}</div>
  <h2>Contenidos desarrollados</h2><div class="caja">${li(c.contenidos?.length ? c.contenidos : [c.datos?.contenido].filter(Boolean))}${g && c.contenidos?.length < g.contenidos.length ? `<p class="nota">Faltaron ${g.contenidos.length - c.contenidos.length} de los ${g.contenidos.length} contenidos de la guía.</p>` : ''}</div>
  <h2>Resumen de lo discutido</h2><div class="caja">${esc(c.resumen || '—')}</div>
  ${c.materiales?.length ? `<h2>Materiales utilizados</h2><div class="caja">${li(c.materiales)}</div>` : ''}
  <h2>Participantes</h2><div class="numeros"><div class="caja"><span class="nota">Hombres</span><b>${c.hombres || 0}</b></div><div class="caja"><span class="nota">Mujeres</span><b>${c.mujeres || 0}</b></div><div class="caja"><span class="nota">Jóvenes</span><b>${c.jovenes || 0}</b></div><div class="caja"><span class="nota">Total</span><b>${asis.length || (c.hombres || 0) + (c.mujeres || 0)}</b></div></div>
  <p><a href="#/asistencia/${c.id}">Ver o completar la lista de asistencia</a></p>
  <h2>Evaluación de lo aprendido</h2><div class="caja">${c.evaluacion_aplicada ? `${c.respondieron_bien ?? 0} de ${c.evaluados ?? 0} respondieron bien${c.evaluacion_obs ? '. ' + esc(c.evaluacion_obs) : ''}` : c.evaluacion_aplicada === false ? 'No se aplicó evaluación.' : '—'}</div>
  <h2>Acuerdos y compromisos</h2><div class="caja">${esc(c.acuerdos || '—')}</div>
  ${(c.datos?.adjuntos || []).length ? `<p class="nota">Tiene ${c.datos.adjuntos.length} foto(s) de Kobo; salen en el PDF.</p>` : ''}
  <div class="acciones"><button class="sec" id="pdfCap">Ver PDF</button></div>`;
  conectarRevision('capacitaciones', id, () => RUTAS.cap(id));
  $('#pdfCap').onclick = () => verPdfRegistro('capacitaciones', id);
};
RUTAS.capacitacion = async function formAyudaMemoria(codigo) {
  const gs = await guiasCap();
  app().innerHTML = cabecera('Registrar ayuda memoria', '#/capacitaciones') + `<form class="caja" id="f"><div class="rejilla">
    <div class="ancho"><label>Capacitación (guía)</label><select name="codigo" id="gsel" required><option value="">Escoger…</option>${Object.entries(PUBLICO_CAP).map(([k, t]) => `<optgroup label="${t}">${gs.filter(g => g.publico === k).map(g => `<option value="${g.codigo}" ${g.codigo === codigo ? 'selected' : ''}>${esc(g.codigo)} · ${esc(g.titulo)}</option>`).join('')}</optgroup>`).join('')}<option value="otra">Otra capacitación (no está en las guías)</option></select></div>
    <div class="ancho" id="ginfo"></div>
    <div class="ancho" id="otraBox" hidden><label>Tema</label><input name="tema_otro"><label>Público</label><select name="publico">${Object.entries(PUBLICO_CAP).map(([k, t]) => `<option value="${k}">${t}</option>`).join('')}</select><label>Objetivo</label><input name="objetivo_otro"></div>
    <div><label>Fecha</label><input type="date" name="fecha" required value="${hoy()}"></div>
    <div><label>Modalidad</label><select name="modalidad">${opciones(['Día de campo / ECA', 'Taller', 'Reunión', 'Virtual', 'Gira de intercambio'])}</select></div>
    <div><label>Hora de inicio</label><input type="time" name="hora_inicio" required></div><div><label>Hora de finalización</label><input type="time" name="hora_fin" required></div>
    <div><label>Sector</label><input name="sector"></div><div><label>ECA o lugar</label><input name="lugar" required></div>
    <div><label>Facilitador o facilitadora</label><input name="facilitador" required></div><div><label>Institución que apoyó</label><input name="institucion"></div>
    <div><label>Solicitada por</label><input name="solicitada_por"></div><div><label>Elaborada por</label><input name="elaborada_por" required value="${esc(S.perfil?.nombre || '')}"></div>
    <div class="ancho" id="contBox"></div>
    <div class="ancho"><label>Resumen de lo discutido y puntos clave</label><textarea name="resumen" rows="4" required></textarea></div>
    <div class="ancho" id="matBox"></div><div class="ancho"><label>Otros materiales (separados con coma)</label><input name="materiales_otro"></div>
    <div><label>Hombres</label><input name="hombres" inputmode="numeric" value="0"></div><div><label>Mujeres</label><input name="mujeres" inputmode="numeric" value="0"></div><div><label>Jóvenes (menores de 30)</label><input name="jovenes" inputmode="numeric" value="0"></div>
    <div><label>¿Se aplicó la evaluación?</label><select name="eval_aplicada"><option value="si">Sí</option><option value="no">No</option></select></div>
    <div><label>¿Cuántos respondieron?</label><input name="evaluados" inputmode="numeric"></div><div><label>¿Cuántos respondieron bien?</label><input name="bien" inputmode="numeric"></div>
    <div class="ancho"><label>Acuerdos y compromisos</label><textarea name="acuerdos" rows="3" required></textarea></div>
  </div><p class="nota">Después de guardar se abre la lista de asistencia para agregar a cada participante. Las fotos y la lista firmada se suben desde el formulario de Kobo.</p><div class="acciones"><button>Guardar ayuda memoria</button></div></form>`;
  const f = $('#f');
  const pintar = () => {
    const g = gs.find(x => x.codigo === f.codigo.value); $('#otraBox').hidden = f.codigo.value !== 'otra';
    $('#ginfo').innerHTML = g ? `<div class="caja nota" style="margin:0"><b>${esc(g.normas_txt || '')}</b><br>Requisito: ${esc(g.requisito || '')}<br>Objetivo: ${esc(g.objetivo || '')}<br>Duración sugerida: ${esc(g.duracion || '')} · ${esc(g.frecuencia || '')}</div>` : '';
    $('#contBox').innerHTML = g ? `<label>Contenidos desarrollados (desmarcá los que no se vieron)</label>${g.contenidos.map((x, i) => `<label style="font-weight:400;display:flex;gap:6px;align-items:flex-start;margin:2px 0"><input type="checkbox" name="cont" value="${i}" checked style="width:auto;margin-top:3px">${esc(x)}</label>`).join('')}` : f.codigo.value === 'otra' ? '<label>Contenidos desarrollados (uno por renglón)</label><textarea name="cont_otro" rows="3"></textarea>' : '';
    $('#matBox').innerHTML = g?.materiales?.length ? `<label>Materiales utilizados</label>${g.materiales.map((x, i) => `<label style="font-weight:400;display:flex;gap:6px;align-items:flex-start;margin:2px 0"><input type="checkbox" name="mat" value="${i}" style="width:auto;margin-top:3px">${esc(x)}</label>`).join('')}` : '';
  };
  f.codigo.onchange = pintar; pintar();
  f.onsubmit = async ev => {
    ev.preventDefault(); const d = datosForm(f), g = gs.find(x => x.codigo === d.codigo);
    if (d.hora_fin && d.hora_inicio && d.hora_fin <= d.hora_inicio) return aviso('La hora de finalización tiene que ser después de la de inicio.', true);
    const cont = g ? [...f.querySelectorAll('input[name=cont]:checked')].map(x => g.contenidos[+x.value]) : lista(String(d.cont_otro || '').replace(/\n/g, ' '));
    const mats = [...(g ? [...f.querySelectorAll('input[name=mat]:checked')].map(x => g.materiales[+x.value]) : []), ...String(d.materiales_otro || '').split(/[,;]\s*/).filter(Boolean)];
    const ev2 = d.eval_aplicada === 'si';
    if (ev2 && num(d.bien) > num(d.evaluados)) return aviso('Los que respondieron bien no pueden ser más que los que respondieron.', true);
    const reg = { id: nuevoId(), org_id: S.org.id, fecha: d.fecha, codigo: g?.codigo || null, tema: g?.titulo || d.tema_otro || 'Capacitación', publico: g?.publico || d.publico, certificaciones: g?.normas || [],
      requisito: g?.requisito || null, objetivo: g?.objetivo || d.objetivo_otro || null, modalidad: d.modalidad, sector: d.sector || null, lugar: d.lugar, hora_inicio: d.hora_inicio, hora_fin: d.hora_fin,
      facilitador: d.facilitador, institucion: d.institucion || null, solicitada_por: d.solicitada_por || null, elaborada_por: d.elaborada_por, contenidos: cont, resumen: d.resumen, materiales: mats,
      hombres: num(d.hombres), mujeres: num(d.mujeres), jovenes: num(d.jovenes), evaluacion_aplicada: ev2, evaluados: ev2 ? num(d.evaluados) : null, respondieron_bien: ev2 ? num(d.bien) : null, acuerdos: d.acuerdos, datos: { asistentes: [] } };
    if (!reg.tema) return aviso('Escogé la guía o escribí el tema.', true);
    ocupado(f, true);
    try { await q(sb.from('capacitaciones').insert(reg)); aviso('Ayuda memoria guardada. Ahora agregá la lista de asistencia.'); archivarLuego(true); location.hash = '#/asistencia/' + reg.id; }
    catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
};
['capacitacion', 'capacitaciones', 'cap', 'guias'].forEach(r => SECCION_DE[r] = 'cer');
