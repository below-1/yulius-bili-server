SET foreign_key_checks = 0;
drop table if exists rekam_medik_gejala;
drop table if exists rekam_medik;
drop table if exists gejala;
drop table if exists penyakit;
SET foreign_key_checks = 1;

create table gejala (
  id integer auto_increment primary key,
  bobot float not null,
  nama text
);

create table penyakit (
  id integer auto_increment primary key,
  nama text
);

create table rekam_medik (
  id integer auto_increment primary key,
  id_penyakit integer not null,
  nama_pasien varchar(255) not null,
  waktu datetime default NOW(),
  solusi text not null,
  status text not null
);

create table rekam_medik_gejala (
  id_rekam_medik integer not null,
  id_gejala integer not null
);


alter table rekam_medik_gejala
  add constraint rm_gj_gj foreign key (id_gejala)
  references gejala (id)
  on delete cascade;

alter table rekam_medik_gejala
  add constraint rm_gj_rm foreign key (id_rekam_medik)
  references rekam_medik (id)
  on delete cascade;

alter table rekam_medik
  add constraint rm_penyakit foreign key (id_penyakit)
  references penyakit (id)
  on delete cascade;

insert into gejala (id, nama, bobot) values 
  (1, "g1", 0.3),
  (2, "g2", 0.9),
  (3, "g3", 1),
  (4, "g4", 1), 
  (5, "g5", 0.8),
  (6, "g6", 1),
  (7, "g7", 0.8),
  (8, "g8", 0.8),
  (9, "g9", 0.5),
  (10, "g10", 0.2),
  (11, "g11", 1),
  (12, "g12", 0.5),
  (13, "g13", 1),
  (14, "g14", 0.5),
  (15, "g15", 1),
  (16, "g16", 1),
  (17, "g17", 0.4),
  (18, "g18", 1),
  (19, "g19", 1),
  (20, "g20", 1),
  (21, "g21", 0.5),
  (22, "g22", 0.1),
  (23, "g23", 1),
  (24, "g24", 1),
  (25, "g25", 0.8),
  (26, "g26", 0.9);

insert into penyakit (id, nama) 
    values (1, "p1"), (2, "p2"), (3, "p3"), (4, "p4"), (5, "p5");

insert into rekam_medik (id, id_penyakit, nama_pasien, waktu, solusi, status)
    values
    (1, 1, "pasien_1", "2018-09-09 15:00", "solusi rekam medik 1", "kasus"),
    (2, 2, "pasien_2", "2018-08-08 15:00", "solusi rekam medik 2", "kasus"),
    (3, 2, "pasien_3", "2018-07-07 15:00", "solusi rekam medik 3", "kasus"),
    (4, 3, "pasien_4", "2018-11-11 15:00", "solusi rekam medik 4", "kasus"),
    (5, 4, "pasien_4", "2018-12-12 15:00", "solusi rekam medik 5", "kasus"),
    (6, 5, "pasien_4", "2018-01-04 15:00", "solusi rekam medik 6", "kasus"),
    (7, 5, "pasien_4", "2018-03-04 15:00", "solusi rekam medik 7", "kasus"),
    (8, 5, "pasien_4", "2018-03-04 10:00", "solusi rekam medik 8", "revisi");

insert into rekam_medik_gejala (id_rekam_medik, id_gejala) values
    (1, 1),
    (1, 3),
    (1, 5),
    (1, 7),
    (2, 1),
    (2, 16),
    (2, 17),
    (2, 23),
    (3, 15),
    (3, 16),
    (3, 23),
    (3, 26),
    (4, 2),
    (4, 8),
    (4, 11),
    (5, 2),
    (5, 10),
    (5, 13),
    (5, 14),
    (6, 9),
    (6, 17),
    (6, 19),
    (6, 21),
    (6, 22),
    (7, 17),
    (7, 20),
    (7, 21);