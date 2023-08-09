<?php
require_once(dirname(__DIR__, 2) . '/core.php');

// Technically not a controller yet, POC is using functions only

function get_user_guilds(string $access_token): ?array
{
    $res = send_curl_request("https://discord.com/api/users/@me/guilds", CURL_TYPE::GET, headers: ["Authorization: Bearer {$access_token}"]);
    if($res == null){
        return null;
    }
    return array_map('map_user_guilds', $res);
}

function get_user_available_guilds(string $access_token)
{
    
    $api_url = get_string_setting('api_url');
    if($api_url == null){
        die('configure api_url in environment config');
    }
    $res = send_curl_request("{$api_url}/@me/guilds", CURL_TYPE::GET, headers: ["Authorization: Bearer {$access_token}"]);
    return $res;
}

function map_user_guilds(array $guild): array
{
    return [
        'id' => $guild['id'],
        'name' => $guild['name'],
        'icon' => $guild['icon'],
        'owner' => $guild['owner'],
    ];
}