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
const puedeSec = s => S.maestro || S.rol === 'administrador' || (S.permisos || []).includes('sec.' + s) || (S.perfil?.secciones || []).includes(s);
// Permiso por puesto (gerencia y administración pueden todo; sin roles instalados, como antes)
const puede = p => S.maestro || esJefe() || !(S.roles || []).length || (S.permisos || []).includes(p);
function aplicarRol() {
  if (S.maestro) { S.rol = 'maestro'; S.puesto = null; S.permisos = []; return; }
  const r = (S.roles || []).find(x => x.codigo === S.perfil.rol && x.activo);
  S.puesto = r || null;
  S.rol = r ? r.base : (['administrador', 'gerencia'].includes(S.perfil.rol) ? S.perfil.rol : 'personal');
  S.permisos = [...(r?.permisos || []), ...(S.perfil.permisos_extra || []), ...(S.perfil.secciones || []).map(s => 'sec.' + s)];
}
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
const GUIA_DE = { adm: 'adm', compra: 'adm', fondo: 'adm', liquidacion: 'adm', vacacion: 'adm', laboral: 'adm', factura: 'adm', facturas: 'adm', fac: 'adm', presupuesto: 'adm', empleados: 'adm', proveedores: 'adm', solicitudes: 'adm', solicitud: 'adm',
  cre: 'cre', credito: 'cre', creditos: 'cre', cred: 'cre', cartera: 'cre', recordatorios: 'cre', reportescre: 'cre', pago: 'cre', fondos: 'cre', condiciones: 'cre', edocta: 'cre',
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
  S.rol = S.maestro ? 'maestro' : 'personal';
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
  try { localStorage.setItem('sig_sesion', JSON.stringify({ user: { id: S.user.id, email: S.user.email }, perfil: S.perfil, maestro: S.maestro, rol: S.rol, roles: S.roles, orgs: S.orgs, org: S.org, cfg: S.cfg, leyes: S.leyes })); } catch (_) { }
}
function restaurarSinSenal(user) {
  let g = null; try { g = JSON.parse(localStorage.getItem('sig_sesion') || 'null'); } catch (_) { }
  if (!g || g.user?.id !== user?.id) return false;
  Object.assign(S, { user: { ...user, ...g.user }, perfil: g.perfil, maestro: g.maestro, rol: g.rol, orgs: g.orgs || [], org: g.org, cfg: g.cfg || {}, leyes: g.leyes || {}, roles: g.roles || [], sinSenal: true });
  aplicarRol(); pintarBarra(); return true;
}

async function cargarOrg() {
  const [c, l, ro] = await Promise.all([
    sb.from('configuracion').select('clave,valor').eq('org_id', S.org.id),
    sb.from('leyes').select('clave,valor'),
    sb.from('roles').select('*').eq('org_id', S.org.id).order('orden')
  ]);
  if (c.error && sinRed(c.error)) throw c.error;
  S.roles = ro.error ? [] : ro.data || []; aplicarRol();
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
  $('#quien').textContent = S.maestro ? '' : S.perfil.nombre + ' · ' + (S.puesto?.nombre || ROLES[S.rol]);
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
      ${op('#/roles', 'Roles y permisos', 'Qué puede hacer cada puesto')}
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
  'factura': formFactura, 'facturas': verFacturas, 'fac': verFactura, 'solicitudes': verSolicitudes, 'solicitud': verSolicitud,
  'proveedores': verProveedores, 'proveedor': formProveedor, 'empleados': verEmpleados, 'empleado': formEmpleado,
  'presupuesto': verPresupuesto, 'config': verConfig, 'usuarios': verUsuarios, 'bitacora': verBitacora, 'orgs': verOrgs, 'adm': inicio
};
// A qué sección vuelve el botón «Volver» de cada pantalla ('' = portal)
// Claves de Configuración que se escogen de una lista
const CFG_OPC = { CULTIVO_ACOPIO: ['Café', 'Cacao', 'Café y cacao'], ACOPIO_UNIDAD: ['lb', 'qq', 'kg'], COTIZACION_ARCHIVO: ['Sí', 'No'] };
const SECCION_DE = { '': '', adm: 'adm', config: '', usuarios: '', bitacora: '', orgs: '', guia: '', aprobar: '', rev: '' };
['compra', 'fondo', 'liquidacion', 'vacacion', 'factura', 'facturas', 'fac', 'solicitudes', 'solicitud', 'proveedores', 'proveedor', 'empleados', 'empleado', 'presupuesto', 'laboral'].forEach(r => SECCION_DE[r] = 'adm');
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
async function guardarSolicitud(reg, adjuntos = []) {
  reg.org_id = S.org.id;
  const fila = await q(sb.from('solicitudes').insert(reg).select('id,numero').single());
  const fallos = adjuntos.length ? await subirAdjuntos(fila.id, adjuntos) : [];
  avisar('solicitud', fila.id);
  aviso(fallos.length ? `Quedó registrada como ${fila.numero}, pero no se subió: ${fallos.join('; ')}. Subilo desde la solicitud.` : 'Listo. Quedó registrada como ' + fila.numero + (adjuntos.length ? ` con ${adjuntos.length} respaldo${adjuntos.length > 1 ? 's' : ''}` : ''), !!fallos.length);
  location.hash = '#/solicitud/' + fila.id;
}

// ---------- respaldos de solicitudes (cotizaciones, proformas, facturas) ----------
const CLASES_ADJ = ['Cotización', 'Proforma', 'Factura', 'Recibo', 'Otro'];
const ACEPTA_ADJ = 'image/*,application/pdf,.doc,.docx,.xls,.xlsx';
const MAX_ADJ_MB = 10;
function revisarArchivos(lista) { return lista.filter(a => a.archivo.size > MAX_ADJ_MB * 1048576).map(a => `«${a.archivo.name}» pesa más de ${MAX_ADJ_MB} MB.`); }
async function subirAdjuntos(solId, lista) {
  const fallos = [];
  for (const a of lista) {
    try {
      const ruta = `${S.org.id}/solicitudes/${solId}/${Date.now()}-${a.archivo.name.replace(/[^\w.\-]+/g, '_')}`;
      const { error } = await sb.storage.from('documentos').upload(ruta, a.archivo, { contentType: a.archivo.type || undefined });
      if (error) throw error;
      await q(sb.from('solicitud_adjuntos').insert({ org_id: S.org.id, solicitud_id: solId, clase: a.clase || 'Otro', nombre: a.archivo.name, ruta, tipo_mime: a.archivo.type || null, tamano: a.archivo.size, nota: a.nota || null }));
    } catch (e) { fallos.push(a.archivo.name + ' (' + falla(e) + ')'); }
  }
  return fallos;
}
function campoRespaldos(txt = 'Otros respaldos (proformas, fichas técnicas, correos, fotos)') {
  return `<div class="ancho"><label>${txt}</label><input type="file" id="otrosAdj" multiple accept="${ACEPTA_ADJ}"><p class="nota">Fotos, PDF, Word o Excel; hasta ${MAX_ADJ_MB} MB cada uno.</p></div>`;
}
function leerRespaldos(clase = 'Otro') { return [...($('#otrosAdj')?.files || [])].map(archivo => ({ archivo, clase })); }
const esPropia = s => S.user && s.creado_por === S.user.id;

