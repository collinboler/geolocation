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
        "regions": ["Norte", "Centro", "Lisboa", "Alentejo", "Algarve", "Azores", "Madeira"],
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
    
    # Africa (46 regions from GeoGuessr coverage)
    "Botswana": {
        "continent": "Africa",
        "region": "Africa",
        "regions": ["Southern District", "Kgatleng District", "Central District", "North East District"],
        "description": "Republic of Botswana",
        "top_cities": [
            "Gaborone", "Francistown", "Molepolole", "Maun", "Serowe", "Selibe Phikwe", 
            "Kanye", "Mochudi", "Lobatse", "Palapye", "Jwaneng", "Mahalapye", "Tsabong",
            "Kasane", "Letlhakeng", "Moshupa", "Thamaga", "Janeng", "Good Hope", "Bobonong",
            "Shakawe", "Tutume", "Tonota", "Letlhakane", "Orapa", "Gumare", "Masunga",
            "Ramotswa", "Kopong", "Ramatlabama", "Mogoditshane", "Tlokweng", "Gabane",
            "Mmopane", "Selebi-Phikwe", "Ghanzi", "Kang", "Hukuntsi", "Lehututu", "Tsau"
        ]
    },
    
    "Eswatini": {
        "continent": "Africa", 
        "region": "Africa",
        "regions": ["Hhohho", "Manzini", "Shiselweni"],
        "description": "Kingdom of Eswatini",
        "top_cities": [
            "Mbabane", "Manzini", "Lobamba", "Siteki", "Malkerns", "Piggs Peak", "Hluti",
            "Simunye", "Big Bend", "Lavumisa", "Nhlangano", "Mankayane", "Bulembu", "Sidvokodvo",
            "Matsapha", "Ezulwini", "Luyengo", "Ngwenya", "Mahamba", "Maguga", "Motshane",
            "Nsoko", "Kubuta", "Tabankulu", "Mhlambanyatsi", "Hlane", "Mhlume", "Tshaneni",
            "Lomahasha", "Mahlangatsha", "Dalriach", "Mahlangatsha", "Luve", "Shewula", "Buhleni"
        ]
    },
    
    "Ghana": {
        "continent": "Africa",
        "region": "Africa", 
        "regions": ["Greater Accra", "Ashanti"],
        "description": "Republic of Ghana",
        "top_cities": [
            "Accra", "Kumasi", "Tamale", "Takoradi", "Cape Coast", "Sekondi", "Obuasi", "Medina",
            "Koforidua", "Tema", "Teshi Old Town", "Madina", "Sunyani", "Ho", "Techiman",
            "Wa", "Bolgatanga", "Yendi", "Bawku", "Nkawkaw", "Dunkwa-on-Offin", "Prestea",
            "Tarkwa", "Axim", "Keta", "Hohoe", "Berekum", "Akim Oda", "Savelugu", "Navrongo",
            "Lawra", "Jirapa", "Salaga", "Kpandae", "Damongo", "Bole", "Wenchi", "Goaso",
            "Drobo", "Sampa", "Kintampo", "Atebubu", "Ejura", "Mampong", "Konongo", "Bekwai",
            "Agona Swedru", "Winneba", "Kasoa", "Asamankese"
        ]
    },
    
    "Kenya": {
        "continent": "Africa",
        "region": "Africa",
        "regions": ["Nairobi", "Central", "Coast"],
        "description": "Republic of Kenya", 
        "top_cities": [
            "Nairobi", "Mombasa", "Nakuru", "Eldoret", "Kisumu", "Thika", "Malindi", "Kitale",
            "Garissa", "Kakamega", "Naivasha", "Meru", "Machakos", "Nyeri", "Kericho", "Lamu",
            "Isiolo", "Embu", "Homa Bay", "Kilifi", "Voi", "Wajir", "Marsabit", "Moyale",
            "Lodwar", "Kapenguria", "Maralal", "Mandera", "Bungoma", "Webuye", "Mumias",
            "Busia", "Siaya", "Migori", "Awendo", "Rongo", "Keroka", "Nyamira", "Bomet",
            "Sotik", "Litein", "Kapsabet", "Nandi Hills", "Burnt Forest", "Turbo", "Marigat",
            "Kabarnet", "Chepareria", "Kacheliba", "Chesongoch", "Lokori"
        ]
    },
    
    "Lesotho": {
        "continent": "Africa",
        "region": "Africa",
        "regions": ["Maseru", "Berea", "Leribe", "Mafeteng"],
        "description": "Kingdom of Lesotho",
        "top_cities": [
            "Maseru", "Teyateyaneng", "Leribe", "Mafeteng", "Hlotse", "Mohale's Hoek", "Maputsoe",
            "Qacha's Nek", "Quthing", "Butha-Buthe", "Mokhotlong", "Thaba-Tseka", "Peka",
            "Kolonyama", "Mapoteng", "Morija", "Roma", "Nazareth", "Semonkong", "Thaba-Bosiu",
            "Katse", "Likalaneng", "Machache", "Sehlabathebe", "Sehonghong", "Sekake", "Senekane",
            "Senqu", "Seqhobong", "Thaba-Chitja", "Thaba-Kholo", "Thaba-Moea", "Thaba-Putsoa",
            "Thabana-Morena", "Tlali", "Tsikoane", "Tsoaing", "Tsoili-Tsoili", "Tsoelike", "Tsoloane"
        ]
    },
    
    "Madagascar": {
        "continent": "Africa",
        "region": "Africa",
        "regions": ["Antananarivo", "Fianarantsoa", "Toamasina", "Mahajanga", "Toliara"],
        "description": "Republic of Madagascar",
        "top_cities": [
            "Antananarivo", "Toamasina", "Antsirabe", "Fianarantsoa", "Mahajanga", "Toliara",
            "Antsiranana", "Ambovombe", "Ambilobe", "Amparafaravola", "Antalaha", "Antsohihy",
            "Farafangana", "Ihosy", "Manakara", "Mananjary", "Morombe", "Morondava", "Nosy Be",
            "Sambava", "Vangaindrano", "Vatomandry", "Befandriana-Nord", "Maintirano", "Mampikony",
            "Mandritsara", "Manja", "Soalala", "Tsiroanomandidy", "Ambalavao", "Ambanja",
            "Ambatondrazaka", "Ambohimahasoa", "Amboasary Sud", "Ampanihy", "Andapa", "Anjozorobe",
            "Ankazobe", "Bealanana", "Beloha", "Belo Tsiribihina", "Faratsiho", "Ikongo",
            "Maevatanana", "Marovoay", "Mitsinjo", "Sakaraha", "Soanierana Ivongo", "Vavatenina"
        ]
    },
    
    "Nigeria": {
        "continent": "Africa",
        "region": "Africa",
        "regions": ["Lagos", "Kano", "Kaduna", "Oyo", "Rivers"],
        "description": "Federal Republic of Nigeria",
        "top_cities": [
            "Lagos", "Kano", "Ibadan", "Kaduna", "Port Harcourt", "Benin City", "Maiduguri",
            "Zaria", "Aba", "Jos", "Ilorin", "Oyo", "Enugu", "Abeokuta", "Abuja", "Sokoto",
            "Onitsha", "Warri", "Okene", "Calabar", "Uyo", "Katsina", "Ado-Ekiti", "Ogbomoso",
            "Akure", "Bauchi", "Ikeja", "Makurdi", "Minna", "Efon-Alaaye", "Ilesa", "Gombe",
            "Kogi", "Abakaliki", "Dutse", "Birnin Kebbi", "Jalingo", "Lafia", "Ikot Ekpene",
            "Owerri", "Shaki", "Iseyin", "Igboho", "Offa", "Iwo", "Ede", "Ejigbo", "Modakeke"
        ]
    },
    
    "Rwanda": {
        "continent": "Africa",
        "region": "Africa",
        "regions": ["Kigali", "Eastern Province", "Northern Province", "Southern Province", "Western Province"],
        "description": "Republic of Rwanda",
        "top_cities": [
            "Kigali", "Butare", "Gitarama", "Ruhengeri", "Gisenyi", "Byumba", "Cyangugu",
            "Kibungo", "Kibuye", "Gikongoro", "Umutara", "Nyanza", "Muhanga", "Musanze",
            "Rubavu", "Nyagatare", "Rwamagana", "Kayonza", "Rusizi", "Karongi", "Ngoma",
            "Bugesera", "Gatsibo", "Kirehe", "Nyaruguru", "Nyamagabe", "Gisagara", "Huye",
            "Kamonyi", "Ruhango", "Nyarugenge", "Gasabo", "Kicukiro", "Burera", "Gakenke",
            "Gicumbi", "Rulindo", "Nyabihu", "Ngororero", "Rutsiro", "Karongi", "Rusizi",
            "Nyamasheke", "Gisagara", "Nyaruguru", "Nyamagabe", "Huye", "Ruhango", "Muhanga"
        ]
    },
    
    "Senegal": {
        "continent": "Africa",
        "region": "Africa",
        "regions": ["Dakar", "Thiès", "Saint-Louis", "Diourbel", "Kaolack", "Tambacounda"],
        "description": "Republic of Senegal",
        "top_cities": [
            "Dakar", "Pikine", "Touba", "Thiès", "Kaolack", "Saint-Louis", "Mbour", "Ziguinchor",
            "Diourbel", "Tambacounda", "Rufisque", "Kolda", "Fatick", "Louga", "Matam", "Kédougou",
            "Sédhiou", "Guédiawaye", "Mbacké", "Tivaouane", "Bambey", "Joal-Fadiout", "Pout",
            "Khombole", "Cayar", "Mékhé", "Kébémer", "Linguère", "Dagana", "Podor", "Richard-Toll",
            "Rosso", "Foundiougne", "Sokone", "Toubacouta", "Gossas", "Nioro du Rip", "Kahone",
            "Ndoffane", "Kaffrine", "Koungheul", "Malem-Hodar", "Birkelane", "Maka", "Missirah",
            "Vélingara", "Médina Yoro Foulah", "Linkering", "Diaoubé"
        ]
    },
    
    "South Africa": {
        "continent": "Africa",
        "region": "Africa",
        "regions": ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape"],
        "description": "Republic of South Africa",
        "top_cities": [
            "Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth", "Pietermaritzburg",
            "Benoni", "Tembisa", "East London", "Vereeniging", "Bloemfontein", "Boksburg",
            "Welkom", "Newcastle", "Krugersdorp", "Diepsloot", "Botshabelo", "Brakpan",
            "Witbank", "Oberholzer", "Centurion", "Roodepoort", "Pietermaritzburg", "Springs",
            "Carletonville", "Klerksdorp", "Midrand", "Westonaria", "Potchefstroom", "Randburg",
            "Vanderbijlpark", "Kimberley", "Rustenburg", "Polokwane", "Nelspruit", "Paarl",
            "Stellenbosch", "George", "Knysna", "Hermanus", "Worcester", "Oudtshoorn", "Mossel Bay",
            "Beaufort West", "Upington", "Springbok", "Alexander Bay", "Port Nolloth", "Calvinia"
        ]
    },
    
    "Algeria": {
        "continent": "Africa",
        "region": "Africa",
        "regions": ["Algiers", "Oran", "Constantine"],
        "description": "People's Democratic Republic of Algeria",
        "top_cities": [
            "Algiers", "Oran", "Constantine", "Annaba", "Blida", "Batna", "Djelfa", "Sétif", "Sidi Bel Abbès",
            "Biskra", "Tébessa", "El Oued", "Skikda", "Tiaret", "Béjaïa", "Tlemcen", "Ouargla", "Béchar",
            "Mostaganem", "Bordj Bou Arréridj", "Chlef", "Bouira", "Tarf", "Jijel", "Relizane", "Khenchela",
            "Souk Ahras", "El Eulma", "Ghardaïa", "Laghouat", "Ksar el Boukhari", "Touggourt", "Azzaba",
            "M'Sila", "Oum el Bouaghi", "El Khroub", "El Madania", "Aïn Beïda", "Bordj el Kiffan", "Kouba",
            "Afir", "Draria", "Bouzareah", "Bir el Djir", "Es Senia", "Arzew", "Sig", "Perrégaux"
        ]
    },
    
    "Egypt": {
        "continent": "Africa",
        "region": "Africa",
        "regions": ["Cairo", "Alexandria", "Giza"],
        "description": "Arab Republic of Egypt",
        "top_cities": [
            "Cairo", "Alexandria", "Giza", "Shubra el-Kheima", "Port Said", "Suez", "Luxor", "al-Mansura",
            "el-Mahalla el-Kubra", "Tanta", "Asyut", "Ismailia", "Fayyum", "Zagazig", "Aswan", "Damietta",
            "Damanhur", "al-Minya", "Beni Suef", "Qena", "Sohag", "Hurghada", "6th of October City",
            "Shibin el Kom", "Banha", "Kafr el-Sheikh", "Arish", "Mallawi", "10th of Ramadan City",
            "Bilbays", "Marsa Matruh", "Idfu", "Mit Ghamr", "al-Hamidiyya", "Desouk", "Qalyub", "Abu Kabir",
            "Kafr el-Dawwar", "Girga", "Akhmim", "Matareya", "New Cairo", "Badr City", "El Shorouk",
            "New Administrative Capital", "Sadat City", "El Obour City", "15th of May City", "Heliopolis"
        ]
    },
    
    "Ethiopia": {
        "continent": "Africa",
        "region": "Africa",
        "regions": ["Addis Ababa", "Oromia", "Amhara"],
        "description": "Federal Democratic Republic of Ethiopia",
        "top_cities": [
            "Addis Ababa", "Dire Dawa", "Mek'ele", "Adama", "Awasa", "Bahir Dar", "Gondar", "Dessie",
            "Jimma", "Jijiga", "Shashamane", "Nekemte", "Bishoftu", "Asosa", "Harar", "Dilla", "Sodo",
            "Arba Minch", "Hosaena", "Haramaya", "Adigrat", "Debre Markos", "Kombolcha", "Debre Birhan",
            "Sebeta", "Ziway", "Wolkite", "Bonga", "Gambela", "Tepi", "Mizan Teferi", "Dembi Dolo",
            "Goba", "Robe", "Dodola", "Adaba", "Bekoji", "Asella", "Ambo", "Holeta", "Ginchi", "Guder",
            "Waliso", "Mojo", "Dukem", "Gedera", "Sendafa", "Chancho", "Sululta", "Alem Gena", "Legetafo"
        ]
    },
    
    "Libya": {
        "continent": "Africa",
        "region": "Africa",
        "regions": ["Tripoli", "Benghazi", "Misrata"],
        "description": "State of Libya",
        "top_cities": [
            "Tripoli", "Benghazi", "Misrata", "Tarhuna", "Al Bayda", "Zawiya", "Zliten", "Ajdabiya",
            "Tobruk", "Sabha", "Derna", "Sirte", "Gharyan", "Kufra", "Marj", "Ubari", "Ghat", "Murzuq",
            "Yafran", "Nalut", "Zuwara", "Sabratha", "Surman", "Tajura", "Janzur", "Garabulli",
            "Khoms", "Msallata", "Bani Walid", "Waddan", "Hun", "Sukna", "Zalla", "Tmassa", "Awjila",
            "Jalu", "Marada", "Agedabia", "Brega", "Ras Lanuf", "Bin Jawad", "Nofaliya", "Harawa",
            "Sidra", "Uqayla", "Bishr", "Maaten al-Sarra", "Rebiana", "Tazerbo", "Gatrun", "Tmessa"
        ]
    },
    
    "Morocco": {
        "continent": "Africa",
        "region": "Africa",
        "regions": ["Casablanca", "Rabat", "Marrakech"],
        "description": "Kingdom of Morocco",
        "top_cities": [
            "Casablanca", "Rabat", "Fez", "Marrakech", "Agadir", "Tangier", "Meknes", "Oujda", "Kenitra",
            "Tetouan", "Safi", "Mohammedia", "Khouribga", "El Jadida", "Beni Mellal", "Nador", "Taza",
            "Settat", "Larache", "Ksar el-Kebir", "Sale", "Berrechid", "Khemisset", "Inezgane", "Khenifra",
            "Sidi Kacem", "Sidi Slimane", "Errachidia", "Guelmim", "Ouarzazate", "Taourirt", "Youssoufia",
            "Fkih Ben Salah", "Tan-Tan", "Sefrou", "Berkane", "Jerada", "Azrou", "Midelt", "Ifrane",
            "Al Hoceima", "Taroudant", "Essaouira", "Tiznit", "Zagora", "Laayoune", "Dakhla", "Boujdour",
            "Smara", "Aousserd", "Guerguerat", "Mahbes", "Bir Lehlou", "Tifariti", "Amgala", "Bir Enzaran"
        ]
    },
    
    "Uganda": {
        "continent": "Africa",
        "region": "Africa",
        "regions": ["Central", "Eastern", "Northern", "Western", "Kampala"],
        "description": "Republic of Uganda",
        "top_cities": [
            "Kampala", "Gulu", "Lira", "Mbarara", "Jinja", "Mbale", "Mukono", "Kasese", "Masaka",
            "Entebbe", "Kabale", "Soroti", "Arua", "Hoima", "Tororo", "Kitgum", "Koboko", "Apac",
            "Iganga", "Bugiri", "Busia", "Pallisa", "Kumi", "Katakwi", "Moroto", "Kotido", "Nakapiripirit",
            "Abim", "Kaabong", "Amudat", "Bundibugyo", "Ntungamo", "Bushenyi", "Ishaka", "Rubirizi",
            "Mitooma", "Sheema", "Buhweju", "Kiruhura", "Ibanda", "Isingiro", "Lyantonde", "Sembabule",
            "Lwengo", "Kyotera", "Rakai", "Kalangala", "Masaka", "Bukomansimbi", "Kalungu"
        ]
    },

    # Middle East (33 regions)
    "Israel": {
        "continent": "Asia",
        "region": "Middle East",
        "regions": ["Tel Aviv", "Jerusalem", "Haifa", "Beersheba"],
        "description": "State of Israel",
        "top_cities": [
            "Jerusalem", "Tel Aviv", "Haifa", "Rishon LeZion", "Petah Tikva", "Ashdod", "Netanya",
            "Beer Sheva", "Holon", "Bnei Brak", "Ramat Gan", "Rehovot", "Bat Yam", "Beit Shemesh",
            "Kfar Saba", "Herzliya", "Hadera", "Modiin", "Nazareth", "Ramla", "Lod", "Acre",
            "Nahariya", "Tiberias", "Safed", "Eilat", "Rosh HaAyin", "Givat Shmuel", "Kiryat Ata",
            "Kiryat Gat", "Kiryat Motzkin", "Dimona", "Kiryat Yam", "Sderot", "Netivot", "Ofakim",
            "Migdal HaEmek", "Afula", "Kiryat Shmona", "Beit She'an", "Tira", "Yehud", "Or Yehuda",
            "Kiryat Ono", "Givatayim", "Raanana", "Hod HaSharon", "Karmiel", "Ma'ale Adumim", "Ariel"
        ]
    },
    
    "Jordan": {
        "continent": "Asia",
        "region": "Middle East",
        "regions": ["Amman", "Zarqa"],
        "description": "Hashemite Kingdom of Jordan",
        "top_cities": [
            "Amman", "Zarqa", "Irbid", "Russeifa", "Wadi as-Sir", "Ajloun", "Madaba", "Aqaba",
            "Sahab", "Al Ramtha", "Tafila", "Jerash", "Ma'an", "Karak", "Salt", "Mafraq",
            "Azraq", "Umm Qais", "Ajlun", "Deir Alla", "Fuheis", "Ain al-Basha", "Jubayhah",
            "Sweileh", "Khalda", "Abdoun", "Rabieh", "Marj al-Hamam", "Na'ur", "Abu Nsair",
            "Umm Uthaina", "Marka", "Muwaqqar", "Qweismeh", "Al-Jubaiha", "Tla'a Al-Ali",
            "Al-Hashemi", "Jabal al-Nasr", "Shafa Badran", "Jabal Amman", "Downtown Amman",
            "Abdali", "Al-Weibdeh", "Jabal al-Lweibdeh", "Al-Kindi", "Hai Nazzal", "Al-Ashrafiyeh",
            "Um Al-Summaq", "Tabarbour", "Al-Muqabalein", "Marj al-Hamam"
        ]
    },
    
    "Palestine": {
        "continent": "Asia", 
        "region": "Middle East",
        "regions": ["West Bank", "Gaza Strip"],
        "description": "State of Palestine",
        "top_cities": [
            "Gaza", "Hebron", "Nablus", "Khan Yunis", "Rafah", "Ramallah", "Bethlehem", "Tulkarm",
            "Qalqilya", "Jenin", "Jericho", "Salfit", "Tubas", "Beit Lahia", "Beit Hanoun",
            "Deir al-Balah", "Jabalya", "Abasan al-Kabira", "Al-Bureij", "Al-Maghazi", "An-Nuseirat",
            "Az-Zawayda", "Bani Suheila", "Al-Qarara", "Khuza'a", "Al-Fukhari", "Abasan as-Saghira",
            "Al-Farahin", "Al-Musaddar", "Bir al-Na'ja", "Al-Shokah", "Dura", "Yatta", "Halhul",
            "Beit Ummar", "Tarqumiyah", "Beit Awwa", "Idhna", "Surif", "Beit Kahil", "Sa'ir",
            "Ash-Shuyukh", "Al-Arroub", "Az-Zahiriyah", "Beit Ula", "Adh-Dhahiriya", "Kharas",
            "Al-Fawar", "Beit Einun", "Al-Heila", "Al-Koum"
        ]
    },
    
    "Qatar": {
        "continent": "Asia",
        "region": "Middle East", 
        "regions": ["Doha", "Al Rayyan", "Al Wakrah", "Al Khor"],
        "description": "State of Qatar",
        "top_cities": [
            "Doha", "Al Rayyan", "Al Wakrah", "Al Khor", "Umm Salal", "Al Daayen", "Madinat ash Shamal",
            "Al Shamal", "Al Shahaniya", "Lusail", "Education City", "West Bay", "Al Sadd",
            "Al Nasr", "Al Markhiya", "Al Aziziyah", "Al Thumama", "Al Waab", "Al Gharrafa",
            "Al Hilal", "Al Meshaf", "Al Murra", "Al Sailiya", "Al Wukair", "Mesaieed", "Ras Laffan",
            "Al Kharrara", "Al Kheesa", "Al Egla", "Al Jeryan", "Rawdat Rashid", "Al Utouriya",
            "Simaisma", "Al Khuwayr", "Fuwairit", "Al Arish", "Al Ghuwariyah", "Al Jemailiya",
            "Al Jumaliyah", "Al Karaana", "Al Khor Community", "Al Thakhira", "Ash Shahaniya",
            "Dukhan", "Umm Bab", "Zekreet", "Al Jumayliyah", "Rawdat Al Faras", "Umm Qarn", "Al Nasraniya"
        ]
    },
    
    "Tunisia": {
        "continent": "Africa",
        "region": "Middle East",
        "regions": ["Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte", "Gabès", "Ariana", "Gafsa"],
        "description": "Republic of Tunisia",
        "top_cities": [
            "Tunis", "Sfax", "Sousse", "Ettadhamen", "Kairouan", "Bizerte", "Gabès", "Ariana",
            "La Soukra", "Gafsa", "El Mourouj", "Kasserine", "Ben Arous", "Midoun", "Bardo",
            "Le Kef", "Mahdia", "Monastir", "Tataouine", "Medenine", "Nabeul", "Béja", "Siliana",
            "Zaghouan", "Jendouba", "Sidi Bouzid", "Tozeur", "Kebili", "Manouba", "Hammam-Lif",
            "Hammam Sousse", "Msaken", "Menzel Bourguiba", "Grombalia", "Ksar Hellal", "Moknine",
            "Oued Lill", "Tebourba", "Mateur", "Ras Jebel", "Menzel Abderhaman", "Goubellat",
            "Korba", "Soliman", "Menzel Bouzelfa", "Beni Khalled", "Kelibia", "El Haouaria",
            "Takelsa", "Menzel Temime"
        ]
    },
    
    "Turkey": {
        "continent": "Asia/Europe",
        "region": "Middle East",
        "regions": ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya", "Adana", "Konya", "Gaziantep"],
        "description": "Republic of Turkey",
        "top_cities": [
            "Istanbul", "Ankara", "Izmir", "Bursa", "Antalya", "Adana", "Konya", "Gaziantep",
            "Mersin", "Diyarbakır", "Kayseri", "Eskişehir", "Urfa", "Malatya", "Erzurum", "Van",
            "Batman", "Elazığ", "İzmit", "Manisa", "Sivas", "Gebze", "Balıkesir", "Tarsus",
            "Kahramanmaraş", "Van", "Denizli", "Sakarya", "Trabzon", "Ordu", "Afyon", "Kütahya",
            "Isparta", "İnegöl", "Tekirdağ", "Çorum", "Karaman", "Kırıkkale", "Antakya", "Rize",
            "Siirt", "Zonguldak", "Aksaray", "Aydin", "Usak", "Edirne", "Corlu", "Kartal",
            "Darıca", "Tuzla", "Pendik", "Kadikoy"
        ]
    },
    
    "United Arab Emirates": {
        "continent": "Asia",
        "region": "Middle East",
        "regions": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Fujairah"],
        "description": "United Arab Emirates",
        "top_cities": [
            "Dubai", "Abu Dhabi", "Sharjah", "Al Ain", "Ajman", "Ras Al Khaimah", "Fujairah",
            "Umm Al Quwain", "Khor Fakkan", "Dibba Al-Fujairah", "Dibba Al-Hisn", "Kalba",
            "Madinat Zayed", "Ruwais", "Ghayathi", "Sila", "Mirfa", "Jebel Dhanna", "Dalma",
            "Bu Hasa", "Habshan", "Asab", "Shah", "Tarif", "Bida Zayed", "Al Khatam", "Al Wagan",
            "Mezaira", "Sweihan", "Al Khaznah", "Al Salamat", "Al Yahar", "Nahel", "Al Qua",
            "Hatta", "Al Hajar", "Masafi", "Al Dhaid", "Falaj Al Mualla", "Al Madam", "Adhen",
            "Al Humraniyah", "Manama", "Al Hamraniyah", "Al Lisaili", "Wadi Al Helo", "Al Rafaah",
            "Al Shuwaib", "Al Thuqeibah", "Al Faya", "Al Faqa"
        ]
    },

    # South & South-East Asia (90 regions from GeoGuessr coverage)
    "Bangladesh": {
        "continent": "Asia",
        "region": "South & South-East Asia",
        "regions": ["Dhaka", "Chittagong", "Rajshahi", "Khulna", "Sylhet"],
        "description": "People's Republic of Bangladesh",
        "top_cities": [
            "Dhaka", "Chittagong", "Comilla", "Rajshahi", "Sylhet", "Khulna", "Rangpur", "Barisal",
            "Mymensingh", "Narayanganj", "Brahmanbaria", "Tangail", "Jamalpur", "Kishoreganj",
            "Netrokona", "Sherpur", "Gazipur", "Manikganj", "Munshiganj", "Narsingdi", "Faridpur",
            "Gopalganj", "Madaripur", "Rajbari", "Shariatpur", "Jessore", "Jhenaidah", "Kushtia",
            "Magura", "Meherpur", "Narail", "Chuadanga", "Satkhira", "Bagerhat", "Pirojpur",
            "Jhalokati", "Barguna", "Patuakhali", "Bhola", "Feni", "Lakshmipur", "Noakhali",
            "Chandpur", "Cumilla", "Cox's Bazar", "Bandarban", "Khagrachhari", "Rangamati",
            "Habiganj", "Moulvibazar", "Sunamganj", "Dinajpur", "Gaibandha"
        ]
    },
    
    "Bhutan": {
        "continent": "Asia",
        "region": "South & South-East Asia",
        "regions": ["Thimphu", "Paro", "Punakha", "Wangdue Phodrang", "Bumthang"],
        "description": "Kingdom of Bhutan",
        "top_cities": [
            "Thimphu", "Phuntsholing", "Punakha", "Paro", "Wangdue Phodrang", "Jakar", "Mongar",
            "Trashigang", "Samdrup Jongkhar", "Gelegphu", "Trongsa", "Lhuentse", "Samtse",
            "Haa", "Dagana", "Tsirang", "Sarpang", "Zhemgang", "Bumthang", "Chhukha",
            "Pemagatshel", "Thimphu Dzong", "Simtokha", "Motithang", "Changkha", "Dechencholing",
            "Babesa", "Lungtenphu", "Taba", "Zilukha", "Kawajangsa", "Hongtsho", "Changzamtog",
            "Dumsibu", "Upper Motithang", "Yangchenphug", "Zamazingka", "Dechencholing", "Centenary Farmers Market",
            "Memorial Chorten", "Clock Tower Square", "Weekend Market", "Norzin Lam", "Chang Lam", "Wogzin Lam"
        ]
    },
    
    "Cambodia": {
        "continent": "Asia",
        "region": "South & South-East Asia",
        "regions": ["Phnom Penh", "Siem Reap", "Battambang", "Preah Sihanouk", "Kampong Cham", "Kandal", "Takéo", "Kampot"],
        "description": "Kingdom of Cambodia",
        "top_cities": [
            "Phnom Penh", "Siem Reap", "Battambang", "Sihanoukville", "Kampong Cham", "Poipet",
            "Pursat", "Kampong Chhnang", "Kratie", "Koh Kong", "Stung Treng", "Preah Vihear",
            "Mondulkiri", "Ratanakiri", "Banteay Meanchey", "Oddar Meanchey", "Pailin", "Kep",
            "Kampot", "Takéo", "Kandal", "Svay Rieng", "Prey Veng", "Kampong Speu", "Kampong Thom",
            "Preah Sihanouk", "Ta Khmau", "Sisophon", "Paoy Pet", "Bavet", "Kampong Som", "Kampong Saom",
            "Kompong Thom", "Kompong Cham", "Kompong Chhnang", "Kompong Speu", "Stoeng Saen", "Tbong Khmum",
            "Prey Veng", "Svay Rieng", "Takhmao", "Ang Snoul", "Bati", "Kien Svay", "Mukh Kampul",
            "Ponhea Kraek", "S'ang", "Kandal Stueng", "Kaoh Thum", "Lvea Aem"
        ]
    },
    
    "Christmas Island": {
        "continent": "Asia",
        "region": "South & South-East Asia",
        "regions": ["Flying Fish Cove", "Settlement", "The Pink House"],
        "description": "Christmas Island",
        "top_cities": ["Flying Fish Cove", "Settlement", "Poon Saan", "Drumsite", "Silver City"]
    },
    
    "India": {
        "continent": "Asia",
        "region": "South & South-East Asia",
        "regions": ["Maharashtra", "Tamil Nadu", "Karnataka", "Gujarat", "Rajasthan"],
        "description": "Republic of India",
        "top_cities": [
            "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat",
            "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam",
            "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad",
            "Meerut", "Rajkot", "Kalyan-Dombivali", "Vasai-Virar", "Varanasi", "Srinagar", "Aurangabad",
            "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur",
            "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur"
        ]
    },
    
    "Indonesia": {
        "continent": "Asia",
        "region": "South & South-East Asia",
        "regions": ["Jakarta", "West Java", "Central Java", "East Java", "Bali", "North Sumatra", "South Sumatra", "Lampung", "South Sulawesi"],
        "description": "Republic of Indonesia",
        "top_cities": [
            "Jakarta", "Surabaya", "Bandung", "Bekasi", "Medan", "Tangerang", "Depok", "Semarang",
            "Palembang", "Makassar", "South Tangerang", "Batam", "Bogor", "Pekanbaru", "Bandar Lampung",
            "Padang", "Malang", "Denpasar", "Samarinda", "Tasikmalaya", "Pontianak", "Balikpapan",
            "Jambi", "Surakarta", "Manado", "Kupang", "Serang", "Yogyakarta", "Cimahi", "Bengkulu",
            "Mataram", "Jayapura", "Kediri", "Tegal", "Banda Aceh", "Tarakan", "Gorontalo", "Dumai",
            "Purwokerto", "Cilegon", "Binjai", "Langsa", "Lhokseumawe", "Tanjungpinang", "Palangka Raya",
            "Sorong", "Kendari", "Ternate", "Tidore", "Ambon"
        ]
    },
    
    "Laos": {
        "continent": "Asia",
        "region": "South & South-East Asia",
        "regions": ["Vientiane", "Luang Prabang", "Savannakhet", "Pakse", "Thakhek", "Xam Neua"],
        "description": "Lao People's Democratic Republic",
        "top_cities": [
            "Vientiane", "Pakse", "Savannakhet", "Luang Prabang", "Thakhek", "Xam Neua", "Muang Xay",
            "Phongsaly", "Sainyabuli", "Attapeu", "Xieng Khouang", "Salavan", "Sekong", "Khammouane",
            "Bolikhamxay", "Houaphanh", "Luang Namtha", "Ouddomxay", "Bokeo", "Champasak", "Saravan",
            "Xekong", "Attapu", "Pakxe", "Tha Khaek", "Luang Nam Tha", "Muang Sing", "Huay Xai",
            "Muang Kham", "Phonsavan", "Muang Khoun", "Ban Houayxay", "Muang Long", "Muang Ngoi",
            "Nong Khiaw", "Pak Mong", "Ban Nakasang", "Don Det", "Don Khon", "Muang Khong",
            "Champasak Town", "Wat Phou", "Khong Island", "Si Phan Don", "Tad Lo", "Salavan Town"
        ]
    },
    
    "Malaysia": {
        "continent": "Asia",
        "region": "South & South-East Asia",
        "regions": ["Kuala Lumpur", "Selangor", "Johor", "Perak", "Penang", "Sabah", "Sarawak", "Pahang", 
                  "Kedah", "Kelantan", "Terengganu", "Negeri Sembilan", "Melaka", "Perlis", "Putrajaya", "Labuan"],
        "description": "Malaysia",
        "top_cities": [
            "Kuala Lumpur", "George Town", "Ipoh", "Shah Alam", "Petaling Jaya", "Johor Bahru", "Seremban",
            "Kuala Terengganu", "Kota Bharu", "Kota Kinabalu", "Sandakan", "Kuching", "Tawau", "Miri",
            "Sibu", "Kangar", "Alor Setar", "Sungai Petani", "Taiping", "Seberang Perai", "Klang",
            "Kajang", "Ampang Jaya", "Subang Jaya", "Cheras", "Puchong", "Sepang", "Seri Kembangan",
            "Balakong", "Ampang", "Gombak", "Rawang", "Selayang", "Batu Caves", "Cyberjaya", "Putrajaya",
            "Nilai", "Port Dickson", "Banting", "Jenjarom", "Kuala Langat", "Bangi", "Kajang", "Semenyih",
            "Beranang", "Dengkil", "Batu Pahat", "Muar", "Segamat", "Kluang", "Pontian"
        ]
    },
    
    "Pakistan": {
        "continent": "Asia",
        "region": "South & South-East Asia",
        "regions": ["Punjab", "Sindh"],
        "description": "Islamic Republic of Pakistan",
        "top_cities": [
            "Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Gujranwala", "Peshawar", "Multan", "Hyderabad",
            "Islamabad", "Quetta", "Bahawalpur", "Sargodha", "Sialkot", "Sukkur", "Larkana", "Sheikhupura",
            "Jhang", "Rahimyar Khan", "Gujrat", "Kasur", "Mardan", "Mingora", "Dera Ghazi Khan", "Sahiwal",
            "Nawabshah", "Okara", "Wah Cantonment", "Ding", "Mirpur Khas", "Chiniot", "Kamoke", "Mandi Bahauddin",
            "Jhelum", "Sadiqabad", "Jacobabad", "Shikarpur", "Khanewal", "Hafizabad", "Kohat", "Muzaffargarh",
            "Khanpur", "Gojra", "Bahawalnagar", "Muridke", "Pak Pattan", "Abottabad", "Tando Allahyar",
            "Jaranwala", "Chishtian", "Daska", "Mianwali"
        ]
    },
    
    "Philippines": {
        "continent": "Asia",
        "region": "South & South-East Asia",
        "regions": ["Metro Manila", "Calabarzon", "Central Luzon", "Western Visayas", "Central Visayas", 
                  "Northern Mindanao", "Davao", "Soccsksargen"],
        "description": "Republic of the Philippines",
        "top_cities": [
            "Quezon City", "Manila", "Caloocan", "Las Piñas", "Makati", "Pasig", "Taguig", "Marikina",
            "Muntinlupa", "Parañaque", "Valenzuela", "Malabon", "Pasay", "Mandaluyong", "San Juan",
            "Pateros", "Cebu City", "Davao City", "Zamboanga City", "Antipolo", "Taguig", "Pasig",
            "Cagayan de Oro", "Paranaque", "Dasmarinas", "General Santos", "Las Pinas", "Makati",
            "Bacoor", "Iloilo City", "Marikina", "Muntinlupa", "Bacolod", "San Jose del Monte", "Calamba",
            "Imus", "Batangas City", "Cainta", "Baguio", "Iligan", "Lucena", "Mandaue", "Butuan",
            "Angeles", "Tarlac City", "Baliuag", "Malolos", "Meycauayan", "San Fernando", "Mabalacat"
        ]
    },
    
    "Singapore": {
        "continent": "Asia",
        "region": "South & South-East Asia",
        "regions": ["Central Region", "North Region", "Northeast Region"],
        "description": "Republic of Singapore",
        "top_cities": [
            "Singapore", "Jurong West", "Woodlands", "Tampines", "Sengkang", "Hougang", "Yishun",
            "Bedok", "Punggol", "Ang Mo Kio", "Toa Payoh", "Clementi", "Pasir Ris", "Choa Chu Kang",
            "Bukit Merah", "Bishan", "Geylang", "Kallang", "Queenstown", "Central Area", "Bukit Batok",
            "Bukit Panjang", "Sembawang", "Marine Parade", "Novena", "Orchard", "Downtown Core",
            "Newton", "Tanglin", "River Valley", "Rochor", "Outram", "Bukit Timah", "Holland Village",
            "Chinatown", "Little India", "Kampong Glam", "Marina Bay", "Sentosa", "Changi", "Tuas",
            "Pioneer", "Boon Lay", "Lakeside", "Chinese Garden", "Jurong East", "Buona Vista",
            "Commonwealth", "Redhill", "Tiong Bahru", "Alexandra", "Harbourfront"
        ]
    },
    
    "Sri Lanka": {
        "continent": "Asia",
        "region": "South & South-East Asia",
        "regions": ["Western Province", "Central Province", "Southern Province", "Northern Province", 
                  "Eastern Province", "North Western Province", "North Central Province", "Uva Province", "Sabaragamuwa Province"],
        "description": "Democratic Socialist Republic of Sri Lanka",
        "top_cities": [
            "Colombo", "Dehiwala-Mount Lavinia", "Moratuwa", "Sri Jayawardenepura Kotte", "Negombo",
            "Kandy", "Kalmunai", "Vavuniya", "Galle", "Trincomalee", "Batticaloa", "Jaffna", "Katunayake",
            "Dambulla", "Kolonnawa", "Gampaha", "Puttalam", "Badulla", "Kalutara", "Bentota", "Matara",
            "Panadura", "Beruwala", "Kelaniya", "Peliyagoda", "Wattala", "Ja-Ela", "Ragama", "Kandana",
            "Kiribathgoda", "Maharagama", "Kotte", "Rajagiriya", "Battaramulla", "Nugegoda", "Dehiwala",
            "Mount Lavinia", "Ratmalana", "Boralesgamuwa", "Piliyandala", "Kesbewa", "Homagama",
            "Padukka", "Hanwella", "Avissawella", "Seethawaka", "Kaduwela", "Malabe", "Athurugiriya",
            "Thalawathugoda", "Hokandara", "Pannipitiya", "Maharagama"
        ]
    },
    
    "Thailand": {
        "continent": "Asia",
        "region": "South & South-East Asia",
        "regions": ["Bangkok", "Central Thailand", "Northern Thailand", "Northeastern Thailand", 
                  "Eastern Thailand", "Western Thailand", "Southern Thailand", "Chiang Mai", "Phuket", "Pattaya"],
        "description": "Kingdom of Thailand",
        "top_cities": [
            "Bangkok", "Nonthaburi", "Pak Kret", "Hat Yai", "Chiang Mai", "Udon Thani", "Surat Thani",
            "Khon Kaen", "Nakhon Ratchasima", "Rayong", "Chon Buri", "Lampang", "Ubon Ratchathani",
            "Ratchaburi", "Phra Nakhon Si Ayutthaya", "Chiang Rai", "Phitsanulok", "Nakhon Sawan",
            "Kamphaeng Phet", "Sukhothai", "Tak", "Uttaradit", "Nan", "Phayao", "Phrae", "Mae Hong Son",
            "Lamphun", "Phichit", "Uthai Thani", "Chai Nat", "Lop Buri", "Sing Buri", "Ang Thong",
            "Suphan Buri", "Nakhon Pathom", "Samut Sakhon", "Samut Songkhram", "Phetchaburi", "Prachuap Khiri Khan",
            "Hua Hin", "Cha-am", "Kanchanaburi", "Ratchaburi", "Phetchaburi", "Prachuap Khiri Khan",
            "Chumphon", "Ranong", "Phuket", "Krabi", "Phang Nga", "Trang"
        ]
    },
    
    "Myanmar": {
        "continent": "Asia",
        "region": "South & South-East Asia",
        "regions": ["Yangon", "Mandalay", "Naypyidaw"],
        "description": "Republic of the Union of Myanmar",
        "top_cities": [
            "Yangon", "Mandalay", "Naypyidaw", "Mawlamyine", "Bago", "Pathein", "Monywa", "Sittwe",
            "Meiktila", "Myitkyina", "Taunggyi", "Pyay", "Hinthada", "Lashio", "Taungoo", "Pakokku",
            "Magway", "Sagaing", "Kyaukse", "Thaton", "Chauk", "Bogale", "Dawei", "Myeik",
            "Kawthoung", "Loikaw", "Hakha", "Falam", "Mindat", "Kanpetlet", "Matupi", "Tedim",
            "Tonzang", "Putao", "Machanbaw", "Injangyang", "Tanai", "Waingmaw", "Chipwi", "Tsawlaw",
            "Muse", "Namtu", "Kyaukme", "Hsipaw", "Kunlong", "Laukkaing", "Konkyan", "Pangwaun"
        ]
    },
    
    "Nepal": {
        "continent": "Asia",
        "region": "South & South-East Asia",
        "regions": ["Kathmandu", "Pokhara", "Lalitpur"],
        "description": "Federal Democratic Republic of Nepal",
        "top_cities": [
            "Kathmandu", "Pokhara", "Lalitpur", "Bharatpur", "Biratnagar", "Birgunj", "Dharan", "Butwal",
            "Hetauda", "Janakpur", "Dhangadhi", "Tulsipur", "Nepalgunj", "Bhim Datta", "Ghorahi",
            "Itahari", "Mechinagar", "Damak", "Birtamod", "Rangeli", "Letang", "Jitpur Simara",
            "Kalaiya", "Rajbiraj", "Lahan", "Siraha", "Malangwa", "Gaur", "Kanchanpur", "Tikapur",
            "Dhangadhi", "Lamahi", "Kohalpur", "Attariya", "Belauri", "Dadeldhura", "Dipayal Silgadhi",
            "Chainpur", "Mangalsen", "Sanfebagar", "Patan", "Madhyapur Thimi", "Kirtipur", "Gokarneshwar",
            "Kageshwari Manohara", "Tarakeshwar", "Tokha", "Budhanilkantha", "Nagarjun", "Chandragiri"
        ]
    },
    
    "Vietnam": {
        "continent": "Asia",
        "region": "South & South-East Asia",
        "regions": ["Hanoi"],
        "description": "Socialist Republic of Vietnam",
        "top_cities": [
            "Ho Chi Minh City", "Hanoi", "Haiphong", "Da Nang", "Bien Hoa", "Hue", "Nha Trang", "Can Tho",
            "Rach Gia", "Qui Nhon", "Vung Tau", "Nam Dinh", "Long Xuyen", "Thai Nguyen", "Thanh Hoa",
            "Buon Ma Thuot", "Ha Long", "Bac Lieu", "Cam Ranh", "Vinh", "My Tho", "Da Lat", "Cao Lanh",
            "Pleiku", "Thai Binh", "Phan Thiet", "Tam Ky", "Uong Bi", "Quang Ngai", "Long Khanh",
            "Dong Hoi", "Tuy Hoa", "Kon Tum", "Dong Ha", "Kien Giang", "Chau Doc", "Sa Dec", "Ben Tre",
            "Bac Kan", "Ha Giang", "Cao Bang", "Lang Son", "Lao Cai", "Yen Bai", "Tuyen Quang",
            "Phu Tho", "Vinh Phuc", "Bac Ninh", "Hung Yen", "Hai Duong", "Ninh Binh", "Ha Nam"
        ]
    },

    # Rest of Asia (33 regions)
    "China": {
        "continent": "Asia",
        "region": "Rest of Asia",
        "regions": ["Beijing"],
        "description": "People's Republic of China",
        "top_cities": [
            "Shanghai", "Beijing", "Chongqing", "Tianjin", "Guangzhou", "Shenzhen", "Wuhan", "Dongguan",
            "Chengdu", "Nanjing", "Foshan", "Shenyang", "Qingdao", "Xi'an", "Hangzhou", "Harbin",
            "Suzhou", "Dalian", "Zhengzhou", "Shantou", "Jinan", "Changchun", "Kunming", "Changsha",
            "Taiyuan", "Hefei", "Shijiazhuang", "Urumqi", "Zibo", "Yantai", "Xuzhou", "Wuxi", "Zhongshan",
            "Ningbo", "Lanzhou", "Tangshan", "Baotou", "Handan", "Anshan", "Fushun", "Weifang",
            "Nanning", "Luoyang", "Daqing", "Yichang", "Jining", "Bengbu", "Mudanjiang", "Jinzhou"
        ]
    },
    
    "Hong Kong": {
        "continent": "Asia",
        "region": "Rest of Asia",
        "regions": ["Hong Kong Island", "Kowloon", "New Territories", "Lantau Island", "Outlying Islands", "Tsuen Wan"],
        "description": "Hong Kong Special Administrative Region",
        "top_cities": [
            "Hong Kong", "Tsuen Wan", "Kwun Tong", "Sha Tin", "Tuen Mun", "Yuen Long", "Tseung Kwan O",
            "Tai Po", "Fanling", "Sheung Shui", "Ma On Shan", "Tin Shui Wai", "Yau Ma Tei", "Mong Kok",
            "Tsim Sha Tsui", "Central", "Wan Chai", "Causeway Bay", "North Point", "Quarry Bay",
            "Chai Wan", "Shau Kei Wan", "Aberdeen", "Wong Chuk Hang", "Stanley", "Repulse Bay",
            "Mid-Levels", "Peak", "Happy Valley", "Pokfulam", "Kennedy Town", "Sai Wan Ho",
            "Tai Koo", "Fortress Hill", "Tin Hau", "Tai Hang", "So Kon Po", "Leighton Hill",
            "Caroline Hill", "Jardine's Lookout", "Broadwood", "Braemar Hill", "North Point", "Quarry Bay"
        ]
    },
    
    "Japan": {
        "continent": "Asia",
        "region": "Rest of Asia",
        "regions": ["Tokyo", "Osaka", "Kyoto", "Hokkaido", "Tohoku", "Kanto", "Chubu", "Kansai", "Chugoku", "Kyushu"],
        "description": "Japan",
        "top_cities": [
            "Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo", "Fukuoka", "Kobe", "Kawasaki", "Kyoto",
            "Saitama", "Hiroshima", "Sendai", "Kitakyushu", "Chiba", "Sakai", "Niigata", "Hamamatsu",
            "Shizuoka", "Sagamihara", "Okayama", "Kumamoto", "Kagoshima", "Funabashi", "Hachioji",
            "Kawaguchi", "Himeji", "Suita", "Matsuyama", "Higashiosaka", "Nishinomiya", "Kurashiki",
            "Ichikawa", "Fukuyama", "Iwaki", "Urawa", "Takatsuki", "Asahikawa", "Toyama", "Toyonaka",
            "Machida", "Nara", "Oita", "Kochi", "Kasukabe", "Tsukuba", "Mito", "Naha", "Fujisawa", "Kashiwa"
        ]
    },
    
    "Afghanistan": {
        "continent": "Asia",
        "region": "Rest of Asia",
        "regions": ["Kabul", "Herat", "Kandahar"],
        "description": "Islamic Emirate of Afghanistan",
        "top_cities": [
            "Kabul", "Kandahar", "Herat", "Mazar-i-Sharif", "Jalalabad", "Kunduz", "Taloqan", "Puli Khumri",
            "Charikar", "Gardez", "Khost", "Bamyan", "Ghazni", "Lashkar Gah", "Farah", "Zaranj",
            "Qalat", "Tirin Kot", "Mahmud-i-Raqi", "Asadabad", "Sharana", "Qala i Naw", "Chaghcharan",
            "Fayzabad", "Bazarak", "Nili", "Mehtarlam", "Baraki Barak", "Maidan Shahr", "Pul-e-Alam",
            "Shberghan", "Sar-e Pol", "Aybak", "Baghlan", "Mihtarlam", "Paghman", "Bagram", "Kapisa",
            "Laghman", "Paktia", "Paktika", "Khost", "Logar", "Wardak", "Parwan", "Samangan"
        ]
    },
    
    "Armenia": {
        "continent": "Asia",
        "region": "Rest of Asia",
        "regions": ["Yerevan", "Shirak", "Lori"],
        "description": "Republic of Armenia",
        "top_cities": [
            "Yerevan", "Gyumri", "Vanadzor", "Vagharshapat", "Hrazdan", "Abovyan", "Kapan", "Armavir",
            "Goris", "Artashat", "Sevan", "Charentsavan", "Ashtarak", "Gavar", "Ararat", "Masis",
            "Ijevan", "Yeghvard", "Sisian", "Kajaran", "Alaverdi", "Akhtala", "Tashir", "Stepanavan",
            "Spitak", "Tumanyan", "Odzun", "Dilijan", "Berd", "Noyemberyan", "Vardenis", "Martuni",
            "Jermuk", "Vayk", "Yeghegnadzor", "Agarak", "Meghri", "Dastakert", "Vedi", "Byurakan",
            "Nor Hachn", "Tsaghkadzor", "Aparan", "Talin", "Artik", "Maralik", "Ani", "Amasia"
        ]
    },
    
    "Azerbaijan": {
        "continent": "Asia",
        "region": "Rest of Asia",
        "regions": ["Baku", "Ganja", "Sumgait"],
        "description": "Republic of Azerbaijan",
        "top_cities": [
            "Baku", "Ganja", "Sumqayit", "Mingachevir", "Quba", "Lankaran", "Nakhchivan", "Shaki", "Yevlakh",
            "Shamakhi", "Qabala", "Zagatala", "Qakh", "Balakan", "Shemkir", "Goygol", "Gedabey", "Dashkasan",
            "Samukh", "Agstafa", "Gazakh", "Tovuz", "Shamkir", "Goranboy", "Tartar", "Barda", "Yevlax",
            "Ağdam", "Fuzuli", "Khojavend", "Shusha", "Khankendi", "Kalbajar", "Lachin", "Qubadli",
            "Zangilan", "Jabrayil", "Gubadli", "Siazan", "Davachi", "Khachmaz", "Shabran", "Qusar",
            "Khizi", "Sumgait", "Absheron", "Qobustan", "Shirvan", "Hajigabul", "Kurdamir", "Imishli"
        ]
    },
    
    "Georgia": {
        "continent": "Asia",
        "region": "Rest of Asia",
        "regions": ["Tbilisi", "Adjara", "Imereti"],
        "description": "Georgia",
        "top_cities": [
            "Tbilisi", "Batumi", "Kutaisi", "Rustavi", "Zugdidi", "Gori", "Poti", "Kobuleti", "Khashuri",
            "Samtredia", "Senaki", "Zestaponi", "Marneuli", "Telavi", "Akhalkalaki", "Ozurgeti", "Kaspi",
            "Chiatura", "Tskaltubo", "Kvareli", "Akhmeta", "Lagodekhi", "Sagarejo", "Gurjaani", "Signagi",
            "Dedoplistskaro", "Bolnisi", "Dmanisi", "Tetritskaro", "Tsalka", "Gardabani", "Mtskheta",
            "Tianeti", "Dusheti", "Stephantsminda", "Kazbegi", "Akhaltsikhe", "Borjomi", "Aspindza",
            "Adigeni", "Akhalkalaki", "Ninotsminda", "Samtskhe", "Javakheti", "Kvemo Kartli", "Shida Kartli"
        ]
    },
    
    "Iran": {
        "continent": "Asia",
        "region": "Rest of Asia",
        "regions": ["Tehran", "Isfahan", "Mashhad"],
        "description": "Islamic Republic of Iran",
        "top_cities": [
            "Tehran", "Mashhad", "Isfahan", "Shiraz", "Tabriz", "Ahvaz", "Qom", "Kermanshah", "Urmia",
            "Zahedan", "Rasht", "Kerman", "Hamadan", "Arak", "Yazd", "Ardabil", "Bandar Abbas", "Eslamshahr",
            "Zanjan", "Sanandaj", "Qazvin", "Khorramabad", "Gorgan", "Sabzevar", "Dezful", "Abadan",
            "Masjed Soleyman", "Bushehr", "Ilam", "Maragheh", "Birjand", "Kashan", "Qorveh", "Malayer",
            "Shahrud", "Najafabad", "Varamin", "Shahreza", "Khomeini Shahr", "Bafq", "Sirjan", "Rafsanjan",
            "Jiroft", "Bam", "Zarand", "Kahnouj", "Minab", "Bandar Lengeh", "Parsian", "Bastak"
        ]
    },
    
    "Iraq": {
        "continent": "Asia",
        "region": "Rest of Asia",
        "regions": ["Baghdad", "Basra", "Mosul"],
        "description": "Republic of Iraq",
        "top_cities": [
            "Baghdad", "Basra", "Mosul", "Erbil", "Najaf", "Karbala", "Sulaymaniyah", "Nasiriyah", "Amarah",
            "Diwaniyah", "Kut", "Hillah", "Ramadi", "Fallujah", "Tikrit", "Samarra", "Baqubah", "Kirkuk",
            "Dahuk", "Zakho", "Sinjar", "Tal Afar", "Haditha", "Hit", "Ana", "Rawa", "Qaim", "Rutba",
            "Salahuddin", "Diyala", "Anbar", "Maysan", "Wasit", "Babylon", "Qadisiyyah", "Muthanna",
            "Dhi Qar", "Basra", "Kurdistan", "Halabja", "Rania", "Kalar", "Chamchamal", "Dokan",
            "Penjwin", "Sangaw", "Choman", "Rawanduz", "Soran", "Shaqlawa", "Koya", "Makhmur"
        ]
    },
    
    "Saudi Arabia": {
        "continent": "Asia",
        "region": "Rest of Asia",
        "regions": ["Riyadh", "Mecca", "Medina"],
        "description": "Kingdom of Saudi Arabia",
        "top_cities": [
            "Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Khobar", "Dhahran", "Taif", "Buraidah",
            "Tabuk", "Khamis Mushait", "Hofuf", "Mubarraz", "Jubail", "Hafar Al-Batin", "Yanbu", "Abha",
            "Najran", "Jizan", "Qatif", "Sakaka", "Al Qunfudhah", "Arar", "Turabah", "Al Majma'ah",
            "Ras Tanura", "Thuqbah", "Tarout", "Sayhat", "Safwa", "Rahima", "Al Kharj", "Al Zulfi",
            "Shaqra", "Afif", "Al Dawadmi", "Rumah", "Mahd adh Dhahab", "Al Ula", "Tayma", "Dumat al Jandal",
            "Turaif", "Qurayyat", "Al Wajh", "Haql", "Duba", "Almuwayh", "Umluj", "Yanbu al Bahr"
        ]
    },
    
    "Uzbekistan": {
        "continent": "Asia",
        "region": "Rest of Asia",
        "regions": ["Tashkent", "Samarkand", "Bukhara"],
        "description": "Republic of Uzbekistan",
        "top_cities": [
            "Tashkent", "Samarkand", "Namangan", "Andijan", "Nukus", "Bukhara", "Qarshi", "Kokand", "Margilan",
            "Ferghana", "Jizzakh", "Urgench", "Gulistan", "Navoiy", "Angren", "Chirchiq", "Termez", "Bekabad",
            "Yangiyer", "Zarafshan", "Kattakurgan", "Khiva", "Shakhrisabz", "Kitab", "Denov", "Boysun",
            "Kumkurgan", "Sherabad", "Muzrabot", "Oltinkul", "Bandikhan", "Jarkurgan", "Kasbi", "Koson",
            "Mirishkor", "Muborak", "Nishon", "Pakhtakor", "Dehqonobod", "Uzun", "Guzar", "Kamashi",
            "Karshi", "Koson", "Mirishkor", "Muborak", "Nishon", "Pakhtakor", "Shahrisabz", "Yakkabog"
        ]
    },
    
    "Kazakhstan": {
        "continent": "Asia",
        "region": "Rest of Asia",
        "regions": ["Almaty", "Nur-Sultan", "Shymkent"],
        "description": "Republic of Kazakhstan",
        "top_cities": [
            "Almaty", "Nur-Sultan", "Shymkent", "Aktobe", "Taraz", "Pavlodar", "Ust-Kamenogorsk", "Semey",
            "Atyrau", "Kostanay", "Kyzylorda", "Petropavl", "Oral", "Temirtau", "Aktau", "Kokshetau",
            "Rudny", "Ekibastuz", "Taldykorgan", "Zhezkazgan", "Arkalyk", "Kentau", "Balkhash", "Lisakovsk",
            "Ridder", "Zharkent", "Stepnogorsk", "Aksay", "Kapchagai", "Shu", "Esik", "Issyk", "Talgar",
            "Kegen", "Zhambyl", "Saryagash", "Turkestan", "Arys", "Lenger", "Baydibek", "Sozak",
            "Tulkibas", "Maktaaral", "Saryagash", "Otrar", "Zhetysay", "Kazygurt", "Ordabasy", "Tyulkubas"
        ]
    },
    
    "Kyrgyzstan": {
        "continent": "Asia",
        "region": "Rest of Asia",
        "regions": ["Bishkek", "Osh", "Jalal-Abad"],
        "description": "Kyrgyz Republic",
        "top_cities": [
            "Bishkek", "Osh", "Jalal-Abad", "Karakol", "Tokmok", "Uzgen", "Naryn", "Talas", "Batken",
            "Kant", "Kara-Balta", "Cholpon-Ata", "Balykchy", "Kochkor", "At-Bashy", "Kerben", "Kyzyl-Kiya",
            "Suluktu", "Mailuu-Suu", "Tash-Kumyr", "Chatkal", "Isfana", "Ak-Suu", "Kara-Suu", "Nookat",
            "Aravan", "Kara-Kulja", "Gulcha", "Toguz-Toro", "Suzak", "Bazar-Korgon", "Tash-Komur", "Kok-Jangak"
        ]
    },
    
    "Mongolia": {
        "continent": "Asia",
        "region": "Rest of Asia",
        "regions": ["Ulaanbaatar", "Darkhan-Uul", "Orkhon"],
        "description": "Mongolia",
        "top_cities": [
            "Ulaanbaatar", "Erdenet", "Darkhan", "Choibalsan", "Murun", "Olgii", "Hovd", "Arvayheer",
            "Bayankhongor", "Mandalgovi", "Dalanzadgad", "Altai", "Uliastai", "Tsetserleg", "Sukhbaatar",
            "Sainshand", "Zamyn-Uud", "Choir", "Undurkhaan", "Bulgan", "Zuunmod", "Nalaikh", "Kharkhorin",
            "Tsagaannuur", "Khatgal", "Khovsgol", "Shine-Ider", "Tosontsengel", "Tarialan", "Rashaant",
            "Erdenebulgan", "Ikh-Uul", "Jargalant"
        ]
    },
    
    "South Korea": {
        "continent": "Asia",
        "region": "Rest of Asia",
        "regions": ["Seoul", "Busan", "Gyeonggi", "Incheon", "Daegu", "Daejeon"],
        "description": "Republic of Korea",
        "top_cities": [
            "Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju", "Suwon", "Ulsan", "Changwon",
            "Goyang", "Yongin", "Seongnam", "Bucheon", "Cheongju", "Ansan", "Jeonju", "Anyang", "Cheonan",
            "Pohang", "Uijeongbu", "Siheung", "Hwaseong", "Gimhae", "Gumi", "Pyeongtaek", "Jinju", "Yangsan",
            "Wonju", "Iksan", "Chuncheon", "Asan", "Gunsan", "Jeju", "Gimpo", "Paju", "Namyangju",
            "Hanam", "Gangneung", "Mokpo", "Suncheon", "Yeosu", "Tongyeong", "Sacheon", "Gongju",
            "Nonsan", "Boryeong", "Seosan", "Dangjin", "Gyeryong"
        ]
    },
    
    "Taiwan": {
        "continent": "Asia",
        "region": "Rest of Asia",
        "regions": ["Taipei", "New Taipei", "Taichung", "Kaohsiung"],
        "description": "Taiwan",
        "top_cities": [
            "Taipei", "New Taipei", "Taichung", "Kaohsiung", "Taoyuan", "Tainan", "Hsinchu", "Keelung",
            "Chiayi", "Changhua", "Pingtung", "Yunlin", "Hualien", "Nantou", "Miaoli", "Yilan", "Taitung",
            "Penghu", "Kinmen", "Lienchiang", "Banqiao", "Taoyuan", "Zhonghe", "Yonghe", "Tucheng",
            "Sanchong", "Xinzhuang", "Xindian", "Luzhou", "Xizhi", "Linkou", "Tamsui", "Shulin",
            "Yingge", "Sanxia", "Ruifang", "Wugu", "Taishan", "Bali", "Pingxi", "Shuangxi",
            "Gongliao", "Jinshan", "Wanli", "Shimen", "Sanzhi", "Jinshan"
        ]
    },

    # Oceania (34 regions)
    "American Samoa": {
        "continent": "Oceania",
        "region": "Oceania",
        "regions": ["Eastern District", "Western District", "Manu'a District", "Rose Island"],
        "description": "American Samoa",
        "top_cities": ["Pago Pago", "Tafuna", "Nu'uuli", "Fagatogo", "Aua", "Vaitogi", "Afono", "Alofau"]
    },
    
    "Australia": {
        "continent": "Oceania",
        "region": "Oceania",
        "regions": ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia", 
                  "Tasmania", "Northern Territory", "Australian Capital Territory", "Norfolk Island", 
                  "Christmas Island", "Cocos Islands", "Heard Island", "Lord Howe Island", "Macquarie Island"],
        "description": "Commonwealth of Australia",
        "top_cities": [
            "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Newcastle", "Canberra",
            "Sunshine Coast", "Wollongong", "Geelong", "Hobart", "Townsville", "Cairns", "Darwin", "Toowoomba",
            "Ballarat", "Bendigo", "Albury-Wodonga", "Launceston", "Mackay", "Rockhampton", "Bunbury",
            "Bundaberg", "Coffs Harbour", "Wagga Wagga", "Hervey Bay", "Mildura", "Shepparton", "Port Macquarie",
            "Gladstone", "Tamworth", "Traralgon", "Orange", "Bowral", "Geraldton", "Alice Springs", "Dubbo",
            "Mount Gambier", "Lismore", "Nelson Bay", "Goulburn", "Taree", "Warrnambool", "Kalgoorlie",
            "Devonport", "Burnie", "Albany", "Broome", "Katherine", "Tennant Creek"
        ]
    },
    
    "Guam": {
        "continent": "Oceania",
        "region": "Oceania",
        "regions": ["Hagatña", "Dededo", "Tamuning"],
        "description": "Guam",
        "top_cities": ["Dededo", "Yigo", "Tamuning", "Mangilao", "Barrigada", "Santa Rita", "Agat", "Mongmong"]
    },
    
    "New Zealand": {
        "continent": "Oceania",
        "region": "Oceania",
        "regions": ["Auckland", "Wellington", "Canterbury", "Waikato", "Bay of Plenty", "Otago", 
                  "Manawatu-Wanganui", "Hawke's Bay", "Northland"],
        "description": "New Zealand",
        "top_cities": [
            "Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga", "Napier-Hastings", "Dunedin",
            "Palmerston North", "Nelson", "Rotorua", "New Plymouth", "Whangarei", "Invercargill", "Whanganui",
            "Gisborne", "Taupo", "Masterton", "Levin", "Timaru", "Oamaru", "Ashburton", "Queenstown",
            "Blenheim", "Pukekohe", "Cambridge", "Rangiora", "Feilding", "Kapiti", "Upper Hutt", "Porirua",
            "Lower Hutt", "Waitakere", "North Shore", "Manukau", "Papakura", "Franklin", "Rodney",
            "Thames-Coromandel", "Hauraki", "Matamata-Piako", "Waipa", "Otorohanga", "South Waikato",
            "Waitomo", "Taupo", "Western Bay of Plenty", "Kawerau", "Opotiki"
        ]
    },
    
    "Northern Mariana Islands": {
        "continent": "Oceania",
        "region": "Oceania",
        "regions": ["Saipan", "Tinian", "Rota"],
        "description": "Northern Mariana Islands",
        "top_cities": ["Saipan", "San Jose", "Tinian", "Rota", "Northern Islands"]
    },
    
    "U.S. Minor Outlying Islands": {
        "continent": "Oceania",
        "region": "Oceania",
        "regions": ["Wake Island"],
        "description": "U.S. Minor Outlying Islands",
        "top_cities": ["Wake Island", "Midway Islands", "Johnston Atoll"]
    },

    # Latin America - South America (80 regions from comprehensive coverage)
    "Argentina": {
        "continent": "South America",
        "region": "Latin America",
        "regions": ["Buenos Aires", "Córdoba", "Santa Fe", "Mendoza", "Tucumán", "Entre Ríos", "Salta", "Chaco", "Corrientes"],
        "description": "Argentine Republic",
        "top_cities": [
            "Buenos Aires", "Córdoba", "Rosario", "Mendoza", "Tucumán", "La Plata", "Mar del Plata", "Salta",
            "Santa Fe", "San Juan", "Resistencia", "Neuquén", "Santiago del Estero", "Corrientes", "Avellaneda",
            "Bahía Blanca", "San Salvador de Jujuy", "Paraná", "Posadas", "San Luis", "Catamarca", "Formosa",
            "San Rafael", "Comodoro Rivadavia", "Concordia", "San Nicolás", "Tandil", "La Rioja", "Río Cuarto",
            "San Carlos de Bariloche", "Pergamino", "Zárate", "Luján", "Campana", "Venado Tuerto", "Azul",
            "Olavarría", "Junín", "Mercedes", "San Pedro", "Tres Arroyos", "Balcarce", "Necochea", "Chivilcoy",
            "San Martín", "Villa María", "Bell Ville", "Río Tercero", "Cruz del Eje", "Jesús María"
        ]
    },
    
    "Bolivia": {
        "continent": "South America",
        "region": "Latin America",
        "regions": ["La Paz", "Santa Cruz"],
        "description": "Plurinational State of Bolivia",
        "top_cities": [
            "Santa Cruz de la Sierra", "El Alto", "La Paz", "Cochabamba", "Sucre", "Tarija", "Potosí", "Oruro",
            "Trinidad", "Cobija", "Riberalta", "Guayaramerín", "Yacuiba", "Montero", "Warnes", "La Guardia",
            "Mairana", "Portachuelo", "Cotoca", "Pailón", "El Torno", "Mineros", "Okinawa", "San Pedro",
            "Yapacani", "Buena Vista", "San Javier", "Ascensión de Guarayos", "Urubicha", "El Puente",
            "San Ramón", "San Julián", "Cuatro Cañadas", "Fernández Alonso", "Hardeman", "Paurito",
            "Colpa Bélgica", "Santa Rosa del Sara", "Saavedra", "Cabezas", "Gutierrez", "Camiri",
            "Lagunillas", "Charagua", "Boyuibe", "Puerto Suárez", "Puerto Quijarro", "San Matías"
        ]
    },
    
    "Brazil": {
        "continent": "South America",
        "region": "Latin America", 
        "regions": [
            "São Paulo", "Rio de Janeiro", "Minas Gerais", "Bahia", "Paraná", "Rio Grande do Sul",
            "Pernambuco", "Ceará", "Pará", "Santa Catarina", "Goiás", "Maranhão", "Paraíba", "Espírito Santo",
            "Piauí", "Alagoas", "Rio Grande do Norte", "Mato Grosso", "Mato Grosso do Sul", "Distrito Federal",
            "Sergipe", "Rondônia", "Acre", "Amazonas", "Roraima", "Amapá", "Tocantins"
        ],
        "description": "Federative Republic of Brazil",
        "top_cities": [
            "São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus",
            "Curitiba", "Recife", "Goiânia", "Belém", "Porto Alegre", "Guarulhos", "Campinas", "São Luís",
            "São Gonçalo", "Maceió", "Duque de Caxias", "Natal", "Teresina", "Campo Grande", "Nova Iguaçu",
            "São Bernardo do Campo", "João Pessoa", "Santo André", "Osasco", "Jaboatão dos Guararapes",
            "São José dos Campos", "Ribeirão Preto", "Uberlândia", "Sorocaba", "Contagem", "Aracaju",
            "Feira de Santana", "Cuiabá", "Joinville", "Juiz de Fora", "Londrina", "Aparecida de Goiânia",
            "Ananindeua", "Porto Velho", "Serra", "Niterói", "Caxias do Sul", "Macapá", "Mauá", "Carapicuíba"
        ]
    },
    
    "Chile": {
        "continent": "South America",
        "region": "Latin America",
        "regions": ["Santiago", "Valparaíso", "Bío Bío", "Araucanía", "Los Lagos", "Antofagasta", "Coquimbo", "O'Higgins"],
        "description": "Republic of Chile",
        "top_cities": [
            "Santiago", "Valparaíso", "Concepción", "La Serena", "Antofagasta", "Temuco", "Rancagua", "Talca",
            "Arica", "Chillán", "Iquique", "Los Ángeles", "Puerto Montt", "Coquimbo", "Osorno", "Valdivia",
            "Punta Arenas", "Copiapó", "Quillota", "Curicó", "Ovalle", "Linares", "Calama", "Melipilla",
            "San Antonio", "Limache", "Quilpué", "Villa Alemana", "San Felipe", "Talagante", "Lampa",
            "Colina", "Puente Alto", "Maipú", "Las Condes", "Providencia", "Ñuñoa", "San Miguel",
            "La Florida", "Peñalolén", "Recoleta", "Independencia", "Conchalí", "Huechuraba", "Quilicura",
            "Renca", "Cerro Navia", "Lo Prado", "Quinta Normal", "Estación Central"
        ]
    },
    
    "Colombia": {
        "continent": "South America",
        "region": "Latin America",
        "regions": ["Bogotá", "Antioquia", "Valle del Cauca", "Atlántico", "Santander", "Bolívar", "Cundinamarca", "Norte de Santander", "Córdoba", "Tolima"],
        "description": "Republic of Colombia",
        "top_cities": [
            "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Cúcuta", "Bucaramanga", "Pereira",
            "Santa Marta", "Ibagué", "Pasto", "Manizales", "Neiva", "Soledad", "Armenia", "Villavicencio",
            "Soacha", "Valledupar", "Montería", "Itagüí", "Palmira", "Buenaventura", "Floridablanca", "Sincelejo",
            "Popayán", "Envigado", "Dosquebradas", "Tunja", "Bello", "Girardot", "Maicao", "Sogamoso",
            "Facatativá", "Riohacha", "Cartago", "Zipaquirá", "Barrancabermeja", "Duitama", "Tuluá", "Florencia",
            "Caucasia", "Chía", "Magangué", "Guadalajara de Buga", "Yopal", "Quibdó", "Rionegro", "Ciénaga",
            "Jamundí", "Fusagasugá", "Fundación", "Copacabana", "La Dorada", "Girón"
        ]
    },
    
    "Ecuador": {
        "continent": "South America",
        "region": "Latin America",
        "regions": ["Pichincha", "Guayas", "Azuay", "Tungurahua", "El Oro", "Imbabura", "Loja"],
        "description": "Republic of Ecuador",
        "top_cities": [
            "Guayaquil", "Quito", "Cuenca", "Santo Domingo", "Machala", "Durán", "Manta", "Portoviejo",
            "Ambato", "Riobamba", "Loja", "Esmeraldas", "Ibarra", "Quevedo", "Milagro", "Babahoyo",
            "La Libertad", "Daule", "Sangolquí", "Pasaje", "Cayambe", "Latacunga", "Chone", "El Carmen",
            "Ventanas", "Rosa Zarate", "Salinas", "Azogues", "Guaranda", "Macas", "Nueva Loja", "Puyo",
            "Zamora", "Tena", "Tulcán", "Bahía de Caráquez", "Montecristi", "Jipijapa", "Yantzaza",
            "Gualaceo", "Cañar", "Alausí", "Riobamba", "Pallatanga", "Chunchi", "Guamote", "Colta",
            "Chambo", "Penipe", "Cumandá", "Palora", "Santiago", "Taisha", "Logroño"
        ]
    },
    
    "Paraguay": {
        "continent": "South America",
        "region": "Latin America",
        "regions": ["Asunción", "Central", "Alto Paraná"],
        "description": "Republic of Paraguay",
        "top_cities": [
            "Asunción", "Ciudad del Este", "San Lorenzo", "Luque", "Capiatá", "Lambaré", "Fernando de la Mora",
            "Limpio", "Ñemby", "Villa Elisa", "Mariano Roque Alonso", "Encarnación", "Pedro Juan Caballero",
            "Coronel Oviedo", "Concepción", "Villarrica", "Caaguazú", "Paraguarí", "Itauguá", "Villa Hayes",
            "Caacupé", "Hernandarias", "Presidente Franco", "Minga Guazú", "San Antonio", "Itá", "Areguá",
            "Ypacaraí", "Guarambaré", "J. Augusto Saldívar", "Villa Elisa", "Ypané", "Nueva Italia",
            "Piribebuy", "Tobatí", "Caraguatay", "Coronel Bogado", "Bella Vista", "Hohenau", "Obligado",
            "General Artigas", "Katuete", "Naranjal", "Nueva Alborada", "Repatriación", "Tavaí", "Yuty"
        ]
    },
    
    "Peru": {
        "continent": "South America",
        "region": "Latin America",
        "regions": ["Lima", "Arequipa", "La Libertad", "Lambayeque", "Piura", "Junín"],
        "description": "Republic of Peru",
        "top_cities": [
            "Lima", "Arequipa", "Trujillo", "Chiclayo", "Piura", "Iquitos", "Cusco", "Chimbote", "Huancayo",
            "Tacna", "Juliaca", "Ica", "Sullana", "Ayacucho", "Chincha Alta", "Huánuco", "Tarapoto", "Puno",
            "Tumbes", "Talara", "Jaén", "Huaraz", "Abancay", "Moyobamba", "Cajamarca", "Cerro de Pasco",
            "Huacho", "Chachapoyas", "Moquegua", "Pucallpa", "Tingo María", "Juanjuí", "Bagua Grande",
            "Yurimaguas", "Puerto Maldonado", "Sicuani", "Espinar", "Ilave", "Azángaro", "Desaguadero",
            "Lampa", "Macusani", "Putina", "San Román", "Carabaya", "Chucuito", "El Collao", "Huancané",
            "Melgar", "Moho", "Sandia", "Yunguyo", "San Antonio de Putina"
        ]
    },
    
    "Uruguay": {
        "continent": "South America",
        "region": "Latin America",
        "regions": ["Montevideo", "Canelones", "Maldonado", "Salto", "Paysandú", "Rivera", "Tacuarembó", "Artigas", "Cerro Largo", "Colonia", "San José"],
        "description": "Oriental Republic of Uruguay",
        "top_cities": [
            "Montevideo", "Salto", "Paysandú", "Las Piedras", "Rivera", "Maldonado", "Tacuarembó", "Mercedes",
            "Artigas", "Melo", "San José de Mayo", "Durazno", "Florida", "Barros Blancos", "Ciudad de la Costa",
            "Canelones", "Colonia del Sacramento", "Carmelo", "Dolores", "Young", "Río Branco", "Chuy",
            "Trinidad", "Fray Bentos", "Rocha", "Treinta y Tres", "Juan Lacaze", "Punta del Este",
            "La Paz", "Progreso", "Santa Lucía", "Tala", "Toledo", "Sauce", "Guichón", "Bella Unión",
            "Vergara", "Lascano", "Castillos", "San Carlos", "Piriápolis", "Pan de Azúcar", "Aigua",
            "José Pedro Varela", "José Batlle y Ordóñez", "Ansina", "Baltasar Brum", "Tambores", "Sarandí del Yí"
        ]
    },
    
    "Venezuela": {
        "continent": "South America",
        "region": "Latin America",
        "regions": ["Distrito Capital", "Miranda", "Zulia", "Carabobo", "Lara"],
        "description": "Bolivarian Republic of Venezuela",
        "top_cities": [
            "Caracas", "Maracaibo", "Valencia", "Barquisimeto", "Maracay", "Ciudad Guayana", "San Cristóbal",
            "Maturín", "Ciudad Bolívar", "Cumana", "Mérida", "Barcelona", "Turmero", "Cabimas", "Santa Teresa del Tuy",
            "Barinas", "Punto Fijo", "Los Teques", "Acarigua", "Carúpano", "Coro", "Guacara", "Valera",
            "Catia La Mar", "El Tigre", "Porlamar", "Puerto La Cruz", "Los Guayos", "Machiques", "Ocumare del Tuy",
            "Petare", "San Antonio de Los Altos", "Charallave", "Guarenas", "Guatire", "Cúa", "Santa Lucía",
            "Caucagua", "Araure", "Portuguesa", "Villa de Cura", "San Felipe", "Puerto Cabello", "Morón",
            "Bejuma", "Montalbán", "Miranda", "Naguanagua", "San Diego", "Tocuyito", "Mariara"
        ]
    },
    
    # Caribbean and Central America
    "Costa Rica": {
        "continent": "North America",
        "region": "Latin America",
        "regions": ["San José"],
        "description": "Republic of Costa Rica",
        "top_cities": [
            "San José", "Cartago", "Puntarenas", "Alajuela", "Heredia", "Limón", "Liberia", "Paraíso",
            "Desamparados", "San Isidro", "Curridabat", "San Vicente", "Turrialba", "Atenas", "Grecia",
            "Naranjo", "Palmares", "Poás", "San Carlos", "San Ramón", "Upala", "Zarcero", "Valverde Vega",
            "Sarchí", "Orotina", "San Mateo", "Esparza", "Montes de Oro", "Aguirre", "Parrita", "Garabito",
            "Monteverde", "Santa Elena", "Jacó", "Manuel Antonio", "Dominical", "Uvita", "Ojochal",
            "Palmar Norte", "Palmar Sur", "Sierpe", "Bahía Drake", "Puerto Jiménez", "Golfito", "Pavones"
        ]
    },

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
    elif country == "Portugal":
        return get_portugal_cities_for_region(region)
    elif country in ["Botswana", "Eswatini", "Ghana", "Kenya", "Lesotho", "Madagascar", "Nigeria", "Rwanda", "Senegal", "South Africa", "Algeria", "Egypt", "Ethiopia", "Libya", "Morocco", "Uganda"]:
        return get_african_cities_for_region(country, region)
    elif country in ["Israel", "Jordan", "Palestine", "Qatar", "Tunisia", "Turkey", "United Arab Emirates"]:
        return get_middle_east_cities_for_region(country, region)
    elif country in ["Bangladesh", "Bhutan", "Cambodia", "Christmas Island", "India", "Indonesia", "Laos", "Malaysia", "Myanmar", "Nepal", "Pakistan", "Philippines", "Singapore", "Sri Lanka", "Thailand", "Vietnam"]:
        return get_south_southeast_asian_cities_for_region(country, region)
    elif country in ["China", "Hong Kong", "Japan", "Afghanistan", "Armenia", "Azerbaijan", "Georgia", "Iran", "Iraq", "Saudi Arabia", "Uzbekistan", "Kazakhstan", "Kyrgyzstan", "Mongolia", "South Korea", "Taiwan"]:
        return get_rest_of_asian_cities_for_region(country, region)
    elif country in ["American Samoa", "Australia", "Guam", "New Zealand", "Northern Mariana Islands", "U.S. Minor Outlying Islands"]:
        return get_oceanian_cities_for_region(country, region)
    elif country in ["Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Ecuador", "Paraguay", "Peru", "Uruguay", "Venezuela", "Costa Rica"]:
        return get_latin_american_cities_for_region(country, region)
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

