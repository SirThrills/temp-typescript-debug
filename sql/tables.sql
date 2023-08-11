/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE IF NOT EXISTS `guilds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `guild_id` varchar(50) NOT NULL,
  `guild_name` varchar(255) NOT NULL,
  `guild_icon` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `guild_bans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `guild_id` varchar(50) NOT NULL,
  `author_id` varchar(50) NOT NULL,
  `author_name` varchar(50) NOT NULL,
  `target_id` varchar(50) NOT NULL,
  `target_name` varchar(50) DEFAULT NULL,
  `reason` varchar(6000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `guild_channel_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `guild_id` varchar(50) NOT NULL,
  `channel_id` varchar(50) NOT NULL,
  `channel_type` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `guild_forum_rss_posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `forum_rss_id` int(11) NOT NULL,
  `post_url` varchar(2000) NOT NULL,
  `post_content` varchar(6000) DEFAULT NULL,
  `post_id` varchar(50) NOT NULL,
  `post_image` varchar(2000) DEFAULT NULL,
  `timestamp` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `guild_forum_rss_post_queue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `guild_id` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `guild_forum_rss_urls` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `guild_id` varchar(50) NOT NULL,
  `channel_id` varchar(50) NOT NULL,
  `ping_role_id` varchar(50) DEFAULT NULL,
  `embed_color` varchar(50) DEFAULT NULL,
  `embed_image` varchar(2000) NOT NULL,
  `rss_url` varchar(2000) NOT NULL,
  `rss_type` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `guild_role_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `guild_id` varchar(50) NOT NULL,
  `role_id` varchar(50) NOT NULL,
  `permission` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `guild_timeouts` (
  `id` int(11) DEFAULT NULL,
  `guild_id` varchar(50) DEFAULT NULL,
  `target_id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `guild_warnings` (
  `id` int(11) NOT NULL DEFAULT 0,
  `guild_id` varchar(50) NOT NULL,
  `author_id` varchar(50) NOT NULL,
  `author_name` varchar(50) NOT NULL,
  `target_id` varchar(50) NOT NULL,
  `target_name` varchar(50) NOT NULL,
  `reason` varchar(50) NOT NULL,
  `points` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `web_sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `discord_access_token` varchar(250) NOT NULL,
  `jwt_access_token` varchar(250) NOT NULL,
  `jwt_secret` varchar(250) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `expires_in` int(11) NOT NULL,
  `last_used` datetime DEFAULT NULL,
  `added` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `discord_access_token` (`discord_access_token`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
