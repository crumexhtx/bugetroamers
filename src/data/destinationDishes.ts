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
};
