DROP TABLE IF EXISTS "regions";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "public"."regions" (
    "region_id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "name" text NOT NULL,
    "for_children" boolean DEFAULT false NOT NULL,
    "for_smokers" boolean DEFAULT false NOT NULL,
    CONSTRAINT "region_pkey" PRIMARY KEY ("region_id")
) WITH (oids = false);

INSERT INTO "regions" ("region_id", "name", "for_children", "for_smokers") 
VALUES ('4594a574-8419-4e28-a1f1-ac6af70b0e53', 'Smoking region', '0', '1'),
    ('1d7575e8-951b-4198-a479-e6bb7dd6e460', 'Children region', '1', '0'),
    ('5d25c32f-6902-4447-bef7-1a74a3c6e0ec', 'Main region', '0', '0')
