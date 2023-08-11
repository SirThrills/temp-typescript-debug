<?php 
require_once(dirname(__DIR__) . '/core.php');

enum Permission: int
{
    case VIEW_SERVER = 1;
    case VIEW_ROLES = 2;
    case VIEW_RSS = 3;
    case VIEW_CHANNEL_LOGGING = 4;
    case VIEW_BANS = 5;
    case VIEW_WARNINGS = 6;

    case EDIT_ROLE_PERMISSION = 102;
    case EDIT_RSS_FEEDS = 103;
    case EDIT_CHANNEL_LOGGING = 104;
    case EDIT_BANS = 105;
    case EDIT_WARNINGS = 106;
}

function get_bot_guilds(): ?array
{
    try {
        $db = new DB_HANDLER();
        $db->connect();
        $res = $db->query('SELECT * FROM `guilds`');
        $db->close();

        if($res && count($res) > 0){
            return $res;
        }
    } catch(Exception $e){
        error_log($e->getMessage());
    }

    return null;
}

function get_bot_guild_info(string $guild_id): ?array
{
    try {
        $db = new DB_HANDLER();
        $db->connect();
        $res = $db->query('SELECT * FROM `guilds` WHERE `guild_id` = ?', [$guild_id]);
        $db->close();

        if($res && count($res) == 1){
            return $res;
        }
    } catch(Exception $e){
        error_log($e->getMessage());
    }

    return null;
}

function add_permission(string $guild_id, string $role_id, Permission $permission)
{
    try {
        $db = new DB_HANDLER();
        $db->connect();
        $db->query('INSERT INTO `guild_role_permissions` (`guild_id`, `role_id`, `permission`) VALUES (?,?,?)', [$guild_id, $role_id, $permission->value]);
        $db->close();
    } catch(Exception $e){
        error_log($e->getMessage());
    }
}

function remove_permission_by_id(int $permission_id)
{
    try {
        $db = new DB_HANDLER();
        $db->connect();
        $db->query('DELETE FROM `guild_role_permissions` WHERE `id` = ?', [$permission_id]);
        $db->close();
    } catch(Exception $e){
        error_log($e->getMessage());
    }
}

function get_permissions_by_guild_role(string $guild_id, string $role_id): ?array
{
    try {
        $db = new DB_HANDLER();
        $db->connect();
        $res = $db->query('SELECT * FROM `guild_role_permissions` WHERE `guild_id` = ? AND `role_id` = ?', [$guild_id, $role_id]);
        $db->close();

        if($res && count($res) > 0){
            return $res;
        }
    } catch(Exception $e){
        error_log($e->getMessage());
    }
    
    return null;
}