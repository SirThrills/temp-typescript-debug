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

$my_guilds = [];
foreach($active_guilds as $active_guild){
    foreach($guilds as $guild){
        if($guild['id'] === $active_guild['guild_id']){
            error_log("comparing {$guild['id']} to {$active_guild['guild_id']}");
            $my_guilds[] = $active_guild;
        }
    }
}

error_log(print_r($my_guilds, true));
?>

<html lang="en" data-bs-theme="dark">
<head>
    <?php require_once(dirname(__DIR__) . '/templates/css.php'); ?>
</head>
<body>
    <main class="d-flex flex-nowrap">
        <?php require_once(dirname(__DIR__) . '/templates/sidebar.php'); ?>
        <div class="p-4">
            <span>Select a server to manage</span>
        </div>
    </main>
</body>
<?php require_once(dirname(__DIR__) . '/templates/scripts.php'); ?>
</html>