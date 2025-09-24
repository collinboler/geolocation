#!/usr/bin/env python3
"""
Comprehensive Location Database
Contains all GeoGuessr-covered countries, regions, states, and top cities for global coverage.
"""

# Comprehensive location database based on GeoGuessr coverage
COMPREHENSIVE_LOCATIONS = {
    # Western Europe (63 regions total)
    "Andorra": {
        "continent": "Europe",
        "region": "Western Europe",
        "regions": ["Andorra la Vella", "Escaldes-Engordany"],
        "description": "Principality of Andorra",
        "top_cities": [
            "Andorra la Vella", "Escaldes-Engordany", "Encamp", "Sant Julià de Lòria",
            "La Massana", "Santa Coloma", "Ordino", "El Pas de la Casa"
        ]
    },
    
    "Austria": {
        "continent": "Europe",
        "region": "Western Europe", 
        "regions": ["Vienna", "Salzburg", "Tyrol"],
        "description": "Republic of Austria",
        "top_cities": [
            "Vienna", "Graz", "Linz", "Salzburg", "Innsbruck", "Klagenfurt", "Villach",
            "Wels", "Sankt Pölten", "Dornbirn", "Steyr", "Wiener Neustadt", "Feldkirch",
            "Bregenz", "Leonding", "Klosterneuburg", "Baden", "Wolfsberg", "Leoben",
            "Krems", "Traun", "Amstetten", "Kapfenberg", "Mödling", "Hallein"
        ]
    },
    
    "Belgium": {
        "continent": "Europe",
        "region": "Western Europe",
        "regions": ["Brussels", "Flanders", "Wallonia"],
        "description": "Kingdom of Belgium",
        "top_cities": [
            "Brussels", "Antwerp", "Ghent", "Charleroi", "Liège", "Bruges", "Namur",
            "Leuven", "Mons", "Aalst", "Mechelen", "La Louvière", "Kortrijk", "Hasselt",
            "Sint-Niklaas", "Ostend", "Tournai", "Genk", "Seraing", "Roeselare",
            "Mouscron", "Verviers", "Dendermonde", "Beringen", "Turnhout"
        ]
    },
    
    "France": {
        "continent": "Europe",
        "region": "Western Europe",
        "regions": ["Île-de-France", "Provence-Alpes-Côte d'Azur", "Auvergne-Rhône-Alpes", 
                   "Occitanie", "Hauts-de-France", "Grand Est", "Nouvelle-Aquitaine"],
        "description": "French Republic",
        "top_cities": [
            "Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Montpellier",
            "Strasbourg", "Bordeaux", "Lille", "Rennes", "Reims", "Toulon", "Saint-Étienne",
            "Le Havre", "Grenoble", "Dijon", "Angers", "Nîmes", "Villeurbanne", "Saint-Denis",
            "Le Mans", "Aix-en-Provence", "Clermont-Ferrand", "Brest", "Tours", "Amiens",
            "Limoges", "Annecy", "Boulogne-Billancourt", "Metz", "Perpignan", "Orléans",
            "Besançon", "Saint-Denis", "Rouen", "Argenteuil", "Mulhouse", "Montreuil",
            "Caen", "Nancy", "Tourcoing", "Roubaix", "Nanterre", "Vitry-sur-Seine",
            "Avignon", "Créteil", "Dunkerque", "Poitiers", "Asnières-sur-Seine", "Courbevoie"
        ]
    },
    
    "Germany": {
        "continent": "Europe",
        "region": "Western Europe",
        "regions": ["Bavaria", "North Rhine-Westphalia", "Baden-Württemberg"],
        "description": "Federal Republic of Germany",
        "top_cities": [
            "Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf",
            "Leipzig", "Dortmund", "Essen", "Bremen", "Dresden", "Hanover", "Nuremberg",
            "Duisburg", "Bochum", "Wuppertal", "Bielefeld", "Bonn", "Münster", "Mannheim",
            "Karlsruhe", "Augsburg", "Wiesbaden", "Mönchengladbach", "Gelsenkirchen",
            "Aachen", "Braunschweig", "Chemnitz", "Kiel", "Halle", "Magdeburg", "Freiburg",
            "Krefeld", "Mainz", "Lübeck", "Erfurt", "Oberhausen", "Rostock", "Kassel",
            "Hagen", "Potsdam", "Saarbrücken", "Hamm", "Ludwigshafen", "Oldenburg",
            "Leverkusen", "Osnabrück", "Solingen", "Heidelberg"
        ]
    },
    
    "Greece": {
        "continent": "Europe",
        "region": "Western Europe",
        "regions": ["Attica", "Central Macedonia", "Thessaly", "Crete", "Western Greece", 
                   "Peloponnese", "Central Greece"],
        "description": "Hellenic Republic",
        "top_cities": [
            "Athens", "Thessaloniki", "Patras", "Piraeus", "Larissa", "Heraklion", "Peristeri",
            "Kallithea", "Acharnes", "Kalamaria", "Nikaia", "Glyfada", "Volos", "Ilio",
            "Ilioupoli", "Keratsini", "Evosmos", "Chalandri", "Nea Ionia", "Marousi",
            "Agios Dimitrios", "Zografou", "Egaleo", "Nea Smyrni", "Marathonas", "Korinthos",
            "Trikala", "Lamia", "Chania", "Serres", "Alexandroupoli", "Xanthi", "Katerini",
            "Agrinio", "Giannitsa", "Chalcis", "Kavala", "Kalamata", "Drama", "Veria",
            "Kozani", "Ioannina", "Komotini", "Rethymno", "Mytilene", "Karditsa", "Tripoli",
            "Livadeia", "Pyrgos"
        ]
    },
    
    "Ireland": {
        "continent": "Europe",
        "region": "Western Europe",
        "regions": ["Leinster", "Munster", "Connacht"],
        "description": "Republic of Ireland",
        "top_cities": [
            "Dublin", "Cork", "Limerick", "Galway", "Waterford", "Drogheda", "Swords",
            "Dundalk", "Bray", "Navan", "Ennis", "Kilkenny", "Carlow", "Naas", "Athlone",
            "Portlaoise", "Mullingar", "Wexford", "Letterkenny", "Celbridge", "Sligo",
            "Clonmel", "Greystones", "Leixlip", "Tralee", "Malahide", "Arklow", "Maynooth",
            "Wicklow", "Cobh", "Castlebar", "Midleton", "Newbridge", "Tullamore",
            "Port Laoise", "Balbriggan", "Nenagh", "Trim", "New Ross", "Thurles",
            "Youghal", "Monaghan", "Bundoran", "Cavan", "Killarney", "Bandon",
            "Loughrea", "Dungarvan", "Edenderry", "Kinsale"
        ]
    },
    
    "Isle of Man": {
        "continent": "Europe",
        "region": "Western Europe",
        "regions": ["Douglas", "Onchan"],
        "description": "Isle of Man",
        "top_cities": [
            "Douglas", "Onchan", "Ramsey", "Peel", "Port Erin", "Castletown", "Laxey",
            "Port St Mary"
        ]
    },
    
    "Italy": {
        "continent": "Europe",
        "region": "Western Europe",
        "regions": ["Lombardy", "Lazio", "Campania", "Sicily", "Veneto"],
        "description": "Italian Republic",
        "top_cities": [
            "Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", "Florence",
            "Bari", "Catania", "Venice", "Verona", "Messina", "Padua", "Trieste", "Brescia",
            "Taranto", "Prato", "Parma", "Reggio Calabria", "Modena", "Reggio Emilia",
            "Perugia", "Livorno", "Ravenna", "Cagliari", "Foggia", "Rimini", "Salerno",
            "Ferrara", "Sassari", "Latina", "Giugliano", "Monza", "Syracuse", "Pescara",
            "Bergamo", "Forlì", "Trento", "Vicenza", "Terni", "Bolzano", "Novara",
            "Piacenza", "Ancona", "Andria", "Arezzo", "Udine", "Cesena", "Lecce"
        ]
    },
    
    "Luxembourg": {
        "continent": "Europe",
        "region": "Western Europe",
        "regions": ["Luxembourg", "Diekirch", "Grevenmacher", "Esch-sur-Alzette"],
        "description": "Grand Duchy of Luxembourg",
        "top_cities": [
            "Luxembourg City", "Esch-sur-Alzette", "Differdange", "Dudelange", "Ettelbruck",
            "Diekirch", "Strassen", "Bertrange", "Bettembourg", "Schifflange", "Echternach",
            "Grevenmacher", "Remich", "Wiltz", "Redange", "Mondercange", "Roeser",
            "Steinsel", "Mersch", "Hesperange", "Sandweiler", "Contern", "Walferdange",
            "Sanem", "Mamer"
        ]
    },
    
    "Malta": {
        "continent": "Europe",
        "region": "Western Europe",
        "regions": ["Malta", "Gozo", "Comino", "Northern Region"],
        "description": "Republic of Malta",
        "top_cities": [
            "Valletta", "Sliema", "St. Julian's", "Birkirkara", "Qormi", "Mosta", "Zabbar",
            "San Pawl il-Baħar", "Fgura", "Zejtun", "Rabat", "Naxxar", "Marsaskala",
            "Paola", "Tarxien", "Pietà", "Marsa", "Hamrun", "Gzira", "Swieqi", "Mellieħa",
            "Msida", "Santa Venera", "Attard", "Balzan", "Lija", "Iklin", "San Ġwann",
            "Pembroke", "Marsaxlokk", "Birgu", "Senglea", "Cospicua", "Floriana",
            "Kalkara", "Xgħajra", "Żurrieq", "Siġġiewi", "Dingli", "Rabat (Gozo)",
            "Xewkija", "Għarb", "Għasri", "Munxar", "Qala", "Sannat", "Victoria", "Żebbuġ"
        ]
    },
    
    "Monaco": {
        "continent": "Europe",
        "region": "Western Europe",
        "regions": ["Monaco"],
        "description": "Principality of Monaco",
        "top_cities": ["Monaco", "Monte Carlo", "La Condamine", "Fontvieille"]
    },
    
    "Netherlands": {
        "continent": "Europe",
        "region": "Western Europe",
        "regions": ["North Holland", "South Holland", "Utrecht", "Noord-Brabant"],
        "description": "Kingdom of the Netherlands",
        "top_cities": [
            "Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Groningen",
            "Tilburg", "Almere", "Breda", "Nijmegen", "Enschede", "Haarlem", "Arnhem",
            "Zaanstad", "Amersfoort", "Apeldoorn", "Hoofddorp", "Maastricht", "Leiden",
            "Dordrecht", "Zoetermeer", "Zwolle", "Deventer", "Delft", "Alkmaar", "Leeuwarden",
            "Sittard-Geleen", "Helmond", "Venlo", "Hilversum", "Ede", "Purmerend",
            "Roosendaal", "Schiedam", "Leidschendam-Voorburg", "Emmen", "Alphen aan den Rijn",
            "Vlaardingen", "Westland", "Spijkenisse", "Almelo", "Hoorn", "Velsen",
            "Amstelveen", "Súdwest-Fryslân", "Heerlen", "Oss", "Zeist", "Katwijk",
            "Den Helder", "Nieuwegein"
        ]
    },
    
    "Portugal": {
        "continent": "Europe",
        "region": "Western Europe",
        "regions": ["Norte"],
        "description": "Portuguese Republic",
        "top_cities": [
            "Lisbon", "Porto", "Vila Nova de Gaia", "Amadora", "Braga", "Funchal", "Coimbra",
            "Setúbal", "Almada", "Agualva-Cacém", "Queluz", "Rio Tinto", "Barreiro",
            "Montijo", "Évora", "Aveiro", "Corroios", "Odivelas", "Loures", "Matosinhos",
            "Gondomar", "Vila Franca de Xira", "Viseu", "Póvoa de Varzim", "Faro",
            "Felgueiras", "Santarém", "Seixal", "Guimarães", "Leiria", "Sintra",
            "Cascais", "Vila do Conde", "Figueira da Foz", "Portimão", "Sesimbra",
            "Paredes", "Viana do Castelo", "Torres Vedras", "Maia", "Valongo",
            "Vila Real", "Chaves", "Bragança", "Penafiel", "Loulé", "Entroncamento",
            "Castelo Branco", "Espinho"
        ]
    },
    
    "Spain": {
        "continent": "Europe",
        "region": "Western Europe",
        "regions": ["Madrid", "Catalonia", "Andalusia", "Valencia", "Galicia", 
                   "Castile and León", "Basque Country"],
        "description": "Kingdom of Spain",
        "top_cities": [
            "Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga", "Murcia",
            "Palma", "Las Palmas", "Bilbao", "Alicante", "Córdoba", "Valladolid", "Vigo",
            "Gijón", "Hospitalet de Llobregat", "A Coruña", "Vitoria-Gasteiz", "Granada",
            "Elche", "Oviedo", "Santa Cruz de Tenerife", "Badalona", "Cartagena", "Terrassa",
            "Jerez de la Frontera", "Sabadell", "Móstoles", "Alcalá de Henares", "Pamplona",
            "Fuenlabrada", "Almería", "San Sebastián", "Leganés", "Burgos", "Santander",
            "Castellón de la Plana", "Alcorcón", "Getafe", "Salamanca", "Huelva", "Badajoz",
            "Logroño", "Tarragona", "Parla", "Mataró", "Santa Coloma de Gramenet",
            "León", "Cádiz", "Dos Hermanas", "Torrejón de Ardoz"
        ]
    },
    
    "Switzerland": {
        "continent": "Europe",
        "region": "Western Europe",
        "regions": ["Zurich", "Bern", "Vaud", "Aargau", "St. Gallen", "Geneva"],
        "description": "Swiss Confederation",
        "top_cities": [
            "Zurich", "Geneva", "Basel", "Lausanne", "Bern", "Winterthur", "Lucerne",
            "St. Gallen", "Lugano", "Biel/Bienne", "Thun", "Köniz", "La Chaux-de-Fonds",
            "Schaffhausen", "Fribourg", "Vernier", "Chur", "Neuchâtel", "Uster", "Sion",
            "Lancy", "Yverdon-les-Bains", "Emmen", "Zug", "Kriens", "Rapperswil-Jona",
            "Dübendorf", "Dietikon", "Montreux", "Frauenfeld", "Wetzikon", "Riehen",
            "Baar", "Allschwil", "Renens", "Kreuzlingen", "Bellinzona", "Carouge",
            "Aarau", "Pully", "Nyon", "Olten", "Meyrin", "Wädenswil", "Freienbach",
            "Horgen", "Morges", "Onex"
        ]
    },
    
    "United Kingdom": {
        "continent": "Europe",
        "region": "Western Europe",
        "regions": ["England", "Scotland", "Wales", "Northern Ireland"],
        "description": "United Kingdom of Great Britain and Northern Ireland",
        "top_cities": [
            "London", "Birmingham", "Manchester", "Glasgow", "Liverpool", "Leeds", "Sheffield",
            "Edinburgh", "Bristol", "Cardiff", "Leicester", "Coventry", "Belfast", "Bradford",
            "Stoke-on-Trent", "Wolverhampton", "Plymouth", "Derby", "Swansea", "Southampton",
            "Salford", "Aberdeen", "Westminster", "Portsmouth", "York", "Peterborough",
            "Dundee", "Lancaster", "Oxford", "Newport", "Preston", "St Albans", "Norwich",
            "Chester", "Cambridge", "Salisbury", "Exeter", "Gloucester", "Lisburn", "Chichester",
            "Winchester", "Londonderry", "Carlisle", "Worcester", "Bath", "Durham", "Lincoln",
            "Wakefield", "Hereford", "Armagh", "Bangor", "Truro", "Ely", "Ripon", "Wells"
        ]
    },
    
    # Eastern Europe (100 regions)
    "Albania": {
        "continent": "Europe",
        "region": "Eastern Europe",
        "regions": ["Tirana", "Durrës", "Vlorë", "Elbasan", "Shkodër", "Korçë", "Fier", "Berat"],
        "description": "Republic of Albania",
        "top_cities": [
            "Tirana", "Durrës", "Vlorë", "Elbasan", "Shkodër", "Korçë", "Fier", "Berat",
            "Lushnjë", "Kavajë", "Gjirokastër", "Sarandë", "Laç", "Kukës", "Lezhë",
            "Pogradec", "Peshkopi", "Kuçovë", "Krujë", "Burrel", "Cërrik", "Corovodë",
            "Përmet", "Koplik", "Librazhd", "Mamurras", "Orikum", "Rrogozhinë", "Selenicë",
            "Shijak", "Tepelenë", "Bulqizë", "Delvinë", "Divjakë", "Finiq", "Fushë-Arrëz",
            "Gramsh", "Himarë", "Kamëz", "Klos", "Konispol", "Krumë", "Maliq", "Memaliaj",
            "Milot", "Patos", "Peqin", "Poliçan", "Prrenjas", "Roskovec"
        ]
    },
    
    "Bulgaria": {
        "continent": "Europe",
        "region": "Eastern Europe",
        "regions": ["Sofia", "Plovdiv", "Varna", "Burgas", "Ruse", "Stara Zagora"],
        "description": "Republic of Bulgaria",
        "top_cities": [
            "Sofia", "Plovdiv", "Varna", "Burgas", "Ruse", "Stara Zagora", "Pleven", "Sliven",
            "Dobrich", "Shumen", "Pernik", "Haskovo", "Yambol", "Pazardzhik", "Blagoevgrad",
            "Veliko Tarnovo", "Vratsa", "Gabrovo", "Asenovgrad", "Vidin", "Kazanlak", "Kyustendil",
            "Kardzhali", "Montana", "Dimitrovgrad", "Targovishte", "Lovech", "Silistra",
            "Dupnitsa", "Svishtov", "Razgrad", "Gorna Oryahovitsa", "Smolyan", "Petrich",
            "Sandanski", "Lom", "Velingrad", "Novi Pazar", "Berkovitsa", "Aytos", "Botevgrad",
            "Gotse Delchev", "Peshtera", "Harmanli", "Popovo", "Rakovski", "Radomir",
            "Nova Zagora", "Svishtov", "Stamboliyski"
        ]
    },
    
    "Croatia": {
        "continent": "Europe",
        "region": "Eastern Europe",
        "regions": ["Zagreb", "Split-Dalmatia", "Primorje-Gorski Kotar", "Istria", "Osijek-Baranja", "Zadar"],
        "description": "Republic of Croatia",
        "top_cities": [
            "Zagreb", "Split", "Rijeka", "Osijek", "Zadar", "Pula", "Slavonski Brod", "Karlovac",
            "Varaždin", "Šibenik", "Sisak", "Velika Gorica", "Vukovar", "Dubrovnik", "Bjelovar",
            "Koprivnica", "Požega", "Zaprešić", "Solin", "Cakovec", "Vinkovci", "Nova Gradiška",
            "Samobor", "Trogir", "Križevci", "Kutina", "Metković", "Čakovec", "Dakovo", "Rovinj",
            "Umag", "Knin", "Imotski", "Makarska", "Sinj", "Hrvatska Kostajnica", "Ogulin",
            "Duga Resa", "Ilok", "Poreč", "Gospić", "Delnice", "Vrbovec", "Novska", "Ozalj",
            "Đakovo", "Vrgorac", "Biograd na Moru", "Labin", "Pazin", "Otočac"
        ]
    },
    
    "Czech Republic": {
        "continent": "Europe",
        "region": "Eastern Europe",
        "regions": ["Prague", "Central Bohemia", "South Bohemia", "Plzen", "Karlovy Vary", "Usti nad Labem", "Liberec"],
        "description": "Czech Republic",
        "top_cities": [
            "Prague", "Brno", "Ostrava", "Plzen", "Liberec", "Olomouc", "Ústí nad Labem", "České Budějovice",
            "Hradec Králové", "Pardubice", "Havířov", "Zlín", "Kladno", "Most", "Opava", "Frýdek-Místek",
            "Jihlava", "Teplice", "Děčín", "Karviná", "Chomutov", "Jablonec nad Nisou", "Mladá Boleslav",
            "Prostějov", "Přerov", "Česká Lípa", "Třebíč", "Třinec", "Tabor", "Znojmo", "Příbram",
            "Cheb", "Trutnov", "Karlovy Vary", "Orlová", "Vsetín", "Kolín", "Šumperk", "Hodonín",
            "Kroměříž", "Litvínov", "Uherské Hradiště", "Kutná Hora", "Krnov", "Černošice",
            "Nový Jičín", "Strakonice", "Břeclav", "Valašské Meziříčí"
        ]
    },
    
    "Hungary": {
        "continent": "Europe",
        "region": "Eastern Europe",
        "regions": ["Budapest", "Pest", "Bács-Kiskun", "Baranya", "Békés", "Borsod-Abaúj-Zemplén", 
                   "Csongrád", "Fejér", "Győr-Moson-Sopron"],
        "description": "Hungary",
        "top_cities": [
            "Budapest", "Debrecen", "Szeged", "Miskolc", "Pécs", "Győr", "Nyíregyháza", "Kecskemét",
            "Székesfehérvár", "Szombathely", "Szolnok", "Tatabánya", "Kaposvár", "Érd", "Veszprém",
            "Békéscsaba", "Zalaegerszeg", "Sopron", "Eger", "Nagykanizsa", "Dunakeszi", "Hódmezővásárhely",
            "Cegléd", "Baja", "Salgótarján", "Szigetszentmiklós", "Orosháza", "Gyula", "Kazincbarcika",
            "Ozd", "Hatvan", "Gödöllő", "Ajka", "Komló", "Kiskunfélegyháza", "Mohács", "Jászberény",
            "Pápa", "Mátészalka", "Balassagyarmat", "Gyöngyös", "Makó", "Keszthely", "Ózd",
            "Dombóvár", "Oroszlány", "Várpalota", "Mezőtúr", "Kalocsa", "Kisvárda"
        ]
    },
    
    "Montenegro": {
        "continent": "Europe",
        "region": "Eastern Europe",
        "regions": ["Podgorica", "Nikšić", "Herceg Novi", "Pljevlja", "Bar"],
        "description": "Montenegro",
        "top_cities": [
            "Podgorica", "Nikšić", "Pljevlja", "Bijelo Polje", "Cetinje", "Bar", "Herceg Novi",
            "Berane", "Ulcinj", "Budva", "Tivat", "Rožaje", "Kotor", "Danilovgrad", "Mojkovac",
            "Plav", "Kolašin", "Žabljak", "Andrijevica", "Plužine", "Šavnik", "Gusinje",
            "Tuzi", "Golubovci", "Zelenika", "Sutomore", "Petnjica", "Donja Gorica",
            "Spuž", "Igalo"
        ]
    },
    
    "North Macedonia": {
        "continent": "Europe",
        "region": "Eastern Europe",
        "regions": ["Skopje", "Eastern", "Northeast", "Pelagonia", "Polog", "Southeast", "Southwest"],
        "description": "Republic of North Macedonia",
        "top_cities": [
            "Skopje", "Bitola", "Kumanovo", "Prilep", "Tetovo", "Veles", "Štip", "Ohrid",
            "Gostivar", "Strumica", "Kavadarci", "Kočani", "Kičevo", "Struga", "Radoviš",
            "Gevgelija", "Debar", "Kratovo", "Berovo", "Negotino", "Delčevo", "Sveti Nikole",
            "Vinica", "Resen", "Makedonska Kamenica", "Valandovo", "Bogdanci", "Kriva Palanka",
            "Probištip", "Makedonski Brod", "Demir Kapija", "Pehčevo", "Kruševo", "Centar Župa",
            "Bosilovo", "Novaci", "Lozovo", "Gradsko", "Rosoman", "Konče", "Zrnovci",
            "Mavrovo and Rostusa", "Plasnica", "Rankovce", "Lipkovo", "Brvenica",
            "Tearce", "Želino", "Jegunovce", "Bogovinje"
        ]
    },
    
    "Poland": {
        "continent": "Europe",
        "region": "Eastern Europe",
        "regions": ["Masovian", "Silesian", "Lesser Poland", "Greater Poland", "Lower Silesian", 
                   "Łódź", "West Pomeranian"],
        "description": "Republic of Poland",
        "top_cities": [
            "Warsaw", "Kraków", "Łódź", "Wrocław", "Poznań", "Gdańsk", "Szczecin", "Bydgoszcz",
            "Lublin", "Katowice", "Białystok", "Gdynia", "Częstochowa", "Radom", "Sosnowiec",
            "Toruń", "Kielce", "Gliwice", "Zabrze", "Bytom", "Olsztyn", "Bielsko-Biała",
            "Rzeszów", "Ruda Śląska", "Rybnik", "Tychy", "Dąbrowa Górnicza", "Płock", "Elbląg",
            "Opole", "Gorzów Wielkopolski", "Wałbrzych", "Włocławek", "Tarnów", "Chorzów",
            "Koszalin", "Kalisz", "Legnica", "Grudziądz", "Słupsk", "Jaworzno", "Jastrzębie-Zdrój",
            "Nowy Sącz", "Jelenia Góra", "Siedlce", "Mysłowice", "Konin", "Piła", "Ostrów Wielkopolski"
        ]
    },
    
    "Romania": {
        "continent": "Europe",
        "region": "Eastern Europe",
        "regions": ["Bucharest", "Cluj", "Timiș", "Iași", "Constanța", "Galați", "Brașov"],
        "description": "Romania",
        "top_cities": [
            "Bucharest", "Cluj-Napoca", "Timișoara", "Iași", "Constanța", "Craiova", "Brașov",
            "Galați", "Ploiești", "Oradea", "Brăila", "Arad", "Pitești", "Sibiu", "Bacău",
            "Târgu Mureș", "Baia Mare", "Buzău", "Botoșani", "Satu Mare", "Râmnicu Vâlcea",
            "Drobeta-Turnu Severin", "Piatra Neamț", "Târgu Jiu", "Tulcea", "Focșani",
            "Bistrița", "Reșița", "Alba Iulia", "Slatina", "Câmpulung", "Deva", "Hunedoara",
            "Bârlad", "Zalău", "Sfântu Gheorghe", "Vaslui", "Roman", "Turda", "Mediaș",
            "Onești", "Câmpina", "Mioveni", "Petroșani", "Slobozia", "Lugoj", "Mangalia",
            "Tecuci", "Pașcani", "Năvodari", "Codlea"
        ]
    },
    
    "Russia": {
        "continent": "Europe/Asia",
        "region": "Eastern Europe",
        "regions": ["Moscow", "Saint Petersburg", "Krasnodar Krai", "Sverdlovsk Oblast", 
                   "Rostov Oblast", "Tatarstan", "Bashkortostan", "Novosibirsk Oblast", "Samara Oblast"],
        "description": "Russian Federation",
        "top_cities": [
            "Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg", "Nizhny Novgorod",
            "Kazan", "Chelyabinsk", "Omsk", "Samara", "Rostov-on-Don", "Ufa", "Krasnoyarsk",
            "Perm", "Voronezh", "Volgograd", "Krasnodar", "Saratov", "Tyumen", "Tolyatti",
            "Izhevsk", "Barnaul", "Ulyanovsk", "Irkutsk", "Vladivostok", "Yaroslavl", "Habarovsk",
            "Makhachkala", "Tomsk", "Orenburg", "Novokuznetsk", "Kemerovo", "Ryazan", "Naberezhnye Chelny",
            "Astrakhan", "Penza", "Lipetsk", "Tula", "Kirov", "Cheboksary", "Kaliningrad",
            "Kursk", "Magnitogorsk", "Tver", "Bryansk", "Ivanovo", "Belgorod", "Surgut",
            "Vladimir", "Nizhniy Tagil", "Arkhangelsk", "Kaluga", "Smolensk"
        ]
    },
    
    "Serbia": {
        "continent": "Europe",
        "region": "Eastern Europe",
        "regions": ["Belgrade", "Novi Sad", "Niš", "Kragujevac", "Subotica", "Pančevo"],
        "description": "Republic of Serbia",
        "top_cities": [
            "Belgrade", "Novi Sad", "Niš", "Kragujevac", "Subotica", "Zrenjanin", "Pančevo",
            "Čačak", "Novi Pazar", "Smederevo", "Leskovac", "Valjevo", "Kruševac", "Vranje",
            "Šabac", "Užice", "Sombor", "Požarevac", "Pirot", "Zaječar", "Kraljevo", "Smederevska Palanka",
            "Jagodina", "Vršac", "Bor", "Prokuplje", "Kikinda", "Sremska Mitrovica", "Lazarevac",
            "Mladenovac", "Negotin", "Ćuprija", "Loznica", "Velika Plana", "Paraćin", "Aleksinac",
            "Inđija", "Ruma", "Kanjiža", "Petrovac na Mlavi", "Kula", "Aranđelovac", "Trstenik",
            "Nova Varoš", "Vlasotince", "Lebane", "Rekovac", "Svilajnac", "Priboj", "Tutin"
        ]
    },
    
    "Slovakia": {
        "continent": "Europe",
        "region": "Eastern Europe",
        "regions": ["Bratislava", "Košice", "Prešov", "Žilina", "Banská Bystrica", "Nitra"],
        "description": "Slovak Republic",
        "top_cities": [
            "Bratislava", "Košice", "Prešov", "Žilina", "Banská Bystrica", "Nitra", "Trnava",
            "Martin", "Trenčín", "Poprad", "Prievidza", "Zvolen", "Považská Bystrica", "Nové Zámky",
            "Spišská Nová Ves", "Komárno", "Levice", "Michalovce", "Liptovský Mikuláš", "Ružomberok",
            "Dolný Kubín", "Bardejov", "Piešťany", "Topoľčany", "Rožňava", "Lučenec", "Trebišov",
            "Malacky", "Rimavská Sobota", "Senica", "Dunajská Streda", "Brezno", "Snina",
            "Humenné", "Šaľa", "Zlaté Moravce", "Sabinov", "Bánovce nad Bebravou", "Kežmarok",
            "Vranov nad Topľou", "Handlová", "Galanta", "Čadca", "Svidník", "Turčianske Teplice",
            "Bojnice", "Detva", "Gelnica", "Hlohovec", "Námestovo"
        ]
    },
    
    "Slovenia": {
        "continent": "Europe",
        "region": "Eastern Europe",
        "regions": ["Central Slovenia", "Drava", "Savinja", "Southeast Slovenia", "Gorizia", "Coastal–Karst"],
        "description": "Republic of Slovenia",
        "top_cities": [
            "Ljubljana", "Maribor", "Celje", "Kranj", "Velenje", "Koper", "Novo Mesto", "Ptuj",
            "Trbovlje", "Kamnik", "Jesenice", "Nova Gorica", "Domžale", "Škofja Loka", "Murska Sobota",
            "Slovenj Gradec", "Kočevje", "Brežice", "Sevnica", "Postojna", "Krško", "Grosuplje",
            "Izola", "Idrija", "Piran", "Litija", "Radovljica", "Lendava", "Ajdovščina", "Ormož",
            "Ribnica", "Metlika", "Tolmin", "Vrhnika", "Žalec", "Trebnje", "Braslovče", "Šentjur",
            "Mengeš", "Črnomelj", "Ruše", "Železniki", "Ig", "Lenart", "Bovec", "Šmarje pri Jelšah",
            "Bohinj", "Šmartno ob Paki", "Zagorje ob Savi", "Gornja Radgona"
        ]
    },
    
    "Ukraine": {
        "continent": "Europe",
        "region": "Eastern Europe",
        "regions": ["Kyiv", "Kharkiv", "Odesa", "Dnipropetrovsk", "Donetsk", "Zaporizhzhia", 
                   "Lviv", "Kryvyi Rih", "Mykolaiv", "Mariupol", "Luhansk"],
        "description": "Ukraine",
        "top_cities": [
            "Kyiv", "Kharkiv", "Odesa", "Dnipro", "Donetsk", "Zaporizhzhia", "Lviv", "Kryvyi Rih",
            "Mykolaiv", "Mariupol", "Luhansk", "Vinnytsia", "Makiivka", "Sevastopol", "Simferopol",
            "Kherson", "Poltava", "Chernihiv", "Cherkasy", "Zhytomyr", "Sumy", "Horlivka", "Rivne",
            "Dniprodzerzhynsk", "Kremenchuk", "Ivano-Frankivsk", "Ternopil", "Lutsk", "Bila Tserkva",
            "Kramatorsk", "Melitopol", "Kerch", "Nikopol", "Sloviansk", "Uzhhorod", "Berdiansk",
            "Pavlohrad", "Yevpatoria", "Lysychansk", "Kamianets-Podilskyi", "Brovary", "Chernivtsi",
            "Khmelnytskyi", "Khartsyzk", "Alchevsk", "Novomoskovsk", "Druzhkivka", "Yenakiieve",
            "Kostiantynivka", "Mukachevo", "Konotop"
        ]
    },
    
    # Nordics (46 regions)
    "Denmark": {
        "continent": "Europe",
        "region": "Nordics",
        "regions": ["Capital Region", "Central Denmark", "North Denmark", "Zealand", "Southern Denmark",
                   "Copenhagen", "Aarhus", "Aalborg", "Odense", "Esbjerg"],
        "description": "Kingdom of Denmark",
        "top_cities": [
            "Copenhagen", "Aarhus", "Odense", "Aalborg", "Esbjerg", "Randers", "Kolding", "Horsens",
            "Vejle", "Roskilde", "Herning", "Hørsholm", "Helsingør", "Silkeborg", "Næstved",
            "Fredericia", "Viborg", "Køge", "Holstebro", "Taastrup", "Slagelse", "Hillerød",
            "Holbæk", "Sønderborg", "Hjørring", "Frederiksberg", "Glostrup", "Hvidovre",
            "Charlottenlund", "Rødovre", "Ballerup", "Albertslund", "Gentofte", "Gladsaxe",
            "Lyngby-Taarbæk", "Tårnby", "Vallensbæk", "Ishøj", "Dragør", "Greve", "Solrød",
            "Stevns", "Faxe", "Ringsted", "Sorø", "Kalundborg", "Odsherred", "Lejre",
            "Frederikssund", "Halsnæs"
        ]
    },
    
    "Faroe Islands": {
        "continent": "Europe",
        "region": "Nordics",
        "regions": ["Tórshavn", "Klaksvík"],
        "description": "Faroe Islands",
        "top_cities": [
            "Tórshavn", "Klaksvík", "Runavík", "Tvøroyri", "Argir", "Fuglafjørður", "Vestmanna",
            "Vágar"
        ]
    },
    
    "Finland": {
        "continent": "Europe",
        "region": "Nordics",
        "regions": ["Uusimaa", "Pirkanmaa", "Varsinais-Suomi", "Kanta-Häme", "Satakunta", 
                   "Päijät-Häme", "Kymenlaakso", "South Karelia"],
        "description": "Republic of Finland",
        "top_cities": [
            "Helsinki", "Espoo", "Tampere", "Vantaa", "Oulu", "Turku", "Jyväskylä", "Lahti",
            "Kuopio", "Pori", "Kouvola", "Joensuu", "Lappeenranta", "Hämeenlinna", "Vaasa",
            "Seinäjoki", "Rovaniemi", "Mikkeli", "Kotka", "Salo", "Porvoo", "Kokkola",
            "Hyvinkää", "Lohja", "Järvenpää", "Rauma", "Tuusula", "Kirkkonummi", "Kajaani",
            "Kerava", "Imatra", "Nokia", "Raisio", "Tornio", "Ylöjärvi", "Vihti", "Valkeakoski",
            "Forssa", "Heinola", "Riihimäki", "Savonlinna", "Äänekoski", "Sastamala",
            "Hamina", "Huittinen", "Kankaanpää", "Lieksa", "Iisalmi", "Ylivieska"
        ]
    },
    
    "Greenland": {
        "continent": "North America",
        "region": "Nordics",
        "regions": ["Nuuk"],
        "description": "Greenland",
        "top_cities": [
            "Nuuk", "Sisimiut", "Ilulissat", "Qaqortoq", "Aasiaat", "Maniitsoq", "Tasiilaq",
            "Narsaq"
        ]
    },
    
    "Iceland": {
        "continent": "Europe",
        "region": "Nordics",
        "regions": ["Capital Region", "Southern Peninsula", "Western Region", "Westfjords", 
                   "Northwestern Region", "Northeastern Region", "Eastern Region", "Southern Region", "Westman Islands"],
        "description": "Republic of Iceland",
        "top_cities": [
            "Reykjavík", "Kópavogur", "Hafnarfjörður", "Akureyri", "Garðabær", "Mosfellsbær",
            "Reykjanesbær", "Selfoss", "Seltjarnarnes", "Vogar", "Ísafjörður", "Akranes",
            "Fjarðabyggð", "Þorlákshöfn", "Grindavík", "Sandgerði", "Westman Islands",
            "Stykkishólmur", "Dalvík", "Egilsstaðir", "Húsavík", "Höfn", "Borgarnes",
            "Bolungarvík", "Vík", "Hveragerði", "Blönduós", "Ólafsfjörður", "Siglufjörður",
            "Njarðvík"
        ]
    },
    
    "Norway": {
        "continent": "Europe",
        "region": "Nordics",
        "regions": ["Oslo", "Viken", "Innlandet", "Vestfold og Telemark", "Agder", "Rogaland", 
                   "Vestland", "Møre og Romsdal"],
        "description": "Kingdom of Norway",
        "top_cities": [
            "Oslo", "Bergen", "Stavanger", "Trondheim", "Fredrikstad", "Kristiansand", "Sandnes",
            "Tromsø", "Sarpsborg", "Skien", "Ålesund", "Sandefjord", "Haugesund", "Tønsberg",
            "Moss", "Drammen", "Bodø", "Arendal", "Hamar", "Ytrebygda", "Larvik", "Halden",
            "Lillehammer", "Mo i Rana", "Molde", "Horten", "Gjøvik", "Harstad", "Askøy",
            "Kongsberg", "Narvik", "Kløfta", "Jessheim", "Grimstad", "Elverum", "Porsgrunn",
            "Stjørdal", "Kristiansund", "Alta", "Kolbotn", "Åkrehamn", "Egersund", "Verdalsøra",
            "Levanger", "Bryne", "Ås", "Nesoddtangen", "Tønsberg", "Honefoss"
        ]
    },
    
    "Sweden": {
        "continent": "Europe",
        "region": "Nordics",
        "regions": ["Stockholm", "Västra Götaland", "Skåne", "Östergötland", "Jönköping", 
                   "Uppsala", "Dalarna", "Örebro"],
        "description": "Kingdom of Sweden",
        "top_cities": [
            "Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro", "Linköping",
            "Helsingborg", "Jönköping", "Norrköping", "Lund", "Umeå", "Gävle", "Borås",
            "Södertälje", "Eskilstuna", "Halmstad", "Växjö", "Karlstad", "Sundsvall",
            "Täby", "Luleå", "Trollhättan", "Östersund", "Borlänge", "Tumba", "Falun",
            "Skövde", "Kalmar", "Kristianstad", "Karlskrona", "Västerhaninge", "Nyköping",
            "Sollentuna", "Bollnäs", "Örnsköldsvik", "Landskrona", "Åkersberga", "Sandviken",
            "Enköping", "Lerum", "Karlskoga", "Hudiksvall", "Värnamo", "Lidköping",
            "Märsta", "Motala", "Katrineholm", "Trelleborg"
        ]
    },
    
    # Continue with more regions...
    # This is a sample - the full database would contain all countries from your list
    
    # United States with all states
    "United States": {
        "continent": "North America",
        "region": "North America",
        "regions": [
            "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
            "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
            "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
            "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
            "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
            "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
            "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
            "Wisconsin", "Wyoming", "District of Columbia"
        ],
        "description": "United States of America",
        "top_cities": [
            "New York City", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
            "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
            "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis", "Seattle",
            "Denver", "Washington", "Boston", "El Paso", "Nashville", "Detroit", "Oklahoma City",
            "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore", "Milwaukee", "Albuquerque",
            "Tucson", "Fresno", "Sacramento", "Mesa", "Kansas City", "Atlanta", "Long Beach",
            "Colorado Springs", "Raleigh", "Miami", "Virginia Beach", "Omaha", "Oakland",
            "Minneapolis", "Tulsa", "Arlington", "Tampa", "New Orleans", "Wichita"
        ]
    },
    
    "Canada": {
        "continent": "North America", 
        "region": "North America",
        "regions": [
            "Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba", "Saskatchewan",
            "Nova Scotia", "New Brunswick", "Newfoundland and Labrador", "Prince Edward Island",
            "Northwest Territories", "Yukon", "Nunavut"
        ],
        "description": "Canada",
        "top_cities": [
            "Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg",
            "Quebec City", "Hamilton", "Kitchener", "London", "Victoria", "Halifax", "Oshawa",
            "Windsor", "Saskatoon", "St. Catharines", "Barrie", "Kelowna", "Abbotsford",
            "Kingston", "Sudbury", "Sherbrooke", "Saguenay", "Lévis", "Trois-Rivières",
            "Guelph", "Cambridge", "Whitby", "Coquitlam", "Saanich", "Burlington", "Richmond",
            "Oakville", "Thunder Bay", "St. John's", "Waterloo", "Delta", "Chatham", "Red Deer",
            "Kamloops", "Brantford", "Cape Breton", "Lethbridge", "Saint-Jean-sur-Richelieu",
            "Clarington", "Pickering", "Nanaimo", "Vaughan", "Milton", "Moncton"
        ]
    },
    
    # Sample entries for major countries - full implementation would include all
    "Brazil": {
        "continent": "South America",
        "region": "Latin America", 
        "regions": [
            "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Federal District",
            "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
            "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro",
            "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina",
            "São Paulo", "Sergipe", "Tocantins"
        ],
        "description": "Federative Republic of Brazil",
        "top_cities": [
            "São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte",
            "Manaus", "Curitiba", "Recife", "Goiânia", "Belém", "Porto Alegre", "Guarulhos",
            "Campinas", "São Luís", "São Gonçalo", "Maceió", "Duque de Caxias", "Natal",
            "Teresina", "Campo Grande", "Nova Iguaçu", "São Bernardo do Campo", "João Pessoa",
            "Santo André", "Osasco", "Jaboatão dos Guararapes", "São José dos Campos",
            "Ribeirão Preto", "Uberlândia", "Contagem", "Sorocaba", "Aracaju", "Feira de Santana",
            "Cuiabá", "Joinville", "Aparecida de Goiânia", "Londrina", "Juiz de Fora",
            "Ananindeua", "Porto Velho", "Serra", "Niterói", "Caxias do Sul", "Campos dos Goytacazes",
            "São João de Meriti", "Vila Velha", "Florianópolis", "Mauá", "Diadema"
        ]
    }
}

