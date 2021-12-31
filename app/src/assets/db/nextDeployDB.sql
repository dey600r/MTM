**->nextDeployDB_v2.1.1**>
**->nextDeployDB_v2.1.2**>
update mtmConfiguration set name='PRODUCTION', description='PRODUCTION_SETUP' where id=1;
INSERT OR IGNORE INTO "mtmSystemConfiguration" VALUES (2,'configDistance','KM','2006-09-12 12:32:00');
INSERT OR IGNORE INTO "mtmSystemConfiguration" VALUES (3,'configMoney','EURO','2006-09-12 12:32:00');
**->nextDeployDB_v2.1.3**>
alter table "mtmVehicle" add "active" TEXT not null default 'Y';
**->nextDeployDB_v2.2.0**>
alter table "mtmOpMaintElem" add "price" REAL NOT NULL DEFAULT 0;
**->nextDeployDB_v3.0.0**>
**->nextDeployDB_v3.0.1**>
**->nextDeployDB_v3.1.0**>
INSERT OR IGNORE INTO "mtmSystemConfiguration" VALUES (4,'configTheme','L','2006-09-12 12:32:00');
**->nextDeployDB_v3.2.0**>
**->nextDeployDB_v3.3.0**>
INSERT OR IGNORE INTO "mtmSystemConfiguration" VALUES (5,'configPrivacy','N','2006-09-12 12:32:00');
INSERT OR IGNORE INTO "mtmSystemConfiguration" VALUES (6,'configSyncEmail','','2006-09-12 12:32:00');