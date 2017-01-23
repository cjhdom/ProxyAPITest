-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- 생성 시간: 17-01-23 01:36
-- 서버 버전: 5.7.17-0ubuntu0.16.04.1
-- PHP 버전: 7.0.13-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 데이터베이스: `proxyAPI`
--
CREATE DATABASE IF NOT EXISTS `proxyAPI` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `proxyAPI`;

-- --------------------------------------------------------

--
-- 테이블 구조 `feServer`
--

DROP TABLE IF EXISTS `feServer`;
CREATE TABLE IF NOT EXISTS `feServer` (
  `serverNO` int(11) NOT NULL AUTO_INCREMENT,
  `serverIDC` varchar(2) COLLATE utf8_unicode_ci NOT NULL,
  `serverName` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`serverNO`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 삽입 전에 테이블 비우기 `feServer`
--

TRUNCATE TABLE `feServer`;
--
-- 테이블의 덤프 데이터 `feServer`
--

INSERT INTO `feServer` (`serverNO`, `serverIDC`, `serverName`) VALUES
(3, 'gm', 'novafe01gm'),
(4, 'gm', 'novafe02gm'),
(5, 'gm', 'novafe03gm'),
(6, 'gm', 'novafe04gm'),
(7, 'gm', 'novafe05gm'),
(8, 'gm', 'novafe06gm'),
(9, 'gh', 'novafe01gh'),
(10, 'gh', 'novafe02gh'),
(11, 'gh', 'novafe03gh'),
(12, 'gh', 'novafe04gh'),
(13, 'gh', 'novafe05gh'),
(14, 'gh', 'novafe06gh');

-- --------------------------------------------------------

--
-- 테이블 구조 `proxyServer`
--

DROP TABLE IF EXISTS `proxyServer`;
CREATE TABLE IF NOT EXISTS `proxyServer` (
  `proxyServerNO` int(11) NOT NULL AUTO_INCREMENT,
  `proxyServerName` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `proxyServerIDC` varchar(2) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`proxyServerNO`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 삽입 전에 테이블 비우기 `proxyServer`
--

TRUNCATE TABLE `proxyServer`;
--
-- 테이블의 덤프 데이터 `proxyServer`
--

INSERT INTO `proxyServer` (`proxyServerNO`, `proxyServerName`, `proxyServerIDC`) VALUES
(1, 'novafeprx01gm', 'gm'),
(2, 'novafeprx02gm', 'gm'),
(3, 'novafeprx03gm', 'gm'),
(4, 'novafeprx01gh', 'gh'),
(5, 'novafeprx02gh', 'gh'),
(6, 'novafeprx03gh', 'gh');

-- --------------------------------------------------------

--
-- 테이블 구조 `service`
--

DROP TABLE IF EXISTS `service`;
CREATE TABLE IF NOT EXISTS `service` (
  `serviceNO` int(11) NOT NULL AUTO_INCREMENT,
  `serviceName` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`serviceNO`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 삽입 전에 테이블 비우기 `service`
--

TRUNCATE TABLE `service`;
--
-- 테이블의 덤프 데이터 `service`
--

INSERT INTO `service` (`serviceNO`, `serviceName`) VALUES
(5, 'PC_KR'),
(6, 'PC_KR_VT'),
(7, 'PC_GLOBAL'),
(8, 'MOBILE_KR'),
(9, 'MOBILE_GLOBAL'),
(10, 'MOBILE_KR_VT');

-- --------------------------------------------------------

--
-- 테이블 구조 `weight`
--

DROP TABLE IF EXISTS `weight`;
CREATE TABLE IF NOT EXISTS `weight` (
  `weightNO` int(11) NOT NULL AUTO_INCREMENT,
  `proxyServerNO` int(11) NOT NULL,
  `proxyServerName` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `proxyServerIDC` varchar(2) COLLATE utf8_unicode_ci NOT NULL,
  `serverNO` int(11) NOT NULL,
  `serverName` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `serverIDC` varchar(2) COLLATE utf8_unicode_ci NOT NULL,
  `serviceNO` int(11) NOT NULL,
  `serviceName` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `weight` tinyint(4) NOT NULL,
  PRIMARY KEY (`weightNO`),
  KEY `weightNO` (`weightNO`,`proxyServerNO`,`serverNO`,`serviceNO`),
  KEY `weightNO_2` (`weightNO`),
  KEY `proxyNO` (`proxyServerNO`,`serverNO`,`serviceNO`)
) ENGINE=InnoDB AUTO_INCREMENT=896 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 삽입 전에 테이블 비우기 `weight`
--

TRUNCATE TABLE `weight`;
--
-- 테이블의 덤프 데이터 `weight`
--

INSERT INTO `weight` (`weightNO`, `proxyServerNO`, `proxyServerName`, `proxyServerIDC`, `serverNO`, `serverName`, `serverIDC`, `serviceNO`, `serviceName`, `weight`) VALUES
(464, 1, 'novafeprx01gm', 'gm', 3, 'novafe01gm', 'gm', 5, 'PC_KR', 1),
(465, 2, 'novafeprx02gm', 'gm', 3, 'novafe01gm', 'gm', 5, 'PC_KR', 1),
(466, 3, 'novafeprx03gm', 'gm', 3, 'novafe01gm', 'gm', 5, 'PC_KR', 1),
(467, 4, 'novafeprx01gh', 'gh', 3, 'novafe01gm', 'gm', 5, 'PC_KR', 0),
(468, 5, 'novafeprx02gh', 'gh', 3, 'novafe01gm', 'gm', 5, 'PC_KR', 0),
(469, 6, 'novafeprx03gh', 'gh', 3, 'novafe01gm', 'gm', 5, 'PC_KR', 0),
(470, 1, 'novafeprx01gm', 'gm', 3, 'novafe01gm', 'gm', 6, 'PC_KR_VT', 1),
(471, 2, 'novafeprx02gm', 'gm', 3, 'novafe01gm', 'gm', 6, 'PC_KR_VT', 1),
(472, 3, 'novafeprx03gm', 'gm', 3, 'novafe01gm', 'gm', 6, 'PC_KR_VT', 1),
(473, 4, 'novafeprx01gh', 'gh', 3, 'novafe01gm', 'gm', 6, 'PC_KR_VT', 0),
(474, 5, 'novafeprx02gh', 'gh', 3, 'novafe01gm', 'gm', 6, 'PC_KR_VT', 0),
(475, 6, 'novafeprx03gh', 'gh', 3, 'novafe01gm', 'gm', 6, 'PC_KR_VT', 0),
(476, 1, 'novafeprx01gm', 'gm', 3, 'novafe01gm', 'gm', 7, 'PC_GLOBAL', 1),
(477, 2, 'novafeprx02gm', 'gm', 3, 'novafe01gm', 'gm', 7, 'PC_GLOBAL', 1),
(478, 3, 'novafeprx03gm', 'gm', 3, 'novafe01gm', 'gm', 7, 'PC_GLOBAL', 1),
(479, 4, 'novafeprx01gh', 'gh', 3, 'novafe01gm', 'gm', 7, 'PC_GLOBAL', 0),
(480, 5, 'novafeprx02gh', 'gh', 3, 'novafe01gm', 'gm', 7, 'PC_GLOBAL', 0),
(481, 6, 'novafeprx03gh', 'gh', 3, 'novafe01gm', 'gm', 7, 'PC_GLOBAL', 0),
(482, 1, 'novafeprx01gm', 'gm', 3, 'novafe01gm', 'gm', 8, 'MOBILE_KR', 1),
(483, 2, 'novafeprx02gm', 'gm', 3, 'novafe01gm', 'gm', 8, 'MOBILE_KR', 1),
(484, 3, 'novafeprx03gm', 'gm', 3, 'novafe01gm', 'gm', 8, 'MOBILE_KR', 1),
(485, 4, 'novafeprx01gh', 'gh', 3, 'novafe01gm', 'gm', 8, 'MOBILE_KR', 0),
(486, 5, 'novafeprx02gh', 'gh', 3, 'novafe01gm', 'gm', 8, 'MOBILE_KR', 0),
(487, 6, 'novafeprx03gh', 'gh', 3, 'novafe01gm', 'gm', 8, 'MOBILE_KR', 0),
(488, 1, 'novafeprx01gm', 'gm', 3, 'novafe01gm', 'gm', 9, 'MOBILE_GLOBAL', 1),
(489, 2, 'novafeprx02gm', 'gm', 3, 'novafe01gm', 'gm', 9, 'MOBILE_GLOBAL', 1),
(490, 3, 'novafeprx03gm', 'gm', 3, 'novafe01gm', 'gm', 9, 'MOBILE_GLOBAL', 1),
(491, 4, 'novafeprx01gh', 'gh', 3, 'novafe01gm', 'gm', 9, 'MOBILE_GLOBAL', 0),
(492, 5, 'novafeprx02gh', 'gh', 3, 'novafe01gm', 'gm', 9, 'MOBILE_GLOBAL', 0),
(493, 6, 'novafeprx03gh', 'gh', 3, 'novafe01gm', 'gm', 9, 'MOBILE_GLOBAL', 0),
(494, 1, 'novafeprx01gm', 'gm', 3, 'novafe01gm', 'gm', 10, 'MOBILE_KR_VT', 1),
(495, 2, 'novafeprx02gm', 'gm', 3, 'novafe01gm', 'gm', 10, 'MOBILE_KR_VT', 1),
(496, 3, 'novafeprx03gm', 'gm', 3, 'novafe01gm', 'gm', 10, 'MOBILE_KR_VT', 1),
(497, 4, 'novafeprx01gh', 'gh', 3, 'novafe01gm', 'gm', 10, 'MOBILE_KR_VT', 0),
(498, 5, 'novafeprx02gh', 'gh', 3, 'novafe01gm', 'gm', 10, 'MOBILE_KR_VT', 0),
(499, 6, 'novafeprx03gh', 'gh', 3, 'novafe01gm', 'gm', 10, 'MOBILE_KR_VT', 0),
(500, 1, 'novafeprx01gm', 'gm', 4, 'novafe02gm', 'gm', 5, 'PC_KR', 1),
(501, 2, 'novafeprx02gm', 'gm', 4, 'novafe02gm', 'gm', 5, 'PC_KR', 1),
(502, 3, 'novafeprx03gm', 'gm', 4, 'novafe02gm', 'gm', 5, 'PC_KR', 1),
(503, 4, 'novafeprx01gh', 'gh', 4, 'novafe02gm', 'gm', 5, 'PC_KR', 0),
(504, 5, 'novafeprx02gh', 'gh', 4, 'novafe02gm', 'gm', 5, 'PC_KR', 0),
(505, 6, 'novafeprx03gh', 'gh', 4, 'novafe02gm', 'gm', 5, 'PC_KR', 0),
(506, 1, 'novafeprx01gm', 'gm', 4, 'novafe02gm', 'gm', 6, 'PC_KR_VT', 1),
(507, 2, 'novafeprx02gm', 'gm', 4, 'novafe02gm', 'gm', 6, 'PC_KR_VT', 1),
(508, 3, 'novafeprx03gm', 'gm', 4, 'novafe02gm', 'gm', 6, 'PC_KR_VT', 1),
(509, 4, 'novafeprx01gh', 'gh', 4, 'novafe02gm', 'gm', 6, 'PC_KR_VT', 0),
(510, 5, 'novafeprx02gh', 'gh', 4, 'novafe02gm', 'gm', 6, 'PC_KR_VT', 0),
(511, 6, 'novafeprx03gh', 'gh', 4, 'novafe02gm', 'gm', 6, 'PC_KR_VT', 0),
(512, 1, 'novafeprx01gm', 'gm', 4, 'novafe02gm', 'gm', 7, 'PC_GLOBAL', 1),
(513, 2, 'novafeprx02gm', 'gm', 4, 'novafe02gm', 'gm', 7, 'PC_GLOBAL', 1),
(514, 3, 'novafeprx03gm', 'gm', 4, 'novafe02gm', 'gm', 7, 'PC_GLOBAL', 1),
(515, 4, 'novafeprx01gh', 'gh', 4, 'novafe02gm', 'gm', 7, 'PC_GLOBAL', 0),
(516, 5, 'novafeprx02gh', 'gh', 4, 'novafe02gm', 'gm', 7, 'PC_GLOBAL', 0),
(517, 6, 'novafeprx03gh', 'gh', 4, 'novafe02gm', 'gm', 7, 'PC_GLOBAL', 0),
(518, 1, 'novafeprx01gm', 'gm', 4, 'novafe02gm', 'gm', 8, 'MOBILE_KR', 1),
(519, 2, 'novafeprx02gm', 'gm', 4, 'novafe02gm', 'gm', 8, 'MOBILE_KR', 1),
(520, 3, 'novafeprx03gm', 'gm', 4, 'novafe02gm', 'gm', 8, 'MOBILE_KR', 1),
(521, 4, 'novafeprx01gh', 'gh', 4, 'novafe02gm', 'gm', 8, 'MOBILE_KR', 0),
(522, 5, 'novafeprx02gh', 'gh', 4, 'novafe02gm', 'gm', 8, 'MOBILE_KR', 0),
(523, 6, 'novafeprx03gh', 'gh', 4, 'novafe02gm', 'gm', 8, 'MOBILE_KR', 0),
(524, 1, 'novafeprx01gm', 'gm', 4, 'novafe02gm', 'gm', 9, 'MOBILE_GLOBAL', 1),
(525, 2, 'novafeprx02gm', 'gm', 4, 'novafe02gm', 'gm', 9, 'MOBILE_GLOBAL', 1),
(526, 3, 'novafeprx03gm', 'gm', 4, 'novafe02gm', 'gm', 9, 'MOBILE_GLOBAL', 1),
(527, 4, 'novafeprx01gh', 'gh', 4, 'novafe02gm', 'gm', 9, 'MOBILE_GLOBAL', 0),
(528, 5, 'novafeprx02gh', 'gh', 4, 'novafe02gm', 'gm', 9, 'MOBILE_GLOBAL', 0),
(529, 6, 'novafeprx03gh', 'gh', 4, 'novafe02gm', 'gm', 9, 'MOBILE_GLOBAL', 0),
(530, 1, 'novafeprx01gm', 'gm', 4, 'novafe02gm', 'gm', 10, 'MOBILE_KR_VT', 1),
(531, 2, 'novafeprx02gm', 'gm', 4, 'novafe02gm', 'gm', 10, 'MOBILE_KR_VT', 1),
(532, 3, 'novafeprx03gm', 'gm', 4, 'novafe02gm', 'gm', 10, 'MOBILE_KR_VT', 1),
(533, 4, 'novafeprx01gh', 'gh', 4, 'novafe02gm', 'gm', 10, 'MOBILE_KR_VT', 0),
(534, 5, 'novafeprx02gh', 'gh', 4, 'novafe02gm', 'gm', 10, 'MOBILE_KR_VT', 0),
(535, 6, 'novafeprx03gh', 'gh', 4, 'novafe02gm', 'gm', 10, 'MOBILE_KR_VT', 0),
(536, 1, 'novafeprx01gm', 'gm', 5, 'novafe03gm', 'gm', 5, 'PC_KR', 1),
(537, 2, 'novafeprx02gm', 'gm', 5, 'novafe03gm', 'gm', 5, 'PC_KR', 1),
(538, 3, 'novafeprx03gm', 'gm', 5, 'novafe03gm', 'gm', 5, 'PC_KR', 1),
(539, 4, 'novafeprx01gh', 'gh', 5, 'novafe03gm', 'gm', 5, 'PC_KR', 0),
(540, 5, 'novafeprx02gh', 'gh', 5, 'novafe03gm', 'gm', 5, 'PC_KR', 0),
(541, 6, 'novafeprx03gh', 'gh', 5, 'novafe03gm', 'gm', 5, 'PC_KR', 0),
(542, 1, 'novafeprx01gm', 'gm', 5, 'novafe03gm', 'gm', 6, 'PC_KR_VT', 1),
(543, 2, 'novafeprx02gm', 'gm', 5, 'novafe03gm', 'gm', 6, 'PC_KR_VT', 1),
(544, 3, 'novafeprx03gm', 'gm', 5, 'novafe03gm', 'gm', 6, 'PC_KR_VT', 1),
(545, 4, 'novafeprx01gh', 'gh', 5, 'novafe03gm', 'gm', 6, 'PC_KR_VT', 0),
(546, 5, 'novafeprx02gh', 'gh', 5, 'novafe03gm', 'gm', 6, 'PC_KR_VT', 0),
(547, 6, 'novafeprx03gh', 'gh', 5, 'novafe03gm', 'gm', 6, 'PC_KR_VT', 0),
(548, 1, 'novafeprx01gm', 'gm', 5, 'novafe03gm', 'gm', 7, 'PC_GLOBAL', 1),
(549, 2, 'novafeprx02gm', 'gm', 5, 'novafe03gm', 'gm', 7, 'PC_GLOBAL', 1),
(550, 3, 'novafeprx03gm', 'gm', 5, 'novafe03gm', 'gm', 7, 'PC_GLOBAL', 1),
(551, 4, 'novafeprx01gh', 'gh', 5, 'novafe03gm', 'gm', 7, 'PC_GLOBAL', 0),
(552, 5, 'novafeprx02gh', 'gh', 5, 'novafe03gm', 'gm', 7, 'PC_GLOBAL', 0),
(553, 6, 'novafeprx03gh', 'gh', 5, 'novafe03gm', 'gm', 7, 'PC_GLOBAL', 0),
(554, 1, 'novafeprx01gm', 'gm', 5, 'novafe03gm', 'gm', 8, 'MOBILE_KR', 1),
(555, 2, 'novafeprx02gm', 'gm', 5, 'novafe03gm', 'gm', 8, 'MOBILE_KR', 1),
(556, 3, 'novafeprx03gm', 'gm', 5, 'novafe03gm', 'gm', 8, 'MOBILE_KR', 1),
(557, 4, 'novafeprx01gh', 'gh', 5, 'novafe03gm', 'gm', 8, 'MOBILE_KR', 0),
(558, 5, 'novafeprx02gh', 'gh', 5, 'novafe03gm', 'gm', 8, 'MOBILE_KR', 0),
(559, 6, 'novafeprx03gh', 'gh', 5, 'novafe03gm', 'gm', 8, 'MOBILE_KR', 0),
(560, 1, 'novafeprx01gm', 'gm', 5, 'novafe03gm', 'gm', 9, 'MOBILE_GLOBAL', 1),
(561, 2, 'novafeprx02gm', 'gm', 5, 'novafe03gm', 'gm', 9, 'MOBILE_GLOBAL', 1),
(562, 3, 'novafeprx03gm', 'gm', 5, 'novafe03gm', 'gm', 9, 'MOBILE_GLOBAL', 1),
(563, 4, 'novafeprx01gh', 'gh', 5, 'novafe03gm', 'gm', 9, 'MOBILE_GLOBAL', 0),
(564, 5, 'novafeprx02gh', 'gh', 5, 'novafe03gm', 'gm', 9, 'MOBILE_GLOBAL', 0),
(565, 6, 'novafeprx03gh', 'gh', 5, 'novafe03gm', 'gm', 9, 'MOBILE_GLOBAL', 0),
(566, 1, 'novafeprx01gm', 'gm', 5, 'novafe03gm', 'gm', 10, 'MOBILE_KR_VT', 1),
(567, 2, 'novafeprx02gm', 'gm', 5, 'novafe03gm', 'gm', 10, 'MOBILE_KR_VT', 1),
(568, 3, 'novafeprx03gm', 'gm', 5, 'novafe03gm', 'gm', 10, 'MOBILE_KR_VT', 1),
(569, 4, 'novafeprx01gh', 'gh', 5, 'novafe03gm', 'gm', 10, 'MOBILE_KR_VT', 0),
(570, 5, 'novafeprx02gh', 'gh', 5, 'novafe03gm', 'gm', 10, 'MOBILE_KR_VT', 0),
(571, 6, 'novafeprx03gh', 'gh', 5, 'novafe03gm', 'gm', 10, 'MOBILE_KR_VT', 0),
(572, 1, 'novafeprx01gm', 'gm', 6, 'novafe04gm', 'gm', 5, 'PC_KR', 1),
(573, 2, 'novafeprx02gm', 'gm', 6, 'novafe04gm', 'gm', 5, 'PC_KR', 1),
(574, 3, 'novafeprx03gm', 'gm', 6, 'novafe04gm', 'gm', 5, 'PC_KR', 1),
(575, 4, 'novafeprx01gh', 'gh', 6, 'novafe04gm', 'gm', 5, 'PC_KR', 0),
(576, 5, 'novafeprx02gh', 'gh', 6, 'novafe04gm', 'gm', 5, 'PC_KR', 0),
(577, 6, 'novafeprx03gh', 'gh', 6, 'novafe04gm', 'gm', 5, 'PC_KR', 0),
(578, 1, 'novafeprx01gm', 'gm', 6, 'novafe04gm', 'gm', 6, 'PC_KR_VT', 1),
(579, 2, 'novafeprx02gm', 'gm', 6, 'novafe04gm', 'gm', 6, 'PC_KR_VT', 1),
(580, 3, 'novafeprx03gm', 'gm', 6, 'novafe04gm', 'gm', 6, 'PC_KR_VT', 1),
(581, 4, 'novafeprx01gh', 'gh', 6, 'novafe04gm', 'gm', 6, 'PC_KR_VT', 0),
(582, 5, 'novafeprx02gh', 'gh', 6, 'novafe04gm', 'gm', 6, 'PC_KR_VT', 0),
(583, 6, 'novafeprx03gh', 'gh', 6, 'novafe04gm', 'gm', 6, 'PC_KR_VT', 0),
(584, 1, 'novafeprx01gm', 'gm', 6, 'novafe04gm', 'gm', 7, 'PC_GLOBAL', 1),
(585, 2, 'novafeprx02gm', 'gm', 6, 'novafe04gm', 'gm', 7, 'PC_GLOBAL', 1),
(586, 3, 'novafeprx03gm', 'gm', 6, 'novafe04gm', 'gm', 7, 'PC_GLOBAL', 1),
(587, 4, 'novafeprx01gh', 'gh', 6, 'novafe04gm', 'gm', 7, 'PC_GLOBAL', 0),
(588, 5, 'novafeprx02gh', 'gh', 6, 'novafe04gm', 'gm', 7, 'PC_GLOBAL', 0),
(589, 6, 'novafeprx03gh', 'gh', 6, 'novafe04gm', 'gm', 7, 'PC_GLOBAL', 0),
(590, 1, 'novafeprx01gm', 'gm', 6, 'novafe04gm', 'gm', 8, 'MOBILE_KR', 1),
(591, 2, 'novafeprx02gm', 'gm', 6, 'novafe04gm', 'gm', 8, 'MOBILE_KR', 1),
(592, 3, 'novafeprx03gm', 'gm', 6, 'novafe04gm', 'gm', 8, 'MOBILE_KR', 1),
(593, 4, 'novafeprx01gh', 'gh', 6, 'novafe04gm', 'gm', 8, 'MOBILE_KR', 0),
(594, 5, 'novafeprx02gh', 'gh', 6, 'novafe04gm', 'gm', 8, 'MOBILE_KR', 0),
(595, 6, 'novafeprx03gh', 'gh', 6, 'novafe04gm', 'gm', 8, 'MOBILE_KR', 0),
(596, 1, 'novafeprx01gm', 'gm', 6, 'novafe04gm', 'gm', 9, 'MOBILE_GLOBAL', 1),
(597, 2, 'novafeprx02gm', 'gm', 6, 'novafe04gm', 'gm', 9, 'MOBILE_GLOBAL', 1),
(598, 3, 'novafeprx03gm', 'gm', 6, 'novafe04gm', 'gm', 9, 'MOBILE_GLOBAL', 1),
(599, 4, 'novafeprx01gh', 'gh', 6, 'novafe04gm', 'gm', 9, 'MOBILE_GLOBAL', 0),
(600, 5, 'novafeprx02gh', 'gh', 6, 'novafe04gm', 'gm', 9, 'MOBILE_GLOBAL', 0),
(601, 6, 'novafeprx03gh', 'gh', 6, 'novafe04gm', 'gm', 9, 'MOBILE_GLOBAL', 0),
(602, 1, 'novafeprx01gm', 'gm', 6, 'novafe04gm', 'gm', 10, 'MOBILE_KR_VT', 1),
(603, 2, 'novafeprx02gm', 'gm', 6, 'novafe04gm', 'gm', 10, 'MOBILE_KR_VT', 1),
(604, 3, 'novafeprx03gm', 'gm', 6, 'novafe04gm', 'gm', 10, 'MOBILE_KR_VT', 1),
(605, 4, 'novafeprx01gh', 'gh', 6, 'novafe04gm', 'gm', 10, 'MOBILE_KR_VT', 0),
(606, 5, 'novafeprx02gh', 'gh', 6, 'novafe04gm', 'gm', 10, 'MOBILE_KR_VT', 0),
(607, 6, 'novafeprx03gh', 'gh', 6, 'novafe04gm', 'gm', 10, 'MOBILE_KR_VT', 0),
(608, 1, 'novafeprx01gm', 'gm', 7, 'novafe05gm', 'gm', 5, 'PC_KR', 1),
(609, 2, 'novafeprx02gm', 'gm', 7, 'novafe05gm', 'gm', 5, 'PC_KR', 1),
(610, 3, 'novafeprx03gm', 'gm', 7, 'novafe05gm', 'gm', 5, 'PC_KR', 1),
(611, 4, 'novafeprx01gh', 'gh', 7, 'novafe05gm', 'gm', 5, 'PC_KR', 0),
(612, 5, 'novafeprx02gh', 'gh', 7, 'novafe05gm', 'gm', 5, 'PC_KR', 0),
(613, 6, 'novafeprx03gh', 'gh', 7, 'novafe05gm', 'gm', 5, 'PC_KR', 0),
(614, 1, 'novafeprx01gm', 'gm', 7, 'novafe05gm', 'gm', 6, 'PC_KR_VT', 1),
(615, 2, 'novafeprx02gm', 'gm', 7, 'novafe05gm', 'gm', 6, 'PC_KR_VT', 1),
(616, 3, 'novafeprx03gm', 'gm', 7, 'novafe05gm', 'gm', 6, 'PC_KR_VT', 1),
(617, 4, 'novafeprx01gh', 'gh', 7, 'novafe05gm', 'gm', 6, 'PC_KR_VT', 0),
(618, 5, 'novafeprx02gh', 'gh', 7, 'novafe05gm', 'gm', 6, 'PC_KR_VT', 0),
(619, 6, 'novafeprx03gh', 'gh', 7, 'novafe05gm', 'gm', 6, 'PC_KR_VT', 0),
(620, 1, 'novafeprx01gm', 'gm', 7, 'novafe05gm', 'gm', 7, 'PC_GLOBAL', 1),
(621, 2, 'novafeprx02gm', 'gm', 7, 'novafe05gm', 'gm', 7, 'PC_GLOBAL', 1),
(622, 3, 'novafeprx03gm', 'gm', 7, 'novafe05gm', 'gm', 7, 'PC_GLOBAL', 1),
(623, 4, 'novafeprx01gh', 'gh', 7, 'novafe05gm', 'gm', 7, 'PC_GLOBAL', 0),
(624, 5, 'novafeprx02gh', 'gh', 7, 'novafe05gm', 'gm', 7, 'PC_GLOBAL', 0),
(625, 6, 'novafeprx03gh', 'gh', 7, 'novafe05gm', 'gm', 7, 'PC_GLOBAL', 0),
(626, 1, 'novafeprx01gm', 'gm', 7, 'novafe05gm', 'gm', 8, 'MOBILE_KR', 1),
(627, 2, 'novafeprx02gm', 'gm', 7, 'novafe05gm', 'gm', 8, 'MOBILE_KR', 1),
(628, 3, 'novafeprx03gm', 'gm', 7, 'novafe05gm', 'gm', 8, 'MOBILE_KR', 1),
(629, 4, 'novafeprx01gh', 'gh', 7, 'novafe05gm', 'gm', 8, 'MOBILE_KR', 0),
(630, 5, 'novafeprx02gh', 'gh', 7, 'novafe05gm', 'gm', 8, 'MOBILE_KR', 0),
(631, 6, 'novafeprx03gh', 'gh', 7, 'novafe05gm', 'gm', 8, 'MOBILE_KR', 0),
(632, 1, 'novafeprx01gm', 'gm', 7, 'novafe05gm', 'gm', 9, 'MOBILE_GLOBAL', 1),
(633, 2, 'novafeprx02gm', 'gm', 7, 'novafe05gm', 'gm', 9, 'MOBILE_GLOBAL', 1),
(634, 3, 'novafeprx03gm', 'gm', 7, 'novafe05gm', 'gm', 9, 'MOBILE_GLOBAL', 1),
(635, 4, 'novafeprx01gh', 'gh', 7, 'novafe05gm', 'gm', 9, 'MOBILE_GLOBAL', 0),
(636, 5, 'novafeprx02gh', 'gh', 7, 'novafe05gm', 'gm', 9, 'MOBILE_GLOBAL', 0),
(637, 6, 'novafeprx03gh', 'gh', 7, 'novafe05gm', 'gm', 9, 'MOBILE_GLOBAL', 0),
(638, 1, 'novafeprx01gm', 'gm', 7, 'novafe05gm', 'gm', 10, 'MOBILE_KR_VT', 1),
(639, 2, 'novafeprx02gm', 'gm', 7, 'novafe05gm', 'gm', 10, 'MOBILE_KR_VT', 1),
(640, 3, 'novafeprx03gm', 'gm', 7, 'novafe05gm', 'gm', 10, 'MOBILE_KR_VT', 1),
(641, 4, 'novafeprx01gh', 'gh', 7, 'novafe05gm', 'gm', 10, 'MOBILE_KR_VT', 0),
(642, 5, 'novafeprx02gh', 'gh', 7, 'novafe05gm', 'gm', 10, 'MOBILE_KR_VT', 0),
(643, 6, 'novafeprx03gh', 'gh', 7, 'novafe05gm', 'gm', 10, 'MOBILE_KR_VT', 0),
(644, 1, 'novafeprx01gm', 'gm', 8, 'novafe06gm', 'gm', 5, 'PC_KR', 1),
(645, 2, 'novafeprx02gm', 'gm', 8, 'novafe06gm', 'gm', 5, 'PC_KR', 1),
(646, 3, 'novafeprx03gm', 'gm', 8, 'novafe06gm', 'gm', 5, 'PC_KR', 1),
(647, 4, 'novafeprx01gh', 'gh', 8, 'novafe06gm', 'gm', 5, 'PC_KR', 0),
(648, 5, 'novafeprx02gh', 'gh', 8, 'novafe06gm', 'gm', 5, 'PC_KR', 0),
(649, 6, 'novafeprx03gh', 'gh', 8, 'novafe06gm', 'gm', 5, 'PC_KR', 0),
(650, 1, 'novafeprx01gm', 'gm', 8, 'novafe06gm', 'gm', 6, 'PC_KR_VT', 1),
(651, 2, 'novafeprx02gm', 'gm', 8, 'novafe06gm', 'gm', 6, 'PC_KR_VT', 1),
(652, 3, 'novafeprx03gm', 'gm', 8, 'novafe06gm', 'gm', 6, 'PC_KR_VT', 1),
(653, 4, 'novafeprx01gh', 'gh', 8, 'novafe06gm', 'gm', 6, 'PC_KR_VT', 0),
(654, 5, 'novafeprx02gh', 'gh', 8, 'novafe06gm', 'gm', 6, 'PC_KR_VT', 0),
(655, 6, 'novafeprx03gh', 'gh', 8, 'novafe06gm', 'gm', 6, 'PC_KR_VT', 0),
(656, 1, 'novafeprx01gm', 'gm', 8, 'novafe06gm', 'gm', 7, 'PC_GLOBAL', 1),
(657, 2, 'novafeprx02gm', 'gm', 8, 'novafe06gm', 'gm', 7, 'PC_GLOBAL', 1),
(658, 3, 'novafeprx03gm', 'gm', 8, 'novafe06gm', 'gm', 7, 'PC_GLOBAL', 1),
(659, 4, 'novafeprx01gh', 'gh', 8, 'novafe06gm', 'gm', 7, 'PC_GLOBAL', 0),
(660, 5, 'novafeprx02gh', 'gh', 8, 'novafe06gm', 'gm', 7, 'PC_GLOBAL', 0),
(661, 6, 'novafeprx03gh', 'gh', 8, 'novafe06gm', 'gm', 7, 'PC_GLOBAL', 0),
(662, 1, 'novafeprx01gm', 'gm', 8, 'novafe06gm', 'gm', 8, 'MOBILE_KR', 1),
(663, 2, 'novafeprx02gm', 'gm', 8, 'novafe06gm', 'gm', 8, 'MOBILE_KR', 1),
(664, 3, 'novafeprx03gm', 'gm', 8, 'novafe06gm', 'gm', 8, 'MOBILE_KR', 1),
(665, 4, 'novafeprx01gh', 'gh', 8, 'novafe06gm', 'gm', 8, 'MOBILE_KR', 0),
(666, 5, 'novafeprx02gh', 'gh', 8, 'novafe06gm', 'gm', 8, 'MOBILE_KR', 0),
(667, 6, 'novafeprx03gh', 'gh', 8, 'novafe06gm', 'gm', 8, 'MOBILE_KR', 0),
(668, 1, 'novafeprx01gm', 'gm', 8, 'novafe06gm', 'gm', 9, 'MOBILE_GLOBAL', 1),
(669, 2, 'novafeprx02gm', 'gm', 8, 'novafe06gm', 'gm', 9, 'MOBILE_GLOBAL', 1),
(670, 3, 'novafeprx03gm', 'gm', 8, 'novafe06gm', 'gm', 9, 'MOBILE_GLOBAL', 1),
(671, 4, 'novafeprx01gh', 'gh', 8, 'novafe06gm', 'gm', 9, 'MOBILE_GLOBAL', 0),
(672, 5, 'novafeprx02gh', 'gh', 8, 'novafe06gm', 'gm', 9, 'MOBILE_GLOBAL', 0),
(673, 6, 'novafeprx03gh', 'gh', 8, 'novafe06gm', 'gm', 9, 'MOBILE_GLOBAL', 0),
(674, 1, 'novafeprx01gm', 'gm', 8, 'novafe06gm', 'gm', 10, 'MOBILE_KR_VT', 1),
(675, 2, 'novafeprx02gm', 'gm', 8, 'novafe06gm', 'gm', 10, 'MOBILE_KR_VT', 1),
(676, 3, 'novafeprx03gm', 'gm', 8, 'novafe06gm', 'gm', 10, 'MOBILE_KR_VT', 1),
(677, 4, 'novafeprx01gh', 'gh', 8, 'novafe06gm', 'gm', 10, 'MOBILE_KR_VT', 0),
(678, 5, 'novafeprx02gh', 'gh', 8, 'novafe06gm', 'gm', 10, 'MOBILE_KR_VT', 0),
(679, 6, 'novafeprx03gh', 'gh', 8, 'novafe06gm', 'gm', 10, 'MOBILE_KR_VT', 0),
(680, 1, 'novafeprx01gm', 'gm', 9, 'novafe01gh', 'gh', 5, 'PC_KR', 0),
(681, 2, 'novafeprx02gm', 'gm', 9, 'novafe01gh', 'gh', 5, 'PC_KR', 0),
(682, 3, 'novafeprx03gm', 'gm', 9, 'novafe01gh', 'gh', 5, 'PC_KR', 0),
(683, 4, 'novafeprx01gh', 'gh', 9, 'novafe01gh', 'gh', 5, 'PC_KR', 1),
(684, 5, 'novafeprx02gh', 'gh', 9, 'novafe01gh', 'gh', 5, 'PC_KR', 1),
(685, 6, 'novafeprx03gh', 'gh', 9, 'novafe01gh', 'gh', 5, 'PC_KR', 1),
(686, 1, 'novafeprx01gm', 'gm', 9, 'novafe01gh', 'gh', 6, 'PC_KR_VT', 0),
(687, 2, 'novafeprx02gm', 'gm', 9, 'novafe01gh', 'gh', 6, 'PC_KR_VT', 0),
(688, 3, 'novafeprx03gm', 'gm', 9, 'novafe01gh', 'gh', 6, 'PC_KR_VT', 0),
(689, 4, 'novafeprx01gh', 'gh', 9, 'novafe01gh', 'gh', 6, 'PC_KR_VT', 1),
(690, 5, 'novafeprx02gh', 'gh', 9, 'novafe01gh', 'gh', 6, 'PC_KR_VT', 1),
(691, 6, 'novafeprx03gh', 'gh', 9, 'novafe01gh', 'gh', 6, 'PC_KR_VT', 1),
(692, 1, 'novafeprx01gm', 'gm', 9, 'novafe01gh', 'gh', 7, 'PC_GLOBAL', 0),
(693, 2, 'novafeprx02gm', 'gm', 9, 'novafe01gh', 'gh', 7, 'PC_GLOBAL', 0),
(694, 3, 'novafeprx03gm', 'gm', 9, 'novafe01gh', 'gh', 7, 'PC_GLOBAL', 0),
(695, 4, 'novafeprx01gh', 'gh', 9, 'novafe01gh', 'gh', 7, 'PC_GLOBAL', 1),
(696, 5, 'novafeprx02gh', 'gh', 9, 'novafe01gh', 'gh', 7, 'PC_GLOBAL', 1),
(697, 6, 'novafeprx03gh', 'gh', 9, 'novafe01gh', 'gh', 7, 'PC_GLOBAL', 1),
(698, 1, 'novafeprx01gm', 'gm', 9, 'novafe01gh', 'gh', 8, 'MOBILE_KR', 0),
(699, 2, 'novafeprx02gm', 'gm', 9, 'novafe01gh', 'gh', 8, 'MOBILE_KR', 0),
(700, 3, 'novafeprx03gm', 'gm', 9, 'novafe01gh', 'gh', 8, 'MOBILE_KR', 0),
(701, 4, 'novafeprx01gh', 'gh', 9, 'novafe01gh', 'gh', 8, 'MOBILE_KR', 1),
(702, 5, 'novafeprx02gh', 'gh', 9, 'novafe01gh', 'gh', 8, 'MOBILE_KR', 1),
(703, 6, 'novafeprx03gh', 'gh', 9, 'novafe01gh', 'gh', 8, 'MOBILE_KR', 1),
(704, 1, 'novafeprx01gm', 'gm', 9, 'novafe01gh', 'gh', 9, 'MOBILE_GLOBAL', 0),
(705, 2, 'novafeprx02gm', 'gm', 9, 'novafe01gh', 'gh', 9, 'MOBILE_GLOBAL', 0),
(706, 3, 'novafeprx03gm', 'gm', 9, 'novafe01gh', 'gh', 9, 'MOBILE_GLOBAL', 0),
(707, 4, 'novafeprx01gh', 'gh', 9, 'novafe01gh', 'gh', 9, 'MOBILE_GLOBAL', 1),
(708, 5, 'novafeprx02gh', 'gh', 9, 'novafe01gh', 'gh', 9, 'MOBILE_GLOBAL', 1),
(709, 6, 'novafeprx03gh', 'gh', 9, 'novafe01gh', 'gh', 9, 'MOBILE_GLOBAL', 1),
(710, 1, 'novafeprx01gm', 'gm', 9, 'novafe01gh', 'gh', 10, 'MOBILE_KR_VT', 0),
(711, 2, 'novafeprx02gm', 'gm', 9, 'novafe01gh', 'gh', 10, 'MOBILE_KR_VT', 0),
(712, 3, 'novafeprx03gm', 'gm', 9, 'novafe01gh', 'gh', 10, 'MOBILE_KR_VT', 0),
(713, 4, 'novafeprx01gh', 'gh', 9, 'novafe01gh', 'gh', 10, 'MOBILE_KR_VT', 1),
(714, 5, 'novafeprx02gh', 'gh', 9, 'novafe01gh', 'gh', 10, 'MOBILE_KR_VT', 1),
(715, 6, 'novafeprx03gh', 'gh', 9, 'novafe01gh', 'gh', 10, 'MOBILE_KR_VT', 1),
(716, 1, 'novafeprx01gm', 'gm', 10, 'novafe02gh', 'gh', 5, 'PC_KR', 0),
(717, 2, 'novafeprx02gm', 'gm', 10, 'novafe02gh', 'gh', 5, 'PC_KR', 0),
(718, 3, 'novafeprx03gm', 'gm', 10, 'novafe02gh', 'gh', 5, 'PC_KR', 0),
(719, 4, 'novafeprx01gh', 'gh', 10, 'novafe02gh', 'gh', 5, 'PC_KR', 1),
(720, 5, 'novafeprx02gh', 'gh', 10, 'novafe02gh', 'gh', 5, 'PC_KR', 1),
(721, 6, 'novafeprx03gh', 'gh', 10, 'novafe02gh', 'gh', 5, 'PC_KR', 1),
(722, 1, 'novafeprx01gm', 'gm', 10, 'novafe02gh', 'gh', 6, 'PC_KR_VT', 0),
(723, 2, 'novafeprx02gm', 'gm', 10, 'novafe02gh', 'gh', 6, 'PC_KR_VT', 0),
(724, 3, 'novafeprx03gm', 'gm', 10, 'novafe02gh', 'gh', 6, 'PC_KR_VT', 0),
(725, 4, 'novafeprx01gh', 'gh', 10, 'novafe02gh', 'gh', 6, 'PC_KR_VT', 1),
(726, 5, 'novafeprx02gh', 'gh', 10, 'novafe02gh', 'gh', 6, 'PC_KR_VT', 1),
(727, 6, 'novafeprx03gh', 'gh', 10, 'novafe02gh', 'gh', 6, 'PC_KR_VT', 1),
(728, 1, 'novafeprx01gm', 'gm', 10, 'novafe02gh', 'gh', 7, 'PC_GLOBAL', 0),
(729, 2, 'novafeprx02gm', 'gm', 10, 'novafe02gh', 'gh', 7, 'PC_GLOBAL', 0),
(730, 3, 'novafeprx03gm', 'gm', 10, 'novafe02gh', 'gh', 7, 'PC_GLOBAL', 0),
(731, 4, 'novafeprx01gh', 'gh', 10, 'novafe02gh', 'gh', 7, 'PC_GLOBAL', 1),
(732, 5, 'novafeprx02gh', 'gh', 10, 'novafe02gh', 'gh', 7, 'PC_GLOBAL', 1),
(733, 6, 'novafeprx03gh', 'gh', 10, 'novafe02gh', 'gh', 7, 'PC_GLOBAL', 1),
(734, 1, 'novafeprx01gm', 'gm', 10, 'novafe02gh', 'gh', 8, 'MOBILE_KR', 0),
(735, 2, 'novafeprx02gm', 'gm', 10, 'novafe02gh', 'gh', 8, 'MOBILE_KR', 0),
(736, 3, 'novafeprx03gm', 'gm', 10, 'novafe02gh', 'gh', 8, 'MOBILE_KR', 0),
(737, 4, 'novafeprx01gh', 'gh', 10, 'novafe02gh', 'gh', 8, 'MOBILE_KR', 1),
(738, 5, 'novafeprx02gh', 'gh', 10, 'novafe02gh', 'gh', 8, 'MOBILE_KR', 1),
(739, 6, 'novafeprx03gh', 'gh', 10, 'novafe02gh', 'gh', 8, 'MOBILE_KR', 1),
(740, 1, 'novafeprx01gm', 'gm', 10, 'novafe02gh', 'gh', 9, 'MOBILE_GLOBAL', 0),
(741, 2, 'novafeprx02gm', 'gm', 10, 'novafe02gh', 'gh', 9, 'MOBILE_GLOBAL', 0),
(742, 3, 'novafeprx03gm', 'gm', 10, 'novafe02gh', 'gh', 9, 'MOBILE_GLOBAL', 0),
(743, 4, 'novafeprx01gh', 'gh', 10, 'novafe02gh', 'gh', 9, 'MOBILE_GLOBAL', 1),
(744, 5, 'novafeprx02gh', 'gh', 10, 'novafe02gh', 'gh', 9, 'MOBILE_GLOBAL', 1),
(745, 6, 'novafeprx03gh', 'gh', 10, 'novafe02gh', 'gh', 9, 'MOBILE_GLOBAL', 1),
(746, 1, 'novafeprx01gm', 'gm', 10, 'novafe02gh', 'gh', 10, 'MOBILE_KR_VT', 0),
(747, 2, 'novafeprx02gm', 'gm', 10, 'novafe02gh', 'gh', 10, 'MOBILE_KR_VT', 0),
(748, 3, 'novafeprx03gm', 'gm', 10, 'novafe02gh', 'gh', 10, 'MOBILE_KR_VT', 0),
(749, 4, 'novafeprx01gh', 'gh', 10, 'novafe02gh', 'gh', 10, 'MOBILE_KR_VT', 1),
(750, 5, 'novafeprx02gh', 'gh', 10, 'novafe02gh', 'gh', 10, 'MOBILE_KR_VT', 1),
(751, 6, 'novafeprx03gh', 'gh', 10, 'novafe02gh', 'gh', 10, 'MOBILE_KR_VT', 1),
(752, 1, 'novafeprx01gm', 'gm', 11, 'novafe03gh', 'gh', 5, 'PC_KR', 0),
(753, 2, 'novafeprx02gm', 'gm', 11, 'novafe03gh', 'gh', 5, 'PC_KR', 0),
(754, 3, 'novafeprx03gm', 'gm', 11, 'novafe03gh', 'gh', 5, 'PC_KR', 0),
(755, 4, 'novafeprx01gh', 'gh', 11, 'novafe03gh', 'gh', 5, 'PC_KR', 1),
(756, 5, 'novafeprx02gh', 'gh', 11, 'novafe03gh', 'gh', 5, 'PC_KR', 1),
(757, 6, 'novafeprx03gh', 'gh', 11, 'novafe03gh', 'gh', 5, 'PC_KR', 1),
(758, 1, 'novafeprx01gm', 'gm', 11, 'novafe03gh', 'gh', 6, 'PC_KR_VT', 0),
(759, 2, 'novafeprx02gm', 'gm', 11, 'novafe03gh', 'gh', 6, 'PC_KR_VT', 0),
(760, 3, 'novafeprx03gm', 'gm', 11, 'novafe03gh', 'gh', 6, 'PC_KR_VT', 0),
(761, 4, 'novafeprx01gh', 'gh', 11, 'novafe03gh', 'gh', 6, 'PC_KR_VT', 1),
(762, 5, 'novafeprx02gh', 'gh', 11, 'novafe03gh', 'gh', 6, 'PC_KR_VT', 1),
(763, 6, 'novafeprx03gh', 'gh', 11, 'novafe03gh', 'gh', 6, 'PC_KR_VT', 1),
(764, 1, 'novafeprx01gm', 'gm', 11, 'novafe03gh', 'gh', 7, 'PC_GLOBAL', 0),
(765, 2, 'novafeprx02gm', 'gm', 11, 'novafe03gh', 'gh', 7, 'PC_GLOBAL', 0),
(766, 3, 'novafeprx03gm', 'gm', 11, 'novafe03gh', 'gh', 7, 'PC_GLOBAL', 0),
(767, 4, 'novafeprx01gh', 'gh', 11, 'novafe03gh', 'gh', 7, 'PC_GLOBAL', 1),
(768, 5, 'novafeprx02gh', 'gh', 11, 'novafe03gh', 'gh', 7, 'PC_GLOBAL', 1),
(769, 6, 'novafeprx03gh', 'gh', 11, 'novafe03gh', 'gh', 7, 'PC_GLOBAL', 1),
(770, 1, 'novafeprx01gm', 'gm', 11, 'novafe03gh', 'gh', 8, 'MOBILE_KR', 0),
(771, 2, 'novafeprx02gm', 'gm', 11, 'novafe03gh', 'gh', 8, 'MOBILE_KR', 0),
(772, 3, 'novafeprx03gm', 'gm', 11, 'novafe03gh', 'gh', 8, 'MOBILE_KR', 0),
(773, 4, 'novafeprx01gh', 'gh', 11, 'novafe03gh', 'gh', 8, 'MOBILE_KR', 1),
(774, 5, 'novafeprx02gh', 'gh', 11, 'novafe03gh', 'gh', 8, 'MOBILE_KR', 1),
(775, 6, 'novafeprx03gh', 'gh', 11, 'novafe03gh', 'gh', 8, 'MOBILE_KR', 1),
(776, 1, 'novafeprx01gm', 'gm', 11, 'novafe03gh', 'gh', 9, 'MOBILE_GLOBAL', 0),
(777, 2, 'novafeprx02gm', 'gm', 11, 'novafe03gh', 'gh', 9, 'MOBILE_GLOBAL', 0),
(778, 3, 'novafeprx03gm', 'gm', 11, 'novafe03gh', 'gh', 9, 'MOBILE_GLOBAL', 0),
(779, 4, 'novafeprx01gh', 'gh', 11, 'novafe03gh', 'gh', 9, 'MOBILE_GLOBAL', 1),
(780, 5, 'novafeprx02gh', 'gh', 11, 'novafe03gh', 'gh', 9, 'MOBILE_GLOBAL', 1),
(781, 6, 'novafeprx03gh', 'gh', 11, 'novafe03gh', 'gh', 9, 'MOBILE_GLOBAL', 1),
(782, 1, 'novafeprx01gm', 'gm', 11, 'novafe03gh', 'gh', 10, 'MOBILE_KR_VT', 0),
(783, 2, 'novafeprx02gm', 'gm', 11, 'novafe03gh', 'gh', 10, 'MOBILE_KR_VT', 0),
(784, 3, 'novafeprx03gm', 'gm', 11, 'novafe03gh', 'gh', 10, 'MOBILE_KR_VT', 0),
(785, 4, 'novafeprx01gh', 'gh', 11, 'novafe03gh', 'gh', 10, 'MOBILE_KR_VT', 1),
(786, 5, 'novafeprx02gh', 'gh', 11, 'novafe03gh', 'gh', 10, 'MOBILE_KR_VT', 1),
(787, 6, 'novafeprx03gh', 'gh', 11, 'novafe03gh', 'gh', 10, 'MOBILE_KR_VT', 1),
(788, 1, 'novafeprx01gm', 'gm', 12, 'novafe04gh', 'gh', 5, 'PC_KR', 0),
(789, 2, 'novafeprx02gm', 'gm', 12, 'novafe04gh', 'gh', 5, 'PC_KR', 0),
(790, 3, 'novafeprx03gm', 'gm', 12, 'novafe04gh', 'gh', 5, 'PC_KR', 0),
(791, 4, 'novafeprx01gh', 'gh', 12, 'novafe04gh', 'gh', 5, 'PC_KR', 1),
(792, 5, 'novafeprx02gh', 'gh', 12, 'novafe04gh', 'gh', 5, 'PC_KR', 1),
(793, 6, 'novafeprx03gh', 'gh', 12, 'novafe04gh', 'gh', 5, 'PC_KR', 1),
(794, 1, 'novafeprx01gm', 'gm', 12, 'novafe04gh', 'gh', 6, 'PC_KR_VT', 0),
(795, 2, 'novafeprx02gm', 'gm', 12, 'novafe04gh', 'gh', 6, 'PC_KR_VT', 0),
(796, 3, 'novafeprx03gm', 'gm', 12, 'novafe04gh', 'gh', 6, 'PC_KR_VT', 0),
(797, 4, 'novafeprx01gh', 'gh', 12, 'novafe04gh', 'gh', 6, 'PC_KR_VT', 1),
(798, 5, 'novafeprx02gh', 'gh', 12, 'novafe04gh', 'gh', 6, 'PC_KR_VT', 1),
(799, 6, 'novafeprx03gh', 'gh', 12, 'novafe04gh', 'gh', 6, 'PC_KR_VT', 1),
(800, 1, 'novafeprx01gm', 'gm', 12, 'novafe04gh', 'gh', 7, 'PC_GLOBAL', 0),
(801, 2, 'novafeprx02gm', 'gm', 12, 'novafe04gh', 'gh', 7, 'PC_GLOBAL', 0),
(802, 3, 'novafeprx03gm', 'gm', 12, 'novafe04gh', 'gh', 7, 'PC_GLOBAL', 0),
(803, 4, 'novafeprx01gh', 'gh', 12, 'novafe04gh', 'gh', 7, 'PC_GLOBAL', 1),
(804, 5, 'novafeprx02gh', 'gh', 12, 'novafe04gh', 'gh', 7, 'PC_GLOBAL', 1),
(805, 6, 'novafeprx03gh', 'gh', 12, 'novafe04gh', 'gh', 7, 'PC_GLOBAL', 1),
(806, 1, 'novafeprx01gm', 'gm', 12, 'novafe04gh', 'gh', 8, 'MOBILE_KR', 0),
(807, 2, 'novafeprx02gm', 'gm', 12, 'novafe04gh', 'gh', 8, 'MOBILE_KR', 0),
(808, 3, 'novafeprx03gm', 'gm', 12, 'novafe04gh', 'gh', 8, 'MOBILE_KR', 0),
(809, 4, 'novafeprx01gh', 'gh', 12, 'novafe04gh', 'gh', 8, 'MOBILE_KR', 1),
(810, 5, 'novafeprx02gh', 'gh', 12, 'novafe04gh', 'gh', 8, 'MOBILE_KR', 1),
(811, 6, 'novafeprx03gh', 'gh', 12, 'novafe04gh', 'gh', 8, 'MOBILE_KR', 1),
(812, 1, 'novafeprx01gm', 'gm', 12, 'novafe04gh', 'gh', 9, 'MOBILE_GLOBAL', 0),
(813, 2, 'novafeprx02gm', 'gm', 12, 'novafe04gh', 'gh', 9, 'MOBILE_GLOBAL', 0),
(814, 3, 'novafeprx03gm', 'gm', 12, 'novafe04gh', 'gh', 9, 'MOBILE_GLOBAL', 0),
(815, 4, 'novafeprx01gh', 'gh', 12, 'novafe04gh', 'gh', 9, 'MOBILE_GLOBAL', 1),
(816, 5, 'novafeprx02gh', 'gh', 12, 'novafe04gh', 'gh', 9, 'MOBILE_GLOBAL', 1),
(817, 6, 'novafeprx03gh', 'gh', 12, 'novafe04gh', 'gh', 9, 'MOBILE_GLOBAL', 1),
(818, 1, 'novafeprx01gm', 'gm', 12, 'novafe04gh', 'gh', 10, 'MOBILE_KR_VT', 0),
(819, 2, 'novafeprx02gm', 'gm', 12, 'novafe04gh', 'gh', 10, 'MOBILE_KR_VT', 0),
(820, 3, 'novafeprx03gm', 'gm', 12, 'novafe04gh', 'gh', 10, 'MOBILE_KR_VT', 0),
(821, 4, 'novafeprx01gh', 'gh', 12, 'novafe04gh', 'gh', 10, 'MOBILE_KR_VT', 1),
(822, 5, 'novafeprx02gh', 'gh', 12, 'novafe04gh', 'gh', 10, 'MOBILE_KR_VT', 1),
(823, 6, 'novafeprx03gh', 'gh', 12, 'novafe04gh', 'gh', 10, 'MOBILE_KR_VT', 1),
(824, 1, 'novafeprx01gm', 'gm', 13, 'novafe05gh', 'gh', 5, 'PC_KR', 0),
(825, 2, 'novafeprx02gm', 'gm', 13, 'novafe05gh', 'gh', 5, 'PC_KR', 0),
(826, 3, 'novafeprx03gm', 'gm', 13, 'novafe05gh', 'gh', 5, 'PC_KR', 0),
(827, 4, 'novafeprx01gh', 'gh', 13, 'novafe05gh', 'gh', 5, 'PC_KR', 1),
(828, 5, 'novafeprx02gh', 'gh', 13, 'novafe05gh', 'gh', 5, 'PC_KR', 1),
(829, 6, 'novafeprx03gh', 'gh', 13, 'novafe05gh', 'gh', 5, 'PC_KR', 1),
(830, 1, 'novafeprx01gm', 'gm', 13, 'novafe05gh', 'gh', 6, 'PC_KR_VT', 0),
(831, 2, 'novafeprx02gm', 'gm', 13, 'novafe05gh', 'gh', 6, 'PC_KR_VT', 0),
(832, 3, 'novafeprx03gm', 'gm', 13, 'novafe05gh', 'gh', 6, 'PC_KR_VT', 0),
(833, 4, 'novafeprx01gh', 'gh', 13, 'novafe05gh', 'gh', 6, 'PC_KR_VT', 1),
(834, 5, 'novafeprx02gh', 'gh', 13, 'novafe05gh', 'gh', 6, 'PC_KR_VT', 1),
(835, 6, 'novafeprx03gh', 'gh', 13, 'novafe05gh', 'gh', 6, 'PC_KR_VT', 1),
(836, 1, 'novafeprx01gm', 'gm', 13, 'novafe05gh', 'gh', 7, 'PC_GLOBAL', 0),
(837, 2, 'novafeprx02gm', 'gm', 13, 'novafe05gh', 'gh', 7, 'PC_GLOBAL', 0),
(838, 3, 'novafeprx03gm', 'gm', 13, 'novafe05gh', 'gh', 7, 'PC_GLOBAL', 0),
(839, 4, 'novafeprx01gh', 'gh', 13, 'novafe05gh', 'gh', 7, 'PC_GLOBAL', 1),
(840, 5, 'novafeprx02gh', 'gh', 13, 'novafe05gh', 'gh', 7, 'PC_GLOBAL', 1),
(841, 6, 'novafeprx03gh', 'gh', 13, 'novafe05gh', 'gh', 7, 'PC_GLOBAL', 1),
(842, 1, 'novafeprx01gm', 'gm', 13, 'novafe05gh', 'gh', 8, 'MOBILE_KR', 0),
(843, 2, 'novafeprx02gm', 'gm', 13, 'novafe05gh', 'gh', 8, 'MOBILE_KR', 0),
(844, 3, 'novafeprx03gm', 'gm', 13, 'novafe05gh', 'gh', 8, 'MOBILE_KR', 0),
(845, 4, 'novafeprx01gh', 'gh', 13, 'novafe05gh', 'gh', 8, 'MOBILE_KR', 1),
(846, 5, 'novafeprx02gh', 'gh', 13, 'novafe05gh', 'gh', 8, 'MOBILE_KR', 1),
(847, 6, 'novafeprx03gh', 'gh', 13, 'novafe05gh', 'gh', 8, 'MOBILE_KR', 1),
(848, 1, 'novafeprx01gm', 'gm', 13, 'novafe05gh', 'gh', 9, 'MOBILE_GLOBAL', 0),
(849, 2, 'novafeprx02gm', 'gm', 13, 'novafe05gh', 'gh', 9, 'MOBILE_GLOBAL', 0),
(850, 3, 'novafeprx03gm', 'gm', 13, 'novafe05gh', 'gh', 9, 'MOBILE_GLOBAL', 0),
(851, 4, 'novafeprx01gh', 'gh', 13, 'novafe05gh', 'gh', 9, 'MOBILE_GLOBAL', 1),
(852, 5, 'novafeprx02gh', 'gh', 13, 'novafe05gh', 'gh', 9, 'MOBILE_GLOBAL', 1),
(853, 6, 'novafeprx03gh', 'gh', 13, 'novafe05gh', 'gh', 9, 'MOBILE_GLOBAL', 1),
(854, 1, 'novafeprx01gm', 'gm', 13, 'novafe05gh', 'gh', 10, 'MOBILE_KR_VT', 0),
(855, 2, 'novafeprx02gm', 'gm', 13, 'novafe05gh', 'gh', 10, 'MOBILE_KR_VT', 0),
(856, 3, 'novafeprx03gm', 'gm', 13, 'novafe05gh', 'gh', 10, 'MOBILE_KR_VT', 0),
(857, 4, 'novafeprx01gh', 'gh', 13, 'novafe05gh', 'gh', 10, 'MOBILE_KR_VT', 1),
(858, 5, 'novafeprx02gh', 'gh', 13, 'novafe05gh', 'gh', 10, 'MOBILE_KR_VT', 1),
(859, 6, 'novafeprx03gh', 'gh', 13, 'novafe05gh', 'gh', 10, 'MOBILE_KR_VT', 1),
(860, 1, 'novafeprx01gm', 'gm', 14, 'novafe06gh', 'gh', 5, 'PC_KR', 0),
(861, 2, 'novafeprx02gm', 'gm', 14, 'novafe06gh', 'gh', 5, 'PC_KR', 0),
(862, 3, 'novafeprx03gm', 'gm', 14, 'novafe06gh', 'gh', 5, 'PC_KR', 0),
(863, 4, 'novafeprx01gh', 'gh', 14, 'novafe06gh', 'gh', 5, 'PC_KR', 1),
(864, 5, 'novafeprx02gh', 'gh', 14, 'novafe06gh', 'gh', 5, 'PC_KR', 1),
(865, 6, 'novafeprx03gh', 'gh', 14, 'novafe06gh', 'gh', 5, 'PC_KR', 1),
(866, 1, 'novafeprx01gm', 'gm', 14, 'novafe06gh', 'gh', 6, 'PC_KR_VT', 0),
(867, 2, 'novafeprx02gm', 'gm', 14, 'novafe06gh', 'gh', 6, 'PC_KR_VT', 0),
(868, 3, 'novafeprx03gm', 'gm', 14, 'novafe06gh', 'gh', 6, 'PC_KR_VT', 0),
(869, 4, 'novafeprx01gh', 'gh', 14, 'novafe06gh', 'gh', 6, 'PC_KR_VT', 1),
(870, 5, 'novafeprx02gh', 'gh', 14, 'novafe06gh', 'gh', 6, 'PC_KR_VT', 1),
(871, 6, 'novafeprx03gh', 'gh', 14, 'novafe06gh', 'gh', 6, 'PC_KR_VT', 1),
(872, 1, 'novafeprx01gm', 'gm', 14, 'novafe06gh', 'gh', 7, 'PC_GLOBAL', 0),
(873, 2, 'novafeprx02gm', 'gm', 14, 'novafe06gh', 'gh', 7, 'PC_GLOBAL', 0),
(874, 3, 'novafeprx03gm', 'gm', 14, 'novafe06gh', 'gh', 7, 'PC_GLOBAL', 0),
(875, 4, 'novafeprx01gh', 'gh', 14, 'novafe06gh', 'gh', 7, 'PC_GLOBAL', 1),
(876, 5, 'novafeprx02gh', 'gh', 14, 'novafe06gh', 'gh', 7, 'PC_GLOBAL', 1),
(877, 6, 'novafeprx03gh', 'gh', 14, 'novafe06gh', 'gh', 7, 'PC_GLOBAL', 1),
(878, 1, 'novafeprx01gm', 'gm', 14, 'novafe06gh', 'gh', 8, 'MOBILE_KR', 0),
(879, 2, 'novafeprx02gm', 'gm', 14, 'novafe06gh', 'gh', 8, 'MOBILE_KR', 0),
(880, 3, 'novafeprx03gm', 'gm', 14, 'novafe06gh', 'gh', 8, 'MOBILE_KR', 0),
(881, 4, 'novafeprx01gh', 'gh', 14, 'novafe06gh', 'gh', 8, 'MOBILE_KR', 1),
(882, 5, 'novafeprx02gh', 'gh', 14, 'novafe06gh', 'gh', 8, 'MOBILE_KR', 1),
(883, 6, 'novafeprx03gh', 'gh', 14, 'novafe06gh', 'gh', 8, 'MOBILE_KR', 1),
(884, 1, 'novafeprx01gm', 'gm', 14, 'novafe06gh', 'gh', 9, 'MOBILE_GLOBAL', 0),
(885, 2, 'novafeprx02gm', 'gm', 14, 'novafe06gh', 'gh', 9, 'MOBILE_GLOBAL', 0),
(886, 3, 'novafeprx03gm', 'gm', 14, 'novafe06gh', 'gh', 9, 'MOBILE_GLOBAL', 0),
(887, 4, 'novafeprx01gh', 'gh', 14, 'novafe06gh', 'gh', 9, 'MOBILE_GLOBAL', 1),
(888, 5, 'novafeprx02gh', 'gh', 14, 'novafe06gh', 'gh', 9, 'MOBILE_GLOBAL', 1),
(889, 6, 'novafeprx03gh', 'gh', 14, 'novafe06gh', 'gh', 9, 'MOBILE_GLOBAL', 1),
(890, 1, 'novafeprx01gm', 'gm', 14, 'novafe06gh', 'gh', 10, 'MOBILE_KR_VT', 0),
(891, 2, 'novafeprx02gm', 'gm', 14, 'novafe06gh', 'gh', 10, 'MOBILE_KR_VT', 0),
(892, 3, 'novafeprx03gm', 'gm', 14, 'novafe06gh', 'gh', 10, 'MOBILE_KR_VT', 0),
(893, 4, 'novafeprx01gh', 'gh', 14, 'novafe06gh', 'gh', 10, 'MOBILE_KR_VT', 1),
(894, 5, 'novafeprx02gh', 'gh', 14, 'novafe06gh', 'gh', 10, 'MOBILE_KR_VT', 1),
(895, 6, 'novafeprx03gh', 'gh', 14, 'novafe06gh', 'gh', 10, 'MOBILE_KR_VT', 1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