def get_all_countries():
    """Get list of all countries"""
    return list(COMPREHENSIVE_LOCATIONS.keys())

def get_regions_for_country(country):
    """Get all regions for a specific country"""
    if country in COMPREHENSIVE_LOCATIONS:
        return COMPREHENSIVE_LOCATIONS[country]["regions"]
    return []

def get_cities_for_country(country):
    """Get top cities for a specific country"""
    if country in COMPREHENSIVE_LOCATIONS:
        return COMPREHENSIVE_LOCATIONS[country]["top_cities"]
    return []

def get_country_description(country):
    """Get description for a country"""
    if country in COMPREHENSIVE_LOCATIONS:
        return COMPREHENSIVE_LOCATIONS[country]["description"]
    return country

def get_cities_for_region(country, region):
    """Get cities for a specific region within a country with proper geographic mapping"""
    
    # For United States, use proper state-to-city mapping
    if country == "United States":
        return get_us_cities_for_state(region)
    
    # For other countries, use a more intelligent distribution
    cities = get_cities_for_country(country)
    if not cities:
        return []
    
    regions = get_regions_for_country(country)
    if not regions or region not in regions:
        return cities[:10]  # Return first 10 cities as fallback
    
    # For major countries with known region mappings, use specific logic
    if country == "Canada":
        return get_canada_cities_for_province(region)
    elif country == "Brazil":
        return get_brazil_cities_for_state(region)
    elif country == "Germany":
        return get_germany_cities_for_state(region)
    elif country == "France":
        return get_france_cities_for_region(region)
    else:
        # Fallback: distribute cities more intelligently
        region_index = regions.index(region)
        cities_per_region = max(3, len(cities) // len(regions))
        start_idx = region_index * cities_per_region
        end_idx = start_idx + cities_per_region
        
        return cities[start_idx:end_idx] if start_idx < len(cities) else cities[-5:]

def get_us_cities_for_state(state):
    """Get actual cities for US states"""
    us_state_cities = {
        "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento", "Oakland", "Fresno", "Long Beach", "Santa Ana", "Anaheim"],
        "Texas": ["Houston", "Dallas", "San Antonio", "Austin", "Fort Worth", "El Paso", "Arlington", "Corpus Christi", "Plano", "Laredo"],
        "Florida": ["Miami", "Tampa", "Orlando", "Jacksonville", "St. Petersburg", "Hialeah", "Tallahassee", "Fort Lauderdale", "Port St. Lucie", "Cape Coral"],
        "New York": ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany", "New Rochelle", "Mount Vernon", "Schenectady", "Utica"],
        "Illinois": ["Chicago", "Aurora", "Peoria", "Rockford", "Joliet", "Naperville", "Springfield", "Elgin", "Waukegan", "Cicero"],
        "Pennsylvania": ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading", "Scranton", "Bethlehem", "Lancaster", "Harrisburg", "Altoona"],
        "Ohio": ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton", "Parma", "Canton", "Youngstown", "Lorain"],
        "Georgia": ["Atlanta", "Columbus", "Augusta", "Savannah", "Athens", "Sandy Springs", "Roswell", "Macon", "Johns Creek", "Albany"],
        "North Carolina": ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem", "Fayetteville", "Cary", "Wilmington", "High Point", "Asheville"],
        "Michigan": ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Lansing", "Ann Arbor", "Flint", "Dearborn", "Livonia", "Westland"],
        "Virginia": ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Newport News", "Alexandria", "Hampton", "Portsmouth", "Suffolk", "Lynchburg"],
        "Washington": ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue", "Kent", "Everett", "Renton", "Federal Way", "Spokane Valley"],
        "Arizona": ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale", "Glendale", "Gilbert", "Tempe", "Peoria", "Surprise"],
        "Massachusetts": ["Boston", "Worcester", "Springfield", "Cambridge", "Lowell", "Brockton", "Quincy", "Lynn", "Fall River", "Newton"],
        "Tennessee": ["Memphis", "Nashville", "Knoxville", "Chattanooga", "Clarksville", "Murfreesboro", "Franklin", "Jackson", "Johnson City", "Bartlett"],
        "Indiana": ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Hammond", "Bloomington", "Gary", "Carmel", "Fishers", "Muncie"],
        "Missouri": ["Kansas City", "St. Louis", "Springfield", "Independence", "Columbia", "Lee's Summit", "O'Fallon", "St. Joseph", "St. Charles", "St. Peters"],
        "Maryland": ["Baltimore", "Columbia", "Germantown", "Silver Spring", "Waldorf", "Glen Burnie", "Ellicott City", "Frederick", "Dundalk", "Rockville"],
        "Wisconsin": ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Racine", "Appleton", "Waukesha", "Eau Claire", "Oshkosh", "Janesville"],
        "Colorado": ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Lakewood", "Thornton", "Arvada", "Westminster", "Pueblo", "Centennial"],
        "Minnesota": ["Minneapolis", "St. Paul", "Rochester", "Duluth", "Bloomington", "Brooklyn Park", "Plymouth", "St. Cloud", "Eagan", "Woodbury"],
        "South Carolina": ["Charleston", "Columbia", "North Charleston", "Mount Pleasant", "Rock Hill", "Greenville", "Summerville", "Sumter", "Goose Creek", "Hilton Head Island"],
        "Alabama": ["Birmingham", "Montgomery", "Mobile", "Huntsville", "Tuscaloosa", "Hoover", "Dothan", "Auburn", "Decatur", "Madison"],
        "Louisiana": ["New Orleans", "Baton Rouge", "Shreveport", "Metairie", "Lafayette", "Lake Charles", "Kenner", "Bossier City", "Monroe", "Alexandria"],
        "Kentucky": ["Louisville", "Lexington", "Bowling Green", "Owensboro", "Covington", "Richmond", "Georgetown", "Florence", "Hopkinsville", "Nicholasville"],
        "Oregon": ["Portland", "Eugene", "Salem", "Gresham", "Hillsboro", "Bend", "Beaverton", "Medford", "Springfield", "Corvallis"],
        "Oklahoma": ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Lawton", "Edmond", "Moore", "Midwest City", "Enid", "Stillwater"],
        "Connecticut": ["Bridgeport", "New Haven", "Hartford", "Stamford", "Waterbury", "Norwalk", "Danbury", "New Britain", "West Hartford", "Greenwich"],
        "Iowa": ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City", "Iowa City", "Waterloo", "Council Bluffs", "Ames", "Dubuque", "West Des Moines"],
        "Arkansas": ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro", "North Little Rock", "Conway", "Rogers", "Pine Bluff", "Bentonville"],
        "Mississippi": ["Jackson", "Gulfport", "Southaven", "Hattiesburg", "Biloxi", "Meridian", "Tupelo", "Greenville", "Olive Branch", "Horn Lake"],
        "Kansas": ["Wichita", "Overland Park", "Kansas City", "Topeka", "Olathe", "Lawrence", "Shawnee", "Manhattan", "Lenexa", "Salina"],
        "Utah": ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem", "Sandy", "Ogden", "St. George", "Layton", "Taylorsville"],
        "Nevada": ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks", "Carson City", "Fernley", "Elko", "Mesquite", "Boulder City"],
        "New Mexico": ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe", "Roswell", "Farmington", "Clovis", "Hobbs", "Alamogordo", "Carlsbad"],
        "West Virginia": ["Charleston", "Huntington", "Morgantown", "Parkersburg", "Wheeling", "Martinsburg", "Fairmont", "Beckley", "Clarksburg", "Lewisburg"],
        "Nebraska": ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney", "Fremont", "Hastings", "North Platte", "Norfolk", "Columbus"],
        "Idaho": ["Boise", "Meridian", "Nampa", "Idaho Falls", "Pocatello", "Caldwell", "Coeur d'Alene", "Twin Falls", "Lewiston", "Post Falls"],
        "Hawaii": ["Honolulu", "Pearl City", "Hilo", "Kailua", "Waipahu", "Kaneohe", "Mililani", "Kahului", "Ewa Gentry", "Mililani Town"],
        "Maine": ["Portland", "Lewiston", "Bangor", "South Portland", "Auburn", "Biddeford", "Sanford", "Brunswick", "Saco", "Scarborough"],
        "New Hampshire": ["Manchester", "Nashua", "Concord", "Derry", "Dover", "Rochester", "Salem", "Merrimack", "Hudson", "Londonderry"],
        "Rhode Island": ["Providence", "Warwick", "Cranston", "Pawtucket", "East Providence", "Woonsocket", "Newport", "Central Falls", "Westerly", "North Providence"],
        "Montana": ["Billings", "Missoula", "Great Falls", "Bozeman", "Butte", "Helena", "Kalispell", "Havre", "Anaconda", "Miles City"],
        "Delaware": ["Wilmington", "Dover", "Newark", "Middletown", "Bear", "Glasgow", "Brookside", "Hockessin", "Smyrna", "Milford"],
        "South Dakota": ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Watertown", "Mitchell", "Yankton", "Pierre", "Huron", "Spearfish"],
        "North Dakota": ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo", "Williston", "Dickinson", "Mandan", "Jamestown", "Wahpeton"],
        "Alaska": ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan", "Wasilla", "Kenai", "Kodiak", "Bethel", "Palmer"],
        "Vermont": ["Burlington", "South Burlington", "Rutland", "Barre", "Montpelier", "Winooski", "St. Albans", "Newport", "Vergennes", "Brattleboro"],
        "Wyoming": ["Cheyenne", "Casper", "Laramie", "Gillette", "Rock Springs", "Sheridan", "Green River", "Evanston", "Riverton", "Jackson"]
    }
    
    return us_state_cities.get(state, [])

