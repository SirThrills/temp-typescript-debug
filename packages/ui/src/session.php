<?php
require_once('core.php');

if(session_status() === PHP_SESSION_NONE){
    session_start();
}

function is_valid_session(): bool
{
    if(!isset($_SESSION['access_token']) || $_SESSION['access_token'] == null){
        return false;
    }

    $session = get_user_session_by_auth_token($_SESSION['access_token']);
    if($session == null){
        return false;
    }

    $expiration_time = strtotime($session['added']) + ($session['expires_in'] - 60);
    $remaining = $expiration_time - time();
    if(time() > $expiration_time){
        return false;
    }
    return true;
}

function get_user_session_by_id(string $user_id){
    try {
        $db = new DB_HANDLER();
        $db->connect();
        $res = $db->query('SELECT * FROM `web_sessions` WHERE `user_id` = ?', [$user_id]);
        $db->close();

        if($res == null || count($res) != 1){
            return null;
        }
        return $res[0];
    } catch(Exception $e) {
        error_log($e->getMessage());
        die('error fetching existing user session');
    }
}

function get_user_session_by_auth_token(string $auth_token){
    try {
        $db = new DB_HANDLER();
        $db->connect();
        $res = $db->query('SELECT * FROM `web_sessions` WHERE `auth_token` = ?', [$auth_token]);
        $db->close();

        if($res == null || count($res) != 1){
            return null;
        }
        return $res[0];
    } catch(Exception $e) {
        error_log($e->getMessage());
        die('error fetching existing user session');
    }
}

function add_session(array $oauthData, array $me){
    $user_session = get_user_session_by_id($me['id']);
    if($user_session != null){
        delete_session($me['id']);
    }
    try {
        $db = new DB_HANDLER();
        $db->connect();
        $res = $db->query('INSERT INTO `web_sessions` (`auth_token`, `user_id`, `expires_in`) VALUES (?,?,?)', [$oauthData['access_token'], $me['id'], $oauthData['expires_in']]);
        $db->close();

        $_SESSION['access_token'] = $oauthData['access_token'];
        $_SESSION['expires_in'] = $oauthData['expires_in'];
        $_SESSION['refresh_token'] = $oauthData['refresh_token'];
        $_SESSION['scopes'] = explode(' ', $oauthData['scope']);
    } catch(Exception $e) {
        error_log($e->getMessage());
        die('error adding new session to db');
    }
}

function delete_session(?string $user_id = null){
    if($user_id){
        try {
            $db = new DB_HANDLER();
            $db->connect();
            $db->query('DELETE FROM `web_sessions` WHERE `user_id` = ?', [$user_id]);
            $db->close();
        } catch(Exception $e) {
            error_log($e->getMessage());
            die('error deleting existing user session');
        }
        return;
    }

    if(isset($_SESSION['access_token'])){
        try {
            $db = new DB_HANDLER();
            $db->connect();
            $db->query('DELETE FROM `web_sessions` WHERE `auth_token` = ?', [$_SESSION['access_token']]);
            $db->close();
        } catch(Exception $e) {
            error_log($e->getMessage());
            die('error deleting existing user session');
        }
    }
}