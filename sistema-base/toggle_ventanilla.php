<?php
include("conexion.php");
header("Content-Type: application/json");

$sql = "SELECT modo FROM config_ventanilla WHERE id = 1 LIMIT 1";
$result = $conn->query($sql);

if (!$result || !$row = $result->fetch_assoc()) {
    echo json_encode(["ok" => false, "mensaje" => "No se encontró configuración"]);
    exit;
}

$modoActual = trim(strtolower($row["modo"]));

if ($modoActual === "automatico") {
    $nuevoModo = "forzado_abierto";
} elseif ($modoActual === "forzado_abierto") {
    $nuevoModo = "forzado_cerrado";
} else {
    $nuevoModo = "automatico";
}

$update = "UPDATE config_ventanilla SET modo = '$nuevoModo' WHERE id = 1";

if ($conn->query($update)) {
    echo json_encode([
        "ok" => true,
        "modo" => $nuevoModo
    ]);
} else {
    echo json_encode([
        "ok" => false,
        "mensaje" => "No se pudo actualizar"
    ]);
}
?>