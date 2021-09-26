 create table tb_admins(
     adminId int(25) PRIMARY KEY auto_increment,
     name          varchar(40),              
     email          varchar(40),              
    password       varchar(100),           
    isSupperAdmin  boolean DEFAULT 0   ,         
    isBlocked      boolean DEFAULT 0,           
    createdAt      timestamp  DEFAULT CURRENT_TIMESTAMP,
    updatedAt      timestamp   DEFAULT CURRENT_TIMESTAMP, 
    countryCode    varchar(5),            
    phoneNo        varchar(14)
 );
 


CREATE TABLE `tb_enterprice_settings` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `adminId` bigint(20) DEFAULT NULL,
  `enterpriceReferenceId` varchar(200) DEFAULT NULL,
  `androidGoogleMapKey` mediumtext,
  `iosGoogleMapKey` mediumtext,
  `logoImage` mediumtext,
  `favIcon` mediumtext,
  `dashboardMapKey` mediumtext,
  `customerWebMapKey` mediumtext,
  `domainName` mediumtext,
  `branchMapkey` mediumtext,
  `dailySchedulerThreshold` int(11) DEFAULT '7',
  `weeklySchedulerThreshold` int(11) DEFAULT '4',
  `monthlySchedulerThreshold` int(11) DEFAULT '3',
  `refferedByPoints` decimal(23,2) NOT NULL DEFAULT '0.00',
  `refferedToPoints` decimal(23,2) NOT NULL DEFAULT '0.00',
  `paymentMethods` mediumtext,
  `sidebarLogo` text,
  `color` tinytext,
  `name` varchar(100) DEFAULT NULL,
  `smsGateway` int(11) DEFAULT NULL COMMENT '{TWILLIO : 0 , TWO_FACTOR : 1}',
  `flowStep` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0 => from super cat , 1=> from stores => 2 direct single store ',
  `singleStoreId` bigint(20) DEFAULT NULL,
  `isChatEnabled` tinyint(4) NOT NULL DEFAULT '0',
  `currency` tinytext,
  `currencySymbol` tinytext CHARACTER SET utf16le,
  `showTomorrowSlotsOnly` tinyint(4) NOT NULL DEFAULT '0',
  `forgotPasswordLink` text,
  `enabledLanguages` text,
  `pickerEnabled` tinyint(4) NOT NULL DEFAULT '0',
  `autoAcceptOrders` tinyint(4) NOT NULL DEFAULT '0',
  `enabledVerticals` json DEFAULT NULL,
  `panelType` tinyint(4) NOT NULL DEFAULT '0',
  `goodFleetEnabled` tinyint(4) NOT NULL DEFAULT '0',
  `goodFleetApiKey` text,
  `sendItemsToGoodFleet` tinyint(4) DEFAULT '0',
  `stripeCurrency` varchar(50) DEFAULT 'usd',
  `adminNumberAsStore` tinyint(4) NOT NULL DEFAULT '0',
  `isPickupEnabled` tinyint(4) NOT NULL DEFAULT '0',
  `showAllProducts` tinyint(4) NOT NULL DEFAULT '0',
  `brandingEnabled` tinyint(4) DEFAULT '1',
  `thresholdDistance` varchar(15) DEFAULT NULL,
  `thresholdDistanceCharge` varchar(20) DEFAULT NULL,
  `chargePerMileAfterThreshold` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;


create table tb_customer_device_settings (
id bigint auto_increment primary key ,
adminId bigint ,
deviceType varchar(50 ) DEFAULT NULL ,
pemFilePath varchar(150) DEFAULT NULL,
fcmKey mediumtext DEFAULT NULL ,
appVersion varchar(20) DEFAULT NULL ,
previousVersion varchar(20) DEFAULT NULL ,
forcePush tinyint default 0 ,
appLink VARCHAR(250) default null 
);


create table tb_branch_general_settings (
id bigint auto_increment primary key ,
domainName mediumtext default null ,
favIcon mediumtext default null ,
branchLogo mediumtext default null ,
multiSession tinyint default 0 ,
sessionExpiryIn int  default 3.6e+6 /* value in millseconds */
);



create table tb_customer_web_settings(
id bigint auto_increment primary key ,
adminId bigint ,
domainName varchar(300) default null ,
favIcon varchar(300) default null ,
logo varchar(300) default null ,
multiSession tinyint default 0 ,
sessionExpiryIn int  default 3.6e+6 /* value in millseconds */
);
