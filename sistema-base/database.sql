CREATE DATABASE  IF NOT EXISTS `muni_virtual` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `muni_virtual`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: muni_virtual
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `pagos`
--

DROP TABLE IF EXISTS `pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo_reserva` varchar(10) DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos`
--

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
/*!40000 ALTER TABLE `pagos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservas`
--

DROP TABLE IF EXISTS `reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(10) DEFAULT NULL,
  `nombres` varchar(100) DEFAULT NULL,
  `apellidos` varchar(100) DEFAULT NULL,
  `dni` char(8) DEFAULT NULL,
  `celular` char(9) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `ubicacion` varchar(150) DEFAULT NULL,
  `actividad` varchar(150) DEFAULT NULL,
  `tipo` enum('Alquiler','Concesión') DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_fin` time DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `local` varchar(100) DEFAULT NULL,
  `motivo_rechazo` text DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `fecha_aprobacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservas`
--

LOCK TABLES `reservas` WRITE;
/*!40000 ALTER TABLE `reservas` DISABLE KEYS */;
INSERT INTO `reservas` VALUES (1,'632058','Ángel farid','Cortez huamani','77076676','964618290','angelfarid2020952@gmail.com','Jr.gregorio paredes 316','basketcito','Alquiler','2026-04-07','19:00:00','23:00:00','Pendiente de pago','Losa Deportiva Beto D\'Laura',NULL,80.00,NULL),(2,'364366','JULIO','GUZMAN','77777777','985461328','OEASD@DSDA.COM','ROSALES','BAILE','Concesión','2026-04-07','12:00:00','16:00:00','Aprobado','Losa Deportiva Beto D\'Laura',NULL,0.00,'2026-04-13 13:22:30'),(3,'660464','JULIO','GUZMAN','77777777','985461328','OEASD@DSDA.COM','ROSALES','BAILE','Concesión','2026-04-09','12:00:00','16:00:00','Rechazado','Losa Deportiva Beto D\'Laura','fdgfghj',0.00,NULL),(4,'121734','pedro','GUZMAN','77777777','985461328','OEASD@DSDA.COM','ROSALES','BAILE','Concesión','2026-04-10','12:00:00','16:00:00','Aprobado','Losa Deportiva Beto D\'Laura',NULL,0.00,'2026-04-13 13:22:30'),(5,'805240','juan','GUZMAN','77777777','985461328','OEASD@DSDA.COM','ROSALES','BAILE','Concesión','2026-04-11','12:00:00','16:00:00','Aprobado','Losa Deportiva Beto D\'Laura',NULL,0.00,'2026-04-13 13:22:30'),(6,'595044','dasd','asdasd','15440426','964618290','angelfarid2020952@gmail.com','asdasd','sdasda','Alquiler','2026-04-08','08:00:00','10:00:00','Aprobado','Losa Deportiva Beto D\'Laura',NULL,40.00,'2026-04-13 13:22:30'),(7,'539400','Ángel farid','Cortez huamani','15440426','964618290','angelfarid2020952@gmail.com','asdasdasdas','asdasdas','Concesión','2026-04-08','13:00:00','15:00:00','Aprobado','Losa Deportiva Beto D\'Laura',NULL,0.00,'2026-04-13 13:22:30'),(8,'496645','nao','Cortez huamani','15440426','964618290','angelfarid2020952@gmail.com','asdasdasdas','asdasdas','Concesión','2026-04-08','18:00:00','20:00:00','Aprobado','Losa Deportiva Beto D\'Laura',NULL,0.00,'2026-04-13 13:22:30'),(9,'448434','Ángel farid','Cortez huamani','77777777','999999999','angelfarid2020952@gmail.com','jr.','vooey','Alquiler','2026-04-07','14:00:00','18:00:00','Aprobado','Coliseo Lolo Fernández',NULL,200.00,'2026-04-13 13:22:30'),(10,'357137','Ángel farid','Cortez huamani','15440426','964618290','angelfarid2020952@gmail.com','ñ{ñ',',k','Alquiler','2026-04-08','12:00:00','16:00:00','Rechazado','Coliseo Lolo Fernández','ññ',200.00,NULL),(11,'911200','Ángel farid','Cortez huamani','15440426','964618290','angelfarid2020952@gmail.com','ug67gh','jbb','Alquiler','2026-04-16','08:00:00','23:00:00','Aprobado','Coliseo Lolo Fernández',NULL,750.00,'2026-04-13 13:22:30'),(12,'592033','Ángel farid','Cortez huamani','15440426','964618290','angelfarid2020952@gmail.com','hhjh','hhh','Concesión','2026-04-08','16:00:00','20:00:00','Aprobado','Coliseo Lolo Fernández',NULL,0.00,'2026-04-13 13:22:30'),(13,'287735','Ángel farid','Cortez huamani','15440426','964618290','angelfarid2020952@gmail.com','hhjh','hhh','Concesión','2026-04-09','16:00:00','20:00:00','Aprobado','Coliseo Lolo Fernández',NULL,0.00,'2026-04-13 13:22:30'),(14,'575117','Ángel farid','Cortez huamani','15440426','964618290','angelfarid2020952@gmail.com','hhjh','hhh','Concesión','2026-04-10','16:00:00','20:00:00','Aprobado','Coliseo Lolo Fernández',NULL,0.00,'2026-04-13 13:22:30'),(15,'820423','Ángel farid','Cortez huamani','15440426','964618290','angelfarid2020952@gmail.com','hhjh','hhh','Alquiler','2026-04-10','10:00:00','14:00:00','Aprobado','Coliseo Lolo Fernández',NULL,200.00,'2026-04-13 13:22:30'),(16,'110463','Ángel farid','Cortez huamani','11111111','964618290','angelfarid2020952@gmail.com','sda','asdasd','Concesión','2026-04-11','08:00:00','12:00:00','Aprobado','Coliseo Lolo Fernández',NULL,0.00,'2026-04-13 13:22:30'),(17,'652605','Ángel farid','Cortez huamani','15440426','964618290','angelfarid2020952@gmail.com','ghghfhf','dasdasd','Alquiler','2026-04-11','15:00:00','17:00:00','Aprobado','Coliseo Lolo Fernández',NULL,100.00,'2026-04-13 13:22:30'),(18,'325892','Ángel farid','Cortez huamani','15440426','964618290','angelfarid2020952@gmail.com','SA<ZX','Z<X<ZX<ZX','Alquiler','2026-04-11','20:00:00','21:00:00','Aprobado','Coliseo Lolo Fernández',NULL,50.00,'2026-04-13 13:22:30'),(19,'885094','Ángel farid','Cortez huamani','55555555','555555555','angelfarid2020952@gmail.com','5555','55555','Concesión','2026-04-12','10:00:00','12:00:00','Aprobado','Coliseo Lolo Fernández',NULL,0.00,'2026-04-13 13:22:30'),(20,'640621','Ángel farid','Cortez huamani','15440426','964618290','angelfarid2020952@gmail.com','asdasd','asdasdasd','Concesión','2026-04-13','08:00:00','10:00:00','Aprobado','Coliseo Lolo Fernández',NULL,0.00,'2026-04-13 13:22:30'),(21,'167673','Ángel farid','Cortez huamani','77777777','777777777','angelfarid2020952@gmail.com','777mhgf','asdasdas','Alquiler','2026-04-13','11:00:00','12:00:00','Aprobado','Coliseo Lolo Fernández',NULL,50.00,'2026-04-13 13:22:30'),(22,'408268','nao','Cortez huamani','77777777','777777777','angelfarid2020952@gmail.com','mmm','xz<czxv','Alquiler','2026-04-15','08:00:00','09:00:00','Aprobado','Coliseo Lolo Fernández',NULL,50.00,'2026-04-13 13:22:30'),(23,'490454','red de salud','maria jose','77777777','979777777','asdasd','adsasdas','audiendcia','Alquiler','2026-04-14','08:00:00','12:00:00','Aprobado','Coliseo Lolo Fernández',NULL,200.00,'2026-04-13 13:22:30'),(24,'996244','Ángel farid','Cortez huamani','15440426','964618290','angelfarid2020952@gmail.com','mm','kkk','Concesión','2026-04-13','16:00:00','17:00:00','Aprobado','Losa Deportiva Beto D\'Laura',NULL,0.00,'2026-04-13 13:18:14'),(25,'308035','Ángel farid','Cortez huamani','15440426','964618290','angelfarid2020952@gmail.com','aaaaa','voleyball','Alquiler','2026-04-14','08:00:00','10:00:00','Aprobado','Losa Deportiva Beto D\'Laura',NULL,40.00,'2026-04-13 14:59:58'),(26,'190504','Ángel farid','Cortez huamani','15440426','964618290','angelfarid2020952@gmail.com','kjkk','basket','Alquiler','2026-04-15','09:00:00','13:00:00','Pendiente de pago','Losa Deportiva Beto D\'Laura',NULL,80.00,NULL);
/*!40000 ALTER TABLE `reservas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `rol` enum('admin','cajera') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin','admin123','admin'),(2,'cajera1','caja123','cajera'),(3,'fffffff','111111','cajera'),(4,'cajera 7','123456','cajera');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

CREATE TABLE config_ventanilla (
    id INT PRIMARY KEY,
    modo VARCHAR(50)
);

INSERT INTO config_ventanilla (id, modo)
VALUES (1, 'automatico');