<?php include 'db.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Add News</title>
</head>
<body>
  <h2>Add News</h2>
  <form method="POST" action="">
    <label>Title:</label><br>
    <input type="text" name="title" required><br><br>
    <label>Content:</label><br>
    <textarea name="content" rows="5" cols="40" required></textarea><br><br>
    <input type="submit" value="Submit">
  </form>

  <?php
  if ($_SERVER["REQUEST_METHOD"] == "POST") {
      $title   = $_POST['title'];
      $content = $_POST['content'];

      $sql = "INSERT INTO news (title, content) VALUES ('$title', '$content')";
      if ($conn->query($sql) === TRUE) {
          echo "<p>News added successfully!</p>";
      } else {
          echo "Error: " . $sql . "<br>" . $conn->error;
      }
  }
  ?>
</body>
</html>
