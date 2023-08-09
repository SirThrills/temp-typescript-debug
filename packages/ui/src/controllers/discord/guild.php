<?php
require_once(dirname(__DIR__, 2) . '/core.php');

// Technically not a controller yet, POC is using functions only

function get_user_guilds()
{
    $token = $_SESSION['access_token'];
    $res = send_curl_request('https://discord.com/api/users/@me/guilds', CURL_TYPE::GET, headers: ["Authorization: Bearer {$token}"]);
    return $res;
}

function get_user_guild_info(string $guild_id, string $user_id)
{
    $token = $_SESSION['access_token'];
    $res = send_curl_request("https://discord.com/api/users/@me/guilds/{$guild_id}/member", CURL_TYPE::GET, headers: ["Authorization: Bearer {$token}"]);
    return $res;
}