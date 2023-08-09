<?php

function has_permission(string $guild_id, Permission $permission): bool
{
    error_log('session roles' . json_encode($_SESSION['roles']));
    if(!isset($_SESSION['roles']) || $_SESSION['roles'] == null)
    {
        return false;
    }

    if(!isset($_SESSION['roles'][$guild_id]) || $_SESSION['roles'][$guild_id] == null || count($_SESSION['roles'][$guild_id]) == 0){
        return false;
    }

    foreach($_SESSION['roles'][$guild_id] as $guild_role){
        if(check_guild_role_permissions($guild_id, $guild_role, $permission)){
            return true;
        }
    }

    return false;
}

function check_guild_role_permissions(string $guild_id, string $role_id, Permission $permission): bool
{
    $permission_rows = get_permissions_by_guild_role($guild_id, $role_id);

    if($permission_rows == null){
        return false;
    }

    foreach($permission_rows as $permission_row){
        error_log('checking' . print_r($permission_row, true));
        if($permission_row['permission'] == $permission->value){
            return true;
        }
    }

    return false;
}

