-- Tabella prodotti (catalogo farm, non shop)
CREATE TABLE IF NOT EXISTS prodotti (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  titolo       text        NOT NULL,
  descrizione  text,
  categoria    text,
  image_url    text,
  in_evidenza  boolean     NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE prodotti ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read prodotti"
  ON prodotti FOR SELECT USING (true);

CREATE POLICY "admin write prodotti"
  ON prodotti FOR ALL USING (auth.role() = 'authenticated');

-- Tabella galleria
CREATE TABLE IF NOT EXISTS galleria (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  url        text        NOT NULL,
  caption    text,
  ordine     int         NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE galleria ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read galleria"
  ON galleria FOR SELECT USING (true);

CREATE POLICY "admin write galleria"
  ON galleria FOR ALL USING (auth.role() = 'authenticated');

-- Storage bucket per galleria
INSERT INTO storage.buckets (id, name, public)
VALUES ('galleria', 'galleria', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public read galleria storage"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'galleria');

CREATE POLICY "auth write galleria storage"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'galleria' AND auth.role() = 'authenticated');