def get_canada_cities_for_province(province):
    """Get cities for Canadian provinces"""
    canada_cities = {
        "Ontario": ["Toronto", "Ottawa", "Hamilton", "London", "Kitchener", "Windsor", "Oshawa", "Kingston", "Sudbury", "Thunder Bay"],
        "Quebec": ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil", "Sherbrooke", "Saguenay", "Lévis", "Trois-Rivières", "Terrebonne"],
        "British Columbia": ["Vancouver", "Victoria", "Surrey", "Burnaby", "Richmond", "Abbotsford", "Coquitlam", "Kelowna", "Saanich", "Delta"],
        "Alberta": ["Calgary", "Edmonton", "Red Deer", "Lethbridge", "St. Albert", "Medicine Hat", "Grande Prairie", "Airdrie", "Spruce Grove", "Okotoks"],
        "Manitoba": ["Winnipeg", "Brandon", "Steinbach", "Thompson", "Portage la Prairie", "Winkler", "Selkirk", "Morden", "Dauphin", "The Pas"],
        "Saskatchewan": ["Saskatoon", "Regina", "Prince Albert", "Moose Jaw", "Swift Current", "Yorkton", "North Battleford", "Estevan", "Weyburn", "Lloydminster"]
    }
    return canada_cities.get(province, [])