def get_portugal_cities_for_region(region):
    """Get cities for Portuguese regions"""
    portugal_cities = {
        "Norte": ["Porto", "Vila Nova de Gaia", "Braga", "Matosinhos", "Gondomar", "Guimarães", "Viana do Castelo", "Vila do Conde", "Póvoa de Varzim", "Paredes"],
        "Centro": ["Coimbra", "Aveiro", "Viseu", "Leiria", "Figueira da Foz", "Castelo Branco", "Covilhã", "Oliveira do Hospital", "Seia", "Tomar"],
        "Lisboa": ["Lisbon", "Amadora", "Almada", "Agualva-Cacém", "Queluz", "Barreiro", "Corroios", "Odivelas", "Loures", "Montijo"],
        "Alentejo": ["Évora", "Beja", "Portalegre", "Elvas", "Estremoz", "Vendas Novas", "Santiago do Cacém", "Sines", "Moura", "Serpa"],
        "Algarve": ["Faro", "Portimão", "Lagos", "Olhão", "Loulé", "Tavira", "Vila Real de Santo António", "Silves", "Lagoa", "Albufeira"],
        "Azores": ["Ponta Delgada", "Angra do Heroísmo", "Horta", "Praia da Vitória", "Ribeira Grande", "Lagoa", "Nordeste", "Povoação", "Velas", "Santa Cruz da Graciosa"],
        "Madeira": ["Funchal", "Câmara de Lobos", "Machico", "Caniço", "Santa Cruz", "Ribeira Brava", "Ponta do Sol", "Calheta", "São Vicente", "Santana"]
    }
    return portugal_cities.get(region, [])

