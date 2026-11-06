// SIG · Roles y permisos por puesto: qué puede hacer cada quien
'use strict';

const PERMISOS = [
  ['Secciones', [['sec.adm', 'Entra a Administración'], ['sec.cre', 'Entra a Crédito interno'], ['sec.cer', 'Entra a Certificaciones y acopio']]],
  ['Productores y control interno', [['padron.crear', 'Registra productores, parcelas y documentos'], ['padron.editar', 'Corrige productores y parcelas'], ['inspeccion.registrar', 'Hace inspecciones internas y anota no conformidades'], ['inspeccion.editar', 'Corrige inspecciones y cierra no conformidades'], ['insumos.registrar', 'Registra insumos aplicados'], ['capacitacion.registrar', 'Registra ayudas memoria y asistencia'], ['capacitacion.editar', 'Corrige ayudas memoria'], ['quejas.gestionar', 'Ve y responde quejas'], ['catalogo.editar', 'Cambia guías de capacitación y certificaciones'], ['auditoria.paquete', 'Arma el paquete para la certificadora']]],
  ['Acopio y comercialización', [['acopio.registrar', 'Recibe entregas y hace recibos'], ['acopio.editar', 'Corrige entregas ya guardadas'], ['acopio.pagar', 'Marca entregas como pagadas'], ['basculas.gestionar', 'Registra básculas y su calibración'], ['beneficiado.registrar', 'Registra beneficiado, fermentación y secado'], ['despacho.registrar', 'Registra despachos y ventas'], ['prima.registrar', 'Registra el uso de la prima'], ['actas.registrar', 'Registra actas de asamblea y junta']]],
  ['Crédito', [['credito.solicitar', 'Recibe solicitudes de crédito'], ['credito.evaluar', 'Hace la evaluación técnica'], ['credito.desembolsar', 'Registra el desembolso de lo aprobado'], ['credito.cobrar', 'Registra pagos de crédito'], ['cartera.ver', 'Ve la cartera, la mora y los reportes']]],
  ['Administración', [['facturas.registrar', 'Registra facturas'], ['facturas.gestionar', 'Ve y corrige todas las facturas'], ['solicitudes.ver', 'Ve todas las solicitudes de fondos y vacaciones'], ['solicitudes.autorizar', 'Autoriza o rechaza compras, fondos, vacaciones y liquidaciones (nunca lo que él mismo pidió)'], ['solicitudes.anular', 'Anula lo ya autorizado y quita respaldos de solicitudes resueltas'], ['proveedores.editar', 'Registra y corrige proveedores'], ['empleados.gestionar', 'Maneja empleados y salarios'], ['presupuesto.editar', 'Carga el presupuesto']]],
  ['Generales', [['carga.masiva', 'Sube datos desde Excel'], ['bitacora.ver', 'Ve la bitácora de cambios']]]
];
const NOMBRE_PERMISO = Object.fromEntries(PERMISOS.flatMap(([, l]) => l));
const QUIEN_AUTORIZA = [
  ['Compra, fondos, vacaciones, liquidación', 'Cualquier usuario que entre a Administración, con sus cotizaciones y respaldos', 'Gerencia o quien tenga «Autoriza solicitudes». Nunca quien la pidió', 'Pendiente: la retira quien la hizo. Autorizada: solo quien tenga «Anula lo ya autorizado», con motivo'],
  ['Respaldos de una solicitud', 'Quien hizo la solicitud, administración o quien autoriza', '—', 'Pendiente: los quita quien los subió. Resuelta: solo quien tenga «Anula lo ya autorizado». El archivo no se borra'],
  ['Crédito', 'Técnico u oficial de crédito («Recibe solicitudes»)', 'Gerencia dentro de su límite o el comité de crédito. Nunca quien registró la solicitud', 'Monto, tasa y plazo aprobados: solo gerencia. Pasar a incobrable: solo el administrador'],
  ['Desembolso y pagos de crédito', 'Oficial de crédito o contabilidad', 'Se desembolsa solo lo aprobado', 'Borrar un pago: solo el administrador'],
  ['Entrega de acopio', 'Encargado de acopio', '—', 'Corregir pesos o precios: solo quien tenga «Corrige entregas». Contabilidad solo marca el pago'],
  ['Factura', 'Contabilidad («Registra facturas»)', '—', 'Corregir: «Ve y corrige facturas». Borrar: solo el administrador'],
  ['Inspección interna', 'Inspector o técnico', '—', 'Corregir y cerrar no conformidades: «Corrige inspecciones»'],
  ['Usuarios, roles y configuración', '—', 'Solo el administrador', 'Solo el administrador']
];
const NIVELES = { administrador: 'Administrador (todo)', gerencia: 'Gerencia (hace y autoriza todo lo operativo)', personal: 'Según sus permisos' };

