/*
 * Katalog der Lernwelt: alle Fächer und Lernhefte.
 * Ein neues Heft = ein neuer Eintrag in HEFTE. Ein Fach taucht auf der Startseite auf,
 * sobald es mindestens ein Heft hat.
 *
 * Felder eines Hefts:
 *   id     Dateiname ohne .html
 *   fach   id aus FAECHER
 *   thema  Überschrift, unter der das Heft im Fach steht
 *   name, info  Titel und eine Zeile Beschreibung
 *   key    localStorage-Schlüssel der App (optional); ist er gesetzt, gilt das Heft als „angefangen“
 *   kapitel  was im Heft drin ist, in der Reihenfolge der App. Die Namen müssen zu dem passen, was die App
 *            über LW.kapitel meldet (Skript am Ende der App-Datei).
 *   anker    optional: Abschnitts-ids der App, damit die Lernwelt direkt ins Kapitel springt
 *   abzeichen  Name des Abzeichens, das es gibt, wenn alle Kapitel 3 Sterne haben
 *   stufe  für welche Klassenstufe das Heft ist (id aus LW_STUFEN, ohne Angabe 'gym5')
 *   bald   optional: Heft ist angekündigt, aber noch nicht fertig (dann ohne App-Datei)
 *   teilt  optional: die App teilt ihren Speicher mit anderen Heften; Zurücksetzen setzt dann nur die Marke <id>-zuruecksetzen
 *   entdecken  optional {a, t, s}: Kachel „Entdecken“ auf der Heft-Seite (Anker a in der App, Titel, eine Zeile), ohne Sterne
 *   test   optional {a, kap, s}: Kachel „Großer Test“ (Anker a; kap = Name, unter dem die App den Test meldet; zählt nicht als Kapitel)
 *   von    optional: Heft war früher Teil von Heft <von>; dessen Kapitel-Fortschritt wird einmal (per Kapitelname) übernommen
 */
// Klassenstufen. Jedes Kind sieht nur die Hefte seiner Stufe (einstellbar im Eltern-Bereich).
window.LW_STUFEN = [
  { id: 'gym5', name: 'Klasse 5', lang: 'Gymnasium, Klasse 5' },
  { id: 'gs3',  name: 'Klasse 3', lang: 'Grundschule, Klasse 3', gross: true }
];
// Welche Stufe ein Kind hat, solange im Eltern-Bereich nichts anderes eingestellt ist (Anmeldename → Stufe)
window.LW_KINDER = { nea: 'gym5', rubie: 'gs3' };

window.LW_FAECHER = [
  { id: 'mathe',    cls: 'ma',  name: 'Mathe' },
  { id: 'englisch', cls: 'en',  name: 'Englisch' },
  { id: 'biologie', cls: 'bio', name: 'Biologie' },
  { id: 'erdkunde', cls: 'geo', name: 'Erdkunde' },
  { id: 'musik',    cls: 'mu',  name: 'Musik' },
  { id: 'deutsch',  cls: 'de',  name: 'Deutsch' },
  { id: 'ethik',    cls: 'eth', name: 'Ethik' },
  { id: 'sachunterricht', cls: 'su', name: 'Sach\u00ADunterricht' }
];

