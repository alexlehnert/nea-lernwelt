// Gibt die öffentliche Supabase-Konfiguration aus den Vercel-Umgebungsvariablen
// als kleines Skript aus. Der anon-Key ist öffentlich gedacht; geschützt werden
// die Daten durch Row Level Security (siehe supabase/schema.sql).
module.exports = (req, res) => {
  const cfg = {
    url: process.env.SUPABASE_URL || '',
    key: process.env.SUPABASE_ANON_KEY || ''
  };
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end('window.LW_CONFIG=' + JSON.stringify(cfg) + ';');
};
