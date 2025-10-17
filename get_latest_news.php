<?php
include 'db.php';

$sql = "SELECT * FROM news ORDER BY created_at DESC LIMIT 6";
$result = $conn->query($sql);

if (!$result) {
    die("SQL error: " . $conn->error);
}

$newsItems = [];

while($row = $result->fetch_assoc()) {
    $newsItems[] = $row;
}

header('Content-Type: application/json');
echo json_encode($newsItems);
?>
