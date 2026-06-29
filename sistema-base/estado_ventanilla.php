<?php
include("conexion.php");
header("Content-Type: application/json");

$modo = "automatico";

$sql = "SELECT modo FROM config_ventanilla WHERE id = 1 LIMIT 1";
$result = $conn->query($sql);

if ($result && $row = $result->fetch_assoc()) {
    $modo = trim(strtolower($row["modo"]));
}

echo json_encode([
    "ok" => true,
    "modo" => $modo
]);
?>