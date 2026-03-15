-- ============================================================
-- VGE - Seed data : restaurant de démo
-- ============================================================

-- Insert tenant démo
INSERT INTO tenants (id, slug, name, email, phone, description, status)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'chez-demo',
  'Chez Démo',
  'demo@vge.gp',
  '+590 690 00 00 00',
  'Restaurant de démonstration — Cuisine antillaise traditionnelle',
  'active'
);

-- Insert tenant config démo
INSERT INTO tenant_config (tenant_id, primary_color, secondary_color, accent_color, opening_hours, pickup_slots)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '#FF6B35',
  '#2EC4B6',
  '#3D8B37',
  '{
    "monday": {"open": "11:00", "close": "14:30", "closed": false},
    "tuesday": {"open": "11:00", "close": "14:30", "closed": false},
    "wednesday": {"open": "11:00", "close": "14:30", "closed": false},
    "thursday": {"open": "11:00", "close": "14:30", "closed": false},
    "friday": {"open": "11:00", "close": "14:30", "closed": false},
    "saturday": {"open": "11:00", "close": "15:00", "closed": false},
    "sunday": {"open": "11:00", "close": "14:00", "closed": false}
  }',
  '["11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15"]'
);

-- Insert loyalty config démo
INSERT INTO loyalty_config (tenant_id, points_per_euro, min_points_redeem, is_active)
VALUES ('00000000-0000-0000-0000-000000000001', 1.0, 50, TRUE);

-- Insert catégories menu démo
INSERT INTO menus (id, tenant_id, name, description, sort_order)
VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Entrées', 'Pour commencer en beauté', 1),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Plats', 'Nos spécialités antillaises', 2),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Desserts', 'Les douceurs de nos îles', 3),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Boissons', 'Pour accompagner votre repas', 4);

-- Insert plats démo
INSERT INTO menu_items (tenant_id, menu_id, name, description, price, sort_order)
VALUES
  -- Entrées
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
   'Accras de morue', 'Beignets de morue croustillants, sauce chien maison', 8.50, 1),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
   'Boudin créole', 'Boudin noir épicé de Guadeloupe, sauce piment doux', 7.00, 2),
  -- Plats
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002',
   'Colombo de poulet', 'Poulet mijoté aux épices colombo, riz créole, légumes pays', 13.50, 1),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002',
   'Blaff de poisson', 'Poisson frais en court-bouillon parfumé, banane verte', 15.00, 2),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002',
   'Poulet boucané', 'Poulet fumé au bois de laurier, sauce créole, riz et pois', 14.00, 3),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002',
   'Langouste grillée', 'Langouste des Antilles, beurre citron-ciboulette, riz créole', 29.00, 4),
  -- Desserts
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003',
   'Tourment d''amour', 'Gâteau à la noix de coco des Saintes, sirop de canne', 5.50, 1),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003',
   'Blanc-manger coco', 'Flan coco onctueux, coulis de fruit de la passion', 5.00, 2),
  -- Boissons
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004',
   'Ti Punch', 'Rhum agricole, citron vert, sucre de canne', 4.50, 1),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004',
   'Jus de fruit frais', 'Goyave, maracudja, chadek — fait maison', 3.50, 2),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004',
   'Punch planteur', 'Mélange de rhums, jus de fruits exotiques, grenadine', 5.00, 3);

-- Insert récompenses fidélité démo
INSERT INTO loyalty_rewards (tenant_id, name, description, points_required, reward_type, reward_value)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Réduction 5€', '5€ de réduction sur votre commande', 50, 'discount_fixed', 5.00),
  ('00000000-0000-0000-0000-000000000001', 'Réduction 10€', '10€ de réduction sur votre commande', 100, 'discount_fixed', 10.00),
  ('00000000-0000-0000-0000-000000000001', 'Réduction 10%', '10% de réduction sur votre commande', 75, 'discount_percent', 10.00);
