<?php
require_once(dirname(__DIR__) . '/core.php');
require_once(dirname(__DIR__) . '/oauth_util.php');
require_once(dirname(__DIR__) . '/controllers/bot.php');
require_once(dirname(__DIR__) . '/controllers/discord_api.php');

if(!is_valid_session()){
    $url = generate_oauth_url();
    header('Location: ' . $url);
    exit();
}

error_log("token {$_SESSION['access_token']}");

$me = get_me();
if($me['id'] == null){
    header('Location: logout.php');
    exit();
}
$guilds = get_user_guilds();
$active_guilds = get_bot_guilds();

$my_guilds = [];
foreach($active_guilds as $active_guild){
    foreach($guilds as $guild){
        if(is_string($guild) || is_string($active_guild)){
            die('something went horribly wrong ' . $guild . ' ... ' . $active_guild);
        }
        if($guild['id'] === $active_guild['guild_id']){
            $guild_member = get_user_guild_info($active_guild['guild_id'], $me['id']);
            if(isset($guild_member['roles'])){
                $_SESSION['roles'][$active_guild['guild_id']] = $guild_member['roles'];
                if(has_permission($active_guild['guild_id'], Permission::VIEW_SERVER)){
                    $my_guilds[] = $active_guild;
                }
            }
        }
    }
}
?>

<html lang="en" data-bs-theme="dark">
<head>
    <?php require_once(dirname(__DIR__) . '/templates/css.php'); ?>
</head>
<body>
    <main class="d-flex flex-nowrap">
        <?php require_once(dirname(__DIR__) . '/templates/sidebar.php'); ?>
        
        <div class="d-flex w-100 justify-content-center align-items-center" id="select-server">
            <?php if($my_guilds) { ?>
                <span>Select a server to manage</span>
            <?php } else { ?>
                <span>You are not authorized to access any bigpoint servers</span>
            <?php } ?>
        </div>
        <div class="d-flex w-100 d-none" id="server-management">
            <div class="d-none d-flex w-100 flex-column text-white justify-content-center align-items-center" id="loading">
                <div class="p-2">
                    <i class="fas fa-sync fa-spin fa-4x"></i>
                </div>
                <div class="p-2">
                    <span>Fetching server info</span>
                </div>
            </div>
        </div>
    </main>
</body>
<?php require_once(dirname(__DIR__) . '/templates/scripts.php'); ?>
</html>