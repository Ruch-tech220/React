-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 18, 2025 at 06:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
(46, 'User', 'test', 'User', 'Sutem1', '0888888888', 'cvapp@gmail.com'),
(55, 'Sutem1', 'Sutem1', 'Sutem1s', 'Sutem1', '0888888887', 'zawzp@gmail.com'),
(56, 'Sutem1s', 'Sutem1s', 'Sutem1sz', 'Sutem1s', '1237', 'cvappz@gmail.com'),
(58, 'Sutem1', 'asd', '1234567', 'zxcvasfd', '123', '123456@gmail.com');

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
(38, 'Bob', 'Brown', 'bobbrown', 'mypassword', '0823456789', 'bob.brown@example.com'),
(39, 'Admin', 'Sera', 'Admin', 'Admin', '0886042222', 'opas@gmail.com'),
(45, 'Sutem1', 'Friendly', 'Sutem1', 'Sutem1', '0882945912', 'zawp@gmail.com');

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
  `Location_From` varchar(255) DEFAULT 'หนองแค',
  `Location_To` text NOT NULL,
  `Order_Date` timestamp NOT NULL DEFAULT current_timestamp(),
  `Distance` int(11) NOT NULL,
  `Total_Cost` decimal(10,2) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'รอชำระเงิน'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_order`
--

INSERT INTO `tb_order` (`Order_ID`, `Cus_ID`, `Cus_Name`, `Cus_Lname`, `Cus_Phone`, `Cus_Email`, `Location_From`, `Location_To`, `Order_Date`, `Distance`, `Total_Cost`, `status`) VALUES
(94, 46, 'Sutem', 'Sutem', '0882945912', '12345@gmail.com', 'หนองแค', 'สระแก้ว, โคกสูง', '2025-02-18 13:51:31', 260, 1350.00, 'เสร็จสิ้น'),
(108, 46, 'Sutem', 'Sutem', '0882945912', '1234@gmail.com', 'หนองแค', 'พิษณุโลก, บ้านกลาง', '2025-02-18 14:57:39', 480, 2450.00, 'รอชำระ'),
(109, 46, 'Sutem', 'Sutem', '123456', '123@gmail.com', 'หนองแค', 'สุโขทัย, นาเชือก', '2025-02-18 15:02:12', 470, 2400.00, 'รอชำระ'),
(111, 46, 'Sutem', 'Sutem', '0882945912', '123456@gmail.com', 'หนองแค', 'ยะลา, ตาเนาะปูเต๊ะ', '2025-02-18 16:24:49', 1030, 5200.00, 'รอชำระ');

--
-- Triggers `tb_order`
--
DELIMITER $$
CREATE TRIGGER `SetDefaultLocationFrom` BEFORE INSERT ON `tb_order` FOR EACH ROW SET NEW.Location_From = 'หนองแค'
$$
DELIMITER ;

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
  MODIFY `Cus_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `tb_employee`
--
ALTER TABLE `tb_employee`
  MODIFY `Emp_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `tb_order`
--
ALTER TABLE `tb_order`
  MODIFY `Order_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

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
