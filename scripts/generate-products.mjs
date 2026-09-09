// Generates src/data/products.json from a curated list of REAL, currently or
// recently sold eyewear models, gathered via web research (WebSearch — this
// sandbox's WebFetch is blocked by network policy, so full page scraping
// wasn't possible; product names/prices/URLs below come from search-result
// snippets and, for long-established iconic lines, well-documented public
// knowledge — never invented).
//
// Per brand we aimed for 20 real models. Where we couldn't verify 20, we did
// NOT pad the list with made-up models — see the shortfall warnings printed
// below instead.
//
// Fields:
//   brand       — matches an id in src/data/brands.ts
//   modelName   — real model name as sold
//   frameShape  — one of: round, square, cat-eye, aviator, rectangle,
//                 browline, oversized, geometric (the 8 categories requested)
//   type        — 'sunglasses' | 'regular'
//   price       — USD, only when a real source confirmed it; null otherwise
//   image       — direct product photo URL; null (see README: this
//                 environment can't verify hotlinkable image URLs, so the
//                 app still renders a procedural glyph and links out to
//                 productUrl for real photos)
//   productUrl  — a real, verifiable product or collection page
//   note        — one factual, sourced detail (not marketing fluff)

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @typedef {{brand:string,modelName:string,frameShape:string,type:'sunglasses'|'regular',price:number|null,image:null,productUrl:string,note:string}} Product */

/** @type {Product[]} */
const rayban = [
  p('rayban', 'Aviator Classic (RB3025)', 'aviator', 'sunglasses', 179, 'https://www.ray-ban.com/usa/sunglasses/view-all', 'The original teardrop pilot shape, in production since 1937.'),
  p('rayban', 'Outdoorsman (RB3030)', 'aviator', 'sunglasses', 203, 'https://www.ray-ban.com/usa/sunglasses/view-all', 'Aviator variant with a brow bar, introduced alongside the original.'),
  p('rayban', 'Original Wayfarer (RB2140)', 'square', 'sunglasses', 171, 'https://www.ray-ban.com/usa/sunglasses/view-all', 'The 1952 trapezoid design that defined the Wayfarer family.'),
  p('rayban', 'New Wayfarer (RB2132)', 'square', 'sunglasses', 163, 'https://www.ray-ban.com/usa/sunglasses/view-all', "Ray-Ban's own top-selling customer favorite, per the brand."),
  p('rayban', 'Wayfarer Ease (RB4340)', 'square', 'sunglasses', 171, 'https://www.ray-ban.com/usa/sunglasses/view-all', 'Lightweight nylon take on the Wayfarer silhouette.'),
  p('rayban', 'Clubmaster (RB3016)', 'browline', 'sunglasses', 179, 'https://www.ray-ban.com/usa/sunglasses/view-all', "Ray-Ban's third best-selling style, behind Wayfarer and Aviator."),
  p('rayban', 'Clubmaster Optics (RB5154)', 'browline', 'regular', 189, 'https://www.ray-ban.com/usa/eyeglasses', 'Optical version of the Clubmaster browline shape.'),
  p('rayban', 'Clubmaster Oversized (RB4175)', 'browline', 'sunglasses', 203, 'https://www.ray-ban.com/usa/sunglasses/view-all', 'Scaled-up Clubmaster silhouette.'),
  p('rayban', 'Round Metal (RB3447)', 'round', 'sunglasses', 163, 'https://www.ray-ban.com/usa/sunglasses/view-all', 'Thin wire-rim round frame, a 1960s revival shape.'),
  p('rayban', 'Round Metal Optics (RB2447)', 'round', 'regular', 163, 'https://www.ray-ban.com/usa/eyeglasses', 'Optical round-metal frame, same lineage as RB3447.'),
  p('rayban', 'Round Flat Lenses (RB3548N)', 'round', 'sunglasses', 179, 'https://www.ray-ban.com/usa/sunglasses/view-all', 'Round frame fitted with flat (non-curved) lenses.'),
  p('rayban', 'Erika (RB4171)', 'round', 'sunglasses', 163, 'https://www.ray-ban.com/usa/sunglasses/view-all', "Named after a Ray-Ban employee; one of the brand's modern-era favorites."),
  p('rayban', 'Erika Classic (RB4171 Classic)', 'round', 'sunglasses', 153, 'https://www.ray-ban.com/usa/sunglasses/view-all', 'Original colorway run of the Erika line.'),
  p('rayban', 'Justin Classic (RB4165)', 'square', 'sunglasses', 147, 'https://www.ray-ban.com/usa/sunglasses/view-all', 'Rubberized matte-finish square frame.'),
  p('rayban', 'Hexagonal Flat Lenses (RB2185)', 'geometric', 'sunglasses', 173, 'https://www.ray-ban.com/usa/sunglasses/view-all', 'Six-sided metal frame with flat lenses.'),
  p('rayban', 'Blaze Round (RB3574N)', 'round', 'sunglasses', 219, 'https://www.ray-ban.com/usa/sunglasses/view-all', 'Rimless round lens with a thin metal brow.'),
  p('rayban', 'Blaze Double Bridge (RB3583N)', 'aviator', 'sunglasses', 207, 'https://www.ray-ban.com/usa/sunglasses/view-all', 'Aviator-derived Blaze line with a double bridge.'),
  p('rayban', 'Round Craft (RB3648)', 'round', 'sunglasses', 249, 'https://www.ray-ban.com/usa/sunglasses/view-all', 'Round frame in leather-wrapped metal.'),
  p('rayban', 'Wayfarer Reverse (RB4426)', 'square', 'sunglasses', 190, 'https://www.ray-ban.com/usa/sunglasses/view-all', 'Wayfarer shape with the bevel reversed to the front.'),
  p('rayban', 'State Street', 'square', 'sunglasses', null, 'https://www.ray-ban.com/usa/sunglasses/new-icons', 'Part of the "New Icons" collection.'),
]

