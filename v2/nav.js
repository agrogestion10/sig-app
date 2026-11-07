// AgroGestión · Navegación: menú fijo a la izquierda (computadora), barra abajo (teléfono),
// coronita en lo que no viene en el plan y botón de WhatsApp.

const WHATSAPP = '50495430148';
const IC = (d, w = 20) => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICONOS = {
  inicio: IC('<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'),
  ger: IC('<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>'),
  adm: IC('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>'),
  cre: IC('<circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .9-3 2s1.3 1.7 3 2 3 .9 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6v2M12 16v2"/>'),
  cer: IC('<path d="M5 19c0-8 6-13 15-13-1 9-6 14-13 14"/><path d="M8 17c2.5-4 5.5-7 9-9"/>'),
  padron: IC('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.8c1.6.8 2.6 2.5 3 5.2"/>'),
  acopio: IC('<path d="M4 7h16l-1.5 12a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2z"/><path d="M8 7a4 4 0 0 1 8 0"/>'),
  eudr: IC('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3"/>'),
  solic: IC('<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 11l2 2 4-4M9 17h6"/>'),
  facturas: IC('<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>'),
  proveedores: IC('<path d="M3 9l1.5-5h15L21 9"/><path d="M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z"/><path d="M5 13v7h14v-7"/>'),
  empleados: IC('<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.9-3.6 3.6-5.5 7-5.5s6.1 1.9 7 5.5"/>'),
  presupuesto: IC('<path d="M12 3v9h9"/><path d="M20.5 15A9 9 0 1 1 9 3.5"/>'),
  beneficio: IC('<path d="M12 3c3 4 5 6.8 5 9.5a5 5 0 0 1-10 0C7 9.8 9 7 12 3z"/>'),
  basculas: IC('<path d="M12 4v16M7 20h10M5 8h14"/><path d="M5 8l-2.5 6a3 3 0 0 0 5 0zM19 8l-2.5 6a3 3 0 0 0 5 0z"/>'),
  balance: IC('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
  alerta: IC('<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>'),
  charla: IC('<path d="M4 5h16v11H9l-5 4z"/>'),
  procesos: IC('<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="10" rx="1.5"/><rect x="17" y="4" width="4" height="13" rx="1.5"/>'),
  ventas: IC('<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>'),
  traza: IC('<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6H15a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h6.5"/>'),
  kobo: IC('<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 6h4M9 11h6M9 15h4"/>'),
  plan: IC('<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>'),
  config: IC('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>'),
  guia: IC('<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5h.01"/>'),
  salir: IC('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'),
  mas: IC('<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>'),
  corona: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/></svg>',
  whatsapp: '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3 1 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.4-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.2z"/></svg>'
};

// Qué opción del menú se marca según la pantalla abierta
const MARCA_DE = { formularios: 'formularios', padron: 'padron', prod: 'padron', prodf: 'padron', parcela: 'padron', acopio: 'acopio', acopios: 'acopio', recibo: 'acopio', procesos: 'procesos', inventario: 'procesos', reg: 'beneficio', basculas: 'basculas', despacho: 'ventas', eudr: 'ventas', balance: 'balance', lotes: 'traza', lote: 'traza', adm: 'adm', solicitudes: 'solic', solicitud: 'solic', compra: 'solic', fondo: 'solic', liquidacion: 'solic', vacacion: 'solic', laboral: 'solic', facturas: 'facturas', factura: 'facturas', fac: 'facturas', agregarfac: 'facturas', proveedores: 'proveedores', proveedor: 'proveedores', empleados: 'empleados', empleado: 'empleados', presupuesto: 'presupuesto', eudrparc: 'eudr', kobo: 'kobo', plan: 'plan', config: 'config', usuarios: 'config', roles: 'config', catalogo: 'catalogo', credito: 'creditos', creditos: 'creditos', cred: 'creditos', cartera: 'cartera', edocta: 'cartera', pago: 'cartera', recordatorios: 'recordatorios', reportescre: 'reportescre', fondos: 'fondos', condiciones: 'condiciones', inspeccion: 'inspecciones', insp: 'inspecciones', inspecciones: 'inspecciones', nc: 'nc', insumos: 'insumos', capacitaciones: 'capacitaciones', cap: 'capacitaciones', guias: 'guias', asistencia: 'asistencia', quejas: 'quejas', queja: 'quejas', prima: 'prima', actas: 'actas', bandeja: 'bandeja', paquete: 'cer', bitacora: 'config', orgs: 'config', guia: 'guia', ger: 'ger' };

function itemsNav() {
  if (!S.user || !S.org) return null;
  const p = S.plan || {}, maestro = S.maestro, cer = puedeSec('cer');
  const sinKobo = !maestro && S.plan && !p.kobo, sinSat = !maestro && S.plan && !p.satelite;
  return [
    ['Gestioná tu organización', [
      ['inicio', '#/', 'Inicio'],
      ['formularios', '#/formularios', 'Formularios'],
      puedeSec('ger') && ['ger', '#/ger', 'Gerencia']]],
    puedeSec('adm') && ['Administración', [
      ['adm', '#/adm', 'Resumen'],
      ['solic', '#/solicitudes', puede('solicitudes.autorizar') ? 'Autorizaciones' : 'Mis solicitudes'],
      ['facturas', '#/facturas', 'Libro de compras'],
      ['proveedores', '#/proveedores', 'Proveedores'],
      puede('empleados.gestionar') && ['empleados', '#/empleados', 'Empleados'],
      ['presupuesto', '#/presupuesto', 'Presupuesto']]],
    puedeSec('cre') && ['Crédito interno', [
      ['cre', '#/cre', 'Resumen'],
      ['creditos', '#/creditos', esJefe() ? 'Créditos por resolver' : puede('credito.evaluar') || puede('cartera.ver') ? 'Solicitudes y créditos' : 'Mis solicitudes'],
      (puede('cartera.ver') || puede('credito.cobrar')) && ['cartera', '#/cartera', 'Cartera y pagos'],
      puede('credito.cobrar') && ['recordatorios', '#/recordatorios', 'Recordatorios de cuotas'],
      puede('cartera.ver') && ['reportescre', '#/reportescre', 'Reportes de cartera'],
      puede('cartera.ver') && ['fondos', '#/fondos', 'Fondos de crédito'],
      esAdmin() && ['condiciones', '#/condiciones', 'Condiciones y comité']]],
    cer && ['Certificaciones', [
      ['cer', '#/cer', 'Resumen'],
      ['inspecciones', '#/inspecciones', 'Inspecciones internas'],
      ['nc', '#/nc', 'No conformidades'],
      ['insumos', '#/insumos', 'Insumos aplicados'],
      ['capacitaciones', '#/capacitaciones', 'Capacitaciones'],
      ['guias', '#/guias', 'Guías y plan de capacitación'],
      ['asistencia', '#/asistencia', 'Asistencia por productor'],
      ['quejas', puede('quejas.gestionar') ? '#/quejas' : '#/queja', puede('quejas.gestionar') ? 'Quejas y reclamos' : 'Registrar una queja'],
      ['prima', '#/prima', 'Prima de Comercio Justo'],
      ['actas', '#/actas', 'Actas de asamblea'],
      ['bandeja', '#/bandeja', 'Trabajo sin señal'],
      esAdmin() && ['catalogo', '#/catalogo', 'Catálogo de certificaciones']]],
    cer && ['Campo y cumplimiento', [
      ['padron', '#/padron', 'Productores y fincas'],
      ['eudr', '#/eudrparc', 'Revisión EUDR', sinSat],
      ['kobo', '#/kobo', 'Kobo (campo)', sinKobo]]],
    cer && ['Del acopio a la exportación', [
      ['acopio', '#/acopios', 'Acopio'],
      ['procesos', '#/procesos', 'Procesos y lotes'],
      ['beneficio', '#/reg/beneficiado', typeof cultivos === 'function' && cultivos().length === 1 && cultivos()[0] === 'Cacao' ? 'Fermentación y secado' : 'Beneficio y secado'],
      ['basculas', '#/basculas', 'Básculas'],
      ['ventas', '#/despacho', 'Ventas y exportación'],
      ['balance', '#/balance', 'Balance de masas'],
      ['traza', '#/lotes', 'Trazabilidad']]],
    ['Tu cuenta', [
      ['plan', '#/plan', 'Mi plan', false, p.nombre],
      esAdmin() && ['config', '#/config', 'Configuración'],
      ['guia', '#/guia', 'Guía de uso']]]
  ].filter(Boolean).map(([t, l]) => [t, l.filter(Boolean)]);
}
// Aviso en el menú: cuántas cosas esperan en cada sección (lo que antes salía en las tarjetas de Inicio)
function marcarNav(k, txt, clase) { const m = String(txt || '').match(/^\d+/), v = m && +m[0] > 0 ? { n: +m[0], clase, txt } : null; S.avisosNav = S.avisosNav || {}; S.avisosNav[k] = v; if (k === 'adm') S.avisosNav.solic = v; pintarAvisosNav(); }
function pintarAvisosNav() {
  const av = S.avisosNav || {};
  document.querySelectorAll('#navLat .navItem[data-k], #navBaja a[data-k]').forEach(a => {
    a.querySelector('.navAviso')?.remove(); const x = av[a.dataset.k]; if (!x) return;
    const b = document.createElement('span'); b.className = 'navAviso ' + (x.clase === 'rojo' ? 'rojo' : ''); b.textContent = x.n > 99 ? '99+' : x.n; b.title = x.txt; a.appendChild(b);
  });
}
const ICONO_DE = { formularios: 'solic', creditos: 'cre', cartera: 'balance', recordatorios: 'reloj', reportescre: 'ger', fondos: 'cre', condiciones: 'config', inspecciones: 'solic', nc: 'alerta', insumos: 'beneficio', capacitaciones: 'empleados', guias: 'guia', asistencia: 'padron', quejas: 'charla', prima: 'cre', actas: 'facturas', bandeja: 'kobo', catalogo: 'cer' };
ICONOS.reloj = ICONOS.reloj || IC('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>');
const navAbiertos = () => { try { return JSON.parse(localStorage.getItem('ag_nav_abiertos') || '[]'); } catch (_) { return []; } };
function marcaActual() {
  const r = location.hash.replace(/^#\/?/, '').split('/')[0];
  if (!r) return 'inicio';
  return MARCA_DE[r] || S.seccion || '';
}
function pintarNav() {
  const grupos = itemsNav();
  let lat = document.getElementById('navLat'), baja = document.getElementById('navBaja'), wa = document.getElementById('waBtn');
  if (!grupos || $('#barra').hidden) { document.body.classList.remove('conNav'); [lat, baja, wa].forEach(x => x && x.remove()); return; }
  document.body.classList.add('conNav');
  const act = marcaActual();
  const item = ([k, h, t, corona, chip]) => `<a href="${h}" class="navItem${k === act ? ' activo' : ''}" data-k="${k}">${ICONOS[k] || ICONOS[ICONO_DE[k]] || ''}<span>${esc(t)}</span>${corona ? `<span class="corona" title="No viene en tu plan">${ICONOS.corona}</span>` : chip ? `<span class="chipNav">${esc(chip)}</span>` : ''}</a>`;
  const quien = S.maestro ? 'Usuario maestro' : S.perfil?.nombre || '';
  const html = `<a href="#/" class="navMarca"><span class="navLogo">AG</span><span>AgroGestión</span></a>
    <div class="navOrg"><span class="navAvatar">${esc((S.org.nombre || '?').trim().charAt(0).toUpperCase())}</span><span><b>${esc(S.org.nombre)}</b><small>${esc(quien)}</small></span></div>
    ${grupos.map(([t, l], i) => { const abierto = i === 0 || t === 'Tu cuenta' || l.some(x => x[0] === act) || navAbiertos().includes(t); return `<div class="navSec${abierto ? ' abierta' : ''}"><button type="button" class="navGrupo" data-g="${esc(t)}" aria-expanded="${abierto}">${esc(t)}<svg class="navFlecha" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button><div class="navItems">${l.map(item).join('')}</div></div>`; }).join('')}
    <a href="#" class="navItem navSalir" id="navSalir">${ICONOS.salir}<span>Cerrar sesión</span></a>`;
  if (!lat) { lat = document.createElement('nav'); lat.id = 'navLat'; lat.className = 'navLat'; lat.setAttribute('aria-label', 'Menú principal'); document.body.prepend(lat); }
  lat.innerHTML = html;
  lat.querySelectorAll('[data-g]').forEach(b => b.onclick = () => { const s = b.parentElement, ab = !s.classList.contains('abierta'); s.classList.toggle('abierta', ab); b.setAttribute('aria-expanded', ab); const l = navAbiertos().filter(x => x !== b.dataset.g); if (ab) l.push(b.dataset.g); try { localStorage.setItem('ag_nav_abiertos', JSON.stringify(l)); } catch (_) {} });
  // Teléfono: barra de abajo con lo principal y «Más» con todo el menú
  const todos = grupos.flatMap(([, l]) => l), princ = todos.filter(x => ['inicio', 'formularios', 'adm', 'cre', 'cer', 'ger'].includes(x[0])).slice(0, 4);
  if (!baja) { baja = document.createElement('nav'); baja.id = 'navBaja'; baja.className = 'navBaja'; baja.setAttribute('aria-label', 'Menú'); document.body.append(baja); }
  const corto = { formularios: 'Formularios', inicio: 'Inicio', ger: 'Gerencia', adm: 'Administ.', cre: 'Crédito', cer: 'Certific.' };
  baja.innerHTML = princ.map(([k, h]) => `<a href="${h}" data-k="${k}" class="${k === act ? 'activo' : ''}">${ICONOS[k] || ICONOS[ICONO_DE[k]] || ''}<span>${corto[k]}</span></a>`).join('')
    + `<button type="button" id="navMas" class="${princ.some(x => x[0] === act) ? '' : 'activo'}">${ICONOS.mas}<span>Más</span></button>`;
  $('#navMas').onclick = () => document.body.classList.toggle('navAbierto');
  pintarAvisosNav();
  lat.querySelectorAll('a.navItem').forEach(a => a.addEventListener('click', () => document.body.classList.remove('navAbierto')));
  $('#navSalir').onclick = async e => { e.preventDefault(); await sb.auth.signOut({ scope: 'local' }); location.hash = '#/entrar'; location.reload(); };
  if (!wa) {
    wa = document.createElement('a'); wa.id = 'waBtn'; wa.className = 'waBtn'; wa.target = '_blank'; wa.rel = 'noopener';
    wa.title = 'Escribinos por WhatsApp'; wa.setAttribute('aria-label', 'Escribinos por WhatsApp'); wa.innerHTML = ICONOS.whatsapp; document.body.append(wa);
  }
  wa.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola, soy de ' + (S.org.nombre || '') + ' y tengo una consulta sobre AgroGestión.')}`;
}
window.addEventListener('hashchange', () => { document.body.classList.remove('navAbierto'); setTimeout(pintarNav, 0); });
// Se repinta cada vez que se pinta la barra de arriba (al entrar, al cambiar de organización)
(function () { const original = pintarBarra; pintarBarra = function () { original.apply(this, arguments); pintarNav(); }; })();

// ---------- lo que no viene en el plan: pantalla para subir de plan en vez de un error ----------
function pantallaSubirPlan(que, detalle) {
  app().innerHTML = cabecera(que, '#/') + `<div class="caja subirPlan"><span class="corona grande">${ICONOS.corona}</span>
    <h2>${esc(que)} viene en el plan Estándar y en el Premium</h2><p>${detalle}</p>
    <p class="nota">Tu plan ahora: <b>${esc(S.plan?.nombre || '')}</b>.</p>
    <div class="acciones"><a class="boton" href="#/plan">Ver planes</a> <a class="boton sec" href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola, quiero subir de plan en AgroGestión (' + (S.org?.nombre || '') + ').')}" target="_blank" rel="noopener">Preguntar por WhatsApp</a></div></div>`;
}
(function () {
  const envolver = (r, campo, que, detalle) => {
    const original = RUTAS[r]; if (!original) return;
    RUTAS[r] = function (...a) { if (!S.maestro && S.plan && !S.plan[campo]) return pantallaSubirPlan(que, detalle); return original.apply(this, a); };
  };
  envolver('kobo', 'kobo', 'Kobo (formularios de campo)', 'Con Kobo tus técnicos llenan inspecciones, padrón, asistencia y más en el celular, aunque no haya señal, y todo llega solo a AgroGestión.');
  envolver('eudrparc', 'satelite', 'Revisión EUDR por satélite', 'Revisa cada parcela con imágenes de satélite (Whisp de la FAO y Global Forest Watch) para comprobar que no hubo deforestación después de 2020, antes de comprar y de despachar.');
})();

// ---------- molde de pantalla (como Treinta): título con acciones, filtros, tarjetas de números, pestañas y vacío ----------
const ICK = {
  dinero: IC('<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9.5v5M18 9.5v5"/>', 24),
  sube: IC('<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>', 24),
  saco: IC('<path d="M8 4h8l-1 3c3 1.5 5 4.5 5 8 0 3-2.5 5-8 5s-8-2-8-5c0-3.5 2-6.5 5-8z"/><path d="M9 7h6"/>', 24),
  gente: IC('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.8c1.6.8 2.6 2.5 3 5.2"/>', 24),
  alerta: IC('<path d="M12 3l9.5 16.5h-19z"/><path d="M12 10v4M12 17.5h.01"/>', 24),
  reloj: IC('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', 24),
  hoja: IC('<path d="M5 19c0-8 6-13 15-13-1 9-6 14-13 14"/><path d="M8 17c2.5-4 5.5-7 9-9"/>', 24),
  mapa: IC('<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>', 24),
  doc: IC('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>', 24),
  vacio: '<svg width="88" height="88" viewBox="0 0 88 88" fill="none" aria-hidden="true"><rect x="10" y="18" width="56" height="46" rx="6" stroke="#9aa9a0" stroke-width="4"/><path d="M10 30h56" stroke="#9aa9a0" stroke-width="4"/><circle cx="64" cy="62" r="12" fill="#fff" stroke="#f59e0b" stroke-width="5"/></svg>'
};
const moldeCab = (titulo, acciones = '', volver) => `<div class="moldeCab"><div class="moldeTit">${cabecera(titulo, volver)}</div>${acciones ? `<div class="moldeAcc">${acciones}</div>` : ''}</div>`;
const kpi = (tipo, icono, etiqueta, valor, sub = '') => `<div class="kpi kpi-${tipo}"><span class="kpiIc">${ICK[icono] || ''}</span><span class="kpiTx"><small>${esc(etiqueta)}</small><b>${valor}</b>${sub ? `<em>${sub}</em>` : ''}</span></div>`;
const kpis = lista => `<div class="kpis">${lista.join('')}</div>`;
const pestanas = (lista, act) => `<div class="pestanas" role="tablist">${lista.map(([k, t, n]) => `<button type="button" role="tab" data-pest="${k}" class="${k === act ? 'activa' : ''}" aria-selected="${k === act}">${esc(t)}${n != null ? ` <span class="pestN">${n}</span>` : ''}</button>`).join('')}</div>`;
const vacio = (texto, boton = '') => `<div class="vacio">${ICK.vacio}<p>${texto}</p>${boton}</div>`;
function alPestana(raiz, fn) { raiz.querySelectorAll('[data-pest]').forEach(b => b.onclick = () => { raiz.querySelectorAll('[data-pest]').forEach(x => { x.classList.toggle('activa', x === b); x.setAttribute('aria-selected', x === b); }); fn(b.dataset.pest); }); }

// ---------- Descargar en Excel ----------
// Cualquier pantalla con tablas muestra «Descargar Excel» a quien tenga permiso.
// El administrador y gerencia lo tienen siempre; a los demás se lo da el administrador en Roles o en Usuarios (permiso «Descarga listas y reportes en Excel»).
const puedeExcel = () => !!S.org && (S.maestro || esJefe() || (S.permisos || []).includes('excel.descargar'));
const SIN_EXCEL = new Set(['', 'inicio', 'guia', 'roles', 'plan', 'config', 'miclave', 'carga', 'registro']);
const conDatos = t => [...t.tBodies].some(tb => [...tb.rows].some(tr => !tr.hidden && tr.cells.length > 1));
function tablasExcel() { return [...app().querySelectorAll('.tabla table')].filter(t => !t.closest('[hidden]') && conDatos(t)); }
function ponerBotonExcel() {
  const raiz = app(); if (!raiz) return;
  const ruta = location.hash.replace(/^#\/?/, '').split('/')[0];
  let b = raiz.querySelector('.btnExcel');
  const va = puedeExcel() && !SIN_EXCEL.has(ruta) && tablasExcel().length > 0;
  if (!va) { if (b) b.remove(); return; }
  if (b) return;
  b = document.createElement('button'); b.type = 'button'; b.className = 'sec btnExcel';
  b.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg> Descargar Excel';
  b.title = 'Descarga en Excel lo que estás viendo en esta pantalla';
  b.onclick = () => descargarExcel(b);
  const cab = raiz.querySelector('.moldeCab');
  if (cab) { let acc = cab.querySelector('.moldeAcc'); if (!acc) { acc = document.createElement('div'); acc.className = 'moldeAcc'; cab.appendChild(acc); } acc.appendChild(b); return; }
  const h1 = raiz.querySelector('h1'); if (!h1) return;
  const caja = document.createElement('div'); caja.className = 'barraExcel'; caja.appendChild(b);
  const ref = h1.nextElementSibling?.classList.contains('ayudaSec') ? h1.nextElementSibling : h1;
  ref.after(caja);
}
async function descargarExcel(boton) {
  const tablas = tablasExcel(); if (!tablas.length) return aviso('No hay datos para descargar.', true);
  boton.disabled = true;
  try {
    const X = await libExcel(), raiz = app(), libro = X.utils.book_new(), usados = new Set();
    const titulo = (raiz.querySelector('h1')?.textContent || 'Datos').trim();
    let filas = 0;
    tablas.forEach(t => {
      const c = t.cloneNode(true);
      [...t.rows].forEach((tr, k) => { if (tr.hidden || tr.style.display === 'none') c.rows[k].dataset.quitar = '1'; });
      c.querySelectorAll('[data-quitar]').forEach(tr => tr.remove());
      [...c.tBodies].forEach(tb => [...tb.rows].forEach(tr => { if (tr.cells.length === 1 && tr.cells[0].colSpan > 1) tr.remove(); }));
      c.querySelectorAll('button,select,input,textarea,svg').forEach(e => e.remove());
      const cab = c.tHead?.rows[0], n = cab ? cab.cells.length : 0;
      const vacias = cab ? [...cab.cells].map((x, k) => !x.textContent.trim() && x.colSpan === 1 ? k : -1).filter(k => k >= 0).reverse() : [];
      if (vacias.length) [...c.rows].forEach(tr => { if (tr.cells.length === n) vacias.forEach(k => tr.deleteCell(k)); });
      c.querySelectorAll('td.n').forEach(td => { const s = td.textContent.replace(/[^\d.,-]/g, '').replace(/,/g, ''); if (/^-?\d+(\.\d+)?$/.test(s)) { td.setAttribute('data-t', 'n'); td.setAttribute('data-v', s); } });
      filas += [...c.tBodies].reduce((a, tb) => a + tb.rows.length, 0);
      let h = t.closest('.tabla'), nombre = '';
      for (let e = h?.previousElementSibling; e && !nombre; e = e.previousElementSibling) if (/^H[23]$/.test(e.tagName)) nombre = e.textContent;
      nombre = (nombre || titulo).replace(/[\[\]:*?\/\\]/g, ' ').trim().slice(0, 28) || 'Hoja';
      let fin = nombre, i = 2; while (usados.has(fin.toLowerCase())) fin = nombre.slice(0, 26) + ' ' + i++;
      usados.add(fin.toLowerCase());
      const hoja = X.utils.table_to_sheet(c, { raw: true }), cabC = c.tHead?.rows[0];
      const numCols = cabC ? [...cabC.cells].map((x, k) => x.classList.contains('n') ? k : -1).filter(k => k >= 0) : [];
      if (hoja['!ref'] && numCols.length) {
        const rg = X.utils.decode_range(hoja['!ref']);
        for (let f = rg.s.r + 1; f <= rg.e.r; f++) numCols.forEach(k => {
          const cel = hoja[X.utils.encode_cell({ r: f, c: k })]; if (!cel || typeof cel.v !== 'string') return;
          const v = cel.v.replace(/[^\d.,-]/g, '').replace(/,/g, '');
          if (/^-?\d+(\.\d+)?$/.test(v)) { cel.t = 'n'; cel.v = +v; cel.z = v.includes('.') ? '#,##0.00' : '#,##0'; delete cel.w; }
        });
      }
      X.utils.book_append_sheet(libro, hoja, fin);
    });
    const archivo = `${titulo} - ${S.org.nombre} - ${hoy()}`.replace(/[\\\/:*?"<>|]+/g, ' ').slice(0, 120) + '.xlsx';
    X.writeFile(libro, archivo);
    sb.from('bitacora').insert({ org_id: S.org.id, usuario: typeof nombreQuien === 'function' ? nombreQuien() : '', accion: 'Descargó en Excel', detalle: `${titulo} · ${filas} filas` }).then(() => {}, () => {});
    aviso('Listo: se descargó ' + archivo);
  } catch (e) { aviso(falla(e), true); }
  finally { boton.disabled = false; }
}
(function vigilarExcel() {
  const raiz = document.getElementById('app'); if (!raiz) return setTimeout(vigilarExcel, 300);
  let pend = false;
  new MutationObserver(() => { if (pend) return; pend = true; requestAnimationFrame(() => { pend = false; try { ponerBotonExcel(); } catch (_) {} }); }).observe(raiz, { childList: true, subtree: true });
})();

// ---------- Aviso al escoger un archivo que parece el PDF de otro registro de la app ----------
// (por ejemplo, subir «VAC-2026-0002 · Autorizada.pdf» como cotización de una compra)
document.addEventListener('change', ev => {
  const i = ev.target; if (!(i instanceof HTMLInputElement) || i.type !== 'file' || !i.files?.length) return;
  const raras = [...i.files].filter(f => /^(COM|FON|LIQ|VAC|LAB|ACO|CRE|DES|INS|NC|CAP|QUE)-\d{4}-\d{3,}/i.test(f.name));
  if (!raras.length) return;
  const esta = (location.hash.match(/(COM|FON|LIQ|VAC|LAB)-\d{4}-\d{3,}/i) || [])[0];
  if (!confirm(`«${raras[0].name}» parece el PDF de otro registro de AgroGestión, no un documento de respaldo (cotización, factura, comprobante).\n\n¿Seguro que es el archivo correcto?`)) { i.value = ''; i.dispatchEvent(new Event('input', { bubbles: true })); }
}, true);

// ---------- Al imprimir: membrete de la organización, firmas y pie (el diseño está en estilo.css) ----------
function prepararImpresion() {
  if (document.body.classList.contains('impRecibo')) return;
  const raiz = app(); if (!raiz || !S.org) return;
  quitarImpresion();
  const ahora = new Date().toLocaleString('es-HN', { timeZone: 'America/Tegucigalpa', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const quien = S.maestro ? 'Usuario maestro' : (S.perfil?.nombre || '');
  const titulo = (raiz.querySelector('h1')?.textContent || '').trim();
  const ruta = location.hash.replace(/^#\/?/, '').split('/')[0];
  document.documentElement.style.setProperty('--ag-org', JSON.stringify(S.org.nombre || ''));
  document.documentElement.style.setProperty('--ag-impreso', JSON.stringify('Impreso el ' + ahora));
  const cab = document.createElement('div'); cab.className = 'impCab';
  cab.innerHTML = `<div class="impMarca"><span class="impLogo">AG</span><div class="impOrg">${esc(S.org.nombre || '')}<small>${esc(titulo)}</small></div></div><div class="impDatos">Impreso el <b>${esc(ahora)}</b><br>por ${esc(quien)}</div>`;
  raiz.prepend(cab);
  const pie = document.createElement('div'); pie.className = 'impPie'; pie.textContent = 'Documento generado con AgroGestión. Los registros originales quedan guardados en el sistema con su bitácora.'; raiz.append(pie);
}
function quitarImpresion() { document.querySelectorAll('.impCab,.impFirmas,.impPie').forEach(e => e.remove()); }
window.addEventListener('beforeprint', prepararImpresion);
window.addEventListener('afterprint', quitarImpresion);