// ---------- respaldos de cualquier registro (facturas, créditos, inspecciones, ayudas memoria, despachos…) ----------
// Uso: <div data-adjuntos="tabla:id:Clase1|Clase2"></div> en la página y luego montarAdjuntos(app()).
const CLASES_REG = {
  facturas: ['Factura escaneada', 'Comprobante de pago', 'Otro'], creditos: ['Comprobante de desembolso', 'Pagaré o contrato', 'Recibo de pago', 'Otro'],
  pagos_credito: ['Recibo de pago', 'Comprobante de depósito', 'Otro'], inspecciones: ['Foto de campo', 'Evidencia de cierre', 'Croquis', 'Otro'],
  no_conformidades: ['Evidencia de cierre', 'Foto', 'Otro'], capacitaciones: ['Lista de asistencia firmada', 'Foto', 'Material usado', 'Otro'],
  acopio: ['Recibo firmado', 'Foto', 'Otro'], beneficiado: ['Registro de fermentación o secado', 'Foto', 'Otro'], despachos: ['Contrato', 'Factura de venta', 'Guía de remisión o BL', 'Certificado de transacción', 'Otro'],
  prima_uso: ['Acta de aprobación', 'Factura o recibo', 'Foto', 'Otro'], proveedores: ['RTN', 'Constancia de pagos a cuenta', 'Otro'], quejas: ['Evidencia', 'Respuesta', 'Otro'],
  insumos_aplicados: ['Factura del insumo', 'Ficha técnica', 'Foto', 'Otro'], empleados: ['Contrato', 'Identidad', 'Otro']
};
function agregarAdjuntos(tabla, id) {
  const c = document.createElement('div'); c.className = 'caja noImprimir'; c.dataset.adjuntos = tabla + ':' + id;
  app().appendChild(c); pintarAdjReg(c, tabla, id);
}
async function montarAdjuntos(raiz) {
  for (const caja of raiz.querySelectorAll('[data-adjuntos]')) {
    const [tabla, id] = caja.dataset.adjuntos.split(':');
    pintarAdjReg(caja, tabla, id);
  }
}
async function pintarAdjReg(caja, tabla, id) {
  let lista;
  try { lista = await q(sb.from('adjuntos').select('*').eq('tabla', tabla).eq('registro_id', id).order('creado')); }
  catch (e) { caja.innerHTML = '<p class="nota">Los respaldos todavía no están instalados (falta el paso 22).</p>'; return; }
  const clases = CLASES_REG[tabla] || ['Respaldo', 'Otro'];
  const kb = n => n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round((n || 0) / 1024)) + ' KB';
  const vivos = lista.filter(a => !a.anulado), quitados = lista.filter(a => a.anulado);
  const quita = a => esJefe() || a.creado_por === S.user?.id;
  caja.innerHTML = `<h2>Respaldos</h2>` + (vivos.length ? `<div class="tabla"><table><thead><tr><th>Tipo</th><th>Archivo</th><th>Subió</th><th></th></tr></thead><tbody>
    ${vivos.map(a => `<tr><td>${esc(a.clase)}</td><td><a href="#" data-doc="${esc(a.ruta)}">${esc(a.nombre)}</a>${a.nota ? `<br><span class="nota">${esc(a.nota)}</span>` : ''}<span class="nota"> · ${kb(a.tamano)}</span></td><td>${esc(a.subido_nombre || '')}<br><span class="nota">${fechaHora(a.creado)}</span></td><td>${quita(a) ? `<button class="sec" data-quitar="${a.id}">Quitar</button>` : ''}</td></tr>`).join('')}
    </tbody></table></div>` : '<p class="nota">Sin respaldos adjuntos.</p>')
    + (quitados.length ? `<details style="margin-top:8px"><summary class="nota">${quitados.length} quitado${quitados.length > 1 ? 's' : ''} (queda el registro)</summary><ul>${quitados.map(a => `<li>${esc(a.nombre)} · quitado por ${esc(a.anulado_nombre || '')} el ${fechaHora(a.anulado_en)}: ${esc(a.motivo || '')}</li>`).join('')}</ul></details>` : '')
    + `<form class="rejilla fAdjR" style="margin-top:10px"><div><label>Tipo de respaldo</label><select name="clase">${opciones(clases, clases[0])}</select></div>
      <div><label>Archivo</label><input type="file" name="arch" multiple required accept="${ACEPTA_ADJ}"></div><div><label>Nota (opcional)</label><input name="nota"></div>
      <div class="acciones" style="align-self:end"><button class="sec">Subir respaldo</button></div></form>`;
  if (typeof verDocumentos === 'function') verDocumentos(caja);
  caja.querySelectorAll('[data-quitar]').forEach(b => b.onclick = async () => {
    const motivo = prompt('¿Por qué se quita este respaldo? (el archivo no se borra, queda en el registro)'); if (!motivo) return;
    try { await q(sb.from('adjuntos').update({ anulado: true, motivo }).eq('id', b.dataset.quitar)); aviso('Respaldo quitado.'); pintarAdjReg(caja, tabla, id); }
    catch (e) { aviso(falla(e), true); }
  });
  const f = caja.querySelector('.fAdjR');
  f.onsubmit = async ev => {
    ev.preventDefault(); const d = datosForm(f), adj = [...f.arch.files].map(archivo => ({ archivo, clase: d.clase, nota: d.nota }));
    const mal = revisarArchivos(adj); if (mal.length) return aviso(mal.join(' '), true);
    ocupado(f, true); const fallos = await subirAdjReg(tabla, id, adj);
    aviso(fallos.length ? 'No se subió: ' + fallos.join('; ') : 'Respaldo subido.', !!fallos.length); pintarAdjReg(caja, tabla, id);
  };
}
async function subirAdjReg(tabla, id, lista) {
  const fallos = [];
  for (const a of lista) {
    try {
      const ruta = `${S.org.id}/adjuntos/${tabla}/${id}/${Date.now()}-${a.archivo.name.replace(/[^\w.\-]+/g, '_')}`;
      const { error } = await sb.storage.from('documentos').upload(ruta, a.archivo, { contentType: a.archivo.type || undefined });
      if (error) throw error;
      await q(sb.from('adjuntos').insert({ org_id: S.org.id, tabla, registro_id: id, clase: a.clase || 'Otro', nombre: a.archivo.name, ruta, tipo_mime: a.archivo.type || null, tamano: a.archivo.size, nota: a.nota || null }));
    } catch (e) { fallos.push(a.archivo.name + ' (' + falla(e) + ')'); }
  }
  return fallos;
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
    ${campoRespaldos()}
  </div>
  <ul class="lista-errores" id="errs"></ul>
  <div class="acciones"><button>Enviar a autorización</button></div></form>`;
  const cots = $('#cots'); let n = 0; const pideArchivo = S.cfg.COTIZACION_ARCHIVO !== 'No';
  const agregar = () => { n++; cots.insertAdjacentHTML('beforeend', `<div class="cot rejilla">
      <div><label>Proveedor ${n}</label><select name="prov${n}">${opProv}</select></div>
      <div><label>Monto con ISV (L)</label><input name="monto${n}" inputmode="decimal"></div>
      <div><label>Entrega / condiciones</label><input name="cond${n}"></div>
      <div><label>Archivo de la cotización ${n}${pideArchivo ? '' : ' (opcional)'}</label><input type="file" name="arch${n}" accept="${ACEPTA_ADJ}"></div></div>`); actualizar(); };
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
    ev.preventDefault(); const f = ev.target, d = datosForm(f), errs = [], cotizaciones = [], adjuntos = [];
    for (let i = 1; i <= n; i++) {
      if (!d['prov' + i] && !num(d['monto' + i])) continue;
      const p = prov.find(x => x.id === d['prov' + i]), arch = f['arch' + i]?.files[0];
      if (arch) adjuntos.push({ archivo: arch, clase: 'Cotización', nota: 'Cotización ' + i + (p ? ' · ' + p.nombre : '') });
      else if (pideArchivo) errs.push(`Falta el archivo de la cotización ${i} (foto o PDF).`);
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
    adjuntos.push(...leerRespaldos()); errs.push(...revisarArchivos(adjuntos));
    $('#errs').innerHTML = errs.map(e => `<li>${esc(e)}</li>`).join(''); if (errs.length) return;
    ocupado(f, true);
    try {
      await guardarSolicitud({ tipo: 'compra', solicitante: d.solicitante, correo: S.user.email, monto: eleg.monto, proyecto: d.proyecto, linea: d.linea, descripcion: d.descripcion,
        datos: { area: d.area, cotizaciones, elegida: eleg.n, proveedor: eleg.proveedor, proveedor_id: eleg.proveedor_id, justificacion: d.justificacion } }, adjuntos);
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
    ${campoRespaldos('Respaldos (cotizaciones, invitación, plan de la actividad)')}
  </div><div class="acciones"><button>Enviar a autorización</button></div></form>`;
  $('#f').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target, d = datosForm(f);
    if (num(d.monto) <= 0) return aviso('Poné un monto mayor que cero.', true);
    const adjuntos = leerRespaldos(), mal = revisarArchivos(adjuntos); if (mal.length) return aviso(mal.join(' '), true);
    ocupado(f, true);
    try { await guardarSolicitud({ tipo: 'fondo', solicitante: d.solicitante, correo: S.user.email, monto: num(d.monto), proyecto: d.proyecto, linea: d.linea, descripcion: d.descripcion, datos: { fecha_actividad: d.fecha_actividad, fecha_liquidar: d.fecha_liquidar, detalle: d.detalle } }, adjuntos); }
    catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
}

