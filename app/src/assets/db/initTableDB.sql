CREATE TABLE IF NOT EXISTS "mtmMaintenance" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"idMaintenanceElement"	INTEGER NOT NULL,
	"idMaintenanceFrec"	INTEGER NOT NULL,
	"km"	INTEGER NOT NULL,
	"time"	INTEGER,
	"init"	TEXT NOT NULL,
	"desgaste"	TEXT NOT NULL,
	FOREIGN KEY("idMaintenanceElement") REFERENCES "mtmMaintenanceElement"("id"),
	FOREIGN KEY("idMaintenanceFrec") REFERENCES "mtmMaintenanceFrec"("id")
);
CREATE TABLE IF NOT EXISTS "mtmMoto" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"model"	TEXT NOT NULL UNIQUE,
	"brand"	TEXT NOT NULL,
	"year"	INTEGER NOT NULL,
	"km"	INTEGER NOT NULL,
	"idConfiguration"	INTEGER NOT NULL,
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
CREATE TABLE IF NOT EXISTS "mtmMaintenanceElement" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"name"	TEXT NOT NULL,
	"description"	TEXT
);
CREATE TABLE IF NOT EXISTS "mtmConfiguration" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	"description"	TEXT NOT NULL
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
CREATE TABLE IF NOT EXISTS "mtmMaintenanceFrec" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"code"	TEXT NOT NULL UNIQUE,
	"description"	TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS "mtmOperationType" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"code"	TEXT NOT NULL UNIQUE,
	"description"	TEXT NOT NULL
);

INSERT INTO "mtmMaintenance" ("id","idMaintenanceElement","idMaintenanceFrec","km","time","init","desgaste") VALUES (1,1,2,30000,48,'N','Y');
INSERT INTO "mtmMaintenance" ("id","idMaintenanceElement","idMaintenanceFrec","km","time","init","desgaste") VALUES (2,6,2,25000,24,'N','N');
INSERT INTO "mtmMoto" ("id","model","brand","year","km","idConfiguration") VALUES (1,'R6','Yamaha',2005,85300,1);
INSERT INTO "mtmMoto" ("id","model","brand","year","km","idConfiguration") VALUES (2,'GT 125 R','Hyosung',2006,76000,1);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (1,1,1);
INSERT INTO "mtmConfigMaintenance" ("id","idConfiguration","idMaintenance") VALUES (2,1,2);
INSERT INTO "mtmOpMaintElem" ("id","idOperation","idMaintenanceElement") VALUES (1,1,6);
INSERT INTO "mtmMaintenanceElement" ("id","name","description") VALUES (1,'Rueda delantera','Cambio rueda delantera');
INSERT INTO "mtmMaintenanceElement" ("id","name","description") VALUES (2,'Rueda trasera','Cambio rueda trasera');
INSERT INTO "mtmMaintenanceElement" ("id","name","description") VALUES (3,'Aceite Motor','Cambio aceite motor');
INSERT INTO "mtmMaintenanceElement" ("id","name","description") VALUES (4,'Filtro Aceite','Filtro Aceite Motor');
INSERT INTO "mtmMaintenanceElement" ("id","name","description") VALUES (5,'Filtro Aire','Cambio/Limpiar Filtro Aire');
INSERT INTO "mtmMaintenanceElement" ("id","name","description") VALUES (6,'Bujias','Cambio Bujias');
INSERT INTO "mtmMaintenanceElement" ("id","name","description") VALUES (7,'Liquido de frenos','Cambio liquido de frenos');
INSERT INTO "mtmConfiguration" ("id","name","description") VALUES (1,'Fabrica','Configuración de fábrica');
INSERT INTO "mtmOperation" ("id","description","details","idOperationType","idMoto","km","date","location","owner","price","document") VALUES (1,'Revision','Cambio de bujias crk10',2,1,15000.0,'01/12/2019','Garaje','Yo',0.0,NULL);
INSERT INTO "mtmMaintenanceFrec" ("id","code","description") VALUES (1,'O','Operacion');
INSERT INTO "mtmMaintenanceFrec" ("id","code","description") VALUES (2,'C','Calendario');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (1,'MT','Mantenimiento Taller');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (2,'AT','Averia Taller');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (3,'R','Ropa');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (4,'H','Herramienta');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (5,'A','Accesorios');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (6,'O','Otros');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (7,'MC','Mantenimiento Casero');
INSERT INTO "mtmOperationType" ("id","code","description") VALUES (8,'AC','Averia Casera');