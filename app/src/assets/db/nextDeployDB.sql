**->nextDeployDB_v2.1.1**>
**->nextDeployDB_v2.1.2**>
update mtmConfiguration set name='PRODUCTION', description='PRODUCTION_SETUP' where id=1;
INSERT OR IGNORE INTO "mtmSystemConfiguration" VALUES (2,'configDistance','KM','2006-09-12 12:32:00');
INSERT OR IGNORE INTO "mtmSystemConfiguration" VALUES (3,'configMoney','EURO','2006-09-12 12:32:00');