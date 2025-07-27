
let procedimientos = [];
let catalogo = JSON.parse(localStorage.getItem('catalogo_procedimientos')) || [];

function actualizarSelectCatalogo() {
  const select = document.getElementById('procedimientosSelect');
  select.innerHTML = '<option value="">-- Selecciona un tratamiento --</option>';
  catalogo.forEach(({ nombre }) => {
    const option = document.createElement('option');
    option.value = nombre;
    option.textContent = nombre;
    select.appendChild(option);
  });
}

function agregarProcedimientoCatalogo() {
  const nombre = document.getElementById('nuevoProcedimiento').value.trim();
  const precio = parseFloat(document.getElementById('precioProcedimiento').value);
  if (nombre && !isNaN(precio) && !catalogo.some(p => p.nombre === nombre)) {
    catalogo.push({ nombre, precio });
    localStorage.setItem('catalogo_procedimientos', JSON.stringify(catalogo));
    actualizarSelectCatalogo();
    document.getElementById('nuevoProcedimiento').value = '';
    document.getElementById('precioProcedimiento').value = '';
  }
}

function seleccionarProcedimiento() {
  const nombre = document.getElementById('procedimientosSelect').value;
  const cantidad = parseInt(document.getElementById('cantidadProcedimiento').value) || 1;
  const proc = catalogo.find(p => p.nombre === nombre);
  if (proc && !procedimientos.some(p => p.nombre === nombre)) {
    procedimientos.push({ nombre: proc.nombre, precio: proc.precio, cantidad });
    actualizarTabla();
  }
}

function actualizarTabla() {
  const tbody = document.querySelector('#tablaProcedimientos tbody');
  tbody.innerHTML = '';
  procedimientos.forEach((proc, index) => {
    const subtotal = proc.precio * proc.cantidad;
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${proc.nombre}</td>
      <td>${proc.cantidad}</td>
      <td>S/ ${proc.precio.toFixed(2)}</td>
      <td>S/ ${subtotal.toFixed(2)}</td>
      <td><button onclick="eliminarProcedimiento(${index})" class="btn-danger">Eliminar</button></td>
    `;
    tbody.appendChild(fila);
  });
}

function eliminarProcedimiento(index) {
  procedimientos.splice(index, 1);
  actualizarTabla();
}

function calcular() {
  const nombre = document.getElementById('nombre').value;
  const celular = document.getElementById('celular').value;
  const descuento = parseFloat(document.getElementById('descuento').value);

  const subtotal = procedimientos.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
  const total = subtotal - (subtotal * descuento / 100);

  let tablaHTML = `
    <table>
      <thead>
        <tr><th>Tratamiento</th><th>Cantidad</th><th>Precio Unitario (S/)</th><th>Subtotal (S/)</th></tr>
      </thead>
      <tbody>
  `;
  procedimientos.forEach(p => {
    const sub = p.precio * p.cantidad;
    tablaHTML += `<tr><td>${p.nombre}</td><td>${p.cantidad}</td><td>S/ ${p.precio.toFixed(2)}</td><td>S/ ${sub.toFixed(2)}</td></tr>`;
  });
  tablaHTML += `
      </tbody>
      <tfoot>
        <tr><td colspan="3"><strong>Subtotal</strong></td><td>S/ ${subtotal.toFixed(2)}</td></tr>
        <tr><td colspan="3"><strong>Descuento</strong></td><td>${descuento}%</td></tr>
        <tr><td colspan="3"><strong>Total a pagar</strong></td><td><strong>S/ ${total.toFixed(2)}</strong></td></tr>
      </tfoot>
    </table>
  `;

  document.getElementById('result').innerHTML = `
    <div id="resumen">
      <h3 class="titulo">Resumen de Atención - ODONTO 22</h3>
      <p><strong>Paciente:</strong> ${nombre}</p>
      <p><strong>Celular:</strong> ${celular}</p>
      ${tablaHTML}
    </div>
  `;

  guardarEnLocalStorage({ nombre, celular, procedimientos, subtotal, descuento, total });
}

function guardarEnLocalStorage(data) {
  const registros = JSON.parse(localStorage.getItem('registros')) || [];
  registros.push(data);
  localStorage.setItem('registros', JSON.stringify(registros));
}

function eliminarDatos() {
  if (confirm('¿Estás seguro de que deseas eliminar todos los datos guardados?')) {
    localStorage.removeItem('registros');
    localStorage.removeItem('catalogo_procedimientos');
    catalogo = [];
    procedimientos = [];
    actualizarSelectCatalogo();
    actualizarTabla();
    alert('Datos eliminados correctamente.');
  }
}

function captura() {
  const area = document.getElementById('resumen');
  html2canvas(area).then(canvas => {
    const link = document.createElement('a');
    link.download = 'resumen_atencion_odonto22.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}

actualizarSelectCatalogo();
