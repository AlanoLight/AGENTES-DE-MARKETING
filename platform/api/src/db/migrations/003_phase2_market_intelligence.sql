CREATE TABLE IF NOT EXISTS competitor_snapshots (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	company_id INTEGER NOT NULL,
	competitor_name TEXT NOT NULL,
	source TEXT NOT NULL,
	rating REAL,
	review_count INTEGER,
	website TEXT,
	captured_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	raw_data TEXT,
	FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS review_insights (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	company_id INTEGER NOT NULL,
	competitor_name TEXT NOT NULL,
	source TEXT NOT NULL,
	praises TEXT NOT NULL,
	complaints TEXT NOT NULL,
	general_sentiment TEXT NOT NULL,
	opportunities TEXT NOT NULL,
	review_count INTEGER NOT NULL DEFAULT 0,
	captured_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	raw_data TEXT,
	FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS strategies (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	company_id INTEGER NOT NULL,
	title TEXT NOT NULL,
	summary TEXT NOT NULL,
	source TEXT NOT NULL DEFAULT 'phase2_bootstrap',
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS content_ideas (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	company_id INTEGER NOT NULL,
	title TEXT NOT NULL,
	description TEXT,
	source TEXT NOT NULL DEFAULT 'phase2_bootstrap',
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE INDEX IF NOT EXISTS idx_competitor_snapshots_company_time
	ON competitor_snapshots(company_id, captured_at DESC);

CREATE INDEX IF NOT EXISTS idx_competitor_snapshots_company_source
	ON competitor_snapshots(company_id, source);

CREATE INDEX IF NOT EXISTS idx_review_insights_company_time
	ON review_insights(company_id, captured_at DESC);
