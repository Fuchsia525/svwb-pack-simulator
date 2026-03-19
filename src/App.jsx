import { useState, useCallback, useRef, useEffect } from "react";

// ══════════════════════════════════════════════════════════════
// SHADOWVERSE: WORLDS BEYOND — PACK OPENING SIMULATOR
// Real card names · Expansion selection · Accurate official rates
// ══════════════════════════════════════════════════════════════

// ─── CARD DATABASE ───────────────────────────────────────────
// Format: [name, class_index, rarity_index]
// Classes: 0=Forest, 1=Sword, 2=Rune, 3=Dragon, 4=Abyss, 5=Haven, 6=Portal, 7=Neutral
// Rarities: 0=Bronze, 1=Silver, 2=Gold, 3=Legendary

const CLASSES = ["Forestcraft","Swordcraft","Runecraft","Dragoncraft","Abysscraft","Havencraft","Portalcraft","Neutral"];
const CLASS_COLORS = ["#4CAF50","#FFC107","#2196F3","#FF5722","#9C27B0","#FFEB3B","#00BCD4","#9E9E9E"];
const CLASS_ICONS = ["🌿","⚔️","🔮","🐉","💀","✨","⚙️","🔘"];
const RARITIES = ["Bronze","Silver","Gold","Legendary"];
const RARITY_COLORS = ["#CD7F32","#C0C0C0","#FFD700","#FF4500"];

