

-- Table: public.registration_towns

-- DROP TABLE IF EXISTS public.registration_towns;

CREATE TABLE IF NOT EXISTS public.registration_towns
(
    my_town_name text NOT NULL,
    town_code text NOT NULL,
    id serial NOT NULL primary key

);

-- INSERT INTO public.registration_towns(
--	my_town_name, town_code, id)
--	VALUES ('Cape Town', 'CA', 1);
--INSERT INTO public.registration_towns(
--	my_town_name, town_code, id)
--	VALUES ('Paarl', 'CL', 2);
--INSERT INTO public.registration_towns(
--	my_town_name, town_code, id)
--	VALUES ('George', 'CJ', 3);
--INSERT INTO public.registration_towns(
--	my_town_name, town_code, id)
--	VALUES ('Stellenbosch', 'CK', 4);

-- Table: public.reg_plates

-- DROP TABLE IF EXISTS public.reg_plates;

create table reg_plates (
	id serial not null primary key,
	reg_numbers varchar(100) not null,
	mytown_key int,
FOREIGN KEY (mytown_key) REFERENCES registration_towns(id)
);