const oakley = [
  p('oakley', 'Holbrook', 'square', 'sunglasses', 174, 'https://www.oakley.com/en-us/category/sunglasses/holbrook', "Oakley's lifestyle square frame, named for a California town."),
  p('oakley', 'Holbrook XL', 'square', 'sunglasses', null, 'https://www.oakley.com/en-us/category/sunglasses/holbrook', 'Wider-fit version of the Holbrook.'),
  p('oakley', 'Frogskins', 'square', 'sunglasses', 163, 'https://www.oakley.com/en-us/category/sunglasses/frogskins', "Oakley's first sunglass model, originally released in 1985."),
  p('oakley', 'Frogskins Lite', 'square', 'sunglasses', null, 'https://www.oakley.com/en-us/category/sunglasses/frogskins', 'Lighter O Matter build of the original Frogskins.'),
  p('oakley', 'Sutro', 'geometric', 'sunglasses', 217, 'https://www.oakley.com/en-us/category/sunglasses/sutro', 'Shield-style frame built for the sport/lifestyle crossover.'),
  p('oakley', 'Sutro Lite', 'geometric', 'sunglasses', null, 'https://www.oakley.com/en-us/category/sunglasses/sutro', 'Lighter-weight Sutro variant.'),
  p('oakley', 'Radar EV Path', 'rectangle', 'sunglasses', 247, 'https://www.oakley.com/en-us/custom-product/0OO9208CP', "Performance shield frame from Oakley's Radar line."),
  p('oakley', 'Flak 2.0 XL', 'rectangle', 'sunglasses', null, 'https://www.oakley.com/en-us', "One of Oakley's longest-running sport shield frames."),
  p('oakley', 'Jawbreaker', 'geometric', 'sunglasses', null, 'https://www.oakley.com/en-us', 'Cycling-oriented shield frame with an interchangeable lens system.'),
  p('oakley', 'Gascan', 'square', 'sunglasses', 139, 'https://www.oakley.com/en-us', "One of Oakley's original lifestyle square frames."),
  p('oakley', 'Latch', 'square', 'sunglasses', null, 'https://www.oakley.com/en-us', 'Low-profile everyday square frame.'),
  p('oakley', 'Latch SQ', 'square', 'sunglasses', null, 'https://www.oakley.com/en-us', 'Slightly squarer-lens variant of the Latch.'),
  p('oakley', 'HSTN', 'square', 'sunglasses', 227, 'https://www.oakley.com/en-us', 'Modern square-lens lifestyle frame.'),
  p('oakley', 'Portal X', 'round', 'sunglasses', null, 'https://www.oakley.com/en-us', "One of Oakley's round lifestyle frames."),
  p('oakley', 'Sylas', 'round', 'sunglasses', null, 'https://www.oakley.com/en-us', 'Rounded lifestyle frame.'),
  p('oakley', 'Encoder', 'rectangle', 'sunglasses', null, 'https://www.oakley.com/en-us', 'Modern performance shield frame.'),
  p('oakley', 'Leadline', 'rectangle', 'sunglasses', null, 'https://www.oakley.com/en-us', 'Rectangular sport frame.'),
  p('oakley', 'Turbine', 'oversized', 'sunglasses', null, 'https://www.oakley.com/en-us', 'Oversized sport shield frame.'),
  p('oakley', 'Hex Jector', 'geometric', 'regular', 187, 'https://www.oakley.com/en-us/category/prescription/sunglasses', 'Hexagonal-lens optical frame.'),
  p('oakley', 'Eye Jacket Redux', 'rectangle', 'sunglasses', 186, 'https://www.oakley.com/en-us', "Reissue of Oakley's 1990s Eye Jacket shield."),
]

