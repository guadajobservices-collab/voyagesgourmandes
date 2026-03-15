-- ============================================================
-- VGE - Voyage Gourmand Express
-- Migration initiale : schema multi-tenant avec RLS
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: tenants (restaurants)
-- ============================================================
CREATE TABLE tenants (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug         TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  description  TEXT,
  status       TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  stripe_account_id TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: tenant_config (branding et configuration)
-- ============================================================
CREATE TABLE tenant_config (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  logo_url        TEXT,
  primary_color   TEXT NOT NULL DEFAULT '#FF6B6B',
  secondary_color TEXT NOT NULL DEFAULT '#4ECDC4',
  accent_color    TEXT NOT NULL DEFAULT '#45B7D1',
  hero_image_url  TEXT,
  opening_hours   JSONB NOT NULL DEFAULT '{}',
  pickup_slots    JSONB NOT NULL DEFAULT '[]',
  whatsapp_number TEXT,
  meta_description TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id)
);

-- ============================================================
-- TABLE: profiles (extension de auth.users)
-- ============================================================
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id   UUID REFERENCES tenants(id) ON DELETE SET NULL,
  role        TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'restaurateur', 'admin')),
  full_name   TEXT,
  phone       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: menus (catégories)
-- ============================================================
CREATE TABLE menus (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: menu_items (plats)
-- ============================================================
CREATE TABLE menu_items (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id    UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  menu_id      UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  price        NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  photo_url    TEXT,
  sort_order   INT NOT NULL DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  allergens    TEXT[] DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: orders (commandes)
-- ============================================================
CREATE TABLE orders (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name       TEXT NOT NULL,
  customer_email      TEXT NOT NULL,
  customer_phone      TEXT,
  status              TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'paid', 'preparing', 'ready', 'picked_up', 'cancelled')),
  total_amount        NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  notes               TEXT,
  pickup_slot         TEXT,
  stripe_payment_id   TEXT,
  stripe_session_id   TEXT,
  loyalty_points_used INT NOT NULL DEFAULT 0,
  loyalty_points_earned INT NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: order_items (lignes de commande)
-- ============================================================
CREATE TABLE order_items (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id       UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  tenant_id      UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  menu_item_id   UUID NOT NULL REFERENCES menu_items(id) ON DELETE RESTRICT,
  name           TEXT NOT NULL,
  unit_price     NUMERIC(10, 2) NOT NULL,
  quantity       INT NOT NULL CHECK (quantity > 0),
  subtotal       NUMERIC(10, 2) NOT NULL,
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: loyalty_points (solde et historique)
-- ============================================================
CREATE TABLE loyalty_points (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id    UUID REFERENCES orders(id) ON DELETE SET NULL,
  points      INT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('earned', 'redeemed', 'expired', 'bonus')),
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(customer_id, tenant_id, order_id, type)
);

-- ============================================================
-- TABLE: loyalty_rewards (catalogue récompenses)
-- ============================================================
CREATE TABLE loyalty_rewards (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  description         TEXT,
  points_required     INT NOT NULL CHECK (points_required > 0),
  reward_type         TEXT NOT NULL CHECK (reward_type IN ('discount_fixed', 'discount_percent', 'free_item')),
  reward_value        NUMERIC(10, 2) NOT NULL,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: loyalty_config (configuration par restaurant)
-- ============================================================
CREATE TABLE loyalty_config (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  points_per_euro     NUMERIC(5, 2) NOT NULL DEFAULT 1.0,
  min_points_redeem   INT NOT NULL DEFAULT 100,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id)
);

-- ============================================================
-- TRIGGERS: updated_at automatique
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tenant_config_updated_at BEFORE UPDATE ON tenant_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER menus_updated_at BEFORE UPDATE ON menus
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER menu_items_updated_at BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER loyalty_rewards_updated_at BEFORE UPDATE ON loyalty_rewards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER loyalty_config_updated_at BEFORE UPDATE ON loyalty_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE on auth.users insert
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, role, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_config ENABLE ROW LEVEL SECURITY;

-- Helper function: get current user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: get current user tenant_id
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- --- TENANTS ---
CREATE POLICY "tenants_public_read" ON tenants
  FOR SELECT USING (status = 'active');

CREATE POLICY "tenants_admin_all" ON tenants
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "tenants_owner_update" ON tenants
  FOR UPDATE USING (id = get_user_tenant_id() AND get_user_role() = 'restaurateur');

-- --- TENANT_CONFIG ---
CREATE POLICY "tenant_config_public_read" ON tenant_config
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM tenants WHERE tenants.id = tenant_config.tenant_id AND tenants.status = 'active')
  );

CREATE POLICY "tenant_config_owner_all" ON tenant_config
  FOR ALL USING (
    tenant_id = get_user_tenant_id() AND get_user_role() = 'restaurateur'
  );

CREATE POLICY "tenant_config_admin_all" ON tenant_config
  FOR ALL USING (get_user_role() = 'admin');

