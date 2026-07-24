export interface BeveragePick {
  name: string;
  blurb: string;
  /** Typical serving price in USD for planning. */
  averagePriceUsd: number;
}

export interface LocalDrinkPick extends BeveragePick {}

export interface BeerPick extends BeveragePick {}

export interface DestinationBeveragePair {
  localDrink: LocalDrinkPick;
  beer: BeerPick;
}

/** One locally recognizable non-beer drink and one beer pick per destination. */
export const destinationBeverages: Record<string, DestinationBeveragePair> = {
  lisbon: {
    localDrink: { name: 'Galão', blurb: 'Portuguese espresso served with plenty of steamed milk.', averagePriceUsd: 2.5 },
    beer: { name: 'Sagres', blurb: 'Crisp Portuguese pale lager named for the Algarve town.', averagePriceUsd: 3.5 },
  },
  bangkok: {
    localDrink: { name: 'Cha yen', blurb: 'Strong Thai tea sweetened with condensed milk and served over ice.', averagePriceUsd: 1.5 },
    beer: { name: 'Singha', blurb: 'Long-established Thai pale lager found throughout Bangkok.', averagePriceUsd: 3 },
  },
  'mexico-city': {
    localDrink: { name: 'Agua de jamaica', blurb: 'Tart hibiscus agua fresca served cold in markets and fondas.', averagePriceUsd: 1.5 },
    beer: { name: 'Modelo Especial', blurb: 'Mexican pilsner-style lager commonly served with lime.', averagePriceUsd: 3 },
  },
  budapest: {
    localDrink: { name: 'Fröccs', blurb: 'Hungarian wine spritzer mixed in several traditional proportions.', averagePriceUsd: 3 },
    beer: { name: 'Dreher Gold', blurb: 'Budapest-brewed golden lager from the historic Kőbánya brewery.', averagePriceUsd: 3 },
  },
  hanoi: {
    localDrink: { name: 'Cà phê trứng', blurb: 'Hanoi egg coffee topped with whipped egg yolk and condensed milk.', averagePriceUsd: 2 },
    beer: { name: 'Bia Hà Nội', blurb: 'Light lager closely associated with Hanoi and northern Vietnam.', averagePriceUsd: 1.5 },
  },
  marrakech: {
    localDrink: { name: 'Moroccan mint tea', blurb: 'Green tea steeped with fresh mint and traditionally served sweet.', averagePriceUsd: 2 },
    beer: { name: 'Casablanca', blurb: 'Moroccan lager available mainly at licensed hotels, bars, and restaurants; alcohol is restricted and not a general cultural staple.', averagePriceUsd: 7 },
  },
  paris: {
    localDrink: { name: 'Café crème', blurb: 'French café coffee softened with steamed milk or cream.', averagePriceUsd: 5 },
    beer: { name: 'Kronenbourg 1664', blurb: 'French pale lager commonly poured in Paris cafés and bars.', averagePriceUsd: 7 },
  },
  london: {
    localDrink: { name: 'English breakfast tea', blurb: 'Robust black-tea blend usually served with milk.', averagePriceUsd: 4 },
    beer: { name: 'Fuller’s London Pride', blurb: 'London-brewed amber ale with a long association with the capital.', averagePriceUsd: 7 },
  },
  rome: {
    localDrink: { name: 'Espresso', blurb: 'Short, concentrated coffee commonly taken standing at a Roman bar.', averagePriceUsd: 1.5 },
    beer: { name: 'Peroni Nastro Azzurro', blurb: 'Italian pale lager widely available in Roman restaurants and bars.', averagePriceUsd: 5 },
  },
  barcelona: {
    localDrink: { name: 'Vermut de Reus', blurb: 'Catalan aromatized wine traditionally enjoyed as a pre-lunch aperitif.', averagePriceUsd: 4 },
    beer: { name: 'Estrella Damm', blurb: 'Barcelona lager brewed locally since the nineteenth century.', averagePriceUsd: 4 },
  },
  amsterdam: {
    localDrink: { name: 'Jenever', blurb: 'Dutch juniper spirit traditionally served in a small tulip-shaped glass.', averagePriceUsd: 5 },
    beer: { name: 'Heineken', blurb: 'Pale lager founded and first brewed in Amsterdam.', averagePriceUsd: 5 },
  },
  istanbul: {
    localDrink: { name: 'Çay', blurb: 'Strong black tea served in a small tulip-shaped glass.', averagePriceUsd: 1.5 },
    beer: { name: 'Bomonti', blurb: 'Turkish lager with historic Istanbul roots; alcohol is legal but regulated and absent from many conservative venues.', averagePriceUsd: 5 },
  },
  dubai: {
    localDrink: { name: 'Karak chai', blurb: 'Sweet, spiced milk tea popular at cafeterias across the UAE.', averagePriceUsd: 1.5 },
    beer: { name: 'Heineken 0.0', blurb: 'Genuinely alcohol-free lager sold in Dubai; alcoholic beer is restricted to licensed venues and is not a local cultural staple.', averagePriceUsd: 3 },
  },
  tokyo: {
    localDrink: { name: 'Matcha', blurb: 'Powdered Japanese green tea whisked with hot water.', averagePriceUsd: 5 },
    beer: { name: 'Asahi Super Dry', blurb: 'Japanese dry lager widely poured in Tokyo izakaya.', averagePriceUsd: 5 },
  },
  seoul: {
    localDrink: { name: 'Sikhye', blurb: 'Sweet Korean rice drink made with malted barley.', averagePriceUsd: 2.5 },
    beer: { name: 'Cass Fresh', blurb: 'Light South Korean lager commonly paired with fried chicken.', averagePriceUsd: 4 },
  },
  singapore: {
    localDrink: { name: 'Kopi', blurb: 'Robust coffee brewed through a cloth filter and usually sweetened.', averagePriceUsd: 1.5 },
    beer: { name: 'Tiger Beer', blurb: 'Singapore-founded pale lager brewed since 1932.', averagePriceUsd: 7 },
  },
  bali: {
    localDrink: { name: 'Jamu kunyit asam', blurb: 'Indonesian turmeric-and-tamarind herbal drink served chilled.', averagePriceUsd: 2 },
    beer: { name: 'Bintang Pilsener', blurb: 'Indonesian lager widely sold in tourist-oriented Bali; alcohol availability is more restricted elsewhere in Muslim-majority Indonesia.', averagePriceUsd: 3 },
  },
  'new-york': {
    localDrink: { name: 'New York egg cream', blurb: 'Soda-fountain drink of milk, seltzer, and chocolate syrup, despite containing no egg.', averagePriceUsd: 4 },
    beer: { name: 'Brooklyn Lager', blurb: 'Amber lager produced by Brooklyn Brewery and closely identified with the borough.', averagePriceUsd: 7 },
  },
  'los-angeles': {
    localDrink: { name: 'Horchata', blurb: 'Cinnamon rice drink central to Los Angeles’s Mexican food culture.', averagePriceUsd: 3 },
    beer: { name: 'Golden Road 329 Lager', blurb: 'Easy-drinking lager from a brewery founded in Los Angeles.', averagePriceUsd: 7 },
  },
  orlando: {
    localDrink: { name: 'Florida orange juice', blurb: 'Fresh citrus juice made from the fruit most associated with Florida.', averagePriceUsd: 4 },
    beer: { name: 'Cigar City Jai Alai IPA', blurb: 'Tampa-brewed IPA that is a recognizable craft pick across central Florida.', averagePriceUsd: 7 },
  },
  cancun: {
    localDrink: { name: 'Agua de chaya', blurb: 'Yucatán drink blending leafy chaya with water and citrus.', averagePriceUsd: 2.5 },
    beer: { name: 'Montejo', blurb: 'Yucatán-founded Mexican lager commonly found around Cancún.', averagePriceUsd: 4 },
  },
  'rio-de-janeiro': {
    localDrink: { name: 'Mate gelado', blurb: 'Sweet iced mate traditionally sold by beach vendors in Rio.', averagePriceUsd: 2 },
    beer: { name: 'Brahma Chopp', blurb: 'Brazilian lager commonly served very cold in Rio bars.', averagePriceUsd: 3 },
  },
  'buenos-aires': {
    localDrink: { name: 'Mate', blurb: 'Yerba mate infusion shared from a gourd through a metal straw.', averagePriceUsd: 3 },
    beer: { name: 'Quilmes Clásica', blurb: 'Argentine lager from Quilmes in greater Buenos Aires.', averagePriceUsd: 3 },
  },
  'cape-town': {
    localDrink: { name: 'Rooibos tea', blurb: 'Naturally caffeine-free red-bush infusion native to South Africa’s Western Cape.', averagePriceUsd: 2.5 },
    beer: { name: 'Castle Lager', blurb: 'Long-running South African pale lager widely available in Cape Town.', averagePriceUsd: 4 },
  },
  cairo: {
    localDrink: { name: 'Karkade', blurb: 'Deep-red hibiscus infusion served hot or cold in Egypt.', averagePriceUsd: 1.5 },
    beer: { name: 'Stella', blurb: 'Historic Egyptian lager sold through licensed shops, hotels, and restaurants; availability is restricted and it is not a general cultural staple.', averagePriceUsd: 3 },
  },
  sydney: {
    localDrink: { name: 'Flat white', blurb: 'Australian espresso drink with steamed milk and a thin layer of microfoam.', averagePriceUsd: 4 },
    beer: { name: 'Tooheys New', blurb: 'New South Wales lager long associated with Sydney pubs.', averagePriceUsd: 7 },
  },
  prague: {
    localDrink: { name: 'Kofola', blurb: 'Czech herbal cola created in former Czechoslovakia.', averagePriceUsd: 2.5 },
    beer: { name: 'Pilsner Urquell', blurb: 'Original Czech pilsner from nearby Plzeň, ubiquitous in Prague pubs.', averagePriceUsd: 3 },
  },
  vienna: {
    localDrink: { name: 'Wiener Melange', blurb: 'Viennese coffee topped with steamed milk and foam.', averagePriceUsd: 5 },
    beer: { name: 'Ottakringer Helles', blurb: 'Pale lager brewed in Vienna’s Ottakring district.', averagePriceUsd: 5 },
  },
  berlin: {
    localDrink: { name: 'Apfelschorle', blurb: 'Sparkling water mixed with apple juice, a common German refresher.', averagePriceUsd: 3 },
    beer: { name: 'Berliner Kindl Jubiläums Pilsener', blurb: 'Crisp pilsner from a historic Berlin beer brand.', averagePriceUsd: 4 },
  },
  athens: {
    localDrink: { name: 'Greek coffee', blurb: 'Finely ground coffee simmered unfiltered in a small briki pot.', averagePriceUsd: 3 },
    beer: { name: 'FIX Hellas', blurb: 'Historic Greek lager whose brewery originated in Athens.', averagePriceUsd: 4 },
  },
  madrid: {
    localDrink: { name: 'Vermut de grifo', blurb: 'Red vermouth served on tap as a classic Madrid aperitif.', averagePriceUsd: 4 },
    beer: { name: 'Mahou Cinco Estrellas', blurb: 'Madrid-founded lager closely associated with the city’s bars.', averagePriceUsd: 4 },
  },
  dublin: {
    localDrink: { name: 'Irish breakfast tea', blurb: 'Strong black-tea blend conventionally served with milk.', averagePriceUsd: 4 },
    beer: { name: 'Guinness Draught', blurb: 'Dry stout brewed at Dublin’s St James’s Gate.', averagePriceUsd: 7 },
  },
  edinburgh: {
    localDrink: { name: 'Irn-Bru', blurb: 'Bright-orange Scottish carbonated soft drink.', averagePriceUsd: 2.5 },
    beer: { name: 'Innis & Gunn Scottish Lager', blurb: 'Scottish lager from an Edinburgh-founded brewery.', averagePriceUsd: 7 },
  },
  copenhagen: {
    localDrink: { name: 'Hyldeblomstsaft', blurb: 'Danish elderflower cordial diluted with still or sparkling water.', averagePriceUsd: 4 },
    beer: { name: 'Carlsberg Pilsner', blurb: 'Copenhagen-founded lager first brewed in the city in 1847.', averagePriceUsd: 7 },
  },
  vancouver: {
    localDrink: { name: 'London Fog', blurb: 'Earl Grey tea latte widely credited to Vancouver café culture.', averagePriceUsd: 5 },
    beer: { name: 'Granville Island English Bay Pale Ale', blurb: 'Pale ale from a brewery founded on Vancouver’s Granville Island.', averagePriceUsd: 6 },
  },
  toronto: {
    localDrink: { name: 'Caesar', blurb: 'Canadian cocktail of vodka, clamato, spices, and a savory garnish.', averagePriceUsd: 10 },
    beer: { name: 'Steam Whistle Pilsner', blurb: 'Pilsner brewed in Toronto’s historic Roundhouse.', averagePriceUsd: 7 },
  },
  'san-francisco': {
    localDrink: { name: 'Irish coffee', blurb: 'Whiskey coffee capped with cream, popularized in San Francisco at the Buena Vista.', averagePriceUsd: 12 },
    beer: { name: 'Fort Point KSA', blurb: 'Kölsch-style ale brewed by a San Francisco brewery.', averagePriceUsd: 8 },
  },
  miami: {
    localDrink: { name: 'Cafecito', blurb: 'Sweet, concentrated Cuban espresso central to Miami café culture.', averagePriceUsd: 2 },
    beer: { name: 'La Rubia', blurb: 'Blonde ale from Wynwood Brewing, Miami’s first production craft brewery.', averagePriceUsd: 7 },
  },
  honolulu: {
    localDrink: { name: 'POG juice', blurb: 'Hawaiian blend of passion fruit, orange, and guava juices.', averagePriceUsd: 4 },
    beer: { name: 'Kona Longboard Island Lager', blurb: 'Hawaiian-branded lager originating from Kona on the island of Hawaiʻi.', averagePriceUsd: 7 },
  },
  melbourne: {
    localDrink: { name: 'Flat white', blurb: 'Espresso with velvety steamed milk, embedded in Melbourne café culture.', averagePriceUsd: 4 },
    beer: { name: 'Victoria Bitter', blurb: 'Long-running Victorian lager commonly known as VB.', averagePriceUsd: 7 },
  },
  auckland: {
    localDrink: { name: 'L&P', blurb: 'New Zealand lemon soft drink originally made in Paeroa.', averagePriceUsd: 3 },
    beer: { name: 'Steinlager Classic', blurb: 'New Zealand lager first produced in Auckland.', averagePriceUsd: 7 },
  },
  kyoto: {
    localDrink: { name: 'Uji matcha', blurb: 'Whisked green tea from Uji, immediately south of Kyoto.', averagePriceUsd: 6 },
    beer: { name: 'Kizakura Kyoto Beer Kölsch', blurb: 'Kölsch-style beer made by Kyoto sake brewer Kizakura.', averagePriceUsd: 6 },
  },
  osaka: {
    localDrink: { name: 'Osaka mixed juice', blurb: 'Thick café drink blending milk with banana and other fruit.', averagePriceUsd: 4 },
    beer: { name: 'Asahi Super Dry', blurb: 'Dry Japanese lager from a company whose original brewery opened in Osaka.', averagePriceUsd: 5 },
  },
  taipei: {
    localDrink: { name: 'Bubble milk tea', blurb: 'Taiwanese milk tea shaken with chewy tapioca pearls.', averagePriceUsd: 3 },
    beer: { name: 'Taiwan Beer Gold Medal', blurb: 'Flagship Taiwanese lager widely served in Taipei.', averagePriceUsd: 3 },
  },
  'hong-kong': {
    localDrink: { name: 'Hong Kong milk tea', blurb: 'Strong black tea strained through cloth and mixed with evaporated milk.', averagePriceUsd: 3 },
    beer: { name: 'Gweilo Pale Ale', blurb: 'Citrusy pale ale produced by a Hong Kong craft brewery.', averagePriceUsd: 7 },
  },
  'chiang-mai': {
    localDrink: { name: 'Northern Thai coffee', blurb: 'Coffee grown in northern Thailand and served hot or over ice in Chiang Mai cafés.', averagePriceUsd: 2.5 },
    beer: { name: 'Singha', blurb: 'Established Thai pale lager widely available in Chiang Mai.', averagePriceUsd: 3 },
  },
  phuket: {
    localDrink: { name: 'Cha yen', blurb: 'Iced Thai tea sweetened with condensed milk.', averagePriceUsd: 2 },
    beer: { name: 'Chalawan Pale Ale', blurb: 'Tropical pale ale from Phuket-based Full Moon Brewworks.', averagePriceUsd: 5 },
  },
  'ho-chi-minh-city': {
    localDrink: { name: 'Cà phê sữa đá', blurb: 'Strong Vietnamese coffee with condensed milk poured over ice.', averagePriceUsd: 2 },
    beer: { name: 'Bia Saigon Special', blurb: 'Saigon-branded lager strongly associated with southern Vietnam.', averagePriceUsd: 2 },
  },
  lima: {
    localDrink: { name: 'Chicha morada', blurb: 'Peruvian purple-corn drink flavored with fruit and warm spices.', averagePriceUsd: 2 },
    beer: { name: 'Cusqueña Dorada', blurb: 'Peruvian golden lager commonly available in Lima.', averagePriceUsd: 3 },
  },
  delhi: {
    localDrink: { name: 'Masala chai', blurb: 'Black tea simmered with milk, sugar, and aromatic spices.', averagePriceUsd: 1 },
    beer: { name: 'Kingfisher Premium', blurb: 'Indian lager widely stocked in licensed Delhi restaurants and shops.', averagePriceUsd: 4 },
  },
};