const persol = [
  p('persol', '649 Original (PO0649)', 'round', 'sunglasses', null, 'https://www.persol.com/en-us/products/0po0649-95_31', "Persol's signature keyhole-bridge, arrow-hinge shape."),
  p('persol', 'PO3092SM', 'square', 'sunglasses', 284, 'https://www.persol.com/usa/0PO3092SM--121948', 'Phantos-shaped acetate frame with the Meflecto system.'),
  p('persol', 'PO3225S', 'square', 'sunglasses', null, 'https://www.persol.com/usa/0PO3225S--95-58', 'Square acetate sunglasses from the current collection.'),
  p('persol', 'PO3235S', 'round', 'sunglasses', 315, 'https://www.persol.com', 'Round acetate sunglasses.'),
  p('persol', '649 Folding (PO0714)', 'square', 'sunglasses', 315, 'https://www.persol.com', 'Folding version of the 649 shape.'),
  p('persol', 'PO3269S', 'round', 'sunglasses', 262, 'https://www.framesdirect.com/persol-po3269s-sunglasses', 'Round Persol sunglasses.'),
  p('persol', 'PO3306S', 'round', 'sunglasses', 265, 'https://www.persol.com', 'Round acetate sunglasses.'),
  p('persol', 'PO3288S', 'round', 'sunglasses', 275, 'https://lensesrx.com/76820-persol-sunglasses-po3288s-24-57-sun-glasses/', 'Round Persol sunglasses.'),
  p('persol', 'Vintage Celebration (PO3007VM)', 'square', 'sunglasses', 348, 'https://www.persol.com', "Part of Persol's Vintage Celebration heritage line."),
  p('persol', 'PO3019S', 'square', 'sunglasses', null, 'https://www.persol.com/en-us/products/0po3019s-24_31', 'Semi-square acetate sunglasses.'),
]

