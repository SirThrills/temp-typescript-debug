<?php
require_once(dirname(__DIR__) . '/core.php');
require_once(dirname(__DIR__) . '/oauth_util.php');
require_once(dirname(__DIR__) . '/controllers/bot.php');
require_once(dirname(__DIR__) . '/controllers/user.php');
require_once(dirname(__DIR__) . '/controllers/guild.php');

if(!is_valid_session()){
    $url = generate_oauth_url();
    header('Location: ' . $url);
    exit();
}

$me = get_me();
$guilds = get_user_guilds();
$active_guilds = get_bot_guilds();
?>

<html lang="en" data-bs-theme="dark">
<head>
    <?php require_once(dirname(__DIR__) . '/templates/css.php'); ?>
</head>
<body>
    <?php require_once(dirname(__DIR__) . '/templates/sidebar.php'); ?>
</body>
<?php require_once(dirname(__DIR__) . '/templates/scripts.php'); ?>
</html>