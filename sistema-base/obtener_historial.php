<?php
include("conexion.php");

$tipo = $_GET['tipo'] ?? 'todos';
$desde = $_GET['desde'] ?? '';
$hasta = $_GET['hasta'] ?? '';

$sql = "SELECT codigo, nombres, apellidos, local, tipo, fecha, fecha_aprobacion, monto 
        FROM reservas 
        WHERE TRIM(LOWER(estado)) = 'aprobado'";

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
$data = [];

while ($row = $result->fetch_assoc()) {
    $montoMostrar = ($row['tipo'] === 'Concesión') 
        ? 'Por concesión' 
        : 'S/ ' . number_format((float)$row['monto'], 2);

    $data[] = [
        "codigo" => $row['codigo'],
        "nombre" => $row['nombres'] . " " . $row['apellidos'],
        "local" => $row['local'],
        "tipo" => $row['tipo'],
        "fecha" => $row['fecha'],
        "fecha_aprobacion" => $row['fecha_aprobacion'],
        "monto" => $montoMostrar
    ];
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($data);
$conn->close();
?>