const SETS = {
  legends_rise: {
    name: "Legends Rise",
    code: "LR",
    date: "June 17, 2025",
    color: "#e63946",
    ticketCards: ["Albert, Levin Stormsaber", "Dimension Climb", "Cerberus, Hellfire Unleashed", "Orchis, Newfound Heart"],
    cards: [
      // ── FORESTCRAFT ──
      ["Fay Twinkletoes",0,0,2,10111110],
      ["Capricious Sprite",0,0,3,10111120],
      ["Deepwood Fairy Beast",0,0,8,10111130],
      ["Workin' Grasshopper",0,0,3,10111140],
      ["Elder Sagebrush",0,0,4,10111150],
      ["Fairy Convocation",0,0,1,10113110],
      ["Aerin, Crystalian Frostward",0,1,7,10112110],
      ["Good Fairy of the Pond",0,1,1,10112120],
      ["Baby Carbuncle",0,1,2,10112130],
      ["Lambent Cairn",0,1,2,10112210],
      ["Fragrantwood Whispers",0,1,3,10112310],
      ["Lily, Crystalian Innocence",0,2,2,10113110],
      ["Glade, Fragrantwood Ward",0,2,5,10113120],
      ["Bayle, Luxglaive Warrior",0,2,8,10113130],
      ["Killer Rhinoceroach",0,2,3,10113140],
      ["Godwood Staff",0,2,3,10113210],
      ["Aria, Lady of the Woods",0,3,6,10114110],
      ["Opulent Rose Queen",0,3,9,10114120],
      ["Amataz, Origin Blader",0,3,3,10114130],
      // ── SWORDCRAFT ──
      ["Ian, Lovebound Knight",1,0,3,10121110],
      ["Ernesta, Peace Hawker",1,0,6,10121120],
      ["Lyrala, Luminous Potionwright",1,0,3,10121130],
      ["Hound of War",1,0,3,10121140],
      ["Ignominious Samurai",1,0,2,10121150],
      ["Knightly Rending",1,0,4,10121310],
      ["Luminous Commander",1,1,1,10122110],
      ["Luminous Magus",1,1,5,10122120],
      ["Luminous Lancetrooper",1,1,2,10122130],
      ["Shinobi Squirrel",1,1,2,10122140],
      ["Ironcrown Majesty",1,1,3,10122310],
      ["Jeno, Levin Axeraider",1,2,7,10123110],
      ["Valse, Silent Sniper",1,2,3,10123120],
      ["Zirconia, Ironcrown Ward",1,2,4,10123130],
      ["Amalia, Luxsteel Paladin",1,2,8,10123140],
      ["Ravening Tentacles",1,2,7,10123310],
      ["Albert, Levin Stormsaber",1,3,5,10124110],
      ["Amelia, Silver Captain",1,3,6,10124120],
      ["Kagemitsu, Enduring Warrior",1,3,3,10124130],
      // ── RUNECRAFT ──
      ["Runeblade Conductor",2,0,5,10131110],
      ["Apprentice Astrologer",2,0,2,10131120],
      ["Owl Summoner",2,0,3,10131130],
      ["Starry-Eyed Penguin Wizard",2,0,4,10131140],
      ["Radiant Rainbow",2,0,2,10131310],
      ["Stormy Blast",2,0,1,10131320],
      ["Ms. Miranda, Adored Academic",2,1,2,10132110],
      ["Emmylou, Witch of Wonder",2,1,5,10132120],
      ["William, Mysterian Student",2,1,6,10132130],
      ["Sagelight Teachings",2,1,3,10132310],
      ["Snowman Army",2,1,8,10132320],
      ["Juno, Visionary Alchemist",2,2,5,10133110],
      ["Penelope, Potions Prodigy",2,2,2,10133120],
      ["Edelweiss, Sagelight Ward",2,2,4,10133130],
      ["Homework Time!",2,2,3,10133310],
      ["Demonic Call",2,2,7,10133320],
      ["Kuon, Fivefold Master",2,3,7,10134110],
      ["Anne & Grea, Mysterian Duo",2,3,5,10134120],
      ["Dimension Climb",2,3,18,10134310],
      // ── DRAGONCRAFT ──
      ["Silvercloud Dragonrider",3,0,8,10141110],
      ["Swordsnout Trencher",3,0,5,10141120],
      ["Fledgling Dragonslayer",3,0,4,10141130],
      ["Little Dragon Nanny",3,0,2,10141140],
      ["Whitescale Herald",3,0,4,10141150],
      ["Calamity Breath",3,0,6,10141310],
      ["Kit, Luxfang Champion",3,1,6,10142110],
      ["Eyfa, Windrider",3,1,3,10142120],
      ["Zell, Windreader",3,1,3,10142130],
      ["Marion, Ravishing Dragonewt",3,1,4,10142140],
      ["Goldennote Melody",3,1,3,10142310],
      ["Genesis Dragon Reborn",3,2,10,10143110],
      ["Liu Feng, Goldennote Ward",3,2,3,10143120],
      ["Zahar, Stormwave Dragoon",3,2,6,10143130],
      ["Twilight Dragon",3,2,9,10143140],
      ["Fan of Otohime",3,2,1,10143210],
      ["Burnite, Anathema of Flame",3,3,7,10144110],
      ["Forte, Blackwing Dragoon",3,3,6,10144120],
      ["Garyu, Fabled Dragonkin",3,3,8,10144130],
      // ── ABYSSCRAFT ──
      ["Aryll, Moonstruck Vampire",4,0,3,10151110],
      ["Nameless Demon",4,0,2,10151120],
      ["Little Miss Bonemancer",4,0,3,10151130],
      ["Ghost Juggler",4,0,6,10151140],
      ["Darkseal Demon",4,0,5,10151150],
      ["Reaper's Deathslash",4,0,1,10151310],
      ["Mino, Shrewd Reaper",4,1,2,10152110],
      ["Beryl, Nightmare Incarnate",4,1,2,10152120],
      ["Yuna, Occult Hunter",4,1,4,10152130],
      ["Vlad, Impaler",4,1,8,10152140],
      ["Shadowcrypt Memorial",4,1,3,10152210],
      ["Ceres, Blue Rose Maiden",4,2,4,10153110],
      ["Orthrus, Hellhound Blader",4,2,2,10153120],
      ["Mukan, Shadowcrypt Ward",4,2,4,10153130],
      ["Balto, Dusk Bounty Hunter",4,2,3,10153140],
      ["Rage of Serpents",4,2,2,10153310],
      ["Cerberus, Hellfire Unleashed",4,3,8,10154110],
      ["Medusa, Venomfang Royalty",4,3,7,10154120],
      ["Aragavy, Eternal Hunter",4,3,5,10154130],
      // ── HAVENCRAFT ──
      ["Angelic Prism Priestess",5,0,3,10161110],
      ["Holy Shieldmaiden",5,0,3,10161120],
      ["Sarissa, Luxspear Al-mi'raj",5,0,2,10161130],
      ["Serene Sanctuary",5,0,1,10161210],
      ["Darkhaven Grace",5,0,2,10161220],
      ["Featherfall",5,0,6,10161310],
      ["Radiant Guiding Angel",5,1,5,10162110],
      ["Mainyu, Darkdweller",5,1,2,10162120],
      ["Reno, Luxwing Featherfolk",5,1,4,10162130],
      ["Maeve, Guardian of Earth",5,1,7,10162140],
      ["Dose of Holiness",5,1,3,10162210],
      ["Skullfane of Demise",5,2,6,10163110],
      ["Ronavero, Darkhaven Ward",5,2,4,10163120],
      ["Lapis, Shining Seraph",5,2,8,10163130],
      ["Pact of the Beast Princess",5,2,2,10163210],
      ["Unholy Vessel",5,2,6,10163220],
      ["Rodeo, Anathema of Judgment",5,3,7,10164110],
      ["Jeanne, Saintly Knight",5,3,8,10164120],
      ["Salefa, Guardian of Water",5,3,5,10164130],
      // ── PORTALCRAFT ──
      // ── PORTALCRAFT ──
      ["Elise, Electrifying Inventor",6,0,1,10171110],
      ["Dirk, Metal Mercenary",6,0,5,10171120],
      ["Ironheart Hunter",6,0,2,10171130],
      ["Medical-Grade Assassin",6,0,3,10171140],
      ["Puppet Shield",6,0,3,10171310],
      ["Artifact Recharge",6,0,1,10171320],
      ["Rukina, Resistance Leader",6,1,4,10172110],
      ["Lovestruck Puppeteer",6,1,2,10172120],
      ["Noah, Thread of Death",6,1,6,10172130],
      ["Stream of Life",6,1,2,10172310],
      ["Doomwright Resurgence",6,1,5,10172320],
      ["Miriam, the Resolute",6,2,3,10173110],
      ["Sylvia, Garden Executioner",6,2,6,10173120],
      ["Liam, Crazed Creator",6,2,9,10173130],
      ["Alouette, Doomwright Ward",6,2,5,10173140],
      ["Ancient Cannon",6,2,5,10173210],
      ["Eudie, Maiden Reborn",6,3,3,10174110],
      ["Orchis, Newfound Heart",6,3,8,10174120],
      ["Ralmia, Sonic Boom",6,3,8,10174130],
      // ── NEUTRAL ──
      ["Ruby, Greedy Cherub",7,0,2,10101110],
      ["Vigilant Detective",7,0,3,10101120],
      ["Apollo, Heaven's Envoy",7,1,3,10102110],
      ["Seraphic Tidings",7,1,3,10102310],
      ["Goblin Foray",7,2,5,10103310],
      ["Phildau, Lionheart Ward",7,2,2,10103110],
      ["Divine Thunder",7,2,4,10103320],
      ["Olivia, Heroic Dark Angel",7,3,7,10104110],
      ["Ruler of Cocytus",7,3,10,10104120],
    ]
  },
  infinity_evolved: {
    name: "Infinity Evolved",
    code: "IE",
    date: "July 17, 2025",
    color: "#457b9d",
    ticketCards: ["Titania, Queen of Fairies", "Filene, Whitefrost Bloom", "Aether, Empyrean Guardian"],
    cards: [
      // ── FORESTCRAFT ──
      ["Wildheart",0,0,3,10211110],
      ["Dwarven Malletman",0,0,5,10211120],
      ["Ambush from Above",0,0,1,10211310],
      ["Lionel, Ardent Elf",0,1,6,10212110],
      ["Fairy Fencer",0,1,2,10212120],
      ["Woodwalkers",0,1,7,10212310],
      ["Cynthia, Chivalrous Elf",0,2,4,10213110],
      ["Garden's Allure",0,2,2,10213310],
      ["Titania, Queen of Fairies",0,3,4,10214110],
      ["Lymaga, Untamed Wild",0,3,7,10214120],
      // ── SWORDCRAFT ──
      ["Seria, Gunslinger Maid",1,0,2,10221110],
      ["Nightshadow Ninja Master",1,0,5,10221120],
      ["Lucrative Deal",1,0,2,10221310],
      ["Gelt, Intrepid Vice-Captain",1,1,3,10222110],
      ["Rackhir, Ordinary Knight",1,1,4,10222120],
      ["Band of Battle Princesses",1,1,2,10222310],
      ["Rosé, Princess Knight",1,2,3,10223110],
      ["Prim, Princess's Picnic",1,2,2,10223120],
      ["Gildaria, Anathema of Peace",1,3,6,10224110],
      ["Yurius, Levin Authority",1,3,8,10224120],
      // ── RUNECRAFT ──
      ["Melvie, Adoring Witch",2,0,2,10231110],
      ["Arcane Archivist",2,0,2,10231120],
      ["Glacial Crash",2,0,4,10231310],
      ["Bergent, Rejected Artes",2,1,5,10232110],
      ["Enchanting Perfumer",2,1,4,10232120],
      ["Flames of Chaos",2,1,3,10232310],
      ["Owen, Mysterian Swordsman",2,2,3,10233110],
      ["Pascale's Dance",2,2,2,10233310],
      ["Lilanthim, Anathema of Edacity",2,3,8,10234110],
      ["Norman, Adamant Alchemist",2,3,6,10234120],
      // ── DRAGONCRAFT ──
      ["Wise Guardian Dragon",3,0,10,10241110],
      ["Soaring Ivory Dragon",3,0,1,10241120],
      ["Call of the Megalorca",3,0,2,10241310],
      ["Intent Dragonewt Princess",3,1,2,10242110],
      ["Seasoned Merman",3,1,5,10242120],
      ["Pyrewyrm Blade",3,1,1,10242210],
      ["Neptune, Arbiter of Tides",3,2,7,10243110],
      ["Draconic Strike",3,2,6,10243310],
      ["Filene, Whitefrost Bloom",3,3,2,10244110],
      ["Fennie, Prismatic Phoenix",3,3,8,10244120],
      // ── ABYSSCRAFT ──
      ["Rayvn, the Silver Bullet",4,0,5,10251110],
      ["Cultivator of Malice",4,0,1,10251120],
      ["Ghastly Soiree",4,0,2,10251310],
      ["Vuella, the Blastwing",4,1,3,10252110],
      ["Undead Soldier",4,1,6,10252120],
      ["Winged Servants",4,1,2,10252310],
      ["Laura, Cruel Commander",4,2,3,10253110],
      ["Exella, Nocturnal General",4,2,4,10253120],
      ["Ginsetsu & Yuzuki, Twin Calamities",4,3,9,10254110],
      ["Charon, Stygian Oarswoman",4,3,5,10254120],
      // ── HAVENCRAFT ──
      ["Cleric of Crushing",5,0,3,10261110],
      ["Damus, Oracle of Malice",5,0,2,10261120],
      ["Luminous Censer",5,0,2,10261210],
      ["Colette, Barrage Exorcist",5,1,3,10262110],
      ["Immaculate Adjudicator",5,1,5,10262120],
      ["Divine Guard",5,1,1,10262310],
      ["Agnes, the Swiftblade",5,2,5,10263110],
      ["Maddening Benison",5,2,4,10263310],
      ["Aether, Empyrean Guardian",5,3,7,10264110],
      ["Wilbert, Desolate Paladin",5,3,6,10264120],
      // ── PORTALCRAFT ──
      ["Engineblade Maven",6,0,6,10271110],
      ["Puppet Cat",6,0,1,10271120],
      ["Artifact Catapult",6,0,2,10271210],
      ["Vier, Heart Slayer",6,1,2,10272110],
      ["Achim, Lord of Despair",6,1,5,10272120],
      ["Flight of Icarus",6,1,1,10272310],
      ["Carnelia, Ember of Darkness",6,2,2,10273110],
      ["Synchronous Hearts",6,2,6,10273310],
      ["Zwei, Symphonic Heart",6,3,5,10274110],
      ["Karula, Eternal Arts",6,3,6,10274120],
      // ── NEUTRAL ──
      ["Twinblade Goblin",7,0,1,10201110],
      ["Dark Side",7,0,2,10201310],
      ["Cheretta, Angelic Maid",7,1,2,10202110],
      ["Reina, Angelic Partner",7,2,7,10203110],
      ["Hnikar & Jafnhar, Firestorm Duo",7,2,2,10203120],
      ["Odin, Twilit Fate",7,3,7,10204110],
      ["Grimnir, Heavenly Gale",7,3,3,10204120],
    ]
  },
  heirs_omen: {
    name: "Heirs of the Omen",
    code: "HO",
    date: "August 28, 2025",
    color: "#6d597a",
    ticketCards: ["Sinciro, Heir to Usurpation", "Galmieux, Ardor Manifest"],
    cards: [
      // ── FORESTCRAFT ──
      ["Devotee of Unkilling",0,0,2,10311110],
      ["Bearer of the Fairy Blade",0,0,2,10311120],
      ["Bestial Swipe",0,0,2,10311310],
      ["Supplicant of Unkilling",0,1,6,10312110],
      ["Greatwood Warrior",0,1,4,10312120],
      ["Hamlet of Unkilling",0,1,3,10312210],
      ["Congregant of Unkilling",0,2,9,10313110],
      ["Eradicating Arrow",0,2,1,10313310],
      ["Krulle, Heir to Unkilling",0,3,4,10314110],
      ["Izudia, Annihilation Manifest",0,3,8,10314120],
      // ── SWORDCRAFT ──
      ["Devotee of Usurpation",1,0,2,10321110],
      ["Comrade of the Swordmaster",1,0,6,10321120],
      ["Shield Bash",1,0,2,10321310],
      ["Supplicant of Usurpation",1,1,2,10322110],
      ["Peppy Scout",1,1,5,10322120],
      ["Lair of Usurpation",1,1,1,10322210],
      ["Congregant of Usurpation",1,2,4,10323110],
      ["Returning Slash",1,2,1,10323310],
      ["Sinciro, Heir to Usurpation",1,3,6,10324110],
      ["Octrice, Hollowness Manifest",1,3,3,10324120],
      // ── RUNECRAFT ──
      ["Devotee of Truth",2,0,2,10331110],
      ["Ascetic of Wuxing",2,0,4,10331120],
      ["Crystal Gazing",2,0,4,10331310],
      ["Supplicant of Truth",2,1,5,10332110],
      ["Institute of Truth",2,1,3,10332210],
      ["Risky Amalgamation",2,1,4,10332310],
      ["Congregant of Truth",2,2,3,10333110],
      ["Illusory Conjuration",2,2,2,10333310],
      ["Velharia, Heir to Truth",2,3,2,10334110],
      ["Raio, Elimination Manifest",2,3,9,10334120],
      // ── DRAGONCRAFT ──
      ["Devotee of Disdain",3,0,2,10341110],
      ["Snowstorm Dragonewt",3,0,6,10341120],
      ["Raging Lightning",3,0,3,10341310],
      ["Supplicant of Disdain",3,1,5,10342110],
      ["Ocean Rider",3,1,3,10342120],
      ["Nation of Disdain",3,1,2,10342210],
      ["Congregant of Disdain",3,2,6,10343110],
      ["Ferocious Flame",3,2,1,10343310],
      ["Azurifrit, Heir to Disdain",3,3,9,10344110],
      ["Galmieux, Ardor Manifest",3,3,5,10344120],
      // ── ABYSSCRAFT ──
      ["Devotee of Entwining",4,0,3,10351110],
      ["Ephemeral Demon Princess",4,0,8,10351120],
      ["March of the Brutes",4,0,4,10351310],
      ["Supplicant of Entwining",4,1,4,10352110],
      ["Spirited Gravekeeper",4,1,2,10352120],
      ["Castle of Entwining",4,1,2,10352210],
      ["Congregant of Entwining",4,2,5,10353110],
      ["Screaming and Loathing",4,2,3,10353310],
      ["Sham-Nacha, Heir to Entwining",4,3,2,10354110],
      ["Rulenye & Valnareik",4,3,7,10354120],
      // ── HAVENCRAFT ──
      ["Devotee of Repose",5,0,2,10361110],
      ["Knight of the Holy Order",5,0,2,10361120],
      ["Blinding Faith",5,0,4,10361310],
      ["Supplicant of Repose",5,1,3,10362110],
      ["Temple of Repose",5,1,3,10362210],
      ["Winged Lion Statue",5,1,3,10362220],
      ["Congregant of Repose",5,2,5,10363110],
      ["Shining Disenchantment",5,2,4,10363210],
      ["Himeka, Heir to Repose",5,3,6,10364110],
      ["Marwynn, Despair Manifest",5,3,4,10364120],
      // ── PORTALCRAFT ──
      ["Devotee of Destruction",6,0,4,10371110],
      ["Supersonic Fighter",6,0,7,10371120],
      ["Wired Assault",6,0,4,10371310],
      ["Supplicant of Destruction",6,1,2,10372110],
      ["Field Scientist",6,1,5,10372120],
      ["Wasteland of Destruction",6,1,2,10372210],
      ["Congregant of Destruction",6,2,6,10373110],
      ["Devastating Soprano",6,2,2,10373310],
      ["Axia, Heir to Destruction",6,3,3,10374110],
      ["Lishenna, Melody Manifest",6,3,4,10374120],
      // ── NEUTRAL ──
      ["Apostle of Voracity",7,0,4,10301110],
      ["Greatness Ascended",7,0,4,10301310],
      ["Inspirational One",7,1,2,10302110],
      ["Dogged One",7,2,3,10303110],
      ["Tablet of Tribulations",7,2,3,10303210],
      ["Mjerrabaine, Great Manifest",7,3,4,10304110],
      ["Gilnelise, Voracity Manifest",7,3,3,10304120],
    ]
  },
  skybound_dragons: {
    name: "Skybound Dragons",
    code: "SD",
    date: "October 2025",
    color: "#2a9d8f",
    ticketCards: ["Belial, Archangel of Cunning", "Beelzebub, Supreme King", "Wilnas, Flame Personified", "Wamdus, Water Personified", "Galleon, Earth Personified", "Ewiyar, Wind Personified", "Lu Woh, Light Personified", "Fediel, Darkness Personified"],
    cards: [
      // ── FORESTCRAFT ──
      ["Kou & You, Love and Hatred",0,0,7,10411110],
      ["Manamel, Super Cutest",0,0,4,10411120],
      ["Comet Drive",0,0,2,10411310],
      ["Chloe, What a Gal",0,1,2,10412110],
      ["Anthuria, Toe-Tapping Torch",0,1,5,10412120],
      ["Starry Sky",0,1,1,10412310],
      ["Cupitan, Iridescent Archer",0,2,4,10413110],
      ["Alfheimr",0,2,2,10413310],
      ["Ewiyar, Wind Personified",0,3,2,10414110],
      ["Yuel & Societte, Dancing Duo",0,3,5,10414120],
      // ── SWORDCRAFT ──
      ["Randall, Feet Fighter",1,0,2,10421110],
      ["Arthur, Staunch Dragon",1,0,3,10421120],
      ["Mordred, Illusory Lion",1,0,3,10421130],
      ["Aglovale, Lord of Frost",1,1,6,10422110],
      ["Feather, Bombastic Brawler",1,1,3,10422120],
      ["Fiorito, Muscles in Bloom",1,1,4,10422130],
      ["Golden Knight, True King's Blade",1,2,7,10423110],
      ["Knightly Ardor",1,2,5,10423310],
      ["Zeta & Bea, Crimson and Blue",1,3,4,10424110],
      ["Seofon, Leader of the Eternals",1,3,4,10424120],
      // ── RUNECRAFT ──
      ["Philosophia, Cryptic Sophist",2,0,3,10431110],
      ["Suframare, Wandering Tutor",2,0,1,10431120],
      ["Rune Portal",2,0,7,10431310],
      ["Ezecrain, Portent of Vengeance",2,1,6,10432110],
      ["Mireille & Risette, Penitent Duo",2,1,5,10432120],
      ["Unleashed",2,1,4,10432310],
      ["Elmott, Remembrance Aflame",2,2,3,10433110],
      ["Alchemic Flare",2,2,2,10433310],
      ["Wamdus, Water Personified",2,3,3,10434110],
      ["Cagliostro, Genius Alchemist",2,3,4,10434120],
      // ── DRAGONCRAFT ──
      ["Joel, Wave Chaser",3,0,3,10441110],
      ["Mari, Meg's Bestie",3,0,2,10441120],
      ["Crescent Tube Ride",3,0,2,10441310],
      ["Izmir, Frigid Fate",3,1,5,10442110],
      ["Mugen, Steel-Bodied Honesty",3,1,8,10442120],
      ["Maximum Love Bomb",3,1,2,10442310],
      ["Meg, Girl Next Door",3,2,3,10443110],
      ["Primal Beast Absorption",3,2,5,10443310],
      ["Wilnas, Flame Personified",3,3,7,10444110],
      ["Zooey, Ally of the World",3,3,5,10444120],
      // ── ABYSSCRAFT ──
      ["Almeida, Headstrong Miner",4,0,2,10451110],
      ["Vaseraga, Unyielding Scythe",4,0,6,10451120],
      ["Valiant Edge",4,0,2,10451310],
      ["Nezha, Soaring War God",4,1,6,10452110],
      ["Satyr, Open-Hearted Rover",4,1,3,10452120],
      ["Baal, Elemental Resonance",4,1,3,10452130],
      ["Nehan, Dispenser of Samsara",4,2,6,10453110],
      ["Corruption",4,2,5,10453310],
      ["Fediel, Darkness Personified",4,3,7,10454110],
      ["Belial, Archangel of Cunning",4,3,7,10454120],
      // ── HAVENCRAFT ──
      ["Troue, Heroic Visionary",5,0,3,10461110],
      ["Lamretta, Sisterly Shepherd",5,0,2,10461120],
      ["Awed and Inspired",5,0,0,10461210],
      ["Sara, Graphos's Chosen",5,1,4,10462110],
      ["Sophia, Zeyen Priestess",5,1,4,10462120],
      ["Skyfaring Vessel",5,1,4,10462210],
      ["Tikoh, Asclepian Surgeon",5,2,1,10463110],
      ["De La Fille's Gleaming Gems",5,2,3,10463210],
      ["Galleon, Earth Personified",5,3,3,10464110],
      ["Vira, Luminous Primal Knight",5,3,8,10464120],
      // ── PORTALCRAFT ──
      ["Sho, Reborn Night King",6,0,3,10471110],
      ["Tsubasa, Blazing Gearcyclist",6,0,2,10471120],
      ["Isaac, Congenial Engineer",6,0,2,10471130],
      ["Eustace, Howl of Thunder",6,1,5,10472110],
      ["Ilsa, Brutal Drill Sergeant",6,1,7,10472120],
      ["Stone Breaker",6,1,3,10472310],
      ["Cassius, Sky-Yearning Arrival",6,2,5,10473110],
      ["Chaos Legion",6,2,6,10473310],
      ["Lu Woh, Light Personified",6,3,5,10474110],
      ["Beelzebub, Supreme King",6,3,9,10474120],
      // ── NEUTRAL ──
      ["Katalina, Sky's Protector",7,0,5,10401110],
      ["Vyrn, Bestest Pal",7,0,2,10401120],
      ["Yuni, Cosmic Legacy",7,1,3,10402110],
      ["Gran & Djeeta, Valiant Skyfarers",7,2,4,10403110],
      ["Lyria, Skydestined",7,2,2,10403120],
      ["Sandalphon, Primarch Successor",7,3,6,10404110],
    ]
  },
  blossoming_fate: {
    name: "Blossoming Fate",
    code: "BF",
    date: "December 28, 2025",
    color: "#e9c46a",
    ticketCards: ["Unkei, Goldbloom", "Imari, Dewdrop"],
    cards: [
      // ── FORESTCRAFT ──
      ["Prudent Tanuki",0,0,2,10511110],
      ["Battledore Woodsmaiden",0,0,5,10511120],
      ["Flight of the Swarmpetal",0,0,2,10511310],
      ["Flowering Friendship",0,1,2,10512110],
      ["Fairy Beastwhisperer",0,1,5,10512120],
      ["Quiet Encouragement",0,1,3,10512310],
      ["Spirited Skipper",0,2,5,10513110],
      ["Grace of the Swarmpetal",0,2,3,10513310],
      ["Wolfraud, Skybound Hanged Man",0,3,2,10514110],
      ["Miroku, Swarmpetal",0,3,3,10514120],
      // ── SWORDCRAFT ──
      ["Altruistic Aristocrat",1,0,6,10521110],
      ["Smoke-Shrouded Beauty",1,0,3,10521120],
      ["Extravagance of the Goldbloom",1,0,2,10521310],
      ["Swift Staffmaster",1,1,6,10522110],
      ["Amphibian Goldmuncher",1,1,7,10522120],
      ["Serenity's Shield",1,1,2,10522310],
      ["Unmoving Tactician",1,2,4,10523110],
      ["Splendor of the Goldbloom",1,2,3,10523310],
      ["Oluon, Raging Chariot",1,3,9,10524110],
      ["Unkei, Goldbloom",1,3,5,10524120],
      // ── RUNECRAFT ──
      ["Terraforming Wizard",2,0,3,10531110],
      ["Waterbending Charmwielder",2,0,6,10531120],
      ["Metamorphosis of the Dawnblossom",2,0,2,10531310],
      ["Insomniac Witch",2,1,4,10532110],
      ["Woodsong Haikumaster",2,1,6,10532120],
      ["Kitty Cunning",2,1,1,10532310],
      ["Emperor of Elements",2,2,7,10533110],
      ["Grandeur of the Dawnblossom",2,2,7,10533310],
      ["Lhynkal, Wandering Fool",2,3,1,10534110],
      ["Ara, Dawnblossom",2,3,10,10534120],
      // ── DRAGONCRAFT ──
      ["Springwell Steward",3,0,2,10541110],
      ["Stormy Shamisen Shredder",3,0,6,10541120],
      ["Blade of the Crestpetal",3,0,3,10541310],
      ["Ironmace Dragoon",3,1,8,10542110],
      ["Jellyfish Dancer",3,1,2,10542120],
      ["Roar of Prominence",3,1,4,10542310],
      ["Ruinbringer",3,2,7,10543110],
      ["Sloth of the Crestpetal",3,2,2,10543310],
      ["Erntz, Governing Justice",3,3,10,10544110],
      ["Yube, Crestpetal",3,3,3,10544120],
      // ── ABYSSCRAFT ──
      ["Support Wolf",4,0,2,10551110],
      ["Crimson Soulmancer",4,0,4,10551120],
      ["Valor of the Nightblossom",4,0,2,10551310],
      ["Fickle Necromancer",4,1,3,10552110],
      ["Friendly Blue Ogre",4,1,5,10552120],
      ["Tyrannical Fists",4,1,2,10552310],
      ["Lifestealer",4,2,9,10553110],
      ["Rigor of the Nightblossom",4,2,2,10553310],
      ["Milteo & Luzen",4,3,6,10554110],
      ["Shakdoh, Nightblossom",4,3,10,10554120],
      // ── HAVENCRAFT ──
      ["Prescient Priestess",5,0,3,10561110],
      ["Bouquet Believer",5,0,1,10561120],
      ["Malice of the Mistbloom",5,0,3,10561310],
      ["Immovable Paladin",5,1,8,10562110],
      ["Desperate Shrinemouse",5,1,5,10562120],
      ["Protective Shell",5,1,2,10562210],
      ["Saint of Rehabilitation",5,2,5,10563110],
      ["Resolve of the Mistbloom",5,2,3,10563210],
      ["Sofina, Inspiring Strength",5,3,4,10564110],
      ["Kukishiro, Mistbloom",5,3,7,10564120],
      // ── PORTALCRAFT ──
      ["Marionette Master",6,0,4,10571110],
      ["Flowering Artisan",6,0,5,10571120],
      ["Light of the Dewdrop",6,0,1,10571310],
      ["New-Age Cartographer",6,1,4,10572110],
      ["Lunar Bunny",6,1,2,10572120],
      ["Resurrection Tuner",6,1,1,10572310],
      ["Neuron Disrupter",6,2,5,10573110],
      ["Sincerity of the Dewdrop",6,2,1,10573310],
      ["Slaus, Revolving Wheel of Fortune",6,3,3,10574110],
      ["Imari, Dewdrop",6,3,2,10574120],
      // ── NEUTRAL ──
      ["Monster Litterateur",7,0,1,10501110],
      ["Goddess of Starlight",7,1,5,10502110],
      ["Behemoth General",7,1,4,10502120],
      ["World of Games",7,2,1,10503210],
      ["Fate of the World",7,2,5,10503310],
      ["Getenou, Eightfold Glory",7,3,8,10504110],
    ]
  },
  apocalypse_pact: {
    name: "Apocalypse Pact",
    code: "AP",
    date: "February 26, 2026",
    color: "#b5451b",
    ticketCards: ["Shymm, Love Bewitched", "Kandima, Sublime Hatred"],
    cards: [
      // ── FORESTCRAFT ──
      ["Motherly Forestdweller",0,0,4,10611110],
      ["Monkey of Paradise",0,0,3,10611120],
      ["Advent of the Eld Lance",0,0,7,10611310],
      ["Kindly Executor",0,1,2,10612110],
      ["Howling Wolfman",0,1,6,10612120],
      ["Floral Offering",0,1,5,10612310],
      ["Merciful Attendant",0,2,5,10613110],
      ["Nurturing Eld Lance",0,2,3,10613310],
      ["Althenia, Nurturing Bloom",0,3,8,10614110],
      ["Sathanid, Eld Lance",0,3,1,10614120],
      // ── SWORDCRAFT ──
      ["Fearless Soldier",1,0,2,10621110],
      ["Idle Maid",1,0,4,10621120],
      ["Advent of the Eld Sword",1,0,5,10621310],
      ["Loyal Guard",1,1,3,10622110],
      ["Navy Cat",1,1,8,10622120],
      ["Majestic Conquest",1,1,1,10622310],
      ["Heartless Strategist",1,2,4,10623110],
      ["Ruthless Eld Sword",1,2,1,10623310],
      ["Noel IV, Ruthless Warlord",1,3,6,10624110],
      ["Yidmetra, Eld Sword",1,3,2,10624120],
      // ── RUNECRAFT ──
      ["Crystalspawn",2,0,1,10631110],
      ["Daydream Librarian",2,0,6,10631120],
      ["Advent of the Eld Crystals",2,0,2,10631310],
      ["Enraptured Student",2,1,5,10632110],
      ["Adventurous Grimoire",2,1,3,10632120],
      ["Reaved Order",2,1,1,10632310],
      ["Spellbound Professor",2,2,4,10633110],
      ["Bewitching Eld Crystals",2,2,3,10633310],
      ["Shymm, Love Bewitched",2,3,3,10634110],
      ["Calge-Danthia, Eld Crystals",2,3,10,10634120],
      // ── DRAGONCRAFT ──
      ["Resolute Dragonewt",3,0,3,10641110],
      ["Fruitfish",3,0,2,10641120],
      ["Advent of the Eld Blades",3,0,4,10641310],
      ["Decisive Swordmaster",3,1,4,10642110],
      ["Spiked Dragon",3,1,8,10642120],
      ["Spilling Red",3,1,1,10642310],
      ["Impeding Pugilist",3,2,6,10643110],
      ["Beheading Eld Blades",3,2,7,10643310],
      ["Sagatsumatsu, Fair Beheader",3,3,7,10644110],
      ["Vorlalai, Eld Blades",3,3,2,10644120],
      // ── ABYSSCRAFT ──
      ["Reverent Demon",4,0,2,10651110],
      ["Ghost Dodger",4,0,3,10651120],
      ["Advent of the Eld Sight",4,0,3,10651310],
      ["Yearnful Necromancer",4,1,3,10652110],
      ["Devilish Heartbreaker",4,1,4,10652120],
      ["Allure of the Mightiest",4,1,7,10652310],
      ["Deprived Destroyer",4,2,5,10653110],
      ["Depletive Eld Sight",4,2,3,10653310],
      ["Armes, Depletive Demon",4,3,9,10654110],
      ["Bibatii, Eld Sight",4,3,3,10654120],
      // ── HAVENCRAFT ──
      ["Prostrating Coward",5,0,5,10661110],
      ["Unholy Water",5,0,2,10661210],
      ["Advent of the Eld Tome",5,0,3,10661310],
      ["Venerating Dyer",5,1,4,10662110],
      ["Pegasus Rider",5,1,6,10662120],
      ["Scripture of Salvation",5,1,2,10662210],
      ["Worshipful Crusader",5,2,6,10663110],
      ["Sublime Eld Tome",5,2,4,10663210],
      ["Kandima, Sublime Hatred",5,3,4,10664110],
      ["Lyanthoth, Eld Tome",5,3,9,10664120],
      // ── PORTALCRAFT ──
      ["Shoddy Plaything",6,0,6,10671110],
      ["Brilliant Inventor",6,0,6,10671120],
      ["Advent of the Eld Axe",6,0,2,10671310],
      ["Substandard Puppet",6,1,5,10672110],
      ["Timid Pioneer",6,1,4,10672120],
      ["Myriad Designs",6,1,6,10672310],
      ["Ludicrous Ordnance",6,2,8,10673110],
      ["Unfeeling Eld Axe",6,2,3,10673310],
      ["Camiscilia, Unfeeling Heart",6,3,7,10674110],
      ["Yog-Zentha, Eld Axe",6,3,2,10674120],
      // ── NEUTRAL ──
      ["Muddled Onlooker",7,0,2,10601110],
      ["Disrupted Commoner",7,0,5,10601120],
      ["Encroached World",7,1,3,10602210],
      ["Beast Lost to the Dark",7,2,6,10603110],
      ["Dark Dimensions",7,2,4,10603210],
      ["Omegotep, the Dreaded One",7,3,9,10604110],
    ]
  }
};