RUTAS.roles = async function verRoles(cod) {
  const [roles, us] = await Promise.all([q(sb.from('roles').select('*').eq('org_id', S.org.id).order('orden')).catch(() => null), esAdmin() ? q(sb.from('perfiles').select('rol,activo').eq('org_id', S.org.id)) : []]);
  if (!roles) { app().innerHTML = cabecera('Roles y permisos', '#/usuarios') + '<div class="caja">Los roles todavía no están instalados en la base de datos (falta correr el paso 18).</div>'; return; }
  const cuantos = c => us.filter(u => u.rol === c && u.activo).length, ed = esAdmin();
  if (cod) {
    const r = cod === 'nuevo' ? { codigo: '', nombre: '', base: 'personal', permisos: [], descripcion: '', activo: true } : roles.find(x => x.codigo === cod);
    if (!r) return RUTAS.roles();
    const todo = r.base !== 'personal', bloq = !ed || todo;
    app().innerHTML = cabecera(cod === 'nuevo' ? 'Nuevo rol' : r.nombre, '#/roles') + `<form class="caja" id="f"><div class="rejilla">
      <div><label>Nombre del rol</label><input name="nombre" required value="${esc(r.nombre)}" ${ed ? '' : 'disabled'}></div>
      <div><label>Nivel</label>${cod === 'nuevo' ? `<select name="base"><option value="personal">Según sus permisos</option><option value="gerencia">Gerencia (hace y autoriza todo lo operativo)</option></select>` : `<input value="${esc(NIVELES[r.base])}" disabled>`}</div>
      ${cod === 'nuevo' ? `<div><label>Copiar los permisos de</label><select name="copia"><option value="">(ninguno)</option>${roles.filter(x => x.base === 'personal').map(x => `<option value="${esc(x.codigo)}">${esc(x.nombre)}</option>`).join('')}</select></div>` : `<div><label>Estado</label><select name="activo" ${ed && !['administrador', 'gerencia'].includes(r.codigo) ? '' : 'disabled'}><option value="true">Activo</option><option value="false" ${r.activo ? '' : 'selected'}>Desactivado</option></select></div>`}
      <div class="ancho"><label>Qué hace (se ve al asignar el rol)</label><textarea name="descripcion" rows="2" ${ed ? '' : 'disabled'}>${esc(r.descripcion || '')}</textarea></div>
    </div>
    ${todo ? `<p class="nota">Este nivel puede todo${r.base === 'gerencia' ? ' lo operativo (menos usuarios, roles y configuración)' : ''}: no necesita marcar permisos.</p>` : ''}
    <div id="perms">${PERMISOS.map(([g, l]) => `<fieldset style="margin:10px 0"><legend><b>${esc(g)}</b></legend>${l.map(([k, t]) => `<label style="font-weight:400;color:var(--texto);display:flex;gap:6px;align-items:center;margin:3px 0"><input type="checkbox" name="p" value="${k}" style="width:auto" ${todo || r.permisos.includes(k) ? 'checked' : ''} ${bloq ? 'disabled' : ''}>${esc(t)}</label>`).join('')}</fieldset>`).join('')}</div>
    ${ed ? `<div class="acciones">${cod !== 'nuevo' && !r.sistema ? '<button type="button" class="sec" id="borrar">Borrar rol</button>' : ''}<button>Guardar</button></div>` : ''}</form>`;
    const f = $('#f');
    if (cod === 'nuevo') f.copia.onchange = () => { const c = roles.find(x => x.codigo === f.copia.value); f.querySelectorAll('[name=p]').forEach(x => x.checked = !!c?.permisos.includes(x.value)); };
    if ($('#borrar')) $('#borrar').onclick = async () => { if (!confirm(`¿Borrar el rol «${r.nombre}»?`)) return; try { await q(sb.from('roles').delete().eq('id', r.id)); aviso('Rol borrado.'); location.hash = '#/roles'; } catch (e) { aviso(falla(e), true); } };
    f.onsubmit = async ev => {
      ev.preventDefault(); const d = datosForm(f), permisos = [...f.querySelectorAll('[name=p]:checked')].map(x => x.value);
      if (!todo && !permisos.some(p => p.startsWith('sec.'))) return aviso('Marcá al menos una sección a la que entra.', true);
      ocupado(f, true);
      try {
        if (cod === 'nuevo') {
          const codigo = norm(d.nombre).slice(0, 30) || 'rol';
          if (roles.some(x => x.codigo === codigo)) throw new Error('Ya hay un rol con un nombre parecido.');
          await q(sb.from('roles').insert({ org_id: S.org.id, codigo, nombre: d.nombre, base: d.base, descripcion: d.descripcion || null, permisos: d.base === 'personal' ? permisos : [], orden: 60 }));
        } else await q(sb.from('roles').update({ nombre: d.nombre, descripcion: d.descripcion || null, ...(todo ? {} : { permisos }), ...(d.activo !== undefined ? { activo: d.activo === 'true' } : {}) }).eq('id', r.id));
        await cargarOrg(); aviso('Rol guardado.'); location.hash = '#/roles';
      } catch (e) { ocupado(f, false); aviso(falla(e), true); }
    };
    return;
  }
  app().innerHTML = cabecera('Roles y permisos', '#/usuarios') + `<p class="nota">Cada usuario tiene un rol según su puesto. El rol dice a qué secciones entra y qué puede hacer; la base de datos lo revisa en cada registro, así que no depende solo de los botones que se ven. ${ed ? 'Tocá un rol para ver o cambiar sus permisos, o creá uno nuevo para un puesto que no esté.' : ''}</p>
  ${ed ? '<div class="acciones" style="justify-content:flex-start"><a class="boton" href="#/roles/nuevo">+ Nuevo rol</a></div>' : ''}
  <div class="tabla"><table><thead><tr><th>Rol</th><th>Qué hace</th><th>Secciones</th>${ed ? '<th class="n">Usuarios</th>' : ''}</tr></thead><tbody>
  ${roles.map(r => `<tr${r.activo ? '' : ' style="opacity:.5"'}><td><a href="#/roles/${esc(r.codigo)}"><b>${esc(r.nombre)}</b></a>${r.activo ? '' : '<br><span class="nota">Desactivado</span>'}</td><td>${esc(r.descripcion || '')}</td><td>${r.base !== 'personal' ? 'Todas' : ['adm', 'cre', 'cer'].filter(s => r.permisos.includes('sec.' + s)).map(s => SECCIONES[s]).join(', ')}</td>${ed ? `<td class="n">${cuantos(r.codigo)}</td>` : ''}</tr>`).join('')}
  </tbody></table></div>
  <h2>Quién pide, quién autoriza y quién anula</h2>
  <p class="nota">Regla general: <b>nadie autoriza lo que él mismo pidió</b>, ni gerencia ni el administrador. Lo autorizado no se borra: se anula con motivo y queda en la bitácora. Lo que dice una solicitud (monto, proveedor, cotizaciones) ya no se cambia después de enviada.</p>
  <div class="tabla"><table><thead><tr><th>Trámite</th><th>Lo pide</th><th>Lo autoriza</th><th>Lo anula o corrige después</th></tr></thead><tbody>
    ${QUIEN_AUTORIZA.map(f => `<tr>${f.map((c, i) => i ? `<td>${esc(c)}</td>` : `<td><b>${esc(c)}</b></td>`).join('')}</tr>`).join('')}
  </tbody></table></div>
  <p class="nota">«Gerencia» incluye al administrador. Si querés que alguien de la junta (presidencia o tesorería) autorice, por ejemplo las compras que pide la misma gerencia, dale el permiso «Autoriza o rechaza compras…» en su usuario o en su rol.</p>
  <h2>Qué permiso tiene cada rol</h2><div class="tabla"><table><thead><tr><th>Permiso</th>${roles.filter(r => r.activo).map(r => `<th style="writing-mode:vertical-rl;transform:rotate(180deg);white-space:nowrap;font-size:12px">${esc(r.nombre)}</th>`).join('')}</tr></thead><tbody>
  ${PERMISOS.map(([g, l]) => `<tr><th colspan="${roles.length + 1}" style="text-align:left;background:var(--fondo2,#f3f4f1)">${esc(g)}</th></tr>` + l.map(([k, t]) => `<tr><td>${esc(t)}</td>${roles.filter(r => r.activo).map(r => `<td style="text-align:center">${r.base !== 'personal' || r.permisos.includes(k) ? '✓' : ''}</td>`).join('')}</tr>`).join('')).join('')}
  </tbody></table></div>`;
};
SECCION_DE.roles = '';
GUIA_DE.roles = 'roles'; GUIA_DE.usuarios = 'roles';
