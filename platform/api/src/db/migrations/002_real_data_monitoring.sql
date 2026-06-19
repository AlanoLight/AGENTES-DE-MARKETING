CREATE TABLE IF NOT EXISTS data_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  competitor_id INTEGER,
  snapshot_type TEXT NOT NULL,
  source TEXT NOT NULL,
  source_ref TEXT,
  metrics_json TEXT NOT NULL,
  raw_json TEXT,
  snapshot_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (competitor_id) REFERENCES competitors(id)
);

CREATE TABLE IF NOT EXISTS temporal_comparisons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  competitor_id INTEGER,
  metric_name TEXT NOT NULL,
  value_previous REAL,
  value_current REAL,
  delta_abs REAL,
  delta_pct REAL,
  period_previous TEXT,
  period_current TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (competitor_id) REFERENCES competitors(id)
);

CREATE TABLE IF NOT EXISTS external_collection_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  run_type TEXT NOT NULL,
  status TEXT NOT NULL,
  details TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE INDEX IF NOT EXISTS idx_data_snapshots_company_time ON data_snapshots(company_id, snapshot_at DESC);
CREATE INDEX IF NOT EXISTS idx_data_snapshots_competitor_time ON data_snapshots(competitor_id, snapshot_at DESC);
CREATE INDEX IF NOT EXISTS idx_temporal_comparisons_company_time ON temporal_comparisons(company_id, created_at DESC);
