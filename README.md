# Neas Lernwelt

Alle Lern-Apps für Klasse 5 an einem Ort, mit Anmeldung. Der Fortschritt wird pro Kind in Supabase gespeichert und ist so auf jedem Gerät da.

| Fach | App | Datei |
|---|---|---|
| Englisch | English trainer | `englisch.html` |
| Mathe | Rechenheft | `rechenheft.html` |
| Mathe | Terme verstehen | `terme.html` |
| Biologie | Bio-Expedition | `bio-expedition.html` |
| Biologie | Expedition Pflanzenzelle | `pflanzenzelle.html` |
| Erdkunde | Atlas-Detektiv | `atlas.html` |
| Musik | Notenwerkstatt | `noten.html` |

## Einrichten (einmalig, ca. 15 Minuten)

### 1. Supabase (Konten und Datenbank)

1. Auf [supabase.com](https://supabase.com) kostenlos anmelden und ein neues Projekt anlegen (Region z. B. Frankfurt).
2. Links **SQL Editor** öffnen, den Inhalt von [`supabase/schema.sql`](supabase/schema.sql) einfügen und **Run** klicken.
3. **Authentication → Sign In / Providers → Email**: „Allow new users to sign up“ ausschalten. So kann sich niemand Fremdes ein Konto anlegen.
4. **Authentication → Users → Add user → Create new user**: für jedes Kind ein Konto anlegen.
   - E-Mail: `nea@lernwelt.local` (der Teil vor dem @ ist der Anmeldename)
   - Passwort: frei wählen
   - **Auto Confirm User** anhaken
5. **Project Settings → API** (bzw. „Data API“ und „API Keys“): die **Project URL** und den **anon / public** Key kopieren.

### 2. Vercel (Hosting)

1. Auf [vercel.com](https://vercel.com) mit GitHub anmelden, **Add New → Project** und das Repo `nea-lernwelt` importieren.
2. Framework Preset: **Other**. Build-Einstellungen leer lassen.
3. Unter **Environment Variables** eintragen:
   - `SUPABASE_URL` = die Project URL
   - `SUPABASE_ANON_KEY` = der anon / public Key
4. **Deploy** klicken. Danach kann sich Nea auf der Vercel-Adresse mit Name `nea` und Passwort anmelden.

## So funktioniert es

- Die Apps sind unverändert und speichern ihren Stand wie bisher im Browser (`localStorage`).
- `sync.js` wird in jede Seite geladen. Nach dem Login holt es den Stand aus Supabase, schickt jede Änderung gebündelt zurück und sichert beim Verlassen der Seite den letzten Stand. Pro gespeichertem Wert gewinnt der neueste.
- Meldet sich am selben Gerät ein anderes Kind an, wird der lokale Stand vorher geleert.
- `api/config.js` gibt die Supabase-Adresse und den öffentlichen Key aus den Vercel-Variablen aus. Der Key darf öffentlich sein: Durch Row Level Security sieht jedes Kind nur seine eigenen Daten.
- Ohne Anmeldung leitet jede App auf die Startseite um.

## Eine neue App hinzufügen

1. Die HTML-Datei ins Repo legen.
2. Direkt nach `<meta charset=...>` diese drei Zeilen einfügen:
   ```html
   <script src="/api/config"></script>
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js"></script>
   <script src="/sync.js"></script>
   ```
3. Für den Zurück-Knopf die `lw-bar`-Leiste aus einer der vorhandenen Apps direkt nach `<body>` kopieren.
4. In `index.html` die App in die Liste `APPS` eintragen. Wenn die App etwas in `localStorage` speichert, den Schlüssel als `key` angeben, dann zeigt die Startseite „angefangen“ an.
