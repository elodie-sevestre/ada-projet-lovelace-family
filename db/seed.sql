-- Insérer des données dans les tables pour pouvoir tester :

--Insérer des users :

INSERT INTO users (role, name, mail, tribe_name, password_hash, total_points, created_at, updated_at) VALUES
  ('ADMIN', 'Bernard', 'bernard@aol.com','la_tribu_de_bernard',  '$2b$10$.7Gblwg5ynJtnxyDHzNHwuWytMkZzY5DT6TSYy/0HTfhJWGtRT3QK', 0, NOW(), NOW()),
  ('MEMBER', 'Léa', 'lillychat@gmail.fr', 'la_tribu_de_bernard', '$2b$10$oXzI5XjQeWyTkWka2A2utedMvLrCJ.tREKp3iW9FSnXKDNWxEfH86', 0, NOW(), NOW());
  
--Insérer des tâches :
INSERT INTO tasks (name, status, points, created_at, updated_at) VALUES
  ('Faire la vaisselle', 'A_FAIRE', 5, NOW(), NOW()),
  ('Nettoyage de printemps de la chambre', 'A_FAIRE', 15,NOW(), NOW() ),
  ('Déclarer les impôts', 'A_FAIRE', 30, NOW(), NOW()),
  ('Faire la liste des courses', 'A_FAIRE', 5, NOW(), NOW()),
  ('Passer la serpillière', 'TERMINE', 10, NOW(), NOW());

--Insérer des users-tasks : (tables de liaison)

INSERT INTO users_tasks (user_id, task_id) VALUES
  (1, 3),
  (1, 4),
  (1, 5),
  (2, 1),
  (2, 2);