// SIG – Sistema de Gestión Integral · Administración (Supabase)
'use strict';

const SUPA_URL = 'https://amcvgyhyngvxsrvcnhmf.supabase.co';
const SUPA_KEY = 'sb_publishable_rmQNnaih2PPAtP2Oi7DaCQ_caaNuiDo';
const DOMINIO = 'u.agrogestionhn.com';

let sb;
const S = { user: null, perfil: null, maestro: false, rol: null, org: null, orgs: [], cfg: {}, leyes: {} };
const $ = (s, r = document) => r.querySelector(s);
const app = () => $('#app');

// ---------- utilidades ----------
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => String(s || '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '');
const num = v => { const n = parseFloat(String(v ?? '').replace(/,/g, '')); return isFinite(n) ? n : 0; };
const L = v => 'L ' + num(v).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fecha = v => v ? new Date(v).toLocaleDateString('es-HN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
const fechaHora = v => v ? new Date(v).toLocaleString('es-HN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
const hoy = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Tegucigalpa' });
const lista = v => String(v || '').split(/[\n,;]+/).map(x => x.trim()).filter(Boolean);
const opciones = (arr, sel) => arr.map(x => `<option ${x === sel ? 'selected' : ''}>${esc(x)}</option>`).join('');
const esJefe = () => ['maestro', 'administrador', 'gerencia'].includes(S.rol);
const esAdmin = () => ['maestro', 'administrador'].includes(S.rol);
// Secciones que puede abrir el usuario (el administrador y el maestro ven todas)
const puedeSec = s => S.maestro || S.rol === 'administrador' || (S.perfil?.secciones || []).includes(s);
const COMPARTIDAS = ['prodf', 'prod', 'padron'];
const TIPOS = { compra: 'Compra', fondo: 'Solicitud de fondos', vacacion: 'Vacaciones', liquidacion: 'Liquidación de fondos', laboral: 'Laboral' };
const ROLES = { administrador: 'Administrador', gerencia: 'Gerencia', personal: 'Personal', maestro: 'Usuario maestro' };

function aviso(t, mal) {
  const a = $('#aviso'); a.textContent = t; a.className = 'ver' + (mal ? ' mal' : '');
  clearTimeout(aviso.t); aviso.t = setTimeout(() => a.className = '', mal ? 6000 : 3000);
}
function falla(e) {
  const m = e?.message || String(e);
  if (/duplicate key|facturas_unica/i.test(m)) return 'Esa factura ya está registrada (mismo RTN y número).';
  if (/row-level security|permission denied/i.test(m)) return 'No tenés permiso para hacer eso.';
  if (/Failed to fetch|NetworkError/i.test(m)) return 'No hay conexión. Revisá el internet e intentá de nuevo.';
  return m;
}
// ---------- sin señal: copia local de lo consultado y bandeja de salida ----------
// Toda consulta que pasa por q() guarda su resultado; sin señal se usa esa copia.
// Lo que se registra sin señal (inspección, acopio, insumos) queda en la bandeja y se manda solo al volver la señal.
const sinRed = e => !navigator.onLine || /Failed to fetch|NetworkError|Load failed|network|fetch failed|ERR_INTERNET|TypeError: Failed/i.test(e?.message || String(e || ''));
const OFF = {
  db: null,
  abrir() { return this.db ||= new Promise((ok, mal) => { const r = indexedDB.open('sig', 1); r.onupgradeneeded = () => r.result.createObjectStore('cache'); r.onsuccess = () => ok(r.result); r.onerror = () => mal(r.error); }); },
  async leer(k) { try { const db = await this.abrir(); return await new Promise(ok => { const r = db.transaction('cache').objectStore('cache').get(k); r.onsuccess = () => ok(r.result); r.onerror = () => ok(undefined); }); } catch (_) { return undefined; } },
  async guardar(k, v) { try { const db = await this.abrir(); db.transaction('cache', 'readwrite').objectStore('cache').put(v, k); } catch (_) { } },
  cola() { try { return JSON.parse(localStorage.getItem('sig_cola') || '[]'); } catch (_) { return []; } },
  ponerCola(c) { localStorage.setItem('sig_cola', JSON.stringify(c)); pintarSenal(); },
  TABLAS: ['acopio', 'inspecciones', 'no_conformidades', 'insumos_aplicados', 'parcelas', 'productores']
};
function infoConsulta(p) {
  if (!p || !p.url || !p.method) return null;
  const url = p.url.toString(), rpc = url.includes('/rest/v1/rpc/');
  const lee = p.method === 'GET' || p.method === 'HEAD' || (rpc && /credito_exigible|comite_info/.test(url));
  return { url, metodo: p.method, cuerpo: p.body, cabeceras: p.headers || {}, lee, clave: (S.user?.id || '') + ' ' + p.method + ' ' + url + (rpc ? ' ' + JSON.stringify(p.body || {}) : ''), tabla: (url.match(/\/rest\/v1\/([a-z_]+)/) || [])[1] };
}
async function q(p) {
  const info = infoConsulta(p);
  let res;
  try { res = await p; } catch (e) { if (info && sinRed(e)) return sinSenal(info, e); throw e; }
  const { data, error } = res;
  if (error) { if (info && sinRed(error)) return sinSenal(info, error); throw error; }
  if (info?.lee) OFF.guardar(info.clave, data);
  if (S.sinSenal) { S.sinSenal = false; pintarSenal(); }
  return data;
}
async function sinSenal(info, e) {
  S.sinSenal = true; pintarSenal();
  if (info.lee) {
    const v = await OFF.leer(info.clave);
    if (v !== undefined) return v;
    throw new Error('Sin señal, y esto todavía no se ha abierto con señal en este teléfono. Abrilo una vez con internet (o usá «Preparar para el campo» en la bandeja).');
  }
  if (!OFF.TABLAS.includes(info.tabla) || !['POST', 'PATCH'].includes(info.metodo) || (info.metodo === 'POST' && ![].concat(info.cuerpo || []).every(x => x && x.id))) throw new Error('Sin señal: esto necesita internet. Sin señal se puede registrar inspección, acopio e insumos.');
  const c = OFF.cola();
  c.push({ n: Date.now() + '-' + Math.random().toString(36).slice(2, 6), cuando: new Date().toISOString(), metodo: info.metodo, url: info.url, cuerpo: info.cuerpo, tabla: info.tabla, org: S.org?.id, quien: S.user?.id });
  OFF.ponerCola(c);
  const marca = x => ({ ...x, numero: x.numero || 'Por enviar', _local: true });
  if (Array.isArray(info.cuerpo)) return info.cuerpo.map(marca);
  if (info.metodo === 'PATCH') return [];
  return /vnd\.pgrst\.object/.test(info.cabeceras.Accept || '') ? marca(info.cuerpo) : [marca(info.cuerpo)];
}
let enviando = false;
async function enviarCola(manual) {
  if (enviando || !navigator.onLine) return;
  let c = OFF.cola(); if (!c.length) return;
  enviando = true; pintarSenal();
  let mandados = 0;
  try {
    const { data } = await sb.auth.getSession(); const tk = data.session?.access_token;
    if (!tk) { if (manual) aviso('Entrá con tu usuario para mandar la bandeja.', true); return; }
    while (c.length) {
      const x = c[0];
      if (x.quien && x.quien !== S.user?.id) { x.error = 'Lo registró otro usuario en este teléfono: tiene que entrar esa persona para mandarlo.'; break; }
      const url = x.url.replace(/([?&])(select|columns)=[^&]*/g, '$1').replace(/[?&]+$/, '');
      let r;
      try { r = await fetch(url, { method: x.metodo, headers: { apikey: SUPA_KEY, Authorization: 'Bearer ' + tk, 'Content-Type': 'application/json', Prefer: 'return=minimal' + (x.metodo === 'POST' ? ',resolution=ignore-duplicates' : '') }, body: JSON.stringify(x.cuerpo) }); }
      catch (e) { break; }
      const t2 = r.ok ? '' : await r.text().catch(() => '');
      if (r.ok || (r.status === 409 && /23505/.test(t2))) { c.shift(); mandados++; OFF.ponerCola(c); continue; } x.error = (() => { try { const j = JSON.parse(t2); return falla(j); } catch (_) { return t2.slice(0, 200) || 'Error ' + r.status; } })();
      OFF.ponerCola(c); break;
    }
  } finally { enviando = false; pintarSenal(); }
  if (mandados) { aviso(`Se mandaron ${mandados} registro${mandados > 1 ? 's' : ''} que estaban en el teléfono.`); try { archivarLuego(true); } catch (_) { } }
  else if (manual && OFF.cola()[0]?.error) aviso('Hay un registro con problema en la bandeja.', true);
}
function pintarSenal() {
  let b = document.getElementById('senal');
  if (!b) { b = document.createElement('a'); b.id = 'senal'; b.href = '#/bandeja'; b.style.cssText = 'position:fixed;left:10px;bottom:8px;z-index:6;font-size:13px;padding:6px 12px;border-radius:999px;text-decoration:none;box-shadow:0 1px 4px rgba(0,0,0,.15)'; document.body.appendChild(b); }
  const n = OFF.cola().length, sin = !navigator.onLine || S.sinSenal;
  b.hidden = !n && !sin;
  b.style.background = OFF.cola()[0]?.error ? '#fee2e2' : sin ? '#fef3c7' : '#dcfce7'; b.style.color = '#1f2a24';
  b.textContent = (sin ? 'Sin señal' : enviando ? 'Enviando…' : 'Con señal') + (n ? ` · ${n} por enviar` : '');
}
window.addEventListener('online', () => { S.sinSenal = false; pintarSenal(); enviarCola(); });
window.addEventListener('offline', () => { S.sinSenal = true; pintarSenal(); });
setInterval(() => { if (OFF.cola().length && navigator.onLine) enviarCola(); }, 60000);
let pedirInstalar = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); pedirInstalar = e; });
function datosForm(f) { const o = {}; new FormData(f).forEach((v, k) => o[k] = typeof v === 'string' ? v.trim() : v); return o; }
function ocupado(f, si) { f.querySelectorAll('button').forEach(b => b.disabled = si); }
// Qué parte de la guía de uso explica cada pantalla
const GUIA_DE = { adm: 'adm', compra: 'adm', fondo: 'adm', liquidacion: 'adm', vacacion: 'adm', laboral: 'adm', factura: 'adm', facturas: 'adm', presupuesto: 'adm', empleados: 'adm', proveedores: 'adm', solicitudes: 'adm', solicitud: 'adm',
  cre: 'cre', credito: 'cre', creditos: 'cre', cred: 'cre', cartera: 'cre', recordatorios: 'cre', reportescre: 'cre', fondos: 'cre', condiciones: 'cre', edocta: 'cre',
  cer: 'padron', padron: 'padron', prod: 'padron', prodf: 'padron', parcela: 'padron', inspeccion: 'insp', inspecciones: 'insp', insp: 'insp', nc: 'insp', insumos: 'insp', reg: 'insp',
  asistencia: 'capac', quejas: 'capac', queja: 'capac', acopio: 'acopio', acopios: 'acopio', recibo: 'acopio', inventario: 'acopio', basculas: 'acopio',
  despacho: 'venta', eudr: 'venta', lotes: 'venta', lote: 'venta', balance: 'venta', prima: 'prima', actas: 'prima', paquete: 'auditoria', kobo: 'kobo', bandeja: 'campo',
  capacitacion: 'capac', capacitaciones: 'capac', cap: 'capac', guias: 'capac', aprobar: 'aprobacion', rev: 'aprobacion', carga: 'carga',
  panel: 'paneles', pnl: 'paneles', config: 'config', usuarios: 'config', catalogo: 'config', bitacora: 'config', orgs: 'config' };
