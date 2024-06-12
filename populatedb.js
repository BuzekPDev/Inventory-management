#! /usr/bin/env node

  
  // Get arguments passed on command line
  import { configDotenv } from 'dotenv';
  
  import { Category } from './models/category.js';
  import { Edition } from './models/edition.js';
  import { Expansion } from './models/expansion.js';
  import { Product } from './models/product.js';

  configDotenv()

  const categories = [];
  const editions = [];
  const expansions = [];
  const products = [];
  
  import mongoose from 'mongoose';
  mongoose.set("strictQuery", false);
  
  const mongoDB = process.env.MONGODB;
  
  main().catch((err) => console.log(err));
  
  async function main() {

    await mongoose.connect(mongoDB, {dbName: 'InventoryMGMT'})

    await createCategories();
    await createEditions();
    await createExpansions();
    await createProducts();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // genre[0] will always be the Fantasy genre, regardless of the order
  // in which the elements of promise.all's argument complete.
  async function categoryCreate(index, name, description = '', image) {
    const category = new Category({ name: name, description: description, image:image });
    await category.save();
    categories[index] = category;
    console.log(`Added category: ${name}`);
  }
  
  async function editionCreate(index, 
                               name, 
                               shorthand, 
                               release_date = '', 
                               logo = 'https://tcg.pokemon.com/assets/img/sv-expansions/scarlet-violet/logo/en-us/sv01-logo.png') {
    const editionDetail = { 
      name: name, 
      shorthand: shorthand,
      release_date: release_date,
      logo: logo
    };

    const edition = new Edition(editionDetail);
  
    await edition.save();
    editions[index] = edition;
    console.log(`Added edition: ${name} / ${shorthand}`);
  }
  
  async function expansionCreate(index, 
                                 name, 
                                 shorthand, 
                                 description = '', 
                                 set_type, 
                                 edition, 
                                 release_date = '', 
                                 logo = 'https://cdn.shopify.com/s/files/1/0663/9612/7517/files/144_twilight_masquerade_logo.png?v=1717075458') {
    const expansionDetail = {
      name: name,
      shorthand: shorthand,
      description: description,
      set_type: set_type,
      edition: edition,
      release_date: release_date,
      logo: logo
    };
  
    const expansion = new Expansion(expansionDetail);
    await expansion.save();
    expansions[index] = expansion;
    console.log(`Added expansion: ${name} / ${shorthand}`);
  }
  
  async function productCreate(index, 
                               name, 
                               description = '', 
                               contents, 
                               category,
                               edition,
                               expansion = '',
                               msrp,
                               stock,
                               image = 'https://pokestore-dev.netlify.app/ETB/TWM_ETB01_01.webp') {
    
    const productDetail = {
      name: name, 
      description: description, 
      contents: contents, 
      category: category,
      expansion: expansion,
      edition: edition,
      msrp: msrp,
      stock: stock,
      image: image
    };
    
    const product = new Product(productDetail);
    await product.save();
    products[index] = product;
    console.log(`Added product: ${name}, ${stock} pcs`);
  }
  
  async function createCategories() {
    console.log("Adding categories");
    await Promise.all([
      categoryCreate(0, "Booster pack", "Packs with random cards","/images/SM_BOOSTER.webp"),
      categoryCreate(1, "Blister pack", "Pack with booster pack(s) and a promo card", "https://www.pokemoncenter.com/images/DAMRoot/High/10000/P3653PC_699-16819_01.jpg"),
      categoryCreate(2, "Collection", "Box with several booster packs, a themed promo card with a rulebox and usually some other things like a figure or pin","https://www.pokemoncenter.com/images/DAMRoot/High/10000/P4645_290-80415_01.jpg"),
      categoryCreate(3, "Box", "Box with several booster packs and a themed promo card with a rule box or several normal promos", "https://www.pokemoncenter.com/images/DAMRoot/High/10000/P4332PC_699-16863_01.jpg"),
      categoryCreate(4, "Tin", "Tin box with several booster packs and other goodies", "https://www.pokemoncenter.com/images/DAMRoot/High/10000/P1513_699-16631_01.jpg"),
      categoryCreate(5, "Elite Trainer Box", "Box meant as an entry point to a new expansions. Usually comes with 8-10 booster packs, sleeves, dice and other accessories, a guide to the new expansion and card dividers. The box is pretty sturdy and usually an awesome display piece on its own", "https://www.pokemoncenter.com/images/DAMRoot/High/10000/P3711PC_162-80241_01.jpg"),
      categoryCreate(6, "Theme deck", "Pre-constructed ready-to-play 60 card deck.", "https://www.pokemoncenter.com/images/DAMRoot/High/10000/P2360PC_699-16737_01.jpg")
    ]);
  }
  
  async function createEditions() {
    console.log("Adding authors");
    await Promise.all([
      editionCreate(0, "X & Y", "XY", "2013-11-8", 'https://www.pokemon.com/static-assets/content-assets/cms2/img/trading-card-game/series/xy_series/xy01/xy01_slider_logo_en.png'),
      editionCreate(1, "Sun & Moon", "SM", "2017-05-05", "https://www.pokemon.com/static-assets/content-assets/cms2/img/trading-card-game/series/sm_series/sm01/sm01_logo_169_en.png"),
      editionCreate(2, "Sword & Shield", "SWSH", "2020-02-07", "https://www.pokemon.com/static-assets/content-assets/cms2/img/trading-card-game/series/swsh_series/swsh01/swsh01_logo_169_en.png"),
    ]);
  }
  
  async function createExpansions() {
    console.log("Adding Expansions");
    await Promise.all([
      expansionCreate(0, 
        "Sun & Moon", 
        "SUM", 
        "Your Adventure in a New Region Starts Now! Welcome to the tropical Alola region! Start your journey with Rowlet, Litten, and Popplio, then seek out the Legendary Pokémon Solgaleo-GX and Lunala-GX to witness the awesome power of a new kind of Pokémon: each Pokémon-GX brings an attack so devastating that you can use only one of them per game! Discover dozens of never-before-seen Pokémon, Alola forms of some familiar favorites, and new ways to battle in the Pokémon TCG: Sun & Moon expansion!",
        "Main Series Expansion",
        editions[1],
        "2017-02-03", 
        'https://images.pokemontcg.io/sm1/symbol.png'),
      expansionCreate(1, 
        "Guardians Rising", 
        "GRI", 
        "Island Guardians, Ready for Battle! Visit Alola for Pokémon fun, from the beaches to the mountain peaks—and discover new traditions and new challenges! Meet the island guardians Tapu Koko-GX and Tapu Lele-GX, and sharpen your skills with Kahuna Hala and Captain Mallow! Be amazed by the secret powers of Kommo-o-GX, Lycanroc-GX, Metagross-GX, Sylveon-GX, Toxapex-GX, Vikavolt-GX, and many more! Come to the islands, and seize the power of the Pokémon TCG: Sun & Moon—Guardians Rising expansion!",
        "Main Series Expansion",
        editions[1],
        "2017-05-05", 
        "https://images.pokemontcg.io/sm2/symbol.png"),
      expansionCreate(2, 
        "Burning Shadows", 
        "BUS", 
        "Fiery Battles and Deep Shadows! What strange fires lurk in the shadows? Minions of Team Skull and a cavalcade of new Pokémon stand ready to battle in the dark of night and in the blazing sun! Slug it out with new titans like Necrozma-GX, Marshadow-GX, and Tapu Fini-GX, or battle with trusty allies from Machamp-GX and Charizard-GX to Darkrai-GX and Ho-Oh-GX. Fight for what's right with the Pokémon TCG: Sun & Moon—Burning Shadows expansion!",
        "Main Series Expansion",
        editions[1],
        "2017-08-04", 
        "https://images.pokemontcg.io/sm3/symbol.png"),
    ]);
  }
  
  async function createProducts() {
    console.log("Adding products");
    await Promise.all([
      productCreate(0,
        "Sun & Moon Booster pack",
        "Pack with a bunch of cards",
        ["10 Pokémon Trading Cards", "1 Pokemon TCG Online code"],
        categories[0],
        editions[1],
        expansions[0],
        99,
        432,
        "/images/SM_BOOSTER.webp"
      ),
      productCreate(1,
        "Lunala Alola Collection",
        "Box with random packs and a bunch of promos",
        ["3 special foil promo cards featuring Rowlet, Litten, and Popplio", 
        "1 foil oversize card featuring Lunala, the Legendary Pokémon-GX",
        "1 sculpted figure of Lunala",
        "1 Lunala collector’s pin",
        "5 Pokémon TCG booster packs, each containing 10 cards",
        "1 Pokemon TCG Online code"],
        categories[2],
        editions[1],
        expansions[0],
        749,
        20,
        "/images/ALOLA_COLLECTION.webp"
      ),
      productCreate(2,
        "Burning Shadows Elite Trainer Box",
        "Step out of the darkness and kindle a new path to victory with the Pokémon TCG: Sun & Moon—Burning Shadows Elite Trainer Box. You’ll find everything you need to compete in this extensive collection, including card sleeves featuring the Legendary Pokémon Necrozma, high-quality dice and condition markers, and more. Plus, get tips for how to put cards from the Sun & Moon—Burning Shadows expansion to use with the special player’s guide. And everything fits in the collector’s box, making it easy for you to travel to battle with your friends or to your next big competition. Blaze ahead with the Pokémon TCG: Sun & Moon—Burning Shadows Elite Trainer Box!",
        ["8 Burning Shadows Booster packs", 
        "65 card sleeves featuring Necrozma",
        "45 Pokémon TCG Energy cards",
        "A player’s guide to the Sun & Moon—Burning Shadows expansion",
        "6 damage-counter dice",
        "1 competition-legal coin-flip die",
        "2 acrylic condition markers and 1 acrylic GX marker",
        "A collector’s box to hold everything, with 4 dividers to keep it organized",
        "1 Pokemon TCG Online code"],
        categories[5],
        editions[1],
        expansions[2],
        999,
        12,
        "/images/BSH_ETB.webp"
      )
    ]);
  }