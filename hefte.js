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
 */
window.LW_FAECHER = [
  { id: 'mathe',    cls: 'ma',  name: 'Mathe' },
  { id: 'englisch', cls: 'en',  name: 'Englisch' },
  { id: 'biologie', cls: 'bio', name: 'Biologie' },
  { id: 'erdkunde', cls: 'geo', name: 'Erdkunde' },
  { id: 'musik',    cls: 'mu',  name: 'Musik' },
  { id: 'deutsch',  cls: 'de',  name: 'Deutsch' }
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
  { id: 'englisch', abzeichen: 'Vokabel-Champion', fach: 'englisch', thema: 'Vokabeln und Grammatik', name: 'English trainer',
    info: 'Vokabeln S. 170–180 und Grammatik G1, G2, G3, G6 im Karteikasten', key: 'englisch-kartei-5-v1',
    kapitel: ['Vokabeln S. 170–173', 'Vokabeln S. 174–176', 'Vokabeln S. 176–180', 'G1 · a/an & Plural', 'G2 · to be', 'G3 · there is/are', 'G6 · Pronomen & my/your…'],
    anker: ['v1', 'v2', 'v3', 'g1', 'g2', 'g3', 'g6'] },
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
    anker: ['clef', 'name', 'place', 'key', 'word', 'quiz', 'rain', 'mix'] }
];

// Merkzettel zum Nachschlagen: öffnen sich in einem neuen Tab. Mit fachId erscheinen sie auch auf der Fach-Seite.
window.LW_LINKS = [
  { name: 'Merkplakat Terme', fach: 'Mathe', fachId: 'mathe', href: 'https://claude.ai/artifact/BWXY5mNJuKSzEBTuy6s5LS' },
  { name: 'Merkblatt: 2er- und 10er-Potenzen', fach: 'Mathe', fachId: 'mathe', href: 'https://claude.ai/artifact/2uFKtcM6oqygmuiCnjhXFK' },
  { name: 'Lernplan 5. Klasse', fach: 'Planen', href: 'https://claude.ai/artifact/F3KZTT6ncsVdgLyo42Sh2J' },
  { name: 'Lernstrategien für Nea', fach: 'Wie lerne ich gut?', href: 'https://claude.ai/artifact/5F1gLTMsWZBsAxN6R3kujD' }
];