// ---------- liquidación ----------
const SAR_VALIDADOR = 'https://oficinavirtual.sar.gob.hn/fac/validador-doc-fiscales/';
async function formLiquidacion(refId) {
  let qy = sb.from('solicitudes').select('id,numero,monto,descripcion,solicitante,proyecto,linea,creado_por').eq('org_id', S.org.id).eq('tipo', 'fondo').in('estado', ['Autorizada', 'Atendida']).order('creado', { ascending: false });
  if (!esJefe()) qy = qy.eq('creado_por', S.user.id);
  const [fondos, liq, provs] = await Promise.all([q(qy),
    q(sb.from('solicitudes').select('referencia,numero,datos').eq('org_id', S.org.id).eq('tipo', 'liquidacion').in('estado', ['Pendiente', 'Autorizada', 'Atendida'])),
    q(sb.from('proveedores').select('id,nombre,rtn').eq('org_id', S.org.id).eq('activo', true).order('nombre')).catch(() => [])]);
  const hechas = new Set(liq.map(x => x.referencia));
  const libres = fondos.filter(x => !hechas.has(x.id));
  if (!libres.length) { app().innerHTML = cabecera('Liquidar fondos') + '<div class="caja">No hay fondos autorizados pendientes de liquidar.</div>'; return; }
  // números de factura ya usados en otras liquidaciones (las que esta persona puede ver), por RTN y número
  const usadas = new Map(); liq.forEach(l => (l.datos?.facturas || []).forEach(x => usadas.set(normFac(x.rtn) + '|' + normFac(x.numero), l.numero)));
  // lo que ya se sabe de cada proveedor: RTN del directorio y de liquidaciones anteriores
  const rtnDe = new Map(provs.filter(p => p.rtn).map(p => [norm(p.nombre), p.rtn]));
  liq.forEach(l => (l.datos?.facturas || []).forEach(x => { if (x.proveedor && x.rtn && !rtnDe.has(norm(x.proveedor))) rtnDe.set(norm(x.proveedor), x.rtn); }));
  const MAX = 30;
  app().innerHTML = cabecera('Liquidar fondos') + `
  <form class="caja" id="f"><div class="rejilla">
    <div class="ancho"><label>Fondo que se liquida</label><select name="ref" id="ref">${libres.map(x => `<option value="${x.id}" ${x.id === refId ? 'selected' : ''}>${esc(x.numero)} · ${esc(x.solicitante)} · ${L(x.monto)} · ${esc((x.descripcion || '').slice(0, 60))}</option>`).join('')}</select></div>
  </div>
  <datalist id="dlProv">${[...new Set([...provs.map(p => p.nombre), ...liq.flatMap(l => (l.datos?.facturas || []).map(x => x.proveedor)).filter(Boolean)])].map(n => `<option value="${esc(n)}">`).join('')}</datalist>
  <h2>Facturas</h2>
  <p class="nota">Llená cada factura y dale Enter para pasar al siguiente dato; en el total, Enter abre la siguiente (hasta ${MAX}). Si el proveedor ya está registrado, el RTN sale solo.</p>
  <div id="facs"></div>
  <div class="acciones" style="justify-content:flex-start"><button type="button" class="sec" id="masFac">+ Otra factura</button><button type="button" id="valFac">Validar facturas</button></div>
  <ul class="lista-errores" id="errFac"></ul><p class="ok" id="okFac"></p>
  <div class="rejilla" style="margin-top:10px">
    <div><label>Total gastado con facturas (L)</label><input name="total_gastos" id="tg" readonly></div>
    <div><label>Facturas que respaldan</label><input name="num_facturas" id="nf" readonly></div>
    <div class="ancho"><div id="resumen" class="caja" style="background:var(--fondo2,#f3f4f1)"></div></div>
    <div class="ancho"><label>Comentarios</label><textarea name="descripcion"></textarea></div>
    ${campoRespaldos('Fotos o PDF de las facturas y recibos')}
  </div>
  <p class="nota">Al autorizarse la liquidación, estas facturas entran solas al libro de compras, amarradas a la liquidación.</p>
  <div class="acciones"><button>Enviar liquidación</button></div></form>`;
  const f = $('#f'), caja = $('#facs');
  const tarjetas = () => [...caja.querySelectorAll('.fac')];
  const campo = (t, c) => t.querySelector(`[data-c=${c}]`);
  const ORDEN = ['numero', 'fecha', 'proveedor', 'rtn', 'descripcion', 'isv', 'total'];
  const leerUna = (t, i) => ({ n: i + 1, numero: campo(t, 'numero').value.trim(), fecha: campo(t, 'fecha').value, proveedor: campo(t, 'proveedor').value.trim(), rtn: campo(t, 'rtn').value.replace(/\D/g, ''),
    descripcion: campo(t, 'descripcion').value.trim(), isv: num(campo(t, 'isv').value), total: num(campo(t, 'total').value), sar: campo(t, 'sar').value, sar_fecha: t.dataset.sarFecha || '', sar_por: t.dataset.sarPor || '' });
  const leer = () => tarjetas().map(leerUna);
  const tieneAlgo = x => x.numero || x.proveedor || x.descripcion || x.total;
  const conDatos = () => leer().filter(tieneAlgo);
  const renumerar = () => tarjetas().forEach((t, i) => t.querySelector('.nfac').textContent = 'Factura ' + (i + 1));
  const agregar = (foco = true) => {
    if (tarjetas().length >= MAX) return aviso(`Llegaste al máximo de ${MAX} facturas en una liquidación.`, true);
    caja.insertAdjacentHTML('beforeend', `<div class="fac caja" style="margin:8px 0;padding:10px">
      <div style="display:flex;justify-content:space-between;align-items:center"><b class="nfac"></b><span class="estFac nota"></span><button type="button" class="sec" data-quitar title="Quitar esta factura">✕</button></div>
      <div class="rejilla">
        <div><label>Número de factura</label><input data-c="numero" placeholder="000-001-01-00000001" autocomplete="off"></div>
        <div><label>Fecha de emisión</label><input data-c="fecha" type="date" max="${hoy()}"></div>
        <div><label>Proveedor</label><input data-c="proveedor" list="dlProv" placeholder="Nombre como sale en la factura" autocomplete="off"></div>
        <div><label>RTN del proveedor</label><input data-c="rtn" inputmode="numeric" maxlength="16" placeholder="14 dígitos" autocomplete="off"></div>
        <div class="ancho"><label>Descripción</label><input data-c="descripcion" placeholder="Qué se compró" autocomplete="off"></div>
        <div><label>ISV de la factura (L, si trae)</label><input data-c="isv" inputmode="decimal" placeholder="0.00" autocomplete="off"></div>
        <div><label>Total (L)</label><input data-c="total" inputmode="decimal" style="font-weight:bold" autocomplete="off"></div>
      </div>
      <div class="acciones" style="justify-content:flex-start;margin-top:6px"><button type="button" class="sec" data-sar>Validar en el SAR ↗</button>
        <label style="display:flex;gap:6px;align-items:center;margin:0">Lo que dijo el SAR <select data-c="sar" style="width:auto"><option value="">Sin validar</option><option>Válida</option><option>No válida</option></select></label></div>
    </div>`);
    renumerar(); $('#masFac').disabled = tarjetas().length >= MAX;
    if (foco) campo(caja.lastElementChild, 'numero').focus();
  };
  const resumir = () => {
    const fo = libres.find(x => x.id === $('#ref').value), l = conDatos(), g = Math.round(l.reduce((a, x) => a + x.total, 0) * 100) / 100, dif = Math.round((num(fo.monto) - g) * 100) / 100;
    const val = l.filter(x => x.sar === 'Válida').length, noVal = l.filter(x => x.sar === 'No válida').length;
    $('#tg').value = g ? g.toFixed(2) : ''; $('#nf').value = l.length || '';
    $('#resumen').innerHTML = `<b>Resumen</b><dl class="detalle" style="margin-top:6px"><dt>Fondo entregado</dt><dd>${L(fo.monto)}</dd><dt>Facturas</dt><dd>${l.length}</dd>
      <dt>Total gastado</dt><dd><b>${L(g)}</b>${l.some(x => x.isv) ? ` (ISV ${L(l.reduce((a, x) => a + x.isv, 0))})` : ''}</dd>
      <dt>Resultado</dt><dd>${!g ? '—' : dif > 0 ? `Devuelve <b>${L(dif)}</b>` : dif < 0 ? `La organización le reintegra <b>${L(-dif)}</b>` : 'Cuadra exacto'}</dd>
      <dt>En el SAR</dt><dd>${val} válida${val === 1 ? '' : 's'}${noVal ? ` · <b class="error">${noVal} NO válida${noVal > 1 ? 's' : ''}</b>` : ''} · ${l.length - val - noVal} sin validar</dd></dl>`;
    tarjetas().forEach(t => { const v = campo(t, 'sar').value; t.querySelector('.estFac').innerHTML = v === 'Válida' ? '<span class="estado e-Autorizada">Válida en el SAR</span>' : v === 'No válida' ? '<span class="estado e-Rechazada">NO válida en el SAR</span>' : ''; });
  };
  const faltas = x => [!x.numero && 'el número', !x.fecha && 'la fecha', !x.proveedor && 'el proveedor', x.rtn.length !== 14 && 'el RTN (14 dígitos)', !x.descripcion && 'la descripción', !(x.total > 0) && 'el total', x.isv > x.total && 'un ISV menor que el total'].filter(Boolean);
  const revisar = () => {
    const l = conDatos(), errs = [], avs = [], vistos = new Map();
    if (!l.length) errs.push('Agregá al menos una factura.');
    l.forEach(x => {
      const fl = faltas(x); if (fl.length) errs.push(`Factura ${x.n}: falta ${fl.join(', ')}.`);
      if (x.numero) {
        const k = normFac(x.rtn) + '|' + normFac(x.numero);
        if (vistos.has(k)) errs.push(`Factura ${x.n}: está repetida (es la misma que la ${vistos.get(k)}).`); else vistos.set(k, x.n);
        if (usadas.has(k)) errs.push(`Factura ${x.n}: ya se usó en la liquidación ${usadas.get(k)}.`);
        if (!RE_NUM.test(x.numero)) avs.push(`Factura ${x.n}: «${x.numero}» no tiene el formato del SAR (000-001-01-00000001). Si es un recibo, está bien.`);
      }
      if (x.sar === 'No válida') avs.push(`Factura ${x.n}: el SAR la dio como NO válida. Así no sirve como respaldo fiscal.`);
    });
    tarjetas().forEach((t, i) => { const x = leerUna(t, i); t.style.borderColor = tieneAlgo(x) && faltas(x).length ? '#dc2626' : x.sar === 'Válida' ? '#16a34a' : ''; });
    $('#errFac').innerHTML = errs.map(e => `<li>${esc(e)}</li>`).join('');
    const sinSar = l.filter(x => !x.sar).length;
    $('#okFac').innerHTML = errs.length ? '' : `Las ${l.length} factura${l.length > 1 ? 's están completas' : ' está completa'}: suman ${L($('#tg').value)}.${sinSar ? ` Faltan ${sinSar} por validar en el SAR.` : ' Todas tienen el resultado del SAR.'}` + (avs.length ? `<br><span class="nota">${avs.map(esc).join('<br>')}</span>` : '');
    return !errs.length;
  };
  // abre el validador del SAR con los datos copiados para pegarlos
  const abrirSar = async t => {
    const x = leerUna(t, 0), fl = [!x.numero && 'el número', !x.fecha && 'la fecha', x.rtn.length !== 14 && 'el RTN'].filter(Boolean);
    if (fl.length) { aviso('Para validarla en el SAR falta ' + fl.join(', ') + '.', true); return false; }
    const datos = `RTN: ${x.rtn}\nNúmero: ${x.numero}\nFecha: ${x.fecha.split('-').reverse().join('/')}`;
    try { await navigator.clipboard.writeText(x.rtn); } catch (_) {}
    window.open(SAR_VALIDADOR, '_blank', 'noopener');
    t.querySelectorAll('.datosSar').forEach(e => e.remove());
    t.insertAdjacentHTML('beforeend', `<div class="datosSar nota" style="margin-top:6px;padding:8px;border:1px dashed var(--borde,#ccc);border-radius:8px">Se abrió el validador del SAR en otra pestaña. Escribí ahí estos datos, el código de la imagen y «Siguiente»; después volvé y poné aquí lo que dijo el SAR.<br><b style="white-space:pre-line;color:var(--texto)">${esc(datos)}</b> <button type="button" class="sec" data-copiar="${esc(x.numero)}">Copiar número</button></div>`);
    campo(t, 'sar').focus(); return true;
  };
  caja.addEventListener('change', e => {
    const c = e.target.dataset.c, t = e.target.closest('.fac');
    if (c === 'numero') { const d = e.target.value.replace(/\D/g, ''); if (d.length === 16 && !/-/.test(e.target.value)) e.target.value = `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8)}`; }
    if (c === 'proveedor') { const r = rtnDe.get(norm(e.target.value)); if (r && !campo(t, 'rtn').value) campo(t, 'rtn').value = r; }
    if ((c === 'total' || c === 'isv') && e.target.value) e.target.value = num(e.target.value).toFixed(2);
    if (c === 'sar') { t.dataset.sarFecha = e.target.value ? hoy() : ''; t.dataset.sarPor = e.target.value ? (S.perfil?.nombre || 'Usuario maestro') : ''; }
    resumir();
  });
  // Enter pasa al siguiente dato; en el total abre la factura siguiente
  caja.addEventListener('keydown', e => {
    if (e.key !== 'Enter' || !e.target.dataset.c) return; e.preventDefault();
    const t = e.target.closest('.fac'), c = e.target.dataset.c, i = ORDEN.indexOf(c);
    e.target.dispatchEvent(new Event('change', { bubbles: true }));
    if (c !== 'total' && i >= 0) return campo(t, ORDEN[i + 1]).focus();
    if (c === 'total') {
      const sig = t.nextElementSibling; if (sig) return campo(sig, 'numero').focus();
      if (!num(e.target.value)) return aviso('Poné el total antes de pasar a la siguiente.', true);
      agregar();
    }
  });
  caja.addEventListener('click', async e => {
    const t = e.target.closest('.fac');
    if (e.target.closest('[data-quitar]')) { t.remove(); if (!tarjetas().length) agregar(); renumerar(); $('#masFac').disabled = false; resumir(); }
    if (e.target.closest('[data-sar]')) await abrirSar(t);
    const cp = e.target.closest('[data-copiar]'); if (cp) { try { await navigator.clipboard.writeText(cp.dataset.copiar); aviso('Número copiado.'); } catch (_) { aviso('No se pudo copiar; escribilo a mano.', true); } }
  });
  $('#masFac').onclick = () => agregar();
  // Validar facturas: revisa que estén completas y manda al SAR la primera que falta validar
  $('#valFac').onclick = async () => {
    resumir(); if (!revisar()) return;
    const t = tarjetas().find((t, i) => tieneAlgo(leerUna(t, i)) && !campo(t, 'sar').value);
    if (!t) return aviso('Todas las facturas ya tienen el resultado del SAR.');
    t.scrollIntoView({ behavior: 'smooth', block: 'center' }); await abrirSar(t);
  };
  f.oninput = resumir; $('#ref').onchange = resumir;
  agregar(false); resumir();
  f.onsubmit = async ev => {
    ev.preventDefault(); resumir();
    if (!revisar()) return aviso('Revisá las facturas marcadas antes de enviar.', true);
    const l = conDatos(), sinSar = l.filter(x => !x.sar).length, noVal = l.filter(x => x.sar === 'No válida').length;
    if ((sinSar || noVal) && !confirm(`${sinSar ? sinSar + ' factura(s) sin validar en el SAR. ' : ''}${noVal ? noVal + ' factura(s) que el SAR dio como NO válidas. ' : ''}¿Enviar la liquidación así?`)) return;
    const d = datosForm(f), fo = libres.find(x => x.id === d.ref), g = num($('#tg').value);
    const facturas = l.map((x, i) => ({ ...x, n: i + 1, proveedor_id: provs.find(p => norm(p.nombre) === norm(x.proveedor))?.id || null }));
    const adjuntos = leerRespaldos('Factura'), mal = revisarArchivos(adjuntos); if (mal.length) return aviso(mal.join(' '), true);
    ocupado(f, true);
    try { await guardarSolicitud({ tipo: 'liquidacion', referencia: fo.id, solicitante: fo.solicitante, correo: S.user.email, monto: g, proyecto: fo.proyecto, linea: fo.linea, descripcion: d.descripcion || ('Liquidación de ' + fo.numero),
      datos: { fondo: fo.numero, monto_fondo: num(fo.monto), total_gastos: g, diferencia: Math.round((num(fo.monto) - g) * 100) / 100, num_facturas: facturas.length, facturas } }, adjuntos); }
    catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
}
const normFac = v => String(v || '').replace(/\D/g, '') || String(v || '').trim().toLowerCase();

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
    ${campoRespaldos('Respaldos (si aplica: constancia, boleto, cita médica)')}
  </div><div class="acciones"><button>Enviar</button></div></form>`;
  $('#f').oninput = () => { const d = datosForm($('#f')); $('#dias').value = diasHabiles(d.desde, d.hasta) || ''; };
  $('#f').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target, d = datosForm(f), dias = diasHabiles(d.desde, d.hasta);
    if (!dias) return aviso('Revisá las fechas: la fecha final no puede ser antes que la inicial.', true);
    const adjuntos = leerRespaldos(), mal = revisarArchivos(adjuntos); if (mal.length) return aviso(mal.join(' '), true);
    ocupado(f, true);
    try { await guardarSolicitud({ tipo: 'vacacion', solicitante: d.solicitante, correo: S.user.email, monto: 0, descripcion: d.descripcion || `Vacaciones del ${d.desde} al ${d.hasta}`, datos: { desde: d.desde, hasta: d.hasta, dias } }, adjuntos); }
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
  const sol = await q(sb.from('solicitudes').select('id,numero,descripcion').eq('org_id', S.org.id).in('tipo', ['compra', 'fondo']).in('estado', ['Autorizada', 'Atendida']).order('creado', { ascending: false }).limit(100));
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
    ${campoRespaldos('Foto o PDF de la factura (y comprobante de pago si hay)')}
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
    const adjuntos = leerRespaldos('Factura escaneada'), mal = revisarArchivos(adjuntos); if (mal.length) return aviso(mal.join(' '), true);
    ocupado(f, true);
    try {
      const fila = await q(sb.from('facturas').insert({ org_id: S.org.id, solicitud_id: d.solicitud_id || null, registro: S.maestro ? 'Usuario maestro' : S.perfil.nombre, tipo_documento: d.tipo_documento,
        numero: d.numero || null, cai: d.cai || null, fecha_emision: d.fecha_emision, fecha_limite: d.fecha_limite || null, rango: d.rango, rtn_emisor: d.rtn_emisor, emisor: d.emisor,
        persona_natural: d.persona_natural === 'si', concepto: d.concepto, tipo_gasto: d.tipo_gasto, exento: num(d.exento), gravado: num(d.gravado), isv: num(d.isv), total: num(d.total),
        tipo_retencion: r.tipo_retencion, retencion: r.retencion, valida_sar: !r.errs.length, observaciones: r.errs.join(' '), mes_fiscal: d.fecha_emision.slice(0, 7) }).select('id').single());
      const fallos = adjuntos.length ? await subirAdjReg('facturas', fila.id, adjuntos) : [];
      if (d.solicitud_id && adjuntos.length) await subirAdjuntos(d.solicitud_id, adjuntos.map(a => ({ ...a, clase: 'Factura' })));
      aviso((r.errs.length ? 'Factura registrada con observaciones.' : 'Factura registrada y válida.' + (r.retencion ? ' Recordá la retención.' : '')) + (fallos.length ? ' No se subió: ' + fallos.join('; ') : ''), !!fallos.length);
      location.hash = '#/facturas';
    } catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
}
async function verFactura(id) {
  const x = await q(sb.from('facturas').select('*').eq('id', id).single());
  app().innerHTML = cabecera('Factura ' + (x.numero || x.tipo_documento), '#/facturas/' + (x.mes_fiscal || '')) + `<div class="caja"><dl class="detalle">
    <dt>Emisor</dt><dd>${esc(x.emisor)} · RTN ${esc(x.rtn_emisor)}</dd><dt>Fecha</dt><dd>${esc(x.fecha_emision)}</dd><dt>CAI</dt><dd>${esc(x.cai || '—')}</dd>
    <dt>Concepto</dt><dd>${esc(x.concepto || '')}</dd><dt>Total</dt><dd><b>${L(x.total)}</b> (gravado ${L(x.gravado)}, ISV ${L(x.isv)}, exento ${L(x.exento)})</dd>
    ${x.retencion ? `<dt>Retención</dt><dd>${L(x.retencion)} · ${esc(x.tipo_retencion || '')}</dd>` : ''}<dt>SAR</dt><dd>${x.valida_sar ? 'Válida' : 'Con observaciones: ' + esc(x.observaciones || '')}</dd>
    <dt>Registró</dt><dd>${esc(x.registro || '')}</dd>${x.solicitud_id ? `<dt>Solicitud</dt><dd><a href="#/solicitud/${x.solicitud_id}">Ver la solicitud</a></dd>` : ''}</dl></div>`;
  agregarAdjuntos('facturas', id);
}
async function verFacturas(mes) {
  mes = mes || hoy().slice(0, 7);
  const fac = await q(sb.from('facturas').select('*').eq('org_id', S.org.id).eq('mes_fiscal', mes).order('fecha_emision'));
  const s = k => fac.reduce((a, x) => a + num(x[k]), 0);
  app().innerHTML = cabecera('Facturas') + `
  <div class="filtros"><input type="month" id="mes" value="${mes}"><a class="boton" href="#/factura">+ Registrar factura</a><button class="sec" id="csv">Descargar CSV</button></div>
  <div class="tabla"><table><thead><tr><th>Fecha</th><th>Número</th><th>Emisor</th><th>RTN</th><th class="n">Gravado</th><th class="n">ISV</th><th class="n">Total</th><th class="n">Retención</th><th>SAR</th></tr></thead><tbody>
  ${fac.map(x => `<tr><td>${esc(x.fecha_emision)}</td><td><a href="#/fac/${x.id}">${esc(x.numero || x.tipo_documento)}</a></td><td>${esc(x.emisor)}</td><td>${esc(x.rtn_emisor)}</td><td class="n">${L(x.gravado)}</td><td class="n">${L(x.isv)}</td><td class="n">${L(x.total)}</td><td class="n">${x.retencion ? L(x.retencion) : ''}</td><td>${x.valida_sar ? '<span class="estado e-Autorizada">Válida</span>' : `<span class="estado e-Rechazada" title="${esc(x.observaciones)}">Revisar</span>`}</td></tr>`).join('') || '<tr><td colspan="9" class="nota">No hay facturas en este mes.</td></tr>'}
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
  app().innerHTML = cabecera(puede('solicitudes.autorizar') ? 'Autorizaciones' : 'Mis solicitudes') + `
  <div class="filtros"><select id="fe"><option value="">Todos los estados</option>${opciones(['Pendiente', 'Autorizada', 'Atendida', 'Rechazada', 'Anulada'], p.get('estado'))}</select>
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
  if (s.tipo === 'fondo') extra = `<dl class="detalle"><dt>Actividad</dt><dd>${esc(d.fecha_actividad)}</dd><dt>Liquidará el</dt><dd>${esc(d.fecha_liquidar || '—')}</dd><dt>Detalle</dt><dd>${esc(d.detalle || '—')}</dd></dl>${['Autorizada', 'Atendida'].includes(s.estado) ? `<div class="acciones"><a class="boton sec" href="#/liquidacion/${s.id}">Liquidar este fondo</a></div>` : ''}`;
  if (s.tipo === 'liquidacion') extra = `<dl class="detalle"><dt>Fondo</dt><dd>${esc(d.fondo)} · ${L(d.monto_fondo)}</dd><dt>Gastado</dt><dd>${L(d.total_gastos)}</dd><dt>Resultado</dt><dd>${d.diferencia > 0 ? 'Devuelve ' + L(d.diferencia) : d.diferencia < 0 ? 'Se le reintegra ' + L(-d.diferencia) : 'Cuadra exacto'}</dd></dl>`;
  if (s.tipo === 'liquidacion' && d.facturas?.length) extra += `<h2>Facturas (${d.facturas.length})</h2><div class="tabla"><table><thead><tr><th>#</th><th>Número</th><th>Fecha</th><th>Proveedor</th><th>Descripción</th><th class="n">Total</th><th>SAR</th></tr></thead><tbody>${d.facturas.map(x => `<tr><td>${x.n}</td><td>${esc(x.numero)}</td><td>${esc(x.fecha || '')}</td><td>${esc(x.proveedor || '')}${x.rtn ? `<br><span class="nota">RTN ${esc(x.rtn)}</span>` : ''}</td><td>${esc(x.descripcion)}</td><td class="n">${L(x.total)}${x.isv ? `<br><span class="nota">ISV ${L(x.isv)}</span>` : ''}</td><td>${x.sar === 'Válida' ? '<span class="estado e-Autorizada">Válida</span>' : x.sar === 'No válida' ? '<span class="estado e-Rechazada">No válida</span>' : '<span class="nota">Sin validar</span>'}</td></tr>`).join('')}</tbody><tfoot><tr><th colspan="5">Total gastado</th><th class="n">${L(d.total_gastos)}</th><th></th></tr></tfoot></table></div>
  <p class="nota">${['Autorizada', 'Atendida'].includes(s.estado) ? 'Estas facturas ya están en el <a href="#/facturas">libro de compras</a>, amarradas a esta liquidación.' : 'Al autorizarse, estas facturas entran solas al libro de compras.'}</p>`;
  if (s.tipo === 'vacacion') extra = `<dl class="detalle"><dt>Fechas</dt><dd>${esc(d.desde)} al ${esc(d.hasta)}</dd><dt>Días hábiles</dt><dd>${esc(d.dias)}</dd></dl>`;
  if (s.tipo === 'laboral' && d.rubros) extra = `<dl class="detalle"><dt>Motivo</dt><dd>${esc(d.motivo)}</dd><dt>Período</dt><dd>${esc(d.ingreso)} al ${esc(d.salida)} (${esc(d.antiguedad)})</dd><dt>Salario mensual</dt><dd>${L(d.salario)}</dd></dl>
    <div class="tabla" style="margin-top:10px"><table><thead><tr><th>Rubro</th><th>Base</th><th class="n">Monto</th></tr></thead><tbody>${d.rubros.map(x => `<tr><td>${esc(x.rubro)}</td><td>${esc(x.base)}</td><td class="n">${L(x.monto)}</td></tr>`).join('')}</tbody><tfoot><tr><th colspan="2">Total a pagar</th><th class="n">${L(s.monto)}</th></tr></tfoot></table></div>`;
  if (['compra', 'fondo'].includes(s.tipo) && s.linea) {
    const anio = new Date(s.creado).getFullYear();
    const pr = await sb.from('ejecucion_presupuesto').select('*').eq('org_id', S.org.id).eq('anio', anio).eq('linea', s.linea).eq('proyecto', s.proyecto || '').maybeSingle();
    if (pr.data) { const usado = num(pr.data.ejecutado) + num(pr.data.comprometido), disp = num(pr.data.aprobado) - usado; extra += `<p class="nota">Presupuesto ${esc(s.linea)} ${anio}: aprobado ${L(pr.data.aprobado)}, usado ${L(usado)}, disponible ${L(disp)}${s.estado === 'Pendiente' && disp < num(s.monto) ? ' <b class="error">— no alcanza para esta solicitud</b>' : ''}.</p>`; }
  }
  const propio = esPropia(s), puedeAut = puede('solicitudes.autorizar') && !propio;
  app().innerHTML = cabecera(`${TIPOS[s.tipo]} ${s.numero}`, '#/solicitudes') + `
  <div class="caja"><span class="estado e-${s.estado}">${s.estado}</span>
  <dl class="detalle"><dt>Solicitante</dt><dd>${esc(s.solicitante)}</dd><dt>Fecha</dt><dd>${fechaHora(s.creado)}</dd>
  ${s.monto ? `<dt>Monto</dt><dd><b>${L(s.monto)}</b></dd>` : ''}${s.linea ? `<dt>Presupuesto</dt><dd>${esc(s.proyecto)} · ${esc(s.linea)}</dd>` : ''}
  ${d.proveedor ? `<dt>Proveedor</dt><dd>${esc(d.proveedor)}</dd>` : ''}<dt>Descripción</dt><dd>${esc(s.descripcion)}</dd>
  ${s.resuelto ? `<dt>${s.estado === 'Anulada' ? 'Anuló' : 'Resolvió'}</dt><dd>${esc(s.resuelto_nombre)} · ${fechaHora(s.resuelto)}${s.comentario ? ' · ' + esc(s.comentario) : ''}</dd>` : ''}
  ${s.atendido ? `<dt>Atendió</dt><dd>${esc(s.atendido_nombre)} · ${fechaHora(s.atendido)}<br>${esc(s.atencion || '')}</dd>` : ''}</dl>
  <p class="nota">${pasoSolicitud(s)}</p>
  ${extra}
  <h2>Respaldos</h2><div id="adjs"><p class="nota">Cargando…</p></div>
  ${puedeAut && s.estado === 'Pendiente' ? `<label style="margin-top:14px">Comentario (opcional)</label><input id="com"><div class="acciones"><button id="aut">Autorizar</button><button class="rojo" id="rec">Rechazar</button></div>` : ''}
  ${propio && s.estado === 'Pendiente' ? `<p class="nota" style="margin-top:14px">La hiciste vos, así que la tiene que autorizar otra persona con permiso. Mientras siga pendiente la podés retirar.</p><div class="acciones"><button class="sec" id="ret">Retirar mi solicitud</button></div>` : ''}
  ${puede('solicitudes.gestionar') && s.estado === 'Autorizada' && ['compra', 'fondo'].includes(s.tipo) ? `<h2>Atender</h2><label>Qué se hizo (se le manda a quien la pidió)</label><textarea id="aten" rows="2" placeholder="${s.tipo === 'compra' ? 'Ej.: Compra hecha a Ferretería X, factura 001-001-01-00001234, se entrega el lunes' : 'Ej.: Transferencia del 6 de noviembre, cheque 1234'}"></textarea><div class="acciones"><button id="atn">Marcar como atendida</button></div>` : ''}
  ${puede('solicitudes.anular') && ['Autorizada', 'Atendida'].includes(s.estado) ? `<div class="acciones"><button class="sec" id="anu">Anular</button></div>` : ''}
  <div class="acciones"><button class="sec" onclick="print()">Imprimir</button></div></div>`;
  pintarAdjuntos(s);
  const resolver = async (estado, pedir) => {
    const comentario = pedir ? prompt(pedir === 'ret' ? '¿Por qué la retirás?' : '¿Por qué se ' + (estado === 'Anulada' ? 'anula' : 'rechaza') + '?') : $('#com')?.value;
    if (pedir && !comentario) return;
    try { await q(sb.from('solicitudes').update({ estado, comentario: comentario || null }).eq('id', s.id)); avisar('solicitud', s.id); aviso('Solicitud ' + estado.toLowerCase() + '.'); verSolicitud(s.id); }
    catch (e) { aviso(falla(e), true); }
  };
  if ($('#aut')) $('#aut').onclick = () => resolver('Autorizada');
  if ($('#rec')) $('#rec').onclick = () => resolver('Rechazada', !$('#com').value);
  if ($('#anu')) $('#anu').onclick = () => resolver('Anulada', true);
  if ($('#ret')) $('#ret').onclick = () => resolver('Anulada', 'ret');
  if ($('#atn')) $('#atn').onclick = async () => {
    const atencion = $('#aten').value.trim(); if (!atencion) return aviso('Escribí qué se hizo.', true);
    try { await q(sb.from('solicitudes').update({ estado: 'Atendida', atencion }).eq('id', s.id)); avisar('solicitud', s.id); aviso('Listo. Se le avisa a quien la pidió.'); verSolicitud(s.id); }
    catch (e) { aviso(falla(e), true); }
  };
}
// Dónde va la solicitud en la cadena: pide → autoriza → administración atiende → resolución a quien pidió
function pasoSolicitud(s) {
  const gestion = ['compra', 'fondo'].includes(s.tipo);
  return ({ Pendiente: 'Paso 1 de ' + (gestion ? 3 : 2) + ': esperando que la autorice quien tiene el permiso.',
    Autorizada: gestion ? 'Paso 2 de 3: autorizada. Administración la está gestionando; cuando la marque como atendida le llega la resolución a quien la pidió.' : 'Resuelta: autorizada.',
    Atendida: 'Resuelta: administración la atendió y se le avisó a quien la pidió.',
    Rechazada: 'Cerrada: rechazada.', Anulada: 'Cerrada: anulada.' })[s.estado] || '';
}
async function pintarAdjuntos(s) {
  const caja = $('#adjs'); if (!caja) return;
  let lista;
  try { lista = await q(sb.from('solicitud_adjuntos').select('*').eq('solicitud_id', s.id).order('creado')); }
  catch (e) { caja.innerHTML = '<p class="nota">Los respaldos todavía no están instalados en la base de datos (falta el paso 20).</p>'; return; }
  const propio = esPropia(s), abierta = ['Pendiente', 'Autorizada', 'Atendida'].includes(s.estado);
  const sube = abierta && (propio || puede('solicitudes.ver') || puede('solicitudes.autorizar') || puede('solicitudes.gestionar'));
  const quita = a => !a.anulado && (s.estado === 'Pendiente' ? (a.creado_por === S.user?.id || puede('solicitudes.anular')) : puede('solicitudes.anular'));
  const kb = n => n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';
  const vivos = lista.filter(a => !a.anulado), quitados = lista.filter(a => a.anulado);
  caja.innerHTML = (vivos.length ? `<div class="tabla"><table><thead><tr><th>Tipo</th><th>Archivo</th><th>Subió</th><th></th></tr></thead><tbody>
    ${vivos.map(a => `<tr><td>${esc(a.clase)}</td><td><a href="#" data-doc="${esc(a.ruta)}">${esc(a.nombre)}</a>${a.nota ? `<br><span class="nota">${esc(a.nota)}</span>` : ''}<span class="nota"> · ${kb(a.tamano || 0)}</span></td><td>${esc(a.subido_nombre || '')}<br><span class="nota">${fechaHora(a.creado)}</span></td><td>${quita(a) ? `<button class="sec" data-quitar="${a.id}">Quitar</button>` : ''}</td></tr>`).join('')}
    </tbody></table></div>` : `<p class="nota">${s.tipo === 'compra' ? 'Esta solicitud no tiene cotizaciones adjuntas.' : 'Sin respaldos adjuntos.'}</p>`)
    + (quitados.length ? `<details style="margin-top:8px"><summary class="nota">${quitados.length} respaldo${quitados.length > 1 ? 's' : ''} quitado${quitados.length > 1 ? 's' : ''} (queda el registro)</summary><ul>${quitados.map(a => `<li>${esc(a.nombre)} · quitado por ${esc(a.anulado_nombre || '')} el ${fechaHora(a.anulado_en)}: ${esc(a.motivo || '')}</li>`).join('')}</ul></details>` : '')
    + (sube ? `<form id="fAdj" class="rejilla" style="margin-top:10px"><div><label>Tipo de respaldo</label><select name="clase">${opciones(CLASES_ADJ, s.tipo === 'liquidacion' ? 'Factura' : 'Cotización')}</select></div>
      <div><label>Archivo</label><input type="file" name="arch" multiple required accept="${ACEPTA_ADJ}"></div><div><label>Nota (opcional)</label><input name="nota"></div>
      <div class="acciones" style="align-self:end"><button class="sec">Subir respaldo</button></div></form>` : '');
  verDocumentos(caja);
  caja.querySelectorAll('[data-quitar]').forEach(b => b.onclick = async () => {
    const motivo = prompt('¿Por qué se quita este respaldo? (el archivo no se borra, queda en el registro)'); if (!motivo) return;
    try { await q(sb.from('solicitud_adjuntos').update({ anulado: true, motivo }).eq('id', b.dataset.quitar)); aviso('Respaldo quitado.'); pintarAdjuntos(s); }
    catch (e) { aviso(falla(e), true); }
  });
  const f = $('#fAdj'); if (f) f.onsubmit = async ev => {
    ev.preventDefault(); const d = datosForm(f), adj = [...f.arch.files].map(archivo => ({ archivo, clase: d.clase, nota: d.nota }));
    const mal = revisarArchivos(adj); if (mal.length) return aviso(mal.join(' '), true);
    ocupado(f, true); const fallos = await subirAdjuntos(s.id, adj);
    aviso(fallos.length ? 'No se subió: ' + fallos.join('; ') : 'Respaldo subido.', !!fallos.length); pintarAdjuntos(s);
  };
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
  if (id) agregarAdjuntos('proveedores', id);
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
  app().innerHTML = cabecera('Empleados') + `<div class="filtros"><a class="boton" href="#/empleado">+ Nuevo empleado</a>${puede('empleados.gestionar') ? '<a class="boton sec" href="#/carga/empleados">Subir varios desde Excel</a>' : ''}</div>
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
  COTIZACION_ARCHIVO: '¿Cada cotización lleva su archivo (foto o PDF)?',
  CORREO_AUTORIZA: 'Correo de quien autoriza las solicitudes (compras, fondos, liquidaciones)', CORREO_AUTORIZA_VACACIONES: 'Correo de quien autoriza las vacaciones (si es otra persona)',
  CORREO_ADMINISTRACION: 'Correo de administración: recibe las compras y fondos autorizados para gestionarlos', CORREO_RRHH: 'Correo de talento humano: recibe vacaciones y liquidaciones laborales autorizadas',
  CORREO_APRUEBA_AYUDAS: 'Correo de quien aprueba las ayudas memoria (además de quien la tenga en Usuarios)',
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
  ${esAdmin() ? `<h2>Correos de aviso</h2><div class="caja"><p class="nota">Así viaja cada solicitud: <b>1.</b> al pedirla le llega a quien autoriza; <b>2.</b> autorizada una compra o fondos, le llega a administración para que la gestione; <b>3.</b> cuando administración la marca como atendida, a quien la pidió le llega la resolución. Vacaciones y liquidaciones quedan resueltas al autorizarlas y le llegan a quien pidió y a talento humano o administración. Las ayudas memoria le llegan a quien las aprueba y ahí quedan; si se devuelven, le llega a quien la registró.</p>
  <div class="tabla"><table><tbody>${[['Autoriza solicitudes', S.cfg.CORREO_AUTORIZA], ['Autoriza vacaciones', S.cfg.CORREO_AUTORIZA_VACACIONES || S.cfg.CORREO_AUTORIZA], ['Administración', S.cfg.CORREO_ADMINISTRACION], ['Talento humano', S.cfg.CORREO_RRHH || S.cfg.CORREO_ADMINISTRACION], ['Aprueba ayudas memoria', S.cfg.CORREO_APRUEBA_AYUDAS]].map(([k, v]) => `<tr><td>${k}</td><td>${v ? esc(v) : `<span class="nota">vacío: va al correo general (${esc(S.cfg.CORREO_AVISOS || 'sin correo')})</span>`}</td></tr>`).join('')}</tbody></table></div>
  <p class="nota">Se llenan arriba; en cada uno se pueden poner varios correos separados por coma. A quien pide le llega a su correo de Usuarios.</p><div class="acciones"><button class="sec" id="probarCorreo">Mandar un correo de prueba</button></div></div>` : ''}
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
const avisar = (tipo, id, extra = {}) => { archivarLuego(true); return sb.functions.invoke('avisos', { body: { tipo, id, ...extra } }).catch(() => {}); };
async function funcionUsuarios(cuerpo) {
  const { data, error } = await sb.functions.invoke('usuarios', { body: cuerpo });
  if (error) { let m = error.message; try { m = (await error.context.json()).error || m; } catch (_) {} throw new Error(m); }
  if (data?.error) throw new Error(data.error);
  return data;
}
const SECCIONES = { adm: 'Administración', cre: 'Crédito interno', cer: 'Certificaciones' };
const rolDe = c => (S.roles || []).find(r => r.codigo === c);
const opcionesRol = sel => (S.roles?.length ? S.roles.filter(r => r.activo || r.codigo === sel).map(r => [r.codigo, r.nombre]) : Object.entries(ROLES).filter(([k]) => k !== 'maestro')).map(([k, v]) => `<option value="${esc(k)}" ${k === sel ? 'selected' : ''}>${esc(v)}</option>`).join('');
const seccionesRol = c => { const r = rolDe(c); return r ? ['adm', 'cre', 'cer'].filter(s => r.permisos.includes('sec.' + s)).map(s => SECCIONES[s]).join(', ') : ''; };
// Tipos de registro que pueden pedir aprobación (perfiles.aprueba)
const TIPOS_REV = { productores: 'Padrón de productores', inspecciones: 'Inspecciones internas', no_conformidades: 'No conformidades', insumos_aplicados: 'Insumos aplicados', capacitaciones: 'Ayudas memoria de capacitación', acopio: 'Acopio', beneficiado: 'Beneficiado y secado', despachos: 'Despachos', prima_uso: 'Uso de la prima', quejas: 'Quejas' };
const checksSec = (marcadas, attr, extra = '') => Object.entries(SECCIONES).map(([k, v]) => `<label style="font-weight:400;color:var(--texto);display:inline-flex;gap:5px;align-items:center;margin:0 10px 4px 0"><input type="checkbox" ${attr}="${k}" ${extra} style="width:auto" ${marcadas.includes(k) ? 'checked' : ''}>${v}</label>`).join('');
async function verUsuarios() {
  const filas = await q(sb.from('perfiles').select('*').eq('org_id', S.org.id).order('nombre'));
  const yo = nombreQuien();
  app().innerHTML = cabecera('Usuarios de ' + S.org.nombre, '#/') + `
  <p class="nota">El rol va según el puesto (técnico, encargado de acopio, contabilidad, junta…) y dice a qué secciones entra y qué puede hacer; la base de datos lo revisa en cada registro. Los roles y sus permisos se ven y se cambian en <a href="#/roles">Roles y permisos</a>. A una persona se le pueden dar secciones o permisos extra sin cambiarle el rol. «Ve el panel de» dice quién entra al panel de control de cada sección (además necesita la clave del panel). «Comité de crédito» marca a quienes votan los créditos. «Aprueba» dice qué tipos de registro revisa y aprueba esa persona.</p>
  <div class="tabla"><table><thead><tr><th>Persona</th><th>Usuario</th><th>Rol</th><th>Secciones</th><th>Aprueba</th><th>Último acceso</th><th>Estado</th><th></th></tr></thead><tbody>
  ${filas.map(u => `<tr><td><b>${esc(u.nombre)}</b>${u.cargo ? '<br><span class="nota">' + esc(u.cargo) + '</span>' : ''}${u.correo ? '<br><span class="nota">' + esc(u.correo) + '</span>' : ''}</td><td>${esc(u.usuario)}</td>
  <td style="min-width:190px"><select data-rol="${u.id}" ${u.id === S.user.id ? 'disabled' : ''}>${opcionesRol(u.rol)}</select>${rolDe(u.rol)?.descripcion ? `<br><span class="nota">${esc(rolDe(u.rol).descripcion)}</span>` : ''}
    ${S.roles?.length && rolDe(u.rol)?.base === 'personal' ? `<details style="margin-top:4px"><summary class="nota">Permisos extra${(u.permisos_extra || []).length ? ' (' + u.permisos_extra.length + ')' : ''}</summary>${PERMISOS.flatMap(([, l]) => l).filter(([k]) => !k.startsWith('sec.') && !rolDe(u.rol).permisos.includes(k)).map(([k, t]) => `<label style="font-weight:400;color:var(--texto);display:flex;gap:5px;align-items:center;margin:2px 0"><input type="checkbox" data-px="${k}" data-u="${u.id}" style="width:auto" ${(u.permisos_extra || []).includes(k) ? 'checked' : ''}>${esc(t)}</label>`).join('')}</details>` : ''}</td>
  <td style="min-width:170px">${['administrador', 'gerencia'].includes(rolDe(u.rol)?.base || u.rol) ? '<span class="nota">Todas</span><br>' : `${seccionesRol(u.rol) ? `<span class="nota">Por su rol: ${esc(seccionesRol(u.rol))}</span><br><span class="nota">Además:</span><br>` : ''}${checksSec(u.secciones || [], 'data-sec', `data-u="${u.id}"`)}`}${u.rol === 'administrador' ? '' : `<br><span class="nota">Ve el panel de:</span><br>${checksSec(u.paneles || [], 'data-pnl', `data-u="${u.id}"`)}`}<label style="font-weight:400;color:var(--texto);display:inline-flex;gap:5px;align-items:center;margin:0"><input type="checkbox" data-comite="${u.id}" style="width:auto" ${u.comite_credito ? 'checked' : ''}>Comité de crédito</label></td>
  <td style="min-width:190px">${Object.entries(TIPOS_REV).map(([k, v]) => `<label style="font-weight:400;color:var(--texto);display:flex;gap:5px;align-items:center;margin:0 0 3px"><input type="checkbox" data-apr="${k}" data-u="${u.id}" style="width:auto" ${(u.aprueba || []).includes(k) ? 'checked' : ''}>${v}</label>`).join('')}</td>
  <td>${fechaHora(u.ultimo_acceso) || 'Nunca'}</td><td>${u.activo ? 'Activo' : '<span class="error">Desactivado</span>'}</td>
  <td style="white-space:nowrap"><button class="sec" data-datos="${u.id}">Datos</button> <button class="sec" data-clave="${u.id}">Clave</button> ${u.id !== S.user.id ? `<button class="sec" data-activo="${u.id}" data-v="${!u.activo}">${u.activo ? 'Desactivar' : 'Activar'}</button>` : ''}</td></tr>`).join('') || '<tr><td colspan="8" class="nota">Todavía no hay usuarios.</td></tr>'}
  </tbody></table></div>
  <h2>Nuevo usuario</h2><form class="caja" id="f"><div class="rejilla">
    <div><label>Nombre completo</label><input name="nombre" required></div>
    <div><label>Cargo</label><input name="cargo" placeholder="Ej.: Contadora, Técnico de campo"></div>
    <div><label>Usuario (para entrar)</label><input name="usuario" required autocapitalize="none" placeholder="Ej.: maria"></div>
    <div><label>Rol (según su puesto)</label><select name="rol">${opcionesRol(S.roles?.length ? 'tecnico' : 'personal')}</select><p class="nota" id="rolDesc"></p></div>
    <div><label>Correo (para avisos)</label><input name="correo" type="email"></div>
    <div><label>Contraseña inicial</label><input name="clave" type="password" minlength="8" required autocomplete="new-password"></div>
    <div class="ancho"><label>${S.roles?.length ? 'Secciones extra (además de las de su rol)' : 'Secciones a las que entra'}</label>${checksSec(S.roles?.length ? [] : ['adm', 'cre', 'cer'], 'name="sec" value')}</div>
  </div><p class="nota">La persona entra con Organización: <b>${esc(S.org.nombre)}</b>, su usuario y esta contraseña.</p><div class="acciones"><button>Crear usuario</button></div></form>`;
  const bit = (accion, detalle) => q(sb.from('bitacora').insert({ org_id: S.org.id, usuario: yo, accion, detalle }));
  $('#f').onsubmit = async ev => {
    ev.preventDefault(); const f = ev.target, d = datosForm(f), secciones = [...f.querySelectorAll('input[name=sec]:checked')].map(x => x.value); delete d.sec;
    const cargo = d.cargo; delete d.cargo; ocupado(f, true);
    try {
      const rol = d.rol, legado = ['administrador', 'gerencia', 'personal'].includes(rol);
      await funcionUsuarios({ accion: 'crear', org_id: S.org.id, ...d, rol: legado ? rol : 'personal' });
      await q(sb.from('perfiles').update({ secciones, cargo: cargo || null, correo: d.correo || null, ...(legado ? {} : { rol }) }).eq('org_id', S.org.id).eq('usuario', norm(d.usuario)));
      aviso('Usuario creado.'); verUsuarios();
    } catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
  const fr = $('#f').rol, desc = () => { $('#rolDesc').textContent = rolDe(fr.value)?.descripcion || ''; }; fr.onchange = desc; desc();
  app().querySelectorAll('[data-px]').forEach(c => c.onchange = async () => {
    const id = c.dataset.u, permisos_extra = [...app().querySelectorAll(`[data-px][data-u="${id}"]:checked`)].map(x => x.dataset.px);
    try { await q(sb.from('perfiles').update({ permisos_extra }).eq('id', id)); await bit('Cambió permisos extra', c.closest('tr').cells[1].textContent + ' → ' + (permisos_extra.map(p => NOMBRE_PERMISO[p]).join(', ') || 'ninguno')); aviso('Permisos actualizados.'); }
    catch (e) { aviso(falla(e), true); verUsuarios(); }
  });
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
