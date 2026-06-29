<?php
include("conexion.php");
header("Content-Type: application/json");
date_default_timezone_set("America/Lima");

$horaActual = date("H:i:s");

$inicio = "08:00:00";
$fin = "17:00:00";

$estaEnHorario = ($horaActual >= $inicio && $horaActual < $fin);

$modo = "automatico";

$sql = "SELECT modo FROM config_ventanilla WHERE id = 1 LIMIT 1";
$result = $conn->query($sql);

if ($result && $row = $result->fetch_assoc()) {
    $modo = trim(strtolower($row["modo"]));
}

if ($modo === "forzado_abierto") {
    $permitido = true;
    $mensaje = "La ventanilla fue habilitada manualmente por el administrador.";
} elseif ($modo === "forzado_cerrado") {
    $permitido = false;
    $mensaje = "La ventanilla está cerrada por el administrador.";
} else {
    $permitido = $estaEnHorario;

    if ($permitido) {
        $mensaje = "La ventanilla está abierta.";
    } else {
        $mensaje = "Lo sentimos, la ventanilla está cerrada. El horario de atención es de 8:00 a.m. a 5:00 p.m.";
    }
}

echo json_encode([
    "ok" => true,
    "permitido" => $permitido,
    "modo" => $modo,
    "en_horario" => $estaEnHorario,
    "hora_actual" => $horaActual,
    "mensaje" => $mensaje
]);
?>