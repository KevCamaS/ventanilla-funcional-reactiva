    <?php
include("conexion.php");

// Obtener filtros
$tipo = $_GET['tipo'] ?? 'todos';
$desde = $_GET['desde'] ?? '';
$hasta = $_GET['hasta'] ?? '';

// Consulta base
$sql = "SELECT codigo, nombres, apellidos, local, tipo, fecha, fecha_aprobacion, monto 
        FROM reservas 
        WHERE TRIM(LOWER(estado)) = 'aprobado'";

// Filtros
if ($tipo !== "todos") {
    $sql .= " AND tipo = '$tipo'";
}

if (!empty($desde) && !empty($hasta)) {
    $sql .= " AND fecha BETWEEN '$desde' AND '$hasta'";
} elseif (!empty($desde)) {
    $sql .= " AND fecha >= '$desde'";
} elseif (!empty($hasta)) {
    $sql .= " AND fecha <= '$hasta'";
}

$sql .= " ORDER BY fecha_aprobacion DESC, codigo DESC";

$result = $conn->query($sql);

// CABECERAS PARA EXCEL
header("Content-Type: application/vnd.ms-excel");
header("Content-Disposition: attachment; filename=historial_reservas.xls");
header("Pragma: no-cache");
header("Expires: 0");

// Tabla
echo "<table border='1'>";
echo "<tr>
        <th>Código</th>
        <th>Nombre del Solicitante</th>
        <th>Local</th>
        <th>Tipo</th>
        <th>Fecha de Solicitud</th>
        <th>Fecha de Aprobación</th>
        <th>Monto Total</th>
      </tr>";

// Datos
while ($row = $result->fetch_assoc()) {
    echo "<tr>";
    echo "<td>".$row['codigo']."</td>";
    echo "<td>".$row['nombres']." ".$row['apellidos']."</td>";
    echo "<td>".$row['local']."</td>";
    echo "<td>".$row['tipo']."</td>";
    echo "<td>".$row['fecha']."</td>";
    echo "<td>".$row['fecha_aprobacion']."</td>";
    echo "<td>S/ ".$row['monto']."</td>";
    echo "</tr>";
}

echo "</table>";
?>