<?php
session_start();
if (isset($_SESSION['username'])) {
    header("Location: add_news.php");
    exit;
}

$error = "";
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = trim($_POST["username"] ?? "");
    $password = $_POST["password"] ?? "";

    // Simple hardcoded creds for now
    $ADMIN_USER = "admin";
    $ADMIN_PASS = "admin123";

    if ($username === $ADMIN_USER && $password === $ADMIN_PASS) {
        $_SESSION['username'] = $ADMIN_USER;
        header("Location: add_news.php");
        exit;
    } else {
        $error = "Invalid username or password.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Admin Login</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; }
    .card { max-width: 360px; padding: 16px; border: 1px solid #ddd; border-radius: 8px; }
    label { display:block; margin:10px 0 6px; }
    input[type="text"], input[type="password"] { width:100%; padding:8px; }
    .error { color:#b00020; margin-top:10px; }
  </style>
</head>
<body>
  <h2>Admin Login</h2>
  <div class="card">
    <form method="POST" action="login.php">
      <label>Username</label>
      <input type="text" name="username" required>

      <label>Password</label>
      <input type="password" name="password" required>

      <div style="margin-top:12px;">
        <button type="submit">Log in</button>
      </div>

      <?php if ($error): ?>
        <div class="error"><?= htmlspecialchars($error) ?></div>
      <?php endif; ?>
    </form>
  </div>
</body>
</html>
