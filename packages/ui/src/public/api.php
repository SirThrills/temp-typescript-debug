<?php

if($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'GET'){
    http_response_code(400);
    exit();
}

require_once(dirname(__DIR__) . '/core.php')