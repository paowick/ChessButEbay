CREATE DATABASE chessbutebay;

USE chessbutebay;

CREATE TABLE `User` (
  `Id` int UNSIGNED NOT NULL AUTO_INCREMENT ,
  `Email` text NOT NULL,
  `Password` text NOT NULL,
  `Name` text NOT NULL,
  `ImgPath` text ,
  `Score` int(10) DEFAULT NULL,
  `Admin` binary(1) NOT NULL COMMENT '1 = admin\r\n0 = not admin',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
COMMIT;

INSERT INTO `User` (`Email`, `Password`, `Name`, `Score`, `Admin`) VALUES ('korn2k9@gmail.com', 'paowick403244230', 'paowick', '100', 0x1);