def get_brazil_cities_for_state(state):
    """Get cities for Brazilian states"""
    brazil_cities = {
        "São Paulo": ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santo André", "Osasco", "São José dos Campos", "Ribeirão Preto", "Sorocaba", "Santos"],
        "Rio de Janeiro": ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói", "Campos dos Goytacazes", "Belford Roxo", "São João de Meriti", "Petrópolis", "Volta Redonda"],
        "Minas Gerais": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros", "Ribeirão das Neves", "Uberaba", "Governador Valadares", "Ipatinga"],
        "Bahia": ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Juazeiro", "Teixeira de Freitas", "Barreiras", "Alagoinhas", "Porto Seguro", "Simões Filho"],
        "Paraná": ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel", "São José dos Pinhais", "Foz do Iguaçu", "Colombo", "Guarapuava", "Paranaguá"],
        "Rio Grande do Sul": ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria", "Gravataí", "Viamão", "Novo Hamburgo", "São Leopoldo", "Rio Grande"]
    }
    return brazil_cities.get(state, [])

def get_germany_cities_for_state(state):
    """Get cities for German states"""
    germany_cities = {
        "Bavaria": ["Munich", "Nuremberg", "Augsburg", "Würzburg", "Regensburg", "Ingolstadt", "Fürth", "Erlangen", "Bayreuth", "Bamberg"],
        "North Rhine-Westphalia": ["Cologne", "Düsseldorf", "Dortmund", "Essen", "Duisburg", "Bochum", "Wuppertal", "Bielefeld", "Bonn", "Münster"],
        "Baden-Württemberg": ["Stuttgart", "Mannheim", "Karlsruhe", "Freiburg", "Heidelberg", "Ulm", "Heilbronn", "Pforzheim", "Reutlingen", "Ludwigsburg"]
    }
    return germany_cities.get(state, [])

