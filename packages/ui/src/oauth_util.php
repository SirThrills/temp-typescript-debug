<?php
require_once('core.php');

function generate_oauth_url(): string
{
    $client_id = get_string_setting('discord_client_id');
    $redirect_uri = get_string_setting('discord_redirect_uri');
    $client_scopes = get_string_setting('discord_client_scopes');

    if($client_id == null || $redirect_uri == null || $client_scopes == null){
        throw new Exception('invalid configuration settings');
    }

    $redirect_uri = urlencode($redirect_uri);
    $client_scopes = urlencode($client_scopes);
    return "https://discord.com/api/oauth2/authorize?client_id={$client_id}&redirect_uri={$redirect_uri}&response_type=code&scope={$client_scopes}";
}