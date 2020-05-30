BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "mtmSystemConfiguration" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"key"	TEXT NOT NULL,
	"value"	TEXT NOT NULL,
	"updated"	TEXT NOT NULL
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
	FOREIGN KEY("idConfiguration") REFERENCES "mtmConfiguration"("id"),
	FOREIGN KEY("idVehicleType") REFERENCES "mtmVehicleType"("id")
);
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
CREATE TABLE IF NOT EXISTS "mtmVehicleType" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"code"	TEXT NOT NULL,
	"description"	TEXT NOT NULL
);
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
INSERT OR IGNORE INTO "mtmSystemConfiguration" VALUES (1,'lastUpdate','v1.2.3','2006-09-12 12:32:00');
INSERT OR IGNORE INTO "mtmVehicle" VALUES (1,'R6','Yamaha',2005,87650,2,1,650,'2020-04-10','2006-09-19');
INSERT OR IGNORE INTO "mtmVehicle" VALUES (2,'gt125r','Hyosung',2006,75600,3,1,50,'2020-04-10','2006-09-12');
INSERT OR IGNORE INTO "mtmOperation" VALUES (1,'Compra moto','Compra hyosung GT125r 2006',6,2,0.0,'2006-09-12','Motos real (Ciudad Real)','Yo',3500.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (2,'Revision','Aceite motor, filtro aceite, pastillas de freno',1,2,4000.0,'2006-11-15','Motos real (Ciudad Real)','Yo',102.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (3,'Revision','Aceite motor, filtro aceite, sincronizar carburadores',1,2,8000.0,'2007-02-06','Motos real (Ciudad Real)','Yo',73.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (4,'Revision','Aceite motor, filtro aceite, pastillas de freno delanteras y traseras',1,2,12000.0,'2007-06-20','Motos real (Ciudad Real)','Yo',137.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (5,'Revision','Aceite motor, filtro aire y aceite, bujias, sincronizar carburadores',1,2,16000.0,'2007-09-10','Motos real (Ciudad Real)','Yo',141.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (6,'Revision','Aceite motor, filtro aceite, limpiar filtro aire, ajuste riquezas en bajas',1,2,20300.0,'2007-11-26','Motos real (Ciudad Real)','Yo',80.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (7,'Cambio kit de arrastre','Cambio kit de arrastre, piñon, plato y cadena',1,2,23000.0,'2008-03-06','Motos real (Ciudad Real)','Yo',193.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (8,'Revision','Aceite motor y filtro aceite, sincronizar carburadores',1,2,24000.0,'2008-04-18','Motos real (Ciudad Real)','Yo',104.5,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (9,'Revision','Aceite motor, filtro aceite y cambio de tapa, separadores y discos de embrague',1,2,26000.0,'2008-08-12','Motos real (Ciudad Real)','Yo',215.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (10,'No arranca la moto','El cable de embrague había pelado un manguito y hacia contacto provocando cortocircuito',2,2,27000.0,'2008-11-13','Motos real (Ciudad Real)','Yo',56.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (11,'Revisar','Revisar fuga de aceite y carburar',2,2,28000.0,'2008-12-03','Motos real (Ciudad Real)','Yo',55.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (12,'Compra','Compra guardabarros kimco',5,2,30000.0,'2009-09-10','Kawa (Ciudad Real)','Yo',25.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (13,'Revision','Liquido de frenos',1,2,32000.0,'2009-12-15','Motos real (Ciudad Real)','Yo',50.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (14,'Cambiar rueda delantera','Pilot Road 2',1,2,34000.0,'2010-06-22','Michelin (Ciudad Real)','Yo',150.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (15,'Repasar escape','Soldar escape y colector',2,2,39000.0,'2010-09-24','Motos real (Ciudad Real)','Yo',50.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (16,'Cambio discos','Cambio disco delantero y pastillas',1,2,45000.0,'2011-02-26','Motos real (Ciudad Real)','Yo',315.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (17,'Revision','Aceite motor, filtro aire, filtro aceite, bujias, reglage de valvulas, sincronizar carburadores, ajuste de riqueza en bajas',1,2,50000.0,'2012-02-07','Motos real (Ciudad Real)','Yo',221.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (18,'Cambiar rueda trasera','Pilot Road 3',1,2,51000.0,'2012-03-16','Michelin (Ciudad Real)','Yo',175.36,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (19,'ITV','ITV',6,2,54892.0,'2012-09-03','ITV Ciudad Real','Yo',21.3,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (20,'Revision','Aceite motor, filtro aceite y limpiar filtro de aire',7,2,56000.0,'2013-02-15','Garaje Casa (Ciudad Real)','Yo',0.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (21,'Compra casco','Shoei xr-1100',3,2,58000.0,'2013-08-29','Motocard','Yo',395.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (22,'Revision','Aceite motor, filtro aceite y limpiar filtro de aire',7,2,62000.0,'2014-02-02','Garaje Casa (Ciudad Real)','Yo',0.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (23,'Perdida aceite','Reten de eje secundario, torica de casquillo de eje secundario',2,2,64114.0,'2014-04-06','Motos Real (Ciudad Real)','Yo',37.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (24,'ITV','ITV',6,2,67522.0,'2014-04-06','ITV Ciudad Real','Yo',21.3,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (25,'Revision','Aceite motor, filtro aceite y limpiar filtro de aire',7,2,68000.0,'2014-10-02','Garaje Casa (Ciudad Real)','Yo',0.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (26,'Averia','Bujias gastadas y rotas',2,2,69000.0,'2014-12-15','Motos real (Ciudad Real)','Yo',100.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (27,'Averia','Kit de rodamientos de direccion, tapon de vaciado de aceite, junta de tapon, reparar rosca de tapon de vaciado.',2,2,70946.0,'2017-10-10','Motos real (Ciudad Real)','Yo',177.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (28,'Averia','Aceite de motor castrol 20W/50, filtro aceite, grifo de gasolina, juntas grifo',2,2,70946.0,'2017-10-10','Motos real (Ciudad Real)','Yo',180.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (29,'Revision','Cambio liquido de frenos delantero y trasero (Liquido DOT4 compra revisión r6)',7,2,71200.0,'2017-11-06','Garaje Casa (Ciudad Real)','Yo',0.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (30,'Averia','Cambio reten y aceite amortiguador izquierdo (disco) delantero',2,2,71660.0,'2017-11-18','Motos Real (Ciudad Real)','Yo',60.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (31,'Revision','Limpieza pinza y pastillas y purga de liquido de frenos',7,2,71660.0,'2017-11-18','Garaje Casa (Ciudad Real)','Yo',0.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (32,'Compra rueda delantera','Pilot Street Radial 110/70/R17 54H',9,2,71850.0,'2018-08-04','www.neumaticosonline.com','Yo',66.1,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (33,'Cambio rueda delantera','Pilot Street Radial 110/70/R17 54H',7,2,71900.0,'2018-08-16','Garaje Casa (Ciudad Real)','Yo',0.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (34,'ITV','ITV',6,2,71968.0,'2018-08-31','ITV Ciudad Real','Yo',21.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (35,'Sensor patilla','Compra sensor patilla para pasar itv',8,2,71970.0,'2018-08-31','Motos real (Ciudad Real)','Yo',30.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (36,'Siniestro golpe','Guadabarros delantero, carenado frontal, palanca de cambio, silencioso, reposapie derecho, intermitentes derechos, reparar y pintar carenado derecho',2,2,73022.0,'2018-12-26','Motos real (Ciudad Real)','Yo',0.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (37,'Revision','Reglaje de valvulas, filtro de aire, limpiar carburadores y sincronizar',1,2,73122.0,'2019-01-07','Motos real (Ciudad Real)','Yo',195.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (38,'Comprar Moto','Yamaha R6 2005',6,1,0.0,'2006-09-19','Madrid (Motos Cortes)','Otro',8155.35,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (39,'Compra limitacion','Kit limitación',5,1,79.0,'2006-09-26','Madrid (Motos Cortes)','Otro',188.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (40,'ITV','ITV',6,1,114.0,'2006-10-27','Madrid','Otro',32.99,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (41,'Compra cuentamarcha','Montar Diggi',5,1,115.0,'2006-10-27','Madrid (Motos Cortes)','Otro',146.42,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (42,'Primera Revisión','Filtro aceite, aceite motor, residuos',1,1,988.0,'2006-11-21','Madrid (Motos Cortes)','Otro',123.1,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (43,'Comprar Topes anticaidas','Montar topes anticaidas',5,1,988.0,'2006-11-21','Madrid (Motos Cortes)','Otro',135.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (44,'Revision','Aceite motor',1,1,4760.0,'2007-04-12','Madrid (Motos Cortes)','Otro',47.56,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (45,'Revision','Filtro aceite, aceite motor, junta tapón vaciado,  residuos',1,1,9048.0,'2007-10-15','Madrid (Motos Cortes)','Otro',158.27,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (46,'Revision ','Aceite motor, junta tapón vaciado, residuos',1,1,12532.0,'2008-07-16','Madrid (Motos Cortes)','Otro',51.62,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (47,'Revision ','Junta tapón, anticongelante, 4 bujías, aceite motor, residuos, filtro aceite',1,1,18080.0,'2008-09-22','Madrid (Motos Cortes)','Otro',271.76,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (48,'Quitar limitación','Quitar limitacion',1,1,20032.0,'2009-05-18','Madrid (Motos Cortes)','Otro',200.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (49,'ITV','ITV quitar limitacion',6,1,20105.0,'2009-06-29','Madrid','Otro',46.23,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (50,'Revision','Aceite motor, sincronizar',1,1,23008.0,'2010-09-13','Madrid (Motos Cortes)','Otro',60.37,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (51,'ITV','ITV',6,1,23780.0,'2012-03-27','Madrid','Otro',33.91,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (52,'Revision','Aceite motor, liquido frenos',1,1,24133.0,'2013-06-05','Madrid (Motos Cortes)','Otro',94.74,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (53,'ITV','ITV',6,1,24283.0,'2014-03-17','Madrid','Otro',33.69,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (54,'Compra Moto','Yamaha R6 2005',6,1,24467.0,'2014-08-14','Madrid','Yo',3000.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (55,'Averia','Rotura guardabarros delantero',8,1,24723.0,'2014-09-06','Ciudad Real (Piso Ana-Carlota)','Yo',0.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (56,'Compra alforjas','3 alforjas en Louis',3,1,24856.0,'2014-09-08','Ciudad Real(Louis)','Yo',99.95,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (57,'Compra rueda trasera','Pilot road 3 trasera',9,1,25891.0,'2014-09-30','Ciudad Real (Michelin)','Yo',160.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (58,'Compra protección','Espaldera pecho Zandona',3,1,26981.0,'2014-12-29','Dainesse (Madrid)','Yo',125.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (59,'Compra puños','Puños calefactables Oxford',5,1,27402.0,'2015-01-16','Madrid','Yo',50.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (60,'Compra mono','Mono Alpinestar',3,1,29654.0,'2015-04-17','Madrid (Autoservicio)','Yo',630.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (61,'Compra botas','Botas Alpinestar',3,1,29809.0,'2015-04-24','Madrid (Autoservicio)','Yo',350.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (62,'Revisión','KIT ARRASTRE, aceite, filtro aceite, liquido de frenos',1,1,32552.0,'2015-06-23','Madrid (Moto Cortes)','Yo',418.76,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (63,'Compra rueda delantera','Pilot road 3 delantera',1,1,33597.0,'2015-07-22','Ciudad Real (Michelin)','Yo',120.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (64,'ITV','ITV',6,1,41197.0,'2016-03-14','Madrid (Alcobendas)','Yo',28.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (65,'Revisión','Aceite motor y bujías',1,1,41400.0,'2016-03-23','Ciudad Real (Motos Real)','Yo',238.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (66,'Compra herrajes','Herrajes universales givi',5,1,43460.0,'2016-05-24','Madrid (Amazon)','Yo',80.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (67,'Compra base herrajes','Plataforma monokey givi',5,1,43479.0,'2016-05-29','Madrid (Amazon)','Yo',30.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (68,'Herrero','Cortar placas de hierro para adaptar herrajes',6,1,45298.0,'2016-07-16','Madrid (Amazon)','Yo',50.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (69,'Compra baul','Givi v47nn monotech',5,1,47780.0,'2016-09-09','Madrid (Amazon)','Yo',188.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (70,'Compra leds','Leds rojo y naranja y cableado',5,1,47900.0,'2016-09-24','Madrid (Amazon)','Yo',10.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (71,'Compra intercumunicador','Intercomunicador para casco',5,1,51000.0,'2017-01-13','Gearbest','Yo',31.35,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (72,'Compra Chaqueta','Chaqueta Alpinestar Invierno L',3,1,51600.0,'2017-01-18','Madrid (Autoservicio)','Yo',171.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (73,'Compra antirrobo','Cadena cementada antirrobo',5,1,51600.0,'2017-01-18','Madrid (Autoservicio)','Yo',50.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (74,'Compra intercomunicador','Intercomunicador para casco',5,1,51500.0,'2017-03-21','Gearbest','Yo',28.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (75,'Revisión','Reglaje de válvulas (10 pastillas), cambio de aceite, filtro aceite, junta de caja tensor, bujías, anticongelante, liquido de frenos delantero y trasero',1,1,51800.0,'2017-03-28','MotoMax(Ciudad Real)','Yo',473.56,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (76,'Cambio bateria','Bateria',1,1,51800.0,'2017-04-10','MotoMax(Ciudad Real)','Yo',39.4,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (77,'Cambio rueda trasera','Pilot road 3 trasera',1,1,55868.0,'2017-07-05','Madrid (Noroauto)','Yo',156.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (78,'Compra casco','Shoei GT-AIR',3,1,56000.0,'2017-07-17','Motocard (Madrid)','Yo',444.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (79,'Compra intercomunicador','Intercomunicador para casco',5,1,58500.0,'2017-08-06','Gearbest','Yo',26.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (80,'Compra caballete trasero','Caballete ITR trasero universal fabricado en hierro para diabolo y basculante Negro',4,1,59000.0,'2017-08-26','Nilmotos','Yo',57.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (81,'Compra aceite','Aceite Castrol Power 1 Racing 4T 10W40 4L',9,1,59369.0,'2017-08-26','Megataller','Yo',28.7,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (82,'Compra liquido frenos','Líquido de frenos Castrol Brake Fluid DOT 4 500ML (x2)',9,1,59369.0,'2017-08-26','Megataller','Yo',12.9,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (83,'Compra grasa cadena','Aceite Castrol Chain Lube Racing 400ML',9,1,59369.0,'2017-08-26','Megataller','Yo',10.95,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (84,'Compra limpiador','Limpiador de Cadena WD-40 400ML',9,1,59369.0,'2017-08-26','Megataller','Yo',10.27,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (85,'Compra filtro aceite','Filtro de aceite Racing HIFLOFILTRO - Ref. HF303RC',9,1,59369.0,'2017-08-26','Megataller','Yo',7.82,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (86,'Compra filtro aire','Filtro de aire K&N - Ref. YA-6001',9,1,59369.0,'2017-08-26','Megataller','Yo',72.62,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (87,'Cambio rueda delantera','Pilot road 2 delantera',1,1,59360.0,'2017-08-30','Madrid (Noroauto)','Yo',141.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (88,'Revisión','Cambio de aceite 10w40 castro, filtro de aceite, filtro de aire k&n y limpieza kit de arrastre',7,1,59657.0,'2017-09-02','Garaje casa (Ciudad Real)','Yo',0.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (89,'Compra aceite','Aceite Castrol Power 1 Racing 4T 10W40 4L',9,1,63800.0,'2018-03-08','Megataller','Yo',28.7,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (90,'Compra filtro aceite','Filtro de aceite Racing HIFLOFILTRO - Ref. HF303RC',9,1,63800.0,'2018-03-08','Megataller','Yo',7.82,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (91,'Compra bujias','Bujias CR10EK (x4)',9,1,63800.0,'2018-03-08','Megataller','Yo',34.4,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (92,'Compra kit limpieza filtro','Kit de cuidado para filtros de aire K&N',9,1,63800.0,'2018-03-08','Megataller','Yo',15.96,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (93,'ITV','ITV',6,1,64154.0,'2018-03-15','Alcobendas - ITV ATISAE','Yo',38.84,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (94,'Compra refrigerante','Refrigerante 30% verde 5L ULTRAX',9,1,64500.0,'2018-03-26','Frenos Ciudad Real','Yo',6.32,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (95,'Compra juntas','Juntas cobre',9,1,64500.0,'2018-03-27','Repuestos Valencia','Yo',1.45,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (96,'Revision','Recalibrar inyección y arreglo fusible ventiladores',2,1,64582.0,'2018-03-27','Motos Real','Yo',120.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (97,'Compra caballete delantero','Caballete universal ConStand delantero Tija',4,1,64800.0,'2018-03-28','Motea','Yo',69.54,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (98,'Compra refrigerante','Refrigerante',9,1,64900.0,'2018-04-06','Hipercor (Madrid)','Yo',8.95,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (99,'Compra tapon radiador','Perdida de liquido refrigerante	Tapon radiador',9,1,64900.0,'2018-04-07','Madrid (Motos Cortes)','Yo',27.99,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (100,'Averia','Cambio de tapon de radiador. Tapon radiador averiado',8,1,64900.0,'2018-04-07','Garaje piso (Madrid)','Yo',0.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (101,'Compra chaqueta verano','Chaqueta Alpinestar AST AIR L',3,1,65200.0,'2018-04-21','Motocard (Madrid)','Yo',143.96,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (102,'Revision','Cambio de aceite 10w40 castrol, filtro de aceite, cambio líquido de frenos delante y atrás y limpieza de kit de arrastre (cadena y plato). Apretar tornillos herrajes y engrase de partes móviles',7,1,67670.0,'2018-06-17','Garaje casa (Ciudad Real)','Yo',0.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (103,'Compra herramientas','Destalonador rueda Tacos, barra y escuadras',4,1,68700.0,'2018-07-22','Leroy Merlin','Yo',22.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (104,'Compra herramientas','Desmontadores rueda. Palanca de acero',4,1,68730.0,'2018-07-24','Amazon','Yo',24.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (105,'Siniestro','Golpe en la cochera del vecino aparcando',2,1,70859.0,'2018-10-10','Madrid (Motos Cortes)','Yo',2216.42,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (106,'Averia','Perdida de liquido refrigerante. Liquido refrigerante YAMALUBE y termostato',2,1,72206.0,'2018-11-27','Madrid (Motos Capital)','Yo',207.32,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (107,'Revisión','Cambio bujias - CR10EK (x4)',7,1,72576.0,'2018-12-04','Garaje casa (Ciudad Real)','Yo',0.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (108,'Averia','Perdida de liquido refrigerante. Aditivo en el sistema de refrigeracion para tapar fugas en la culata',2,1,73512.0,'2019-01-10','Madrid (Motos Capital)','Yo',27.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (109,'Pedido Megataller','Aceite castrol 10w40, filtro aceite, limpiador total, cera wd40, limpiador cadena wd40, limpiador casco interior motul, grasa cadena',9,1,75660.0,'2019-03-23','Megataller','Yo',90.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (110,'Revisión','Cambio aceite castro 10w40, filtro aceite, limpiar filtro aire K&N, limpiar cadena (plato, piñon y cadena) y engrasar, repasar tornillos carenado y herrajes, repasar pipas. Limpiar moto y encerar. Engrasar partes moviles',7,1,75660.0,'2019-03-23','Garaje casa (Ciudad Real)','Yo',0.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (111,'Compra juntas','Juntas cobre',9,1,82067.0,'2019-09-21','Repuestos Valencia','Yo',0.8,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (112,'Compra megataller','Aceite Castrol Power 1 Racing 4T 10W40 4L',9,1,82750.0,'2019-10-07','Megataller','Yo',28.7,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (113,'Compra megataller','Filtro de aceite Racing HIFLOFILTRO - Ref. HF303RC',9,1,82750.0,'2019-10-07','Megataller','Yo',7.82,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (114,'Revision','Cambio aceite castro 10w40, filtro aceite, limpiar filtro aire K&N, limpiar cadena (plato, piñon y cadena) y engrasar, repasar tornillos carenado y herrajes. Limpiar moto y encerar. Engrasar partes moviles. Rellenar vaso expansion refrigerante. Cambio tubo de sobrante de gasolina. Ajustar los amortiguadores, 1 click endurecer (derecha) precarga delante, 1 click endurecer compresion delaten, 1 click endurecer precarga detras y 2 clicks endurecer compresion',7,1,83170.0,'2019-10-19','Garaje casa (Ciudad Real)','Yo',0.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (115,'Compra rueda delantera y trasera','Michelin Pilot Road 2 120/70 ZR 17 58W Y 180/55 ZR 17 73W. Valvula',9,1,84200.0,'2019-12-09','https://www.ventaneumaticos.com/','Yo',164.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (116,'Pedido Amazon','Kit reparacion de valvulas',9,1,84200.0,'2019-12-09','Amazon','Yo',10.99,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (117,'Pedido Amazon','25 Contrapesos Negro 12x5g Pesos Adhesivos Peso',9,1,84200.0,'2019-12-09','Amazon','Yo',14.99,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (118,'Pedido Amazon','Equilibrador ruedas',9,1,84200.0,'2019-12-09','Amazon','Yo',47.62,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (119,'Pedido Amazon','Remachadora cadena',9,1,84200.0,'2019-12-09','Amazon','Yo',28.99,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (120,'Pedido Unobike','Kit de transmisión DID con cadena x-ring super reforzada para Yamaha R6 03-05 y Yamaha R6 S 06-10 (Piñón de 16 dientes, Corona en acero de 48 dientes, Cadena con retenes DID ZVMX530 oro, 116 eslabones cierre de remache)',9,1,84200.0,'2019-12-09','Unobike','Yo',180.75,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (121,'Revision','Cambio liquido de frenos adelante y detrás. Cambio de kit de arrastre',7,1,85240.0,'2020-01-03','Garaje casa (Ciudad Real)','Yo',0.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (122,'Cambio rueda trasera','Pilot road 2 trasera y valvula del pedido de ventaneumaticos. Equilibrado en michelin',7,1,85240.0,'2020-01-03','Garaje casa (Ciudad Real)','Yo',15.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (123,'ITV','ITV - NO CUMPLE. Cambio de rueda',6,1,86890.0,'2020-02-28','Alcobendas - ITV ATISAE','Yo',25.0,NULL);
INSERT OR IGNORE INTO "mtmOperation" VALUES (124,'Cambio rueda delantera','Pilot road 2 delantera	Cambio de rueda y valvula del pedido de ventaneumaticos',7,1,87090.0,'2020-02-28','Garaje casa (Ciudad Real)','Yo',0.0,NULL);
INSERT OR IGNORE INTO "mtmVehicleType" VALUES (1,'M','MOTORBIKE');
INSERT OR IGNORE INTO "mtmVehicleType" VALUES (2,'C','CAR');
INSERT OR IGNORE INTO "mtmVehicleType" VALUES (3,'O','OTHER');
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
INSERT OR IGNORE INTO "mtmMaintenance" VALUES (14,'Revisón básica',2,6000,18,'N','N',50000,NULL,'N');
INSERT OR IGNORE INTO "mtmMaintenance" VALUES (15,'Cambio filtro de aire',2,12000,18,'N','N',50000,NULL,'N');
INSERT OR IGNORE INTO "mtmMaintenance" VALUES (16,'Revisón básica',2,6000,12,'N','N',1000,50000,'N');
INSERT OR IGNORE INTO "mtmMaintenance" VALUES (17,'Cambio filtro de aire',2,12000,18,'N','N',1000,50000,'N');
INSERT OR IGNORE INTO "mtmMaintenance" VALUES (18,'Cambio ruedas',2,30000,72,'N','Y',0,NULL,'N');
INSERT OR IGNORE INTO "mtmMaintenance" VALUES (19,'Revisón básica',2,4000,12,'N','N',0,50000,'N');
INSERT OR IGNORE INTO "mtmMaintenance" VALUES (20,'Cambio filtro aire',2,8000,18,'N','N',0,50000,'N');
INSERT OR IGNORE INTO "mtmMaintenance" VALUES (21,'Revisón básica',2,8000,18,'N','N',50000,NULL,'N');
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
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (22,14,3);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (23,14,5);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (24,14,17);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (25,15,4);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (26,16,3);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (27,16,5);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (28,16,17);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (29,17,4);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (30,18,1);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (31,18,2);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (32,18,28);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (33,18,29);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (34,19,3);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (35,19,5);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (36,19,17);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (37,20,4);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (38,21,3);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (39,21,5);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (40,21,17);
INSERT OR IGNORE INTO "mtmMaintenanceElementRel" VALUES (41,21,4);
INSERT OR IGNORE INTO "mtmConfiguration" VALUES (1,'Fabrica','Configuración de fábrica','Y');
INSERT OR IGNORE INTO "mtmConfiguration" VALUES (2,'Yamaha','Configuración de Yamaha','N');
INSERT OR IGNORE INTO "mtmConfiguration" VALUES (3,'Hyosung','Configuración Hyosung gt125r','N');
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
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (15,2,1);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (16,2,4);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (17,2,5);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (18,2,6);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (19,2,7);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (20,2,8);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (21,2,9);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (22,2,13);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (23,2,16);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (24,2,17);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (25,2,18);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (26,2,21);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (27,3,1);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (28,3,4);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (29,3,5);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (30,3,7);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (31,3,8);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (32,3,9);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (33,3,13);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (34,3,18);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (35,3,14);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (36,3,15);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (37,3,19);
INSERT OR IGNORE INTO "mtmConfigMaintenance" VALUES (38,3,20);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (1,2,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (2,2,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (3,2,11);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (4,2,17);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (5,3,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (6,3,4);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (7,3,17);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (8,3,18);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (9,4,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (10,4,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (11,4,11);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (12,4,13);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (13,4,17);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (14,5,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (15,5,4);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (16,5,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (17,5,6);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (18,5,17);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (19,5,18);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (20,6,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (21,6,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (22,6,17);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (23,6,18);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (24,7,10);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (25,8,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (26,8,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (27,8,17);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (28,8,18);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (29,9,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (30,9,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (31,9,17);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (32,9,25);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (33,11,18);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (34,13,7);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (35,13,12);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (36,14,1);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (37,16,11);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (38,16,22);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (39,17,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (40,17,4);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (41,17,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (42,17,6);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (43,17,16);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (44,17,17);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (45,18,2);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (46,20,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (47,20,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (48,22,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (49,22,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (50,25,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (51,25,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (52,26,6);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (53,27,20);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (54,27,17);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (56,28,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (57,28,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (59,28,32);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (60,29,7);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (61,29,12);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (62,30,31);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (63,31,7);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (64,31,12);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (65,33,1);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (66,37,4);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (67,37,16);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (68,37,18);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (69,42,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (70,42,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (71,42,17);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (72,44,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (73,44,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (74,44,17);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (75,45,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (76,45,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (77,45,17);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (78,46,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (79,46,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (80,46,17);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (81,47,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (82,47,4);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (83,47,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (84,47,6);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (85,47,17);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (86,47,8);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (87,50,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (88,50,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (89,50,17);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (90,50,19);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (91,52,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (92,52,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (93,52,17);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (94,52,7);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (95,52,12);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (96,57,2);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (97,62,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (98,62,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (99,62,10);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (100,62,17);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (101,62,7);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (102,62,12);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (103,63,1);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (104,65,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (105,65,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (106,65,6);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (107,65,17);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (108,75,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (109,75,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (110,75,6);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (111,75,7);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (112,75,12);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (113,75,17);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (114,75,8);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (115,75,16);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (116,75,24);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (117,77,2);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (118,87,1);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (119,88,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (120,88,4);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (121,88,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (122,88,17);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (123,96,19);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (124,100,15);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (125,102,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (126,102,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (127,102,7);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (128,102,12);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (129,102,17);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (130,106,8);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (131,106,9);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (132,107,6);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (133,108,8);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (134,110,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (135,110,4);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (136,110,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (137,110,17);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (138,114,3);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (139,114,4);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (140,114,5);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (141,114,17);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (142,121,7);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (143,121,10);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (144,121,12);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (145,122,2);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (146,122,29);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (147,124,1);
INSERT OR IGNORE INTO "mtmOpMaintElem" VALUES (148,124,28);
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
COMMIT;
