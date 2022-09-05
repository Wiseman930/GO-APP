-- Table: public.reg_plates

-- DROP TABLE IF EXISTS public.reg_plates;

CREATE TABLE IF NOT EXISTS public.reg_plates
(
    id integer NOT NULL,
    reg_numbers text  NOT NULL,
    CONSTRAINT reg_plates_pkey PRIMARY KEY (id),
	FOREIGN KEY (id_town) REFERENCES registration_towns(id_town)
)

-- Table: public.registration_towns

-- DROP TABLE IF EXISTS public.registration_towns;

CREATE TABLE IF NOT EXISTS public.registration_towns
(
    my_town_name text NOT NULL,
    town_code text NOT NULL,
    id integer NOT NULL,
    CONSTRAINT registration_towns_pkey PRIMARY KEY (id)
)

INSERT INTO public.registration_towns(
	my_town_name, town_code, id)
	VALUES ('Cape Town', 'CA', 1);
INSERT INTO public.registration_towns(
	my_town_name, town_code, id)
	VALUES ('Paarl', 'CL', 2);
INSERT INTO public.registration_towns(
	my_town_name, town_code, id)
	VALUES ('George', 'CJ', 3);
INSERT INTO public.registration_towns(
	my_town_name, town_code, id)
	VALUES ('Stellenbosch', 'CK', 3);