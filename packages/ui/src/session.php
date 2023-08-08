<?php

if(session_status() === PHP_SESSION_NONE){
    session_start();
}

function is_valid_session(): bool
{
    if(!isset($_SESSION['access_token']) || $_SESSION['access_token'] == null){
        return false;
    }
    return true;
}
