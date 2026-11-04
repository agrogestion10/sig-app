// SIG · Portal, Panel de control, Liquidación laboral, Crédito interno y Certificaciones
'use strict';

Object.assign(CFG_TEXTO, {
  CREDITO_TASA_ANUAL: 'Crédito: tasa de interés anual (%)', CREDITO_PLAZO_MAX_MESES: 'Crédito: plazo máximo (meses)', CREDITO_MONTO_MAX: 'Crédito: monto máximo por productor (L)',
  CREDITO_MORA_PCT_MENSUAL: 'Crédito: recargo por mora (% mensual sobre lo atrasado)', CREDITO_GERENCIA_HASTA: 'Crédito: gerencia aprueba hasta (L); arriba, el administrador',
  CREDITO_DESTINOS: 'Crédito: destinos (uno por renglón)', PRIMA_FT_USD_LB: 'Prima de Comercio Justo (USD por libra)', PRIMA_PCT_PRODUCTIVIDAD: 'Prima: % mínimo para productividad y calidad',
  RENDIMIENTO_PERGAMINO_ORO: 'Rendimiento de pergamino seco a oro (0.8 = 80 %)', FACTOR_CAFE_UVA: 'Factor de café uva a pergamino seco', FACTOR_CAFE_PERGAMINO_HUMEDO: 'Factor de pergamino húmedo a seco',
  HUMEDAD_MAXIMA: 'Humedad máxima aceptada (%)', QUEJAS_DIAS_RESPUESTA: 'Quejas: días para responder', QUEJAS_DIAS_URGENTE: 'Quejas urgentes: días para responder',
  KOBO_ENLACES: 'Formularios de Kobo (uno por renglón: Nombre | enlace)'
});

const SEC = { cre: 'Crédito interno', cer: 'Certificaciones', adm: 'Administración' };
['credito', 'creditos', 'cred', 'cartera'].forEach(r => SECCION_DE[r] = 'cre');
['padron', 'prod', 'prodf', 'parcela', 'inspeccion', 'inspecciones', 'nc', 'acopio', 'acopios', 'despacho', 'balance', 'prima', 'reg', 'quejas', 'queja', 'catalogo', 'kobo'].forEach(r => SECCION_DE[r] = 'cer');
SECCION_DE.panel = '';

const tarjeta = (h, b, s, n) => `<a class="tarjeta" href="${h}">${n ? `<span class="num">${n}</span>` : ''}<b>${b}</b><span>${s}</span></a>`;
const cuenta = async (tabla, filtro) => { let x = sb.from(tabla).select('id', { count: 'exact', head: true }).eq('org_id', S.org.id); if (filtro) x = filtro(x); const r = await x; return r.count || 0; };
const cfgN = (k, d) => num(S.cfg[k] ?? d) || d;
const nombreUsuario = () => S.maestro ? 'Usuario maestro' : S.perfil.nombre;
const diasEntre = (a, b) => Math.round((new Date(b + 'T12:00') - new Date(a + 'T12:00')) / 864e5);
const sumarMeses = (f, m) => { const d = new Date(f + 'T12:00'); const dia = d.getDate(); d.setMonth(d.getMonth() + m); if (d.getDate() < dia) d.setDate(0); return d.toISOString().slice(0, 10); };

// ---------- catálogos en memoria (productores y certificaciones) ----------
async function prods(refrescar) {
  if (!refrescar && S._prods?.org === S.org.id) return S._prods.lista;
  const lista = await q(sb.from('productores').select('id,codigo,nombre,comunidad,certificaciones,estado_cert,activo').eq('org_id', S.org.id).order('nombre'));
  S._prods = { org: S.org.id, lista }; return lista;
}
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
RUTAS[''] = async function portal() {
  S.seccion = '';
  let pend = 0, crePend = 0, quejas = 0;
  if (esJefe()) [pend, crePend, quejas] = await Promise.all([
    cuenta('solicitudes', x => x.eq('estado', 'Pendiente')),
    cuenta('creditos', x => x.in('estado', ['Solicitado', 'En evaluación', 'Aprobado'])),
    cuenta('quejas', x => x.neq('estado', 'Cerrada'))
  ]);
  app().innerHTML = `<h1>${esc(S.org.nombre)}</h1>
  <div class="tarjetas portal">
    ${puedeSec('adm') ? tarjeta('#/adm', 'Administración', 'Compras, fondos, facturas, vacaciones, presupuesto', pend) : ''}
    ${puedeSec('cre') ? tarjeta('#/cre', 'Crédito interno', 'De la solicitud del productor al desembolso y la recuperación', crePend) : ''}
    ${puedeSec('cer') ? tarjeta('#/cer', 'Certificaciones', 'Padrón, inspecciones, acopio, balance de masas y prima', quejas) : ''}
    ${esAdmin() ? tarjeta('#/panel', 'Panel de control', 'Los números de la organización en una sola vista') : ''}
    ${!puedeSec('adm') && !puedeSec('cre') && !puedeSec('cer') ? '<div class="caja">Todavía no tenés secciones habilitadas. Pedile al administrador que te las active.</div>' : ''}
  </div>
  ${esAdmin() ? `<h2>Configuración</h2><div class="tarjetas">
    ${tarjeta('#/usuarios', 'Usuarios', 'Accesos y roles')}
    ${tarjeta('#/config', 'Configuración', 'Montos, listas, crédito y certificaciones')}
    ${tarjeta('#/catalogo', 'Catálogo de certificaciones', 'Cuáles se usan en esta organización')}
    ${tarjeta('#/bitacora', 'Bitácora', 'Quién hizo qué')}
    ${S.maestro ? tarjeta('#/orgs', 'Organizaciones', 'Altas y valores de ley') : ''}
  </div>` : ''}`;
};

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
  return { saldo: r2(Math.max(0, num(c.monto_aprobado) - capPag)), atraso: r2(atraso), dias: Math.max(0, dias), vencidas, prox, intPend: r2(Math.max(0, intVencido - intPag)), capPag, intPag };
}

RUTAS.cre = async function menuCredito() {
  S.seccion = 'cre';
  const n = esJefe() ? await cuenta('creditos', x => x.in('estado', ['Solicitado', 'En evaluación', 'Aprobado'])) : 0;
  app().innerHTML = cabecera('Crédito interno', '#/') + `<div class="tarjetas">
    ${tarjeta('#/prodf', 'Registrar productor', 'Datos del socio (también sirve para certificaciones)')}
    ${tarjeta('#/credito', 'Solicitud de crédito', 'Monto, destino, plazo y garantía')}
    ${tarjeta('#/creditos', esJefe() ? 'Créditos por resolver' : 'Mis solicitudes', 'Evaluación técnica, aprobación y desembolso', n)}
    ${esJefe() ? tarjeta('#/cartera', 'Cartera y pagos', 'Saldos, mora y recuperación') : ''}
    ${tarjeta('#/padron', 'Productores', 'Padrón de socios')}
  </div>`;
};

