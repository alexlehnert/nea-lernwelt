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
    kapitel: ['2er-Potenzen bis 2¹⁰', '2er-Potenzen bis 2²⁰', '10er-Potenzen bis 10²⁰', 'Namen der großen Zahlen', 'Hör-Quiz', 'Großer Mix'],
    anker: ['zwei1', 'zwei2', 'zehn', 'namen', 'hoeren', 'mix'] },
  { id: 'englisch', abzeichen: 'Vokabel-Champion', fach: 'englisch', thema: 'Vokabeln und Grammatik', name: 'English trainer',
    info: 'Vokabeln S. 170–180 und Grammatik Seite für Seite, mit Chats zum Mitschreiben, oder alles gemischt im Karteikasten', key: 'englisch-kartei-5-v1',
    // Ein Kapitel pro Buchseite, Grammatik dort eingeordnet, wo sie thematisch passt (muss zu KAPS in englisch.html passen)
    kapitel: ['S. 170 · Hello!', 'G2 · to be', 'S. 171 · Welcome to London!', 'G1 · a/an & Plural', 'S. 172 · In the park', 'G3 · there is/are',
      'S. 173 · Zahlen, Farben, Freunde', 'S. 174 · Freunde & Hobbys', 'G6 · Pronomen & my/your…', 'S. 175 · Bis morgen!', 'S. 176 · Schulsachen',
      'S. 176/177 · Unit 1 Check-in', 'S. 178/179 · Station 1', 'S. 180 · Station 2'],
    anker: ['s0', 'g2', 's1', 'g1', 's2', 'g3', 's3', 's4', 'g6', 's5', 's6', 's7', 's8', 's9'],
    frei: { t: 'Karteikasten · alles gemischt', s: 'Alle Karten frei üben und sehen, was in welchem Fach liegt' } },
  { id: 'bio-expedition', abzeichen: 'Bio-Forscherin', fach: 'biologie', thema: 'Zellen und Körper', name: 'Bio-Expedition',
    info: 'Zellen, Mikroskopier-Führerschein und Skelett', key: 'zellstadt-v1',
    kapitel: ['Zellbestandteile', 'Pflanze oder Tier', 'Fotosynthese & Atmung', 'Wasser & Turgor', 'Mikroskop & Größen', 'Mikroskopier-Führerschein',
      'Aufbau & Aufgaben', 'Schädel', 'Rumpfskelett', 'Wirbelsäule'],
    anker: ['organellen', 'vergleich', 'energie', 'wasser', 'mikro', 'fuehrerschein', 'sg_aufbau', 'sg_schaedel', 'sg_rumpf', 'sg_wirbel'] },
  { id: 'pflanzenzelle', abzeichen: 'Zell-Expertin', fach: 'biologie', thema: 'Zellen und Körper', name: 'Expedition Pflanzenzelle',
    info: 'Eine Pflanzenzelle auseinandernehmen und erkunden',
    kapitel: ['Wer wohnt in der Zelle?', 'Ein Tag in der Blattzelle', 'Warum Pflanzen stehen können', 'Wie klein ist eine Zelle?', 'Teste dich'],
    anker: ['entdecken', 'arbeit', 'wasser', 'groesse', 'quiz'] },
  { id: 'atlas', abzeichen: 'Atlas-Detektivin', fach: 'erdkunde', thema: 'Die Erde', name: 'Atlas-Detektiv',
    info: 'Kontinente, Ozeane, Himmelsrichtungen und der Globus', key: 'atlas-detektiv-v1',
    kapitel: ['Kontinente & Ozeane', 'Himmelsrichtungen', 'Der Globus'],
    anker: ['welt', 'kompass', 'globus'] },
  { id: 'noten', abzeichen: 'Notenleserin', fach: 'musik', thema: 'Noten', name: 'Notenwerkstatt',
    info: 'Noten lesen und Töne sicher erkennen', key: 'notenwerkstatt-v1',
    kapitel: ['Schlüssel-Werkstatt', 'Noten lesen', 'Noten setzen', 'Klavier-Detektiv', 'Notenrätsel', 'Wissen & Regeln', 'Notenregen', 'Großer Mix'],
    anker: ['clef', 'name', 'place', 'key', 'word', 'quiz', 'rain', 'mix'] },
  { id: 'rhythmus', abzeichen: 'Rhythmus-Meisterin', fach: 'musik', thema: 'Rhythmus', name: 'Rhythmuswerkstatt',
    info: 'Notenlängen von der Ganzen bis zur Zweiunddreißigstel: hören, rechnen, klatschen', key: 'rhythmuswerkstatt-v1',
    kapitel: ['Der Notenbaum', 'Noten-Mathe', 'Pausen', 'Hör-Detektivin', 'Takt-Baumeisterin', 'Klatsch mit!', 'Großer Mix'],
    anker: ['baum', 'rechnen', 'pausen', 'hoeren', 'takt', 'klatschen', 'mix'] },
  { id: 'gewalt', abzeichen: 'Streitschlichterin', fach: 'ethik', thema: 'Gewalt', name: 'Gemeinsam stark',
    info: 'Gewalt erkennen, fair streiten, Hilfe holen: mit Geschichten und Rollenspielen zum Anhören', key: 'ethik-gewalt-v1',
    kapitel: ['Was ist Gewalt?', 'Streit ist nicht gleich Gewalt', 'Mobbing und Cybermobbing', 'Ursachen und Gefühle', 'Gewaltfrei Streit lösen', 'Zivilcourage und Hilfe holen', 'Regeln für das Miteinander', 'Großer Mix'],
    anker: ['was', 'streit', 'mobbing', 'gefuehle', 'loesen', 'hilfe', 'regeln', 'mix'] },

  // ---------- Grundschule, Klasse 3 (Rubie) ----------
  { id: 'schatzsuche', stufe: 'gs3', abzeichen: 'Rubin-Königin', fach: 'deutsch', thema: 'Rechtschreibung und Wortarten', name: 'Rubies Schatzsuche',
    info: 'Wortarten, groß und klein, doppelte Mitlaute und ie: Rubine sammeln und die Krone schmücken', key: 'rubie-schatzsuche-v1',
    // Stationen der App (ST in schatzsuche.html)
    kapitel: ['Wortarten-Wald', 'Groß-klein-Burg', 'Doppel-Höhle', 'ie-Insel', 'Große Schatzsuche', 'Blitzrunde'],
    anker: ['wa', 'gk', 'dk', 'ie', 'mix', 'blitz'] },
  { id: 'bundeslaender', stufe: 'gs3', abzeichen: 'Deutschland-Kennerin', fach: 'sachunterricht', thema: 'Deutschland', name: 'Länder-Reise',
    info: 'Die 16 Bundesländer und ihre Hauptstädte, mit Karte zum Antippen und Vorlesen', key: 'bundeslaender-v1',
    kapitel: ['Deutschland entdecken', 'Wo liegt das Land?', 'Wie heißt das Land?', 'Hauptstädte', 'Zu welchem Land gehört die Stadt?', 'Große Deutschland-Reise'],
    anker: ['entdecken', 'lage', 'name', 'stadt', 'land', 'mix'] },
  { id: 'musik-gs3', stufe: 'gs3', bald: true, fach: 'musik', thema: 'Musik', name: 'Musik-Heft',
    info: 'Die Aufgaben werden gerade vorbereitet.', kapitel: [] }
];

// Merkzettel zum Nachschlagen: öffnen sich in einem neuen Tab. Mit fachId erscheinen sie auch auf der Fach-Seite.
window.LW_LINKS = [
  { name: 'Merkplakat Terme', fach: 'Mathe', fachId: 'mathe', href: 'https://claude.ai/artifact/BWXY5mNJuKSzEBTuy6s5LS' },
  { name: 'Merkblatt: 2er- und 10er-Potenzen', fach: 'Mathe', fachId: 'mathe', href: 'https://claude.ai/artifact/2uFKtcM6oqygmuiCnjhXFK' },
  { name: 'Lernplan 5. Klasse', fach: 'Planen', href: 'https://claude.ai/artifact/F3KZTT6ncsVdgLyo42Sh2J' },
  { name: 'Lernstrategien für Nea', fach: 'Wie lerne ich gut?', href: 'https://claude.ai/artifact/5F1gLTMsWZBsAxN6R3kujD' }
];
