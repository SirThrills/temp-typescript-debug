<?php
require_once(dirname(__DIR__) . '/core.php');

if(session_status() == PHP_SESSION_ACTIVE){
    error_log('destroy');
    session_destroy();
}

header('Location: index.php');