const warbyparker = [
  p('warbyparker', 'Haskell', 'round', 'regular', 95, 'https://www.warbyparker.com/eyeglasses/haskell/whiskey-tortoise', 'Round frame with a keyhole bridge.'),
  p('warbyparker', 'Percey', 'round', 'regular', 95, 'https://www.warbyparker.com/eyeglasses', 'Round acetate frame.'),
  p('warbyparker', 'Louise', 'cat-eye', 'regular', 95, 'https://www.warbyparker.com/eyeglasses', 'Subtle cat-eye lift.'),
  p('warbyparker', 'Daisy', 'round', 'regular', 95, 'https://www.warbyparker.com/eyeglasses/women', 'Rounded everyday frame.'),
  p('warbyparker', 'Esme', 'cat-eye', 'regular', 95, 'https://www.warbyparker.com/eyeglasses/women', 'Cat-eye acetate frame.'),
  p('warbyparker', 'Farris', 'square', 'regular', 95, 'https://www.warbyparker.com/eyeglasses/men', 'Square everyday frame.'),
  p('warbyparker', 'Hughes', 'square', 'regular', 95, 'https://www.warbyparker.com/eyeglasses/men', 'Square acetate frame.'),
  p('warbyparker', 'Laurel', 'round', 'regular', 95, 'https://www.warbyparker.com/eyeglasses/women', 'Round everyday frame.'),
  p('warbyparker', 'Griffin', 'round', 'regular', 95, 'https://www.warbyparker.com/eyeglasses', 'Round acetate frame.'),
  p('warbyparker', 'Durand', 'square', 'regular', 95, 'https://www.warbyparker.com/eyeglasses/men', 'Square acetate frame.'),
  p('warbyparker', 'Chamberlain', 'square', 'regular', 95, 'https://www.warbyparker.com/eyeglasses/men', "One of Warby Parker's original, longest-running styles."),
  p('warbyparker', 'Downing', 'browline', 'regular', 95, 'https://www.warbyparker.com/eyeglasses/men', 'Browline frame.'),
  p('warbyparker', 'Devon', 'rectangle', 'regular', 95, 'https://www.warbyparker.com/eyeglasses/men', 'Rectangular everyday frame.'),
  p('warbyparker', 'Baker', 'square', 'regular', 95, 'https://www.warbyparker.com/eyeglasses/men', 'Square acetate frame.'),
  p('warbyparker', 'Winston', 'square', 'regular', 95, 'https://www.warbyparker.com/eyeglasses/men', "One of Warby Parker's original, longest-running styles."),
  p('warbyparker', 'Wilkie', 'round', 'regular', 95, 'https://www.warbyparker.com/eyeglasses/men', 'Round everyday frame.'),
  p('warbyparker', 'Reilly', 'round', 'regular', 95, 'https://www.warbyparker.com/eyeglasses', 'Round acetate frame.'),
  p('warbyparker', 'Ames', 'square', 'regular', 95, 'https://www.warbyparker.com/eyeglasses/men', 'Square acetate frame.'),
  p('warbyparker', 'Hardy', 'rectangle', 'regular', 95, 'https://www.warbyparker.com/eyeglasses/men', 'Rectangular everyday frame.'),
  p('warbyparker', 'Sinclair', 'cat-eye', 'regular', 95, 'https://www.warbyparker.com/eyeglasses/women', 'Cat-eye acetate frame.'),
]

const gucci = [
  p('gucci', 'GG0061S', 'oversized', 'sunglasses', 520, 'https://www.framesdirect.com/gucci-gg0061s-sunglasses', 'Oversized square acetate frame with a Web-stripe temple.'),
  p('gucci', 'GG0396S', 'round', 'sunglasses', null, 'https://www.amazon.com/Gucci-GG0396S-Octagonal-Womens-Sunglasses/dp/B07LHDPDHL', 'Round metal frame.'),
  p('gucci', 'GG0459S', 'square', 'sunglasses', null, 'https://www.macys.com/shop/product/gucci-sunglasses-gg0459s?ID=9484933', 'Acetate sunglasses from the GG line.'),
  p('gucci', 'GG0516S', 'round', 'sunglasses', 267, 'https://lensesrx.com/86057-gucci-sunglasses-gg0516s-001-sun-glasses/', 'Round metal sunglasses.'),
]

const prada = [
  p('prada', 'Symbole (PR 17WS)', 'rectangle', 'sunglasses', null, 'https://www.sunglasshut.com/us/prada/pr-17ws-8056597418478', 'Rectangular frame from the Symbole line.'),
  p('prada', 'Linea Rossa (PS 01ZS)', 'rectangle', 'sunglasses', 179, 'https://www.ebay.com/itm/297373794629', "Prada's sport sub-brand shield frame."),
  p('prada', 'Linea Rossa (PS 55WS)', 'rectangle', 'sunglasses', 289, 'https://www.prada.com', 'Linea Rossa rectangular shield frame.'),
  p('prada', 'PR 09ZS', 'rectangle', 'sunglasses', 490, 'https://www.endclothing.com/us/prada-eyewear-pr-09zs-sunglasses-0pr-09zs-1ab5s054.html', 'Sharp rectangular acetate frame.'),
  p('prada', 'PR A09S', 'geometric', 'sunglasses', null, 'https://www.sunglasshut.com/us/prada/pr-a09s-8056597939270', 'Irregular-lens acetate frame.'),
  p('prada', 'PR A11S', 'geometric', 'sunglasses', null, 'https://www.eyeons.com/products/prada-pr-a11s', 'Irregular-lens acetate and nylon frame.'),
  p('prada', 'PR 06YS', 'rectangle', 'sunglasses', null, 'https://www.ezcontacts.com/product/sunglasses/1040288-1040292/prada-pr-06ys', 'Rectangular acetate frame with triangular facets.'),
  p('prada', 'PR 16YS', 'square', 'sunglasses', null, 'https://www.specscollective.com/products/prada-pr-16ys-sunglasses', 'Square acetate frame.'),
]

