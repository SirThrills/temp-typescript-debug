<?php
require_once(dirname(__DIR__) . '/core.php');

// Technically not a controller yet, POC is using functions only

function get_user_guilds()
{
    $token = $_SESSION['access_token'];
    $res = send_curl_request('https://discord.com/api/users/@me/guilds', CURL_TYPE::GET, headers: ["Authorization: Bearer {$token}"]);
    return $res;
}

function get_user_guild_roles(string $guild_id, string $user_id)
{

}