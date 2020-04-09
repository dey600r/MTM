BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "mtmMoto" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"model"	TEXT NOT NULL,
	"brand"	TEXT NOT NULL,
	"year"	INTEGER NOT NULL,
	"km"	INTEGER NOT NULL,
	"idConfiguration"	INTEGER NOT NULL,
	"kmsPerMonth"	INTEGER NOT NULL,
	"dateKms"	TEXT NOT NULL,
	"datePurchase"	TEXT NOT NULL,
	FOREIGN KEY("idConfiguration") REFERENCES "mtmConfiguration"("id")
);
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
INSERT INTO "mtmMoto" ("id","model","brand","year","km","idConfiguration","kmsPerMonth","dateKms","datePurchase") VALUES (1,'R6','Yamaha',2005,85300,2,150,'2020-04-10','2006-09-19');
INSERT INTO "mtmMoto" ("id","model","brand","year","km","idConfiguration","kmsPerMonth","dateKms","datePurchase") VALUES (2,'GT 125 R','Hyosung',2006,75600,1,30,'2020-04-10','2006-09-12');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (1,'FIRST_CHANGE_ENGINE_OIL',3,'1',1000,6,'Y','N','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (2,'FIRST_CHANGE_OIL_FILTER',5,'1',1000,6,'Y','N','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (3,'CHANGE_AIR_FILTER',4,'2',16000,24,'N','N','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (4,'CHANGE_ENGINE_OIL',3,'2',8000,12,'N','N','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (5,'CHANGE_OIL_FILTER',5,'2',8000,12,'N','N','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (6,'ADJUST_VALVES',16,2,40000,48,'N','Y','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (7,'FIRST_CHANGE_OIL_PLUG_GASTEK',17,1,1000,6,'Y','N','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (8,'CHANGE_OIL_PLUG_GASTEK',17,2,8000,12,'N','N','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (9,'CHANGE_SPARK_PLUG',6,2,20000,24,'N','Y','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (10,'CHANGE_COOLANT',8,2,40000,36,'N','N','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (11,'CHANGE_FRONT_BRAKE_FLUID',7,2,16000,36,'N','N','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (12,'CHANGE_BACK_BRAKE_FLUID',12,2,16000,36,'N','N','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (13,'CHANGE_FRONT_BRAKE_PADS',11,2,20000,48,'N','Y','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (14,'CHANGE_BACK_BRAKE_PADS',13,2,30000,48,'N','Y','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (15,'CHANGE_CLUTCH_DISC',26,2,50000,48,'N','Y','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (16,'CHANGE_FRONT_WHEEL',1,2,20000,72,'N','Y','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (17,'CHANGE_BACK_WHEEL',2,2,15000,72,'N','Y','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (18,'CHANGE_FRONT_WHEEL_VALVE',28,2,40000,72,'N','Y','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (19,'CHANGE_BACK_WHEEL_VALVE',29,2,30000,72,'N','Y','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (20,'CHANGE_THERMOSTAT',9,2,50000,84,'N','Y','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (21,'CHANGE_DRAG_KIT',10,2,30000,48,'N','Y','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (22,'CHANGE_RADIATOR',14,2,50000,84,'N','Y','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (23,'CHANGE_CAP_RADIATOR',15,2,50000,84,'N','Y','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (24,'CHANGE_BATTERY',24,2,40000,48,'N','Y','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (25,'CHANGE_RIGHT_DUMPER_SEALS',30,2,30000,48,'N','Y','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (26,'CHANGE_LEFT_DUMPER_SEALS',31,2,30000,48,'N','Y','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (27,'CHANGE_CLUTCH_WIRE',25,2,50000,48,'N','Y','Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceElement","idMaintenanceFrec","km","time","init","wear","master") VALUES (28,'CHANGE_STEERING_BEARING_KIT',20,2,50000,60,'N','Y','Y');
INSERT INTO "mtmConfiguration" ("id","name","description","master") VALUES (1,'Fabrica','Configuración de fábrica','Y');
INSERT INTO "mtmConfiguration" ("id","name","description","master") VALUES (2,'Yamaha','Configuración de Yamaha','N');
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
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (25,'CLUTCH_DISC','CHANGE_CLUTCH_DISC','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (26,'CLUTCH_WIRE','CHANGE_CLUTCH_WIRE','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (27,'PETROL_FILTER','CHANGE_PETROL_FILTER','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (28,'FRONT_WHEEL_VALVE','CHANGE_FRONT_WHEEL_VALVE','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (29,'BACK_WHEEL_VALVE','CHANGE_BACK_WHEEL_VALVE','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (30,'RIGHT_DUMPER_SEALS','CHANGE_RIGHT_DUMPER_SEALS','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (31,'LEFT_DUMPER_SEALS','CHANGE_LEFT_DUMPER_SEALS','Y');
INSERT INTO "mtmMaintenanceElement" ("id","name","description","master") VALUES (32,'PETROL_TAP','CHANGE_PETROL_TAP','Y');
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
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (11,1,11);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (12,1,12);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (13,1,13);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (14,1,14);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (15,1,15);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (16,1,16);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (17,1,17);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (18,1,18);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (19,1,19);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (20,1,20);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (21,1,21);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (22,1,22);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (23,1,23);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (24,1,24);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (25,1,25);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (26,1,26);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (27,1,27);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (1,2,3);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (2,2,5);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (3,2,11);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (4,2,17);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (5,3,3);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (6,3,4);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (7,3,17);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (8,3,18);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (9,4,3);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (10,4,5);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (11,4,11);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (12,4,13);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (13,4,17);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (14,5,3);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (15,5,4);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (16,5,5);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (17,5,6);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (18,5,17);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (19,5,18);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (20,6,3);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (21,6,5);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (22,6,17);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (23,6,18);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (24,7,10);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (25,8,3);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (26,8,5);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (27,8,17);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (28,8,18);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (29,9,3);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (30,9,5);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (31,9,17);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (32,9,25);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (33,11,18);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (34,13,7);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (35,13,12);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (36,14,1);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (37,16,11);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (38,16,22);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (39,17,3);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (40,17,4);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (41,17,5);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (42,17,6);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (43,17,16);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (44,17,17);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (45,18,2);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (46,20,3);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (47,20,5);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (48,22,3);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (49,22,5);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (50,25,3);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (51,25,5);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (52,26,6);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (53,27,22);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (54,27,17);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (55,27,3);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (56,28,3);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (57,28,5);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (58,28,17);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (59,28,32);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (60,29,7);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (61,29,12);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (62,30,31);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (63,31,7);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (64,31,12);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (65,33,1);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (66,37,4);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (67,37,16);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (68,27,18);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (69,42,3);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (70,42,5);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (71,42,17);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (72,44,3);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (73,44,5);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (74,44,17);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (75,45,3);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (76,45,5);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (77,45,17);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (78,46,3);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (79,46,5);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (80,46,17);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (81,47,3);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (82,47,4);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (83,47,5);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (84,47,6);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (85,47,17);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (86,47,8);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (87,50,3);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (88,50,5);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (89,50,17);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (90,50,19);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (91,52,3);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (92,52,5);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (93,52,17);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (94,52,7);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (95,52,12);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (96,57,2);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (1,'Compra moto','Compra hyosung GT125r 2006',6,2,0.0,'2006-09-12','Motos real (Ciudad Real)','Yo',3500.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (2,'Revision','Aceite motor, filtro aceite, pastillas de freno',1,2,4000.0,'2006-11-15','Motos real (Ciudad Real)','Yo',102.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (3,'Revision','Aceite motor, filtro aceite, sincronizar carburadores',1,2,8000.0,'2007-02-06','Motos real (Ciudad Real)','Yo',73.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (4,'Revision','Aceite motor, filtro aceite, pastillas de freno delanteras y traseras',1,2,12000.0,'2007-06-20','Motos real (Ciudad Real)','Yo',137.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (5,'Revision','Aceite motor, filtro aire y aceite, bujias, sincronizar carburadores',1,2,16000.0,'2007-09-10','Motos real (Ciudad Real)','Yo',141.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (6,'Revision','Aceite motor, filtro aceite, limpiar filtro aire, ajuste riquezas en bajas',1,2,20300.0,'2007-11-26','Motos real (Ciudad Real)','Yo',80.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (7,'Cambio kit de arrastre','Cambio kit de arrastre, piñon, plato y cadena',1,2,23000.0,'2008-03-06','Motos real (Ciudad Real)','Yo',193.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (8,'Revision','Aceite motor y filtro aceite, sincronizar carburadores',1,2,24000.0,'2008-04-18','Motos real (Ciudad Real)','Yo',104.5,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (9,'Revision','Aceite motor, filtro aceite y cambio de tapa, separadores y discos de embrague',1,2,26000.0,'2008-08-12','Motos real (Ciudad Real)','Yo',215.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (10,'No arranca la moto','El cable de embrague había pelado un manguito y hacia contacto provocando cortocircuito',2,2,27000.0,'2008-11-13','Motos real (Ciudad Real)','Yo',56.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (11,'Revisar','Revisar fuga de aceite y carburar',2,2,28000.0,'2008-12-03','Motos real (Ciudad Real)','Yo',55.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (12,'Compra','Compra guardabarros kimco',5,2,30000.0,'2009-09-10','Kawa (Ciudad Real)','Yo',25.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (13,'Revision','Liquido de frenos',1,2,32000.0,'2009-12-15','Motos real (Ciudad Real)','Yo',50.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (14,'Cambiar rueda delantera','Pilot Road 2',1,2,34000.0,'2010-06-22','Michelin (Ciudad Real)','Yo',150.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (15,'Repasar escape','Soldar escape y colector',2,2,39000.0,'2010-09-24','Motos real (Ciudad Real)','Yo',50.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (16,'Cambio discos','Cambio disco delantero y pastillas',1,2,45000.0,'2011-02-26','Motos real (Ciudad Real)','Yo',315.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (17,'Revision','Aceite motor, filtro aire, filtro aceite, bujias, reglage de valvulas, sincronizar carburadores, ajuste de riqueza en bajas',1,2,50000.0,'2012-02-07','Motos real (Ciudad Real)','Yo',221.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (18,'Cambiar rueda trasera','Pilot Road 3',1,2,51000.0,'2012-03-16','Michelin (Ciudad Real)','Yo',175.36,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (19,'ITV','ITV',6,2,54892.0,'2021-09-03','ITV Ciudad Real','Yo',21.3,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (20,'Revision','Aceite motor, filtro aceite y limpiar filtro de aire',7,2,56000.0,'2013-02-15','Garaje Casa (Ciudad Real)','Yo',0.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (21,'Compra casco','Shoei xr-1100',3,2,58000.0,'2013-08-29','Motocard','Yo',395.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (22,'Revision','Aceite motor, filtro aceite y limpiar filtro de aire',7,2,62000.0,'2014-02-02','Garaje Casa (Ciudad Real)','Yo',0.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (23,'Perdida aceite','Reten de eje secundario, torica de casquillo de eje secundario',2,2,64114.0,'2014-04-06','Motos Real (Ciudad Real)','Yo',37.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (24,'ITV','ITV',6,2,67522.0,'2014-04-06','ITV Ciudad Real','Yo',21.3,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (25,'Revision','Aceite motor, filtro aceite y limpiar filtro de aire',7,2,68000.0,'2014-10-02','Garaje Casa (Ciudad Real)','Yo',0.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (26,'Averia','Bujias gastadas y rotas',2,2,69000.0,'2014-12-15','Motos real (Ciudad Real)','Yo',100.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (27,'Averia','Kit de rodamientos de direccion, tapon de vaciado de aceite, junta de tapon, reparar rosca de tapon de vaciado',2,2,70946.0,'2017-10-10','Motos real (Ciudad Real)','Yo',177.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (28,'Averia','Aceite de motor castrol 20W/50, filtro aceite, grifo de gasolina, juntas grifo',2,2,70946.0,'2017-10-10','Motos real (Ciudad Real)','Yo',180.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (29,'Revision','Cambio liquido de frenos delantero y trasero (Liquido DOT4 compra revisión r6)',7,2,71200.0,'2017-09-06','Garaje Casa (Ciudad Real)','Yo',0.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (30,'Averia','Cambio reten y aceite amortiguador izquierdo (disco) delantero',2,2,71660.0,'2017-09-18','Motos Real (Ciudad Real)','Yo',60.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (31,'Revision','Limpieza pinza y pastillas y purga de liquido de frenos',7,2,71660.0,'2017-09-18','Garaje Casa (Ciudad Real)','Yo',0.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (32,'Compra rueda delantera','Pilot Street Radial 110/70/R17 54H',7,2,71900.0,'2018-08-04','www.neumaticosonline.com','Yo',66.1,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (33,'Cambio rueda delantera','Pilot Street Radial 110/70/R17 54H',5,2,71850.0,'2018-08-16','Garaje Casa (Ciudad Real)','Yo',0.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (34,'ITV','ITV',6,2,71968.0,'2018-08-31','ITV Ciudad Real','Yo',21.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (35,'Sensor patilla','Compra sensor patilla para pasar itv',8,2,71970.0,'2018-08-31','Motos real (Ciudad Real)','Yo',30.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (36,'Siniestro golpe','Guadabarros delantero, carenado frontal, palanca de cambio, silencioso, reposapie derecho, intermitentes derechos, reparar y pintar carenado derecho',2,2,73022.0,'2018-12-26','Motos real (Ciudad Real)','Yo',0.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (37,'Revision','Reglaje de valvulas, filtro de aire, limpiar carburadores y sincronizar',1,2,73122.0,'2019-01-07','Motos real (Ciudad Real)','Yo',195.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (38,'Comprar Moto','Yamaha R6 2005',6,1,0.0,'2006-09-19','Madrid (Motos Cortes)','Otro',8155.35,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (39,'Compra limitacion','Kit limitación',5,1,79.0,'2006-09-26','Madrid (Motos Cortes)','Otro',188.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (40,'ITV','ITV',6,1,114.0,'2006-10-27','Madrid','Otro',32.99,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (41,'Compra cuentamarcha','Montar Diggi',5,1,115.0,'2006-10-27','Madrid (Motos Cortes)','Otro',146.42,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (42,'Primera Revisión','Filtro aceite, aceite motor, residuos',1,1,988.0,'2006-11-21','Madrid (Motos Cortes)','Otro',123.1,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (43,'Comprar Topes anticaidas','Montar topes anticaidas',5,1,988.0,'2006-11-21','Madrid (Motos Cortes)','Otro',135.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (44,'Revision','Aceite motor',1,1,4760.0,'2007-04-12','Madrid (Motos Cortes)','Otro',47.56,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (45,'Revision','Filtro aceite, aceite motor, junta tapón vaciado,  residuos',1,1,9048.0,'2007-10-15','Madrid (Motos Cortes)','Otro',158.27,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (46,'Revision ','Aceite motor, junta tapón vaciado, residuos',1,1,12532.0,'2008-07-16','Madrid (Motos Cortes)','Otro',51.62,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (47,'Revision ','Junta tapón, anticongelante, 4 bujías, aceite motor, residuos, filtro aceite',1,1,18080.0,'2008-09-22','Madrid (Motos Cortes)','Otro',271.76,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (48,'Quitar limitación','Quitar limitacion',1,1,20032.0,'2009-05-18','Madrid (Motos Cortes)','Otro',200.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (49,'ITV','ITV quitar limitacion',6,1,20105.0,'2009-06-29','Madrid','Otro',46.23,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (50,'Revision','Aceite motor, sincronizar',1,1,23008.0,'2010-09-13','Madrid (Motos Cortes)','Otro',60.37,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (51,'ITV','ITV',6,1,23780.0,'2012-03-27','Madrid','Otro',33.91,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (52,'Revision','Aceite motor, liquido frenos',1,1,24133.0,'2013-06-05','Madrid (Motos Cortes)','Otro',94.74,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (53,'ITV','ITV',6,1,24283.0,'2014-03-17','Madrid','Otro',33.69,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (54,'Compra Moto','Yamaha R6 2005',6,1,24467.0,'2014-08-14','Madrid','Yo',3000.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (55,'Averia','Rotura guardabarros delantero',8,1,24723.0,'2014-09-06','Ciudad Real (Piso Ana-Carlota)','Yo',0.0,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (56,'Compra alforjas','3 alforjas en Louis',3,1,24856.0,'2014-09-08','Ciudad Real(Louis)','Yo',99.95,NULL);
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (57,'Compra rueda trasera','Pilot road 3 trasera',9,1,25891.0,'2014-09-30','Ciudad Real (Michelin)','Yo',160.0,NULL);
INSERT INTO "mtmMaintenanceFreq" ("id","code","description") VALUES (1,'O','ONCE');
INSERT INTO "mtmMaintenanceFreq" ("id","code","description") VALUES (2,'C','CALENDAR');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (1,'MW','MAINTENANCE_WORKSHOP');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (2,'FW','FAILURE_WORKSHOP');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (3,'C','CLOTHES');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (4,'T','TOOLS');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (5,'A','ACCESORIES');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (6,'O','OTHERS');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (7,'MH','MAINTENANCE_HOME');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (8,'FH','FAILURE_HOME');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (9,'R','SPARE_PARTS');
COMMIT;
