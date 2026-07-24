interface CulturalIcon {
  title: string;
  label: string;
  imageUrl?: string;
  imagePageUrl?: string;
}

export const culturalIcons: Record<string, CulturalIcon> = {
  lisbon: { title: 'Belém Tower', label: 'Belém Tower' },
  bangkok: { title: 'Wat Arun', label: 'Wat Arun' },
  'mexico-city': {
    title: 'Palacio de Bellas Artes',
    label: 'Palacio de Bellas Artes',
  },
  budapest: {
    title: 'Hungarian Parliament Building',
    label: 'Hungarian Parliament Building',
  },
  hanoi: { title: 'Temple of Literature, Hanoi', label: 'Temple of Literature' },
  marrakech: { title: 'Kutubiyya Mosque', label: 'Koutoubia Mosque' },
  paris: {
    title: 'Eiffel Tower',
    label: 'Eiffel Tower',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Eiffel_Tower_in_2022_02.jpg/960px-Eiffel_Tower_in_2022_02.jpg',
    imagePageUrl:
      'https://commons.wikimedia.org/wiki/File:Eiffel_Tower_in_2022_02.jpg',
  },
  london: { title: 'Big Ben', label: 'Big Ben' },
  rome: { title: 'Colosseum', label: 'Colosseum' },
  barcelona: { title: 'Sagrada Família', label: 'Sagrada Família' },
  amsterdam: { title: 'Rijksmuseum', label: 'Rijksmuseum' },
  istanbul: { title: 'Hagia Sophia', label: 'Hagia Sophia' },
  dubai: { title: 'Burj Khalifa', label: 'Burj Khalifa' },
  tokyo: { title: 'Sensō-ji', label: 'Sensō-ji' },
  seoul: { title: 'Gyeongbokgung', label: 'Gyeongbokgung Palace' },
  singapore: { title: 'Merlion', label: 'Merlion' },
  bali: { title: 'Tanah Lot', label: 'Tanah Lot' },
  'new-york': { title: 'Statue of Liberty', label: 'Statue of Liberty' },
  'los-angeles': { title: 'Hollywood Sign', label: 'Hollywood Sign' },
  orlando: {
    title: 'Cinderella Castle',
    label: 'Cinderella Castle',
  },
  cancun: { title: 'Chichen Itza', label: 'Chichén Itzá' },
  'rio-de-janeiro': {
    title: 'Christ the Redeemer (statue)',
    label: 'Christ the Redeemer',
  },
  'buenos-aires': {
    title: 'Obelisco de Buenos Aires',
    label: 'Obelisk of Buenos Aires',
  },
  'cape-town': { title: 'Table Mountain', label: 'Table Mountain' },
  cairo: { title: 'Great Sphinx of Giza', label: 'Great Sphinx of Giza' },
  sydney: { title: 'Sydney Opera House', label: 'Sydney Opera House' },

  prague: { title: 'Prague Castle', label: 'Prague Castle' },
  vienna: { title: 'Schönbrunn Palace', label: 'Schönbrunn Palace' },
  berlin: { title: 'Brandenburg Gate', label: 'Brandenburg Gate' },
  athens: { title: 'Acropolis of Athens', label: 'Acropolis' },
  madrid: { title: 'Museo del Prado', label: 'Prado Museum' },
  dublin: { title: 'Trinity College Dublin', label: 'Trinity College' },
  edinburgh: { title: 'Edinburgh Castle', label: 'Edinburgh Castle' },
  copenhagen: { title: 'Nyhavn', label: 'Nyhavn' },
  vancouver: { title: 'Stanley Park', label: 'Stanley Park' },
  toronto: { title: 'CN Tower', label: 'CN Tower' },
  'san-francisco': { title: 'Golden Gate Bridge', label: 'Golden Gate Bridge' },
  miami: { title: 'Ocean Drive (South Beach)', label: 'South Beach' },
  honolulu: { title: 'Waikiki Beach', label: 'Waikiki Beach' },
  melbourne: { title: 'Federation Square', label: 'Federation Square' },
  auckland: { title: 'Sky Tower', label: 'Sky Tower' },
  kyoto: { title: 'Fushimi Inari-taisha', label: 'Fushimi Inari' },
  osaka: { title: 'Osaka Castle', label: 'Osaka Castle' },
  taipei: { title: 'Taipei 101', label: 'Taipei 101' },
  'hong-kong': { title: 'Victoria Peak', label: 'Victoria Peak' },
  'chiang-mai': { title: 'Wat Phra That Doi Suthep', label: 'Doi Suthep' },
  phuket: { title: 'Phuket Big Buddha', label: 'Big Buddha' },
  'ho-chi-minh-city': { title: 'Notre-Dame Cathedral Basilica of Saigon', label: 'Notre-Dame Cathedral' },
  lima: { title: 'Historic Centre of Lima', label: 'Lima Historic Center' },
  delhi: { title: 'Red Fort', label: 'Red Fort' },
};
