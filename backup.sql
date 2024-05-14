-- MySQL dump 10.13  Distrib 8.3.0, for Linux (aarch64)
--
-- Host: localhost    Database: catchmind
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Room`
--

DROP TABLE IF EXISTS `Room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Room` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `maximum` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Room_code_key` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Room`
--

LOCK TABLES `Room` WRITE;
/*!40000 ALTER TABLE `Room` DISABLE KEYS */;
INSERT INTO `Room` VALUES ('clw620byz0001b0h2fvtqhh5s',9,'ㄷㅈㄹㅈㄷ',NULL,'2024-05-14 07:10:52.571',NULL);
/*!40000 ALTER TABLE `Room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('clw53holk0000quwjly767b59','wef','wef','','2024-05-13 15:04:35.529','2024-05-13 15:04:30.363',0);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Word`
--

DROP TABLE IF EXISTS `Word`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Word` (
  `id` int NOT NULL AUTO_INCREMENT,
  `word` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `wordBookId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Word_wordBookId_fkey` (`wordBookId`),
  CONSTRAINT `Word_wordBookId_fkey` FOREIGN KEY (`wordBookId`) REFERENCES `WordBook` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Word`
--

LOCK TABLES `Word` WRITE;
/*!40000 ALTER TABLE `Word` DISABLE KEYS */;
INSERT INTO `Word` VALUES (1,'納得','2024-05-13 15:04:52.795',1),(2,'暴露','2024-05-14 06:53:52.710',1),(3,'討論','2024-05-14 06:54:17.895',1),(4,'放送','2024-05-14 06:54:47.305',1),(5,'可能','2024-05-14 06:55:38.504',1),(6,'報道','2024-05-14 06:55:38.504',1),(7,'辞める','2024-05-14 06:56:25.014',1),(8,'塊','2024-05-14 06:56:49.405',1),(9,'円滑','2024-05-14 06:57:15.280',1),(10,'疑う','2024-05-14 06:57:35.384',1),(11,'執念','2024-05-14 06:58:36.054',1),(12,'漏れる','2024-05-14 06:59:06.633',1),(13,'乏しい','2024-05-14 06:59:27.759',1),(14,'茶飯事','2024-05-14 07:00:30.892',1),(15,'支える','2024-05-14 07:00:30.892',1),(16,'励む','2024-05-14 07:00:30.892',1),(17,'焦燥','2024-05-14 07:01:31.363',1),(18,'伴う','2024-05-14 07:01:55.588',1),(19,'巡る','2024-05-14 07:02:37.129',1),(20,'包装','2024-05-14 07:03:48.554',1),(21,'領域','2024-05-14 07:04:10.969',1),(22,'敵','2024-05-14 07:05:24.764',1),(23,'供給','2024-05-14 07:05:38.660',1),(24,'貿易','2024-05-14 07:06:36.228',1),(25,'討論','2024-05-14 07:06:49.768',1),(26,'簡潔','2024-05-14 07:07:21.263',1),(27,'過大','2024-05-14 07:07:47.005',1),(28,'序幕','2024-05-14 07:08:17.049',1),(29,'帰省客','2024-05-14 07:08:40.908',1),(30,'伝染','2024-05-14 07:25:53.331',1),(31,'派生','2024-05-14 07:26:20.397',1);
/*!40000 ALTER TABLE `Word` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WordBook`
--

DROP TABLE IF EXISTS `WordBook`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WordBook` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `creatorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `WordBook_creatorId_fkey` (`creatorId`),
  CONSTRAINT `WordBook_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WordBook`
--

LOCK TABLES `WordBook` WRITE;
/*!40000 ALTER TABLE `WordBook` DISABLE KEYS */;
INSERT INTO `WordBook` VALUES (1,'고급일본어 한자테스트','clw53holk0000quwjly767b59','2024-05-13 15:04:44.939','2024-05-14 07:09:14.209');
/*!40000 ALTER TABLE `WordBook` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_RoomToWordBook`
--

DROP TABLE IF EXISTS `_RoomToWordBook`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_RoomToWordBook` (
  `A` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `B` int NOT NULL,
  UNIQUE KEY `_RoomToWordBook_AB_unique` (`A`,`B`),
  KEY `_RoomToWordBook_B_index` (`B`),
  CONSTRAINT `_RoomToWordBook_A_fkey` FOREIGN KEY (`A`) REFERENCES `Room` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_RoomToWordBook_B_fkey` FOREIGN KEY (`B`) REFERENCES `WordBook` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_RoomToWordBook`
--

LOCK TABLES `_RoomToWordBook` WRITE;
/*!40000 ALTER TABLE `_RoomToWordBook` DISABLE KEYS */;
INSERT INTO `_RoomToWordBook` VALUES ('clw620byz0001b0h2fvtqhh5s',1);
/*!40000 ALTER TABLE `_RoomToWordBook` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('24c422cc-443e-470f-9be9-19de2a0cbb2e','ea78aa21818d5c721512510dfd197d4de7d5a78a1892238b344455f150db8b51','2024-05-13 05:53:08.369','20240504090649_room_1',NULL,NULL,'2024-05-13 05:53:08.349',1),('33969d78-d3c3-4cc4-8a01-a8b1eaeb8ef1','bc0536082e6c31f1fd170bf5a0cc80bcfd9bc260119c285facd9e17d597ce6cd','2024-05-13 05:53:08.348','20240504081119_init',NULL,NULL,'2024-05-13 05:53:08.231',1),('62c4ae56-0e2e-4e83-931f-f85e3da029ba','b719019cfee71e568fdbe7079304befb2e338f7a424cb335a2f42512c5f57e0e','2024-05-13 05:53:08.383','20240506133520_delete_user_count',NULL,NULL,'2024-05-13 05:53:08.371',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-14  7:31:07
