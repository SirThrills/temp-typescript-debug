<?php 
enum CURL_TYPE: string {
    case GET = "GET";
    case POST = "POST";
}

function send_curl_request(string $url, CURL_TYPE $type, ?array $headers = null, ?array $fields = null): ?array
{
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    if($headers){
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }
    if($type->value == 'POST'){
        curl_setopt($ch, CURLOPT_POST, true);
        if($fields){
            curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
        }   
    }

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $result = curl_exec($ch);

    if($result == null){
        die('No api response');
    }
    
    return json_decode($result, true);
}