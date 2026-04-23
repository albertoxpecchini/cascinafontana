-- ── listings ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS listings (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text        NOT NULL,
  price       numeric     NOT NULL DEFAULT 0,
  description text,
  category    text,
  image_url   text,
  status      text        NOT NULL DEFAULT 'available',
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read listings"
  ON listings FOR SELECT USING (true);

CREATE POLICY "admin write listings"
  ON listings FOR ALL USING (auth.role() = 'authenticated');

-- ── updates ──────────────────────────────────────────────────────────────────
-- Aggiunge id se la tabella esiste già senza di esso
ALTER TABLE updates ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid();

-- Assegna id agli eventuali record già presenti
UPDATE updates SET id = gen_random_uuid() WHERE id IS NULL;

CREATE TABLE IF NOT EXISTS updates (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text,
  description text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read updates"
  ON updates FOR SELECT USING (true);

CREATE POLICY "admin write updates"
  ON updates FOR ALL USING (auth.role() = 'authenticated');

-- ── storage bucket shop ───────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('shop', 'shop', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public read shop storage"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'shop');

CREATE POLICY "auth upload shop storage"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'shop' AND auth.role() = 'authenticated');

CREATE POLICY "auth delete shop storage"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'shop' AND auth.role() = 'authenticated');
