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
};