const tomford = [
  p('tomford', 'Snowdon (FT0237)', 'square', 'sunglasses', null, 'https://www.smartbuyglasses.com/designer-sunglasses/Tom-Ford/Tom-Ford-FT0237-SNOWDON-05B-159828.html', 'Thick square acetate frame; appeared in a James Bond film.'),
  p('tomford', 'Snowdon Optical (FT5178)', 'square', 'regular', null, 'https://www.ezcontactsusa.com/tom-ford-ft-5178-eyeglasses.html', 'Optical version of the Snowdon shape.'),
  p('tomford', 'Jameson (FT0752)', 'round', 'sunglasses', null, 'https://www.go-optic.com/tom-ford-ft0752-jameson-sunglasses-ft0752/p/289278', 'Round full-rim acetate frame.'),
  p('tomford', 'Leo (FT0336)', 'aviator', 'sunglasses', null, 'https://www.amazon.com/Tom-Ford-Authentic-Designer-Sunglasses/dp/B00FGS3HOC', 'Pilot-shaped metal-and-acetate frame.'),
  p('tomford', 'Anders (FT1363)', 'square', 'sunglasses', null, 'https://www.tomfordfashion.com/en-us/anders-sunglasses/FT1363.html', 'Square acetate frame.'),
  p('tomford', 'Marko (FT0144)', 'aviator', 'sunglasses', null, 'https://www.tomfordfashion.com', 'Narrow drop-lens frame worn in a James Bond film.'),
  p('tomford', 'Henry (FT0248)', 'square', 'sunglasses', null, 'https://www.tomfordfashion.com', 'Vintage-look trapezoid frame worn in a James Bond film.'),
  p('tomford', 'Cecilio-02 (FT0628)', 'geometric', 'sunglasses', 263, 'https://www.eyeons.com/tom-ford-ft0628-cecilio-02', 'Geometric acetate frame.'),
  p('tomford', 'Fausto (FT0711)', 'square', 'sunglasses', 269, 'https://www.framesdirect.com/tom-ford-ft0711-fausto-sunglasses', 'Square full-rim acetate frame.'),
  p('tomford', 'Dax (FT0751)', 'square', 'sunglasses', null, 'https://www.tomfordfashion.com', 'Square acetate frame.'),
  p('tomford', 'Alessio (FT0699)', 'square', 'sunglasses', null, 'https://us.glassesstation.com/designer-sunglasses/Tom-Ford/Alessio/FT0699-52V-57', 'Square acetate frame.'),
  p('tomford', 'Nico-02 (FT1062)', 'square', 'sunglasses', null, 'https://www.smartbuyglasses.com/designer-sunglasses/Tom-Ford/Tom-Ford-FT1062-NICO-02-01A-645609.html', 'Square plastic frame.'),
  p('tomford', 'Beatrix-02 (FT0613)', 'oversized', 'sunglasses', null, 'https://www.framesdirect.com/tom-ford-ft0613-beatrix-02-sunglasses', 'Oversized glamour frame.'),
  p('tomford', 'Farrah (FT0631)', 'aviator', 'sunglasses', null, 'https://www.tomfordfashion.com', 'Shield-shaped aviator with polarized lenses.'),
  p('tomford', 'Raoul (FT0753)', 'square', 'sunglasses', null, 'https://www.tomfordfashion.com/en-us/raoul-sunglasses/FT0753.html', 'Square acetate frame.'),
  p('tomford', 'Aristotle (FT1332)', 'square', 'sunglasses', null, 'https://www.tomfordfashion.com/en-us/aristotle-sunglasses/FT1332.html', 'Square acetate frame.'),
  p('tomford', 'Fernanda (FT1069)', 'cat-eye', 'sunglasses', null, 'https://www.tomfordfashion.com', 'Cat-eye acetate frame.'),
  p('tomford', 'Wallace (FT0870)', 'oversized', 'sunglasses', 400, 'https://www.amazon.com/Tom-Ford-WALLACE-FT-0870/dp/B095J4JL9P', 'Oversized glamour frame.'),
  p('tomford', 'Ryder-02 (FT1035)', 'aviator', 'sunglasses', null, 'https://www.ebay.com/itm/256871537833', 'Aviator-derived navigator frame.'),
  p('tomford', 'Amber-02 (FT0990)', 'cat-eye', 'sunglasses', null, 'https://www.amazon.com/Tom-Ford-Amber-02-Sunglasses-Guarantee/dp/B09ZC1S9D4', 'Cat-eye acetate frame.'),
]

