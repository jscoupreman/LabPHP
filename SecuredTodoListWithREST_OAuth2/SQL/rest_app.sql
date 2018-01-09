/*
SQLyog Community v12.2.2 (64 bit)
MySQL - 5.7.11 : Database - rest_app
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`rest_app` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `rest_app`;

/*Table structure for table `itemlist` */

DROP TABLE IF EXISTS `itemlist`;

CREATE TABLE `itemlist` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `listID` int(10) unsigned NOT NULL,
  `text` varchar(255) NOT NULL,
  `done` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `ListID` (`listID`),
  CONSTRAINT `ListID` FOREIGN KEY (`listID`) REFERENCES `list` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=latin1;

/*Table structure for table `list` */

DROP TABLE IF EXISTS `list`;

CREATE TABLE `list` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `accountID` int(10) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`,`accountID`),
  KEY `accountID` (`accountID`),
  CONSTRAINT `accountID` FOREIGN KEY (`accountID`) REFERENCES `rest_auth`.`account` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=latin1;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
