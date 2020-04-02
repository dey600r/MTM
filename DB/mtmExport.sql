BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "mtmMaintenance" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"description"	TEXT NOT NULL,
	"idMaintenanceElement"	INTEGER NOT NULL,
	"idMaintenanceFrec"	BLOB NOT NULL,
	"km"	INTEGER NOT NULL,
	"time"	INTEGER,
	"init"	TEXT NOT NULL,
	"wear"	TEXT NOT NULL,
	"master"	TEXT NOT NULL,
	FOREIGN KEY("idMaintenanceElement") REFERENCES "mtmMaintenanceElement"("id"),
	FOREIGN KEY("idMaintenanceFrec") REFERENCES "mtmMaintenanceFreq"("id")
);
CREATE TABLE IF NOT EXISTS "mtmConfiguration" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	"description"	TEXT NOT NULL,
	"master"	TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS "mtmMaintenanceElement" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"name"	TEXT NOT NULL,
	"description"	TEXT,
	"master"	TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS "mtmMoto" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"model"	TEXT NOT NULL,
	"brand"	TEXT NOT NULL,
	"year"	INTEGER NOT NULL,
	"km"	INTEGER NOT NULL,
	"idConfiguration"	INTEGER NOT NULL,
	"kmsPerMonth"	INTEGER NOT NULL,
	"dateKms"	TEXT NOT NULL,
	FOREIGN KEY("idConfiguration") REFERENCES "mtmConfiguration"("id")
);
CREATE TABLE IF NOT EXISTS "mtmConfigMaintenance" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"idConfiguration"	INTEGER NOT NULL,
	"idMaintenance"	INTEGER NOT NULL,
	FOREIGN KEY("idConfiguration") REFERENCES "mtmConfiguration"("id"),
	FOREIGN KEY("idMaintenance") REFERENCES "mtmMaintenance"("id")
);
CREATE TABLE IF NOT EXISTS "mtmOpMaintElem" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"idOperation"	INTEGER NOT NULL,
	"idMaintenanceElement"	INTEGER NOT NULL,
	FOREIGN KEY("idMaintenanceElement") REFERENCES "mtmMaintenanceElement"("id"),
	FOREIGN KEY("idOperation") REFERENCES "mtmOperation"("id")
);
CREATE TABLE IF NOT EXISTS "mtmOperation" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"description"	TEXT NOT NULL,
	"details"	TEXT NOT NULL,
	"idOperationType"	INTEGER NOT NULL,
	"idMoto"	INTEGER NOT NULL,
	"km"	REAL NOT NULL,
	"date"	TEXT NOT NULL,
	"location"	TEXT,
	"owner"	TEXT,
	"price"	REAL NOT NULL,
	"document"	BLOB,
	FOREIGN KEY("idMoto") REFERENCES "mtmMoto"("id"),
	FOREIGN KEY("idOperationType") REFERENCES "mtmOperationType"("id")
);
CREATE TABLE IF NOT EXISTS "mtmMaintenanceFreq" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"code"	TEXT NOT NULL UNIQUE,
	"description"	TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS "mtmOperationType" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"code"	TEXT NOT NULL UNIQUE,
	"description"	TEXT NOT NULL
);
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (1,'Cambio primer aceite',3,'1',1000,6,'Y','N','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (2,'Cambio primer filtro aceite',5,'1',1000,6,'Y','N','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (3,'Cambio filtro de aire',4,'2',16000,24,'N','N','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (4,'Cambio aceite',3,'2',8000,12,'N','N','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (5,'Cambio filtro aceite',5,'2',8000,12,'N','N','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (6,'Reglaje de valvulas',16,2,40000,48,'N','Y','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (7,'Primer cambio junta tapón aceite',17,1,1000,6,'Y','N','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (8,'Cambio junta tapón aceite',17,2,8000,12,'N','N','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (9,'Cambio bujias',6,2,20000,24,'N','Y','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (10,'Cambio refrigerante',8,2,40000,36,'N','N','Y');
INSERT INTO "mtmConfiguration" ("id","name","description","master") VALUES (1,'Fabrica','Configuración de fábrica','Y');
INSERT INTO "mtmConfiguration" ("id","name","description","master") VALUES (2,'Yamaha','Configuración de Yamaha','N');
INSERT INTO "mtmConfiguration" ("id","name","description","master") VALUES (3,'Kawasaki','Configuración de Kawasaki','N');
INSERT INTO "mtmConfiguration" ("id","name","description","master") VALUES (4,'Honda','Configuración de Honda','N');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (1,'FRONT_WHEEL','CHANGE_FRONT_WHEEL','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (2,'BACK_WHEEL','CHANGE_BACK_WHEEL','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (3,'ENGINE_OIL','CHANGE_ENGINE_OIL','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (4,'AIR_FILTER','CHANGE_AIR_FILTER','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (5,'OIL_FILTER','CHANGE_OIL_FILTER','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (6,'SPARK_PLUG','CHANGE_SPARK_PLUG','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (7,'FRONT_BRAKE_FLUID','CHANGE_FRONT_BRAKE_FLUID','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (8,'COOLANT','CHANGE_COOLANT','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (9,'THERMOSTAT','CHANGE_THERMOSTAT','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (10,'DRAG_KIT','CHANGE_DRAG_KIT','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (11,'FRONT_BRAKE_PADS','CHANGE_FRONT_BRAKE_PADS','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (12,'BACK_BRAKE_FLUID','CHANGE_BACK_BRAKE_FLUID','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (13,'BACK_BRAKE_PADS','CHANGE_BACK_BRAKE_PADS','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (14,'RADIATOR','CHANGE_RADIATOR','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (15,'CAP_RADIATOR','CHANGE_CAP_RADIATOR','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (16,'VALVE_PADS','CHANGE_VALVE_PADS','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (17,'OIL_PLUG_GASTEK','CHANGE_OIL_PLUG_GASTEK','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (18,'CARBURATOR','CHANGE_CARBURATOR','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (19,'INJECTOR','CHANGE_INJECTOR','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (20,'STEERING_BEARING_KIT','CHANGE_STEERING_BEARING_KIT','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (22,'FRONT_BRAKE_DISC','CHANGE_FRONT_BRAKE_DISC','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (23,'BACK_BRAKE_DISC','CHANGE_BACK_BRAKE_DISC','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (24,'BATTERY','CHANGE_BATTERY','Y');
INSERT INTO "mtmMoto" ("id","model","brand","year","km","idConfiguration","kmsPerMonth","dateKms") VALUES (1,'R6','Yamaha',2005,85300,2,150,'2019-12-01');
INSERT INTO "mtmMoto" ("id","model","brand","year","km","idConfiguration","kmsPerMonth","dateKms") VALUES (2,'GT 125 R','Hyosung',2006,75600,1,30,'2019-12-01');
INSERT INTO "mtmMoto" ("id","model","brand","year","km","idConfiguration","kmsPerMonth","dateKms") VALUES (3,'Ninja600','Kawasaki',2006,74000,3,100,'2019-12-01');
INSERT INTO "mtmMoto" ("id","model","brand","year","km","idConfiguration","kmsPerMonth","dateKms") VALUES (4,'CBRF','Honda',2004,50000,4,140,'2020-03-22');
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (1,1,1);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (2,1,2);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (3,1,3);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (4,1,4);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (5,1,5);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (6,1,6);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (7,1,7);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (8,1,8);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (9,1,9);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (10,1,10);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (1,1,6);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (2,2,3);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (3,2,4);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (4,2,5);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (5,3,1);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (6,3,2);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (7,3,3);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (8,3,4);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (9,3,5);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (10,3,6);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (11,5,3);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (12,5,4);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (13,5,6);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (1,'Revision','Cambio de bujias crk10',7,1,15000.0,'2019-12-01','Garaje','Yo',32.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (2,'Revision','Cambio de aceite y filtros',2,2,50000.0,'2020-01-01','Garaje','Yo',40.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (3,'Revision','Cambio de aceite, filtros, ruedas y bujias',8,1,80000.0,'2020-03-03','Garaje','Yo',300.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (4,'Compra motocard','Compra casco shoei',5,1,40000.0,'2020-02-01','Motocard','Yo',456.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (5,'Revision','Cambio de aceite y filtros',1,3,40000.0,'2019-04-02','Garaje','Jose',130.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (6,'Compra aliexpress','Compra cupula negra',6,2,66600.0,'2020-02-14','Aliexpress','Yo',12.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (7,'Compra nilmoto','Compra caballete deltantero y trasero',4,1,60000.0,'2020-03-01','Nilmoto','Yo',200.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (8,'Compra motocard','Compra chaqueta alpinestar',3,3,40000.0,'2019-05-23','Motocard','Yo',240.0,NULL);
INSERT INTO "mtmMaintenanceFreq" ("id","code","description") VALUES (1,'O','Operacion');
INSERT INTO "mtmMaintenanceFreq" ("id","code","description") VALUES (2,'C','Calendario');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (1,'MW','MAINTENANCE_WORKSHOP');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (2,'FW','FAILURE_WORKSHOP');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (3,'C','CLOTHES');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (4,'T','TOOLS');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (5,'A','ACCESORIES');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (6,'O','OTHERS');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (7,'MH','MAINTENANCE_HOME');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (8,'FH','FAILURE_HOME');
COMMIT;
