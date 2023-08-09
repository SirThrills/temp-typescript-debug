<?php

function get_me(string $access_token)
{
    $res = send_curl_request('https://discord.com/api/users/@me', CURL_TYPE::GET, headers: ["Authorization: Bearer {$access_token}"]);
    return $res;
}