-- Insérer des données dans les tables pour pouvoir tester :

--Insérer des users :

INSERT INTO users (role, name, mail, password, total_points, created_at, updated_at) VALUES
  ('admin', 'Bernard', 'bernard@aol.com', 'lemotdepasse', 0, NOW(), NOW()),
  ('member', 'Léa', 'lillychat@gmail.fr', 'kawai3000', 0, NOW(), NOW());
  
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