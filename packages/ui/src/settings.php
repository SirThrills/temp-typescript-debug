<?php
function get_string_setting(string $setting_name, ?string $filename = 'config.ini'): ?string
{
    $ini = parse_ini_file($filename);
    if(isset($ini[$setting_name])){
        return $ini[$setting_name];
    }
    return null;
}