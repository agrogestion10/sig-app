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
  INSUMOS_PROHIBIDOS: 'Insumos prohibidos para orgánico (uno por renglón)', INSUMOS_PERMITIDOS: 'Insumos permitidos (uno por renglón)',
  CORREO_AVISOS: 'Correo que recibe los avisos (separar varios con coma)', QUEJAS_CORREO: 'Correo del comité de quejas (si es distinto)'
});

const SEC = { cre: 'Crédito interno', cer: 'Certificaciones', adm: 'Administración' };
['credito', 'creditos', 'cred', 'cartera', 'condiciones'].forEach(r => SECCION_DE[r] = 'cre');
['padron', 'prod', 'prodf', 'parcela', 'inspeccion', 'inspecciones', 'nc', 'acopio', 'acopios', 'despacho', 'balance', 'prima', 'reg', 'quejas', 'queja', 'catalogo', 'kobo', 'eudr', 'insumos', 'lotes', 'lote'].forEach(r => SECCION_DE[r] = 'cer');
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
    ${!puedeSec('adm') && !puedeSec('cre') && !puedeSec('cer') ? '<div class="caja">Todavía no tenés secciones habilitadas. Pedile al administrador que te las active.</div>' : ''}
  </div>
  `;
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
const claseCre = e => ({ 'Solicitado': 'Pendiente', 'En evaluación': 'Pendiente', 'Aprobado': 'Autorizada', 'Desembolsado': 'Autorizada', 'Pagado': 'Anulada', 'Rechazado': 'Rechazada', 'Anulado': 'Anulada' }[e]);

RUTAS.cred = async function verCredito(id) {
  const c = await q(sb.from('creditos').select('*, productores(*)').eq('id', id).single());
  const pagos = esJefe() ? await q(sb.from('pagos_credito').select('*').eq('credito_id', id).order('fecha')) : [];
  const p = c.productores, ev = c.evaluacion || {}, est = c.estado === 'Desembolsado' || c.estado === 'Pagado' ? estadoCredito(c, pagos) : null;
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
  </div>${notaDecision ? `<p class="nota">${notaDecision}</p>` : ''}
  <div class="acciones">${porComite ? '' : '<button name="d" value="Aprobado">Aprobar</button>'}<button class="rojo" name="d" value="Rechazado">Rechazar</button></div></form>`;
  if (porComite || votos.length) acc += `<h2>Comité de crédito</h2><div class="caja"><p class="nota">${aFavor} a favor y ${enContra} en contra, de ${com.miembros} miembro${com.miembros === 1 ? '' : 's'}. Se aprueba con ${minimo} voto${minimo > 1 ? 's' : ''} a favor; el monto aprobado es el menor que propusieron quienes votaron a favor.</p>
    ${votos.length ? `<div class="tabla"><table><thead><tr><th>Miembro</th><th>Voto</th><th class="n">Monto que propone</th><th>Comentario</th><th>Fecha</th></tr></thead><tbody>${votos.map(v => `<tr><td>${esc(v.nombre)}</td><td>${estadoChip(v.voto, v.voto === 'A favor' ? 'Autorizada' : 'Rechazada')}</td><td class="n">${v.monto ? L(v.monto) : ''}</td><td>${esc(v.comentario)}</td><td>${fechaHora(v.fecha)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="nota">Todavía nadie ha votado.</p>'}
    ${abierto && porComite && com.soy && !votos.some(v => v.user_id === S.user.id) ? `<form id="fVoto" style="margin-top:12px"><div class="rejilla"><div><label>Tu voto</label><select name="voto"><option>A favor</option><option>En contra</option></select></div><div><label>Monto que aprobás (L)</label><input name="monto" inputmode="decimal" value="${montoRef}"></div><div class="ancho"><label>Comentario</label><input name="comentario"></div></div><div class="acciones"><button>Votar</button></div></form>` : ''}
    ${abierto && porComite && !com.soy ? '<p class="nota">Votan solo los miembros del comité (el administrador los marca en Usuarios).</p>' : ''}</div>`;
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
    ${tarjeta('#/reg/capacitaciones', 'Capacitaciones', 'Temas, asistencia y acuerdos')}
    ${tarjeta('#/quejas', 'Quejas y reclamos', 'Buzón, también anónimo', qj)}
  </div>
  <h2>Trazabilidad</h2><div class="tarjetas">
    ${tarjeta('#/acopio', 'Registrar acopio', 'Entrega de cada socio')}
    ${tarjeta('#/acopios', 'Acopio', 'Entregas registradas')}
    ${tarjeta('#/reg/beneficiado', 'Beneficiado y secado', 'Proceso de cada lote')}
    ${tarjeta('#/despacho', 'Despacho y venta', 'Contratos y lotes vendidos')}
    ${tarjeta('#/lotes', 'Trazabilidad por lote', 'De qué fincas salió cada lote y a quién se vendió')}
    ${tarjeta('#/balance', 'Balance de masas', 'Comprado contra vendido por certificación')}
    ${tarjeta('#/prima', 'Prima de Comercio Justo', 'Generada, usada y disponible')}
  </div>
  <h2>Formularios de campo</h2><div class="tarjetas">${tarjeta('#/kobo', 'Formularios de KoboToolbox', 'Para llenar en el campo, con o sin señal')}${esAdmin() ? tarjeta('#/catalogo', 'Catálogo de certificaciones', 'Activar o desactivar') : ''}</div>
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
  <div class="tabla"><table><thead><tr><th>Parcela</th><th class="n">Área (ha)</th><th>Variedad</th><th class="n">Altitud</th><th>Ubicación</th><th>Polígono</th><th class="n">Estimado (qq)</th><th>Orgánico</th><th></th></tr></thead><tbody>
  ${parc.map(x => `<tr><td>${esc(x.nombre)}</td><td class="n">${num(x.area_ha).toFixed(2)}</td><td>${esc(x.variedad)}</td><td class="n">${x.altitud ?? ''}</td><td>${x.lat ? `${num(x.lat).toFixed(5)}, ${num(x.lon).toFixed(5)}` : '<span class="error">Sin punto</span>'}</td><td>${x.poligono ? 'Sí' : num(x.area_ha) >= 4 ? '<span class="error">Falta (4 ha o más)</span>' : 'No requerido'}</td><td class="n">${estimadoParcela(x) ? estimadoParcela(x).toLocaleString('es-HN') : ''}</td><td>${chipOrg(estadoOrganico(x))}</td><td><a href="#/parcela/${x.id}">Editar</a></td></tr>`).join('') || '<tr><td colspan="9" class="nota">Sin parcelas.</td></tr>'}
  </tbody></table></div>
  <p class="nota" id="estProd"></p>
  <div id="insProd"></div>
  <h2>Inspecciones</h2><div class="tabla"><table><thead><tr><th>Fecha</th><th>Inspector</th><th>Certificaciones</th><th>Resultado</th><th>Observaciones</th></tr></thead><tbody>
  ${insp.map(x => `<tr><td>${esc(x.fecha)}</td><td>${esc(x.inspector)}</td><td>${x.certificaciones.map(nombreCert).map(esc).join(', ')}</td><td>${esc(x.resultado)}</td><td>${esc(x.observaciones)}</td></tr>`).join('') || '<tr><td colspan="5" class="nota">Sin inspecciones.</td></tr>'}</tbody></table></div>
  ${nc.length ? `<h2>No conformidades</h2><div class="tabla"><table><thead><tr><th>Requisito</th><th>Hallazgo</th><th>Acción</th><th>Plazo</th><th>Estado</th></tr></thead><tbody>${nc.map(x => `<tr><td>${esc(x.requisito)}</td><td>${esc(x.descripcion)}</td><td>${esc(x.accion)}</td><td>${esc(x.plazo)}</td><td>${estadoChip(x.estado, x.estado === 'Abierta' ? 'Pendiente' : 'Autorizada')}</td></tr>`).join('')}</tbody></table></div>` : ''}
  <h2>Acopio ${anio}: ${(aco.reduce((t, x) => t + num(x.psec_lb), 0) / 100).toFixed(2)} qq pergamino seco</h2>
  ${aco.length ? `<div class="tabla"><table><thead><tr><th>Número</th><th>Fecha</th><th>Café</th><th class="n">Peso (lb)</th><th>Certificación</th></tr></thead><tbody>${aco.map(x => `<tr><td>${esc(x.numero)}</td><td>${esc(x.fecha)}</td><td>${esc(x.estado_cafe)}</td><td class="n">${num(x.peso_lb).toLocaleString('es-HN')}</td><td>${esc(nombreCert(x.certificacion))}</td></tr>`).join('')}</tbody></table></div>` : ''}
  ${cre.length ? `<h2>Créditos</h2><div class="tabla"><table><thead><tr><th>Número</th><th class="n">Monto</th><th>Estado</th></tr></thead><tbody>${cre.map(x => `<tr><td><a href="#/cred/${x.id}">${esc(x.numero)}</a></td><td class="n">${L(x.monto_aprobado || x.monto_solicitado)}</td><td>${esc(x.estado)}</td></tr>`).join('')}</tbody></table></div>` : ''}`;
  if ($('#mapa')) dibujarMapa($('#mapa'), parc);
  estimadoProductor(id).then(e => { const el = $('#estProd'); if (el) el.innerHTML = e.est ? `Cosecha actual (desde ${inicioCosecha()}): entregado <b>${qqTxt(e.ent)}</b> de un estimado de <b>${qqTxt(e.est)}</b>${e.ent > e.tope ? ' · <span class="error">pasa el estimado más la tolerancia</span>' : ''}.` : 'Sin estimado de cosecha: se pone en cada parcela.'; }).catch(() => {});
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
    <div><label>Estimado de cosecha (qq pergamino seco)</label><input name="estimado_qq" inputmode="decimal" value="${esc(p.datos?.estimado_qq ?? '')}"></div>
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
  ${filas.map(x => { const venc = x.estado === 'Abierta' && x.plazo && x.plazo < hoy(); return `<tr><td><b>${esc(x.numero || '')}</b><br><a href="#/prod/${x.productor_id}">${esc(x.productores?.nombre)}</a></td><td>${esc(x.requisito)}${x.gravedad ? '<br><span class="nota">' + esc(x.gravedad) + '</span>' : ''}</td><td>${esc(x.descripcion)}</td><td>${esc(x.accion)}</td><td class="${venc ? 'error' : ''}">${esc(x.plazo || '')}${venc ? ' (vencido)' : ''}</td><td>${estadoChip(x.estado, x.estado === 'Abierta' ? 'Pendiente' : 'Autorizada')}${x.cerrada ? '<br><span class="nota">' + esc(x.cerrada) + ' · ' + esc(x.verificacion) + '</span>' : ''}</td><td>${esJefe() && x.estado === 'Abierta' ? `<button class="sec" data-cerrar="${x.id}">Cerrar</button>` : ''}</td></tr>`; }).join('') || '<tr><td colspan="7" class="nota">Sin no conformidades.</td></tr>'}</tbody></table></div>`;
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
  </div><p class="nota" id="calc"></p><p class="nota" id="estim"></p><div class="acciones"><button>Registrar entrega</button></div></form>`;
  const f = $('#f');
  const opc = () => { const p = leerProd(ps, f.productor_txt.value), v = f.certificacion.value; f.certificacion.innerHTML = '<option value="">Convencional</option>' + (p?.certificaciones || []).map(c => `<option value="${esc(c)}">${esc(nombreCert(c))}</option>`).join(''); if (p?.certificaciones.includes(v)) f.certificacion.value = v; };
  const verEstim = async () => { const p = leerProd(ps, f.productor_txt.value); if (!p) { $('#estim').textContent = ''; return; } const e = await estimadoProductor(p.id); $('#estim').innerHTML = e.est ? `Esta cosecha ha entregado <b>${qqTxt(e.ent)}</b> de un estimado de <b>${qqTxt(e.est)}</b> (puede llegar a ${qqTxt(e.tope)} con la tolerancia del ${e.tol} %).` : 'Este productor no tiene estimado de cosecha en sus parcelas.'; };
  f.productor_txt.oninput = () => { opc(); verEstim(); }; opc(); verEstim();
  f.oninput = () => { const d = datosForm(f), ps = aPergaminoSeco(d.estado_cafe, d.peso_lb), hm = cfgN('HUMEDAD_MAXIMA', 12); $('#calc').innerHTML = num(d.peso_lb) ? `Equivale a <b>${ps.toLocaleString('es-HN')} lb (${(ps / 100).toFixed(2)} qq)</b> de pergamino seco${num(d.precio_lb) ? ` · total a pagar <b>${L(num(d.peso_lb) * num(d.precio_lb))}</b>` : ''}${['Pergamino seco', 'Oro'].includes(d.estado_cafe) && num(d.humedad) > hm ? ` · <span class="error">humedad arriba del ${hm} %</span>` : ''}` : ''; };
  f.onsubmit = async ev => {
    ev.preventDefault(); const d = datosForm(f), p = leerProd(ps, d.productor_txt);
    if (!p) return aviso('Elegí un productor de la lista.', true);
    if (d.certificacion && !p.certificaciones.includes(d.certificacion)) return aviso('Ese productor no está en esa certificación.', true);
    if (d.certificacion && p.estado_cert === 'No aprobado') return aviso('El productor no aprobó la inspección interna: su café entra como convencional.', true);
    if (num(d.peso_lb) <= 0) return aviso('Poné el peso.', true);
    const e = await estimadoProductor(p.id), nuevo = aPergaminoSeco(d.estado_cafe, d.peso_lb) / 100;
    if (e.est > 0 && e.ent + nuevo > e.tope) {
      const motivo = prompt(`Con esta entrega ${p.nombre} llega a ${qqTxt(e.ent + nuevo)} y su estimado de cosecha es ${qqTxt(e.est)} (con la tolerancia del ${e.tol} %, hasta ${qqTxt(e.tope)}). Puede ser café de otra finca. Escribí el motivo para registrarla de todos modos:`);
      if (!motivo) return aviso('No se registró la entrega.', true);
      d.observaciones = [d.observaciones, 'Pasa el estimado de cosecha: ' + motivo].filter(Boolean).join(' · ');
    }
    if (esOrganica(d.certificacion) && e.parc.length) {
      const eo = e.parc.map(estadoOrganico), orgs = eo.filter(x => x.ok).length;
      if (!orgs && !eo.some(x => x.ok === null)) return aviso('Ninguna parcela de este productor ha terminado la transición orgánica: su café no se puede recibir como orgánico.', true);
      if (orgs < eo.length && !confirm(`${eo.length - orgs} de las ${eo.length} parcelas de este productor no están confirmadas como orgánicas (en transición o sin dato). ¿Registrar la entrega como ${nombreCert(d.certificacion)} de todos modos?`)) return;
    }
    ocupado(f, true);
    try {
      const r = await q(sb.from('acopio').insert({ org_id: S.org.id, productor_id: p.id, fecha: d.fecha, certificacion: d.certificacion || null, certificaciones: d.certificacion ? [d.certificacion] : [], estado_cafe: d.estado_cafe, peso_lb: num(d.peso_lb), humedad: d.humedad ? num(d.humedad) : null, precio_lb: d.precio_lb ? num(d.precio_lb) : null, total: d.precio_lb ? r2(num(d.peso_lb) * num(d.precio_lb)) : null, psec_lb: aPergaminoSeco(d.estado_cafe, d.peso_lb), lote: d.lote, observaciones: d.observaciones }).select('numero').single());
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
  ${filas.map(x => `<tr><td>${esc(x.numero)}</td><td>${esc(x.fecha)}</td><td>${esc(x.productores?.nombre)}</td><td>${esc(x.estado_cafe)}</td><td class="n">${num(x.peso_lb).toLocaleString('es-HN')}</td><td class="n">${x.humedad ?? ''}</td><td class="n">${num(x.psec_lb).toLocaleString('es-HN')}</td><td>${esc(nombreCert(x.certificacion))}${x.lote ? `<br><a class="nota" href="#/lote/${encodeURIComponent(x.lote)}">Lote ${esc(x.lote)}</a>` : ''}</td><td class="n">${x.total ? L(x.total) : ''}</td></tr>`).join('') || '<tr><td colspan="9" class="nota">Sin entregas en este mes.</td></tr>'}
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
  <h2>Despachos registrados</h2><div class="tabla"><table><thead><tr><th>Número</th><th>Fecha</th><th>Comprador</th><th>Certificación</th><th class="n">Peso (lb)</th><th class="n">Prima (USD)</th><th>EUDR</th></tr></thead><tbody>
  ${desp.map(x => `<tr><td>${esc(x.numero)}</td><td>${esc(x.fecha)}</td><td>${esc(x.comprador)}</td><td>${esc(nombreCert(x.certificacion))}</td><td class="n">${num(x.peso_lb).toLocaleString('es-HN')} ${esc(x.tipo_cafe)}</td><td class="n">${num(x.prima_usd).toFixed(2)}</td><td><a href="#/eudr/${x.id}">${x.dds_numero ? 'Declarado' : 'Revisar'}</a></td></tr>`).join('') || '<tr><td colspan="7" class="nota">Sin despachos.</td></tr>'}</tbody></table></div>`;
  const f = $('#f'), calc = d => { const ps = d.tipo_cafe === 'Oro' ? num(d.peso_lb) / cfgN('RENDIMIENTO_PERGAMINO_ORO', 0.8) : num(d.peso_lb); const oro = d.tipo_cafe === 'Oro' ? num(d.peso_lb) : num(d.peso_lb) * cfgN('RENDIMIENTO_PERGAMINO_ORO', 0.8); return { ps: r2(ps), prima: d.certificacion === 'fairtrade' ? r2(oro * cfgN('PRIMA_FT_USD_LB', 0.2)) : 0 }; };
  f.oninput = async () => { const d = datosForm(f), c = calc(d); if (!num(d.peso_lb)) return $('#calc').textContent = ''; const disp = await disponibleCert(d.certificacion, +d.fecha.slice(0, 4) || anio); $('#calc').innerHTML = `Equivale a ${c.ps.toLocaleString('es-HN')} lb de pergamino seco · disponible en ${esc(nombreCert(d.certificacion))}: ${disp.toLocaleString('es-HN')} lb${c.ps > disp ? ' <b class="error">— no alcanza (sobreventa)</b>' : ''}${c.prima ? ` · prima de Comercio Justo: <b>USD ${c.prima.toFixed(2)}</b>` : ''}`; };
  f.onsubmit = async ev => {
    ev.preventDefault(); const d = datosForm(f), c = calc(d);
    let gj = null; if (d.geojson) { try { gj = JSON.parse(d.geojson); } catch (_) { return aviso('El GeoJSON no es válido.', true); } }
    const disp = await disponibleCert(d.certificacion, +d.fecha.slice(0, 4));
    if (d.certificacion && c.ps > disp + 0.5) return aviso(`No se puede vender más café ${nombreCert(d.certificacion)} del que se compró (disponible ${disp.toLocaleString('es-HN')} lb pergamino seco).`, true);
    ocupado(f, true);
    try { const r = await q(sb.from('despachos').insert({ org_id: S.org.id, fecha: d.fecha, contrato: d.contrato, comprador: d.comprador, certificacion: d.certificacion || null, certificaciones: d.certificacion ? [d.certificacion] : [], tipo_cafe: d.tipo_cafe, peso_lb: num(d.peso_lb), psec_lb: c.ps, precio_usd_lb: d.precio_usd_lb ? num(d.precio_usd_lb) : null, prima_usd: c.prima, lotes: d.lotes, geojson: gj }).select('numero').single()); aviso('Despacho registrado: ' + r.numero); RUTAS.despacho(); }
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
  ${esAdmin() ? '<p class="nota">Los enlaces, los códigos de los formularios y la clave de Kobo se cambian en <a href="#/config">Configuración</a>.</p>' : ''}</div>${tabla}`;
  sincronizarKobo(false);
};

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
    ${datoP('Capacitaciones ' + anio, cap.length, (sumaP(cap, 'hombres') + sumaP(cap, 'mujeres')) + ' participantes (' + sumaP(cap, 'mujeres') + ' mujeres)', '#/reg/capacitaciones')}
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
  const [parc, aco] = await Promise.all([q(sb.from('parcelas').select('nombre,datos').eq('productor_id', id)), q(sb.from('acopio').select('psec_lb').eq('productor_id', id).gte('fecha', inicioCosecha()))]);
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
  const [insRev] = await Promise.all([q(sb.from('insumos_aplicados').select('fecha,producto,productor_id,parcela_nombre').eq('org_id', S.org.id).eq('estado', 'Revisar').gte('fecha', desde).order('fecha', { ascending: false }))]);
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
      conflictos.map(c => `<tr><td>${esc(c.i.fecha)}</td><td>${esc(c.i.inspector)}</td><td>${quien(c.p.id)}</td><td>${esc(c.motivo)}</td></tr>`).join(''))
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
  <h2>Últimas aplicaciones</h2><div class="tabla"><table><thead><tr><th>Fecha</th><th>Productor</th><th>Parcela</th><th>Producto</th><th>Tipo</th><th class="n">Cantidad</th><th>Revisión</th></tr></thead><tbody>
  ${filas.map(x => `<tr><td>${esc(x.fecha)}</td><td><a href="#/prod/${x.productor_id}">${esc(x.productores?.codigo || '')} ${esc(x.productores?.nombre || '')}</a></td><td>${esc(x.parcela_nombre || 'Toda la finca')}</td><td>${esc(x.producto)}</td><td>${esc(x.tipo)}</td><td class="n">${x.cantidad ? num(x.cantidad).toLocaleString('es-HN') + ' ' + esc(x.unidad || '') : ''}</td><td>${chipInsumo(x.estado)}</td></tr>`).join('') || '<tr><td colspan="7" class="nota">Todavía no hay aplicaciones registradas.</td></tr>'}</tbody></table></div>`;
  const f = $('#f');
  const cargarParc = async () => {
    const p = leerProd(ps, f.productor_txt.value); f.parcela_id.innerHTML = '<option value="">Toda la finca</option>';
    if (!p) return;
    const pa = await q(sb.from('parcelas').select('id,nombre').eq('productor_id', p.id).order('nombre'));
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
      const r = await q(sb.from('insumos_aplicados').insert({ org_id: S.org.id, productor_id: p.id, parcela_id: d.parcela_id || null, fecha: d.fecha, producto: d.producto, tipo: d.tipo, cantidad: d.cantidad ? num(d.cantidad) : null, unidad: d.unidad, observaciones: d.observaciones || null }).select('estado').single());
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
    <dt>Café acopiado</dt><dd>${qqTxt(total)} de pergamino seco · ${aco.length} entregas de ${ids.length} productores</dd>
    <dt>Certificaciones</dt><dd>${[...new Set(aco.flatMap(a => a.certificaciones?.length ? a.certificaciones : [a.certificacion]).filter(Boolean))].map(nombreCert).map(esc).join(', ') || 'Convencional'}</dd>
    <dt>Fincas</dt><dd>${parc.length} parcelas · EUDR: ${malas ? `<span class="error">${malas} no cumplen</span>` : 'todas cumplen o están por revisar'} · orgánico: ${trans ? `<span class="error">${trans} en transición</span>` : 'sin parcelas en transición'}</dd>
    <dt>Vendido en</dt><dd>${des.map(x => `<a href="#/eudr/${x.id}">${esc(x.numero)}</a> (${esc(x.fecha)}, ${esc(x.comprador)})`).join(' · ') || 'Todavía no se ha despachado'}</dd></dl>
    <div class="acciones"><button class="sec" onclick="print()">Imprimir hoja del lote</button></div></div>
  <h2>1. Productores y entregas</h2><div class="tabla"><table><thead><tr><th>Productor</th><th>Comunidad</th><th class="n">Entregas</th><th class="n">Pergamino seco</th></tr></thead><tbody>
  ${Object.values(porProd).map(x => `<tr><td><a href="#/prod/${x.p?.id}">${esc(x.p?.codigo || '')} ${esc(x.p?.nombre || '')}</a></td><td>${esc(x.p?.comunidad || '')}</td><td class="n">${x.n}</td><td class="n">${qqTxt(x.qq)}</td></tr>`).join('') || '<tr><td colspan="4" class="nota">No hay acopios con este lote.</td></tr>'}</tbody></table></div>
  <div class="tabla" style="margin-top:8px"><table><thead><tr><th>Recibo</th><th>Fecha</th><th>Productor</th><th>Café</th><th class="n">Peso (lb)</th><th class="n">Humedad</th><th>Certificación</th></tr></thead><tbody>
  ${aco.map(a => `<tr><td>${esc(a.numero)}</td><td>${esc(a.fecha)}</td><td>${esc(a.productores?.nombre || '')}</td><td>${esc(a.estado_cafe)}</td><td class="n">${num(a.peso_lb).toLocaleString('es-HN')}</td><td class="n">${a.humedad ?? ''}</td><td>${esc(nombreCert(a.certificacion))}</td></tr>`).join('')}</tbody></table></div>
  <h2>2. Beneficiado y secado</h2><div class="tabla"><table><thead><tr><th>Inicio</th><th>Fin</th><th>Método</th><th class="n">Entrada (lb)</th><th class="n">Salida (lb)</th><th class="n">Humedad final</th></tr></thead><tbody>
  ${ben.map(b => `<tr><td>${esc(b.fecha_inicio || '')}</td><td>${esc(b.fecha_fin || '')}</td><td>${esc(b.metodo || '')}</td><td class="n">${b.peso_entrada_lb ? num(b.peso_entrada_lb).toLocaleString('es-HN') : ''}</td><td class="n">${b.peso_salida_lb ? num(b.peso_salida_lb).toLocaleString('es-HN') : ''}</td><td class="n">${b.humedad_final ?? ''}</td></tr>`).join('') || '<tr><td colspan="6" class="nota">Sin registro de beneficiado para este lote.</td></tr>'}</tbody></table></div>
  <h2>3. Despacho y venta</h2><div class="tabla"><table><thead><tr><th>Despacho</th><th>Fecha</th><th>Comprador</th><th>Contrato</th><th>Certificación</th><th>EUDR</th></tr></thead><tbody>
  ${des.map(x => `<tr><td>${esc(x.numero)}</td><td>${esc(x.fecha)}</td><td>${esc(x.comprador)}</td><td>${esc(x.contrato || '')}</td><td>${esc(nombreCert(x.certificacion))}</td><td><a href="#/eudr/${x.id}">${x.dds_numero ? 'Declarado: ' + esc(x.dds_numero) : 'Revisar'}</a></td></tr>`).join('') || '<tr><td colspan="6" class="nota">Este lote todavía no sale.</td></tr>'}</tbody></table></div>`;
};
