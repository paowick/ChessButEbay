CREATE DATABASE chessbutebay;

USE chessbutebay;

CREATE TABLE `User` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `Email` text NOT NULL,
  `Password` text NOT NULL,
  `Name` text NOT NULL,
  `Score` int(10) DEFAULT NULL,
  `Admin` binary(1) NOT NULL COMMENT '1 = admin\r\n0 = not admin',
   primary key (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
COMMIT;

INSERT INTO `User` (`Email`, `Password`, `Name`, `Score`, `Admin`) VALUES ('korn2k9@gmail.com', 'paowick403244230', 'paowick', '100', 0x1);