// ─── RATES (Official from Cygames via GameWith) ──────────────
const RATES = {
  standard: { Bronze: 0.6744, Silver: 0.25, Gold: 0.06, Legendary: 0.015, Ticket: 0.0006 },
  guaranteed: { Bronze: 0, Silver: 0.9244, Gold: 0.06, Legendary: 0.015, Ticket: 0.0006 },
  animatedChance: 0.08,
  pityInterval: 10,
};

// ─── HELPERS ─────────────────────────────────────────────────
function weightedRandom(weights) {
  let r = Math.random(), sum = 0;
  for (const [key, w] of Object.entries(weights)) {
    sum += w;
    if (r < sum) return key;
  }
  return Object.keys(weights).pop();
}

function getCardsByRarity(setCards, rarityIdx) {
  return setCards.filter(c => c[2] === rarityIdx);
}

function pickRandomCard(pool) {
  return pool[Math.floor(Math.random() * pool.length)];
}

function rollCard(setCards, isGuaranteed, isPity, ticketCards) {
  if (isPity) {
    const legs = getCardsByRarity(setCards, 3);
    const card = pickRandomCard(legs);
    return { name: card[0], classIdx: card[1], rarityIdx: 3, animated: Math.random() < RATES.animatedChance, pp: card[3], cardId: card[4] };
  }
  const rates = isGuaranteed ? RATES.guaranteed : RATES.standard;
  const roll = weightedRandom(rates);
  let rarityIdx;
  if (roll === "Ticket") {
    const pool = ticketCards && ticketCards.length > 0
      ? setCards.filter(c => c[2] === 3 && ticketCards.includes(c[0]))
      : getCardsByRarity(setCards, 3);
    const card = pickRandomCard(pool);
    return { name: card[0], classIdx: card[1], rarityIdx: 3, animated: true, isTicket: true, pp: card[3], cardId: card[4] };
  }
  else if (roll === "Legendary") rarityIdx = 3;
  else if (roll === "Gold") rarityIdx = 2;
  else if (roll === "Silver") rarityIdx = 1;
  else rarityIdx = 0;

  const pool = getCardsByRarity(setCards, rarityIdx);
  if (pool.length === 0) {
    const fallback = getCardsByRarity(setCards, 0);
    const card = pickRandomCard(fallback);
    return { name: card[0], classIdx: card[1], rarityIdx: 0, animated: Math.random() < RATES.animatedChance, pp: card[3], cardId: card[4] };
  }
  const card = pickRandomCard(pool);
  return { name: card[0], classIdx: card[1], rarityIdx, animated: Math.random() < RATES.animatedChance, pp: card[3], cardId: card[4] };
}

