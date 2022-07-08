DROP TABLE IF EXISTS "reservations";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- DROP SEQUENCE IF EXISTS reservations_reservation_id_seq;
CREATE SEQUENCE reservations_reservation_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."reservations" (
    "reservation_id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "reservation_date" timestamptz NOT NULL,
    "region_id" uuid NOT NULL,
    "first_name" text NOT NULL,
    "last_name" text NOT NULL,
    "phone_number" text NOT NULL,
    "num_people" integer DEFAULT '1' NOT NULL,
    "num_children" integer DEFAULT '0' NOT NULL,
    "is_smoker" boolean DEFAULT false NOT NULL,
    "is_birthday" boolean DEFAULT false NOT NULL,
    CONSTRAINT "reservations_pkey" PRIMARY KEY ("reservation_id")
) WITH (oids = false);

INSERT INTO "reservations" ("reservation_date", "region_id", "first_name", "last_name", "phone_number", "num_people", "num_children", "is_smoker", "is_birthday") VALUES ('2022-06-01 12:00:00.000000+00',	'1d7575e8-951b-4198-a479-e6bb7dd6e460',	'James',	'Handerson',	'+12341231000',	6,	2,	'0',	'1'), ('2022-01-01 00:00:00.123456+00',	'4594a574-8419-4e28-a1f1-ac6af70b0e53',	'Justin',	'Case',	'+12341231004',	2,	0,	'1',	'0'), ('2022-06-06 12:00:00.000000+00',	'1d7575e8-951b-4198-a479-e6bb7dd6e460',	'Ernest',	'Ventura',	'+12341231234',	2,	2,	'0',	'0');
