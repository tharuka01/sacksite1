<?php include 'db.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Latest News</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
    .news-card {
      background: #fff; padding: 16px; margin-bottom: 16px;
      border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .news-card h3 { margin: 0 0 8px 0; }
    .news-card img { max-width: 100%; height: auto; display:block; margin: 10px 0; border-radius: 6px; }
    .news-card small { color: #777; }
  </style>
</head>
<body>
  <h2>Latest News</h2>
  <?php
  $sql = "SELECT title, content, image_path, created_at FROM news ORDER BY created_at DESC";
  $result = $conn->query($sql);

  if ($result && $result->num_rows > 0) {
      while ($row = $result->fetch_assoc()) {
          echo "<div class='news-card'>";
          echo "<h3>" . htmlspecialchars($row['title']) . "</h3>";
          if (!empty($row['image_path'])) {
              // show image if available
              echo "<img src='" . htmlspecialchars($row['image_path']) . "' alt='news image'>";
          }
          echo "<p>" . nl2br(htmlspecialchars($row['content'])) . "</p>";
          echo "<small>Posted on: " . htmlspecialchars($row['created_at']) . "</small>";
          echo "</div>";
      }
  } else {
      echo "<p>No news found.</p>";
  }
  ?>
</body>
</html>