window.LW_HEFTE = [
  { id: 'terme', abzeichen: 'Term-Entdeckerin', fach: 'mathe', thema: 'Terme', name: 'Terme verstehen',
    info: 'Antippen, verschieben, ausprobieren: was ein Term ist',
    kapitel: ['Was ist ein Term?', 'Zahlen einsetzen', 'Terme im Alltag', 'Wie heißen die Teile?'],
    anker: ['was', 'einsetzen', 'alltag', 'namen'] },
  { id: 'rechenheft', abzeichen: 'Potenz-Profi', fach: 'mathe', thema: 'Terme', name: 'Rechenheft',
    info: 'Terme und Potenzen üben, Schritt für Schritt', key: 'mathe-rechenheft-5-v1',
    kapitel: ['Terme üben', 'Potenzen üben', 'Auswendig-Quiz: 2er- und 10er-Potenzen'],
    anker: ['terme', 'potenzen', 'quiz'] },
  { id: 'potenzen', abzeichen: 'Hochzahl-Heldin', fach: 'mathe', thema: 'Potenzen', name: 'Potenz-Quiz',
    info: '2er- und 10er-Potenzen bis Hochzahl 20 auswendig, mit Zahlennamen zum Anhören', key: 'potenz-quiz-v1',
    kapitel: ['2er-Potenzen bis 2¹⁰', '2er-Potenzen bis 2²⁰', '10er-Potenzen bis 10²⁰', 'Namen der großen Zahlen', 'Hör-Quiz'],
    anker: ['zwei1', 'zwei2', 'zehn', 'namen', 'hoeren'],
    entdecken: { a: 'tafel', t: 'Hörtafel', s: 'Alle Potenzen in einer Liste zum Anhören' },
    test: { a: 'mix', kap: 'Großer Mix', s: 'Alle Potenzen und Namen gemischt' } },
  { id: 'rechengesetze', abzeichen: 'Gesetzes-Hüterin', fach: 'mathe', thema: 'Rechengesetze', name: 'Rechengesetze der Addition',
    info: 'Tauschen, Klammern umsetzen, plus 0: die drei Gesetze aus dem Regelheft zum Ziehen und Ausprobieren', key: 'rechengesetze-v1',
    kapitel: ['Mein Regelheft', 'Tauschen erlaubt? (K⁺)', 'Klammer-Karussell (A⁺)', 'Die neutrale Null (N⁺)', 'Geschickt rechnen', 'Gesetz-Detektivin', 'Hilf im Klassenchat'],
    anker: ['regeln', 'tauschen', 'klammern', 'null', 'geschickt', 'detektiv', 'chat'],
    test: { a: 'mix', kap: 'Großer Mix', s: 'Alle drei Gesetze gemischt' } },
  { id: 'englisch', abzeichen: 'Vokabel-Champion', fach: 'englisch', thema: 'Vokabeln und Grammatik', name: 'English trainer',
    info: 'Vokabeln S. 170–186 und Grammatik Seite für Seite, mit Chats zum Mitschreiben, oder im Karteikasten mit den neuesten Kapiteln zuerst', key: 'englisch-kartei-5-v1',
    // Ein Kapitel pro Buchseite, Grammatik dort eingeordnet, wo sie thematisch passt (muss zu KAPS in englisch.html passen)
    kapitel: ['S. 170 · Hello!', 'G2 · to be', 'S. 171 · Welcome to London!', 'G1 · a/an & Plural', 'S. 172 · In the park', 'G3 · there is/are',
      'S. 173 · Zahlen, Farben, Freunde', 'S. 174 · Freunde & Hobbys', 'G6 · Pronomen & my/your…', 'S. 175 · Bis morgen!', 'S. 176 · Schulsachen',
      'S. 176/177 · Unit 1 Check-in', 'S. 178/179 · Station 1', 'S. 180 · Station 2',
      'S. 181 · Station 2 · Chill-out', 'S. 181 · Station 3', 'S. 182 · Station 3 · Teil 2', 'S. 182 · School words', 'S. 183 · Story', 'S. 183 · Check-out', 'S. 183/184 · Media smart',
      'S. 184 · Texte am Computer', 'S. 185 · Unit 2 Check-in', 'S. 185 · Unit 2 Station 1', 'G7 · ’s und s’ (wem gehört’s?)',
      'S. 186 · Things in the house', 'S. 186 · Unit 2 · Wörter'],
    anker: ['s0', 'g2', 's1', 'g1', 's2', 'g3', 's3', 's4', 'g6', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12', 's13', 's14', 's15', 's16', 's17', 's18', 's19', 'g7', 's20', 's21'],
    frei: { t: 'Karteikasten · Neueste zuerst', s: 'Erst die neuesten Kapitel festigen, ältere kommen nach und nach dazu' } },
  // Zellen, Mikroskop und Skelett laufen in einer App (bio-expedition.html, teilt: gemeinsamer Speicher zellstadt-v1).
  // mikroskop.html und skelett.html leitet vercel.json auf bio-expedition.html um; von = Fortschritt aus der Zeit, als es ein Heft war.
  { id: 'bio-expedition', abzeichen: 'Bio-Forscherin', fach: 'biologie', thema: 'Zellen', name: 'Zellen-Expedition',
    info: 'Zellbestandteile, Pflanze oder Tier, Fotosynthese und Wasser: deine Wissens-Pflanze wächst mit', teilt: true,
    kapitel: ['Zellbestandteile', 'Pflanze oder Tier', 'Fotosynthese & Atmung', 'Wasser & Turgor'],
    anker: ['organellen', 'vergleich', 'energie', 'wasser'],
    entdecken: { a: 'entdecken', t: 'Zelle erkunden', s: 'Alle Bestandteile antippen, ohne Aufgaben' },
    test: { a: 'test', kap: 'Großer Test', s: 'Alle Zellen-Kapitel gemischt' } },
  { id: 'pflanzenzelle', abzeichen: 'Zell-Expertin', fach: 'biologie', thema: 'Zellen', name: 'Expedition Pflanzenzelle',
    info: 'Eine Pflanzenzelle auseinandernehmen und erkunden',
    kapitel: ['Wer wohnt in der Zelle?', 'Ein Tag in der Blattzelle', 'Warum Pflanzen stehen können', 'Wie klein ist eine Zelle?'],
    anker: ['entdecken', 'arbeit', 'wasser', 'groesse'],
    test: { a: 'quiz', kap: 'Teste dich', s: 'Prüf, was du über die Pflanzenzelle weißt' } },
  { id: 'mikroskop', fach: 'biologie', thema: 'Mikroskop', name: 'Mikroskopier-Führerschein',
    info: 'Die Teile des Mikroskops, Vergrößerung und Größen: Stempel sammeln bis zum Führerschein', teilt: true, von: 'bio-expedition',
    kapitel: ['Mikroskop & Größen', 'Mikroskopier-Führerschein'],
    anker: ['mikro', 'fuehrerschein'],
    entdecken: { a: 'entdecken', t: 'Mikroskop erkunden', s: 'Alle Teile antippen, ohne Aufgaben' },
    test: { a: 'test', kap: 'Großer Test', s: 'Mikroskop und Führerschein gemischt' } },
  { id: 'skelett', abzeichen: 'Skelett-Kennerin', fach: 'biologie', thema: 'Skelett', name: 'Das Skelett',
    info: 'Aufbau und Aufgaben, Schädel, Rumpf und Wirbelsäule: bring dein Skelett zum Leuchten', teilt: true, von: 'bio-expedition',
    kapitel: ['Aufbau & Aufgaben', 'Schädel', 'Rumpfskelett', 'Wirbelsäule'],
    anker: ['sg_aufbau', 'sg_schaedel', 'sg_rumpf', 'sg_wirbel'],
    entdecken: { a: 'entdecken', t: 'Skelett erkunden', s: 'Körper, Schädel, Wirbelsäule und Wirbel antippen' },
    test: { a: 'test', kap: 'Großer Test', s: 'Alle Knochen und Themen gemischt' } },
  { id: 'atlas', abzeichen: 'Atlas-Detektivin', fach: 'erdkunde', thema: 'Die Erde', name: 'Atlas-Detektiv',
    info: 'Kontinente, Ozeane, Himmelsrichtungen und der Globus', key: 'atlas-detektiv-v1',
    kapitel: ['Kontinente & Ozeane', 'Himmelsrichtungen', 'Der Globus'],
    anker: ['welt', 'kompass', 'globus'] },
  { id: 'noten', abzeichen: 'Notenleserin', fach: 'musik', thema: 'Noten', name: 'Notenwerkstatt',
    info: 'Noten lesen und Töne sicher erkennen', key: 'notenwerkstatt-v1',
    kapitel: ['Schlüssel-Werkstatt', 'Noten lesen', 'Noten setzen', 'Klavier-Detektiv', 'Notenrätsel', 'Wissen & Regeln', 'Notenregen'],
    anker: ['clef', 'name', 'place', 'key', 'word', 'quiz', 'rain'],
    test: { a: 'mix', kap: 'Großer Mix', s: 'Alles aus der Notenwerkstatt gemischt' } },
  { id: 'rhythmus', abzeichen: 'Rhythmus-Meisterin', fach: 'musik', thema: 'Rhythmus', name: 'Rhythmuswerkstatt',
    info: 'Notenlängen von der Ganzen bis zur Zweiunddreißigstel: hören, rechnen, klatschen', key: 'rhythmuswerkstatt-v1',
    kapitel: ['Der Notenbaum', 'Noten-Mathe', 'Pausen', 'Hör-Detektivin', 'Takt-Baumeisterin', 'Klatsch mit!'],
    anker: ['baum', 'rechnen', 'pausen', 'hoeren', 'takt', 'klatschen'],
    entdecken: { a: 'baukasten', t: 'Rhythmus-Baukasten', s: 'Eigene Rhythmen bauen und abspielen' },
    test: { a: 'mix', kap: 'Großer Mix', s: 'Alle Notenlängen gemischt' } },
  { id: 'gewalt', abzeichen: 'Streitschlichterin', fach: 'ethik', thema: 'Gewalt', name: 'Gemeinsam stark',
    info: 'Gewalt erkennen, fair streiten, Hilfe holen: mit Geschichten und Rollenspielen zum Anhören', key: 'ethik-gewalt-v1',
    kapitel: ['Was ist Gewalt?', 'Streit ist nicht gleich Gewalt', 'Mobbing und Cybermobbing', 'Ursachen und Gefühle', 'Gewaltfrei Streit lösen', 'Zivilcourage und Hilfe holen', 'Regeln für das Miteinander'],
    anker: ['was', 'streit', 'mobbing', 'gefuehle', 'loesen', 'hilfe', 'regeln'],
    test: { a: 'mix', kap: 'Großer Mix', s: 'Alle Themen gemischt' } },

  // ---------- Grundschule, Klasse 3 (Rubie) ----------
  { id: 'schatzsuche', stufe: 'gs3', abzeichen: 'Rubin-Königin', fach: 'deutsch', thema: 'Rechtschreibung und Wortarten', name: 'Rubies Schatzsuche',
    info: 'Wortarten, groß und klein, doppelte Mitlaute und ie: Rubine sammeln und die Krone schmücken', key: 'rubie-schatzsuche-v1',
    // Stationen der App (ST in schatzsuche.html)
    kapitel: ['Wortarten-Wald', 'Groß-klein-Burg', 'Doppel-Höhle', 'ie-Insel', 'Blitzrunde'],
    anker: ['wa', 'gk', 'dk', 'ie', 'blitz'],
    test: { a: 'mix', kap: 'Große Schatzsuche', s: 'Alle Stationen gemischt' } },
  { id: 'bundeslaender', stufe: 'gs3', abzeichen: 'Deutschland-Kennerin', fach: 'sachunterricht', thema: 'Deutschland', name: 'Länder-Reise',
    info: 'Die Bundesrepublik, ihre 16 Bundesländer und Hauptstädte, mit Karte zum Antippen und Vorlesen', key: 'bundeslaender-v1',
    kapitel: ['Deutschland ist ein Bundesstaat', 'Deutschland entdecken', 'Wo liegt das Land?', 'Wie heißt das Land?', 'Hauptstädte', 'Zu welchem Land gehört die Stadt?'],
    anker: ['staat', 'entdecken', 'lage', 'name', 'stadt', 'land'],
    test: { a: 'mix', kap: 'Große Deutschland-Reise', s: 'Alle Länder und Städte gemischt' } },
  { id: 'planeten', stufe: 'gs3', abzeichen: 'Planeten-Lauscherin', fach: 'musik', thema: 'Komponisten', name: 'Holsts Planeten',
    info: 'Gustav Holst und „Die Planeten“: sein Leben, Holsts Namen für die Planeten und ein Hör-Quiz mit echter Musik', key: 'holst-planeten-v1',
    kapitel: ['Wer war Gustav Holst?', 'Planeten-Übersicht', 'Holsts Namen für die Planeten', 'Wie klingt der Planet?', 'Lückentext: Holsts Leben', 'Hör-Quiz'],
    anker: ['leben', 'planeten', 'namen', 'klang', 'luecke', 'hoeren'],
    test: { a: 'mix', kap: 'Großer Mix', s: 'Alles über Holsts Planeten gemischt' } }
];

// Merkzettel zum Nachschlagen: öffnen sich in einem neuen Tab. Mit fachId erscheinen sie auch auf der Fach-Seite.
window.LW_LINKS = [
  { name: 'Merkplakat Terme', fach: 'Mathe', fachId: 'mathe', href: 'https://claude.ai/artifact/BWXY5mNJuKSzEBTuy6s5LS' },
  { name: 'Merkblatt: 2er- und 10er-Potenzen', fach: 'Mathe', fachId: 'mathe', href: 'https://claude.ai/artifact/2uFKtcM6oqygmuiCnjhXFK' },
  { name: 'Lernplan 5. Klasse', fach: 'Planen', href: 'https://claude.ai/artifact/F3KZTT6ncsVdgLyo42Sh2J' },
  { name: 'Lernstrategien für Nea', fach: 'Wie lerne ich gut?', href: 'https://claude.ai/artifact/5F1gLTMsWZBsAxN6R3kujD' }
];