function openPack(setCards, pityCounter, ticketCards) {
  const cards = [];
  let newPity = pityCounter + 1;
  let isPityPack = newPity >= RATES.pityInterval;
  let gotLegendary = false;

  for (let i = 0; i < 8; i++) {
    const isLast = i === 7;
    const isPity = isLast && isPityPack && !gotLegendary;
    const card = rollCard(setCards, isLast && !isPity, isPity, ticketCards);
    if (card.rarityIdx === 3) gotLegendary = true;
    cards.push(card);
  }
  if (gotLegendary) newPity = 0;
  return { cards, pityCounter: newPity };
}

function getCardType(cardId) {
  if (!cardId) return null;
  const t = Math.floor(cardId / 100) % 10;
  if (t === 1) return "Follower";
  if (t === 2) return "Amulet";
  if (t === 3) return "Spell";
  return null;
}

// ─── CARD COMPONENT ──────────────────────────────────────────
function PackCard({ card, flipped, onClick, setColor }) {
  return (
    <div onClick={onClick}
      style={{
        aspectRatio: "2/3", borderRadius: 10, cursor: flipped ? "default" : "pointer",
        perspective: "600px", position: "relative",
      }}>
      <div style={{
        width: "100%", height: "100%", position: "relative",
        transformStyle: "preserve-3d",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0)",
        transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        {/* BACK */}
        <div style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden",
          borderRadius: 10, background: `linear-gradient(135deg, ${setColor}44, #1a1a2e, ${setColor}22)`,
          border: `2px solid ${setColor}55`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: 4,
        }}>
          <div style={{ fontSize: 28, opacity: 0.4 }}>✦</div>
          <div style={{ fontSize: 9, opacity: 0.3, letterSpacing: 1 }}>TAP</div>
        </div>
        {/* FRONT */}
        <div style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden",
          transform: "rotateY(180deg)", borderRadius: 10, overflow: "hidden",
          background: card.rarityIdx === 3
            ? `linear-gradient(145deg, #1a0500, ${RARITY_COLORS[3]}15, #1a0800, ${RARITY_COLORS[3]}10)`
            : card.rarityIdx === 2
            ? `linear-gradient(145deg, #1a1500, ${RARITY_COLORS[2]}12, #1a1200)`
            : card.rarityIdx === 1
            ? `linear-gradient(145deg, #101020, ${RARITY_COLORS[1]}08, #0e0e1e)`
            : `linear-gradient(145deg, #0a0a18, #0e0e22)`,
          border: `2px solid ${RARITY_COLORS[card.rarityIdx]}${card.rarityIdx >= 2 ? "aa" : "55"}`,
          display: "flex", flexDirection: "column", padding: "6px 4px",
          boxShadow: card.rarityIdx === 3
            ? `0 0 20px ${RARITY_COLORS[3]}33, inset 0 0 30px ${RARITY_COLORS[3]}08`
            : card.rarityIdx === 2
            ? `0 0 12px ${RARITY_COLORS[2]}22`
            : "none",
        }}>
          {/* Animated badge */}
          {card.animated && (
            <div style={{
              position: "absolute", top: 3, right: 3,
              fontSize: 7, background: "linear-gradient(135deg, #00BCD4, #9C27B0)",
              padding: "1px 5px", borderRadius: 4, color: "#fff", fontWeight: 700,
              letterSpacing: 0.5,
            }}>ANIM</div>
          )}
          {/* Ticket badge */}
          {card.isTicket && (
            <div style={{
              position: "absolute", top: 3, left: 3,
              fontSize: 6, background: "linear-gradient(135deg, #FF4500, #FFD700)",
              padding: "1px 5px", borderRadius: 4, color: "#fff", fontWeight: 700,
            }}>EXCHANGE TICKET</div>
          )}
          {/* Class icon */}
          <div style={{
            fontSize: 22, textAlign: "center", marginTop: 4, marginBottom: 2,
            filter: card.animated ? "drop-shadow(0 0 6px cyan)" : "none",
          }}>
            {CLASS_ICONS[card.classIdx]}
          </div>
          {/* Class line */}
          <div style={{
            textAlign: "center", fontSize: 8, fontWeight: 600, marginBottom: 2,
            color: CLASS_COLORS[card.classIdx], opacity: 0.8,
          }}>
            {CLASSES[card.classIdx]}
          </div>
          {/* Card name */}
          <div style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            textAlign: "center", fontSize: "clamp(7px, 1.8vw, 10px)", fontWeight: 700,
            lineHeight: 1.25, padding: "0 2px",
            color: card.isTicket ? "#FFD700"
              : card.rarityIdx === 3 ? RARITY_COLORS[3]
              : card.rarityIdx === 2 ? RARITY_COLORS[2]
              : "#ccc",
          }}>
            {card.cardId
              ? <a href={`https://shadowverse-wb.com/en/deck/cardslist/card/?card_id=${card.cardId}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ color: "inherit", textDecoration: "underline", cursor: "pointer" }}
                  onClick={e => e.stopPropagation()}>
                  {card.name}
                </a>
              : card.name}
          </div>
          {/* Rarity bar */}
          <div style={{
            textAlign: "center", fontSize: 8, fontWeight: 600,
            padding: "3px 0 1px",
            borderTop: `1px solid ${RARITY_COLORS[card.rarityIdx]}33`,
          }}>
            <span style={{ color: RARITY_COLORS[card.rarityIdx] }}>
              {"●".repeat(card.rarityIdx + 1)} {RARITIES[card.rarityIdx]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE HELPERS ─────────────────────────────────────────
const PROFILE_KEY = "svwb-profiles";
const ACTIVE_KEY = "svwb-active-profile";
const MAX_PROFILES = 20;

function loadProfiles() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {}; }
  catch { return {}; }
}

function saveProfiles(profiles) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profiles));
}

function getActiveProfileName() {
  return localStorage.getItem(ACTIVE_KEY) || "Default";
}

function blankProfile() {
  return {
    selectedSet: "legends_rise",
    pityCounter: Object.keys(SETS).reduce((acc, key) => { acc[key] = 0; return acc; }, {}),
    stats: { total: 0, Bronze: 0, Silver: 0, Gold: 0, Legendary: 0, animated: 0, tickets: 0 },
    history: [],
    importedCollection: {},
  };
}

// ─── MAIN COMPONENT ──────────────────────────────────────────
export default function PackSimulator() {
  const _initial = (() => {
    const profiles = loadProfiles();
    const name = getActiveProfileName();
    return profiles[name] || blankProfile();
  })();
  const [activeProfile, setActiveProfile] = useState(getActiveProfileName());
  const [selectedSet, setSelectedSet] = useState(_initial.selectedSet);
  const [packCards, setPackCards] = useState(null);
  const [flipped, setFlipped] = useState([]);
  const [allFlipped, setAllFlipped] = useState(false);
  const [multiCount, setMultiCount] = useState(10);
  const [multiResults, setMultiResults] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [pityCounter, setPityCounter] = useState(_initial.pityCounter);
  const [stats, setStats] = useState(_initial.stats);
  const [history, setHistory] = useState(_initial.history);
  const [importedCollection, setImportedCollection] = useState(_initial.importedCollection || {});
  const [view, setView] = useState("pack");
  const [showRates, setShowRates] = useState(false);
  const audioCtx = useRef(null);
  const [collectionSetFilter, setCollectionSetFilter] = useState("all");
  const [collectionRarityFilter, setCollectionRarityFilter] = useState("all");
  const [collectionClassFilter, setCollectionClassFilter] = useState("all");
  const [collectionTypeFilter, setCollectionTypeFilter] = useState("all");
  const [collectionPPFilter, setCollectionPPFilter] = useState("all");
  const [showImportModal, setShowImportModal] = useState(false);
  const [pendingImport, setPendingImport] = useState(null);

  useEffect(() => {
  const profiles = loadProfiles();
  profiles[activeProfile] = { selectedSet, pityCounter, stats, history, importedCollection };
  saveProfiles(profiles);
  localStorage.setItem(ACTIVE_KEY, activeProfile);
  localStorage.setItem("svwb-imported", JSON.stringify(importedCollection));
}, [activeProfile, selectedSet, pityCounter, stats, history, importedCollection]);

  const playSound = useCallback((freq, dur, type = "sine") => {
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtx.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch {}
  }, []);

  const playFlipSound = useCallback((rarityIdx) => {
    const freqs = [440, 660, 880, 1200];
    playSound(freqs[rarityIdx] || 440, 0.15);
    if (rarityIdx === 3) {
      setTimeout(() => playSound(1400, 0.2, "triangle"), 100);
      setTimeout(() => playSound(1600, 0.3, "triangle"), 200);
    }
  }, [playSound]);

  const playPackSound = useCallback(() => {
    playSound(523, 0.08);
    setTimeout(() => playSound(659, 0.08), 60);
    setTimeout(() => playSound(784, 0.12), 120);
  }, [playSound]);
  
  useEffect(() => {
    localStorage.setItem("pityCounter", JSON.stringify(pityCounter));
  }, [pityCounter]);

  useEffect(() => {
    localStorage.setItem("stats", JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  const currentSet = SETS[selectedSet];
  const packHighlight = packCards ? (
    packCards.some(c => c.isTicket) ? "ticket" :
    packCards.some(c => c.rarityIdx === 3) ? "legendary" :
    packCards.some(c => c.rarityIdx === 2) ? "gold" : null
) : null;
  const handleOpenPack = useCallback(() => {
    playPackSound();
    const result = openPack(currentSet.cards, pityCounter[selectedSet], currentSet.ticketCards);
    setPackCards(result.cards);
    setPityCounter(prev => ({ ...prev, [selectedSet]: result.pityCounter }));
    setFlipped(new Array(8).fill(false));
    setAllFlipped(false);
    setView("pack");
    setMultiResults(null);
    const newStats = { ...stats, total: stats.total + 1 };
    result.cards.forEach(c => {
      if (c.isTicket) newStats.tickets++;
      else newStats[RARITIES[c.rarityIdx]]++;
      if (c.animated) newStats.animated++;
    });
    setStats(newStats);
    setHistory(prev => [{
      set: currentSet.name, setCode: currentSet.code, cards: result.cards, packNum: stats.total + 1,
    }, ...prev].slice(0, 50));
  }, [currentSet, pityCounter, stats, playPackSound]);
  const handleNextPack = useCallback(() => {
    setPackCards(null);
    setFlipped([]);
    setAllFlipped(false);
    setTimeout(() => {
      handleOpenPack();
    }, 50);
  }, [handleOpenPack]);

  const handleFlipCard = useCallback((idx) => {
    if (flipped[idx]) return;
    if (packCards) playFlipSound(packCards[idx].rarityIdx);
    setFlipped(prev => {
      const n = [...prev]; n[idx] = true;
      if (n.every(Boolean)) setAllFlipped(true);
      return n;
    });
  }, [flipped, packCards, playFlipSound]);

  const handleFlipAll = useCallback(() => {
    if (!packCards) return;
    packCards.forEach((c, i) => {
      setTimeout(() => {
        playFlipSound(c.rarityIdx);
        setFlipped(prev => {
          const n = [...prev]; n[i] = true;
          if (n.every(Boolean)) setAllFlipped(true);
          return n;
        });
      }, i * 100);
    });
  }, [packCards, playFlipSound]);

  const handleMultiOpen = useCallback(() => {
    playPackSound();
    let currentPity = pityCounter[selectedSet];
    const allCards = [];
    const newStats = { ...stats };
    const newHist = [...history];
    for (let p = 0; p < multiCount; p++) {
      const result = openPack(currentSet.cards, currentPity, currentSet.ticketCards);
      currentPity = result.pityCounter;
      allCards.push(result.cards);
      newStats.total++;
      result.cards.forEach(c => {
        if (c.isTicket) newStats.tickets++;
        else newStats[RARITIES[c.rarityIdx]]++;
        if (c.animated) newStats.animated++;
      });
      newHist.unshift({ set: currentSet.name, setCode: currentSet.code, cards: result.cards, packNum: newStats.total });
    }
    setPityCounter(prev => ({ ...prev, [selectedSet]: currentPity }));
    setStats(newStats);
    setHistory(newHist.slice(0, 100));
    setMultiResults(allCards);
    setPackCards(null);
    setView("multi");
  }, [multiCount, currentSet, pityCounter, stats, history, playPackSound]);

  const resetAll = () => {
    if (!window.confirm("Reset all stats, history and pity counters for this profile? This cannot be undone.")) return;
    setPackCards(null); setMultiResults(null); setPityCounter(Object.keys(SETS).reduce((acc, key) => { acc[key] = 0; return acc; }, {}));
    setStats({ total: 0, Bronze: 0, Silver: 0, Gold: 0, Legendary: 0, animated: 0, tickets: 0 });
    setHistory([]); setFlipped([]); setAllFlipped(false); setView("pack");
  };

  const handleImportCSV = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 1024 * 1024) { alert("File too large. Maximum size is 1MB."); return; }
  const reader = new FileReader();
  reader.onload = (evt) => {
    const lines = evt.target.result.split("\n").filter(l => l.trim());
    const parsed = {};
    const unknown = [];
    lines.slice(1).forEach(line => {
      const cols = [];
      let current = "", inQuotes = false;
      for (const ch of line) {
        if (ch === '"') { inQuotes = !inQuotes; }
        else if (ch === ',' && !inQuotes) { cols.push(current); current = ""; }
        else { current += ch; }
      }
      cols.push(current);
      const name = cols[0]?.trim();
      const copies = parseInt(cols[3]) || 0;
      if (!name || copies <= 0) return;
      let found = null;
      for (const set of Object.values(SETS)) {
        const match = set.cards.find(c => c[0] === name);
        if (match) { found = match; break; }
      }
      if (!found) { unknown.push(name); return; }
      const key = `${name}|${found[1]}|${found[2]}`;
      parsed[key] = { name, classIdx: found[1], rarityIdx: found[2], count: copies, animCount: parseInt(cols[4]) || 0, cardId: found[4] };
    });
    if (Object.keys(parsed).length === 0) {
      alert(`No valid cards found.${unknown.length ? ` Unknown cards: ${unknown.join(", ")}` : ""}`);
      return;
    }
    const historyHasCards = history.length > 0;
    const hasExisting = Object.keys(importedCollection).length > 0 || historyHasCards;
    if (hasExisting) {
      setPendingImport({ parsed, unknown });
      setShowImportModal(true);
    } else {
      setImportedCollection(parsed);
      if (unknown.length) alert(`Imported successfully. Skipped unknown cards: ${unknown.join(", ")}`);
    }
  };
  reader.readAsText(file);
  e.target.value = "";
};

  const switchProfile = (name) => {
    if (name === "__new__") {
      const newName = window.prompt("Enter a name for the new profile:");
      if (!newName || !newName.trim()) return;
      const trimmed = newName.trim();
      const profiles = loadProfiles();
      if (Object.keys(profiles).length >= MAX_PROFILES) {
        alert("Maximum number of profiles reached (20).");
        return;
      }
      if (!profiles[trimmed]) profiles[trimmed] = blankProfile();
      saveProfiles(profiles);
      loadProfile(trimmed);
    } else {
      loadProfile(name);
    }
  };

  const loadProfile = (name) => {
    const profiles = loadProfiles();
    const data = profiles[name] || blankProfile();
    setActiveProfile(name);
    setSelectedSet(data.selectedSet);
    setPityCounter(data.pityCounter);
    setStats(data.stats);
    setHistory(data.history);
    setImportedCollection(data.importedCollection || {});
    setPackCards(null);
    setMultiResults(null);
    setFlipped([]);
    setAllFlipped(false);
    setView("pack");
  };

  const exportHistory = useCallback(() => {
    if (history.length === 0) return;
    const rows = [["Pack #", "Set", "Slot", "Card Name", "Class", "Rarity", "Animated", "Exchange Ticket"].join(",")];
    history.slice().reverse().forEach((pack) => {
      pack.cards.forEach((c, ci) => {
        rows.push([
          pack.packNum,
          `"${pack.set}"`,
          ci + 1,
          `"${c.name}"`,
          CLASSES[c.classIdx],
          RARITIES[c.rarityIdx],
          c.animated ? "Yes" : "No",
          c.isTicket ? "Yes" : "No",
        ].join(","));
      });
    });
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `svwb-pulls-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [history]);

  const exportCollection = useCallback(() => {
    if (history.length === 0) return;
    const collection = {};
    history.forEach((pack) => {
      pack.cards.forEach((c) => {
        const key = `${c.name}|${c.classIdx}|${c.rarityIdx}`;
        if (!collection[key]) collection[key] = { ...c, count: 0, animCount: 0 };
        collection[key].count++;
        if (c.animated) collection[key].animCount++;
      });
    });
    const sorted = Object.values(collection).sort((a, b) => b.rarityIdx - a.rarityIdx || a.classIdx - b.classIdx || a.name.localeCompare(b.name));
    const rows = [["Card Name", "Class", "Rarity", "Copies", "Animated Copies"].join(",")];
    sorted.forEach(c => {
      rows.push([
        `"${c.name}"`,
        CLASSES[c.classIdx],
        RARITIES[c.rarityIdx],
        c.count,
        c.animCount,
      ].join(","));
    });
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `svwb-collection-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [history]);

  // Card count summary for current set
  const setCardCounts = {};
  RARITIES.forEach((r, i) => { setCardCounts[r] = getCardsByRarity(currentSet.cards, i).length; });

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 20% 50%, #0a0a1a 0%, #0f1628 50%, #0a0a1a 100%)", color: "#e0e0e0", fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 820, padding: "0 16px" }}>
      {/* ═══ HEADER ═══ */}
      <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
        <h1 style={{
          fontSize: "clamp(16px, 4vw, 26px)", fontWeight: 800, margin: 0,
          background: "linear-gradient(135deg, #FFD700, #FF6B35, #FFD700)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: "1.5px", textTransform: "uppercase",
        }}>
          ✦ Pack Opening Simulator ✦
        </h1>
        <p style={{ fontSize: 11, opacity: 0.4, margin: "2px 0 0" }}>Shadowverse: Worlds Beyond · Official rates</p>
      </div>

      {/* ═══ PROFILE SWITCHER ═══ */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, padding: "8px 0 4px" }}>
        <span style={{ fontSize: 11, opacity: 0.5 }}>Profile:</span>
        <select
          value={activeProfile}
          onChange={e => switchProfile(e.target.value)}
          style={{
            background: "#1a1a2e", color: "#fff", border: "1px solid #444",
            borderRadius: 6, padding: "3px 8px", fontSize: 11, cursor: "pointer",
          }}>
          {Object.keys(loadProfiles()).length === 0
            ? <option value="Default">Default</option>
            : Object.keys(loadProfiles()).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
          <option value="__new__">+ New Profile</option>
        </select>
        {activeProfile !== "Default" && (
          <button onClick={() => {
            if (!window.confirm(`Delete profile "${activeProfile}"? This cannot be undone.`)) return;
            const profiles = loadProfiles();
            delete profiles[activeProfile];
            saveProfiles(profiles);
            loadProfile(Object.keys(profiles)[0] || "Default");
          }} style={{
            background: "transparent", border: "1px solid #e63946",
            color: "#e63946", borderRadius: 6, padding: "3px 8px",
            fontSize: 11, cursor: "pointer",
          }}>✕</button>
        )}
      </div>

      {/* ═══ SET SELECTOR ═══ */}
      <div style={{ display: "flex", gap: 5, padding: "8px 0 10px", overflowX: "auto", justifyContent: "center", flexWrap: "wrap" }}>
        {Object.entries(SETS).reverse().map(([key, set]) => (
          <button key={key} onClick={() => { setSelectedSet(key); setPackCards(null); setMultiResults(null); setView("pack"); }}
            style={{
              padding: "5px 12px", borderRadius: 20, border: selectedSet === key ? `2px solid ${set.color}` : "1px solid #333",
              background: selectedSet === key ? `${set.color}22` : "transparent",
              color: selectedSet === key ? set.color : "#666", fontSize: 11, fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
            }}>
            {set.name}
          </button>
        ))}
      </div>

      {/* ═══ SET INFO + STATS BAR ═══ */}
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center", gap: 12,
        padding: "0 0 8px", fontSize: 10, flexWrap: "wrap", opacity: 0.7,
      }}>
        <span style={{ color: currentSet.color, fontWeight: 600 }}>{currentSet.code}</span>
        <span>{currentSet.cards.length} cards</span>
        <span style={{ color: "#FFD700" }}>⏱ Pity: {pityCounter[selectedSet]}/{RATES.pityInterval}</span>
        <span>Opened: {stats.total}</span>
        <span style={{ color: RARITY_COLORS[3] }}>★{stats.Legendary}</span>
        <span style={{ color: RARITY_COLORS[2] }}>◆{stats.Gold}</span>
        <button onClick={() => setShowRates(!showRates)} style={{
          background: "none", border: "1px solid #444", borderRadius: 4, color: "#888",
          fontSize: 9, padding: "1px 6px", cursor: "pointer",
        }}>Rates</button>
      </div>

      {/* ═══ RATES PANEL ═══ */}
      {showRates && (
        <div style={{ margin: "0 0 10px", padding: 12, background: "#0d0d1e", borderRadius: 10, border: "1px solid #333", fontSize: 10 }}>
          <div style={{ fontWeight: 700, marginBottom: 6, color: currentSet.color }}>Official Pack Rates</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4, opacity: 0.6 }}>Cards 1–7</div>
              <div>Bronze: 67.44%</div>
              <div>Silver: 25%</div>
              <div>Gold: 6%</div>
              <div>Legendary: 1.5%</div>
              <div style={{ opacity: 0.5 }}>Exchange Ticket: 0.06%</div>
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4, opacity: 0.6 }}>8th Card (Silver+)</div>
              <div>Silver: 92.44%</div>
              <div>Gold: 6%</div>
              <div>Legendary: 1.5%</div>
              <div style={{ opacity: 0.5 }}>Exchange Ticket: 0.06%</div>
            </div>
          </div>
          <div style={{ marginTop: 8, opacity: 0.5 }}>
            Pity: Guaranteed Legendary every 10 packs · 8% animated chance
          </div>
        </div>
      )}

      {/* ═══ NAV TABS ═══ */}
      <div style={{ display: "flex", justifyContent: "center", gap: 4, padding: "0 0 10px" }}>
        {[["pack", "🃏 Open"], ["multi", "📦 Multi"], ["history", "📋 History"], ["collection", "📚 Collection"]].map(([v, label]) => (
          <button key={v} onClick={() => { setView(v); setShowStats(false); }}
            style={{
              padding: "5px 16px", borderRadius: 6,
              border: view === v ? `1px solid ${currentSet.color}` : "1px solid #282838",
              background: view === v ? `${currentSet.color}18` : "#0d0d1e",
              color: view === v ? "#fff" : "#666", fontSize: 12, fontWeight: view === v ? 600 : 400, cursor: "pointer",
            }}>
            {label}
          </button>
        ))}
        <button onClick={() => setShowStats(!showStats)}
          style={{
            padding: "5px 16px", borderRadius: 6,
            border: showStats ? `1px solid ${currentSet.color}` : "1px solid #282838",
            background: showStats ? `${currentSet.color}18` : "#0d0d1e",
            color: showStats ? "#fff" : "#666", fontSize: 12, cursor: "pointer",
          }}>
          📊 Stats
        </button>
      </div>

      {/* ═══ STATS OVERLAY ═══ */}
      {showStats && (
        <div style={{ margin: "0 0 12px", padding: 14, background: "#0d0d1e", borderRadius: 10, border: "1px solid #333" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: currentSet.color }}>Session Statistics</span>
            <button onClick={resetAll} style={{
              padding: "3px 10px", borderRadius: 4, border: "1px solid #e63946",
              background: "transparent", color: "#e63946", fontSize: 10, cursor: "pointer",
            }}>Reset All</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 6 }}>
            {RARITIES.map((r, i) => {
              const count = stats[r];
              const totalCards = stats.total * 8;
              const rate = totalCards > 0 ? ((count / totalCards) * 100).toFixed(1) : "—";
              const expected = i === 3 ? "1.5" : i === 2 ? "6.0" : i === 1 ? "25.0" : "67.4";
              return (
                <div key={r} style={{ background: "#111", padding: 8, borderRadius: 8, textAlign: "center" }}>
                  <div style={{ color: RARITY_COLORS[i], fontWeight: 700, fontSize: 18 }}>{count}</div>
                  <div style={{ fontSize: 10, opacity: 0.7 }}>{r}</div>
                  <div style={{ fontSize: 9, opacity: 0.5 }}>{rate}% <span style={{ opacity: 0.4 }}>/ {expected}%</span></div>
                </div>
              );
            })}
            <div style={{ background: "#111", padding: 8, borderRadius: 8, textAlign: "center" }}>
              <div style={{ color: "#00BCD4", fontWeight: 700, fontSize: 18 }}>{stats.animated}</div>
              <div style={{ fontSize: 10, opacity: 0.7 }}>Animated</div>
              <div style={{ fontSize: 9, opacity: 0.5 }}>
                {stats.total * 8 > 0 ? ((stats.animated / (stats.total * 8)) * 100).toFixed(1) : "—"}% / 8.0%
              </div>
            </div>
            {stats.tickets > 0 && (
              <div style={{ background: "#111", padding: 8, borderRadius: 8, textAlign: "center" }}>
                <div style={{ color: "#FF4500", fontWeight: 700, fontSize: 18 }}>{stats.tickets}</div>
                <div style={{ fontSize: 10, opacity: 0.7 }}>Tickets</div>
              </div>
            )}
          </div>
          <div style={{ marginTop: 8, fontSize: 10, opacity: 0.4, textAlign: "center" }}>
            Total packs: {stats.total} · Total cards: {stats.total * 8}
          </div>
        </div>
      )}

      {/* ═══ MAIN CONTENT ═══ */}
      <div style={{ padding: "0 0 24px" }}>
        {/* ── SINGLE PACK VIEW ── */}
        {view === "pack" && (
          <>
            {packCards ? (
              <div>
                <div style={{
                  display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10,
                  maxWidth: 600, margin: "0 auto 14px",
                  boxShadow: packHighlight === "ticket" ? "0 0 40px #FFD70099, 0 0 80px #FFD70044"
                          : packHighlight === "legendary" ? "0 0 40px #FF450066, 0 0 80px #9C27B044"
                          : packHighlight === "gold" ? "0 0 30px #FFD70044"
                          : "none",
                  transition: "box-shadow 0.5s ease",
                }}>
                  {packCards.map((card, i) => (
                    <PackCard key={i} card={card} flipped={flipped[i]} onClick={() => handleFlipCard(i)} setColor={currentSet.color} />
                  ))}
                </div>
                <div style={{ textAlign: "center", display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                  {!allFlipped && (
                    <button onClick={handleFlipAll} style={{
                      padding: "8px 24px", borderRadius: 8, border: "1px solid #444",
                      background: "#1a1a2e", color: "#ccc", fontSize: 13, cursor: "pointer",
                    }}>Flip All</button>
                  )}
                  <button onClick={handleNextPack} disabled={!allFlipped} style={{
                    padding: "8px 28px", borderRadius: 8, border: "none",
                    background: allFlipped
                      ? `linear-gradient(135deg, ${currentSet.color}, ${currentSet.color}cc)`
                      : "#222",
                    color: allFlipped ? "#fff" : "#666", fontSize: 13, fontWeight: 700, cursor: "pointer",
                    boxShadow: allFlipped ? `0 4px 20px ${currentSet.color}33` : "none",
                    transition: "all 0.3s",
                  }}>Next Pack</button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "50px 0" }}>
                <div style={{
                  width: 100, height: 140, margin: "0 auto 20px", borderRadius: 12,
                  background: `linear-gradient(135deg, ${currentSet.color}33, #1a1a2e, ${currentSet.color}22)`,
                  border: `2px solid ${currentSet.color}66`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
                  boxShadow: `0 8px 40px ${currentSet.color}22`,
                }}>
                  <div style={{ fontSize: 32, marginBottom: 4 }}>✦</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: currentSet.color }}>{currentSet.code}</div>
                </div>
                <div style={{ fontSize: 15, marginBottom: 4, color: currentSet.color, fontWeight: 700 }}>{currentSet.name}</div>
                <div style={{ fontSize: 11, opacity: 0.4, marginBottom: 24 }}>
                  {currentSet.cards.length} cards · {setCardCounts.Bronze}B / {setCardCounts.Silver}S / {setCardCounts.Gold}G / {setCardCounts.Legendary}L
                </div>
                <button onClick={handleOpenPack} style={{
                  padding: "14px 52px", borderRadius: 12, border: "none",
                  background: `linear-gradient(135deg, ${currentSet.color}, ${currentSet.color}bb)`,
                  color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
                  boxShadow: `0 6px 30px ${currentSet.color}44`,
                  transition: "transform 0.1s",
                }}>
                  Open Pack
                </button>
              </div>
            )}
          </>
        )}

        {/* ── COLLECTION VIEW ── */}
        {view === "collection" && (
          <div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 12, flexWrap: "wrap" }}>
              <label style={{
                padding: "6px 16px", borderRadius: 6, border: "1px solid #444",
                background: "#1a1a2e", color: "#ccc", fontSize: 11, fontWeight: 600, cursor: "pointer",
              }}>
                📥 Import Collection (CSV)
                <input type="file" accept=".csv" onChange={handleImportCSV} style={{ display: "none" }} />
              </label>
              <button onClick={exportCollection} style={{
                padding: "6px 16px", borderRadius: 6, border: "1px solid #444",
                background: "#1a1a2e", color: "#ccc", fontSize: 11, fontWeight: 600, cursor: "pointer",
              }}>
                📤 Export Collection (CSV)
              </button>
            </div>
            {history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "50px 0", opacity: 0.4 }}>
                No cards yet — open some packs!
              </div>
            ) : (() => {
              const collection = {};
              history.forEach(pack => {
                pack.cards.forEach(c => {
                  const key = `${c.name}|${c.classIdx}|${c.rarityIdx}`;
                  if (!collection[key]) collection[key] = { ...c, count: 0, animCount: 0 };
                  collection[key].count++;
                  if (c.animated) collection[key].animCount++;
                });
              });
              Object.entries(importedCollection).forEach(([key, val]) => {
                if (collection[key]) {
                  collection[key].count += val.count;
                  collection[key].animCount += val.animCount;
                } else {
                  collection[key] = { ...val };
                }
              });
              const filtered = Object.values(collection)
                .filter(c => collectionSetFilter === "all" || history.some(p => p.setCode === collectionSetFilter && p.cards.some(pc => pc.name === c.name)))
                .filter(c => collectionRarityFilter === "all" || RARITIES[c.rarityIdx] === collectionRarityFilter)
                .filter(c => collectionClassFilter === "all" || CLASSES[c.classIdx] === collectionClassFilter)
                .filter(c => collectionTypeFilter === "all" || getCardType(c.cardId) === collectionTypeFilter)
                .filter(c => collectionPPFilter === "all" || c.pp === parseInt(collectionPPFilter))
                .sort((a, b) => b.rarityIdx - a.rarityIdx || a.name.localeCompare(b.name));
              return (
                <div>
                  {/* Filters */}
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8, justifyContent: "center" }}>
                    {[["all", "All Sets"], ...Object.entries(SETS).reverse().map(([k, s]) => [s.code, s.name])].map(([val, label]) => (
                      <button key={val} onClick={() => setCollectionSetFilter(val)} style={{
                        padding: "4px 10px", borderRadius: 20, fontSize: 10, cursor: "pointer",
                        border: collectionSetFilter === val ? `1px solid ${currentSet.color}` : "1px solid #333",
                        background: collectionSetFilter === val ? `${currentSet.color}22` : "transparent",
                        color: collectionSetFilter === val ? currentSet.color : "#666",
                      }}>{label}</button>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12, justifyContent: "center" }}>
                    {["all", ...RARITIES].map(r => (
                      <button key={r} onClick={() => setCollectionRarityFilter(r)} style={{
                        padding: "4px 10px", borderRadius: 20, fontSize: 10, cursor: "pointer",
                        border: collectionRarityFilter === r ? `1px solid ${RARITY_COLORS[RARITIES.indexOf(r)] || currentSet.color}` : "1px solid #333",
                        background: collectionRarityFilter === r ? `${RARITY_COLORS[RARITIES.indexOf(r)] || currentSet.color}22` : "transparent",
                        color: collectionRarityFilter === r ? (RARITY_COLORS[RARITIES.indexOf(r)] || currentSet.color) : "#666",
                      }}>{r === "all" ? "All Rarities" : r}</button>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12, justifyContent: "center" }}>
                    {["all", ...CLASSES].map(cl => (
                      <button key={cl} onClick={() => setCollectionClassFilter(cl)} style={{
                        padding: "4px 10px", borderRadius: 20, fontSize: 10, cursor: "pointer",
                        border: collectionClassFilter === cl ? `1px solid ${currentSet.color}` : "1px solid #333",
                        background: collectionClassFilter === cl ? `${currentSet.color}22` : "transparent",
                        color: collectionClassFilter === cl ? currentSet.color : "#666",
                      }}>{cl === "all" ? "All Classes" : `${CLASS_ICONS[CLASSES.indexOf(cl)]} ${cl}`}</button>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8, justifyContent: "center" }}>
                    {["all", "Follower", "Amulet", "Spell"].map(t => (
                      <button key={t} onClick={() => setCollectionTypeFilter(t)} style={{
                        padding: "4px 10px", borderRadius: 20, fontSize: 10, cursor: "pointer",
                        border: collectionTypeFilter === t ? `1px solid ${currentSet.color}` : "1px solid #333",
                        background: collectionTypeFilter === t ? `${currentSet.color}22` : "transparent",
                        color: collectionTypeFilter === t ? currentSet.color : "#666",
                      }}>{t === "all" ? "All Types" : t}</button>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8, justifyContent: "center" }}>
                    {["all", ...Array.from(new Set(Object.values(SETS).flatMap(s => s.cards.map(c => c[3])))).filter(Boolean).sort((a,b) => a-b)].map(pp => (
                      <button key={pp} onClick={() => setCollectionPPFilter(pp === "all" ? "all" : String(pp))} style={{
                        padding: "4px 10px", borderRadius: 20, fontSize: 10, cursor: "pointer",
                        border: collectionPPFilter === (pp === "all" ? "all" : String(pp)) ? `1px solid ${currentSet.color}` : "1px solid #333",
                        background: collectionPPFilter === (pp === "all" ? "all" : String(pp)) ? `${currentSet.color}22` : "transparent",
                        color: collectionPPFilter === (pp === "all" ? "all" : String(pp)) ? currentSet.color : "#666",
                      }}>{pp === "all" ? "All PP" : `${pp}PP`}</button>
                    ))}
                  </div>
                  {/* Card list */}
                  <div style={{ fontSize: 10, opacity: 0.4, marginBottom: 8, textAlign: "center" }}>{filtered.reduce((sum, c) => sum + c.count, 0)} cards</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {filtered.map((c, i) => (
                      <div key={i} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "6px 10px", borderRadius: 8, background: "#0d0d1e",
                        border: `1px solid ${RARITY_COLORS[c.rarityIdx]}22`,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ color: RARITY_COLORS[c.rarityIdx], fontSize: 9 }}>{"●".repeat(c.rarityIdx + 1)}</span>
                          <span style={{ color: RARITY_COLORS[c.rarityIdx], fontWeight: c.rarityIdx >= 2 ? 600 : 400 }}>
                            {c.cardId
                              ? <a href={`https://shadowverse-wb.com/en/deck/cardslist/card/?card_id=${c.cardId}`}
                                  target="_blank" rel="noopener noreferrer"
                                  style={{ color: "inherit", textDecoration: "underline", cursor: "pointer" }}>
                                  {c.name}
                                </a>
                              : c.name}
                          </span>
                          <span style={{ opacity: 0.4, fontSize: 10 }}>{CLASS_ICONS[c.classIdx]}</span>
                        </div>
                        <div style={{ display: "flex", gap: 8, fontSize: 10 }}>
                          {c.animCount > 0 && <span style={{ color: "#00BCD4" }}>✦{c.animCount}</span>}
                          <span style={{ opacity: 0.6 }}>×{c.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ── MULTI PACK VIEW ── */}
        {view === "multi" && (
          <div>
            <div style={{
              display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 14,
              flexWrap: "wrap",
            }}>
              <span style={{ fontSize: 12 }}>Packs:</span>
              <input type="range" min={1} max={100} value={multiCount}
                onChange={e => setMultiCount(+e.target.value)}
                style={{ width: 130, accentColor: currentSet.color }} />
              <span style={{ fontSize: 16, fontWeight: 700, color: currentSet.color, minWidth: 32, textAlign: "center" }}>{multiCount}</span>
              <button onClick={handleMultiOpen} style={{
                padding: "8px 22px", borderRadius: 8, border: "none",
                background: `linear-gradient(135deg, ${currentSet.color}, ${currentSet.color}cc)`,
                color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
              }}>
                Open {multiCount}×
              </button>
            </div>
            {multiResults && (() => {
              const summary = { 0: 0, 1: 0, 2: 0, 3: 0, anim: 0 };
              const legendaries = [];
              const golds = [];
              multiResults.forEach(pack => pack.forEach(c => {
                summary[c.rarityIdx]++;
                if (c.animated) summary.anim++;
                if (c.rarityIdx === 3) legendaries.push(c);
                else if (c.rarityIdx === 2) golds.push(c);
              }));
              return (
                <div style={{ background: "#0d0d1e", borderRadius: 10, padding: 14, border: "1px solid #333" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: currentSet.color }}>
                    {multiResults.length} Packs · {multiResults.length * 8} Cards
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 11, marginBottom: 10 }}>
                    {RARITIES.map((r, i) => (
                      <span key={r} style={{ color: RARITY_COLORS[i], fontWeight: 600 }}>
                        {r}: {summary[i]}
                      </span>
                    ))}
                    <span style={{ color: "#00BCD4" }}>Animated: {summary.anim}</span>
                  </div>
                  {legendaries.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, color: RARITY_COLORS[3] }}>
                        ★ Legendaries ({legendaries.length})
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {legendaries.map((c, i) => (
                          <span key={i} style={{
                            display: "inline-flex", alignItems: "center", gap: 3,
                            padding: "3px 8px", borderRadius: 10, fontSize: 10,
                            background: `${RARITY_COLORS[3]}15`, border: `1px solid ${RARITY_COLORS[3]}44`,
                            color: RARITY_COLORS[3],
                          }}>
                            {CLASS_ICONS[c.classIdx]} {c.cardId
                                          ? <a href={`https://shadowverse-wb.com/en/deck/cardslist/card/?card_id=${c.cardId}`}
                                              target="_blank" rel="noopener noreferrer"
                                              style={{ color: "inherit", textDecoration: "underline", cursor: "pointer" }}>
                                              {c.name}
                                            </a>
                                          : c.name} {c.isTicket ? "🎫" : c.animated ? "✦" : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {golds.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, color: RARITY_COLORS[2] }}>
                        ◆ Golds ({golds.length})
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {golds.map((c, i) => (
                          <span key={i} style={{
                            display: "inline-flex", alignItems: "center", gap: 3,
                            padding: "2px 7px", borderRadius: 10, fontSize: 9,
                            background: `${RARITY_COLORS[2]}10`, border: `1px solid ${RARITY_COLORS[2]}33`,
                            color: RARITY_COLORS[2],
                          }}>
                            {CLASS_ICONS[c.classIdx]} {c.cardId
                                          ? <a href={`https://shadowverse-wb.com/en/deck/cardslist/card/?card_id=${c.cardId}`}
                                              target="_blank" rel="noopener noreferrer"
                                              style={{ color: "inherit", textDecoration: "underline", cursor: "pointer" }}>
                                              {c.name}
                                            </a>
                                          : c.name} {c.isTicket ? "🎫" : c.animated ? "✦" : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* ── HISTORY VIEW ── */}
        {view === "history" && (
          <div>
            {history.length > 0 && (
              <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 12, flexWrap: "wrap" }}>
                <button onClick={exportHistory} style={{
                  padding: "6px 16px", borderRadius: 6, border: "1px solid #444",
                  background: "#1a1a2e", color: "#ccc", fontSize: 11, fontWeight: 600, cursor: "pointer",
                }}>
                  📥 Export Pull Log (CSV)
                </button>
              </div>
            )}
            <div style={{ maxHeight: 520, overflowY: "auto" }}>
            {history.length === 0 ? (
              <div style={{ textAlign: "center", padding: 50, opacity: 0.4, fontSize: 13 }}>No packs opened yet</div>
            ) : history.map((pack, pi) => {
              const hasLegendary = pack.cards.some(c => c.rarityIdx === 3);
              const hasGold = pack.cards.some(c => c.rarityIdx === 2);
              return (
                <div key={pi} style={{
                  background: "#0d0d1e", borderRadius: 8, padding: "8px 10px", marginBottom: 5,
                  border: hasLegendary ? `1px solid ${RARITY_COLORS[3]}44` : hasGold ? `1px solid ${RARITY_COLORS[2]}22` : "1px solid #1a1a2e",
                }}>
                  <div style={{ fontSize: 9, opacity: 0.4, marginBottom: 3 }}>
                    Pack #{pack.packNum} · {pack.setCode}
                    {hasLegendary && <span style={{ color: RARITY_COLORS[3], marginLeft: 6 }}>★ LEGENDARY</span>}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                    {pack.cards.map((c, ci) => (
                      <span key={ci} style={{
                        fontSize: 9, padding: "2px 6px", borderRadius: 8,
                        background: `${RARITY_COLORS[c.rarityIdx]}0a`,
                        border: `1px solid ${RARITY_COLORS[c.rarityIdx]}${c.rarityIdx >= 2 ? "44" : "22"}`,
                        color: RARITY_COLORS[c.rarityIdx],
                        fontWeight: c.rarityIdx >= 2 ? 600 : 400,
                      }}>
                        {CLASS_ICONS[c.classIdx]} {c.cardId
                                                    ? <a href={`https://shadowverse-wb.com/en/deck/cardslist/card/?card_id=${c.cardId}`}
                                                        target="_blank" rel="noopener noreferrer"
                                                        style={{ color: "inherit", textDecoration: "underline", cursor: "pointer" }}>
                                                        {c.name}
                                                      </a>
                                                    : c.name}{c.isTicket ? " 🎫" : c.animated ? " ✦" : ""}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          </div>
        )}
      </div>

      {/* ═══ IMPORT MODAL ═══ */}
      {showImportModal && pendingImport && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}>
          <div style={{
            background: "#1a1a2e", border: "1px solid #444", borderRadius: 12,
            padding: 24, maxWidth: 360, width: "90%", textAlign: "center",
          }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Import CSV</div>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 16 }}>
              Your collection already has imported data. What would you like to do?
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => {
                const merged = { ...importedCollection };
                Object.entries(pendingImport.parsed).forEach(([key, val]) => {
                  if (merged[key]) {
                    merged[key] = { ...merged[key], count: merged[key].count + val.count };
                  } else {
                    merged[key] = { ...val };
                  }
                });
                setImportedCollection(merged);
                setShowImportModal(false);
                setPendingImport(null);
                if (pendingImport.unknown.length) alert(`Skipped unknown cards: ${pendingImport.unknown.join(", ")}`);
              }} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #444", background: "#0d0d1e", color: "#fff", fontSize: 12, cursor: "pointer" }}>
                Merge
              </button>
              <button onClick={() => {
                setImportedCollection(pendingImport.parsed);
                setShowImportModal(false);
                setPendingImport(null);
                if (pendingImport.unknown.length) alert(`Skipped unknown cards: ${pendingImport.unknown.join(", ")}`);
              }} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e63946", background: "transparent", color: "#e63946", fontSize: 12, cursor: "pointer" }}>
                Replace
              </button>
              <button onClick={() => { setShowImportModal(false); setPendingImport(null); }}
                style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #444", background: "transparent", color: "#888", fontSize: 12, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

     {/* ═══ FOOTER ═══ */}
<div style={{ textAlign: "center", padding: "8px 0 20px", fontSize: 9, opacity: 0.4, lineHeight: 2 }}>
  Fan-made project · Made by{" "}
  <a href="https://fuchsiathebiscuit.carrd.co/" target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
    Fuchsia the Biscuit
  </a>
  {" "}·{" "}
  <a href="https://github.com/Fuchsia525/svwb-pack-simulator#readme" target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
    About
  </a>
  {" "}· Join the {" "}
  <a href="https://discord.gg/928fVs8U6h" target="_blank" rel="noopener noreferrer"
    style={{ color: "inherit"}}>
    Discord 
  </a>
  {" "}to discuss, suggest features, and report bugs · Open source —{" "}
  <a href="https://github.com/Fuchsia525/svwb-pack-simulator" target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
    GitHub
  </a>
  <br />
  Not affiliated with, endorsed by, or connected to Cygames, Inc. in any way.
  <br />
  Shadowverse: Worlds Beyond™ © Cygames, Inc.
</div>
      </div>
    </div>
  );
}