RUTAS.credito = async function formCredito() {
  const ps = await prods(), max = cfgN('CREDITO_MONTO_MAX', 100000), plazoMax = cfgN('CREDITO_PLAZO_MAX_MESES', 24);
  app().innerHTML = cabecera('Solicitud de crédito') + `<form class="caja" id="f"><div class="rejilla">
    <div class="ancho"><label>Productor</label>${campoProd(ps)}<p class="nota">¿No aparece? <a href="#/prodf">Registralo primero</a>.</p></div>
    <div><label>Monto solicitado (L)</label><input name="monto" required inputmode="decimal"></div>
    <div><label>Destino</label><select name="destino">${opciones(lista(S.cfg.CREDITO_DESTINOS).length ? lista(S.cfg.CREDITO_DESTINOS) : ['Mantenimiento de finca', 'Otro'])}</select></div>
    <div><label>Plazo (meses)</label><input name="plazo" required inputmode="numeric" value="12"></div>
    <div><label>Forma de pago</label><select name="frecuencia">${opciones(Object.keys(MESES_FREC))}</select></div>
    <div><label>Garantía</label><select name="garantia">${opciones(['Fiduciaria (fiador)', 'Prendaria', 'Hipotecaria', 'Contrato de entrega de cosecha', 'Sin garantía'])}</select></div>
    <div class="ancho"><label>Detalle del uso y de la garantía</label><textarea name="comentario"></textarea></div>
  </div><p class="nota">Máximo por productor: ${L(max)} · plazo máximo: ${plazoMax} meses · tasa vigente: ${cfgN('CREDITO_TASA_ANUAL', 18)} % anual.</p>
  <div class="acciones"><button>Registrar solicitud</button></div></form>`;
  $('#f').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target, d = datosForm(f), p = leerProd(ps, d.productor_txt);
    if (!p) return aviso('Elegí un productor de la lista.', true);
    if (num(d.monto) <= 0) return aviso('Poné el monto.', true);
    if (num(d.monto) > max) return aviso(`El monto pasa del máximo por productor (${L(max)}).`, true);
    if (+d.plazo < 1 || +d.plazo > plazoMax) return aviso(`El plazo debe ser de 1 a ${plazoMax} meses.`, true);
    ocupado(f, true);
    try { const c = await q(sb.from('creditos').insert({ org_id: S.org.id, productor_id: p.id, monto_solicitado: num(d.monto), destino: d.destino, plazo_meses: +d.plazo, frecuencia: d.frecuencia, garantia: d.garantia, comentario: d.comentario }).select('id,numero').single()); aviso('Solicitud registrada: ' + c.numero); location.hash = '#/cred/' + c.id; }
    catch (e) { ocupado(f, false); aviso(falla(e), true); }
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
const claseCre = e => ({ 'Solicitado': 'Pendiente', 'En evaluación': 'Pendiente', 'Aprobado': 'Autorizada', 'Desembolsado': 'Autorizada', 'Pagado': 'Anulada', 'Rechazado': 'Rechazada', 'Anulado': 'Anulada' }[e]);

RUTAS.cred = async function verCredito(id) {
  const c = await q(sb.from('creditos').select('*, productores(*)').eq('id', id).single());
  const pagos = esJefe() ? await q(sb.from('pagos_credito').select('*').eq('credito_id', id).order('fecha')) : [];
  const p = c.productores, ev = c.evaluacion || {}, est = c.estado === 'Desembolsado' || c.estado === 'Pagado' ? estadoCredito(c, pagos) : null;
  const tasa = c.tasa_anual ?? cfgN('CREDITO_TASA_ANUAL', 18), limGer = cfgN('CREDITO_GERENCIA_HASTA', 50000);
  let acc = '';
  if (['Solicitado', 'En evaluación'].includes(c.estado)) acc += `<h2>Evaluación técnica</h2><form class="caja" id="fEv"><div class="rejilla">
    <div><label>Técnico</label><input name="tecnico" required value="${esc(ev.tecnico || (S.maestro ? '' : S.perfil.nombre))}"></div>
    <div><label>Fecha de la visita</label><input type="date" name="fecha" value="${esc(ev.fecha || hoy())}"></div>
    <div><label>Área en producción (ha)</label><input name="area" inputmode="decimal" value="${esc(ev.area)}"></div>
    <div><label>Producción esperada (qq pergamino)</label><input name="produccion" inputmode="decimal" value="${esc(ev.produccion)}"></div>
    <div><label>Ingreso esperado de la cosecha (L)</label><input name="ingreso" inputmode="decimal" value="${esc(ev.ingreso)}"></div>
    <div><label>Otras deudas (L)</label><input name="deudas" inputmode="decimal" value="${esc(ev.deudas)}"></div>
    <div><label>Recomendación</label><select name="recomendacion">${opciones(['Aprobar', 'Aprobar con menor monto', 'Rechazar'], ev.recomendacion)}</select></div>
    <div><label>Monto recomendado (L)</label><input name="monto_recomendado" inputmode="decimal" value="${esc(ev.monto_recomendado ?? c.monto_solicitado)}"></div>
    <div class="ancho"><label>Observaciones de la visita</label><textarea name="observaciones">${esc(ev.observaciones)}</textarea></div>
  </div><div class="acciones"><button>Guardar evaluación</button></div></form>`;
  if (esJefe() && ['Solicitado', 'En evaluación'].includes(c.estado)) acc += `<h2>Decisión</h2><form class="caja" id="fAp"><div class="rejilla">
    <div><label>Monto aprobado (L)</label><input name="monto" inputmode="decimal" value="${esc(ev.monto_recomendado ?? c.monto_solicitado)}"></div>
    <div><label>Tasa anual (%)</label><input name="tasa" inputmode="decimal" value="${tasa}"></div>
    <div><label>Plazo (meses)</label><input name="plazo" inputmode="numeric" value="${c.plazo_meses}"></div>
    <div class="ancho"><label>Comentario</label><input name="comentario"></div>
  </div>${S.rol === 'gerencia' ? `<p class="nota">Gerencia aprueba hasta ${L(limGer)}; arriba de eso, el administrador.</p>` : ''}
  <div class="acciones"><button name="d" value="Aprobado">Aprobar</button><button class="rojo" name="d" value="Rechazado">Rechazar</button></div></form>`;
  if (esJefe() && c.estado === 'Aprobado') acc += `<h2>Desembolso</h2><form class="caja" id="fDes"><div class="rejilla">
    <div><label>Fecha del desembolso</label><input type="date" name="fecha" required value="${hoy()}"></div>
    <div><label>Fecha de la primera cuota</label><input type="date" name="primera" required value="${sumarMeses(hoy(), MESES_FREC[c.frecuencia] || c.plazo_meses)}"></div>
    <div class="ancho"><label>Forma de entrega (cheque, transferencia, efectivo) y referencia</label><input name="referencia"></div>
  </div><div id="planPrev"></div><div class="acciones"><button>Registrar desembolso</button></div></form>`;
  if (esJefe() && c.estado === 'Desembolsado') {
    const moraSug = est.atraso > 0 ? r2(est.atraso * cfgN('CREDITO_MORA_PCT_MENSUAL', 2) / 100 * Math.max(1, Math.ceil(est.dias / 30))) : 0;
    acc += `<h2>Registrar pago</h2><form class="caja" id="fPag"><div class="rejilla">
    <div><label>Fecha</label><input type="date" name="fecha" required value="${hoy()}"></div>
    <div><label>Monto recibido (L)</label><input name="monto" required inputmode="decimal" value="${est.atraso || est.prox?.cuota || ''}"></div>
    <div><label>Recargo por mora (L)</label><input name="mora" inputmode="decimal" value="${moraSug}"></div>
    <div><label>Número de recibo</label><input name="recibo"></div>
  </div><p class="nota" id="repart"></p><div class="acciones"><button>Registrar pago</button></div></form>`;
  }
  app().innerHTML = cabecera(`Crédito ${c.numero}`, '#/creditos') + `<div class="caja">${estadoChip(c.estado, claseCre(c.estado))}
  <dl class="detalle"><dt>Productor</dt><dd><a href="#/prod/${p.id}">${esc(p.nombre)}</a> ${p.identidad ? '· ' + esc(p.identidad) : ''} ${p.comunidad ? '· ' + esc(p.comunidad) : ''}</dd>
  <dt>Solicitado</dt><dd>${L(c.monto_solicitado)} · ${c.plazo_meses} meses · ${esc(c.frecuencia)} · ${esc(c.destino)}</dd><dt>Garantía</dt><dd>${esc(c.garantia)}${c.comentario ? ' · ' + esc(c.comentario) : ''}</dd>
  ${ev.tecnico ? `<dt>Evaluación</dt><dd>${esc(ev.tecnico)} (${esc(ev.fecha)}): ${esc(ev.recomendacion)} ${ev.monto_recomendado ? L(ev.monto_recomendado) : ''}. ${esc(ev.observaciones || '')}</dd>` : ''}
  ${c.monto_aprobado ? `<dt>Aprobado</dt><dd>${L(c.monto_aprobado)} al ${c.tasa_anual} % anual · ${esc(c.resuelto_por)} · ${fechaHora(c.resuelto)}</dd>` : ''}
  ${c.fecha_desembolso ? `<dt>Desembolsado</dt><dd>${esc(c.fecha_desembolso)}</dd>` : ''}</dl>
  ${est ? `<div class="tarjetas" style="margin-top:12px"><div class="tarjeta"><span>Saldo de capital</span><b>${L(est.saldo)}</b></div><div class="tarjeta"><span>Atrasado</span><b class="${est.atraso ? 'error' : ''}">${L(est.atraso)}</b><span>${est.dias ? est.dias + ' días de mora' : 'Al día'}</span></div><div class="tarjeta"><span>Próxima cuota</span><b>${est.prox ? L(est.prox.cuota) : '—'}</b><span>${est.prox ? esc(est.prox.fecha) : ''}</span></div></div>` : ''}
  </div>
  ${c.plan ? `<h2>Plan de pagos</h2><div class="tabla"><table><thead><tr><th>#</th><th>Fecha</th><th class="n">Capital</th><th class="n">Interés</th><th class="n">Cuota</th><th class="n">Saldo</th></tr></thead><tbody>${c.plan.map(x => `<tr${x.fecha < hoy() ? ' style="color:var(--gris)"' : ''}><td>${x.n}</td><td>${esc(x.fecha)}</td><td class="n">${L(x.capital)}</td><td class="n">${L(x.interes)}</td><td class="n">${L(x.cuota)}</td><td class="n">${L(x.saldo)}</td></tr>`).join('')}</tbody></table></div>` : ''}
  ${pagos.length ? `<h2>Pagos recibidos</h2><div class="tabla"><table><thead><tr><th>Fecha</th><th>Recibo</th><th class="n">Monto</th><th class="n">Mora</th><th class="n">Interés</th><th class="n">Capital</th></tr></thead><tbody>${pagos.map(x => `<tr><td>${esc(x.fecha)}</td><td>${esc(x.recibo)}</td><td class="n">${L(x.monto)}</td><td class="n">${L(x.mora)}</td><td class="n">${L(x.interes)}</td><td class="n">${L(x.capital)}</td></tr>`).join('')}</tbody></table></div>` : ''}
  ${acc}<div class="acciones"><button class="sec" onclick="print()">Imprimir</button>${esJefe() && ['Solicitado', 'En evaluación', 'Aprobado'].includes(c.estado) ? '<button class="sec" id="anular">Anular solicitud</button>' : ''}</div>`;

  const recargar = () => RUTAS.cred(id);
  const fEv = $('#fEv'); if (fEv) fEv.onsubmit = async e => {
    e.preventDefault(); const d = datosForm(fEv); ocupado(fEv, true);
    try { await q(sb.from('creditos').update({ evaluacion: d, estado: 'En evaluación' }).eq('id', id)); aviso('Evaluación guardada.'); recargar(); } catch (er) { ocupado(fEv, false); aviso(falla(er), true); }
  };
  const fAp = $('#fAp'); if (fAp) fAp.onsubmit = async e => {
    e.preventDefault(); const dec = e.submitter?.value || 'Aprobado', d = datosForm(fAp);
    if (dec === 'Aprobado') {
      if (num(d.monto) <= 0) return aviso('Poné el monto aprobado.', true);
      if (S.rol === 'gerencia' && num(d.monto) > limGer) return aviso(`Este monto lo aprueba el administrador (gerencia hasta ${L(limGer)}).`, true);
    } else if (!d.comentario) return aviso('Escribí por qué se rechaza.', true);
    ocupado(fAp, true);
    try { await q(sb.from('creditos').update(dec === 'Aprobado' ? { estado: dec, monto_aprobado: num(d.monto), tasa_anual: num(d.tasa), plazo_meses: +d.plazo, comentario: d.comentario || c.comentario } : { estado: dec, comentario: d.comentario }).eq('id', id)); aviso('Crédito ' + dec.toLowerCase() + '.'); recargar(); }
    catch (er) { ocupado(fAp, false); aviso(falla(er), true); }
  };
  const fDes = $('#fDes'); if (fDes) {
    const prev = () => { const d = datosForm(fDes); if (!d.primera) return; const pl = armarPlan(c.monto_aprobado, c.tasa_anual, c.plazo_meses, c.frecuencia, d.primera); $('#planPrev').innerHTML = `<p class="nota">${pl.length} cuota${pl.length > 1 ? 's' : ''} de ${L(pl[0].cuota)} · intereses totales ${L(pl.reduce((t, x) => t + x.interes, 0))}.</p>`; };
    fDes.oninput = prev; prev();
    fDes.onsubmit = async e => {
      e.preventDefault(); const d = datosForm(fDes); ocupado(fDes, true);
      try { await q(sb.from('creditos').update({ estado: 'Desembolsado', fecha_desembolso: d.fecha, primera_cuota: d.primera, plan: armarPlan(c.monto_aprobado, c.tasa_anual, c.plazo_meses, c.frecuencia, d.primera), comentario: [c.comentario, d.referencia].filter(Boolean).join(' · ') }).eq('id', id)); aviso('Desembolso registrado.'); recargar(); }
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
  const an = $('#anular'); if (an) an.onclick = async () => {
    const m = prompt('¿Por qué se anula?'); if (!m) return;
    try { await q(sb.from('creditos').update({ estado: 'Anulado', comentario: m }).eq('id', id)); aviso('Solicitud anulada.'); recargar(); } catch (er) { aviso(falla(er), true); }
  };
};

RUTAS.cartera = async function verCartera() {
  if (!esJefe()) return RUTAS.cre();
  const [cre, pagos] = await Promise.all([
    q(sb.from('creditos').select('id,numero,monto_aprobado,plan,estado,fecha_desembolso,productores(nombre,comunidad)').eq('org_id', S.org.id).eq('estado', 'Desembolsado')),
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
  ${filas.map(({ c, e }) => `<tr><td><a href="#/cred/${c.id}">${esc(c.numero)}</a></td><td>${esc(c.productores?.nombre)}</td><td>${esc(c.productores?.comunidad)}</td><td class="n">${L(c.monto_aprobado)}</td><td class="n">${L(e.saldo)}</td><td class="n ${e.atraso ? 'error' : ''}">${e.atraso ? L(e.atraso) : ''}</td><td class="n">${e.dias || ''}</td><td>${e.prox ? esc(e.prox.fecha) + ' · ' + L(e.prox.cuota) : ''}</td></tr>`).join('') || '<tr><td colspan="8" class="nota">No hay créditos desembolsados.</td></tr>'}
  </tbody></table></div>`;
};

// =====================================================================
// CERTIFICACIONES
// =====================================================================
RUTAS.cer = async function menuCert() {
  S.seccion = 'cer';
  const [nc, qj] = esJefe() ? await Promise.all([cuenta('no_conformidades', x => x.eq('estado', 'Abierta')), cuenta('quejas', x => x.neq('estado', 'Cerrada'))]) : [0, 0];
  app().innerHTML = cabecera('Certificaciones · café', '#/') + `
  <h2>Productores y fincas</h2><div class="tarjetas">
    ${tarjeta('#/padron', 'Padrón de productores', 'Socios, parcelas y certificaciones')}
    ${tarjeta('#/prodf', 'Registrar productor', 'Socio nuevo')}
    ${tarjeta('#/parcela', 'Registrar parcela', 'Punto GPS y polígono (obligatorio desde 4 ha)')}
  </div>
  <h2>Control interno</h2><div class="tarjetas">
    ${tarjeta('#/inspeccion', 'Inspección interna', 'Resultado anual y no conformidades')}
    ${tarjeta('#/inspecciones', 'Inspecciones', 'Historial')}
    ${tarjeta('#/nc', 'No conformidades', 'Seguimiento y cierre', nc)}
    ${tarjeta('#/reg/capacitaciones', 'Capacitaciones', 'Temas, asistencia y acuerdos')}
    ${tarjeta('#/quejas', 'Quejas y reclamos', 'Buzón, también anónimo', qj)}
  </div>
  <h2>Trazabilidad</h2><div class="tarjetas">
    ${tarjeta('#/acopio', 'Registrar acopio', 'Entrega de cada socio')}
    ${tarjeta('#/acopios', 'Acopio', 'Entregas registradas')}
    ${tarjeta('#/reg/beneficiado', 'Beneficiado y secado', 'Proceso de cada lote')}
    ${tarjeta('#/despacho', 'Despacho y venta', 'Contratos y lotes vendidos')}
    ${tarjeta('#/balance', 'Balance de masas', 'Comprado contra vendido por certificación')}
    ${tarjeta('#/prima', 'Prima de Comercio Justo', 'Generada, usada y disponible')}
  </div>
  <h2>Formularios de campo</h2><div class="tarjetas">${tarjeta('#/kobo', 'Formularios de KoboToolbox', 'Para llenar en el campo, con o sin señal')}${esAdmin() ? tarjeta('#/catalogo', 'Catálogo de certificaciones', 'Activar o desactivar') : ''}</div>`;
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
  const p = id ? await q(sb.from('productores').select('*').eq('id', id).single()) : { cultivo: 'Café', certificaciones: [] }, cs = await certs();
  const c = (k, t, tipo = 'text', extra = '') => `<div><label>${t}</label><input type="${tipo}" name="${k}" value="${esc(p[k])}" ${extra}></div>`;
  app().innerHTML = cabecera(id ? 'Editar productor' : 'Registrar productor', id ? '#/prod/' + id : undefined) + `<form class="caja" id="f"><div class="rejilla">
    ${c('nombre', 'Nombre completo', 'text', 'required')}${c('codigo', 'Código de socio')}${c('identidad', 'Número de identidad')}
    <div><label>Sexo</label><select name="sexo">${opciones(['', 'Mujer', 'Hombre'], p.sexo)}</select></div>${c('fecha_nacimiento', 'Fecha de nacimiento', 'date')}${c('telefono', 'Teléfono', 'tel')}
    ${c('comunidad', 'Comunidad o aldea')}${c('municipio', 'Municipio')}${c('departamento', 'Departamento')}${c('fecha_ingreso', 'Fecha de ingreso a la organización', 'date')}
    <div><label>Cultivo</label><input name="cultivo" value="${esc(p.cultivo || 'Café')}" readonly></div>
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
  app().innerHTML = cabecera(p.nombre, '#/padron') + `<div class="caja"><dl class="detalle" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:0 14px">
    <div><dt>Código</dt><dd>${esc(p.codigo || '—')}</dd></div><div><dt>Identidad</dt><dd>${esc(p.identidad || '—')}</dd></div><div><dt>Teléfono</dt><dd>${esc(p.telefono || '—')}</dd></div>
    <div><dt>Ubicación</dt><dd>${esc([p.comunidad, p.municipio, p.departamento].filter(Boolean).join(', ') || '—')}</dd></div><div><dt>Ingreso</dt><dd>${esc(p.fecha_ingreso || '—')}</dd></div>
    <div><dt>Certificaciones</dt><dd>${p.certificaciones.map(nombreCert).map(esc).join(', ') || '—'}</dd></div><div><dt>Última inspección</dt><dd>${esc(p.estado_cert || 'Sin inspección')}</dd></div>
  </dl><div class="acciones"><a class="boton sec" href="#/prodf/${p.id}">Editar datos</a><a class="boton sec" href="#/parcela/nuevo/${p.id}">+ Parcela</a><a class="boton sec" href="#/inspeccion/${p.id}">+ Inspección</a><a class="boton sec" href="#/acopio/${p.id}">+ Acopio</a><a class="boton sec" href="#/credito">+ Crédito</a></div></div>
  <h2>Parcelas (${parc.length} · ${haTot.toFixed(2)} ha)</h2>
  ${parc.some(x => x.lat || x.poligono) ? '<div id="mapa" style="height:320px;border-radius:12px;border:1px solid var(--borde);margin-bottom:10px"></div>' : ''}
  <div class="tabla"><table><thead><tr><th>Parcela</th><th class="n">Área (ha)</th><th>Variedad</th><th class="n">Altitud</th><th>Ubicación</th><th>Polígono</th><th></th></tr></thead><tbody>
  ${parc.map(x => `<tr><td>${esc(x.nombre)}</td><td class="n">${num(x.area_ha).toFixed(2)}</td><td>${esc(x.variedad)}</td><td class="n">${x.altitud ?? ''}</td><td>${x.lat ? `${num(x.lat).toFixed(5)}, ${num(x.lon).toFixed(5)}` : '<span class="error">Sin punto</span>'}</td><td>${x.poligono ? 'Sí' : num(x.area_ha) >= 4 ? '<span class="error">Falta (4 ha o más)</span>' : 'No requerido'}</td><td><a href="#/parcela/${x.id}">Editar</a></td></tr>`).join('') || '<tr><td colspan="7" class="nota">Sin parcelas.</td></tr>'}
  </tbody></table></div>
  <h2>Inspecciones</h2><div class="tabla"><table><thead><tr><th>Fecha</th><th>Inspector</th><th>Certificaciones</th><th>Resultado</th><th>Observaciones</th></tr></thead><tbody>
  ${insp.map(x => `<tr><td>${esc(x.fecha)}</td><td>${esc(x.inspector)}</td><td>${x.certificaciones.map(nombreCert).map(esc).join(', ')}</td><td>${esc(x.resultado)}</td><td>${esc(x.observaciones)}</td></tr>`).join('') || '<tr><td colspan="5" class="nota">Sin inspecciones.</td></tr>'}</tbody></table></div>
  ${nc.length ? `<h2>No conformidades</h2><div class="tabla"><table><thead><tr><th>Requisito</th><th>Hallazgo</th><th>Acción</th><th>Plazo</th><th>Estado</th></tr></thead><tbody>${nc.map(x => `<tr><td>${esc(x.requisito)}</td><td>${esc(x.descripcion)}</td><td>${esc(x.accion)}</td><td>${esc(x.plazo)}</td><td>${estadoChip(x.estado, x.estado === 'Abierta' ? 'Pendiente' : 'Autorizada')}</td></tr>`).join('')}</tbody></table></div>` : ''}
  <h2>Acopio ${anio}: ${(aco.reduce((t, x) => t + num(x.psec_lb), 0) / 100).toFixed(2)} qq pergamino seco</h2>
  ${aco.length ? `<div class="tabla"><table><thead><tr><th>Número</th><th>Fecha</th><th>Café</th><th class="n">Peso (lb)</th><th>Certificación</th></tr></thead><tbody>${aco.map(x => `<tr><td>${esc(x.numero)}</td><td>${esc(x.fecha)}</td><td>${esc(x.estado_cafe)}</td><td class="n">${num(x.peso_lb).toLocaleString('es-HN')}</td><td>${esc(nombreCert(x.certificacion))}</td></tr>`).join('')}</tbody></table></div>` : ''}
  ${cre.length ? `<h2>Créditos</h2><div class="tabla"><table><thead><tr><th>Número</th><th class="n">Monto</th><th>Estado</th></tr></thead><tbody>${cre.map(x => `<tr><td><a href="#/cred/${x.id}">${esc(x.numero)}</a></td><td class="n">${L(x.monto_aprobado || x.monto_solicitado)}</td><td>${esc(x.estado)}</td></tr>`).join('')}</tbody></table></div>` : ''}`;
  if ($('#mapa')) dibujarMapa($('#mapa'), parc);
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
    const reg = { productor_id: pr.id, nombre: d.nombre, area_ha: num(d.area_ha), lat, lon, altitud: d.altitud ? num(d.altitud) : null, variedad: d.variedad, anio_siembra: d.anio_siembra ? +d.anio_siembra : null, sombra: d.sombra, poligono: pol };
    ocupado(f, true);
    try { if (nuevo) await q(sb.from('parcelas').insert({ ...reg, org_id: S.org.id })); else await q(sb.from('parcelas').update(reg).eq('id', id)); aviso('Parcela guardada.'); location.hash = '#/prod/' + pr.id; }
    catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
};

RUTAS.inspeccion = async function formInspeccion(prodId) {
  const [ps, cs] = await Promise.all([prods(), certs()]);
  const p0 = ps.find(x => x.id === prodId);
  app().innerHTML = cabecera('Inspección interna') + `<form class="caja" id="f"><div class="rejilla">
    <div class="ancho"><label>Productor</label>${campoProd(ps, prodId)}</div>
    <div><label>Fecha</label><input type="date" name="fecha" required value="${hoy()}"></div>
    <div><label>Inspector interno</label><input name="inspector" required value="${esc(S.maestro ? '' : S.perfil.nombre)}"></div>
    <div><label>Resultado</label><select name="resultado">${opciones(['Aprobado', 'Condicionado', 'No aprobado'])}</select></div>
    <div class="ancho"><label>Certificaciones inspeccionadas</label>${checksCert(cs, p0?.certificaciones || [])}</div>
    <div class="ancho"><label>Observaciones generales</label><textarea name="observaciones"></textarea></div>
  </div><h2>No conformidades encontradas</h2><div id="ncs"></div><div class="acciones"><button type="button" class="sec" id="masNc">+ Agregar no conformidad</button></div>
  <div class="acciones"><button>Guardar inspección</button></div></form>
  <p class="nota">La lista de chequeo completa se llena en el campo con el formulario de Kobo «Inspección interna».</p>`;
  let n = 0; const f = $('#f');
  $('#masNc').onclick = () => { n++; $('#ncs').insertAdjacentHTML('beforeend', `<div class="cot rejilla"><div><label>Requisito o norma</label><input name="req${n}"></div><div class="ancho"><label>Hallazgo</label><input name="desc${n}"></div><div><label>Acción correctiva</label><input name="acc${n}"></div><div><label>Plazo</label><input type="date" name="plazo${n}"></div></div>`); };
  f.productor_txt.onchange = () => { const p = leerProd(ps, f.productor_txt.value); if (p) f.querySelectorAll('input[name=certs]').forEach(c => c.checked = p.certificaciones.includes(c.value)); };
  f.onsubmit = async ev => {
    ev.preventDefault(); const d = datosForm(f), p = leerProd(ps, d.productor_txt);
    if (!p) return aviso('Elegí un productor de la lista.', true);
    const ncs = []; for (let i = 1; i <= n; i++) if (d['desc' + i]) ncs.push({ requisito: d['req' + i], descripcion: d['desc' + i], accion: d['acc' + i], plazo: d['plazo' + i] || null });
    if (d.resultado !== 'Aprobado' && !ncs.length && !d.observaciones) return aviso('Si no queda aprobado, anotá las no conformidades u observaciones.', true);
    ocupado(f, true);
    try {
      const i = await q(sb.from('inspecciones').insert({ org_id: S.org.id, productor_id: p.id, fecha: d.fecha, inspector: d.inspector, resultado: d.resultado, certificaciones: leerChecks(f), observaciones: d.observaciones }).select('id').single());
      if (ncs.length) await q(sb.from('no_conformidades').insert(ncs.map(x => ({ ...x, org_id: S.org.id, productor_id: p.id, inspeccion_id: i.id }))));
      if (esJefe()) { await q(sb.from('productores').update({ estado_cert: d.resultado }).eq('id', p.id)); await prods(true); }
      aviso('Inspección guardada.'); location.hash = '#/prod/' + p.id;
    } catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
};

RUTAS.inspecciones = async function verInspecciones() {
  const filas = await q(sb.from('inspecciones').select('*, productores(nombre,codigo)').eq('org_id', S.org.id).order('fecha', { ascending: false }).limit(500)); await certs();
  const cuenta3 = k => filas.filter(x => x.resultado === k).length;
  app().innerHTML = cabecera('Inspecciones internas') + `<div class="filtros"><a class="boton" href="#/inspeccion">+ Nueva inspección</a></div>
  <p>${filas.length} inspecciones · ${cuenta3('Aprobado')} aprobadas · ${cuenta3('Condicionado')} condicionadas · ${cuenta3('No aprobado')} no aprobadas</p>
  <div class="tabla"><table><thead><tr><th>Fecha</th><th>Productor</th><th>Inspector</th><th>Certificaciones</th><th>Resultado</th></tr></thead><tbody>
  ${filas.map(x => `<tr><td>${esc(x.fecha)}</td><td><a href="#/prod/${x.productor_id}">${esc(x.productores?.nombre)}</a></td><td>${esc(x.inspector)}</td><td>${x.certificaciones.map(nombreCert).map(esc).join(', ')}</td><td>${esc(x.resultado)}</td></tr>`).join('') || '<tr><td colspan="5" class="nota">Sin inspecciones.</td></tr>'}</tbody></table></div>`;
};

RUTAS.nc = async function verNC() {
  const filas = await q(sb.from('no_conformidades').select('*, productores(nombre)').eq('org_id', S.org.id).order('estado').order('plazo'));
  app().innerHTML = cabecera('No conformidades') + `<div class="tabla"><table><thead><tr><th>Productor</th><th>Requisito</th><th>Hallazgo</th><th>Acción</th><th>Plazo</th><th>Estado</th><th></th></tr></thead><tbody>
  ${filas.map(x => { const venc = x.estado === 'Abierta' && x.plazo && x.plazo < hoy(); return `<tr><td><a href="#/prod/${x.productor_id}">${esc(x.productores?.nombre)}</a></td><td>${esc(x.requisito)}</td><td>${esc(x.descripcion)}</td><td>${esc(x.accion)}</td><td class="${venc ? 'error' : ''}">${esc(x.plazo || '')}${venc ? ' (vencido)' : ''}</td><td>${estadoChip(x.estado, x.estado === 'Abierta' ? 'Pendiente' : 'Autorizada')}${x.cerrada ? '<br><span class="nota">' + esc(x.cerrada) + ' · ' + esc(x.verificacion) + '</span>' : ''}</td><td>${esJefe() && x.estado === 'Abierta' ? `<button class="sec" data-cerrar="${x.id}">Cerrar</button>` : ''}</td></tr>`; }).join('') || '<tr><td colspan="7" class="nota">Sin no conformidades.</td></tr>'}</tbody></table></div>`;
  app().querySelectorAll('[data-cerrar]').forEach(b => b.onclick = async () => {
    const v = prompt('¿Cómo se verificó que se corrigió?'); if (!v) return;
    try { await q(sb.from('no_conformidades').update({ estado: 'Cerrada', cerrada: hoy(), verificacion: v }).eq('id', b.dataset.cerrar)); aviso('No conformidad cerrada.'); RUTAS.nc(); } catch (e) { aviso(falla(e), true); }
  });
};

// ---------- acopio, despachos y balance de masas ----------
function aPergaminoSeco(estado, lb) {
  const p = num(lb);
  return r2(estado === 'Uva' ? p * cfgN('FACTOR_CAFE_UVA', 0.2) : estado === 'Pergamino húmedo' ? p * cfgN('FACTOR_CAFE_PERGAMINO_HUMEDO', 0.8) : estado === 'Oro' ? p / cfgN('RENDIMIENTO_PERGAMINO_ORO', 0.8) : p);
}
RUTAS.acopio = async function formAcopio(prodId) {
  const [ps] = await Promise.all([prods(), certs()]);
  app().innerHTML = cabecera('Registrar acopio') + `<form class="caja" id="f"><div class="rejilla">
    <div class="ancho"><label>Productor</label>${campoProd(ps, prodId)}</div>
    <div><label>Fecha</label><input type="date" name="fecha" required value="${hoy()}"></div>
    <div><label>Certificación del café</label><select name="certificacion" id="cert"><option value="">Convencional</option></select></div>
    <div><label>Estado del café</label><select name="estado_cafe">${opciones(['Pergamino seco', 'Pergamino húmedo', 'Uva', 'Oro'])}</select></div>
    <div><label>Peso neto (libras)</label><input name="peso_lb" required inputmode="decimal"></div>
    <div><label>Humedad (%)</label><input name="humedad" inputmode="decimal"></div>
    <div><label>Precio por libra (L)</label><input name="precio_lb" inputmode="decimal"></div>
    <div><label>Lote</label><input name="lote"></div>
    <div class="ancho"><label>Observaciones</label><input name="observaciones"></div>
  </div><p class="nota" id="calc"></p><div class="acciones"><button>Registrar entrega</button></div></form>`;
  const f = $('#f');
  const opc = () => { const p = leerProd(ps, f.productor_txt.value), v = f.certificacion.value; f.certificacion.innerHTML = '<option value="">Convencional</option>' + (p?.certificaciones || []).map(c => `<option value="${esc(c)}">${esc(nombreCert(c))}</option>`).join(''); if (p?.certificaciones.includes(v)) f.certificacion.value = v; };
  f.productor_txt.oninput = opc; opc();
  f.oninput = () => { const d = datosForm(f), ps = aPergaminoSeco(d.estado_cafe, d.peso_lb), hm = cfgN('HUMEDAD_MAXIMA', 12); $('#calc').innerHTML = num(d.peso_lb) ? `Equivale a <b>${ps.toLocaleString('es-HN')} lb (${(ps / 100).toFixed(2)} qq)</b> de pergamino seco${num(d.precio_lb) ? ` · total a pagar <b>${L(num(d.peso_lb) * num(d.precio_lb))}</b>` : ''}${['Pergamino seco', 'Oro'].includes(d.estado_cafe) && num(d.humedad) > hm ? ` · <span class="error">humedad arriba del ${hm} %</span>` : ''}` : ''; };
  f.onsubmit = async ev => {
    ev.preventDefault(); const d = datosForm(f), p = leerProd(ps, d.productor_txt);
    if (!p) return aviso('Elegí un productor de la lista.', true);
    if (d.certificacion && !p.certificaciones.includes(d.certificacion)) return aviso('Ese productor no está en esa certificación.', true);
    if (d.certificacion && p.estado_cert === 'No aprobado') return aviso('El productor no aprobó la inspección interna: su café entra como convencional.', true);
    if (num(d.peso_lb) <= 0) return aviso('Poné el peso.', true);
    ocupado(f, true);
    try {
      const r = await q(sb.from('acopio').insert({ org_id: S.org.id, productor_id: p.id, fecha: d.fecha, certificacion: d.certificacion || null, estado_cafe: d.estado_cafe, peso_lb: num(d.peso_lb), humedad: d.humedad ? num(d.humedad) : null, precio_lb: d.precio_lb ? num(d.precio_lb) : null, total: d.precio_lb ? r2(num(d.peso_lb) * num(d.precio_lb)) : null, psec_lb: aPergaminoSeco(d.estado_cafe, d.peso_lb), lote: d.lote, observaciones: d.observaciones }).select('numero').single());
      aviso('Entrega registrada: ' + r.numero); location.hash = '#/acopios';
    } catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
};
RUTAS.acopios = async function verAcopios(mes) {
  mes = mes || hoy().slice(0, 7); await certs();
  const filas = await q(sb.from('acopio').select('*, productores(nombre)').eq('org_id', S.org.id).gte('fecha', mes + '-01').lt('fecha', sumarMeses(mes + '-01', 1)).order('fecha', { ascending: false }));
  const s = k => filas.reduce((t, x) => t + num(x[k]), 0);
  app().innerHTML = cabecera('Acopio') + `<div class="filtros"><input type="month" id="mes" value="${mes}"><a class="boton" href="#/acopio">+ Registrar entrega</a></div>
  <div class="tabla"><table><thead><tr><th>Número</th><th>Fecha</th><th>Productor</th><th>Café</th><th class="n">Peso (lb)</th><th class="n">Humedad</th><th class="n">Pergamino seco (lb)</th><th>Certificación</th><th class="n">Total</th></tr></thead><tbody>
  ${filas.map(x => `<tr><td>${esc(x.numero)}</td><td>${esc(x.fecha)}</td><td>${esc(x.productores?.nombre)}</td><td>${esc(x.estado_cafe)}</td><td class="n">${num(x.peso_lb).toLocaleString('es-HN')}</td><td class="n">${x.humedad ?? ''}</td><td class="n">${num(x.psec_lb).toLocaleString('es-HN')}</td><td>${esc(nombreCert(x.certificacion))}</td><td class="n">${x.total ? L(x.total) : ''}</td></tr>`).join('') || '<tr><td colspan="9" class="nota">Sin entregas en este mes.</td></tr>'}
  </tbody>${filas.length ? `<tfoot><tr><th colspan="6">Total del mes</th><th class="n">${s('psec_lb').toLocaleString('es-HN')} lb (${(s('psec_lb') / 100).toFixed(2)} qq)</th><th></th><th class="n">${L(s('total'))}</th></tr></tfoot>` : ''}</table></div>`;
  $('#mes').onchange = e => location.hash = '#/acopios/' + e.target.value;
};

async function disponibleCert(cert, anio) {
  const r = await q(sb.from('balance_masas').select('*').eq('org_id', S.org.id).eq('anio', anio).eq('certificacion', cert || 'Convencional'));
  return r[0] ? num(r[0].disponible_psec_lb) : 0;
}
RUTAS.despacho = async function formDespacho() {
  const cs = await certs(), anio = new Date().getFullYear();
  const desp = await q(sb.from('despachos').select('*').eq('org_id', S.org.id).order('fecha', { ascending: false }).limit(100));
  app().innerHTML = cabecera('Despacho y venta') + `<form class="caja" id="f"><div class="rejilla">
    <div><label>Fecha</label><input type="date" name="fecha" required value="${hoy()}"></div>
    <div><label>Contrato</label><input name="contrato"></div><div><label>Comprador</label><input name="comprador" required></div>
    <div><label>Certificación con la que se vende</label><select name="certificacion" id="cert"><option value="">Convencional</option>${cs.map(c => `<option value="${esc(c.codigo)}">${esc(c.nombre)}</option>`).join('')}</select></div>
    <div><label>Tipo de café</label><select name="tipo_cafe">${opciones(['Oro', 'Pergamino seco'])}</select></div>
    <div><label>Peso (libras)</label><input name="peso_lb" required inputmode="decimal"></div>
    <div><label>Precio (USD por libra)</label><input name="precio_usd_lb" inputmode="decimal"></div>
    <div><label>Lotes que salen</label><input name="lotes"></div>
    <div class="ancho"><label>GeoJSON de la venta para EUDR (opcional)</label><textarea name="geojson" rows="3"></textarea></div>
  </div><p class="nota" id="calc"></p><div class="acciones"><button>Registrar despacho</button></div></form>
  <h2>Despachos registrados</h2><div class="tabla"><table><thead><tr><th>Número</th><th>Fecha</th><th>Comprador</th><th>Certificación</th><th class="n">Peso (lb)</th><th class="n">Prima (USD)</th></tr></thead><tbody>
  ${desp.map(x => `<tr><td>${esc(x.numero)}</td><td>${esc(x.fecha)}</td><td>${esc(x.comprador)}</td><td>${esc(nombreCert(x.certificacion))}</td><td class="n">${num(x.peso_lb).toLocaleString('es-HN')} ${esc(x.tipo_cafe)}</td><td class="n">${num(x.prima_usd).toFixed(2)}</td></tr>`).join('') || '<tr><td colspan="6" class="nota">Sin despachos.</td></tr>'}</tbody></table></div>`;
  const f = $('#f'), calc = d => { const ps = d.tipo_cafe === 'Oro' ? num(d.peso_lb) / cfgN('RENDIMIENTO_PERGAMINO_ORO', 0.8) : num(d.peso_lb); const oro = d.tipo_cafe === 'Oro' ? num(d.peso_lb) : num(d.peso_lb) * cfgN('RENDIMIENTO_PERGAMINO_ORO', 0.8); return { ps: r2(ps), prima: d.certificacion === 'fairtrade' ? r2(oro * cfgN('PRIMA_FT_USD_LB', 0.2)) : 0 }; };
  f.oninput = async () => { const d = datosForm(f), c = calc(d); if (!num(d.peso_lb)) return $('#calc').textContent = ''; const disp = await disponibleCert(d.certificacion, +d.fecha.slice(0, 4) || anio); $('#calc').innerHTML = `Equivale a ${c.ps.toLocaleString('es-HN')} lb de pergamino seco · disponible en ${esc(nombreCert(d.certificacion))}: ${disp.toLocaleString('es-HN')} lb${c.ps > disp ? ' <b class="error">— no alcanza (sobreventa)</b>' : ''}${c.prima ? ` · prima de Comercio Justo: <b>USD ${c.prima.toFixed(2)}</b>` : ''}`; };
  f.onsubmit = async ev => {
    ev.preventDefault(); const d = datosForm(f), c = calc(d);
    let gj = null; if (d.geojson) { try { gj = JSON.parse(d.geojson); } catch (_) { return aviso('El GeoJSON no es válido.', true); } }
    const disp = await disponibleCert(d.certificacion, +d.fecha.slice(0, 4));
    if (d.certificacion && c.ps > disp + 0.5) return aviso(`No se puede vender más café ${nombreCert(d.certificacion)} del que se compró (disponible ${disp.toLocaleString('es-HN')} lb pergamino seco).`, true);
    ocupado(f, true);
    try { const r = await q(sb.from('despachos').insert({ org_id: S.org.id, fecha: d.fecha, contrato: d.contrato, comprador: d.comprador, certificacion: d.certificacion || null, tipo_cafe: d.tipo_cafe, peso_lb: num(d.peso_lb), psec_lb: c.ps, precio_usd_lb: d.precio_usd_lb ? num(d.precio_usd_lb) : null, prima_usd: c.prima, lotes: d.lotes, geojson: gj }).select('numero').single()); aviso('Despacho registrado: ' + r.numero); RUTAS.despacho(); }
    catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
};
RUTAS.balance = async function verBalance(anio) {
  anio = +(anio || new Date().getFullYear()); await certs();
  const filas = await q(sb.from('balance_masas').select('*').eq('org_id', S.org.id).eq('anio', anio));
  app().innerHTML = cabecera('Balance de masas ' + anio) + `<div class="filtros"><select id="anio">${[anio - 1, anio, anio + 1].map(a => `<option ${a === anio ? 'selected' : ''}>${a}</option>`).join('')}</select></div>
  <div class="tabla"><table><thead><tr><th>Certificación</th><th class="n">Comprado (lb pergamino seco)</th><th class="n">Vendido</th><th class="n">Disponible</th><th class="n">Disponible (qq)</th></tr></thead><tbody>
  ${filas.map(x => `<tr><td>${esc(nombreCert(x.certificacion === 'Convencional' ? null : x.certificacion))}</td><td class="n">${num(x.acopiado_psec_lb).toLocaleString('es-HN')}</td><td class="n">${num(x.vendido_psec_lb).toLocaleString('es-HN')}</td><td class="n ${num(x.disponible_psec_lb) < 0 ? 'error' : ''}">${num(x.disponible_psec_lb).toLocaleString('es-HN')}</td><td class="n">${(num(x.disponible_psec_lb) / 100).toFixed(2)}</td></tr>`).join('') || '<tr><td colspan="5" class="nota">Sin movimientos en este año.</td></tr>'}
  </tbody></table></div><p class="nota">Todo se lleva en pergamino seco: el café uva, húmedo y oro se convierte con los factores de Configuración. Un disponible negativo indica sobreventa.</p>`;
  $('#anio').onchange = e => location.hash = '#/balance/' + e.target.value;
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
  <div class="tabla"><table><thead><tr><th>Fecha</th><th>Concepto</th><th>Categoría</th><th>Acta</th><th class="n">Monto</th></tr></thead><tbody>${uso.map(x => `<tr><td>${esc(x.fecha)}</td><td>${esc(x.concepto)}</td><td>${esc(x.categoria)}</td><td>${esc(x.acta)}</td><td class="n">${usd(x.monto_usd)}</td></tr>`).join('') || '<tr><td colspan="5" class="nota">Sin gastos registrados.</td></tr>'}</tbody></table></div>`;
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
RUTAS.reg = async function registro(tabla) {
  const R = REGISTROS[tabla]; if (!R) return RUTAS.cer();
  const [filas, cs] = await Promise.all([q(sb.from(tabla).select('*').eq('org_id', S.org.id).order(R.orden, { ascending: false }).limit(300)), certs()]);
  const campo = ([k, t, tipo, req, ops]) => `<div class="${tipo === 'area' || tipo === 'certs' ? 'ancho' : ''}"><label>${t}</label>${tipo === 'area' ? `<textarea name="${k}"></textarea>` : tipo === 'certs' ? checksCert(cs, [], k) : tipo === 'sel' ? `<select name="${k}">${opciones(['', ...ops])}</select>` : `<input name="${k}" ${tipo === 'date' ? 'type="date"' : ''} ${['int', 'dec'].includes(tipo) ? 'inputmode="decimal"' : ''} ${req ? 'required' : ''}>`}</div>`;
  const etq = Object.fromEntries(R.campos.map(c => [c[0], c[1]]));
  app().innerHTML = cabecera(R.titulo) + `<form class="caja" id="f"><div class="rejilla">${R.campos.map(campo).join('')}</div><div class="acciones"><button>Registrar</button></div></form>
  <div class="tabla"><table><thead><tr>${R.cols.map(c => `<th>${esc(etq[c])}</th>`).join('')}</tr></thead><tbody>${filas.map(x => `<tr>${R.cols.map(c => `<td>${esc(x[c])}</td>`).join('')}</tr>`).join('') || `<tr><td colspan="${R.cols.length}" class="nota">Sin registros.</td></tr>`}</tbody></table></div>`;
  $('#f').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target, d = datosForm(f), reg = { org_id: S.org.id };
    R.campos.forEach(([k, , tipo]) => { reg[k] = tipo === 'certs' ? leerChecks(f, k) : ['int', 'dec'].includes(tipo) ? (d[k] ? num(d[k]) : (tipo === 'int' ? 0 : null)) : (d[k] || null); });
    if (tabla === 'beneficiado' && /río|quebrada/.test(reg.aguas_mieles || '')) aviso('Ojo: descargar aguas mieles a la quebrada o al río es una no conformidad grave.', true);
    if (tabla === 'beneficiado' && reg.humedad_final > cfgN('HUMEDAD_MAXIMA', 12)) aviso(`La humedad final pasa del ${cfgN('HUMEDAD_MAXIMA', 12)} %.`, true);
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
    try { await q(sb.from('quejas').insert({ org_id: S.org.id, tipo: d.tipo, descripcion: d.descripcion, anonima: an, nombre: an ? null : d.nombre, contacto: an ? null : d.contacto, urgente: URGENTES.includes(d.tipo) })); aviso('Gracias. La queja quedó registrada.'); location.hash = esJefe() ? '#/quejas' : '#/cer'; }
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
RUTAS.kobo = async function verKobo() {
  const enl = lista(S.cfg.KOBO_ENLACES).map(x => x.split('|').map(y => y.trim())).filter(x => x[1]);
  app().innerHTML = cabecera('Formularios de KoboToolbox') + `<div class="caja"><p class="nota">Se llenan desde el teléfono, sin cuenta y sin señal (Kobo los guarda y los envía al volver la conexión).</p>
  ${enl.length ? `<div class="tarjetas">${enl.map(([n, u]) => `<a class="tarjeta" href="${esc(/^https:\/\//.test(u) ? u : '#/kobo')}" target="_blank" rel="noopener"><b>${esc(n)}</b><span>${esc(u.replace(/^https:\/\//, ''))}</span></a>`).join('')}</div>` : '<p>Todavía no hay formularios configurados para esta organización.</p>'}
  ${esAdmin() ? '<p class="nota">Los enlaces se cambian en <a href="#/config">Configuración</a> (Formularios de Kobo).</p>' : ''}</div>`;
};