-- --- PROFILES ---
CREATE POLICY "profiles_own" ON profiles
  FOR ALL USING (id = auth.uid());

CREATE POLICY "profiles_admin_all" ON profiles
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "profiles_restaurateur_read_clients" ON profiles
  FOR SELECT USING (
    get_user_role() = 'restaurateur'
    AND tenant_id = get_user_tenant_id()
  );

-- --- MENUS ---
CREATE POLICY "menus_public_read" ON menus
  FOR SELECT USING (
    is_active = TRUE
    AND EXISTS (SELECT 1 FROM tenants WHERE tenants.id = menus.tenant_id AND tenants.status = 'active')
  );

CREATE POLICY "menus_owner_all" ON menus
  FOR ALL USING (
    tenant_id = get_user_tenant_id() AND get_user_role() = 'restaurateur'
  );

CREATE POLICY "menus_admin_all" ON menus
  FOR ALL USING (get_user_role() = 'admin');

-- --- MENU_ITEMS ---
CREATE POLICY "menu_items_public_read" ON menu_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM tenants WHERE tenants.id = menu_items.tenant_id AND tenants.status = 'active')
  );

CREATE POLICY "menu_items_owner_all" ON menu_items
  FOR ALL USING (
    tenant_id = get_user_tenant_id() AND get_user_role() = 'restaurateur'
  );

CREATE POLICY "menu_items_admin_all" ON menu_items
  FOR ALL USING (get_user_role() = 'admin');

-- --- ORDERS ---
CREATE POLICY "orders_customer_own" ON orders
  FOR ALL USING (customer_id = auth.uid());

CREATE POLICY "orders_restaurateur_own_tenant" ON orders
  FOR ALL USING (
    tenant_id = get_user_tenant_id() AND get_user_role() = 'restaurateur'
  );

CREATE POLICY "orders_admin_all" ON orders
  FOR ALL USING (get_user_role() = 'admin');

-- allow anonymous inserts (guests can order)
CREATE POLICY "orders_insert_public" ON orders
  FOR INSERT WITH CHECK (TRUE);

-- --- ORDER_ITEMS ---
CREATE POLICY "order_items_customer_read" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid())
  );

CREATE POLICY "order_items_restaurateur_read" ON order_items
  FOR SELECT USING (
    tenant_id = get_user_tenant_id() AND get_user_role() = 'restaurateur'
  );

CREATE POLICY "order_items_admin_all" ON order_items
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "order_items_insert_public" ON order_items
  FOR INSERT WITH CHECK (TRUE);

-- --- LOYALTY_POINTS ---
CREATE POLICY "loyalty_points_customer_own" ON loyalty_points
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "loyalty_points_restaurateur_read" ON loyalty_points
  FOR SELECT USING (
    tenant_id = get_user_tenant_id() AND get_user_role() = 'restaurateur'
  );

CREATE POLICY "loyalty_points_system_insert" ON loyalty_points
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "loyalty_points_admin_all" ON loyalty_points
  FOR ALL USING (get_user_role() = 'admin');

-- --- LOYALTY_REWARDS ---
CREATE POLICY "loyalty_rewards_public_read" ON loyalty_rewards
  FOR SELECT USING (
    is_active = TRUE
    AND EXISTS (SELECT 1 FROM tenants WHERE tenants.id = loyalty_rewards.tenant_id AND tenants.status = 'active')
  );

CREATE POLICY "loyalty_rewards_owner_all" ON loyalty_rewards
  FOR ALL USING (
    tenant_id = get_user_tenant_id() AND get_user_role() = 'restaurateur'
  );

CREATE POLICY "loyalty_rewards_admin_all" ON loyalty_rewards
  FOR ALL USING (get_user_role() = 'admin');

-- --- LOYALTY_CONFIG ---
CREATE POLICY "loyalty_config_public_read" ON loyalty_config
  FOR SELECT USING (TRUE);

CREATE POLICY "loyalty_config_owner_all" ON loyalty_config
  FOR ALL USING (
    tenant_id = get_user_tenant_id() AND get_user_role() = 'restaurateur'
  );

CREATE POLICY "loyalty_config_admin_all" ON loyalty_config
  FOR ALL USING (get_user_role() = 'admin');

-- ============================================================
-- INDEXES pour performance
-- ============================================================
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenant_config_tenant_id ON tenant_config(tenant_id);
CREATE INDEX idx_profiles_tenant_id ON profiles(tenant_id);
CREATE INDEX idx_menus_tenant_id ON menus(tenant_id);
CREATE INDEX idx_menu_items_menu_id ON menu_items(menu_id);
CREATE INDEX idx_menu_items_tenant_id ON menu_items(tenant_id);
CREATE INDEX idx_orders_tenant_id ON orders(tenant_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_loyalty_points_customer_tenant ON loyalty_points(customer_id, tenant_id);
CREATE INDEX idx_loyalty_rewards_tenant_id ON loyalty_rewards(tenant_id);