function cabecera(titulo, volver = S.seccion ? '#/' + S.seccion : '#/') {
  const g = GUIA_DE[location.hash.replace(/^#\/?/, '').split('/')[0]];
  return `<a class="volver" href="${volver}">← Volver</a><h1>${esc(titulo)}</h1>` + (g ? `<a class="ayudaSec" href="#/guia/${g}">¿Cómo se usa?</a>` : '');
}

// ---------- arranque ----------
window.addEventListener('DOMContentLoaded', async () => {
  sb = supabase.createClient(SUPA_URL, SUPA_KEY, { auth: { persistSession: true, autoRefreshToken: true } });
  $('#salir').onclick = async () => { await sb.auth.signOut({ scope: 'local' }); location.hash = '#/'; location.reload(); };
  $('#cambioOrg').onchange = e => { cambiarOrg(e.target.value); };
  window.addEventListener('hashchange', ruta);
  const { data } = await sb.auth.getSession();
  if (data.session) {
    // Se pregunta al servidor si la sesión sigue abierta (pudo cerrarse desde otro equipo)
    const g = await sb.auth.getUser().catch(e => ({ error: e }));
    if (g.error && sinRed(g.error)) restaurarSinSenal(data.session.user);
    else if (g.error || !g.data?.user) await sb.auth.signOut({ scope: 'local' });
    else { try { await cargarUsuario(g.data.user); } catch (e) { if (sinRed(e)) restaurarSinSenal(data.session.user); else await sb.auth.signOut({ scope: 'local' }); } }
  }
  pintarSenal(); setTimeout(() => enviarCola(), 3000);
  ruta();
});

async function cargarUsuario(user) {
  S.user = user;
  const [m, p] = await Promise.all([
    sb.from('maestros').select('user_id').eq('user_id', user.id).maybeSingle(),
    sb.from('perfiles').select('*, organizaciones(id,nombre,es_maestra,activa)').eq('id', user.id).maybeSingle()
  ]);
  if ((m.error && sinRed(m.error)) || (p.error && sinRed(p.error))) throw m.error || p.error;
  S.maestro = !!m.data; S.perfil = p.data;
  if (!S.maestro && (!S.perfil || !S.perfil.activo)) throw new Error('Usuario sin acceso');
  S.rol = S.maestro ? 'maestro' : S.perfil.rol;
  if (S.maestro) {
    S.orgs = await q(sb.from('organizaciones').select('id,nombre,es_maestra,activa').order('nombre'));
    const guardada = localStorage.getItem('sig_org');
    S.org = S.orgs.find(o => o.id === guardada) || S.orgs.find(o => o.es_maestra) || S.orgs[0];
  } else {
    S.org = S.perfil.organizaciones;
  }
  await cargarOrg();
  sb.rpc('registrar_entrada').then(() => {}, () => {});
  guardarSesionLocal();
}
// Lo mínimo para abrir la aplicación sin señal en este teléfono
function guardarSesionLocal() {
  try { localStorage.setItem('sig_sesion', JSON.stringify({ user: { id: S.user.id, email: S.user.email }, perfil: S.perfil, maestro: S.maestro, rol: S.rol, orgs: S.orgs, org: S.org, cfg: S.cfg, leyes: S.leyes })); } catch (_) { }
}
function restaurarSinSenal(user) {
  let g = null; try { g = JSON.parse(localStorage.getItem('sig_sesion') || 'null'); } catch (_) { }
  if (!g || g.user?.id !== user?.id) return false;
  Object.assign(S, { user: { ...user, ...g.user }, perfil: g.perfil, maestro: g.maestro, rol: g.rol, orgs: g.orgs || [], org: g.org, cfg: g.cfg || {}, leyes: g.leyes || {}, sinSenal: true });
  pintarBarra(); return true;
}

async function cargarOrg() {
  const [c, l] = await Promise.all([
    sb.from('configuracion').select('clave,valor').eq('org_id', S.org.id),
    sb.from('leyes').select('clave,valor')
  ]);
  if (c.error && sinRed(c.error)) throw c.error;
  S.cfg = Object.fromEntries((c.data || []).map(x => [x.clave, x.valor]));
  S.leyes = Object.fromEntries((l.data || []).map(x => [x.clave, x.valor]));
  pintarBarra(); if (S.user) guardarSesionLocal();
}

async function cambiarOrg(id) {
  S.org = S.orgs.find(o => o.id === id); localStorage.setItem('sig_org', id);
  await cargarOrg(); location.hash = '#/'; ruta();
}

function pintarBarra() {
  $('#barra').hidden = false;
  $('#nombreOrg').textContent = S.org?.nombre || '';
  // Con selector de organización el nombre no se repite al lado del logo
  $('#nombreOrg').hidden = !!S.maestro;
  // En Usuario maestro no se repite el nombre (ya está en el selector de organización)
  $('#quien').textContent = S.maestro ? '' : S.perfil.nombre + ' · ' + ROLES[S.rol];
  $('#quien').hidden = S.maestro;
  const sel = $('#cambioOrg');
  if (S.maestro) { sel.hidden = false; sel.innerHTML = S.orgs.map(o => `<option value="${o.id}" ${o.id === S.org.id ? 'selected' : ''}>${esc(o.nombre)}</option>`).join(''); }
  pintarEngrane();
}

// ---------- engrane de configuración (esquina de arriba, solo administrador) ----------
const ICONO_ENGRANE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
function pintarEngrane() {
  let eng = $('#engrane');
  if (!eng) {
    eng = document.createElement('div'); eng.id = 'engrane'; eng.className = 'engrane';
    // «Salir» y el engrane van juntos en la esquina, aunque la barra se parta en dos renglones
    const par = document.createElement('div'); par.className = 'parBarra';
    const salir = $('#salir'); salir.replaceWith(par);
    const guia = document.createElement('a'); guia.href = '#/guia'; guia.className = 'guiaBtn'; guia.title = 'Guía de uso'; guia.setAttribute('aria-label', 'Guía de uso'); guia.textContent = '?';
    par.append(guia, salir, eng);
    document.addEventListener('click', ev => { if (!eng.contains(ev.target)) cerrarEngrane(); });
    document.addEventListener('keydown', ev => { if (ev.key === 'Escape') cerrarEngrane(); });
    window.addEventListener('hashchange', cerrarEngrane);
  }
  eng.hidden = !esAdmin();
  if (!esAdmin()) { eng.innerHTML = ''; return; }
  const op = (h, t, s) => `<a href="${h}" role="menuitem"><b>${t}</b><span>${s}</span></a>`;
  eng.innerHTML = `<button type="button" class="icono" id="btnEng" title="Configuración" aria-label="Configuración" aria-haspopup="true" aria-expanded="false">${ICONO_ENGRANE}</button>
    <div class="menuEng" id="menuEng" role="menu" hidden>
      <div class="titEng">Configuración de ${esc(S.org?.nombre || '')}</div>
      ${op('#/config', 'Configuración', 'Montos, listas, claves de paneles, Kobo y copias de seguridad')}
      ${op('#/usuarios', 'Usuarios', 'Accesos, roles, paneles y comité')}
      ${op('#/catalogo', 'Catálogo de certificaciones', 'Cuáles se usan en esta organización')}
      ${op('#/bitacora', 'Bitácora', 'Quién hizo qué')}
      ${S.maestro ? op('#/orgs', 'Organizaciones', 'Altas y valores de ley') : ''}
    </div>`;
  $('#btnEng').onclick = () => {
    const m = $('#menuEng'), abrir = m.hidden; m.hidden = !abrir; $('#btnEng').setAttribute('aria-expanded', abrir);
    if (abrir) { // el menú se abre pegado al engrane, sin salirse de la pantalla
      const r = $('#btnEng').getBoundingClientRect(), ancho = Math.min(300, innerWidth - 20);
      Object.assign(m.style, { position: 'fixed', top: (r.bottom + 8) + 'px', width: ancho + 'px', right: Math.max(10, Math.min(innerWidth - r.right, innerWidth - ancho - 10)) + 'px' });
    }
  };
}
function cerrarEngrane() { const m = $('#menuEng'); if (m && !m.hidden) { m.hidden = true; $('#btnEng').setAttribute('aria-expanded', 'false'); } }

// ---------- rutas ----------
const RUTAS = {
  '': inicio, 'compra': formCompra, 'fondo': formFondo, 'liquidacion': formLiquidacion, 'vacacion': formVacacion,
  'factura': formFactura, 'facturas': verFacturas, 'solicitudes': verSolicitudes, 'solicitud': verSolicitud,
  'proveedores': verProveedores, 'proveedor': formProveedor, 'empleados': verEmpleados, 'empleado': formEmpleado,
  'presupuesto': verPresupuesto, 'config': verConfig, 'usuarios': verUsuarios, 'bitacora': verBitacora, 'orgs': verOrgs, 'adm': inicio
};
// A qué sección vuelve el botón «Volver» de cada pantalla ('' = portal)
// Claves de Configuración que se escogen de una lista
const CFG_OPC = { CULTIVO_ACOPIO: ['Café', 'Cacao', 'Café y cacao'] };
const SECCION_DE = { '': '', adm: 'adm', config: '', usuarios: '', bitacora: '', orgs: '', guia: '', aprobar: '', rev: '' };
['compra', 'fondo', 'liquidacion', 'vacacion', 'factura', 'facturas', 'solicitudes', 'solicitud', 'proveedores', 'proveedor', 'empleados', 'empleado', 'presupuesto', 'laboral'].forEach(r => SECCION_DE[r] = 'adm');
async function ruta() {
  if (!S.user) return pantallaAcceso();
  archivarLuego();
  const [r, ...resto] = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  const f = RUTAS[r] || RUTAS[''];
  if (SECCION_DE[r] !== undefined) S.seccion = SECCION_DE[r];
  const sec = SECCION_DE[r];
  if (['adm', 'cre', 'cer'].includes(sec) && !puedeSec(sec) && !(COMPARTIDAS.includes(r) && (puedeSec('cre') || puedeSec('cer')))) {
    app().innerHTML = cabecera('Sin acceso', '#/') + '<div class="caja">No tenés acceso a esta sección. Pedile al administrador que te la habilite.</div>'; return;
  }
  app().innerHTML = '<div class="cargando">Cargando…</div>';
  try { await f(resto[0] || null, resto[1] || null); window.scrollTo(0, 0); }
  catch (e) { app().innerHTML = `<div class="caja error">No se pudo abrir esta pantalla: ${esc(falla(e))}</div>`; }
}

// ---------- acceso ----------
function pantallaAcceso() {
  $('#barra').hidden = true;
  app().innerHTML = `<div class="acceso">
    <span class="logo">SIG</span>
    <h1>Sistema de Gestión Integral</h1>
    <form class="caja" id="fAcceso" autocomplete="on">
      <label for="aOrg">Organización</label><input id="aOrg" name="org" required autocomplete="organization" value="${esc(localStorage.getItem('sig_ultima_org') || '')}">
      <label for="aUsr">Usuario</label><input id="aUsr" name="usuario" required autocomplete="username" autocapitalize="none" placeholder="Tu usuario o tu correo">
      <label for="aClave">Contraseña</label><input id="aClave" name="clave" type="password" required autocomplete="current-password">
      <button>Entrar</button>
      <p class="nota error" id="aErr"></p>
    </form><p class="nota" style="text-align:center"><a href="/privacidad.html" target="_blank" rel="noopener">Aviso de privacidad y términos de uso</a></p></div>`;
  $('#fAcceso').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target, d = datosForm(f); ocupado(f, true); $('#aErr').textContent = '';
    const correo = d.usuario.includes('@') ? d.usuario.toLowerCase() : `${norm(d.usuario)}.${norm(d.org)}@${DOMINIO}`;
    const { data, error } = await sb.auth.signInWithPassword({ email: correo, password: d.clave });
    if (error) { ocupado(f, false); $('#aErr').textContent = /invalid/i.test(error.message) ? 'Organización, usuario o contraseña incorrectos.' : falla(error); return; }
    try { await cargarUsuario(data.user); localStorage.setItem('sig_ultima_org', d.org); location.hash = '#/'; ruta(); }
    catch (e) { await sb.auth.signOut({ scope: 'local' }); ocupado(f, false); $('#aErr').textContent = 'Este usuario está desactivado. Hablá con el administrador.'; }
  };
}

// ---------- inicio ----------
async function inicio() {
  let pend = 0;
  if (esJefe()) { const r = await sb.from('solicitudes').select('id', { count: 'exact', head: true }).eq('org_id', S.org.id).eq('estado', 'Pendiente'); pend = r.count || 0; }
  const t = (h, b, s, n) => `<a class="tarjeta" href="${h}">${n ? `<span class="num">${n}</span>` : ''}<b>${b}</b><span>${s}</span></a>`;
  app().innerHTML = cabecera('Administración', '#/') + `
  <div class="tarjetas">
    ${t('#/compra', 'Solicitud de compra', 'Con cotizaciones y proveedor')}
    ${t('#/fondo', 'Solicitud de fondos', 'Anticipos para actividades')}
    ${t('#/liquidacion', 'Liquidar fondos', 'Rendir cuentas de un anticipo')}
    ${t('#/factura', 'Registrar factura', 'Revisión del CAI y retenciones')}
    ${t('#/vacacion', 'Vacaciones', 'Solicitar días')}
    ${esJefe() ? t('#/laboral', 'Liquidación laboral', 'Prestaciones al terminar la relación') : ''}
    ${t('#/solicitudes', esJefe() ? 'Autorizaciones' : 'Mis solicitudes', esJefe() ? 'Revisar y resolver' : 'Ver en qué van', pend)}
    ${t('#/facturas', 'Facturas', 'Libro de compras del mes')}
    ${t('#/proveedores', 'Proveedores', 'Directorio')}
    ${esJefe() ? t('#/empleados', 'Empleados', 'Datos del personal') : ''}
    ${t('#/presupuesto', 'Presupuesto', 'Aprobado y ejecutado')}
    ${puedePanel('adm') ? t('#/pnl/adm', 'Panel de control', 'Números de la sección y archivo de PDF') : ''}
  </div>`;
}

// ---------- campos comunes ----------
function camposPresupuesto(d = {}) {
  const proy = lista(S.cfg.PROYECTOS), lin = lista(S.cfg.LINEAS_PRESUPUESTO);
  return `<div><label>Proyecto o fondo</label><select name="proyecto">${opciones(proy.length ? proy : ['Fondos propios'], d.proyecto)}</select></div>
          <div><label>Línea de presupuesto</label><select name="linea" required><option value="">Elegir…</option>${opciones(lin, d.linea)}</select></div>`;
}
function solicitanteDefecto() { return S.maestro ? '' : S.perfil.nombre; }
async function guardarSolicitud(reg) {
  reg.org_id = S.org.id;
  const fila = await q(sb.from('solicitudes').insert(reg).select('id,numero').single());
  avisar('solicitud', fila.id);
  aviso('Listo. Quedó registrada como ' + fila.numero);
  location.hash = '#/solicitud/' + fila.id;
}

// ---------- compra ----------
function cotizacionesRequeridas(monto) {
  const a = num(S.cfg.COTIZACION_1_HASTA || 10000), b = num(S.cfg.COTIZACION_2_HASTA || 50000);
  return monto <= a ? 1 : monto <= b ? 2 : 3;
}
async function formCompra() {
  const prov = await q(sb.from('proveedores').select('id,nombre,rtn').eq('org_id', S.org.id).eq('activo', true).order('nombre'));
  const opProv = '<option value="">Elegir…</option>' + prov.map(p => `<option value="${p.id}">${esc(p.nombre)}</option>`).join('');
  app().innerHTML = cabecera('Solicitud de compra') + `
  <form class="caja" id="f"><div class="rejilla">
    <div><label>Solicitante</label><input name="solicitante" required value="${esc(solicitanteDefecto())}"></div>
    <div><label>Área</label><select name="area">${opciones(lista(S.cfg.AREAS))}</select></div>
    ${camposPresupuesto()}
    <div class="ancho"><label>Qué se va a comprar y para qué</label><textarea name="descripcion" required></textarea></div>
  </div>
  <h2>Cotizaciones</h2><p class="nota" id="regla"></p><div id="cots"></div>
  <div class="acciones"><button type="button" class="sec" id="masCot">+ Otra cotización</button></div>
  <div class="rejilla" style="margin-top:14px">
    <div><label>Cotización elegida</label><select name="elegida" id="elegida"></select></div>
    <div class="ancho"><label>Por qué se elige (si no es la más barata)</label><input name="justificacion"></div>
  </div>
  <ul class="lista-errores" id="errs"></ul>
  <div class="acciones"><button>Enviar a autorización</button></div></form>`;
  const cots = $('#cots'); let n = 0;
  const agregar = () => { n++; cots.insertAdjacentHTML('beforeend', `<div class="cot rejilla">
      <div><label>Proveedor ${n}</label><select name="prov${n}">${opProv}</select></div>
      <div><label>Monto con ISV (L)</label><input name="monto${n}" inputmode="decimal"></div>
      <div><label>Entrega / condiciones</label><input name="cond${n}"></div></div>`); actualizar(); };
  const actualizar = () => {
    const d = datosForm($('#f')), montos = [];
    for (let i = 1; i <= n; i++) if (num(d['monto' + i]) > 0) montos.push(num(d['monto' + i]));
    const ref = montos.length ? Math.min(...montos) : 0, req = cotizacionesRequeridas(ref);
    $('#regla').textContent = `Para este monto se piden ${req} cotización${req > 1 ? 'es' : ''}. (Hasta ${L(S.cfg.COTIZACION_1_HASTA || 10000)}: 1 · hasta ${L(S.cfg.COTIZACION_2_HASTA || 50000)}: 2 · más: 3)`;
    const el = $('#elegida'), v = el.value;
    el.innerHTML = Array.from({ length: n }, (_, i) => `<option value="${i + 1}">Cotización ${i + 1}</option>`).join(''); if (v) el.value = v;
  };
  $('#masCot').onclick = agregar; $('#f').oninput = actualizar;
  agregar();
  $('#f').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target, d = datosForm(f), errs = [], cotizaciones = [];
    for (let i = 1; i <= n; i++) {
      if (!d['prov' + i] && !num(d['monto' + i])) continue;
      const p = prov.find(x => x.id === d['prov' + i]);
      if (!p) errs.push(`Falta el proveedor en la cotización ${i}.`);
      if (num(d['monto' + i]) <= 0) errs.push(`Falta el monto en la cotización ${i}.`);
      cotizaciones.push({ n: i, proveedor_id: p?.id, proveedor: p?.nombre, rtn: p?.rtn, monto: num(d['monto' + i]), condiciones: d['cond' + i] });
    }
    const eleg = cotizaciones.find(c => c.n === +d.elegida);
    if (!eleg) errs.push('Elegí una cotización que tenga datos.');
    const req = eleg ? cotizacionesRequeridas(eleg.monto) : 1;
    if (cotizaciones.length < req) errs.push(`Para ${L(eleg?.monto)} se necesitan ${req} cotizaciones.`);
    const minimo = Math.min(...cotizaciones.map(c => c.monto));
    if (eleg && eleg.monto > minimo && !d.justificacion) errs.push('Explicá por qué no se elige la cotización más barata.');
    $('#errs').innerHTML = errs.map(e => `<li>${esc(e)}</li>`).join(''); if (errs.length) return;
    ocupado(f, true);
    try {
      await guardarSolicitud({ tipo: 'compra', solicitante: d.solicitante, correo: S.user.email, monto: eleg.monto, proyecto: d.proyecto, linea: d.linea, descripcion: d.descripcion,
        datos: { area: d.area, cotizaciones, elegida: eleg.n, proveedor: eleg.proveedor, proveedor_id: eleg.proveedor_id, justificacion: d.justificacion } });
    } catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
}

// ---------- fondos ----------
async function formFondo() {
  app().innerHTML = cabecera('Solicitud de fondos') + `
  <form class="caja" id="f"><div class="rejilla">
    <div><label>Solicitante</label><input name="solicitante" required value="${esc(solicitanteDefecto())}"></div>
    <div><label>Monto (L)</label><input name="monto" required inputmode="decimal"></div>
    ${camposPresupuesto()}
    <div><label>Fecha de la actividad</label><input type="date" name="fecha_actividad" value="${hoy()}"></div>
    <div><label>Fecha en que vas a liquidar</label><input type="date" name="fecha_liquidar"></div>
    <div class="ancho"><label>Para qué es el dinero</label><textarea name="descripcion" required></textarea></div>
    <div class="ancho"><label>Detalle de gastos previstos</label><textarea name="detalle" placeholder="Ej.: Alimentación 20 personas L 3,000; transporte L 1,500"></textarea></div>
  </div><div class="acciones"><button>Enviar a autorización</button></div></form>`;
  $('#f').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target, d = datosForm(f);
    if (num(d.monto) <= 0) return aviso('Poné un monto mayor que cero.', true);
    ocupado(f, true);
    try { await guardarSolicitud({ tipo: 'fondo', solicitante: d.solicitante, correo: S.user.email, monto: num(d.monto), proyecto: d.proyecto, linea: d.linea, descripcion: d.descripcion, datos: { fecha_actividad: d.fecha_actividad, fecha_liquidar: d.fecha_liquidar, detalle: d.detalle } }); }
    catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
}

// ---------- liquidación ----------
async function formLiquidacion(refId) {
  let qy = sb.from('solicitudes').select('id,numero,monto,descripcion,solicitante,proyecto,linea,creado_por').eq('org_id', S.org.id).eq('tipo', 'fondo').eq('estado', 'Autorizada').order('creado', { ascending: false });
  if (!esJefe()) qy = qy.eq('creado_por', S.user.id);
  const fondos = await q(qy);
  const liq = await q(sb.from('solicitudes').select('referencia').eq('org_id', S.org.id).eq('tipo', 'liquidacion').in('estado', ['Pendiente', 'Autorizada']));
  const hechas = new Set(liq.map(x => x.referencia));
  const libres = fondos.filter(x => !hechas.has(x.id));
  if (!libres.length) { app().innerHTML = cabecera('Liquidar fondos') + '<div class="caja">No hay fondos autorizados pendientes de liquidar.</div>'; return; }
  app().innerHTML = cabecera('Liquidar fondos') + `
  <form class="caja" id="f"><div class="rejilla">
    <div class="ancho"><label>Fondo que se liquida</label><select name="ref" id="ref">${libres.map(x => `<option value="${x.id}" ${x.id === refId ? 'selected' : ''}>${esc(x.numero)} · ${esc(x.solicitante)} · ${L(x.monto)} · ${esc((x.descripcion || '').slice(0, 60))}</option>`).join('')}</select></div>
    <div><label>Total gastado con facturas (L)</label><input name="total_gastos" id="tg" required inputmode="decimal"></div>
    <div><label>Facturas que respaldan</label><input name="num_facturas" inputmode="numeric" placeholder="Cantidad"></div>
    <div class="ancho"><p id="resultado" class="nota"></p></div>
    <div class="ancho"><label>Comentarios</label><textarea name="descripcion"></textarea></div>
  </div>
  <p class="nota">Registrá cada factura en <a href="#/factura">Registrar factura</a> para que quede revisada contra el SAR.</p>
  <div class="acciones"><button>Enviar liquidación</button></div></form>`;
  const calc = () => {
    const fo = libres.find(x => x.id === $('#ref').value), g = num($('#tg').value), dif = num(fo.monto) - g;
    $('#resultado').innerHTML = !g ? '' : dif > 0 ? `Debe devolver <b>${L(dif)}</b>.` : dif < 0 ? `La organización le debe reintegrar <b>${L(-dif)}</b>.` : 'Cuadra exacto.';
  };
  $('#f').oninput = calc;
  $('#f').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target, d = datosForm(f), fo = libres.find(x => x.id === d.ref), g = num(d.total_gastos);
    ocupado(f, true);
    try { await guardarSolicitud({ tipo: 'liquidacion', referencia: fo.id, solicitante: fo.solicitante, correo: S.user.email, monto: g, proyecto: fo.proyecto, linea: fo.linea, descripcion: d.descripcion || ('Liquidación de ' + fo.numero),
      datos: { fondo: fo.numero, monto_fondo: num(fo.monto), total_gastos: g, diferencia: num(fo.monto) - g, num_facturas: d.num_facturas } }); }
    catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
}

// ---------- vacaciones ----------
function diasHabiles(a, b) {
  if (!a || !b) return 0; let d = new Date(a + 'T12:00'), fin = new Date(b + 'T12:00'), n = 0;
  while (d <= fin) { const w = d.getDay(); if (w !== 0 && w !== 6) n++; d.setDate(d.getDate() + 1); }
  return n;
}
async function formVacacion() {
  const emp = esJefe() ? await q(sb.from('empleados').select('nombre,dias_vacaciones').eq('org_id', S.org.id).eq('activo', true).order('nombre')) : [];
  app().innerHTML = cabecera('Solicitud de vacaciones') + `
  <form class="caja" id="f"><div class="rejilla">
    <div><label>Empleado</label>${emp.length ? `<select name="solicitante">${opciones(emp.map(e => e.nombre), solicitanteDefecto())}</select>` : `<input name="solicitante" required value="${esc(solicitanteDefecto())}">`}</div>
    <div><label>Desde</label><input type="date" name="desde" required></div>
    <div><label>Hasta</label><input type="date" name="hasta" required></div>
    <div><label>Días hábiles</label><input name="dias" id="dias" readonly></div>
    <div class="ancho"><label>Comentario</label><textarea name="descripcion"></textarea></div>
  </div><div class="acciones"><button>Enviar</button></div></form>`;
  $('#f').oninput = () => { const d = datosForm($('#f')); $('#dias').value = diasHabiles(d.desde, d.hasta) || ''; };
  $('#f').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target, d = datosForm(f), dias = diasHabiles(d.desde, d.hasta);
    if (!dias) return aviso('Revisá las fechas: la fecha final no puede ser antes que la inicial.', true);
    ocupado(f, true);
    try { await guardarSolicitud({ tipo: 'vacacion', solicitante: d.solicitante, correo: S.user.email, monto: 0, descripcion: d.descripcion || `Vacaciones del ${d.desde} al ${d.hasta}`, datos: { desde: d.desde, hasta: d.hasta, dias } }); }
    catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
}

// ---------- facturas (revisión SAR) ----------
const RE_NUM = /^\d{3}-\d{3}-\d{2}-\d{8}$/;
const RE_CAI = /^[0-9A-F]{6}-[0-9A-F]{6}-[0-9A-F]{6}-[0-9A-F]{6}-[0-9A-F]{6}-[0-9A-F]{2}$/i;
function revisarFactura(d) {
  const errs = [], avisos = [];
  const esFactura = d.tipo_documento === 'Factura';
  if (esFactura) {
    if (!RE_NUM.test(d.numero)) errs.push('El número debe tener el formato 000-001-01-00000001.');
    if (!RE_CAI.test(d.cai)) errs.push('El CAI no tiene el formato del SAR (6 grupos, 37 caracteres).');
    if (!d.fecha_limite) errs.push('Falta la fecha límite de emisión.');
    else if (d.fecha_emision && d.fecha_emision > d.fecha_limite) errs.push('La factura se emitió después de la fecha límite del CAI.');
    const r = String(d.rango || '').match(/(\d{3}-\d{3}-\d{2}-\d{8}).*?(\d{3}-\d{3}-\d{2}-\d{8})/);
    if (!r) errs.push('Escribí el rango autorizado completo (del … al …).');
    else if (RE_NUM.test(d.numero)) {
      const pre = x => x.slice(0, 13), cor = x => +x.slice(-8);
      if (pre(d.numero) !== pre(r[1]) || cor(d.numero) < cor(r[1]) || cor(d.numero) > cor(r[2])) errs.push('El número no está dentro del rango autorizado.');
    }
  }
  if (!/^\d{14}$/.test(String(d.rtn_emisor || '').replace(/\D/g, ''))) errs.push('El RTN del emisor debe tener 14 dígitos.');
  const ex = num(d.exento), gr = num(d.gravado), isv = num(d.isv), tot = num(d.total), tasa = num(S.leyes.ISV_PCT || 15) / 100;
  if (Math.abs(isv - gr * tasa) > 1) errs.push(`El ISV debería ser ${L(gr * tasa)} (el ${S.leyes.ISV_PCT || 15} % de lo gravado).`);
  if (Math.abs(ex + gr + isv - tot) > 0.05) errs.push(`El total no cuadra: exento + gravado + ISV = ${L(ex + gr + isv)}.`);
  if (d.fecha_emision && d.fecha_emision > hoy()) errs.push('La fecha de emisión está en el futuro.');
  let tipo_retencion = '', retencion = 0;
  if (d.persona_natural === 'si' && /honorario|servicio profesional|comisi/i.test(d.tipo_gasto)) {
    tipo_retencion = `ISR honorarios ${S.leyes.RETENCION_HONORARIOS_PCT || 12.5} %`; retencion = (ex + gr) * num(S.leyes.RETENCION_HONORARIOS_PCT || 12.5) / 100;
  } else if (/^s[ií]/i.test(S.cfg.AGENTE_RETENCION_1 || '') && (ex + gr) > 0) {
    tipo_retencion = `Retención ${S.leyes.RETENCION_1_PCT || 1} %`; retencion = (ex + gr) * num(S.leyes.RETENCION_1_PCT || 1) / 100;
  }
  if (retencion) avisos.push(`Hay que retener ${L(retencion)} (${tipo_retencion}). Se paga ${L(tot - retencion)}.`);
  return { errs, avisos, tipo_retencion, retencion: Math.round(retencion * 100) / 100 };
}
async function formFactura() {
  const sol = await q(sb.from('solicitudes').select('id,numero,descripcion').eq('org_id', S.org.id).in('tipo', ['compra', 'fondo']).eq('estado', 'Autorizada').order('creado', { ascending: false }).limit(100));
  app().innerHTML = cabecera('Registrar factura') + `
  <form class="caja" id="f"><div class="rejilla">
    <div><label>Tipo de documento</label><select name="tipo_documento">${opciones(['Factura', 'Recibo por honorarios', 'Nota de débito', 'Nota de crédito', 'Recibo sin CAI'])}</select></div>
    <div><label>Número de factura</label><input name="numero" placeholder="000-001-01-00000001"></div>
    <div class="ancho"><label>CAI</label><input name="cai" placeholder="XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XX" style="text-transform:uppercase"></div>
    <div class="ancho"><label>Rango autorizado</label><input name="rango" placeholder="000-001-01-00000001 al 000-001-01-00005000"></div>
    <div><label>Fecha de emisión</label><input type="date" name="fecha_emision" required value="${hoy()}"></div>
    <div><label>Fecha límite de emisión</label><input type="date" name="fecha_limite"></div>
    <div><label>RTN del emisor</label><input name="rtn_emisor" inputmode="numeric" required></div>
    <div><label>Nombre del emisor</label><input name="emisor" required></div>
    <div><label>¿Es persona natural?</label><select name="persona_natural"><option value="no">No, es empresa</option><option value="si">Sí</option></select></div>
    <div><label>Tipo de gasto</label><select name="tipo_gasto">${opciones(['Bienes', 'Servicios', 'Honorarios profesionales', 'Comisiones', 'Alquiler', 'Combustible', 'Alimentación', 'Viáticos', 'Otro'])}</select></div>
    <div class="ancho"><label>Concepto</label><input name="concepto"></div>
    <div><label>Importe exento (L)</label><input name="exento" inputmode="decimal" value="0"></div>
    <div><label>Importe gravado (L)</label><input name="gravado" inputmode="decimal" value="0"></div>
    <div><label>ISV (L)</label><input name="isv" inputmode="decimal" value="0"></div>
    <div><label>Total (L)</label><input name="total" inputmode="decimal" required></div>
    <div class="ancho"><label>Solicitud a la que corresponde (opcional)</label><select name="solicitud_id"><option value="">Ninguna</option>${sol.map(s => `<option value="${s.id}">${esc(s.numero)} · ${esc((s.descripcion || '').slice(0, 70))}</option>`).join('')}</select></div>
  </div>
  <ul class="lista-errores" id="errs"></ul><p class="ok" id="avs"></p>
  <div class="acciones"><button>Registrar factura</button><span class="nota">Se revisa contra las reglas del SAR antes de guardar.</span></div></form>`;
  const f = $('#f');
  f.gravado.oninput = () => { f.isv.value = (num(f.gravado.value) * num(S.leyes.ISV_PCT || 15) / 100).toFixed(2); f.total.value = (num(f.exento.value) + num(f.gravado.value) + num(f.isv.value)).toFixed(2); };
  f.exento.oninput = f.gravado.oninput;
  f.onsubmit = async ev => {
    ev.preventDefault(); const d = datosForm(f); d.cai = d.cai.toUpperCase(); d.rtn_emisor = d.rtn_emisor.replace(/\D/g, '');
    const r = revisarFactura(d);
    $('#errs').innerHTML = r.errs.map(e => `<li>${esc(e)}</li>`).join(''); $('#avs').textContent = r.avisos.join(' ');
    if (r.errs.length && !confirm('La factura tiene observaciones del SAR. ¿Registrarla de todos modos como "con observaciones"?')) return;
    ocupado(f, true);
    try {
      await q(sb.from('facturas').insert({ org_id: S.org.id, solicitud_id: d.solicitud_id || null, registro: S.maestro ? 'Usuario maestro' : S.perfil.nombre, tipo_documento: d.tipo_documento,
        numero: d.numero || null, cai: d.cai || null, fecha_emision: d.fecha_emision, fecha_limite: d.fecha_limite || null, rango: d.rango, rtn_emisor: d.rtn_emisor, emisor: d.emisor,
        persona_natural: d.persona_natural === 'si', concepto: d.concepto, tipo_gasto: d.tipo_gasto, exento: num(d.exento), gravado: num(d.gravado), isv: num(d.isv), total: num(d.total),
        tipo_retencion: r.tipo_retencion, retencion: r.retencion, valida_sar: !r.errs.length, observaciones: r.errs.join(' '), mes_fiscal: d.fecha_emision.slice(0, 7) }));
      aviso(r.errs.length ? 'Factura registrada con observaciones.' : 'Factura registrada y válida.' + (r.retencion ? ' Recordá la retención.' : ''));
      location.hash = '#/facturas';
    } catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
}
async function verFacturas(mes) {
  mes = mes || hoy().slice(0, 7);
  const fac = await q(sb.from('facturas').select('*').eq('org_id', S.org.id).eq('mes_fiscal', mes).order('fecha_emision'));
  const s = k => fac.reduce((a, x) => a + num(x[k]), 0);
  app().innerHTML = cabecera('Facturas') + `
  <div class="filtros"><input type="month" id="mes" value="${mes}"><a class="boton" href="#/factura">+ Registrar factura</a><button class="sec" id="csv">Descargar CSV</button></div>
  <div class="tabla"><table><thead><tr><th>Fecha</th><th>Número</th><th>Emisor</th><th>RTN</th><th class="n">Gravado</th><th class="n">ISV</th><th class="n">Total</th><th class="n">Retención</th><th>SAR</th></tr></thead><tbody>
  ${fac.map(x => `<tr><td>${esc(x.fecha_emision)}</td><td>${esc(x.numero || x.tipo_documento)}</td><td>${esc(x.emisor)}</td><td>${esc(x.rtn_emisor)}</td><td class="n">${L(x.gravado)}</td><td class="n">${L(x.isv)}</td><td class="n">${L(x.total)}</td><td class="n">${x.retencion ? L(x.retencion) : ''}</td><td>${x.valida_sar ? '<span class="estado e-Autorizada">Válida</span>' : `<span class="estado e-Rechazada" title="${esc(x.observaciones)}">Revisar</span>`}</td></tr>`).join('') || '<tr><td colspan="9" class="nota">No hay facturas en este mes.</td></tr>'}
  </tbody>${fac.length ? `<tfoot><tr><th colspan="4">Totales del mes (${fac.length})</th><th class="n">${L(s('gravado'))}</th><th class="n">${L(s('isv'))}</th><th class="n">${L(s('total'))}</th><th class="n">${L(s('retencion'))}</th><th></th></tr></tfoot>` : ''}</table></div>
  <p class="nota">El ISV pagado en compras (${L(s('isv'))}) es crédito fiscal para la declaración del mes. Las retenciones se enteran al SAR a más tardar el día 10 del mes siguiente.</p>`;
  $('#mes').onchange = e => location.hash = '#/facturas/' + e.target.value;
  $('#csv').onclick = () => {
    const cols = ['fecha_emision', 'tipo_documento', 'numero', 'cai', 'rtn_emisor', 'emisor', 'exento', 'gravado', 'isv', 'total', 'tipo_retencion', 'retencion', 'valida_sar', 'observaciones'];
    const csv = [cols.join(','), ...fac.map(x => cols.map(c => '"' + String(x[c] ?? '').replace(/"/g, '""') + '"').join(','))].join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' })); a.download = `facturas-${mes}.csv`; a.click();
  };
}

// ---------- solicitudes ----------
async function verSolicitudes() {
  const p = new URLSearchParams(sessionStorage.getItem('sig_filtro') || (esJefe() ? 'estado=Pendiente' : ''));
  let qy = sb.from('solicitudes').select('id,numero,tipo,creado,solicitante,estado,monto,descripcion').eq('org_id', S.org.id).order('creado', { ascending: false }).limit(200);
  if (p.get('estado')) qy = qy.eq('estado', p.get('estado'));
  if (p.get('tipo')) qy = qy.eq('tipo', p.get('tipo'));
  const filas = await q(qy);
  app().innerHTML = cabecera(esJefe() ? 'Autorizaciones' : 'Mis solicitudes') + `
  <div class="filtros"><select id="fe"><option value="">Todos los estados</option>${opciones(['Pendiente', 'Autorizada', 'Rechazada', 'Anulada'], p.get('estado'))}</select>
  <select id="ft"><option value="">Todos los tipos</option>${Object.entries(TIPOS).map(([k, v]) => `<option value="${k}" ${k === p.get('tipo') ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
  <div class="tabla"><table><thead><tr><th>Número</th><th>Fecha</th><th>Tipo</th><th>Solicitante</th><th>Descripción</th><th class="n">Monto</th><th>Estado</th></tr></thead><tbody>
  ${filas.map(x => `<tr><td><a href="#/solicitud/${x.id}">${esc(x.numero)}</a></td><td>${fecha(x.creado)}</td><td>${TIPOS[x.tipo]}</td><td>${esc(x.solicitante)}</td><td>${esc((x.descripcion || '').slice(0, 80))}</td><td class="n">${x.monto ? L(x.monto) : ''}</td><td><span class="estado e-${x.estado}">${x.estado}</span></td></tr>`).join('') || '<tr><td colspan="7" class="nota">No hay solicitudes con ese filtro.</td></tr>'}
  </tbody></table></div>`;
  const cambiar = () => { const n = new URLSearchParams(); if ($('#fe').value) n.set('estado', $('#fe').value); if ($('#ft').value) n.set('tipo', $('#ft').value); sessionStorage.setItem('sig_filtro', n.toString() || 'x=1'); verSolicitudes(); };
  $('#fe').onchange = cambiar; $('#ft').onchange = cambiar;
}
async function verSolicitud(id) {
  const s = await q(sb.from('solicitudes').select('*').eq('id', id).single());
  const d = s.datos || {};
  let extra = '';
  if (s.tipo === 'compra' && d.cotizaciones) extra = `<h2>Cotizaciones</h2><div class="tabla"><table><thead><tr><th>#</th><th>Proveedor</th><th class="n">Monto</th><th>Condiciones</th></tr></thead><tbody>${d.cotizaciones.map(c => `<tr><td>${c.n}${c.n === d.elegida ? ' ✔' : ''}</td><td>${esc(c.proveedor)}</td><td class="n">${L(c.monto)}</td><td>${esc(c.condiciones)}</td></tr>`).join('')}</tbody></table></div>${d.justificacion ? `<p><b>Justificación:</b> ${esc(d.justificacion)}</p>` : ''}`;
  if (s.tipo === 'fondo') extra = `<dl class="detalle"><dt>Actividad</dt><dd>${esc(d.fecha_actividad)}</dd><dt>Liquidará el</dt><dd>${esc(d.fecha_liquidar || '—')}</dd><dt>Detalle</dt><dd>${esc(d.detalle || '—')}</dd></dl>${s.estado === 'Autorizada' ? `<div class="acciones"><a class="boton sec" href="#/liquidacion/${s.id}">Liquidar este fondo</a></div>` : ''}`;
  if (s.tipo === 'liquidacion') extra = `<dl class="detalle"><dt>Fondo</dt><dd>${esc(d.fondo)} · ${L(d.monto_fondo)}</dd><dt>Gastado</dt><dd>${L(d.total_gastos)}</dd><dt>Resultado</dt><dd>${d.diferencia > 0 ? 'Devuelve ' + L(d.diferencia) : d.diferencia < 0 ? 'Se le reintegra ' + L(-d.diferencia) : 'Cuadra exacto'}</dd></dl>`;
  if (s.tipo === 'vacacion') extra = `<dl class="detalle"><dt>Fechas</dt><dd>${esc(d.desde)} al ${esc(d.hasta)}</dd><dt>Días hábiles</dt><dd>${esc(d.dias)}</dd></dl>`;
  if (s.tipo === 'laboral' && d.rubros) extra = `<dl class="detalle"><dt>Motivo</dt><dd>${esc(d.motivo)}</dd><dt>Período</dt><dd>${esc(d.ingreso)} al ${esc(d.salida)} (${esc(d.antiguedad)})</dd><dt>Salario mensual</dt><dd>${L(d.salario)}</dd></dl>
    <div class="tabla" style="margin-top:10px"><table><thead><tr><th>Rubro</th><th>Base</th><th class="n">Monto</th></tr></thead><tbody>${d.rubros.map(x => `<tr><td>${esc(x.rubro)}</td><td>${esc(x.base)}</td><td class="n">${L(x.monto)}</td></tr>`).join('')}</tbody><tfoot><tr><th colspan="2">Total a pagar</th><th class="n">${L(s.monto)}</th></tr></tfoot></table></div>`;
  if (['compra', 'fondo'].includes(s.tipo) && s.linea) {
    const anio = new Date(s.creado).getFullYear();
    const pr = await sb.from('ejecucion_presupuesto').select('*').eq('org_id', S.org.id).eq('anio', anio).eq('linea', s.linea).eq('proyecto', s.proyecto || '').maybeSingle();
    if (pr.data) { const usado = num(pr.data.ejecutado) + num(pr.data.comprometido), disp = num(pr.data.aprobado) - usado; extra += `<p class="nota">Presupuesto ${esc(s.linea)} ${anio}: aprobado ${L(pr.data.aprobado)}, usado ${L(usado)}, disponible ${L(disp)}${s.estado === 'Pendiente' && disp < num(s.monto) ? ' <b class="error">— no alcanza para esta solicitud</b>' : ''}.</p>`; }
  }
  app().innerHTML = cabecera(`${TIPOS[s.tipo]} ${s.numero}`, '#/solicitudes') + `
  <div class="caja"><span class="estado e-${s.estado}">${s.estado}</span>
  <dl class="detalle"><dt>Solicitante</dt><dd>${esc(s.solicitante)}</dd><dt>Fecha</dt><dd>${fechaHora(s.creado)}</dd>
  ${s.monto ? `<dt>Monto</dt><dd><b>${L(s.monto)}</b></dd>` : ''}${s.linea ? `<dt>Presupuesto</dt><dd>${esc(s.proyecto)} · ${esc(s.linea)}</dd>` : ''}
  ${d.proveedor ? `<dt>Proveedor</dt><dd>${esc(d.proveedor)}</dd>` : ''}<dt>Descripción</dt><dd>${esc(s.descripcion)}</dd>
  ${s.resuelto ? `<dt>Resuelto</dt><dd>${esc(s.resuelto_nombre)} · ${fechaHora(s.resuelto)}${s.comentario ? ' · ' + esc(s.comentario) : ''}</dd>` : ''}</dl>
  ${extra}
  ${esJefe() && s.estado === 'Pendiente' ? `<label style="margin-top:14px">Comentario (opcional)</label><input id="com"><div class="acciones"><button id="aut">Autorizar</button><button class="rojo" id="rec">Rechazar</button></div>` : ''}
  ${esJefe() && s.estado === 'Autorizada' ? `<div class="acciones"><button class="sec" id="anu">Anular</button></div>` : ''}
  <div class="acciones"><button class="sec" onclick="print()">Imprimir</button></div></div>`;
  const resolver = async (estado, pedir) => {
    const comentario = pedir ? prompt('¿Por qué se ' + (estado === 'Anulada' ? 'anula' : 'rechaza') + '?') : $('#com')?.value;
    if (pedir && !comentario) return;
    try { await q(sb.from('solicitudes').update({ estado, comentario: comentario || null }).eq('id', s.id)); avisar('solicitud', s.id); aviso('Solicitud ' + estado.toLowerCase() + '.'); verSolicitud(s.id); }
    catch (e) { aviso(falla(e), true); }
  };
  if ($('#aut')) $('#aut').onclick = () => resolver('Autorizada');
  if ($('#rec')) $('#rec').onclick = () => resolver('Rechazada', !$('#com').value);
  if ($('#anu')) $('#anu').onclick = () => resolver('Anulada', true);
}

// ---------- proveedores ----------
async function verProveedores() {
  const filas = await q(sb.from('proveedores').select('*').eq('org_id', S.org.id).order('nombre'));
  app().innerHTML = cabecera('Proveedores') + `<div class="filtros"><input id="bus" placeholder="Buscar por nombre o RTN"><a class="boton" href="#/proveedor">+ Nuevo proveedor</a><a class="boton sec" href="#/carga/proveedores">Subir varios desde Excel</a></div>
  <div class="tabla"><table><thead><tr><th>Nombre</th><th>RTN</th><th>Contacto</th><th>Teléfono</th><th>Qué vende</th><th></th></tr></thead><tbody id="cuerpo"></tbody></table></div>`;
  const pintar = t => { t = norm(t); $('#cuerpo').innerHTML = filas.filter(p => !t || norm(p.nombre + p.rtn).includes(t)).map(p => `<tr${p.activo ? '' : ' style="opacity:.5"'}><td>${esc(p.nombre)}</td><td>${esc(p.rtn)}</td><td>${esc(p.contacto)}</td><td>${esc(p.telefono)}</td><td>${esc(p.bienes)}</td><td>${esJefe() ? `<a href="#/proveedor/${p.id}">Editar</a>` : ''}</td></tr>`).join('') || '<tr><td colspan="6" class="nota">Sin proveedores.</td></tr>'; };
  $('#bus').oninput = e => pintar(e.target.value); pintar('');
}
async function formProveedor(id) {
  const p = id ? await q(sb.from('proveedores').select('*').eq('id', id).single()) : {};
  const c = (k, t, extra = '') => `<div><label>${t}</label><input name="${k}" value="${esc(p[k])}" ${extra}></div>`;
  app().innerHTML = cabecera(id ? 'Editar proveedor' : 'Nuevo proveedor', '#/proveedores') + `<form class="caja" id="f"><div class="rejilla">
    ${c('nombre', 'Nombre o razón social', 'required')}${c('rtn', 'RTN', 'inputmode="numeric"')}${c('contacto', 'Persona de contacto')}${c('telefono', 'Teléfono')}${c('correo', 'Correo')}${c('direccion', 'Dirección')}
    ${c('bienes', 'Bienes o servicios')}${c('banco', 'Banco')}<div><label>Tipo de cuenta</label><select name="tipo_cuenta">${opciones(['', 'Ahorro', 'Cheques'], p.tipo_cuenta)}</select></div>${c('numero_cuenta', 'Número de cuenta')}${c('titular', 'Titular de la cuenta')}
    ${id ? `<div><label>Estado</label><select name="activo"><option value="true">Activo</option><option value="false" ${p.activo ? '' : 'selected'}>Inactivo</option></select></div>` : ''}
  </div><div class="acciones"><button>Guardar</button></div></form>`;
  $('#f').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target, d = datosForm(f); d.rtn = (d.rtn || '').replace(/\D/g, '');
    if (d.rtn && d.rtn.length !== 14) return aviso('El RTN debe tener 14 dígitos.', true);
    if (id) d.activo = d.activo === 'true'; d.actualizado = new Date().toISOString();
    ocupado(f, true);
    try { if (id) await q(sb.from('proveedores').update(d).eq('id', id)); else await q(sb.from('proveedores').insert({ ...d, org_id: S.org.id })); aviso('Proveedor guardado.'); location.hash = '#/proveedores'; }
    catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
}

// ---------- empleados ----------
async function verEmpleados() {
  const filas = await q(sb.from('empleados').select('*').eq('org_id', S.org.id).order('nombre'));
  app().innerHTML = cabecera('Empleados') + `<div class="filtros"><a class="boton" href="#/empleado">+ Nuevo empleado</a>${esJefe() ? '<a class="boton sec" href="#/carga/empleados">Subir varios desde Excel</a>' : ''}</div>
  <div class="tabla"><table><thead><tr><th>Nombre</th><th>Cargo</th><th>Ingreso</th><th class="n">Salario</th><th class="n">Días de vacaciones</th><th></th></tr></thead><tbody>
  ${filas.map(e => `<tr${e.activo ? '' : ' style="opacity:.5"'}><td>${esc(e.nombre)}</td><td>${esc(e.cargo)}</td><td>${esc(e.fecha_ingreso)}</td><td class="n">${e.salario ? L(e.salario) : ''}</td><td class="n">${e.dias_vacaciones ?? ''}</td><td><a href="#/empleado/${e.id}">Editar</a></td></tr>`).join('') || '<tr><td colspan="6" class="nota">Sin empleados.</td></tr>'}
  </tbody></table></div>`;
}
async function formEmpleado(id) {
  const p = id ? await q(sb.from('empleados').select('*').eq('id', id).single()) : {};
  const c = (k, t, tipo = 'text') => `<div><label>${t}</label><input type="${tipo}" name="${k}" value="${esc(p[k])}"></div>`;
  app().innerHTML = cabecera(id ? 'Editar empleado' : 'Nuevo empleado', '#/empleados') + `<form class="caja" id="f"><div class="rejilla">
    <div><label>Nombre completo</label><input name="nombre" required value="${esc(p.nombre)}"></div>${c('correo', 'Correo', 'email')}${c('cargo', 'Cargo')}${c('identidad', 'Número de identidad')}${c('fecha_ingreso', 'Fecha de ingreso', 'date')}
    ${c('salario', 'Salario mensual (L)')}${c('afiliacion_ihss', 'Afiliación IHSS')}${c('afiliacion_rap', 'Afiliación RAP')}${c('dias_vacaciones', 'Días de vacaciones disponibles')}
    ${id ? `<div><label>Estado</label><select name="activo"><option value="true">Activo</option><option value="false" ${p.activo ? '' : 'selected'}>Inactivo</option></select></div>` : ''}
  </div><div class="acciones"><button>Guardar</button></div></form>`;
  $('#f').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target, d = datosForm(f);
    d.salario = d.salario ? num(d.salario) : null; d.dias_vacaciones = d.dias_vacaciones ? num(d.dias_vacaciones) : null; d.fecha_ingreso = d.fecha_ingreso || null;
    if (id) d.activo = d.activo === 'true';
    ocupado(f, true);
    try { if (id) await q(sb.from('empleados').update(d).eq('id', id)); else await q(sb.from('empleados').insert({ ...d, org_id: S.org.id })); aviso('Empleado guardado.'); location.hash = '#/empleados'; }
    catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
}

// ---------- presupuesto ----------
async function verPresupuesto(anio) {
  anio = +(anio || new Date().getFullYear());
  const filas = await q(sb.from('ejecucion_presupuesto').select('*').eq('org_id', S.org.id).eq('anio', anio).order('linea'));
  const alerta = num(S.cfg.PRESUPUESTO_AVISO_PCT || 85);
  const tot = k => filas.reduce((a, x) => a + num(x[k]), 0);
  app().innerHTML = cabecera('Presupuesto ' + anio) + `
  <div class="filtros"><select id="anio">${[anio - 1, anio, anio + 1].map(a => `<option ${a === anio ? 'selected' : ''}>${a}</option>`).join('')}</select></div>
  <div class="tabla"><table><thead><tr><th>Proyecto</th><th>Línea</th><th class="n">Aprobado</th><th class="n">Ejecutado</th><th class="n">Comprometido</th><th class="n">Disponible</th><th>Uso</th></tr></thead><tbody>
  ${filas.map(x => { const u = num(x.ejecutado) + num(x.comprometido), pct = num(x.aprobado) ? u / num(x.aprobado) * 100 : 0; return `<tr><td>${esc(x.proyecto)}</td><td>${esc(x.linea)}</td><td class="n">${L(x.aprobado)}</td><td class="n">${L(x.ejecutado)}</td><td class="n">${L(x.comprometido)}</td><td class="n">${L(num(x.aprobado) - u)}</td><td><div class="barra-pres" title="${pct.toFixed(0)} %"><i class="${pct > 100 ? 'pasado' : pct >= alerta ? 'alto' : ''}" style="width:${Math.min(pct, 100)}%"></i></div></td></tr>`; }).join('') || '<tr><td colspan="7" class="nota">Todavía no hay presupuesto cargado para este año.</td></tr>'}
  </tbody>${filas.length ? `<tfoot><tr><th colspan="2">Total</th><th class="n">${L(tot('aprobado'))}</th><th class="n">${L(tot('ejecutado'))}</th><th class="n">${L(tot('comprometido'))}</th><th class="n">${L(tot('aprobado') - tot('ejecutado') - tot('comprometido'))}</th><th></th></tr></tfoot>` : ''}</table></div>
  ${esJefe() ? `<h2>Cargar o cambiar un monto aprobado</h2><form class="caja" id="f"><div class="rejilla">${camposPresupuesto()}<div><label>Monto aprobado ${anio} (L)</label><input name="aprobado" required inputmode="decimal"></div></div><div class="acciones"><button>Guardar</button></div></form>` : ''}`;
  $('#anio').onchange = e => location.hash = '#/presupuesto/' + e.target.value;
  if ($('#f')) $('#f').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target, d = datosForm(f); ocupado(f, true);
    try { await q(sb.from('presupuesto').upsert({ org_id: S.org.id, anio, proyecto: d.proyecto || '', linea: d.linea, aprobado: num(d.aprobado) }, { onConflict: 'org_id,anio,proyecto,linea' })); aviso('Presupuesto actualizado.'); verPresupuesto(anio); }
    catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
}

// ---------- configuración ----------
const CFG_TEXTO = {
  COTIZACION_1_HASTA: 'Compras hasta este monto piden 1 cotización (L)', COTIZACION_2_HASTA: 'Compras hasta este monto piden 2 cotizaciones; arriba, 3 (L)',
  PRESUPUESTO_AVISO_PCT: 'Avisar cuando una línea pase este % de uso', AGENTE_RETENCION_1: '¿La organización es agente de retención del 1 %? (Sí/No)',
  LINEAS_PRESUPUESTO: 'Líneas de presupuesto (una por renglón)', PROYECTOS: 'Proyectos o fondos (uno por renglón)', AREAS: 'Áreas (una por renglón)'
};
async function verConfig() {
  const filas = await q(sb.from('configuracion').select('*').eq('org_id', S.org.id).eq('secreta', false));
  const val = Object.fromEntries(filas.map(x => [x.clave, x.valor]));
  const internas = k => /^KOBO_(ULT_|MEDIA_|SINC_|ULTIMA_)/.test(k);
  const claves = [...new Set([...Object.keys(CFG_TEXTO), ...filas.map(x => x.clave)])].filter(k => !internas(k));
  const largo = k => /LINEAS|PROYECTOS|AREAS|DESTINOS|ENLACES|INSUMOS|BODEGAS|PROVISION/.test(k);
  app().innerHTML = cabecera('Configuración de ' + S.org.nombre) + `<form class="caja" id="f"><div class="rejilla">
    ${claves.map(k => `<div class="${largo(k) ? 'ancho' : ''}"><label>${esc(CFG_TEXTO[k] || k)}</label>${largo(k) ? `<textarea name="${k}" rows="5">${esc(lista(val[k]).join('\n'))}</textarea>` : CFG_OPC[k] ? `<select name="${k}">${CFG_OPC[k].map(o => `<option ${o === val[k] ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>` : `<input name="${k}" value="${esc(val[k])}">`}</div>`).join('')}
  </div><div class="acciones"><button>Guardar cambios</button></div></form>
  ${esAdmin() ? `<h2>Clave de Kobo</h2><form class="caja" id="fk"><p class="nota" id="kEstado">Revisando…</p><div class="rejilla"><div class="ancho"><label>Clave API de KoboToolbox (en Kobo: Configuración de la cuenta › Seguridad › Clave API)</label><input name="clave" type="password" autocomplete="off" required></div></div><div class="acciones"><button>Guardar clave</button></div></form>` : ''}
  ${esAdmin() ? `<h2>Claves de los paneles de control</h2><form class="caja" id="fpn"><p class="nota" id="pnEstado">Revisando…</p><div class="rejilla">${Object.entries(SECCIONES).map(([k, v]) => `<div><label>Panel de ${v}</label><input name="${k}" type="password" autocomplete="new-password" placeholder="Dejar vacío para no cambiar"></div>`).join('')}</div><p class="nota">Mínimo 6 caracteres. Quién entra a cada panel se marca en <a href="#/usuarios">Usuarios</a>.</p><div class="acciones"><button>Guardar claves</button></div></form>
  <h2>Copias de seguridad</h2><div class="caja"><p class="nota">Guarda todos los datos de ${esc(S.org.nombre)} en dos archivos: un Excel para revisar (una hoja por tabla) y un respaldo completo para recuperar todo si hiciera falta. Las copias quedan guardadas aquí y no se pueden borrar desde la aplicación.</p><div class="acciones"><button id="hacerCopia">Sacar copia de seguridad ahora</button></div><div id="copias" style="margin-top:12px"></div></div>` : ''}
  ${esAdmin() ? `<h2>Correos de aviso</h2><div class="caja"><p class="nota">Los avisos de solicitudes, créditos y quejas salen a: <b>${esc(S.cfg.CORREO_AVISOS || '(sin correo)')}</b>. Se cambia arriba en «Correo que recibe los avisos». Además, a cada persona le llega el resultado de lo que pidió si tiene correo en Usuarios.</p><div class="acciones"><button class="sec" id="probarCorreo">Mandar un correo de prueba</button></div></div>` : ''}
  <h2>Valores de ley</h2><div class="caja"><p class="nota">Estos valores los define la organización maestra y aplican a todas.</p><dl class="detalle">${Object.entries(S.leyes).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>${S.maestro ? '<a href="#/orgs">Cambiar valores de ley</a>' : ''}</div>`;
  const fpn = $('#fpn');
  if (fpn) {
    sb.rpc('claves_panel_puestas', { o: S.org.id }).then(({ data }) => { const p = data || []; $('#pnEstado').textContent = Object.entries(SECCIONES).map(([k, v]) => `${v}: ${p.includes(k) ? 'tiene clave' : 'sin clave'}`).join(' · '); });
    fpn.onsubmit = async ev => {
      ev.preventDefault(); const d = datosForm(fpn), puestas = Object.entries(d).filter(([, v]) => v);
      if (!puestas.length) return aviso('Escribí al menos una clave.', true);
      if (puestas.some(([, v]) => v.length < 6)) return aviso('Cada clave debe tener al menos 6 caracteres.', true);
      ocupado(fpn, true);
      try { for (const [sec, clave] of puestas) await q(sb.rpc('poner_clave_panel', { o: S.org.id, sec, clave })); aviso('Claves guardadas.'); verConfig(); }
      catch (e) { ocupado(fpn, false); aviso(falla(e), true); }
    };
    const copias = async () => {
      try {
        const l = (await fnArchivo({ accion: 'listar', seccion: 'cfg' })).archivos || [];
        $('#copias').innerHTML = l.length ? `<div class="tabla"><table><tbody>${l.map(a => `<tr><td>${esc(a.nombre)}</td><td class="nota">${esc(a.momento)}</td><td class="nota">${fechaHora(a.creado)}</td><td class="n nota">${tamano(a.bytes || 0)}</td><td class="n"><button class="sec" data-copia="${a.id}">Descargar</button></td></tr>`).join('')}</tbody></table></div>` : '<p class="nota">Todavía no hay copias.</p>';
        $('#copias').querySelectorAll('[data-copia]').forEach(b => b.onclick = async () => { b.disabled = true; try { const { url } = await fnArchivo({ accion: 'url', seccion: 'cfg', id: b.dataset.copia }); location.href = url; } catch (e) { aviso(falla(e), true); } finally { b.disabled = false; } });
      } catch (e) { $('#copias').innerHTML = `<p class="error">${esc(falla(e))}</p>`; }
    };
    copias();
    $('#hacerCopia').onclick = async () => {
      const b = $('#hacerCopia'); b.disabled = true; b.textContent = 'Sacando la copia…';
      try { const r = await fnArchivo({ accion: 'copia' }); aviso('Copia de seguridad lista.'); await copias(); const x = (r.copias || []).find(c => c.momento === 'Excel'); if (x) { const { url } = await fnArchivo({ accion: 'url', seccion: 'cfg', id: x.id }); location.href = url; } }
      catch (e) { aviso(falla(e), true); } finally { b.disabled = false; b.textContent = 'Sacar copia de seguridad ahora'; }
    };
  }
  const pc = $('#probarCorreo');
  if (pc) pc.onclick = async () => {
    pc.disabled = true;
    try { const { data, error } = await sb.functions.invoke('avisos', { body: { tipo: 'prueba', id: S.org.id } }); if (error) throw error; aviso(data.estado === 'enviado' ? 'Correo enviado a ' + data.para.join(', ') : 'No se envió: ' + (data.detalle || data.estado || data.error), data.estado !== 'enviado'); }
    catch (e) { aviso(falla(e), true); } finally { pc.disabled = false; }
  };
  const fk = $('#fk');
  if (fk) {
    sb.rpc('tiene_secreto', { o: S.org.id, k: 'KOBO_TOKEN' }).then(({ data }) => { $('#kEstado').textContent = data ? 'Ya hay una clave guardada. Si escribís otra, reemplaza la anterior.' : 'Todavía no hay clave: sin ella Kobo no se conecta.'; });
    fk.onsubmit = async ev => {
      ev.preventDefault(); const v = fk.clave.value.trim();
      if (v.length < 20) return aviso('Esa clave parece incompleta (la de Kobo tiene 40 caracteres).', true);
      ocupado(fk, true);
      try { await q(sb.from('configuracion').upsert({ org_id: S.org.id, clave: 'KOBO_TOKEN', valor: v, secreta: true }, { onConflict: 'org_id,clave' })); await q(sb.from('bitacora').insert({ org_id: S.org.id, usuario: nombreQuien(), accion: 'Guardó la clave de Kobo' })); aviso('Clave guardada.'); if (!S.org.es_maestra) { location.hash = '#/kobo'; return; } verConfig(); }
      catch (e) { ocupado(fk, false); aviso(falla(e), true); }
    };
  }
  $('#f').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target, d = datosForm(f); ocupado(f, true);
    const filasN = Object.entries(d).map(([clave, valor]) => ({ org_id: S.org.id, clave, valor: largo(clave) ? lista(valor).join('\n') : valor }));
    try { await q(sb.from('configuracion').upsert(filasN, { onConflict: 'org_id,clave' })); await q(sb.from('bitacora').insert({ org_id: S.org.id, usuario: S.maestro ? 'Usuario maestro' : S.perfil.nombre, accion: 'Cambió la configuración' })); await cargarOrg(); aviso('Configuración guardada.'); ocupado(f, false); }
    catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
}

// ---------- usuarios ----------
// Pide a la función «avisos» que mande el correo que corresponda (no detiene la pantalla si falla)
// y deja listo el PDF de respaldo de lo que se acaba de registrar o resolver
const avisar = (tipo, id) => { archivarLuego(true); return sb.functions.invoke('avisos', { body: { tipo, id } }).catch(() => {}); };
async function funcionUsuarios(cuerpo) {
  const { data, error } = await sb.functions.invoke('usuarios', { body: cuerpo });
  if (error) { let m = error.message; try { m = (await error.context.json()).error || m; } catch (_) {} throw new Error(m); }
  if (data?.error) throw new Error(data.error);
  return data;
}
const SECCIONES = { adm: 'Administración', cre: 'Crédito interno', cer: 'Certificaciones' };
// Tipos de registro que pueden pedir aprobación (perfiles.aprueba)
const TIPOS_REV = { productores: 'Padrón de productores', inspecciones: 'Inspecciones internas', no_conformidades: 'No conformidades', insumos_aplicados: 'Insumos aplicados', capacitaciones: 'Ayudas memoria de capacitación', acopio: 'Acopio', beneficiado: 'Beneficiado y secado', despachos: 'Despachos', prima_uso: 'Uso de la prima', quejas: 'Quejas' };
const checksSec = (marcadas, attr, extra = '') => Object.entries(SECCIONES).map(([k, v]) => `<label style="font-weight:400;color:var(--texto);display:inline-flex;gap:5px;align-items:center;margin:0 10px 4px 0"><input type="checkbox" ${attr}="${k}" ${extra} style="width:auto" ${marcadas.includes(k) ? 'checked' : ''}>${v}</label>`).join('');
async function verUsuarios() {
  const filas = await q(sb.from('perfiles').select('*').eq('org_id', S.org.id).order('nombre'));
  const yo = nombreQuien();
  app().innerHTML = cabecera('Usuarios de ' + S.org.nombre, '#/') + `
  <p class="nota">El rol dice qué puede hacer (Personal registra; Gerencia además autoriza; Administrador además maneja usuarios, configuración y el Panel de control). Las secciones dicen a qué partes entra. «Ve el panel de» dice quién entra al panel de control de cada sección (además necesita la clave del panel). «Comité de crédito» marca a quienes votan los créditos. «Aprueba» dice qué registros revisa y aprueba cada persona: lo que llega de Kobo o se registra de ese tipo queda pendiente hasta que alguien lo apruebe, y al aprobarlo se guarda el PDF final. Si nadie aprueba un tipo, ese tipo no se detiene.</p>
  <div class="tabla"><table><thead><tr><th>Persona</th><th>Usuario</th><th>Rol</th><th>Secciones</th><th>Aprueba</th><th>Último acceso</th><th>Estado</th><th></th></tr></thead><tbody>
  ${filas.map(u => `<tr><td><b>${esc(u.nombre)}</b>${u.cargo ? '<br><span class="nota">' + esc(u.cargo) + '</span>' : ''}${u.correo ? '<br><span class="nota">' + esc(u.correo) + '</span>' : ''}</td><td>${esc(u.usuario)}</td>
  <td><select data-rol="${u.id}" ${u.id === S.user.id ? 'disabled' : ''}>${Object.entries(ROLES).filter(([k]) => k !== 'maestro').map(([k, v]) => `<option value="${k}" ${k === u.rol ? 'selected' : ''}>${v}</option>`).join('')}</select></td>
  <td style="min-width:170px">${u.rol === 'administrador' ? '<span class="nota">Todas</span><br>' : checksSec(u.secciones || [], 'data-sec', `data-u="${u.id}"`)}${u.rol === 'administrador' ? '' : `<br><span class="nota">Ve el panel de:</span><br>${checksSec(u.paneles || [], 'data-pnl', `data-u="${u.id}"`)}`}<label style="font-weight:400;color:var(--texto);display:inline-flex;gap:5px;align-items:center;margin:0"><input type="checkbox" data-comite="${u.id}" style="width:auto" ${u.comite_credito ? 'checked' : ''}>Comité de crédito</label></td>
  <td style="min-width:190px">${Object.entries(TIPOS_REV).map(([k, v]) => `<label style="font-weight:400;color:var(--texto);display:flex;gap:5px;align-items:center;margin:0 0 3px"><input type="checkbox" data-apr="${k}" data-u="${u.id}" style="width:auto" ${(u.aprueba || []).includes(k) ? 'checked' : ''}>${v}</label>`).join('')}</td>
  <td>${fechaHora(u.ultimo_acceso) || 'Nunca'}</td><td>${u.activo ? 'Activo' : '<span class="error">Desactivado</span>'}</td>
  <td style="white-space:nowrap"><button class="sec" data-datos="${u.id}">Datos</button> <button class="sec" data-clave="${u.id}">Clave</button> ${u.id !== S.user.id ? `<button class="sec" data-activo="${u.id}" data-v="${!u.activo}">${u.activo ? 'Desactivar' : 'Activar'}</button>` : ''}</td></tr>`).join('') || '<tr><td colspan="8" class="nota">Todavía no hay usuarios.</td></tr>'}
  </tbody></table></div>
  <h2>Nuevo usuario</h2><form class="caja" id="f"><div class="rejilla">
    <div><label>Nombre completo</label><input name="nombre" required></div>
    <div><label>Cargo</label><input name="cargo" placeholder="Ej.: Contadora, Técnico de campo"></div>
    <div><label>Usuario (para entrar)</label><input name="usuario" required autocapitalize="none" placeholder="Ej.: maria"></div>
    <div><label>Rol</label><select name="rol"><option value="personal">Personal</option><option value="gerencia">Gerencia</option><option value="administrador">Administrador</option></select></div>
    <div><label>Correo (para avisos)</label><input name="correo" type="email"></div>
    <div><label>Contraseña inicial</label><input name="clave" type="password" minlength="8" required autocomplete="new-password"></div>
    <div class="ancho"><label>Secciones a las que entra</label>${checksSec(['adm', 'cre', 'cer'], 'name="sec" value')}</div>
  </div><p class="nota">La persona entra con Organización: <b>${esc(S.org.nombre)}</b>, su usuario y esta contraseña.</p><div class="acciones"><button>Crear usuario</button></div></form>`;
  const bit = (accion, detalle) => q(sb.from('bitacora').insert({ org_id: S.org.id, usuario: yo, accion, detalle }));
  $('#f').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target, d = datosForm(f), secciones = [...f.querySelectorAll('input[name=sec]:checked')].map(x => x.value); delete d.sec;
    const cargo = d.cargo; delete d.cargo; ocupado(f, true);
    try {
      await funcionUsuarios({ accion: 'crear', org_id: S.org.id, ...d });
      await q(sb.from('perfiles').update({ secciones, cargo: cargo || null, correo: d.correo || null }).eq('org_id', S.org.id).eq('usuario', norm(d.usuario)));
      aviso('Usuario creado.'); verUsuarios();
    } catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
  app().querySelectorAll('[data-rol]').forEach(s => s.onchange = async () => {
    try { await q(sb.from('perfiles').update({ rol: s.value }).eq('id', s.dataset.rol)); await bit('Cambió un rol', s.closest('tr').cells[1].textContent + ' → ' + s.value); aviso('Rol actualizado.'); verUsuarios(); }
    catch (e) { aviso(falla(e), true); verUsuarios(); }
  });
  app().querySelectorAll('[data-sec]').forEach(c => c.onchange = async () => {
    const id = c.dataset.u, secciones = [...app().querySelectorAll(`[data-sec][data-u="${id}"]:checked`)].map(x => x.dataset.sec);
    try { await q(sb.from('perfiles').update({ secciones }).eq('id', id)); await bit('Cambió secciones', c.closest('tr').cells[1].textContent + ' → ' + (secciones.map(s => SECCIONES[s]).join(', ') || 'ninguna')); aviso('Secciones actualizadas.'); }
    catch (e) { aviso(falla(e), true); verUsuarios(); }
  });
  app().querySelectorAll('[data-pnl]').forEach(c => c.onchange = async () => {
    const id = c.dataset.u, paneles = [...app().querySelectorAll(`[data-pnl][data-u="${id}"]:checked`)].map(x => x.dataset.pnl);
    try { await q(sb.from('perfiles').update({ paneles }).eq('id', id)); await bit('Cambió paneles', c.closest('tr').cells[1].textContent + ' → ' + (paneles.map(s => SECCIONES[s]).join(', ') || 'ninguno')); aviso('Paneles actualizados.'); }
    catch (e) { aviso(falla(e), true); verUsuarios(); }
  });
  app().querySelectorAll('[data-apr]').forEach(c => c.onchange = async () => {
    const id = c.dataset.u, aprueba = [...app().querySelectorAll(`[data-apr][data-u="${id}"]:checked`)].map(x => x.dataset.apr);
    try { await q(sb.from('perfiles').update({ aprueba }).eq('id', id)); await bit('Cambió lo que aprueba', c.closest('tr').cells[1].textContent + ' → ' + (aprueba.map(s => TIPOS_REV[s]).join(', ') || 'nada')); aviso('Listo. ' + (aprueba.length ? 'Lo nuevo de esos tipos le llegará para aprobar.' : 'Ya no aprueba nada.')); }
    catch (e) { aviso(falla(e), true); verUsuarios(); }
  });
  app().querySelectorAll('[data-comite]').forEach(c => c.onchange = async () => {
    try { await q(sb.from('perfiles').update({ comite_credito: c.checked }).eq('id', c.dataset.comite)); await bit(c.checked ? 'Nombró en el comité de crédito' : 'Quitó del comité de crédito', c.closest('tr').cells[1].textContent); aviso(c.checked ? 'Ahora es del comité de crédito.' : 'Ya no es del comité de crédito.'); }
    catch (e) { aviso(falla(e), true); verUsuarios(); }
  });
  app().querySelectorAll('[data-datos]').forEach(b => b.onclick = async () => {
    const u = filas.find(x => x.id === b.dataset.datos);
    const nombre = prompt('Nombre completo:', u.nombre); if (nombre === null) return;
    const cargo = prompt('Cargo:', u.cargo || ''); if (cargo === null) return;
    const correo = prompt('Correo para avisos:', u.correo || ''); if (correo === null) return;
    try { await q(sb.from('perfiles').update({ nombre: nombre || u.nombre, cargo: cargo || null, correo: correo || null }).eq('id', u.id)); await bit('Cambió datos de usuario', u.usuario); aviso('Datos guardados.'); verUsuarios(); } catch (e) { aviso(falla(e), true); }
  });
  app().querySelectorAll('[data-clave]').forEach(b => b.onclick = async () => {
    const clave = prompt('Nueva contraseña (mínimo 8 caracteres):'); if (!clave) return;
    try { await funcionUsuarios({ accion: 'clave', org_id: S.org.id, id: b.dataset.clave, clave }); aviso('Contraseña cambiada.'); } catch (e) { aviso(falla(e), true); }
  });
  app().querySelectorAll('[data-activo]').forEach(b => b.onclick = async () => {
    try { await funcionUsuarios({ accion: 'activo', org_id: S.org.id, id: b.dataset.activo, activo: b.dataset.v === 'true' }); aviso('Listo.'); verUsuarios(); } catch (e) { aviso(falla(e), true); }
  });
}
const nombreQuien = () => S.maestro ? 'Usuario maestro' : S.perfil.nombre;

// ---------- bitácora ----------
async function verBitacora() {
  const filas = await q(sb.from('bitacora').select('*').eq('org_id', S.org.id).order('fecha', { ascending: false }).limit(300));
  app().innerHTML = cabecera('Bitácora') + `<div class="tabla"><table><thead><tr><th>Fecha</th><th>Usuario</th><th>Acción</th><th>Detalle</th></tr></thead><tbody>
  ${filas.map(b => `<tr><td style="white-space:nowrap">${fechaHora(b.fecha)}</td><td>${esc(b.usuario)}</td><td>${esc(b.accion)}</td><td>${esc(b.detalle)}</td></tr>`).join('') || '<tr><td colspan="4" class="nota">Sin movimientos.</td></tr>'}
  </tbody></table></div><p class="nota">Se muestran los últimos 300 movimientos.</p>`;
}

// ---------- organizaciones y leyes (maestro) ----------
async function verOrgs() {
  if (!S.maestro) return inicio();
  const [orgs, leyes] = await Promise.all([q(sb.from('organizaciones').select('*').order('nombre')), q(sb.from('leyes').select('*').order('clave'))]);
  app().innerHTML = cabecera('Organizaciones') + `
  <div class="tabla"><table><thead><tr><th>Nombre</th><th>RTN</th><th>Estado</th></tr></thead><tbody>
  ${orgs.map(o => `<tr><td>${esc(o.nombre)}${o.es_maestra ? ' <span class="estado e-Autorizada">Maestra</span>' : ''}</td><td>${esc(o.rtn)}</td><td>${o.activa ? 'Activa' : 'Suspendida'}</td></tr>`).join('')}
  </tbody></table></div>
  <h2>Nueva organización</h2><form class="caja" id="fo"><div class="rejilla"><div><label>Nombre</label><input name="nombre" required></div><div><label>RTN</label><input name="rtn"></div></div><div class="acciones"><button>Crear</button></div></form>
  <h2>Valores de ley (aplican a todas)</h2><form class="caja" id="fl"><div class="rejilla">
  ${leyes.map(l => `<div><label>${esc(l.descripcion || l.clave)}</label><input name="${esc(l.clave)}" value="${esc(l.valor)}" required></div>`).join('')}
  </div><div class="acciones"><button>Guardar valores de ley</button></div></form>`;
  $('#fo').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target, d = datosForm(f); ocupado(f, true);
    try {
      const o = await q(sb.from('organizaciones').insert({ nombre: d.nombre, rtn: d.rtn || null }).select().single());
      const base = Object.fromEntries(Object.keys(CFG_TEXTO).map(k => [k, S.cfg[k] ?? '']));
      await q(sb.from('configuracion').insert(Object.entries(base).map(([clave, valor]) => ({ org_id: o.id, clave, valor }))));
      await q(sb.rpc('preparar_org', { o: o.id }));
      S.orgs = await q(sb.from('organizaciones').select('id,nombre,es_maestra,activa').order('nombre')); pintarBarra();
      aviso('Organización creada con la configuración base.'); verOrgs();
    } catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
  $('#fl').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target, d = datosForm(f); ocupado(f, true);
    try {
      await q(sb.from('leyes').upsert(leyes.map(l => ({ clave: l.clave, valor: d[l.clave], descripcion: l.descripcion, actualizado: new Date().toISOString() }))));
      await q(sb.from('bitacora').insert({ org_id: S.org.id, usuario: 'Usuario maestro', accion: 'Cambió valores de ley', detalle: Object.entries(d).map(([k, v]) => k + '=' + v).join(', ') }));
      await cargarOrg(); aviso('Valores de ley actualizados para todas las organizaciones.'); ocupado(f, false);
    } catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
}
