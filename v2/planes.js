// SIG · Planes, prueba gratis, registro abierto, solo lectura al vencer y clientes del usuario maestro

const ESTADO_PLAN = { prueba: ['Prueba', 'Pendiente'], activa: ['Activa', 'Autorizada'], suspendida: ['Apagada', 'Anulada'] };
const QUE_CARGA = ['Productores', 'Parcelas y polígonos', 'Acopio anterior', 'Inspecciones', 'Insumos', 'Documentos', 'Otro'];
const hoyHN = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Tegucigalpa' });
const diasHasta = f => f ? Math.round((new Date(f + 'T00:00:00') - new Date(hoyHN() + 'T00:00:00')) / 86400000) : null;
const usd = n => '$' + Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
const fechaCorta = f => f ? new Date(f + 'T12:00:00').toLocaleDateString('es-HN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
// Dentro de la app de Android (Play Store) no se muestran precios ni formas de pago: la compra se hace en la web
const enAppAndroid = () => { try { if (document.referrer.startsWith('android-app://')) sessionStorage.setItem('sig_twa', '1'); return sessionStorage.getItem('sig_twa') === '1'; } catch (_) { return false; } };

async function cargarPlan() {
  if (!S.org || S.sinSenal) return;
  try { const { data } = await sb.rpc('plan_org', { o: S.org.id }); S.plan = (data || [])[0] || null; } catch (_) { S.plan = null; }
  pintarAvisoPlan();
}
function pintarAvisoPlan() {
  let d = document.getElementById('avisoPlan');
  if (!d) { d = document.createElement('div'); d.id = 'avisoPlan'; d.className = 'avisoPlan'; document.getElementById('app').before(d); }
  const p = S.plan; d.hidden = true; d.className = 'avisoPlan';
  if (!p || !S.user) return;
  const n = diasHasta(p.vence), ver = `<a href="#/plan">${esAdmin() ? 'Ver mi plan' : 'Más información'}</a>`;
  let t = '';
  if (!p.escribe) { t = `<b>Solo lectura.</b> ${p.estado === 'suspendida' ? 'El plan de esta organización está apagado.' : 'El plan de esta organización venció el ' + fechaCorta(p.vence) + '.'} Se puede ver y descargar todo, pero no registrar. ${ver}`; d.classList.add('mal'); }
  else if (p.estado === 'prueba') t = `<b>Prueba gratis:</b> ${n > 1 ? 'te quedan ' + n + ' días' : n === 1 ? 'te queda 1 día' : 'vence hoy'}. ${ver}`;
  else if (n !== null && n <= 15) t = `Tu plan ${p.nombre} vence ${n > 1 ? 'en ' + n + ' días' : n === 1 ? 'mañana' : 'hoy'}. ${ver}`;
  if (t) { d.innerHTML = t; d.hidden = false; }
}

// ---------- Mi plan (todos lo ven; el administrador avisa pagos y pide cargas) ----------
RUTAS.plan = async function verMiPlan(ir) {
  const [planes, uso, pagos, pedidos] = await Promise.all([
    q(sb.from('planes').select('*').eq('activo', true).order('orden')),
    sb.rpc('uso_org', { o: S.org.id }).then(r => (r.data || [])[0] || {}),
    esAdmin() ? q(sb.from('pagos_plan').select('*').eq('org_id', S.org.id).order('creado', { ascending: false }).limit(10)) : [],
    q(sb.from('pedidos_carga').select('*').eq('org_id', S.org.id).order('creado', { ascending: false }).limit(10))
  ]);
  await cargarPlan();
  const p = S.plan || {}, android = enAppAndroid(), pagables = planes.filter(x => x.codigo !== 'prueba');
  const lim = v => v == null ? 'sin límite' : Number(v).toLocaleString('es-HN');
  const barra = (usado, max, unidad = '') => {
    const pct = max ? Math.min(100, Math.round(usado / max * 100)) : 0;
    return `<div class="usoBarra"><span style="width:${pct}%" class="${pct >= 90 ? 'lleno' : ''}"></span></div><span class="nota">${Number(usado || 0).toLocaleString('es-HN')}${unidad} de ${max == null ? 'sin límite' : Number(max).toLocaleString('es-HN') + unidad}</span>`;
  };
  const [estT, estC] = ESTADO_PLAN[p.estado] || [p.estado || '—', ''];
  app().innerHTML = cabecera('Mi plan', '#/') + `
  <div class="caja">
    <h2 style="margin-top:0">${esc(p.nombre || '—')} ${estadoChip(p.escribe === false ? 'Solo lectura' : estT, p.escribe === false ? 'Rechazada' : estC)}</h2>
    <p>${p.vence ? (p.estado === 'prueba' ? 'La prueba gratis termina el ' : 'Pagado hasta el ') + '<b>' + fechaCorta(p.vence) + '</b>' + (diasHasta(p.vence) >= 0 ? ' (' + diasHasta(p.vence) + ' días)' : '') : 'Sin fecha de vencimiento.'}</p>
    <div class="rejilla">
      <div><label>Productores activos</label>${barra(uso.productores, p.max_productores)}</div>
      <div><label>Usuarios activos</label>${barra(uso.usuarios, p.max_usuarios)}</div>
      <div><label>Espacio de adjuntos</label>${barra(uso.mb, p.max_mb, ' MB')}</div>
    </div>
    <p class="nota">Kobo: ${p.kobo ? 'incluido' : 'no incluido'} · Revisión satelital EUDR: ${p.satelite ? 'incluida' : 'no incluida'}</p>
  </div>
  ${android ? '<div class="caja"><p>Para cambiar o renovar tu plan, entrá desde el navegador a <b>app.agrogestionhn.com</b>.</p></div>' : `
  <h2>Planes</h2>
  <div class="tabla"><table><thead><tr><th></th>${pagables.map(x => `<th>${esc(x.nombre)}${x.codigo === p.plan ? ' <span class="estado e-Autorizada">el tuyo</span>' : ''}</th>`).join('')}</tr></thead><tbody>
    <tr><td>Al año</td>${pagables.map(x => `<td><b>${usd(x.precio_anio)}</b></td>`).join('')}</tr>
    <tr><td>Al mes</td>${pagables.map(x => `<td>${usd(x.precio_mes)}</td>`).join('')}</tr>
    <tr><td>Productores</td>${pagables.map(x => `<td>${lim(x.max_productores)}</td>`).join('')}</tr>
    <tr><td>Usuarios</td>${pagables.map(x => `<td>${lim(x.max_usuarios)}</td>`).join('')}</tr>
    <tr><td>Adjuntos</td>${pagables.map(x => `<td>${x.max_mb >= 1024 ? Math.round(x.max_mb / 1024) + ' GB' : x.max_mb + ' MB'}</td>`).join('')}</tr>
    <tr><td>Kobo</td>${pagables.map(x => `<td>${x.kobo ? 'Sí' : 'No'}</td>`).join('')}</tr>
    <tr><td>Revisión satelital EUDR</td>${pagables.map(x => `<td>${x.satelite ? 'Sí' : 'No'}</td>`).join('')}</tr>
    <tr><td>Ayuda</td>${pagables.map(x => `<td>${esc(x.ayuda || '')}</td>`).join('')}</tr>
  </tbody></table></div>
  <p class="nota">Precios en dólares, sin ISV. El arranque (alta, carga de tus datos desde Excel, configuración de certificaciones y capacitación) se cobra una sola vez: $1,000.</p>
  <h2>Cómo pagar</h2>
  <div class="caja"><p style="white-space:pre-line">${esc(S.leyes.PAGO_INSTRUCCIONES || 'Pedí los datos para la transferencia a AgroGestión.')}</p>
  ${esAdmin() ? `<p class="nota">Cuando hayás pagado, avisá aquí abajo con el comprobante. AgroGestión revisa el pago y enciende el plan.</p>
  <form id="fPago"><div class="rejilla">
    <div><label>Plan</label><select name="plan" required>${pagables.map(x => `<option value="${x.codigo}" ${x.codigo === (p.plan === 'prueba' ? 'profesional' : p.plan) ? 'selected' : ''}>${esc(x.nombre)}</option>`).join('')}</select></div>
    <div><label>Período</label><select name="periodo"><option value="anio">Un año</option><option value="mes">Un mes</option></select></div>
    <div><label>Monto</label><input name="monto" readonly></div>
    <div><label>Número de transferencia o depósito</label><input name="referencia" required></div>
    <div class="ancho"><label>Comprobante (foto o PDF)</label><input name="archivo" type="file" accept="image/*,.pdf" required></div>
  </div><div class="acciones"><button>Avisar que pagué</button></div></form>` : '<p class="nota">El administrador de tu organización es quien avisa los pagos.</p>'}</div>`}
  ${pagos.length ? `<h3>Pagos avisados</h3><div class="tabla"><table><thead><tr><th>Fecha</th><th>Plan</th><th>Monto</th><th>Referencia</th><th>Estado</th></tr></thead><tbody>${pagos.map(g => `<tr><td>${fechaHora(g.creado)}</td><td>${esc((planes.find(x => x.codigo === g.plan) || {}).nombre || g.plan)} · ${g.periodo === 'anio' ? 'año' : 'mes'}</td><td>${usd(g.monto)}</td><td>${esc(g.referencia)}</td><td>${estadoChip(g.estado === 'Aprobado' ? 'Aprobado' : g.estado, g.estado === 'Aprobado' ? 'Autorizada' : g.estado === 'Rechazado' ? 'Rechazada' : 'Pendiente')}${g.comentario ? '<br><span class="nota">' + esc(g.comentario) + '</span>' : ''}</td></tr>`).join('')}</tbody></table></div>` : ''}
  <h2 id="carga">Pedir carga de datos</h2>
  <div class="caja"><p class="nota">Si tenés tus productores, parcelas u otros datos en Excel, mandalos aquí y AgroGestión los carga por vos.</p>
  <form id="fCarga"><div class="rejilla">
    <div><label>¿Qué datos son?</label><select name="que">${QUE_CARGA.map(x => `<option>${x}</option>`).join('')}</select></div>
    <div class="ancho"><label>Archivo (Excel, CSV, KML o ZIP)</label><input name="archivo" type="file" required></div>
    <div class="ancho"><label>Nota</label><textarea name="nota" rows="2" placeholder="Algo que debamos saber del archivo"></textarea></div>
  </div><div class="acciones"><button>Mandar archivo</button></div></form>
  ${pedidos.length ? `<div class="tabla"><table><thead><tr><th>Fecha</th><th>Datos</th><th>Estado</th></tr></thead><tbody>${pedidos.map(g => `<tr><td>${fechaHora(g.creado)}</td><td>${esc(g.que)}</td><td>${estadoChip(g.estado, g.estado === 'Cargado' ? 'Autorizada' : g.estado === 'Rechazado' ? 'Rechazada' : 'Pendiente')}${g.comentario ? '<br><span class="nota">' + esc(g.comentario) + '</span>' : ''}</td></tr>`).join('')}</tbody></table></div>` : ''}</div>`;

  const subir = async (carpeta, archivo) => {
    const ruta = `${S.org.id}/${carpeta}/${Date.now()}-${archivo.name.replace(/[^\w.\-]+/g, '_')}`;
    const { error } = await sb.storage.from('documentos').upload(ruta, archivo, { contentType: archivo.type || undefined });
    if (error) throw error; return ruta;
  };
  const fp = $('#fPago');
  if (fp) {
    const monto = () => { const x = pagables.find(y => y.codigo === fp.plan.value); return x ? Number(fp.periodo.value === 'anio' ? x.precio_anio : x.precio_mes) : 0; };
    const pon = () => fp.monto.value = usd(monto()); fp.plan.onchange = pon; fp.periodo.onchange = pon; pon();
    fp.onsubmit = async ev => {
      ev.preventDefault(); ocupado(fp, true);
      try {
        const ruta = await subir('pagos', fp.archivo.files[0]);
        await q(sb.from('pagos_plan').insert({ org_id: S.org.id, plan: fp.plan.value, periodo: fp.periodo.value, monto: monto(), referencia: fp.referencia.value.trim(), comprobante: ruta }));
        await sb.from('bitacora').insert({ org_id: S.org.id, usuario: nombreQuien(), accion: 'Avisó un pago del plan', detalle: fp.plan.value + ' · ' + usd(monto()) });
        aviso('Listo. AgroGestión va a revisar el pago y encender tu plan.'); RUTAS.plan();
      } catch (e) { ocupado(fp, false); aviso(falla(e), true); }
    };
  }
  const fc = $('#fCarga');
  fc.onsubmit = async ev => {
    ev.preventDefault(); ocupado(fc, true);
    try {
      const ruta = await subir('cargas', fc.archivo.files[0]);
      await q(sb.from('pedidos_carga').insert({ org_id: S.org.id, que: fc.que.value, archivo: ruta, nota: fc.nota.value.trim() || null }));
      await sb.from('bitacora').insert({ org_id: S.org.id, usuario: nombreQuien(), accion: 'Pidió una carga de datos', detalle: fc.que.value });
      aviso('Archivo enviado. Te avisamos cuando esté cargado.'); RUTAS.plan();
    } catch (e) { ocupado(fc, false); aviso(falla(e), true); }
  };
  if (ir === 'carga') $('#carga').scrollIntoView();
};
SECCION_DE.plan = ''; GUIA_DE.plan = 'plan';

// ---------- carga masiva: solo el usuario maestro ----------
(function () {
  const original = RUTAS.carga;
  if (!original) return;
  RUTAS.carga = function (...a) {
    if (S.maestro) return original.apply(this, a);
    app().innerHTML = cabecera('Carga masiva') + '<div class="caja"><p>La carga masiva desde Excel la hace AgroGestión por vos, para que los datos queden bien amarrados.</p><p><a class="boton" href="#/plan/carga">Mandar mi archivo</a></p></div>';
  };
})();

// ---------- registro abierto ----------
function pantallaRegistro() {
  $('#barra').hidden = true;
  app().innerHTML = `<div class="acceso">
    <span class="logo">SIG</span>
    <h1>Probá el SIG gratis por 30 días</h1>
    <p class="nota" style="text-align:center">Creá la cuenta de tu organización. Vas a entrar como administrador general y después podés agregar a tu personal.</p>
    <form class="caja" id="fReg" autocomplete="on">
      <label>Tu nombre</label><input name="nombre" required autocomplete="name">
      <label>Nombre de tu organización</label><input name="org" required minlength="3" autocomplete="organization">
      <label>País</label><input name="pais" value="Honduras" autocomplete="country-name">
      <label>Teléfono</label><input name="telefono" type="tel" autocomplete="tel">
      <label>Correo</label><input name="correo" type="email" required autocomplete="email">
      <label>Contraseña (al menos 8 caracteres)</label><input name="clave" type="password" required minlength="8" autocomplete="new-password">
      <label class="check"><input type="checkbox" name="acepto" required> Leí y acepto el <a href="/privacidad.html" target="_blank" rel="noopener">aviso de privacidad y los términos de uso</a></label>
      <button>Crear mi cuenta</button>
      <p class="nota error" id="rErr"></p>
    </form>
    <p class="nota" style="text-align:center">¿Ya tenés cuenta? <a href="#/" id="rEntrar">Entrar</a></p></div>`;
  $('#rEntrar').onclick = e => { e.preventDefault(); location.hash = '#/'; pantallaAcceso(); };
  $('#fReg').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target, d = datosForm(f); ocupado(f, true); $('#rErr').textContent = '';
    const { data, error } = await sb.auth.signUp({ email: d.correo.toLowerCase(), password: d.clave,
      options: { emailRedirectTo: location.origin + '/', data: { nombre: d.nombre, registro: { org: d.org, nombre: d.nombre, pais: d.pais, telefono: d.telefono } } } });
    if (error) { ocupado(f, false); $('#rErr').textContent = /registered|exists/i.test(error.message) ? 'Ese correo ya tiene cuenta. Entrá con él.' : falla(error); return; }
    if (data.user && Array.isArray(data.user.identities) && !data.user.identities.length) { ocupado(f, false); $('#rErr').textContent = 'Ese correo ya tiene cuenta. Entrá con él.'; return; }
    if (data.session) { try { await cargarUsuario(data.user); location.hash = '#/'; ruta(); } catch (e) { ocupado(f, false); $('#rErr').textContent = falla(e); } return; }
    app().innerHTML = `<div class="acceso"><span class="logo">SIG</span><h1>Revisá tu correo</h1><div class="caja"><p>Te mandamos un mensaje a <b>${esc(d.correo)}</b>. Abrí el enlace que trae para confirmar tu cuenta.</p><p>Después entrá con tu correo y tu contraseña, y tu organización queda lista con la prueba gratis.</p><p class="nota">Si no lo ves, buscalo en correo no deseado.</p><p><a href="#/" onclick="pantallaAcceso();return false">Ir a entrar</a></p></div></div>`;
  };
}
// Primera entrada de una cuenta del registro abierto: crea su organización
async function crearOrgRegistro(user) {
  const r = user.user_metadata?.registro; if (!r) return false;
  const { error } = await sb.rpc('crear_mi_organizacion', { p_org: r.org, p_nombre: r.nombre, p_pais: r.pais || null, p_telefono: r.telefono || null });
  if (error) { const e = new Error(error.message); e.deRegistro = true; throw e; }
  return true;
}

