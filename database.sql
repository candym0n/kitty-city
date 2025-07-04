-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 04, 2025 at 10:24 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kitty_city`
--

-- --------------------------------------------------------

--
-- Table structure for table `building_data`
--

CREATE TABLE `building_data` (
  `id` int(11) NOT NULL,
  `name` varchar(64) DEFAULT NULL,
  `cost` int(11) DEFAULT NULL,
  `description` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `building_data`
--

INSERT INTO `building_data` (`id`, `name`, `cost`, `description`) VALUES
(1, 'House', 100, 'A place for Kitizens to sleep'),
(2, 'Intersection', 0, 'A junction between multiple roads'),
(3, 'Work', 500, 'A place for Kitizens to work'),
(4, 'Road', 0, 'A connection between 2 buildings');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `building_data`
--
ALTER TABLE `building_data`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `building_data`
--
ALTER TABLE `building_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
