<?php
require_once(dirname(__DIR__) . '/core.php');
require_once(dirname(__DIR__) . '/oauth_util.php');
require_once(dirname(__DIR__) . '/controllers/bot.php');
require_once(dirname(__DIR__) . '/controllers/discord_api.php');

if(!is_valid_session()){
    delete_session();
    $url = generate_oauth_url();
    header('Location: ' . $url);
    exit();
}

$me = get_me($_SESSION['access_token']);
$user_available_guilds = get_user_available_guilds($_SESSION['access_token']);
$_SESSION['user_guilds'] = $user_available_guilds;
?>

<html lang="en" data-bs-theme="dark">
<head>
    <?php require_once(dirname(__DIR__) . '/templates/head.php'); ?>
</head>
<body>
    <main class="d-flex flex-nowrap">
        <?php require_once(dirname(__DIR__) . '/templates/sidebar.php'); ?>
        
        <div class="d-flex w-100 justify-content-center align-items-center" id="select-server">
            <?php if($user_available_guilds) { ?>
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
            <div class="d-flex w-100 mt-5 justify-content-center align-items-centers" id="management">
                <?php require_once(dirname(__DIR__) . '/templates/server.html'); ?>
            </div>
        </div>
    </main>
</body>
<?php require_once(dirname(__DIR__) . '/templates/scripts.php'); ?>
</html>