// ---------- Clientes (usuario maestro) ----------
(function () {
  const original = RUTAS.orgs;
  RUTAS.orgs = async function (...a) {
    await original.apply(this, a);
    if (!S.maestro) return;
    app().querySelector('.tabla')?.remove(); // la lista simple se reemplaza por la de clientes
    const cont = document.createElement('div'); app().querySelector('h1').after(cont);
    await pintarClientes(cont);
  };
})();

async function pintarClientes(cont) {
  const [orgs, planes, pagos, pedidos] = await Promise.all([
    q(sb.from('organizaciones').select('*').order('nombre')),
    q(sb.from('planes').select('*').order('orden')),
    q(sb.from('pagos_plan').select('*').eq('estado', 'Pendiente').order('creado')),
    q(sb.from('pedidos_carga').select('*').eq('estado', 'Pendiente').order('creado'))
  ]);
  const usos = Object.fromEntries(await Promise.all(orgs.map(o => sb.rpc('uso_org', { o: o.id }).then(r => [o.id, (r.data || [])[0] || {}]))));
  const P = Object.fromEntries(planes.map(x => [x.codigo, x])), N = Object.fromEntries(orgs.map(o => [o.id, o.nombre]));
  const venc = o => o.vence && diasHasta(o.vence) < 0;
  const lectura = o => !o.activa || o.estado === 'suspendida' || venc(o);
  const cuenta = (f) => orgs.filter(o => !o.es_maestra && f(o)).length;
  const limite = (o, k) => o['lim_' + k] ?? P[o.plan]?.['max_' + k];
  const frac = (u, m) => `${Number(u || 0).toLocaleString('es-HN')} / ${m == null ? '∞' : Number(m).toLocaleString('es-HN')}`;
  cont.innerHTML = `
  <div class="tarjetas">
    <div class="tarjeta"><span class="num">${cuenta(o => o.estado === 'prueba' && !lectura(o))}</span><b>En prueba</b><span>Probando gratis</span></div>
    <div class="tarjeta"><span class="num">${cuenta(o => o.estado === 'activa' && !lectura(o))}</span><b>Activos</b><span>Con plan pagado</span></div>
    <div class="tarjeta"><span class="num">${cuenta(lectura)}</span><b>En solo lectura</b><span>Vencidos o apagados</span></div>
    <div class="tarjeta"><span class="num">${pagos.length + pedidos.length}</span><b>Por atender</b><span>${pagos.length} pagos · ${pedidos.length} cargas</span></div>
  </div>
  ${pagos.length ? `<h2>Pagos por aprobar</h2><div class="tabla"><table><thead><tr><th>Organización</th><th>Plan</th><th>Monto</th><th>Referencia</th><th>Comprobante</th><th></th></tr></thead><tbody>
    ${pagos.map(g => `<tr><td>${esc(N[g.org_id])}<br><span class="nota">${fechaHora(g.creado)}</span></td><td>${esc(P[g.plan]?.nombre || g.plan)} · ${g.periodo === 'anio' ? 'año' : 'mes'}</td><td>${usd(g.monto)}</td><td>${esc(g.referencia)}</td>
      <td>${g.comprobante ? `<a href="#" data-doc="${esc(g.comprobante)}">Ver</a>` : '—'}</td>
      <td style="white-space:nowrap"><button class="chico" data-aprobar="${g.id}">Aprobar y encender</button> <button class="chico sec" data-rechazar="${g.id}">Rechazar</button></td></tr>`).join('')}
  </tbody></table></div>` : ''}
  ${pedidos.length ? `<h2>Pedidos de carga de datos</h2><div class="tabla"><table><thead><tr><th>Organización</th><th>Datos</th><th>Archivo</th><th>Nota</th><th></th></tr></thead><tbody>
    ${pedidos.map(g => `<tr><td>${esc(N[g.org_id])}<br><span class="nota">${fechaHora(g.creado)}</span></td><td>${esc(g.que)}</td><td><a href="#" data-doc="${esc(g.archivo)}">Descargar</a></td><td>${esc(g.nota || '')}</td>
      <td style="white-space:nowrap"><button class="chico" data-cargado="${g.id}">Ya lo cargué</button> <button class="chico sec" data-nocarga="${g.id}">Rechazar</button></td></tr>`).join('')}
  </tbody></table></div>` : ''}
  <h2>Clientes</h2>
  <div class="tabla"><table><thead><tr><th>Organización</th><th>Plan</th><th>Estado</th><th>Vence</th><th>Productores</th><th>Usuarios</th><th>Adjuntos (MB)</th><th></th></tr></thead><tbody>
  ${orgs.map(o => { const u = usos[o.id] || {}, [et, ec] = lectura(o) ? ['Solo lectura', 'Rechazada'] : ESTADO_PLAN[o.estado] || [o.estado, ''], d = diasHasta(o.vence);
    return `<tr><td><b>${esc(o.nombre)}</b>${o.es_maestra ? ' <span class="estado e-Autorizada">Maestra</span>' : ''}${o.correo_contacto ? '<br><span class="nota">' + esc(o.correo_contacto) + (o.telefono ? ' · ' + esc(o.telefono) : '') + '</span>' : ''}</td>
      <td>${esc(P[o.plan]?.nombre || o.plan)}</td><td>${estadoChip(et, ec)}</td>
      <td>${o.vence ? fechaCorta(o.vence) + `<br><span class="nota">${d >= 0 ? 'faltan ' + d + ' días' : 'hace ' + -d + ' días'}</span>` : '—'}</td>
      <td>${frac(u.productores, limite(o, 'productores'))}</td><td>${frac(u.usuarios, limite(o, 'usuarios'))}</td><td>${frac(u.mb, limite(o, 'mb'))}</td>
      <td>${o.es_maestra ? '' : `<button class="chico" data-gestionar="${o.id}">Gestionar</button>`}</td></tr>`; }).join('')}
  </tbody></table></div>
  <div id="gestion"></div>`;

  verDocumentos(cont);
  const bit = (o, accion, detalle) => sb.from('bitacora').insert({ org_id: o, usuario: 'Usuario maestro', accion, detalle });
  const recargar = () => RUTAS.orgs();
  cont.querySelectorAll('[data-aprobar]').forEach(b => b.onclick = async () => {
    b.disabled = true; try { await q(sb.rpc('aprobar_pago', { p: b.dataset.aprobar })); aviso('Pago aprobado: el plan quedó encendido.'); recargar(); } catch (e) { b.disabled = false; aviso(falla(e), true); }
  });
  cont.querySelectorAll('[data-rechazar]').forEach(b => b.onclick = async () => {
    const m = prompt('¿Por qué se rechaza el pago? (el cliente lo va a ver)'); if (!m) return;
    const g = pagos.find(x => x.id === b.dataset.rechazar);
    try { await q(sb.from('pagos_plan').update({ estado: 'Rechazado', comentario: m, resuelto: new Date().toISOString() }).eq('id', g.id)); await bit(g.org_id, 'Rechazó un aviso de pago', m); recargar(); } catch (e) { aviso(falla(e), true); }
  });
  cont.querySelectorAll('[data-cargado],[data-nocarga]').forEach(b => b.onclick = async () => {
    const id = b.dataset.cargado || b.dataset.nocarga, g = pedidos.find(x => x.id === id), ok = !!b.dataset.cargado;
    const m = ok ? (prompt('Nota para el cliente (opcional)', 'Datos cargados.') ?? null) : prompt('¿Por qué no se puede cargar? (el cliente lo va a ver)');
    if (m === null || (!ok && !m)) return;
    try { await q(sb.from('pedidos_carga').update({ estado: ok ? 'Cargado' : 'Rechazado', comentario: m || null, resuelto: new Date().toISOString() }).eq('id', id)); await bit(g.org_id, ok ? 'Cargó los datos pedidos' : 'Rechazó un pedido de carga', g.que); recargar(); } catch (e) { aviso(falla(e), true); }
  });
  cont.querySelectorAll('[data-gestionar]').forEach(b => b.onclick = () => {
    const o = orgs.find(x => x.id === b.dataset.gestionar), g = $('#gestion');
    g.innerHTML = `<h2>Gestionar: ${esc(o.nombre)}</h2><form class="caja" id="fGes"><div class="rejilla">
      <div><label>Plan</label><select name="plan">${planes.map(x => `<option value="${x.codigo}" ${x.codigo === o.plan ? 'selected' : ''}>${esc(x.nombre)}</option>`).join('')}</select></div>
      <div><label>Estado</label><select name="estado">${Object.entries(ESTADO_PLAN).map(([k, [t]]) => `<option value="${k}" ${k === o.estado ? 'selected' : ''}>${t}${k === 'suspendida' ? ' (solo lectura)' : ''}</option>`).join('')}</select></div>
      <div><label>Vence</label><input name="vence" type="date" value="${o.vence || ''}"><div class="acciones" style="margin-top:4px"><button type="button" class="chico sec" data-mas="30">+30 días</button> <button type="button" class="chico sec" data-mas="365">+1 año</button></div></div>
      <div><label>Límite especial de productores</label><input name="lim_productores" type="number" min="0" value="${o.lim_productores ?? ''}" placeholder="El del plan (${P[o.plan]?.max_productores ?? 'sin límite'})"></div>
      <div><label>Límite especial de usuarios</label><input name="lim_usuarios" type="number" min="0" value="${o.lim_usuarios ?? ''}" placeholder="El del plan (${P[o.plan]?.max_usuarios ?? 'sin límite'})"></div>
      <div><label>Límite especial de adjuntos (MB)</label><input name="lim_mb" type="number" min="0" value="${o.lim_mb ?? ''}" placeholder="El del plan (${P[o.plan]?.max_mb ?? 'sin límite'})"></div>
      <div class="ancho"><label>Nota interna</label><textarea name="nota_cliente" rows="2">${esc(o.nota_cliente || '')}</textarea></div>
    </div><p class="nota">Si el plan vence o lo apagás, la organización queda en solo lectura: ve y descarga todo, pero no registra. No se borra nada.</p>
    <div class="acciones"><button>Guardar</button> <button type="button" class="sec" id="gCerrar">Cerrar</button></div></form>`;
    const f = $('#fGes');
    f.querySelectorAll('[data-mas]').forEach(x => x.onclick = () => {
      const base = f.vence.value && diasHasta(f.vence.value) > 0 ? f.vence.value : hoyHN(), d = new Date(base + 'T12:00:00');
      if (x.dataset.mas === '365') d.setFullYear(d.getFullYear() + 1); else d.setDate(d.getDate() + 30);
      f.vence.value = d.toISOString().slice(0, 10);
    });
    $('#gCerrar').onclick = () => g.innerHTML = '';
    f.onsubmit = async ev => {
      ev.preventDefault(); ocupado(f, true); const d = datosForm(f), num = v => v === '' ? null : parseInt(v, 10);
      const cambios = { plan: d.plan, estado: d.estado, vence: d.vence || null, lim_productores: num(d.lim_productores), lim_usuarios: num(d.lim_usuarios), lim_mb: num(d.lim_mb), nota_cliente: d.nota_cliente || null };
      try {
        await q(sb.from('organizaciones').update(cambios).eq('id', o.id));
        await bit(o.id, 'Cambió el plan de la organización', `${P[d.plan]?.nombre || d.plan} · ${ESTADO_PLAN[d.estado]?.[0] || d.estado} · vence ${d.vence || 'sin fecha'}`);
        aviso('Guardado.'); recargar();
      } catch (e) { ocupado(f, false); aviso(falla(e), true); }
    };
    g.scrollIntoView({ behavior: 'smooth' });
  });
}
