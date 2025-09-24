<?php
session_start();
if (!isset($_SESSION['username'])) {
    header("Location: login.php");
    exit;
}
include 'db.php';
?>



<?php include 'db.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Add News</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    form label { display:block; margin-top:12px; }
  </style>
</head>
<body>
  <h2>Add News</h2>

  <!-- IMPORTANT: enctype must be multipart/form-data for file uploads -->
  <form method="POST" action="" enctype="multipart/form-data">
    <label>Title:</label>
    <input type="text" name="title" required>

    <label>Content:</label>
    <textarea name="content" rows="5" cols="60" required></textarea>

    <label>Image (optional):</label>
    <input type="file" name="image" accept="image/*">

    <div style="margin-top:14px;">
      <input type="submit" value="Submit">
    </div>
  </form>

  <?php
  if ($_SERVER["REQUEST_METHOD"] === "POST") {
      $title   = $_POST['title'] ?? '';
      $content = $_POST['content'] ?? '';
      $imagePath = null;  // default if no image

      // ---- Handle image if provided ----
      if (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
          if ($_FILES['image']['error'] === UPLOAD_ERR_OK) {
              $tmpPath  = $_FILES['image']['tmp_name'];
              $size     = $_FILES['image']['size'];
              $origName = $_FILES['image']['name'];

              // Basic size limit: ~2 MB (adjust if you want)
              if ($size > 2 * 1024 * 1024) {
                  die("❌ Image too large (max 2 MB).");
              }

              // Validate mime type
              $finfo = finfo_open(FILEINFO_MIME_TYPE);
              $mime  = finfo_file($finfo, $tmpPath);
              finfo_close($finfo);

              $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/gif' => 'gif', 'image/webp' => 'webp'];
              if (!isset($allowed[$mime])) {
                  die("❌ Unsupported image type. Allowed: JPG, PNG, GIF, WEBP.");
              }

              // Build safe unique filename
              $ext = $allowed[$mime];
              $safeBase = bin2hex(random_bytes(8)); // random
              $fileName = $safeBase . "_" . time() . "." . $ext;

              $destDir  = __DIR__ . DIRECTORY_SEPARATOR . "uploads";
              if (!is_dir($destDir)) {
                  mkdir($destDir, 0777, true);
              }
              $destPath = $destDir . DIRECTORY_SEPARATOR . $fileName;

              if (!move_uploaded_file($tmpPath, $destPath)) {
                  die("❌ Failed to save uploaded image.");
              }

              // Path to store in DB (web path)
              $imagePath = "uploads/" . $fileName;
          } else {
              die("❌ Upload error code: " . $_FILES['image']['error']);
          }
      }

      // ---- Insert row (prepared statement) ----
      $stmt = $conn->prepare("INSERT INTO news (title, content, image_path) VALUES (?, ?, ?)");
      $stmt->bind_param("sss", $title, $content, $imagePath);

      if ($stmt->execute()) {
          echo "<p>✅ News added successfully!</p>";
      } else {
          echo "❌ Error: " . $stmt->error;
      }
      $stmt->close();
  }
  ?>
</body>
</html>
