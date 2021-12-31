CREATE TABLE IF NOT EXISTS "mtmOperation" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"description"	TEXT NOT NULL,
	"details"	TEXT NOT NULL,
	"idOperationType"	INTEGER NOT NULL,
	"idVehicle"	INTEGER NOT NULL,
	"km"	REAL NOT NULL,
	"date"	TEXT NOT NULL,
	"location"	TEXT,
	"owner"	TEXT,
	"price"	REAL NOT NULL,
	"document"	BLOB,
	FOREIGN KEY("idOperationType") REFERENCES "mtmOperationType"("id"),
	FOREIGN KEY("idVehicle") REFERENCES "mtmVehicle"("id")
);
CREATE TABLE IF NOT EXISTS "mtmVehicle" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"model"	TEXT NOT NULL,
	"brand"	TEXT NOT NULL,
	"year"	INTEGER NOT NULL,
	"km"	INTEGER NOT NULL,
	"idConfiguration"	INTEGER NOT NULL,
	"idVehicleType"	INTEGER NOT NULL,
	"kmsPerMonth"	INTEGER,
	"dateKms"	TEXT NOT NULL,
	"datePurchase"	TEXT NOT NULL,
	"active"	TEXT NOT NULL DEFAULT 'Y',
	FOREIGN KEY("idConfiguration") REFERENCES "mtmConfiguration"("id"),
	FOREIGN KEY("idVehicleType") REFERENCES "mtmVehicleType"("id")
);
CREATE TABLE IF NOT EXISTS "mtmVehicleType" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"code"	TEXT NOT NULL,
	"description"	TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS "mtmSystemConfiguration" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"key"	TEXT NOT NULL,
	"value"	TEXT NOT NULL,
	"updated"	TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS "mtmMaintenance" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"description"	TEXT NOT NULL,
	"idMaintenanceFrec"	INTEGER NOT NULL,
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
	"price"	REAL NOT NULL DEFAULT 0,
	FOREIGN KEY("idMaintenanceElement") REFERENCES "mtmMaintenanceElement"("id"),
	FOREIGN KEY("idOperation") REFERENCES "mtmOperation"("id")
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
INSERT OR IGNORE INTO "mtmVehicleType" VALUES (1,'M','MOTORBIKE');
INSERT OR IGNORE INTO "mtmVehicleType" VALUES (2,'C','CAR');
INSERT OR IGNORE INTO "mtmVehicleType" VALUES (3,'O','OTHER');
INSERT OR IGNORE INTO "mtmSystemConfiguration" VALUES (1,'lastUpdate','v3.3.0','2021-12-13 19:00:00');
INSERT OR IGNORE INTO "mtmSystemConfiguration" VALUES (2,'configDistance','KM','2006-09-12 12:32:00');
INSERT OR IGNORE INTO "mtmSystemConfiguration" VALUES (3,'configMoney','EURO','2006-09-12 12:32:00');
INSERT OR IGNORE INTO "mtmSystemConfiguration" VALUES (4,'configTheme','L','2006-09-12 12:32:00');
INSERT OR IGNORE INTO "mtmSystemConfiguration" VALUES (5,'configPrivacy','N','2006-09-12 12:32:00');
INSERT OR IGNORE INTO "mtmSystemConfiguration" VALUES (6,'configSyncEmail','','2006-09-12 12:32:00');
INSERT OR IGNORE INTO "mtmMaintenance" VALUES (1,'FIRST_REVIEW','1',1000,6,'Y','N',0,NULL,'Y');
INSERT OR IGNORE INTO "mtmMaintenance" VALUES (2,'BASIC_REVIEW','2',8000,12,'N','N',0,NULL,'Y');
INSERT OR IGNORE INTO "mtmMaintenance" VALUES (3,'CHANGE_AIR_FILTER','2',16000,24,'N','N',0,NULL,'Y');
INSERT OR IGNORE INTO "mtmMaintenance" VALUES (4,'CHANGE_SPARK_PLUG','2',20000,24,'N','Y',0,NULL,'Y');
INSERT OR IGNORE INTO "mtmMaintenance" VALUES (5,'ADJUST_VALVES','2',40000,48,'N','Y',0,NULL,'Y');
INSERT OR IGNORE INTO "mtmMaintenance" VALUES (6,'CHANGE_COOLANT',2,40000,36,'N','N',0,NULL,'Y');
INSERT OR IGNORE INTO "mtmMaintenance" VALUES (7,'CHANGE_BRAKE_FLUID','2',16000,36,'N','N',0,NULL,'Y');
INSERT OR IGNORE INTO "mtmMaintenance" VALUES (8,'CHANGE_FRONT_BRAKE_PADS',2,20000,48,'N','Y',0,NULL,'Y');
INSERT OR IGNORE INTO "mtmMaintenance" VALUES (9,'CHANGE_BACK_BRAKE_PADS',2,30000,48,'N','Y',0,NULL,'Y');
INSERT OR IGNORE INTO "mtmMaintenance" VALUES (10,'CHANGE_FRONT_WHEEL',2,20000,72,'N','Y',0,NULL,'Y');
INSERT OR IGNORE INTO "mtmMaintenance" VALUES (11,'CHANGE_BACK_WHEEL',2,15000,72,'N','Y',0,NULL,'Y');
INSERT OR IGNORE INTO "mtmMaintenance" VALUES (12,'CHANGE_DRAG_KIT',2,30000,48,'N','Y',0,NULL,'Y');
INSERT OR IGNORE INTO "mtmMaintenance" VALUES (13,'CHANGE_BATTERY',2,40000,48,'N','Y',0,NULL,'Y');
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (1,1,3);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (2,1,5);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (3,1,17);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (4,2,3);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (5,2,5);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (6,2,17);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (7,3,4);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (8,4,6);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (9,5,6);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (10,5,16);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (11,6,8);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (12,7,7);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (13,7,12);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (14,8,11);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (15,9,13);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (16,10,1);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (17,10,28);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (18,11,2);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (19,11,29);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (20,12,10);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (21,13,24);
INSERT OR IGNORE INTO "mtmConfiguration" VALUES (1,'PRODUCTION','PRODUCTION_SETUP','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (1,'FRONT_WHEEL','CHANGE_FRONT_WHEEL','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (2,'BACK_WHEEL','CHANGE_BACK_WHEEL','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (3,'ENGINE_OIL','CHANGE_ENGINE_OIL','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (4,'AIR_FILTER','CHANGE_AIR_FILTER','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (5,'OIL_FILTER','CHANGE_OIL_FILTER','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (6,'SPARK_PLUG','CHANGE_SPARK_PLUG','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (7,'FRONT_BRAKE_FLUID','CHANGE_FRONT_BRAKE_FLUID','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (8,'COOLANT','CHANGE_COOLANT','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (9,'THERMOSTAT','CHANGE_THERMOSTAT','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (10,'DRAG_KIT','CHANGE_DRAG_KIT','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (11,'FRONT_BRAKE_PADS','CHANGE_FRONT_BRAKE_PADS','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (12,'BACK_BRAKE_FLUID','CHANGE_BACK_BRAKE_FLUID','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (13,'BACK_BRAKE_PADS','CHANGE_BACK_BRAKE_PADS','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (14,'RADIATOR','CHANGE_RADIATOR','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (15,'CAP_RADIATOR','CHANGE_CAP_RADIATOR','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (16,'VALVE_PADS','CHANGE_VALVE_PADS','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (17,'OIL_PLUG_GASTEK','CHANGE_OIL_PLUG_GASTEK','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (18,'CARBURATOR','CHANGE_CARBURATOR','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (19,'INJECTOR','CHANGE_INJECTOR','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (20,'STEERING_BEARING_KIT','CHANGE_STEERING_BEARING_KIT','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (22,'FRONT_BRAKE_DISC','CHANGE_FRONT_BRAKE_DISC','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (23,'BACK_BRAKE_DISC','CHANGE_BACK_BRAKE_DISC','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (24,'BATTERY','CHANGE_BATTERY','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (25,'CLUTCH_DISC','CHANGE_CLUTCH_DISC','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (26,'CLUTCH_WIRE','CHANGE_CLUTCH_WIRE','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (27,'PETROL_FILTER','CHANGE_PETROL_FILTER','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (28,'FRONT_WHEEL_VALVE','CHANGE_FRONT_WHEEL_VALVE','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (29,'BACK_WHEEL_VALVE','CHANGE_BACK_WHEEL_VALVE','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (30,'RIGHT_DUMPER_SEALS','CHANGE_RIGHT_DUMPER_SEALS','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (31,'LEFT_DUMPER_SEALS','CHANGE_LEFT_DUMPER_SEALS','Y');
INSERT OR IGNORE INTO "mtmMaintenanceElement" VALUES (32,'PETROL_TAP','CHANGE_PETROL_TAP','Y');
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (1,1,1);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (2,1,2);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (3,1,3);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (4,1,4);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (5,1,5);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (6,1,6);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (7,1,7);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (8,1,8);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (9,1,9);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (11,1,10);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (12,1,11);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (13,1,12);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (14,1,13);
INSERT OR IGNORE INTO "mtmMaintenanceFreq" VALUES (1,'O','ONCE');
INSERT OR IGNORE INTO "mtmMaintenanceFreq" VALUES (2,'C','CALENDAR');
INSERT OR IGNORE INTO "mtmOperationType" VALUES (1,'MW','MAINTENANCE_WORKSHOP');
INSERT OR IGNORE INTO "mtmOperationType" VALUES (2,'FW','FAILURE_WORKSHOP');
INSERT OR IGNORE INTO "mtmOperationType" VALUES (3,'C','CLOTHES');
INSERT OR IGNORE INTO "mtmOperationType" VALUES (4,'T','TOOLS');
INSERT OR IGNORE INTO "mtmOperationType" VALUES (5,'A','ACCESORIES');
INSERT OR IGNORE INTO "mtmOperationType" VALUES (6,'O','OTHERS');
INSERT OR IGNORE INTO "mtmOperationType" VALUES (7,'MH','MAINTENANCE_HOME');
INSERT OR IGNORE INTO "mtmOperationType" VALUES (8,'FH','FAILURE_HOME');
INSERT OR IGNORE INTO "mtmOperationType" VALUES (9,'R','SPARE_PARTS');