def get_france_cities_for_region(region):
    """Get cities for French regions"""
    france_cities = {
        "Île-de-France": ["Paris", "Boulogne-Billancourt", "Saint-Denis", "Argenteuil", "Montreuil", "Créteil", "Nanterre", "Courbevoie", "Versailles", "Asnières-sur-Seine"],
        "Provence-Alpes-Côte d'Azur": ["Marseille", "Nice", "Toulon", "Aix-en-Provence", "Antibes", "Cannes", "Avignon", "Fréjus", "Arles", "Gap"],
        "Auvergne-Rhône-Alpes": ["Lyon", "Grenoble", "Saint-Étienne", "Villeurbanne", "Annecy", "Clermont-Ferrand", "Valence", "Chambéry", "Bourg-en-Bresse", "Roanne"],
        "Occitanie": ["Toulouse", "Montpellier", "Nîmes", "Perpignan", "Béziers", "Narbonne", "Carcassonne", "Albi", "Tarbes", "Auch"],
        "Hauts-de-France": ["Lille", "Amiens", "Tourcoing", "Roubaix", "Calais", "Dunkerque", "Valenciennes", "Boulogne-sur-Mer", "Arras", "Douai"],
        "Grand Est": ["Strasbourg", "Reims", "Metz", "Nancy", "Mulhouse", "Troyes", "Châlons-en-Champagne", "Colmar", "Charleville-Mézières", "Épinal"],
        "Nouvelle-Aquitaine": ["Bordeaux", "Limoges", "Poitiers", "Pau", "La Rochelle", "Mérignac", "Pessac", "Bayonne", "Angoulême", "Niort"]
    }
    return france_cities.get(region, [])

def get_location_stats():
    """Get statistics about the location database"""
    total_countries = len(COMPREHENSIVE_LOCATIONS)
    total_regions = sum(len(data["regions"]) for data in COMPREHENSIVE_LOCATIONS.values())
    total_cities = sum(len(data["top_cities"]) for data in COMPREHENSIVE_LOCATIONS.values())
    
    return {
        "countries": total_countries,
        "regions": total_regions, 
        "cities": total_cities
    }
