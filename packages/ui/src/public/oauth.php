<?php 

if(!isset($_GET['code'])){
    die('Missing oauth code');
}

if(empty($_GET['code']) || strlen($_GET['code']) > 256){
    die('Invalid oauth code');
}

require_once(dirname(__DIR__) . '/core.php');

function validate_result(?array $result): bool
{
    if($result == null){
        die('No result');
    }

    error_log(print_r($result, true));

    if(
        !isset($result['token_type']) || 
        $result['token_type'] == null ||
        !is_string($result['token_type'])
    ) {
        die('Invalid token_type');
    }
    if(
        !isset($result['access_token']) || 
        $result['access_token'] == null ||
        !is_string($result['access_token'])
    ){
        die('Invalid access_token');
    }
    if(
        !isset($result['expires_in']) || 
        $result['expires_in'] == null ||
        !is_int($result['expires_in'])
    ){
        die('Invalid expires_in');
    }
    if(
        !isset($result['refresh_token']) || 
        $result['refresh_token'] == null ||
        !is_string($result['refresh_token'])
    ){
        die('Invalid refresh_token');
    }
    if(
        !isset($result['scope']) || 
        $result['scope'] == null ||
        !is_string($result['scope'])
    ){
        die('Invalid scope');
    }

    return true;
}

function exchange_code(string $code): array {
    $fields = [
        'client_id' => get_string_setting('discord_client_id'),
        'client_secret' => get_string_setting('discord_client_secret'),
        'grant_type' => 'authorization_code',
        'code' => $code,
        'redirect_uri' => get_string_setting('discord_redirect_uri')
    ];
    try {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, "https://discord.com/api/v10/oauth2/token");
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $result = curl_exec($ch);

        if($result == null){
            die('No api response');
        }
        
        $response = json_decode($result, true);

        if(!validate_result($response)){
            die('Invalid api response');
        }

        return $response;
    } catch(Exception $e) {
        error_log($e->getMessage());
    }
}

$result = exchange_code($_GET['code']);

if(session_status() == PHP_SESSION_ACTIVE){
    session_destroy();
}
session_start();

$_SESSION['access_token'] = $result['access_token'];
$_SESSION['expires_in'] = $result['expires_in'];
$_SESSION['refresh_token'] = $result['refresh_token'];
$_SESSION['scopes'] = explode(' ', $result['scope']);

header('Location: index.php');