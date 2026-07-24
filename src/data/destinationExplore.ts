export interface Attraction {
  name: string;
  blurb: string;
}

export interface DestinationExploreInfo {
  highlights: string;
  bestFor: string;
  topAttractions: Attraction[];
}

export const destinationExplore: Record<string, DestinationExploreInfo> = {
  lisbon: {
    highlights:
      'Sunny viewpoints, tiled streets, seafood, and easy coastal day trips.',
    bestFor: 'Walkable city breaks and first-time Europe trips',
    topAttractions: [
      { name: 'Belém Tower', blurb: 'Iconic riverside fortress and Age of Discovery landmark.' },
      { name: 'Alfama District', blurb: 'Winding alleys, viewpoints, and classic Fado nights.' },
      { name: 'Tram 28', blurb: 'Historic tram ride through the city’s steep neighborhoods.' },
      { name: 'LX Factory', blurb: 'Creative warehouses with shops, cafés, and street art.' },
      { name: 'Time Out Market', blurb: 'One-stop tasting hall for Portuguese food favorites.' },
    ],
  },
  bangkok: {
    highlights:
      'Temples, street food, river ferries, and late-night markets.',
    bestFor: 'Food-focused city travel on a flexible budget',
    topAttractions: [
      { name: 'Grand Palace', blurb: 'Ornate royal complex and a must-see historic site.' },
      { name: 'Wat Arun', blurb: 'Riverside temple with striking porcelain-covered spires.' },
      { name: 'Chatuchak Weekend Market', blurb: 'Enormous market for crafts, clothes, and snacks.' },
      { name: 'Chao Phraya River', blurb: 'Ferry hops between old-town temples and neighborhoods.' },
      { name: 'Yaowarat Road', blurb: 'Chinatown street-food strip that comes alive after dark.' },
    ],
  },
  'mexico-city': {
    highlights:
      'World-class museums, neighborhoods, markets, and nearby ruins.',
    bestFor: 'Culture, food, and urban exploration',
    topAttractions: [
      { name: 'Zócalo & Historic Center', blurb: 'Cathedral, Aztec ruins, and grand plazas.' },
      { name: 'Frida Kahlo Museum', blurb: 'Casa Azul in leafy Coyoacán.' },
      { name: 'Chapultepec Park', blurb: 'Castle views, museums, and a huge green escape.' },
      { name: 'Teotihuacan', blurb: 'Day trip to towering pyramids outside the city.' },
      { name: 'Roma & Condesa', blurb: 'Tree-lined streets packed with cafés and galleries.' },
    ],
  },
  budapest: {
    highlights:
      'Thermal baths, ruin bars, river views, and grand architecture.',
    bestFor: 'Affordable European city breaks',
    topAttractions: [
      { name: 'Széchenyi Thermal Bath', blurb: 'Iconic outdoor baths in City Park.' },
      { name: 'Buda Castle', blurb: 'Hilltop palace district with panoramic Danube views.' },
      { name: 'Parliament Building', blurb: 'Neo-Gothic landmark best seen from the river.' },
      { name: 'Ruin Bars of District VII', blurb: 'Courtyard bars set in restored old buildings.' },
      { name: 'Central Market Hall', blurb: 'Paprika, pastries, and classic Hungarian snacks.' },
    ],
  },
  hanoi: {
    highlights:
      'Old Quarter energy, lakeside walks, coffee, and noodle culture.',
    bestFor: 'Food and culture on a tight budget',
    topAttractions: [
      { name: 'Hoan Kiem Lake', blurb: 'Central lake with a scenic evening stroll.' },
      { name: 'Old Quarter', blurb: 'Dense streets of shops, cafés, and street food.' },
      { name: 'Temple of Literature', blurb: 'Vietnam’s historic temple of learning.' },
      { name: 'Train Street', blurb: 'Narrow trackside cafés for a unique city moment.' },
      { name: 'West Lake', blurb: 'Quieter waterfront area for temples and cafés.' },
    ],
  },
  marrakech: {
    highlights:
      'Souks, palaces, courtyards, and Atlas Mountain day trips.',
    bestFor: 'Sensory city travel and short desert escapes',
    topAttractions: [
      { name: 'Jemaa el-Fnaa', blurb: 'Main square with food stalls, music, and night energy.' },
      { name: 'Bahia Palace', blurb: 'Intricate palace rooms and shaded courtyards.' },
      { name: 'Majorelle Garden', blurb: 'Cobalt-blue villa garden and calm oasis.' },
      { name: 'Medina Souks', blurb: 'Labyrinth markets for spices, leather, and crafts.' },
      { name: 'Atlas Mountains', blurb: 'Day-trip villages and valley views outside the city.' },
    ],
  },
  paris: {
    highlights:
      'Museums, cafés, river walks, and landmark neighborhoods.',
    bestFor: 'Classic first-time Europe itineraries',
    topAttractions: [
      { name: 'Eiffel Tower', blurb: 'City icon best enjoyed at golden hour or after dark.' },
      { name: 'Louvre Museum', blurb: 'Vast art collection from antiquity to the 19th century.' },
      { name: 'Notre-Dame & Île de la Cité', blurb: 'Historic heart of Paris along the Seine.' },
      { name: 'Montmartre', blurb: 'Hilltop village vibes, Sacré-Cœur, and café streets.' },
      { name: 'Musée d’Orsay', blurb: 'Impressionist masterpieces in a grand former station.' },
    ],
  },
  london: {
    highlights:
      'Museums, parks, theater, markets, and distinct neighborhoods.',
    bestFor: 'Culture-packed city trips with easy transit',
    topAttractions: [
      { name: 'British Museum', blurb: 'Free world history collection in Bloomsbury.' },
      { name: 'Tower of London', blurb: 'Fortress, Crown Jewels, and Thames-side views.' },
      { name: 'West End', blurb: 'Theater district for musicals and big stage shows.' },
      { name: 'Borough Market', blurb: 'Food hall favorite near London Bridge.' },
      { name: 'Hyde Park & Kensington', blurb: 'Green space plus museums and palace grounds.' },
    ],
  },
  rome: {
    highlights:
      'Ancient ruins, piazzas, gelato, and dense historic streets.',
    bestFor: 'History-first city breaks',
    topAttractions: [
      { name: 'Colosseum', blurb: 'Ancient amphitheater and Rome’s signature landmark.' },
      { name: 'Roman Forum', blurb: 'Ruins of the political heart of ancient Rome.' },
      { name: 'Vatican Museums & St. Peter’s', blurb: 'Art-filled galleries and the famous basilica.' },
      { name: 'Trevi Fountain', blurb: 'Baroque fountain and classic coin-toss stop.' },
      { name: 'Trastevere', blurb: 'Evening neighborhood for trattorias and cobbled lanes.' },
    ],
  },
  barcelona: {
    highlights:
      'Gaudí architecture, beaches, markets, and Catalan food.',
    bestFor: 'City + beach combinations',
    topAttractions: [
      { name: 'Sagrada Família', blurb: 'Gaudí’s unfinished basilica and skyline icon.' },
      { name: 'Park Güell', blurb: 'Colorful hillside park with city views.' },
      { name: 'Gothic Quarter', blurb: 'Medieval streets, plazas, and tapas bars.' },
      { name: 'La Boqueria', blurb: 'Famous market just off La Rambla.' },
      { name: 'Barceloneta Beach', blurb: 'Urban beach for a quick Mediterranean break.' },
    ],
  },
  amsterdam: {
    highlights:
      'Canals, bikes, museums, and compact neighborhood wandering.',
    bestFor: 'Short, walkable city trips',
    topAttractions: [
      { name: 'Rijksmuseum', blurb: 'Dutch Masters and national treasures.' },
      { name: 'Van Gogh Museum', blurb: 'Major collection dedicated to Van Gogh.' },
      { name: 'Canal Belt', blurb: 'UNESCO canals best seen by bike or boat.' },
      { name: 'Anne Frank House', blurb: 'Powerful historic museum—book ahead.' },
      { name: 'Jordaan', blurb: 'Charming streets with cafés, courtyards, and shops.' },
    ],
  },
  istanbul: {
    highlights:
      'Mosques, bazaars, Bosphorus views, and layered history.',
    bestFor: 'East-meets-West city discovery',
    topAttractions: [
      { name: 'Hagia Sophia', blurb: 'Monumental landmark spanning Byzantine and Ottoman eras.' },
      { name: 'Blue Mosque', blurb: 'Cascade of domes and cascading courtyards.' },
      { name: 'Grand Bazaar', blurb: 'Vast covered market for crafts and spices.' },
      { name: 'Bosphorus Cruise', blurb: 'Waterfront views between Europe and Asia.' },
      { name: 'Topkapi Palace', blurb: 'Ottoman palace complex above the old city.' },
    ],
  },
  dubai: {
    highlights:
      'Skyline views, beaches, desert trips, and modern landmarks.',
    bestFor: 'Short luxury-leaning city breaks',
    topAttractions: [
      { name: 'Burj Khalifa', blurb: 'Observation decks over the modern skyline.' },
      { name: 'Dubai Marina', blurb: 'Waterfront walks, boats, and evening lights.' },
      { name: 'Old Dubai & Creek', blurb: 'Souks, abras, and heritage neighborhoods.' },
      { name: 'Desert Safari', blurb: 'Dunes, sunset views, and desert camps.' },
      { name: 'Museum of the Future', blurb: 'Striking architecture and immersive exhibits.' },
    ],
  },
  tokyo: {
    highlights:
      'Neighborhoods, food, transit ease, and shrine-to-skyscraper contrast.',
    bestFor: 'First-time Japan city travel',
    topAttractions: [
      { name: 'Senso-ji', blurb: 'Tokyo’s oldest temple in atmospheric Asakusa.' },
      { name: 'Shibuya Crossing', blurb: 'Iconic scramble and neon neighborhood energy.' },
      { name: 'Meiji Shrine', blurb: 'Forest-wrapped shrine near Harajuku.' },
      { name: 'teamLab Planets/Borderless', blurb: 'Immersive digital art experiences.' },
      { name: 'Tsukiji Outer Market', blurb: 'Seafood snacks and morning market browsing.' },
    ],
  },
  seoul: {
    highlights:
      'Palaces, nightlife, hiking, markets, and modern neighborhoods.',
    bestFor: 'Food, culture, and city energy',
    topAttractions: [
      { name: 'Gyeongbokgung Palace', blurb: 'Grand Joseon palace with changing of the guard.' },
      { name: 'Bukchon Hanok Village', blurb: 'Traditional houses and hillside views.' },
      { name: 'Hongdae', blurb: 'Youthful streets for cafés, shops, and nightlife.' },
      { name: 'N Seoul Tower', blurb: 'City panorama above Namsan Park.' },
      { name: 'Gwangjang Market', blurb: 'Classic spot for bindaetteok, mayak gimbap, and more.' },
    ],
  },
  singapore: {
    highlights:
      'Hawker food, gardens, waterfronts, and efficient transit.',
    bestFor: 'Easy short-stop city trips',
    topAttractions: [
      { name: 'Gardens by the Bay', blurb: 'Supertrees, conservatories, and night light shows.' },
      { name: 'Marina Bay Sands', blurb: 'SkyPark views over the bay.' },
      { name: 'Chinatown & Maxwell Hawker', blurb: 'Heritage streets plus essential local eats.' },
      { name: 'Sentosa', blurb: 'Beaches, rides, and a breezy island break.' },
      { name: 'Kampong Glam', blurb: 'Colorful Haji Lane shops and the Sultan Mosque.' },
    ],
  },
  bali: {
    highlights:
      'Temples, rice terraces, beaches, and wellness escapes.',
    bestFor: 'Beach + culture island trips',
    topAttractions: [
      { name: 'Ubud Monkey Forest', blurb: 'Temple paths through a dense sanctuary.' },
      { name: 'Tegallalang Rice Terraces', blurb: 'Classic emerald terraces near Ubud.' },
      { name: 'Tanah Lot', blurb: 'Sea temple perched on a rocky outcrop.' },
      { name: 'Uluwatu Temple', blurb: 'Cliffside temple with sunset and kecak dance.' },
      { name: 'Seminyak / Canggu beaches', blurb: 'Beach clubs, surf, and café culture.' },
    ],
  },
  'new-york': {
    highlights:
      'Museums, skyline views, neighborhoods, and late-night food.',
    bestFor: 'Dense, walkable big-city itineraries',
    topAttractions: [
      { name: 'Central Park', blurb: 'Green core for walks, boats, and people-watching.' },
      { name: 'The Metropolitan Museum of Art', blurb: 'Encyclopedic museum on Museum Mile.' },
      { name: 'Statue of Liberty & Ellis Island', blurb: 'Harbor icons and immigration history.' },
      { name: 'Broadway', blurb: 'World-famous theater district shows.' },
      { name: 'High Line & Chelsea', blurb: 'Elevated park walk into galleries and markets.' },
    ],
  },
  'los-angeles': {
    highlights:
      'Beaches, viewpoints, studios, and spread-out neighborhoods.',
    bestFor: 'Sun, food, and scenic day trips',
    topAttractions: [
      { name: 'Griffith Observatory', blurb: 'City and Hollywood Sign views above Los Feliz.' },
      { name: 'Santa Monica Pier', blurb: 'Classic beachfront boardwalk and Pacific sunset.' },
      { name: 'Getty Center', blurb: 'Art, gardens, and architecture in the hills.' },
      { name: 'Venice Beach', blurb: 'Boardwalk energy, murals, and oceanfront bikes.' },
      { name: 'Griffith / Hollywood hikes', blurb: 'Trail viewpoints over the basin.' },
    ],
  },
  orlando: {
    highlights:
      'Theme parks, resorts, and family entertainment corridors.',
    bestFor: 'Theme-park focused trips',
    topAttractions: [
      { name: 'Walt Disney World', blurb: 'Multi-park resort complex and classic attractions.' },
      { name: 'Universal Orlando', blurb: 'Movie-world parks and immersive lands.' },
      { name: 'ICON Park', blurb: 'International Drive entertainment and The Wheel.' },
      { name: 'Kennedy Space Center', blurb: 'Day trip for space history and launches.' },
      { name: 'Winter Park', blurb: 'Quieter town for museums, boats, and dining.' },
    ],
  },
  cancun: {
    highlights:
      'Caribbean beaches, reef snorkels, and Maya day trips.',
    bestFor: 'Beach resort escapes',
    topAttractions: [
      { name: 'Hotel Zone Beaches', blurb: 'Turquoise water and long sand stretches.' },
      { name: 'Isla Mujeres', blurb: 'Ferry day trip for snorkeling and beach clubs.' },
      { name: 'Chichen Itza', blurb: 'Major Maya ruins reachable as a long day trip.' },
      { name: 'Cenotes', blurb: 'Freshwater sinkholes for swimming and cooling off.' },
      { name: 'Puerto Morelos / reef snorkel', blurb: 'Easier reef access than the busiest beaches.' },
    ],
  },
  'rio-de-janeiro': {
    highlights:
      'Beaches, viewpoints, samba, and dramatic coastal scenery.',
    bestFor: 'Scenic city-and-beach trips',
    topAttractions: [
      { name: 'Christ the Redeemer', blurb: 'Hilltop statue with sweeping city views.' },
      { name: 'Sugarloaf Mountain', blurb: 'Cable-car ride to a dramatic granite peak.' },
      { name: 'Copacabana Beach', blurb: 'Famous crescent beach and promenade.' },
      { name: 'Ipanema', blurb: 'Stylish beach neighborhood and sunset hangouts.' },
      { name: 'Santa Teresa', blurb: 'Hilltop streets with art, bars, and views.' },
    ],
  },
  'buenos-aires': {
    highlights:
      'Tango, cafés, steak culture, and elegant neighborhoods.',
    bestFor: 'Food and nightlife city breaks',
    topAttractions: [
      { name: 'La Boca & Caminito', blurb: 'Colorful streets and tango photo stops.' },
      { name: 'Recoleta Cemetery', blurb: 'Ornate mausoleums in a grand district.' },
      { name: 'San Telmo Market', blurb: 'Sunday antiques, street music, and browsing.' },
      { name: 'Teatro Colón', blurb: 'One of the world’s great opera houses.' },
      { name: 'Palermo', blurb: 'Parks, boutiques, and some of the best dining.' },
    ],
  },
  'cape-town': {
    highlights:
      'Mountains, beaches, vineyards, and coastal drives.',
    bestFor: 'Outdoor scenery with strong food culture',
    topAttractions: [
      { name: 'Table Mountain', blurb: 'Cable car or hike to the city’s signature plateau.' },
      { name: 'V&A Waterfront', blurb: 'Harborfront dining, shops, and ferry access.' },
      { name: 'Cape Peninsula', blurb: 'Scenic drive to beaches, cliffs, and wildlife.' },
      { name: 'Bo-Kaap', blurb: 'Bright houses and Cape Malay food heritage.' },
      { name: 'Stellenbosch Winelands', blurb: 'Day-trip vineyards outside the city.' },
    ],
  },
  cairo: {
    highlights:
      'Pyramids, museums, Nile views, and Islamic Cairo.',
    bestFor: 'History-focused first visits to Egypt',
    topAttractions: [
      { name: 'Pyramids of Giza', blurb: 'The essential plateau of pyramids and the Sphinx.' },
      { name: 'Egyptian Museum / GEM', blurb: 'Pharaonic treasures and iconic artifacts.' },
      { name: 'Khan el-Khalili', blurb: 'Historic bazaar for tea, crafts, and atmosphere.' },
      { name: 'Islamic Cairo', blurb: 'Mosques, gates, and dense medieval streets.' },
      { name: 'Nile Felucca Ride', blurb: 'Sunset sail through the center of the city.' },
    ],
  },
  sydney: {
    highlights:
      'Harbor icons, beaches, coastal walks, and outdoor dining.',
    bestFor: 'Harbor-city trips with easy day trips',
    topAttractions: [
      { name: 'Sydney Opera House', blurb: 'Harbor landmark for tours or a performance.' },
      { name: 'Bondi to Coogee Walk', blurb: 'Cliffside coastal walk between beaches.' },
      { name: 'Sydney Harbour Bridge', blurb: 'Climb or walk for classic skyline views.' },
      { name: 'The Rocks', blurb: 'Historic waterfront lanes and weekend markets.' },
      { name: 'Manly Ferry', blurb: 'Scenic harbor crossing to a beach suburb.' },
    ],
  },
};