def get_african_cities_for_region(country, region):
    """Get cities for African regions"""
    # For simplicity, we'll distribute the cities among regions
    # In a production system, you'd have detailed region-to-city mappings
    country_cities = get_cities_for_country(country)
    if not country_cities:
        return []
    
    country_regions = get_regions_for_country(country)
    if not country_regions or region not in country_regions:
        return country_cities[:10]
    
    # Distribute cities among regions
    region_index = country_regions.index(region)
    cities_per_region = max(3, len(country_cities) // len(country_regions))
    start_idx = region_index * cities_per_region
    end_idx = start_idx + cities_per_region
    
    return country_cities[start_idx:end_idx] if start_idx < len(country_cities) else country_cities[-5:]

def get_middle_east_cities_for_region(country, region):
    """Get cities for Middle Eastern regions"""
    # Similar logic for Middle Eastern countries
    country_cities = get_cities_for_country(country)
    if not country_cities:
        return []
    
    country_regions = get_regions_for_country(country)
    if not country_regions or region not in country_regions:
        return country_cities[:10]
    
    # Distribute cities among regions  
    region_index = country_regions.index(region)
    cities_per_region = max(3, len(country_cities) // len(country_regions))
    start_idx = region_index * cities_per_region
    end_idx = start_idx + cities_per_region
    
    return country_cities[start_idx:end_idx] if start_idx < len(country_cities) else country_cities[-5:]

def get_south_southeast_asian_cities_for_region(country, region):
    """Get cities for South & Southeast Asian regions"""
    country_cities = get_cities_for_country(country)
    if not country_cities:
        return []
    
    country_regions = get_regions_for_country(country)
    if not country_regions or region not in country_regions:
        return country_cities[:10]
    
    # Special mappings for specific countries
    if country == "Malaysia" and region in ["Kuala Lumpur", "Selangor"]:
        if region == "Kuala Lumpur":
            return ["Kuala Lumpur", "Petaling Jaya", "Shah Alam", "Subang Jaya", "Cheras", "Puchong", "Kajang", "Ampang", "Klang", "Seri Kembangan"]
        elif region == "Selangor":
            return ["Shah Alam", "Petaling Jaya", "Subang Jaya", "Klang", "Kajang", "Selayang", "Rawang", "Batu Caves", "Ampang Jaya", "Balakong"]
    elif country == "Japan" and region in ["Tokyo", "Osaka", "Kyoto"]:
        if region == "Tokyo":
            return ["Tokyo", "Yokohama", "Kawasaki", "Saitama", "Chiba", "Sagamihara", "Hachioji", "Funabashi", "Kawaguchi", "Ichikawa"]
        elif region == "Osaka":
            return ["Osaka", "Sakai", "Higashiosaka", "Himeji", "Nishinomiya", "Amagasaki", "Suita", "Takatsuki", "Toyonaka", "Ibaraki"]
        elif region == "Kyoto":
            return ["Kyoto", "Uji", "Kameoka", "Joyo", "Mukō", "Nagaokakyō", "Yawata", "Kyōtanabe", "Kizugawa", "Seika"]
    
    # Distribute cities among regions
    region_index = country_regions.index(region)
    cities_per_region = max(3, len(country_cities) // len(country_regions))
    start_idx = region_index * cities_per_region
    end_idx = start_idx + cities_per_region
    
    return country_cities[start_idx:end_idx] if start_idx < len(country_cities) else country_cities[-5:]

def get_rest_of_asian_cities_for_region(country, region):
    """Get cities for Rest of Asian regions"""
    country_cities = get_cities_for_country(country)
    if not country_cities:
        return []
    
    country_regions = get_regions_for_country(country)
    if not country_regions or region not in country_regions:
        return country_cities[:10]
    
    # Distribute cities among regions
    region_index = country_regions.index(region)
    cities_per_region = max(3, len(country_cities) // len(country_regions))
    start_idx = region_index * cities_per_region
    end_idx = start_idx + cities_per_region
    
    return country_cities[start_idx:end_idx] if start_idx < len(country_cities) else country_cities[-5:]

def get_oceanian_cities_for_region(country, region):
    """Get cities for Oceanian regions"""
    country_cities = get_cities_for_country(country)
    if not country_cities:
        return []
    
    country_regions = get_regions_for_country(country)
    if not country_regions or region not in country_regions:
        return country_cities[:10]
    
    # Distribute cities among regions
    region_index = country_regions.index(region)
    cities_per_region = max(3, len(country_cities) // len(country_regions))
    start_idx = region_index * cities_per_region
    end_idx = start_idx + cities_per_region
    
    return country_cities[start_idx:end_idx] if start_idx < len(country_cities) else country_cities[-5:]

def get_latin_american_cities_for_region(country, region):
    """Get cities for Latin American regions"""
    country_cities = get_cities_for_country(country)
    if not country_cities:
        return []
    
    country_regions = get_regions_for_country(country)
    if not country_regions or region not in country_regions:
        return country_cities[:10]
    
    # Special mappings for specific countries
    if country == "Brazil":
        return get_brazil_cities_for_state(region)
    elif country == "Argentina" and region in ["Buenos Aires", "Córdoba", "Santa Fe"]:
        if region == "Buenos Aires":
            return ["Buenos Aires", "La Plata", "Mar del Plata", "Avellaneda", "Tandil", "Bahía Blanca", "Pergamino", "Zárate", "Luján", "Necochea"]
        elif region == "Córdoba":
            return ["Córdoba", "Río Cuarto", "Villa María", "Bell Ville", "Río Tercero", "Cruz del Eje", "Jesús María", "San Francisco", "Villa Carlos Paz", "Alta Gracia"]
        elif region == "Santa Fe":
            return ["Rosario", "Santa Fe", "Venado Tuerto", "Reconquista", "Rafaela", "Esperanza", "Santo Tomé", "Casilda", "Firmat", "Cañada de Gómez"]
    elif country == "Colombia" and region in ["Bogotá", "Antioquia", "Valle del Cauca"]:
        if region == "Bogotá":
            return ["Bogotá", "Soacha", "Facatativá", "Chía", "Zipaquirá", "Fusagasugá", "Girardot", "Mosquera", "Madrid", "Funza"]
        elif region == "Antioquia":
            return ["Medellín", "Itagüí", "Envigado", "Bello", "Copacabana", "Rionegro", "Apartadó", "Turbo", "Caucasia", "Necoclí"]
        elif region == "Valle del Cauca":
            return ["Cali", "Palmira", "Buenaventura", "Jamundí", "Cartago", "Tuluá", "Guadalajara de Buga", "Yumbo", "Candelaria", "Florida"]
    
    # Distribute cities among regions
    region_index = country_regions.index(region)
    cities_per_region = max(3, len(country_cities) // len(country_regions))
    start_idx = region_index * cities_per_region
    end_idx = start_idx + cities_per_region
    
    return country_cities[start_idx:end_idx] if start_idx < len(country_cities) else country_cities[-5:]

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
