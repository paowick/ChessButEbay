CREATE DATABASE chessbutebay;

USE chessbutebay;

CREATE TABLE `User` (
  `Id` varchar(10) NOT NULL,
  `Email` text NOT NULL,
  `Password` text NOT NULL,
  `Name` text NOT NULL,
  `Score` int(10) DEFAULT NULL,
  `Admin` binary(1) NOT NULL COMMENT '1 = admin\r\n0 = not admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


ALTER TABLE `User`
  ADD PRIMARY KEY (`Id`);
COMMIT;

INSERT INTO `User` (`Id`, `Email`, `Password`, `Name`, `Score`, `Admin`) VALUES ('0', 'korn2k9@gmail.com', 'paowick403244230', 'paowick', '100', 0x1);