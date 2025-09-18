<?php
require_once __DIR__ . '/../Classes/DB.php';

class ProductModel {
    private $db;

    public function __construct() {
        $this->db = DB::getInstance();
    }

    public function getAll() {
        $stmt = $this->db->prepare("SELECT * FROM products");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function create($name, $price) {
        $stmt = $this->db->prepare("INSERT INTO products (name, price) VALUES (:name, :price)");
        return $stmt->execute([
            ':name'  => $name,
            ':price' => $price
        ]);
    }

    public function update($id, $name, $price) {
        $stmt = $this->db->prepare("UPDATE products SET name = :name, price = :price WHERE id = :id");
        return $stmt->execute([
            ':name'  => $name,
            ':price' => $price,
            ':id'    => $id
        ]);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM products WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }
}