const oliverpeoples = [
  p('oliverpeoples', 'Gregory Peck (OV5186)', 'round', 'regular', 214.5, 'https://www.oliverpeoples.com/en-us/products/0ov5186-1011', "Named for the actor's own glasses; a brand-defining shape."),
  p('oliverpeoples', 'Gregory Peck Sun (OV5217S)', 'round', 'sunglasses', null, 'https://www.oliverpeoples.com/en-us/products/0ov5217s-1483r8', 'Sun version of the Gregory Peck shape.'),
  p('oliverpeoples', "O'Malley (OV5183)", 'round', 'regular', 221, 'https://www.oliverpeoples.com', 'Created in 1988; later worn in American Psycho.'),
  p('oliverpeoples', 'Cary Grant (OV5413U)', 'square', 'regular', 132.56, 'https://www.oliverpeoples.com', "Named for the actor's style in North by Northwest."),
  p('oliverpeoples', 'Finley Vintage (OV5397U)', 'round', 'sunglasses', 263.25, 'https://www.oliverpeoples.com', 'Vintage-inspired round frame.'),
  p('oliverpeoples', 'Sheldrake (OV5036)', 'browline', 'regular', 221, 'https://www.oliverpeoples.com', 'Launched 2008; a nod to Andy Warhol.'),
  p('oliverpeoples', 'Roella', 'cat-eye', 'sunglasses', null, 'https://www.eurooptica.com/products/oliver-peoples-roella-sunglasses', 'Cat-eye acetate sunglasses.'),
  p('oliverpeoples', 'Casian', 'rectangle', 'sunglasses', null, 'https://www.eurooptica.com/products/oliver-peoples-casian-sunglasses', 'Oversized rectangular sunglasses.'),
  p('oliverpeoples', 'Riley Sun (OV5004SU)', 'round', 'sunglasses', null, 'https://www.oliverpeoples.com/en-us/products/0ov5004su-1005p1', 'Sun version of the Riley optical shape.'),
  p('oliverpeoples', 'Rosson Sun (OV5540SU)', 'square', 'sunglasses', null, 'https://www.amazon.com/Oliver-Peoples-Midnight-Express-Sunglasses/dp/B0CYQBC7YB', 'Square acetate-and-metal sunglasses.'),
  p('oliverpeoples', 'Kosa', 'round', 'sunglasses', null, 'https://www.thebs.com/en/kosa-black-sunglasses-oliver-peoples-116264', 'Round acetate-and-metal sunglasses with G-15 lenses.'),
  p('oliverpeoples', 'Nino Sun (OV5473SU)', 'square', 'sunglasses', null, 'https://www.oliverpeoples.com/usa/0OV5473SU--1005P2', 'Square sunglasses.'),
  p('oliverpeoples', 'OP-1955 (OV5185)', 'round', 'regular', null, 'https://www.oliverpeoples.com', 'Re-release from the Vintage Circa 1987 collection.'),
  p('oliverpeoples', 'Davri Sun (OV5510SU)', 'square', 'sunglasses', null, 'https://www.specscollective.com/products/oliver-peoples-davri-ov5510su-sunglasses', 'Square acetate sunglasses.'),
]

function p(brand, modelName, frameShape, type, price, productUrl, note) {
  return { brand, modelName, frameShape, type, price, image: null, productUrl, note }
}

const byBrand = { rayban, oakley, persol, warbyparker, gucci, prada, tomford, oliverpeoples }
const TARGET_PER_BRAND = 20

let total = 0
for (const [brand, list] of Object.entries(byBrand)) {
  total += list.length
  if (list.length < TARGET_PER_BRAND) {
    console.warn(
      `[products] ${brand}: only ${list.length}/${TARGET_PER_BRAND} verified real models found — ` +
        `NOT padded with invented data, per spec.`,
    )
  } else {
    console.log(`[products] ${brand}: ${list.length}/${TARGET_PER_BRAND} ✓`)
  }
}
console.log(`[products] total: ${total}`)

const all = Object.values(byBrand).flat()
const outPath = join(__dirname, '..', 'src', 'data', 'products.json')
writeFileSync(outPath, JSON.stringify(all, null, 2) + '\n')
console.log(`[products] wrote ${all.length} products to ${outPath}`)
