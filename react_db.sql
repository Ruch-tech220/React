-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 25, 2024 at 12:54 AM
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
-- Database: `react_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_customer`
--

CREATE TABLE `tb_customer` (
  `Cus_ID` int(11) NOT NULL,
  `Cus_Name` varchar(255) NOT NULL,
  `Cus_Lname` varchar(255) NOT NULL,
  `Username` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Cus_Phone` varchar(15) DEFAULT NULL,
  `Cus_Email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_customer`
--

INSERT INTO `tb_customer` (`Cus_ID`, `Cus_Name`, `Cus_Lname`, `Username`, `Password`, `Cus_Phone`, `Cus_Email`) VALUES
(29, '123456789', '123456789', '123456789', '$2b$10$uXrMeZd0bls8GyL6b4f5Ke8g1VNwMn.gahBtL7G/tXPqrAyU78ViW', '123456789', '123456789@gmail.com'),
(31, 'babe1', 'babe2', 'babe', 'babe12', '123', 'babe@gmail.com'),
(32, '123456', '123456', '123456', '123456', '123456', '123456@gmail.com'),
(33, 'zxczxc', 'zxczxc', 'zxczxc', 'zxczxc', '125346', 'zxczxc@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `tb_employee`
--

CREATE TABLE `tb_employee` (
  `Emp_ID` int(11) NOT NULL,
  `Emp_Name` varchar(255) NOT NULL,
  `Emp_Lname` varchar(255) NOT NULL,
  `Username` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Emp_Phone` varchar(15) DEFAULT NULL,
  `Emp_Email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_employee`
--

INSERT INTO `tb_employee` (`Emp_ID`, `Emp_Name`, `Emp_Lname`, `Username`, `Password`, `Emp_Phone`, `Emp_Email`) VALUES
(1, 'Alice112z', 'Smith', 'alicesmith', '123456', '0987654321', 'alice.smith@example.com'),
(2, 'Bob', 'Brown', 'bobbrown', 'mypassword', '0823456789', 'bob.brown@example.com'),
(3, 'Charlie', 'Davis', 'charliedavis', 'pass1234', '0834567890', 'charlie.davis@example.com'),
(11, 'Admin', 'Test', 'adminuser', '$2b$10$hashedpassword...', '1234567890', 'admin@test.com');

-- --------------------------------------------------------

--
-- Table structure for table `tb_order`
--

CREATE TABLE `tb_order` (
  `Order_ID` int(11) NOT NULL,
  `Cus_ID` int(11) NOT NULL,
  `Cus_Name` varchar(100) NOT NULL,
  `Cus_Lname` varchar(100) NOT NULL,
  `Cus_Phone` varchar(15) NOT NULL,
  `Cus_Email` varchar(100) NOT NULL,
  `Location_From` text NOT NULL,
  `Location_To` text NOT NULL,
  `Order_Date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_order`
--

INSERT INTO `tb_order` (`Order_ID`, `Cus_ID`, `Cus_Name`, `Cus_Lname`, `Cus_Phone`, `Cus_Email`, `Location_From`, `Location_To`, `Order_Date`) VALUES
(1, 33, 'กรุฟเตฟ', '123456', '1234', '123456@gmail.com', 'กรุฟเตฟ', 'กรุฟเตฟ', '2024-11-21 20:17:39'),
(2, 33, 'asd', 'asd', '12515426', 'asd@gmail.com', 'asd', 'asd', '2024-11-21 21:09:33'),
(3, 32, '123456', '123456', '123456', '123456789@gmail.com', '123456', '123456', '2024-11-24 08:29:23'),
(4, 32, '123456', '123456', '123456', '123456@gmail.com', '123456', '123456', '2024-11-24 08:39:52'),
(5, 32, '123456', '123456', '123456', '123456@gmail.com', '123456', '123456', '2024-11-24 08:43:18'),
(6, 32, '123456', '123456', '123456', '123456@gmail.com', '123456', '123456', '2024-11-24 08:43:21'),
(7, 32, '123456', '123456', '123456', '123456@gmail.com', '123456', '123456', '2024-11-24 08:43:27'),
(8, 32, 'ๅ/-', 'ๅ/-', 'ๅ/-', 'adwwd@gmaill.com', 'ๅ/-', 'ๅ/-', '2024-11-24 08:44:09'),
(9, 32, 'ๅ/-', 'ๅ/-', 'ๅ/-', 'adwwd@gmaill.com', 'ๅ/-', 'ๅ/-', '2024-11-24 08:44:11'),
(10, 32, '1234', '1234', '1234', '123456@gmail.com', '1234', '1234', '2024-11-24 08:48:09'),
(11, 32, '1234', '1234', '1234', '123456@gmail.com', '1234', '1234', '2024-11-24 08:48:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_customer`
--
ALTER TABLE `tb_customer`
  ADD PRIMARY KEY (`Cus_ID`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD UNIQUE KEY `Cus_Email` (`Cus_Email`);

--
-- Indexes for table `tb_employee`
--
ALTER TABLE `tb_employee`
  ADD PRIMARY KEY (`Emp_ID`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD UNIQUE KEY `Emp_Email` (`Emp_Email`);

--
-- Indexes for table `tb_order`
--
ALTER TABLE `tb_order`
  ADD PRIMARY KEY (`Order_ID`),
  ADD KEY `Cus_ID` (`Cus_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_customer`
--
ALTER TABLE `tb_customer`
  MODIFY `Cus_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `tb_employee`
--
ALTER TABLE `tb_employee`
  MODIFY `Emp_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `tb_order`
--
ALTER TABLE `tb_order`
  MODIFY `Order_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tb_order`
--
ALTER TABLE `tb_order`
  ADD CONSTRAINT `tb_order_ibfk_1` FOREIGN KEY (`Cus_ID`) REFERENCES `tb_customer` (`Cus_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
