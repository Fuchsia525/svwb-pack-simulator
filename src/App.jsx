import { useState, useCallback, useRef } from "react";

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
      ["Fairy Convocation",0,0],["Fay Twinkletoes",0,0],["Capricious Sprite",0,0],["Workin' Grasshopper",0,0],["Elder Sagebrush",0,0],["Deepwood Fairy Beast",0,0],
      ["Good Fairy of the Pond",0,1],["Baby Carbuncle",0,1],["Lambent Cairn",0,1],["Fragrantwood Whispers",0,1],["Aerin, Crystalian Frostward",0,1],
      ["Killer Rhinoceroach",0,2],["Lily, Crystalian Innocence",0,2],["Godwood Staff",0,2],["Glade, Fragrantwood Ward",0,2],["Bayle, Luxglaive Warrior",0,2],
      ["Aria, Lady of the Woods",0,3],["Opulent Rose Queen",0,3],["Amataz, Origin Blader",0,3],
      // ── SWORDCRAFT ──
      ["Ignominious Samurai",1,0],["Ian, Lovebound Knight",1,0],["Lyrala, Luminous Potionwright",1,0],["Hound of War",1,0],["Knightly Rending",1,0],["Ernesta, Peace Hawker",1,0],
      ["Luminous Lancetrooper",1,1],["Luminous Commander",1,1],["Shinobi Squirrel",1,1],["Ironcrown Majesty",1,1],["Luminous Magus",1,1],
      ["Amalia, Luxsteel Paladin",1,2],["Zirconia, Ironcrown Ward",1,2],["Valse, Silent Sniper",1,2],["Jeno, Levin Axeraider",1,2],["Ravening Tentacles",1,2],
      ["Amelia, Silver Captain",1,3],["Albert, Levin Stormsaber",1,3],["Kagemitsu, Enduring Warrior",1,3],
      // ── RUNECRAFT ──
      ["Stormy Blast",2,0],["Apprentice Astrologer",2,0],["Radiant Rainbow",2,0],["Owl Summoner",2,0],["Starry-Eyed Penguin Wizard",2,0],["Runeblade Conductor",2,0],
      ["Ms. Miranda, Adored Academic",2,1],["Sagelight Teachings",2,1],["Emmylou, Witch of Wonder",2,1],["William, Mysterian Student",2,1],["Snowman Army",2,1],
      ["Penelope, Potions Prodigy",2,2],["Homework Time!",2,2],["Edelweiss, Sagelight Ward",2,2],["Juno, Visionary Alchemist",2,2],["Demonic Call",2,2],
      ["Dimension Climb",2,3],["Kuon, Fivefold Master",2,3],["Anne & Grea, Mysterian Duo",2,3],
      // ── DRAGONCRAFT ──
      ["Calamity Breath",3,0],["Little Dragon Nanny",3,0],["Fledgling Dragonslayer",3,0],["Whitescale Herald",3,0],["Swordsnout Trencher",3,0],["Silvercloud Dragonrider",3,0],
      ["Goldennote Melody",3,1],["Eyfa, Windrider",3,1],["Zell, Windreader",3,1],["Marion, Ravishing Dragonewt",3,1],["Kit, Luxfang Champion",3,1],
      ["Twilight Dragon",3,2],["Liu Feng, Goldennote Ward",3,2],["Genesis Dragon Reborn",3,2],["Fan of Otohime",3,2],["Zahar, Stormwave Dragoon",3,2],
      ["Garyu, Fabled Dragonkin",3,3],["Forte, Blackwing Dragoon",3,3],["Burnite, Anathema of Flame",3,3],
      // ── ABYSSCRAFT ──
      ["Reaper's Deathslash",4,0],["Ghost Juggler",4,0],["Little Miss Bonemancer",4,0],["Nameless Demon",4,0],["Aryll, Moonstruck Vampire",4,0],["Darkseal Demon",4,0],
      ["Shadowcrypt Memorial",4,1],["Vlad, Impaler",4,1],["Mino, Shrewd Reaper",4,1],["Beryl, Nightmare Incarnate",4,1],["Yuna, Occult Hunter",4,1],
      ["Mukan, Shadowcrypt Ward",4,2],["Orthrus, Hellhound Blader",4,2],["Ceres, Blue Rose Maiden",4,2],["Balto, Dusk Bounty Hunter",4,2],["Rage of Serpents",4,2],
      ["Medusa, Venomfang Royalty",4,3],["Cerberus, Hellfire Unleashed",4,3],["Aragavy, Eternal Hunter",4,3],
      // ── HAVENCRAFT ──
      ["Serene Sanctuary",5,0],["Featherfall",5,0],["Radiant Guiding Angel",5,0],["Holy Shieldmaiden",5,0],["Angelic Prism Priestess",5,0],["Mainyu, Darkdweller",5,0],
      ["Maeve, Guardian of Earth",5,1],["Reno, Luxwing Featherfolk",5,1],["Dose of Holiness",5,1],["Darkhaven Grace",5,1],["Sarissa, Luxspear Al-mi'raj",5,1],
      ["Lapis, Shining Seraph",5,2],["Unholy Vessel",5,2],["Skullfane of Demise",5,2],["Ronavero, Darkhaven Ward",5,2],["Pact of the Beast Princess",5,2],
      ["Salefa, Guardian of Water",5,3],["Jeanne, Saintly Knight",5,3],["Rodeo, Anathema of Judgment",5,3],
      // ── PORTALCRAFT ──
      ["Artifact Recharge",6,0],["Puppet Shield",6,0],["Medical-Grade Assassin",6,0],["Elise, Electrifying Inventor",6,0],["Ironheart Hunter",6,0],["Dirk, Metal Mercenary",6,0],
      ["Doomwright Resurgence",6,1],["Noah, Thread of Death",6,1],["Lovestruck Puppeteer",6,1],["Stream of Life",6,1],["Rukina, Resistance Leader",6,1],
      ["Liam, Crazed Creator",6,2],["Sylvia, Garden Executioner",6,2],["Ancient Cannon",6,2],["Alouette, Doomwright Ward",6,2],["Miriam, the Resolute",6,2],
      ["Orchis, Newfound Heart",6,3],["Eudie, Maiden Reborn",6,3],["Ralmia, Sonic Boom",6,3],
      // ── NEUTRAL ──
      ["Ruby, Greedy Cherub",7,0],["Vigilant Detective",7,0],["Goblin Foray",7,0],
      ["Seraphic Tidings",7,1],["Apollo, Heaven's Envoy",7,1],
      ["Divine Thunder",7,2],["Phildau, Lionheart Ward",7,2],
      ["Olivia, Heroic Dark Angel",7,3],["Ruler of Cocytus",7,3],
    ]
  },
  infinity_evolved: {
    name: "Infinity Evolved",
    code: "IE",
    date: "July 17, 2025",
    color: "#457b9d",
    ticketCards: ["Titania, Queen of Fairies", "Filene, Whitefrost Bloom", "Aether, Empyrean Guardian"],
    cards: [
      // FORESTCRAFT
      ["Dwarven Malletman",0,0],["Woodwalkers",0,0],["Wildheart",0,0],
      ["Ambush from Above",0,1],["Fairy Fencer",0,1],["Lionel, Ardent Elf",0,1],
      ["Cynthia, Chivalrous Elf",0,2],["Garden's Allure",0,2],
      ["Titania, Queen of Fairies",0,3],["Lymaga, Untamed Wild",0,3],
      // SWORDCRAFT
      ["Seria, Gunslinger Maid",1,0],["Nightshadow Ninja Master",1,0],["Lucrative Deal",1,0],
      ["Band of Battle Princesses",1,1],["Gelt, Intrepid Vice-Captain",1,1],["Rackhir, Ordinary Knight",1,1],
      ["Rosé, Princess Knight",1,2],["Prim, Princess's Picnic",1,2],
      ["Yurius, Levin Authority",1,3],["Gildaria, Anathema of Peace",1,3],
      // RUNECRAFT
      ["Melvie, Adoring Witch",2,0],["Arcane Archivist",2,0],["Glacial Crash",2,0],
      ["Flames of Chaos",2,1],["Enchanting Perfumer",2,1],["Bergent, Rejected Artes",2,1],
      ["Pascale's Dance",2,2],["Owen, Mysterian Swordsman",2,2],
      ["Lilanthim, Anathema of Edacity",2,3],["Norman, Adamant Alchemist",2,3],
      // DRAGONCRAFT
      ["Soaring Ivory Dragon",3,0],["Call of the Megalorca",3,0],["Wise Guardian Dragon",3,0],
      ["Pyrewyrm Blade",3,1],["Intent Dragonewt Princess",3,1],["Seasoned Merman",3,1],
      ["Neptune, Arbiter of Tides",3,2],["Draconic Strike",3,2],
      ["Fennie, Prismatic Phoenix",3,3],["Filene, Whitefrost Bloom",3,3],
      // ABYSSCRAFT
      ["Cultivator of Malice",4,0],["Ghastly Soiree",4,0],["Ravyn, the Silver Bullet",4,0],
      ["Winged Servants",4,1],["Vuella, the Blastwing",4,1],["Undead Soldier",4,1],
      ["Laura, Cruel Commander",4,2],["Exella, Nocturnal General",4,2],
      ["Charon, Stygian Oarswoman",4,3],["Ginsetsu & Yuzuki, Twin Calamities",4,3],
      // HAVENCRAFT
      ["Damus, Oracle of Malice",5,0],["Luminous Censer",5,0],["Cleric of Crushing",5,0],
      ["Divine Guard",5,1],["Collete, Barrage Exorcist",5,1],["Immaculate Adjudicator",5,1],
      ["Agnes, the Swiftblade",5,2],["Maddening Benison",5,2],
      ["Wilbert, Desolate Paladin",5,3],["Aether, Empyrean Guardian",5,3],
      // PORTALCRAFT
      ["Puppet Cat",6,0],["Artifact Catapult",6,0],["Engineblade Maven",6,0],
      ["Flight of Icarus",6,1],["Vier, Heart Slayer",6,1],["Achim, Lord of Despair",6,1],
      ["Carnelia, Ember of Darkness",6,2],["Synchronous Hearts",6,2],
      ["Karula, Eternal Arts",6,3],["Zwei, Symphonic Heart",6,3],
      // NEUTRAL
      ["Twinblade Goblin",7,0],["Dark Side",7,0],
      ["Cheretta, Angelic Maid",7,1],
      ["Reina, Angelic Partner",7,2],["Hnikar & Jafnhar, Firestorm Duo",7,2],
      ["Grimnir, Heavenly Gale",7,3],["Odin, Twilit Fate",7,3],
    ]
  },
  heirs_omen: {
    name: "Heirs of the Omen",
    code: "HO",
    date: "August 28, 2025",
    color: "#6d597a",
    ticketCards: ["Sinciro, Heir to Usurpation", "Galmieux, Ardor Manifest"],
    cards: [
      // FORESTCRAFT
      ["Devotee of Unkilling",0,0],["Bearer of the Fairy Blade",0,0],["Bestial Swipe",0,0],
      ["Supplicant of Unkilling",0,1],["Greatwood Warrior",0,1],["Hamlet of Unkilling",0,1],
      ["Congregant of Unkilling",0,2],["Eradicating Arrow",0,2],
      ["Krulle, Heir to Unkilling",0,3],["Izudia, Annihilation Manifest",0,3],
      // SWORDCRAFT
      ["Devotee of Usurpation",1,0],["Comrade of the Swordmaster",1,0],["Shield Bash",1,0],
      ["Supplicant of Usurpation",1,1],["Peppy Scout",1,1],["Lair of Usurpation",1,1],
      ["Congregant of Usurpation",1,2],["Returning Slash",1,2],
      ["Sinciro, Heir to Usurpation",1,3],["Octrice, Hollowness Manifest",1,3],
      // RUNECRAFT
      ["Devotee of Truth",2,0],["Ascetic of Wuxing",2,0],["Crystal Gazing",2,0],
      ["Supplicant of Truth",2,1],["Institute of Truth",2,1],["Risky Amalgamation",2,1],
      ["Congregant of Truth",2,2],["Illusory Conjuration",2,2],
      ["Velharia, Heir to Truth",2,3],["Raio, Elimination Manifest",2,3],
      // DRAGONCRAFT
      ["Devotee of Disdain",3,0],["Snowstorm Dragonewt",3,0],["Raging Lightning",3,0],
      ["Supplicant of Disdain",3,1],["Ocean Rider",3,1],["Nation of Disdain",3,1],
      ["Congregant of Disdain",3,2],["Ferocious Flame",3,2],
      ["Azurifrit, Heir to Disdain",3,3],["Galmieux, Ardor Manifest",3,3],
      // ABYSSCRAFT
      ["Devotee of Entwining",4,0],["Ephemeral Demon Princess",4,0],["March of the Brutes",4,0],
      ["Supplicant of Entwining",4,1],["Spirited Gravekeeper",4,1],["Castle of Entwining",4,1],
      ["Congregant of Entwining",4,2],["Screaming and Loathing",4,2],
      ["Sham-Nacha, Heir to Entwining",4,3],["Rulenye & Valnareik",4,3],
      // HAVENCRAFT
      ["Devotee of Repose",5,0],["Knight of the Holy Order",5,0],["Blinding Faith",5,0],
      ["Supplicant of Repose",5,1],["Temple of Repose",5,1],["Winged Lion Statue",5,1],
      ["Congregant of Repose",5,2],["Shining Disenchantment",5,2],
      ["Himeka, Heir to Repose",5,3],["Marwynn, Despair Manifest",5,3],
      // PORTALCRAFT
      ["Devotee of Destruction",6,0],["Supersonic Fighter",6,0],["Wired Assault",6,0],
      ["Supplicant of Destruction",6,1],["Field Scientist",6,1],["Wasteland of Destruction",6,1],
      ["Congregant of Destruction",6,2],["Devastating Soprano",6,2],
      ["Axia, Heir to Destruction",6,3],["Lishenna, Melody Manifest",6,3],
      // NEUTRAL
      ["Apostle of Voracity",7,0],["Greatness Ascended",7,0],
      ["Inspirational One",7,1],
      ["Dogged One",7,2],["Tablet of Tribulations",7,2],
      ["Mjerrabaine, Great Manifest",7,3],["Gilnelise, Voracity Manifest",7,3],
    ]
  },
  skybound_dragons: {
    name: "Skybound Dragons",
    code: "SD",
    date: "October 2025",
    color: "#2a9d8f",
    ticketCards: ["Belial, Archangel of Cunning", "Beelzebub, Supreme King", "Wilnas, Flame Personified", "Wamdus, Water Personified", "Galleon, Earth Personified", "Ewiyar, Wind Personified", "Lu Woh, Light Personified", "Fediel, Darkness Personified"],
    cards: [
      // FORESTCRAFT
      ["Kou & You, Love and Hatred",0,0],["Manamel, Super Cutest",0,0],["Comet Drive",0,0],
      ["Chloe, What a Gal",0,1],["Anthuria, Toe-Tapping Torch",0,1],["Starry Sky",0,1],
      ["Cupitan, Iridescent Archer",0,2],["Alfheimr",0,2],
      ["Ewiyar, Wind Personified",0,3],["Yuel & Societte, Dancing Duo",0,3],
      // SWORDCRAFT
      ["Randall, Feet Fighter",1,0],["Arthur, Staunch Dragon",1,0],["Mordred, Illusory Lion",1,0],
      ["Aglovale, Lord of Frost",1,1],["Feather, Bombastic Brawler",1,1],["Fiorito, Muscles in Bloom",1,1],
      ["Golden Knight, True King's Blade",1,2],["Knightly Ardor",1,2],
      ["Zeta & Bea, Crimson and Blue",1,3],["Seofon, Leader of the Eternals",1,3],
      // RUNECRAFT
      ["Philosophia, Cryptic Sophist",2,0],["Suframare, Wandering Tutor",2,0],["Rune Portal",2,0],
      ["Ezecrain, Portent of Vengeance",2,1],["Mireille & Risette, Penitent Duo",2,1],["Unleashed",2,1],
      ["Elmott, Remembrance Aflame",2,2],["Alchemic Flare",2,2],
      ["Wamdus, Water Personified",2,3],["Cagliostro, Genius Alchemist",2,3],
      // DRAGONCRAFT
      ["Joel, Wave Chaser",3,0],["Mari, Meg's Bestie",3,0],["Crescent Tube Ride",3,0],
      ["Izmir, Frigid Fate",3,1],["Mugen, Steel-Bodied Honesty",3,1],["Maximum Love Bomb",3,1],
      ["Meg, Girl Next Door",3,2],["Primal Beast Absorption",3,2],
      ["Wilnas, Flame Personified",3,3],["Zooey, Ally of the World",3,3],
      // ABYSSCRAFT
      ["Almeida, Headstrong Miner",4,0],["Vaseraga, Unyielding Scythe",4,0],["Valiant Edge",4,0],
      ["Nezha, Soaring War God",4,1],["Satyr, Open-Hearted Rover",4,1],["Baal, Elemental Resonance",4,1],
      ["Nehan, Dispenser of Samsara",4,2],["Corruption",4,2],
      ["Fediel, Darkness Personified",4,3],["Belial, Archangel of Cunning",4,3],
      // HAVENCRAFT
      ["Troue, Heroic Visionary",5,0],["Lamretta, Sisterly Shepherd",5,0],["Awed and Inspired",5,0],
      ["Sara, Graphos's Chosen",5,1],["Sophia, Zeyen Priestess",5,1],["Skyfaring Vessel",5,1],
      ["Tikoh, Asclepian Surgeon",5,2],["De La Fille's Gleaming Gems",5,2],
      ["Galleon, Earth Personified",5,3],["Vira, Luminous Primal Knight",5,3],
      // PORTALCRAFT
      ["Sho, Reborn Night King",6,0],["Tsubasa, Blazing Gearcyclist",6,0],["Isaac, Congenial Engineer",6,0],
      ["Eustace, Howl of Thunder",6,1],["Ilsa, Brutal Drill Sergeant",6,1],["Stone Breaker",6,1],
      ["Cassius, Sky-Yearning Arrival",6,2],["Chaos Legion",6,2],
      ["Lu Woh, Light Personified",6,3],["Beelzebub, Supreme King",6,3],
      // NEUTRAL
      ["Katalina, Sky's Protector",7,0],["Vyrn, Bestest Pal",7,0],
      ["Yuni, Cosmic Legacy",7,1],
      ["Gran & Djeeta, Valiant Skyfarers",7,2],["Lyria, Skydestined",7,2],
      ["Sandalphon, Primarch Successor",7,3],
    ]
  },
  blossoming_fate: {
    name: "Blossoming Fate",
    code: "BF",
    date: "December 28, 2025",
    color: "#e9c46a",
    ticketCards: ["Unkei, Goldbloom", "Imari, Dewdrop"],
    cards: [
      // FORESTCRAFT
      ["Prudent Tanuki",0,0],["Battledore Woodsmaiden",0,0],["Flight of the Swarmpetal",0,0],
      ["Flowering Friendship",0,1],["Fairy Beastwhisperer",0,1],["Quiet Encouragement",0,1],
      ["Spirited Skipper",0,2],["Grace of the Swarmpetal",0,2],
      ["Wolfraud, Skybound Hanged Man",0,3],["Miroku, Swarmpetal",0,3],
      // SWORDCRAFT
      ["Altruistic Aristocrat",1,0],["Smoke-Shrouded Beauty",1,0],["Extravagance of the Goldbloom",1,0],
      ["Swift Staffmaster",1,1],["Amphibian Goldmuncher",1,1],["Serenity's Shield",1,1],
      ["Unmoving Tactician",1,2],["Splendor of the Goldbloom",1,2],
      ["Oluon, Raging Chariot",1,3],["Unkei, Goldbloom",1,3],
      // RUNECRAFT
      ["Terraforming Wizard",2,0],["Waterbending Charmwielder",2,0],["Metamorphosis of the Dawnblossom",2,0],
      ["Insomniac Witch",2,1],["Woodsong Haikumaster",2,1],["Kitty Cunning",2,1],
      ["Emperor of Elements",2,2],["Grandeur of the Dawnblossom",2,2],
      ["Lhynkal, Wandering Fool",2,3],["Ara, Dawnblossom",2,3],
      // DRAGONCRAFT
      ["Springwell Steward",3,0],["Stormy Shamisen Shredder",3,0],["Blade of the Crestpetal",3,0],
      ["Ironmace Dragoon",3,1],["Jellyfish Dancer",3,1],["Roar of Prominence",3,1],
      ["Ruinbringer",3,2],["Sloth of the Crestpetal",3,2],
      ["Erntz, Governing Justice",3,3],["Yube, Crestpetal",3,3],
      // ABYSSCRAFT
      ["Support Wolf",4,0],["Crimson Soulmancer",4,0],["Valor of the Nightblossom",4,0],
      ["Fickle Necromancer",4,1],["Friendly Blue Ogre",4,1],["Tyrannical Fists",4,1],
      ["Lifestealer",4,2],["Rigor of the Nightblossom",4,2],
      ["Milteo & Luzen",4,3],["Shakdoh, Nightblossom",4,3],
      // HAVENCRAFT
      ["Prescient Priestess",5,0],["Bouquet Believer",5,0],["Malice of the Mistbloom",5,0],
      ["Immovable Paladin",5,1],["Desperate Shrinemouse",5,1],["Protective Shell",5,1],
      ["Saint of Rehabilitation",5,2],["Resolve of the Mistbloom",5,2],
      ["Sofina, Inspiring Strength",5,3],["Kukishiro, Mistbloom",5,3],
      // PORTALCRAFT
      ["Marionette Master",6,0],["Flowering Artisan",6,0],["Light of the Dewdrop",6,0],
      ["New-Age Cartographer",6,1],["Lunar Bunny",6,1],["Resurrection Tuner",6,1],
      ["Neuron Disrupter",6,2],["Sincerity of the Dewdrop",6,2],
      ["Slaus, Revolving Wheel of Fortune",6,3],["Imari, Dewdrop",6,3],
      // NEUTRAL - includes Frieren collab cards
      ["Monster Litterateur",7,0],["Goddess of Starlight",7,0],
      ["Behemoth General",7,1],
      ["World of Games",7,2],["Fate of the World",7,2],
      ["Getenou, Eightfold Glory",7,3],
    ]
  },
  apocalypse_pact: {
    name: "Apocalypse Pact",
    code: "AP",
    date: "February 26, 2026",
    color: "#b5451b",
    ticketCards: ["Shymm, Love Bewitched", "Kandima, Sublime Hatred"],
    cards: [
      // FORESTCRAFT
      ["Motherly Forestdweller",0,0],["Monkey of Paradise",0,0],["Advent of the Eld Lance",0,0],
      ["Kindly Executor",0,1],["Howling Wolfman",0,1],["Floral Offering",0,1],
      ["Merciful Attendant",0,2],["Nurturing Eld Lance",0,2],
      ["Althenia, Nurturing Bloom",0,3],["Sathanid, Eld Lance",0,3],
      // SWORDCRAFT
      ["Fearless Soldier",1,0],["Idle Maid",1,0],["Advent of the Eld Sword",1,0],
      ["Loyal Guard",1,1],["Navy Cat",1,1],["Majestic Conquest",1,1],
      ["Heartless Strategist",1,2],["Ruthless Eld Sword",1,2],
      ["Noel IV, Ruthless Warlord",1,3],["Yidmetra, Eld Sword",1,3],
      // RUNECRAFT
      ["Crystalspawn",2,0],["Daydream Librarian",2,0],["Advent of the Eld Crystals",2,0],
      ["Enraptured Student",2,1],["Adventurous Grimoire",2,1],["Reaved Order",2,1],
      ["Spellbound Professor",2,2],["Bewitching Eld Crystals",2,2],
      ["Shymm, Love Bewitched",2,3],["Calge-Danthia, Eld Crystals",2,3],
      // DRAGONCRAFT
      ["Resolute Dragonewt",3,0],["Fruitfish",3,0],["Advent of the Eld Blades",3,0],
      ["Decisive Swordmaster",3,1],["Spiked Dragon",3,1],["Spilling Red",3,1],
      ["Impeding Pugilist",3,2],["Beheading Eld Blades",3,2],
      ["Sagatsumatsu, Fair Beheader",3,3],["Vorlalai, Eld Blades",3,3],
      // ABYSSCRAFT
      ["Reverent Demon",4,0],["Ghost Dodger",4,0],["Advent of the Eld Sight",4,0],
      ["Yearnful Necromancer",4,1],["Devilish Heartbreaker",4,1],["Allure of the Mightiest",4,1],
      ["Deprived Destroyer",4,2],["Depletive Eld Sight",4,2],
      ["Armes, Depletive Demon",4,3],["Bibati, Eld Sight",4,3],
      // HAVENCRAFT
      ["Prostrating Coward",5,0],["Unholy Water",5,0],["Advent of the Eld Tome",5,0],
      ["Venerating Dyer",5,1],["Pegasus Rider",5,1],["Scripture of Salvation",5,1],
      ["Worshipful Crusader",5,2],["Sublime Eld Tome",5,2],
      ["Kandima, Sublime Hatred",5,3],["Lyanthoth, Eld Tome",5,3],
      // PORTALCRAFT
      ["Shoddy Plaything",6,0],["Brilliant Inventor",6,0],["Advent of the Eld Axe",6,0],
      ["Substandard Puppet",6,1],["Timid Pioneer",6,1],["Myriad Designs",6,1],
      ["Ludicrous Ordnance",6,2],["Unfeeling Eld Axe",6,2],
      ["Camiscilia, Unfeeling Heart",6,3],["Yog-Zentha, Eld Axe",6,3],
      // NEUTRAL
      ["Muddled Onlooker",7,0],["Disrupted Commoner",7,0],
      ["Encroached World",7,1],
      ["Beast Lost to the Dark",7,2],["Dark Dimensions",7,2],
      ["Omegotep, the Dreaded One",7,3],
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
    return { name: card[0], classIdx: card[1], rarityIdx: 3, animated: Math.random() < RATES.animatedChance };
  }
  const rates = isGuaranteed ? RATES.guaranteed : RATES.standard;
  const roll = weightedRandom(rates);
  let rarityIdx;
  if (roll === "Ticket") {
    const pool = ticketCards && ticketCards.length > 0
      ? setCards.filter(c => c[2] === 3 && ticketCards.includes(c[0]))
      : getCardsByRarity(setCards, 3);
    const card = pickRandomCard(pool);
    return { name: card[0], classIdx: card[1], rarityIdx: 3, animated: true, isTicket: true };
  }
  else if (roll === "Legendary") rarityIdx = 3;
  else if (roll === "Gold") rarityIdx = 2;
  else if (roll === "Silver") rarityIdx = 1;
  else rarityIdx = 0;

  const pool = getCardsByRarity(setCards, rarityIdx);
  if (pool.length === 0) {
    const fallback = getCardsByRarity(setCards, 0);
    const card = pickRandomCard(fallback);
    return { name: card[0], classIdx: card[1], rarityIdx: 0, animated: Math.random() < RATES.animatedChance };
  }
  const card = pickRandomCard(pool);
  return { name: card[0], classIdx: card[1], rarityIdx, animated: Math.random() < RATES.animatedChance };
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
            {card.name}
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

// ─── MAIN COMPONENT ──────────────────────────────────────────
export default function PackSimulator() {
  const [selectedSet, setSelectedSet] = useState(Object.keys(SETS).at(-1));
  const [packCards, setPackCards] = useState(null);
  const [flipped, setFlipped] = useState([]);
  const [allFlipped, setAllFlipped] = useState(false);
  const [pityCounter, setPityCounter] = useState({
  legends_rise: 0,
  infinity_evolved: 0,
  heirs_omen: 0,
  skybound_dragons: 0,
  blossoming_fate: 0,
  apocalypse_pact: 0,
});
  const [stats, setStats] = useState({ total: 0, Bronze: 0, Silver: 0, Gold: 0, Legendary: 0, animated: 0, tickets: 0 });
  const [multiCount, setMultiCount] = useState(10);
  const [multiResults, setMultiResults] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [history, setHistory] = useState([]);
  const [view, setView] = useState("pack");
  const [showRates, setShowRates] = useState(false);
  const audioCtx = useRef(null);

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
  }, [currentSet, pityCounter, stats]);
  const handleNextPack = useCallback(() => {
  playPackSound();
  setFlipped(new Array(8).fill(false));
  setAllFlipped(false);
  setTimeout(() => {
    handleOpenPack();
  }, 550);
}, [handleOpenPack, playPackSound]);

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
    setPackCards(null); setMultiResults(null); setPityCounter({ legends_rise: 0, infinity_evolved: 0, heirs_omen: 0, skybound_dragons: 0, blossoming_fate: 0, apocalypse_pact: 0 });
    setStats({ total: 0, Bronze: 0, Silver: 0, Gold: 0, Legendary: 0, animated: 0, tickets: 0 });
    setHistory([]); setFlipped([]); setAllFlipped(false); setView("pack");
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
        {[["pack", "🃏 Open"], ["multi", "📦 Multi"], ["history", "📋 History"]].map(([v, label]) => (
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
                  <button onClick={handleNextPack} style={{
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
                            {CLASS_ICONS[c.classIdx]} {c.name} {c.isTicket ? "🎫" : c.animated ? "✦" : ""}
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
                            {CLASS_ICONS[c.classIdx]} {c.name} {c.isTicket ? "🎫" : c.animated ? "✦" : ""}
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
                <button onClick={exportCollection} style={{
                  padding: "6px 16px", borderRadius: 6, border: "1px solid #444",
                  background: "#1a1a2e", color: "#ccc", fontSize: 11, fontWeight: 600, cursor: "pointer",
                }}>
                  📥 Export Collection (CSV)
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
                        {CLASS_ICONS[c.classIdx]} {c.name}{c.isTicket ? " 🎫" : c.animated ? " ✦" : ""}
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
  {" "}· Open source —{" "}
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
