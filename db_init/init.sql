CREATE DATABASE chessbutebay;

USE chessbutebay;

CREATE TABLE `chessbutebay`.`User` (
  `Id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, 
  `Email` VARCHAR(255) NOT NULL, 
  `Password` VARCHAR(255) NOT NULL, 
  `Name` VARCHAR(255) NOT NULL, 
  `Fname` VARCHAR(255) NULL, 
  `Lname` VARCHAR(255) NULL, 
  `Score` INT(10) NULL, 
  `Ban_Status` BOOLEAN NOT NULL, 
  `Admin` BOOLEAN NOT NULL
);

CREATE TABLE `chessbutebay`.`Logs` (
  `Logs_Id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, 
  `StartDate` DATETIME NOT NULL ,
  `EndDate` DATETIME NOT nULL,
  `plycount` INT NOT NULL ,
  `WinID` INT UNSIGNED NOT NULL ,
  `LosID` INT UNSIGNED NOT NULL ,
  `WhiteID` INT UNSIGNED NOT NULL ,
  `BlackID` INT UNSIGNED NOT NULL ,
  `NotationID` INT UNSIGNED NOT NULL
);

CREATE TABLE `chessbutebay`.`Notation` (
  `NotationID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, 
  `log` JSON NOT NULL
);

ALTER TABLE Logs ADD CONSTRAINT `winid` FOREIGN KEY (WinID) REFERENCES User (id);
ALTER TABLE Logs ADD CONSTRAINT `losid` FOREIGN KEY (LosID) REFERENCES User (id);
ALTER TABLE Logs ADD CONSTRAINT `whiteid` FOREIGN KEY (WhiteID) REFERENCES User (id);
ALTER TABLE Logs ADD CONSTRAINT `blackid` FOREIGN KEY (BlackID) REFERENCES User (id);
ALTER TABLE Logs ADD CONSTRAINT `notationid` FOREIGN KEY (NotationID) REFERENCES Notation (NotationID);





-- INSERT INTO `User` (`Email`, `Password`, `Name`, `Fname`, `Lname`, `Score`, `Ban_Status`, `Admin`) 
--   VALUES ('korn2k9@gmail.com', 'qwe123', 'paowick', NULL, NULL, 111, FALSE, TRUE);
INSERT INTO `User` (`Email`, `Password`, `Name`, `Fname`, `Lname`, `Score`, `Ban_Status`, `Admin`) 
  VALUES ('admin1@gmail.com', 'qwe123', 'admin1', NULL, NULL, 111, FALSE, TRUE);
-- INSERT INTO `User` (`Email`, `Password`, `Name`, `Fname`, `Lname`, `Score`, `Ban_Status`, `Admin`) 
--   VALUES ('user1@gmail.com', 'qwe123', 'user1', NULL, NULL, 111, FALSE, FALSE);
-- INSERT INTO `User` (`Email`, `Password`, `Name`, `Fname`, `Lname`, `Score`, `Ban_Status`, `Admin`) 
--   VALUES ('user2@gmail.com', 'qwe123', 'user2', NULL, NULL, 111, TRUE, FALSE);

-- INSERT INTO `User` (`Email`, `Password`, `Name`, `Fname`, `Lname`, `Score`, `Ban_Status`, `Admin`) 
--   VALUES ('reinger.mitchel@example.net', '97881200', 'Faustino Wolff', 'Alyson', 'Schumm', 0, FALSE, FALSE);
-- INSERT INTO `User` (`Email`, `Password`, `Name`, `Fname`, `Lname`, `Score`, `Ban_Status`, `Admin`) 
--   VALUES ('farrell.vinnie@example.com', '9798', 'Doug Casper', 'Webster', 'Renner', 890486877, FALSE, FALSE);
-- INSERT INTO `User` (`Email`, `Password`, `Name`, `Fname`, `Lname`, `Score`, `Ban_Status`, `Admin`) 
--   VALUES ('kristopher39@example.net', '6042', 'Tatyana Marvin', 'Kole', 'Nikolaus', 47188528, TRUE, FALSE);
-- INSERT INTO `User` (`Email`, `Password`, `Name`, `Fname`, `Lname`, `Score`, `Ban_Status`, `Admin`) 
--   VALUES ('hhand@example.net', '180700519', 'Ryleigh Raynor', 'Aimee', 'Oberbrunner', 26775, TRUE, FALSE);
-- INSERT INTO `User` (`Email`, `Password`, `Name`, `Fname`, `Lname`, `Score`, `Ban_Status`, `Admin`) 
--   VALUES ('jaskolski.elta@example.net', '2', 'Ike Emard', 'Hilario', 'Watsica', 8, FALSE, FALSE);