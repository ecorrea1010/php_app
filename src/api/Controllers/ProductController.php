<?php
require_once __DIR__ . '/../Models/ProductModel.php';

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];
$model = new ProductModel();

switch ($method) {
    case "GET":
        echo json_encode($model->getAll());
        break;

    case "POST":
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data['name'] || !$data['price']) {
            http_response_code(400);
            echo json_encode(["error" => "Nombre y precio son requeridos"]);
            exit;
        }
        $ok = $model->create($data['name'], $data['price']);
        echo json_encode(["message" => $ok ? "Producto creado correctamente" : "Error al crear producto"]);
        break;

    case "PUT":
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = $params['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "ID requerido"]);
            exit;
        }
        $data = json_decode(file_get_contents("php://input"), true);
        $ok = $model->update($id, $data['name'], $data['price']);
        echo json_encode(["message" => $ok ? "Producto actualizado correctamente" : "Error al actualizar producto"]);
        break;

    case "DELETE":
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = $params['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "ID requerido"]);
            exit;
        }
        $ok = $model->delete($id);
        echo json_encode(["message" => $ok ? "Producto eliminado correctamente" : "Error al eliminar producto"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
        break;
}
