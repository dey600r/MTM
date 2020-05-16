BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "mtmMaintenance" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"description"	TEXT NOT NULL,
	"idMaintenanceFrec"	BLOB NOT NULL,
	"km"	INTEGER NOT NULL,
	"time"	INTEGER,
	"init"	TEXT NOT NULL,
	"wear"	TEXT NOT NULL,
	"fromKm"	INTEGER NOT NULL DEFAULT 0,
	"toKm"	INTEGER,
	"master"	TEXT NOT NULL,
	FOREIGN KEY("idMaintenanceFrec") REFERENCES "mtmMaintenanceFreq"("id")
);
CREATE TABLE IF NOT EXISTS "mtmMaintenanceElementRel" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"idMaintenance"	INTEGER NOT NULL,
	"idMaintenanceElement"	INTEGER NOT NULL,
	FOREIGN KEY("idMaintenance") REFERENCES "mtmMaintenance"("id"),
	FOREIGN KEY("idMaintenanceElement") REFERENCES "mtmMaintenanceElement"("id")
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
	"datePurchase"	TEXT NOT NULL,
	FOREIGN KEY("idConfiguration") REFERENCES "mtmConfiguration"("id")
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
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceFrec","km","time","init","wear","fromKm","toKm","master") VALUES (1,'FIRST_REVIEW','1',1000,6,'Y','N',0,NULL,'Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceFrec","km","time","init","wear","fromKm","toKm","master") VALUES (2,'BASIC_REVIEW','2',8000,12,'N','N',0,NULL,'Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceFrec","km","time","init","wear","fromKm","toKm","master") VALUES (3,'CHANGE_AIR_FILTER','2',16000,24,'N','N',0,NULL,'Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceFrec","km","time","init","wear","fromKm","toKm","master") VALUES (4,'CHANGE_SPARK_PLUG','2',20000,24,'N','Y',0,NULL,'Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceFrec","km","time","init","wear","fromKm","toKm","master") VALUES (5,'ADJUST_VALVES','2',40000,48,'N','Y',0,NULL,'Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceFrec","km","time","init","wear","fromKm","toKm","master") VALUES (6,'CHANGE_COOLANT',2,40000,36,'N','N',0,NULL,'Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceFrec","km","time","init","wear","fromKm","toKm","master") VALUES (7,'CHANGE_BRAKE_FLUID','2',16000,36,'N','N',0,NULL,'Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceFrec","km","time","init","wear","fromKm","toKm","master") VALUES (8,'CHANGE_FRONT_BRAKE_PADS',2,20000,48,'N','Y',0,NULL,'Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceFrec","km","time","init","wear","fromKm","toKm","master") VALUES (9,'CHANGE_BACK_BRAKE_PADS',2,30000,48,'N','Y',0,NULL,'Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceFrec","km","time","init","wear","fromKm","toKm","master") VALUES (10,'CHANGE_CLUTCH_DISC',2,50000,48,'N','Y',0,NULL,'Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceFrec","km","time","init","wear","fromKm","toKm","master") VALUES (11,'CHANGE_FRONT_WHEEL',2,20000,72,'N','Y',0,NULL,'Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceFrec","km","time","init","wear","fromKm","toKm","master") VALUES (12,'CHANGE_BACK_WHEEL',2,15000,72,'N','Y',0,NULL,'Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceFrec","km","time","init","wear","fromKm","toKm","master") VALUES (13,'CHANGE_THERMOSTAT',2,50000,84,'N','Y',0,NULL,'Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceFrec","km","time","init","wear","fromKm","toKm","master") VALUES (14,'CHANGE_DRAG_KIT',2,30000,48,'N','Y',0,NULL,'Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceFrec","km","time","init","wear","fromKm","toKm","master") VALUES (15,'CHANGE_RADIATOR',2,50000,84,'N','Y',0,NULL,'Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceFrec","km","time","init","wear","fromKm","toKm","master") VALUES (16,'CHANGE_CAP_RADIATOR',2,50000,84,'N','Y',0,NULL,'Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceFrec","km","time","init","wear","fromKm","toKm","master") VALUES (17,'CHANGE_BATTERY',2,40000,48,'N','Y',0,NULL,'Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceFrec","km","time","init","wear","fromKm","toKm","master") VALUES (18,'CHANGE_RIGHT_DUMPER_SEALS',2,30000,48,'N','Y',0,NULL,'Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceFrec","km","time","init","wear","fromKm","toKm","master") VALUES (19,'CHANGE_LEFT_DUMPER_SEALS',2,30000,48,'N','Y',0,NULL,'Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceFrec","km","time","init","wear","fromKm","toKm","master") VALUES (20,'CHANGE_CLUTCH_WIRE',2,50000,48,'N','Y',0,NULL,'Y');
INSERT INTO "mtmMaintenance" ("id","description","idMaintenanceFrec","km","time","init","wear","fromKm","toKm","master") VALUES (21,'CHANGE_STEERING_BEARING_KIT',2,50000,60,'N','Y',0,NULL,'Y');
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (1,1,3);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (2,1,5);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (3,1,17);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (4,2,3);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (5,2,5);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (6,2,17);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (7,3,4);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (8,4,6);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (9,5,6);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (10,5,16);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (11,6,8);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (12,7,7);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (13,7,12);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (14,8,11);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (15,9,13);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (16,10,26);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (17,11,1);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (18,11,28);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (19,12,2);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (20,12,29);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (21,13,9);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (22,14,10);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (23,15,14);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (24,16,15);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (25,17,24);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (26,18,30);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (27,19,31);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (28,20,25);
INSERT INTO "mtmMaintenanceElementRel" ("id","idMaintenance","idMaintenanceElement") VALUES (29,21,20);
INSERT INTO "mtmConfiguration" ("id","name","description","master") VALUES (1,'Fabrica','Configuración de fábrica','Y');
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
