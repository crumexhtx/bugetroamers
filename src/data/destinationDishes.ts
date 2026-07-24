export interface MustTryDish {
  name: string;
  blurb: string;
  /** Typical plate price in USD for planning. */
  averagePriceUsd: number;
}

/** Two popular / must-try dishes per destination with average prices. */
export const destinationDishes: Record<string, MustTryDish[]> = {
  lisbon: [
    { name: 'Pastel de nata', blurb: 'Warm custard tart with flaky pastry.', averagePriceUsd: 1.5 },
    { name: 'Bacalhau à Brás', blurb: 'Salt-cod scramble with potatoes and eggs.', averagePriceUsd: 14 },
  ],
  bangkok: [
    { name: 'Pad Thai', blurb: 'Stir-fried noodles with tamarind and peanuts.', averagePriceUsd: 3 },
    { name: 'Mango sticky rice', blurb: 'Sweet coconut rice with ripe mango.', averagePriceUsd: 2.5 },
  ],
  'mexico-city': [
    { name: 'Tacos al pastor', blurb: 'Marinated pork tacos with pineapple.', averagePriceUsd: 2.5 },
    { name: 'Chiles en nogada', blurb: 'Stuffed peppers with walnut sauce.', averagePriceUsd: 12 },
  ],
  budapest: [
    { name: 'Gulyás', blurb: 'Hearty paprika beef soup or stew.', averagePriceUsd: 9 },
    { name: 'Lángos', blurb: 'Fried flatbread with sour cream and cheese.', averagePriceUsd: 5 },
  ],
  hanoi: [
    { name: 'Phở bò', blurb: 'Beef noodle soup with fragrant broth.', averagePriceUsd: 2.5 },
    { name: 'Bún chả', blurb: 'Grilled pork with noodles and herbs.', averagePriceUsd: 3 },
  ],
  marrakech: [
    { name: 'Chicken tagine', blurb: 'Slow-cooked stew with spices and olives.', averagePriceUsd: 8 },
    { name: 'Harira', blurb: 'Tomato-lentil soup often served with dates.', averagePriceUsd: 3 },
  ],
  paris: [
    { name: 'Croissant', blurb: 'Buttery laminated pastry, best fresh in the morning.', averagePriceUsd: 2.5 },
    { name: 'Steak frites', blurb: 'Classic bistro steak with crisp fries.', averagePriceUsd: 28 },
  ],
  london: [
    { name: 'Full English breakfast', blurb: 'Eggs, bacon, beans, toast, and more.', averagePriceUsd: 15 },
    { name: 'Fish and chips', blurb: 'Beer-battered fish with thick-cut chips.', averagePriceUsd: 14 },
  ],
  rome: [
    { name: 'Cacio e pepe', blurb: 'Pasta with pecorino and black pepper.', averagePriceUsd: 14 },
    { name: 'Supplì', blurb: 'Fried risotto balls with a molten cheese center.', averagePriceUsd: 3 },
  ],
  barcelona: [
    { name: 'Paella', blurb: 'Saffron rice with seafood or mixed meats.', averagePriceUsd: 18 },
    { name: 'Patatas bravas', blurb: 'Fried potatoes with spicy tomato sauce.', averagePriceUsd: 6 },
  ],
  amsterdam: [
    { name: 'Stroopwafel', blurb: 'Caramel-filled thin waffle cookie.', averagePriceUsd: 2 },
    { name: 'Bitterballen', blurb: 'Crispy fried beef ragout bites.', averagePriceUsd: 8 },
  ],
  istanbul: [
    { name: 'Kebab wrap', blurb: 'Grilled meat with salad in flatbread.', averagePriceUsd: 5 },
    { name: 'Baklava', blurb: 'Layered pastry with nuts and syrup.', averagePriceUsd: 3 },
  ],
  dubai: [
    { name: 'Shawarma', blurb: 'Spiced carved meat in soft bread.', averagePriceUsd: 4 },
    { name: 'Luqaimat', blurb: 'Sweet dumplings with date syrup.', averagePriceUsd: 5 },
  ],
  tokyo: [
    { name: 'Ramen', blurb: 'Rich noodle soup with toppings.', averagePriceUsd: 9 },
    { name: 'Sushi set', blurb: 'Fresh nigiri or conveyor-belt favorites.', averagePriceUsd: 18 },
  ],
  seoul: [
    { name: 'Bibimbap', blurb: 'Rice bowl with vegetables, egg, and gochujang.', averagePriceUsd: 9 },
    { name: 'Korean fried chicken', blurb: 'Crispy double-fried chicken, often shared.', averagePriceUsd: 16 },
  ],
  singapore: [
    { name: 'Hainanese chicken rice', blurb: 'Poached chicken with fragrant rice.', averagePriceUsd: 5 },
    { name: 'Chili crab', blurb: 'Sweet-spicy crab best shared at a seafood house.', averagePriceUsd: 40 },
  ],
  bali: [
    { name: 'Nasi goreng', blurb: 'Indonesian fried rice with egg and sambal.', averagePriceUsd: 3 },
    { name: 'Babi guling', blurb: 'Balinese roast pork, usually at local warungs.', averagePriceUsd: 6 },
  ],
  'new-york': [
    { name: 'New York slice', blurb: 'Foldable pizza slice from a corner shop.', averagePriceUsd: 4 },
    { name: 'Bagel', blurb: 'Sesame bagel with cream cheese or lox.', averagePriceUsd: 6 },
  ],
  'los-angeles': [
    { name: 'Fish tacos', blurb: 'Crispy or grilled fish with cabbage and salsa.', averagePriceUsd: 5 },
    { name: 'Korean BBQ', blurb: 'Table-grill meats with banchan sides.', averagePriceUsd: 35 },
  ],
  orlando: [
    { name: 'Theme-park burger meal', blurb: 'Quick-service burger combo inside the parks.', averagePriceUsd: 18 },
    { name: 'Key lime pie', blurb: 'Tangy citrus pie popular across Florida.', averagePriceUsd: 7 },
  ],
  cancun: [
    { name: 'Cochinita pibil tacos', blurb: 'Slow-roasted citrus pork tacos.', averagePriceUsd: 3 },
    { name: 'Ceviche', blurb: 'Citrus-cured seafood with onion and chili.', averagePriceUsd: 10 },
  ],
  'rio-de-janeiro': [
    { name: 'Açaí bowl', blurb: 'Frozen açaí topped with granola and fruit.', averagePriceUsd: 5 },
    { name: 'Feijoada', blurb: 'Black-bean stew with pork, often a weekend meal.', averagePriceUsd: 12 },
  ],
  'buenos-aires': [
    { name: 'Asado steak', blurb: 'Grilled beef at a classic parrilla.', averagePriceUsd: 22 },
    { name: 'Empanadas', blurb: 'Savory stuffed pastries, often baked.', averagePriceUsd: 2.5 },
  ],
  'cape-town': [
    { name: 'Bunny chow', blurb: 'Curry served in a hollowed bread loaf.', averagePriceUsd: 8 },
    { name: 'Braai boerewors', blurb: 'Grilled spiced sausage with sides.', averagePriceUsd: 10 },
  ],
  cairo: [
    { name: 'Koshari', blurb: 'Rice, lentils, pasta, and tomato sauce.', averagePriceUsd: 2 },
    { name: 'Ful medames', blurb: 'Stewed fava beans with oil and spices.', averagePriceUsd: 1.5 },
  ],
  sydney: [
    { name: 'Meat pie', blurb: 'Hand-held savory pie, a local classic.', averagePriceUsd: 5 },
    { name: 'Barramundi & chips', blurb: 'Local fish with chips by the water.', averagePriceUsd: 22 },
  ],

  prague: [
    { name: 'Trdelník', blurb: 'Sweet spit-cake pastry popular with visitors.', averagePriceUsd: 4 },
    { name: 'Svíčková', blurb: 'Creamy vegetable sauce with beef and dumplings.', averagePriceUsd: 12 },
  ],
  vienna: [
    { name: 'Wiener Schnitzel', blurb: 'Thin breaded veal or pork cutlet.', averagePriceUsd: 22 },
    { name: 'Sachertorte', blurb: 'Dense chocolate cake with apricot jam.', averagePriceUsd: 8 },
  ],
  berlin: [
    { name: 'Currywurst', blurb: 'Sliced sausage with curry ketchup.', averagePriceUsd: 5 },
    { name: 'Döner kebab', blurb: 'Berlin’s classic late-night wrap.', averagePriceUsd: 7 },
  ],
  athens: [
    { name: 'Souvlaki', blurb: 'Grilled meat skewers in pita with sauces.', averagePriceUsd: 5 },
    { name: 'Moussaka', blurb: 'Baked layers of eggplant, meat, and béchamel.', averagePriceUsd: 14 },
  ],
  madrid: [
    { name: 'Tapas crawl', blurb: 'Small plates shared across a few bars.', averagePriceUsd: 18 },
    { name: 'Churros con chocolate', blurb: 'Fried dough with thick hot chocolate.', averagePriceUsd: 5 },
  ],
  dublin: [
    { name: 'Irish stew', blurb: 'Hearty lamb or beef stew with vegetables.', averagePriceUsd: 16 },
    { name: 'Full Irish breakfast', blurb: 'Eggs, sausages, bacon, and toast.', averagePriceUsd: 15 },
  ],
  edinburgh: [
    { name: 'Haggis', blurb: 'Savory pudding usually served with neeps and tatties.', averagePriceUsd: 14 },
    { name: 'Scotch pie', blurb: 'Hand-held meat pie for a quick bite.', averagePriceUsd: 4 },
  ],
  copenhagen: [
    { name: 'Smørrebrød', blurb: 'Open-faced rye sandwiches with toppings.', averagePriceUsd: 16 },
    { name: 'Hot dog (pølse)', blurb: 'Classic street hot dog with remoulade.', averagePriceUsd: 6 },
  ],
  vancouver: [
    { name: 'Pacific salmon', blurb: 'Grilled or smoked salmon with local sides.', averagePriceUsd: 24 },
    { name: 'Japanese-Canadian sushi', blurb: 'High-quality rolls and nigiri across the city.', averagePriceUsd: 18 },
  ],
  toronto: [
    { name: 'Peameal bacon sandwich', blurb: 'Toronto classic on a soft bun.', averagePriceUsd: 10 },
    { name: 'Butter tart', blurb: 'Sweet Canadian pastry with gooey filling.', averagePriceUsd: 4 },
  ],
  'san-francisco': [
    { name: 'Sourdough clam chowder', blurb: 'Chowder in a sourdough bread bowl.', averagePriceUsd: 12 },
    { name: 'Mission burrito', blurb: 'Oversized burrito from the Mission District.', averagePriceUsd: 14 },
  ],
  miami: [
    { name: 'Cuban sandwich', blurb: 'Pressed ham, pork, Swiss, and pickles.', averagePriceUsd: 12 },
    { name: 'Stone crab (in season)', blurb: 'Chilled claws with mustard sauce.', averagePriceUsd: 40 },
  ],
  honolulu: [
    { name: 'Poke bowl', blurb: 'Cubed raw fish with rice and toppings.', averagePriceUsd: 16 },
    { name: 'Spam musubi', blurb: 'Grilled Spam over rice wrapped in nori.', averagePriceUsd: 4 },
  ],
  melbourne: [
    { name: 'Flat white', blurb: 'Melbourne café staple espresso drink.', averagePriceUsd: 4 },
    { name: 'Chicken parma', blurb: 'Pub classic chicken schnitzel with toppings.', averagePriceUsd: 22 },
  ],
  auckland: [
    { name: 'Fish and chips', blurb: 'Fresh local catch by the water.', averagePriceUsd: 16 },
    { name: 'Pavlova', blurb: 'Meringue dessert with cream and fruit.', averagePriceUsd: 8 },
  ],
  kyoto: [
    { name: 'Kaiseki', blurb: 'Multi-course seasonal Kyoto cuisine.', averagePriceUsd: 60 },
    { name: 'Matcha sweets', blurb: 'Tea-flavored wagashi and soft serve.', averagePriceUsd: 5 },
  ],
  osaka: [
    { name: 'Takoyaki', blurb: 'Octopus-filled savory batter balls.', averagePriceUsd: 5 },
    { name: 'Okonomiyaki', blurb: 'Savory cabbage pancake with sauces.', averagePriceUsd: 10 },
  ],
  taipei: [
    { name: 'Beef noodle soup', blurb: 'Taiwanese comfort bowl with braised beef.', averagePriceUsd: 6 },
    { name: 'Xiaolongbao', blurb: 'Soup dumplings from famed shops.', averagePriceUsd: 10 },
  ],
  'hong-kong': [
    { name: 'Dim sum', blurb: 'Small plates of dumplings and buns.', averagePriceUsd: 18 },
    { name: 'Egg tart', blurb: 'Flaky custard tart from local bakeries.', averagePriceUsd: 2 },
  ],
  'chiang-mai': [
    { name: 'Khao soi', blurb: 'Northern curry noodle soup.', averagePriceUsd: 3 },
    { name: 'Sai ua', blurb: 'Herb-packed northern Thai sausage.', averagePriceUsd: 3 },
  ],
  phuket: [
    { name: 'Seafood barbecue', blurb: 'Grilled catch at a beachside stall.', averagePriceUsd: 12 },
    { name: 'Pad kra pao', blurb: 'Stir-fried holy basil with rice and egg.', averagePriceUsd: 3 },
  ],
  'ho-chi-minh-city': [
    { name: 'Bánh mì', blurb: 'Crispy baguette sandwich with fillings.', averagePriceUsd: 2 },
    { name: 'Phở', blurb: 'Southern-style noodle soup bowls.', averagePriceUsd: 3 },
  ],
  lima: [
    { name: 'Ceviche', blurb: 'Citrus-cured seafood with onion and chili.', averagePriceUsd: 14 },
    { name: 'Lomo saltado', blurb: 'Stir-fried beef with fries and rice.', averagePriceUsd: 12 },
  ],
  delhi: [
    { name: 'Chole bhature', blurb: 'Spiced chickpeas with fried bread.', averagePriceUsd: 3 },
    { name: 'Butter chicken', blurb: 'Creamy tomato chicken curry with bread or rice.', averagePriceUsd: 8 },
  ],
};
