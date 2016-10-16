
CREATE TABLE IF NOT EXISTS gigs.band
(
  bandID int(11) AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  video char(11),
  PRIMARY KEY (bandID)
) DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS gigs.live
(
  liveID int(11) AUTO_INCREMENT,
  houseID int(11) NOT NULL,
  context varchar(255),
  open char(5),
  ticket char(4),
  image varchar(255),
  yyyymmdd int(8),
  PRIMARY KEY (liveID)
) DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS gigs.act
(
  liveID int(11) NOT NULL,
  bandID int(11) NOT NULL
) DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS gigs.house
(
  houseID int(11),
  name varchar(255) NOT NULL,
  prefacture char(3),
  url varchar(255),
  PRIMARY KEY (houseID)
) DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS gigs.log
(
  userID varchar(255) NOT NULL,
  page varchar(255) NOT NULL,
  timestamp timestamp
) DEFAULT CHARSET=utf8;
