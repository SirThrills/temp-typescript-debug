<?php

require_once(dirname(__DIR__) . '/core.php');

function get_me()
{
    $token = $_SESSION['access_token'];
    $res = send_curl_request('https://discord.com/api/users/@me', CURL_TYPE::GET, headers: ["Authorization: Bearer {$token}"]);
    return $res;
}