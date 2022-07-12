DROP TABLE IF EXISTS "tables";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "public"."tables" (
    "table_id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "region_id" uuid NOT NULL,
    "capacity" integer DEFAULT '1' NOT NULL,
    CONSTRAINT "table_pkey" PRIMARY KEY ("table_id"),
    CONSTRAINT "fk_region"
        FOREIGN KEY("region_id") 
	    REFERENCES "regions"("region_id")
) WITH (oids = false);


INSERT INTO "tables" ("region_id", "capacity")
    VALUES 
    ('4594a574-8419-4e28-a1f1-ac6af70b0e53', '2'), 
    ('4594a574-8419-4e28-a1f1-ac6af70b0e53', '2'), 
    ('4594a574-8419-4e28-a1f1-ac6af70b0e53', '2'), 
    ('4594a574-8419-4e28-a1f1-ac6af70b0e53', '2'), 
    ('4594a574-8419-4e28-a1f1-ac6af70b0e53', '4'), 
    ('4594a574-8419-4e28-a1f1-ac6af70b0e53', '4'), 
    ('4594a574-8419-4e28-a1f1-ac6af70b0e53', '8'),
    ('1d7575e8-951b-4198-a479-e6bb7dd6e460', '2'), 
    ('1d7575e8-951b-4198-a479-e6bb7dd6e460', '2'), 
    ('1d7575e8-951b-4198-a479-e6bb7dd6e460', '2'), 
    ('1d7575e8-951b-4198-a479-e6bb7dd6e460', '4'), 
    ('1d7575e8-951b-4198-a479-e6bb7dd6e460', '8'),
    ('5d25c32f-6902-4447-bef7-1a74a3c6e0ec', '2'), 
    ('5d25c32f-6902-4447-bef7-1a74a3c6e0ec', '2'), 
    ('5d25c32f-6902-4447-bef7-1a74a3c6e0ec', '2'), 
    ('5d25c32f-6902-4447-bef7-1a74a3c6e0ec', '2'), 
    ('5d25c32f-6902-4447-bef7-1a74a3c6e0ec', '4'), 
    ('5d25c32f-6902-4447-bef7-1a74a3c6e0ec', '4'), 
    ('5d25c32f-6902-4447-bef7-1a74a3c6e0ec', '8');

INSERT INTO "tables" ("table_id", "region_id", "capacity")
    VALUES
    ('58c5adb1-cb68-49b7-84b7-3487af043e35', '1d7575e8-951b-4198-a479-e6bb7dd6e460', '2'), 
    ('15bce756-7649-4414-b0a9-39cf4c06e710', '1d7575e8-951b-4198-a479-e6bb7dd6e460', '4');

DROP TABLE IF EXISTS "reservation_tables";

CREATE TABLE "public"."reservation_tables" (
    "reservation_id" uuid NOT NULL,
    "table_id" uuid NOT NULL,
    "reservation_date" timestamptz NOT NULL,
    CONSTRAINT "reservation_tables_pkey" PRIMARY KEY ("reservation_id", "table_id"),
    CONSTRAINT "fk_table"
        FOREIGN KEY("table_id") 
	    REFERENCES "tables"("table_id"),
    CONSTRAINT "fk_reservation"
        FOREIGN KEY("reservation_id") 
	    REFERENCES "reservations"("reservation_id") ON DELETE CASCADE
) WITH (oids = false);

INSERT INTO "reservation_tables" ("reservation_id", "table_id", "reservation_date")
    VALUES 
    ('336bd3ab-1039-4f13-a60e-8a25e748bf9f', '58c5adb1-cb68-49b7-84b7-3487af043e35', '2022-06-01 12:00:00.000000+00'),
    ('336bd3ab-1039-4f13-a60e-8a25e748bf9f', '15bce756-7649-4414-b0a9-39cf4c06e710', '2022-06-01 12:00:00.000000+00');