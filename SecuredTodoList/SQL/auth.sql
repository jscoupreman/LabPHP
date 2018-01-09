/*
SQLyog Community v12.2.0 (64 bit)
MySQL - 5.6.15-log : Database - auth
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`auth` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;

USE `auth`;

/*Table structure for table `account` */

DROP TABLE IF EXISTS `account`;

CREATE TABLE `account` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `token_key` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `token_expiration` timestamp NULL DEFAULT NULL,
  `session_key` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `account_validated` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `reg_email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `backup_email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `join_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_ip` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `failed_logins` int(10) NOT NULL DEFAULT '0',
  `last_login` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `online` tinyint(3) NOT NULL DEFAULT '0',
  `account_level` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`reg_email`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `reg_email` (`reg_email`),
  UNIQUE KEY `backup_email` (`backup_email`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
