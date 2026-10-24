#!/usr/bin/env node
/* Regenerates everything derived from site/assets/templates.js:
   - the template gallery in site/index.html (between <!-- templates:start/end -->)
   - the template swatches in site/editor.html (same markers)
   - the tpl.*.desc captions and gallery filters in site/assets/i18n.js (7 languages)
   - the TEMPLATES / LEGACY_TEMPLATES constants in cloudflare/src/worker.js and server/server.js
   - site/assets/covers/plantillas.json
   Run:  node scripts/build-templates.mjs   (from INVITALIA/) */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const T = createRequire(import.meta.url)(path.join(root, 'site/assets/templates.js'));
const LANGS = ['es', 'en', 'it', 'pt', 'fr', 'de', 'ru'];

// ---------- captions (category: scene. palette.) ----------
const FILTERS = {
  es: { papel: 'Papelería', destinos: 'Destinos' },
  en: { papel: 'Stationery', destinos: 'Destinations' },
  it: { papel: 'Cartoleria', destinos: 'Destinazioni' },
  pt: { papel: 'Papelaria', destinos: 'Destinos' },
  fr: { papel: 'Papeterie', destinos: 'Destinations' },
  de: { papel: 'Papeterie', destinos: 'Reiseziele' },
  ru: { papel: 'Конверты', destinos: 'Путешествия' },
};
const DESC = {
  es: {
    felicidad: 'Clásico: paseo entre cipreses, piedra clara y luz de tarde. Marfil y oro.',
    anillos: 'Minimalista: acuarela de flores y el instante del anillo. Rosa pálido y verde agua.',
    viaje: 'Destino: descapotable por un camino de la Toscana al atardecer. Crema y dorado.',
    nuit: 'Clásico: beso al atardecer sobre el lago, velo y luz dorada. Marfil y azul suave.',
    jardin: 'Estilo italiano: portón de madera, arco de flores y colina con pueblo. Crema y verde.',
    oliva: 'Estilo italiano: olivos, arco de piedra y ramo blanco sobre verde profundo.',
    azur: 'Papelería: sobre de algodón con relieve floral y lacre marfil. Blanco sobre blanco.',
    sepia: 'Papelería: sobre con lacre burdeos, cinta de seda y flores secas. Tonos sepia.',
    burdeos: 'Old money: sobre burdeos con rosas grabadas y lacre a juego. Vino y oro.',
    rosal: 'Old money: sobre verde botella, rosas blancas y bandeja dorada. Verde y marfil.',
    belair: 'Papelería: papel de bordes rasgados, lacre marfil y cinta de lino. Crema y perla.',
    cisnes: 'Destino: lago en calma, cisnes y lacre azul cielo. Azul, blanco y bruma.',
    rubi: 'Papelería: tarjeta con lacre dorado, cinta rubí y flores prensadas. Marfil y granate.',
    mutuo: 'Old money: pareja bajo el arco y luz de ventana, velo largo. Blanco y negro.',
    salon: 'Papelería: sobre con sello de rosa, espejo dorado y flores blancas. Marfil y oro.',
    colores: 'Destino: pareja descalza en la orilla, mar y acantilado. Azul, arena y lino.',
    lettera: 'Minimalista: sobre grabado en relieve entre jazmines. Blanco puro y verde.',
    corazon: 'Clásico: risas sobre la hierba, flores blancas y encaje. Verde prado y marfil.',
    promesa: 'Minimalista: manos entrelazadas, anillo y seda. Crema y luz difusa.',
    sienna: 'Minimalista: manos unidas y vestido vaporoso. Blanco y negro luminoso.',
    editorial: 'Minimalista: el anillo sobre mármol claro y una flor blanca. Sereno y editorial.',
    alibi: 'Old money: seda marfil, ramo de rosas y manos sobre la piedra. Marfil y negro.',
    como: 'Destino: embarcadero, lago alpino y montañas. Azul, verde y madera.',
    provence: 'Destino: campo de lavanda al atardecer y velo al viento. Lila y oro.',
    maison: 'Old money: château de piedra, jardín francés y cola larga. Crema y verde.',
    noir: 'Destino: París, la torre Eiffel y un velo infinito. Blanco y negro.',
    riviera: 'Estilo italiano: terraza blanca sobre el mar, olivos y sol de la Riviera.',
    luna: 'Minimalista: encaje, perlas y luz suave. Blanco, rosa pálido y aire.',
    roma: 'Old money: terciopelo burdeos, peonías y manos entrelazadas.',
    ivory: 'Clásico: escalinata de villa, cipreses y un ramo blanco. Marfil y oro.',
    verona: 'Estilo italiano: velo al viento, colinas y cipreses. Verde de campo y marfil.',
    camelia: 'Estilo italiano: manos bajo el arco, flores blancas y la costa de Amalfi.',
    amalfi: 'Old money: terciopelo dorado, sombra cálida y un gesto íntimo. Oro y noche.',
  },
  en: {
    felicidad: 'Classic: a stroll between cypresses, pale stone and afternoon light. Ivory and gold.',
    anillos: 'Minimal: a floral watercolour and the moment of the ring. Pale pink and sea green.',
    viaje: 'Destination: a convertible on a Tuscan road at sunset. Cream and gold.',
    nuit: 'Classic: a sunset kiss above the lake, veil and golden light. Ivory and soft blue.',
    jardin: 'Italian style: a wooden gate, an arch of flowers and a hilltop village. Cream and green.',
    oliva: 'Italian style: olive trees, a stone arch and a white bouquet on deep green.',
    azur: 'Stationery: a cotton envelope with floral embossing and an ivory wax seal. White on white.',
    sepia: 'Stationery: an envelope with a burgundy seal, silk ribbon and dried flowers. Sepia tones.',
    burdeos: 'Old money: a burgundy envelope with engraved roses and a matching seal. Wine and gold.',
    rosal: 'Old money: a bottle-green envelope, white roses and a gilded tray. Green and ivory.',
    belair: 'Stationery: deckled paper, an ivory seal and a linen ribbon. Cream and pearl.',
    cisnes: 'Destination: a still lake, swans and a sky-blue seal. Blue, white and mist.',
    rubi: 'Stationery: a card with a gold seal, ruby ribbon and pressed flowers. Ivory and garnet.',
    mutuo: 'Old money: a couple under the arch in window light, a long veil. Black and white.',
    salon: 'Stationery: an envelope with a rose seal, a gilded mirror and white flowers. Ivory and gold.',
    colores: 'Destination: a barefoot couple at the shoreline, sea and cliffs. Blue, sand and linen.',
    lettera: 'Minimal: an embossed envelope among jasmine. Pure white and green.',
    corazon: 'Classic: laughter on the grass, white flowers and lace. Meadow green and ivory.',
    promesa: 'Minimal: intertwined hands, a ring and silk. Cream and diffused light.',
    sienna: 'Minimal: joined hands and a flowing dress. Luminous black and white.',
    editorial: 'Minimal: the ring on pale marble and a white flower. Serene and editorial.',
    alibi: 'Old money: ivory silk, a bouquet of roses and hands on stone. Ivory and black.',
    como: 'Destination: a pier, an alpine lake and mountains. Blue, green and wood.',
    provence: 'Destination: a lavender field at sunset and a veil in the wind. Lilac and gold.',
    maison: 'Old money: a stone château, a French garden and a long train. Cream and green.',
    noir: 'Destination: Paris, the Eiffel Tower and an endless veil. Black and white.',
    riviera: 'Italian style: a white terrace above the sea, olive trees and Riviera sun.',
    luna: 'Minimal: lace, pearls and soft light. White, pale pink and air.',
    roma: 'Old money: burgundy velvet, peonies and intertwined hands.',
    ivory: 'Classic: a villa staircase, cypresses and a white bouquet. Ivory and gold.',
    verona: 'Italian style: a veil in the wind, hills and cypresses. Field green and ivory.',
    camelia: 'Italian style: hands under the arch, white flowers and the Amalfi coast.',
    amalfi: 'Old money: golden velvet, warm shadow and an intimate gesture. Gold and night.',
  },
  it: {
    felicidad: 'Classico: passeggiata tra i cipressi, pietra chiara e luce del pomeriggio. Avorio e oro.',
    anillos: 'Minimal: acquerello di fiori e l’attimo dell’anello. Rosa pallido e verde acqua.',
    viaje: 'Destinazione: una decappottabile su una strada toscana al tramonto. Crema e oro.',
    nuit: 'Classico: bacio al tramonto sul lago, velo e luce dorata. Avorio e azzurro tenue.',
    jardin: 'Stile italiano: portone di legno, arco di fiori e borgo sulla collina. Crema e verde.',
    oliva: 'Stile italiano: ulivi, arco di pietra e bouquet bianco su verde profondo.',
    azur: 'Cartoleria: busta di cotone con rilievo floreale e ceralacca avorio. Bianco su bianco.',
    sepia: 'Cartoleria: busta con sigillo bordeaux, nastro di seta e fiori secchi. Toni seppia.',
    burdeos: 'Old money: busta bordeaux con rose incise e sigillo in tinta. Vino e oro.',
    rosal: 'Old money: busta verde bottiglia, rose bianche e vassoio dorato. Verde e avorio.',
    belair: 'Cartoleria: carta a bordi strappati, sigillo avorio e nastro di lino. Crema e perla.',
    cisnes: 'Destinazione: lago calmo, cigni e sigillo azzurro cielo. Blu, bianco e foschia.',
    rubi: 'Cartoleria: biglietto con sigillo dorato, nastro rubino e fiori pressati. Avorio e granato.',
    mutuo: 'Old money: coppia sotto l’arco nella luce della finestra, velo lungo. Bianco e nero.',
    salon: 'Cartoleria: busta con sigillo a rosa, specchio dorato e fiori bianchi. Avorio e oro.',
    colores: 'Destinazione: coppia a piedi nudi sulla riva, mare e scogliera. Blu, sabbia e lino.',
    lettera: 'Minimal: busta in rilievo tra i gelsomini. Bianco puro e verde.',
    corazon: 'Classico: risate sull’erba, fiori bianchi e pizzo. Verde prato e avorio.',
    promesa: 'Minimal: mani intrecciate, anello e seta. Crema e luce diffusa.',
    sienna: 'Minimal: mani unite e abito vaporoso. Bianco e nero luminoso.',
    editorial: 'Minimal: l’anello su marmo chiaro e un fiore bianco. Sereno ed editoriale.',
    alibi: 'Old money: seta avorio, bouquet di rose e mani sulla pietra. Avorio e nero.',
    como: 'Destinazione: pontile, lago alpino e montagne. Blu, verde e legno.',
    provence: 'Destinazione: campo di lavanda al tramonto e velo al vento. Lilla e oro.',
    maison: 'Old money: château di pietra, giardino alla francese e strascico lungo. Crema e verde.',
    noir: 'Destinazione: Parigi, la Tour Eiffel e un velo infinito. Bianco e nero.',
    riviera: 'Stile italiano: terrazza bianca sul mare, ulivi e sole della Riviera.',
    luna: 'Minimal: pizzo, perle e luce morbida. Bianco, rosa pallido e aria.',
    roma: 'Old money: velluto bordeaux, peonie e mani intrecciate.',
    ivory: 'Classico: scalinata di villa, cipressi e un bouquet bianco. Avorio e oro.',
    verona: 'Stile italiano: velo al vento, colline e cipressi. Verde campagna e avorio.',
    camelia: 'Stile italiano: mani sotto l’arco, fiori bianchi e la costiera amalfitana.',
    amalfi: 'Old money: velluto dorato, ombra calda e un gesto intimo. Oro e notte.',
  },
  pt: {
    felicidad: 'Clássico: passeio entre ciprestes, pedra clara e luz da tarde. Marfim e ouro.',
    anillos: 'Minimalista: aguarela de flores e o instante do anel. Rosa pálido e verde-água.',
    viaje: 'Destino: um descapotável numa estrada da Toscana ao pôr do sol. Creme e dourado.',
    nuit: 'Clássico: beijo ao pôr do sol sobre o lago, véu e luz dourada. Marfim e azul suave.',
    jardin: 'Estilo italiano: portão de madeira, arco de flores e aldeia na colina. Creme e verde.',
    oliva: 'Estilo italiano: oliveiras, arco de pedra e ramo branco sobre verde profundo.',
    azur: 'Papelaria: envelope de algodão com relevo floral e lacre marfim. Branco sobre branco.',
    sepia: 'Papelaria: envelope com lacre bordô, fita de seda e flores secas. Tons sépia.',
    burdeos: 'Old money: envelope bordô com rosas gravadas e lacre a condizer. Vinho e ouro.',
    rosal: 'Old money: envelope verde-garrafa, rosas brancas e bandeja dourada. Verde e marfim.',
    belair: 'Papelaria: papel de bordas rasgadas, lacre marfim e fita de linho. Creme e pérola.',
    cisnes: 'Destino: lago sereno, cisnes e lacre azul-céu. Azul, branco e bruma.',
    rubi: 'Papelaria: cartão com lacre dourado, fita rubi e flores prensadas. Marfim e granada.',
    mutuo: 'Old money: casal sob o arco na luz da janela, véu longo. Preto e branco.',
    salon: 'Papelaria: envelope com selo de rosa, espelho dourado e flores brancas. Marfim e ouro.',
    colores: 'Destino: casal descalço na orla, mar e falésia. Azul, areia e linho.',
    lettera: 'Minimalista: envelope em relevo entre jasmins. Branco puro e verde.',
    corazon: 'Clássico: risos sobre a relva, flores brancas e renda. Verde-prado e marfim.',
    promesa: 'Minimalista: mãos entrelaçadas, anel e seda. Creme e luz difusa.',
    sienna: 'Minimalista: mãos unidas e vestido vaporoso. Preto e branco luminoso.',
    editorial: 'Minimalista: o anel sobre mármore claro e uma flor branca. Sereno e editorial.',
    alibi: 'Old money: seda marfim, ramo de rosas e mãos sobre a pedra. Marfim e preto.',
    como: 'Destino: cais, lago alpino e montanhas. Azul, verde e madeira.',
    provence: 'Destino: campo de lavanda ao pôr do sol e véu ao vento. Lilás e ouro.',
    maison: 'Old money: château de pedra, jardim francês e cauda longa. Creme e verde.',
    noir: 'Destino: Paris, a Torre Eiffel e um véu infinito. Preto e branco.',
    riviera: 'Estilo italiano: terraço branco sobre o mar, oliveiras e sol da Riviera.',
    luna: 'Minimalista: renda, pérolas e luz suave. Branco, rosa pálido e ar.',
    roma: 'Old money: veludo bordô, peónias e mãos entrelaçadas.',
    ivory: 'Clássico: escadaria de villa, ciprestes e um ramo branco. Marfim e ouro.',
    verona: 'Estilo italiano: véu ao vento, colinas e ciprestes. Verde do campo e marfim.',
    camelia: 'Estilo italiano: mãos sob o arco, flores brancas e a costa de Amalfi.',
    amalfi: 'Old money: veludo dourado, sombra quente e um gesto íntimo. Ouro e noite.',
  },
  fr: {
    felicidad: 'Classique : promenade entre les cyprès, pierre claire et lumière d’après-midi. Ivoire et or.',
    anillos: 'Minimaliste : aquarelle florale et l’instant de la bague. Rose pâle et vert d’eau.',
    viaje: 'Destination : un cabriolet sur une route toscane au couchant. Crème et doré.',
    nuit: 'Classique : baiser au crépuscule au-dessus du lac, voile et lumière dorée. Ivoire et bleu doux.',
    jardin: 'Style italien : portail de bois, arche de fleurs et village sur la colline. Crème et vert.',
    oliva: 'Style italien : oliviers, arche de pierre et bouquet blanc sur vert profond.',
    azur: 'Papeterie : enveloppe en coton à gaufrage floral et cachet de cire ivoire. Blanc sur blanc.',
    sepia: 'Papeterie : enveloppe au cachet bordeaux, ruban de soie et fleurs séchées. Tons sépia.',
    burdeos: 'Old money : enveloppe bordeaux aux roses gravées et cachet assorti. Vin et or.',
    rosal: 'Old money : enveloppe vert bouteille, roses blanches et plateau doré. Vert et ivoire.',
    belair: 'Papeterie : papier aux bords déchirés, cachet ivoire et ruban de lin. Crème et perle.',
    cisnes: 'Destination : lac paisible, cygnes et cachet bleu ciel. Bleu, blanc et brume.',
    rubi: 'Papeterie : carte au cachet doré, ruban rubis et fleurs pressées. Ivoire et grenat.',
    mutuo: 'Old money : couple sous l’arche dans la lumière d’une fenêtre, long voile. Noir et blanc.',
    salon: 'Papeterie : enveloppe au sceau de rose, miroir doré et fleurs blanches. Ivoire et or.',
    colores: 'Destination : couple pieds nus au bord de l’eau, mer et falaise. Bleu, sable et lin.',
    lettera: 'Minimaliste : enveloppe gaufrée parmi les jasmins. Blanc pur et vert.',
    corazon: 'Classique : rires dans l’herbe, fleurs blanches et dentelle. Vert prairie et ivoire.',
    promesa: 'Minimaliste : mains entrelacées, bague et soie. Crème et lumière diffuse.',
    sienna: 'Minimaliste : mains unies et robe vaporeuse. Noir et blanc lumineux.',
    editorial: 'Minimaliste : la bague sur un marbre clair et une fleur blanche. Serein et éditorial.',
    alibi: 'Old money : soie ivoire, bouquet de roses et mains sur la pierre. Ivoire et noir.',
    como: 'Destination : ponton, lac alpin et montagnes. Bleu, vert et bois.',
    provence: 'Destination : champ de lavande au couchant et voile au vent. Lilas et or.',
    maison: 'Old money : château de pierre, jardin à la française et longue traîne. Crème et vert.',
    noir: 'Destination : Paris, la tour Eiffel et un voile infini. Noir et blanc.',
    riviera: 'Style italien : terrasse blanche au-dessus de la mer, oliviers et soleil de la Riviera.',
    luna: 'Minimaliste : dentelle, perles et lumière douce. Blanc, rose pâle et air.',
    roma: 'Old money : velours bordeaux, pivoines et mains entrelacées.',
    ivory: 'Classique : escalier de villa, cyprès et bouquet blanc. Ivoire et or.',
    verona: 'Style italien : voile au vent, collines et cyprès. Vert des champs et ivoire.',
    camelia: 'Style italien : mains sous l’arche, fleurs blanches et la côte amalfitaine.',
    amalfi: 'Old money : velours doré, ombre chaude et un geste intime. Or et nuit.',
  },
  de: {
    felicidad: 'Klassisch: Spaziergang zwischen Zypressen, heller Stein und Nachmittagslicht. Elfenbein und Gold.',
    anillos: 'Minimalistisch: Blumenaquarell und der Moment des Rings. Zartrosa und Seegrün.',
    viaje: 'Reiseziel: ein Cabrio auf einer toskanischen Straße bei Sonnenuntergang. Creme und Gold.',
    nuit: 'Klassisch: Kuss im Abendlicht über dem See, Schleier und goldenes Licht. Elfenbein und zartes Blau.',
    jardin: 'Italienischer Stil: Holztor, Blütenbogen und Dorf auf dem Hügel. Creme und Grün.',
    oliva: 'Italienischer Stil: Olivenbäume, Steinbogen und weißer Strauß auf tiefem Grün.',
    azur: 'Papeterie: Baumwollumschlag mit Blütenprägung und elfenbeinfarbenem Siegel. Weiß auf Weiß.',
    sepia: 'Papeterie: Umschlag mit bordeauxrotem Siegel, Seidenband und Trockenblumen. Sepiatöne.',
    burdeos: 'Old money: bordeauxroter Umschlag mit gravierten Rosen und passendem Siegel. Wein und Gold.',
    rosal: 'Old money: flaschengrüner Umschlag, weiße Rosen und vergoldetes Tablett. Grün und Elfenbein.',
    belair: 'Papeterie: Büttenpapier, elfenbeinfarbenes Siegel und Leinenband. Creme und Perle.',
    cisnes: 'Reiseziel: stiller See, Schwäne und himmelblaues Siegel. Blau, Weiß und Dunst.',
    rubi: 'Papeterie: Karte mit goldenem Siegel, Rubinband und gepressten Blüten. Elfenbein und Granat.',
    mutuo: 'Old money: Paar unter dem Bogen im Fensterlicht, langer Schleier. Schwarz-Weiß.',
    salon: 'Papeterie: Umschlag mit Rosensiegel, goldener Spiegel und weiße Blüten. Elfenbein und Gold.',
    colores: 'Reiseziel: barfuß am Ufer, Meer und Klippen. Blau, Sand und Leinen.',
    lettera: 'Minimalistisch: geprägter Umschlag zwischen Jasmin. Reinweiß und Grün.',
    corazon: 'Klassisch: Lachen im Gras, weiße Blüten und Spitze. Wiesengrün und Elfenbein.',
    promesa: 'Minimalistisch: verschlungene Hände, Ring und Seide. Creme und weiches Licht.',
    sienna: 'Minimalistisch: vereinte Hände und fließendes Kleid. Leuchtendes Schwarz-Weiß.',
    editorial: 'Minimalistisch: der Ring auf hellem Marmor und eine weiße Blüte. Ruhig und editorial.',
    alibi: 'Old money: elfenbeinfarbene Seide, Rosenstrauß und Hände auf Stein. Elfenbein und Schwarz.',
    como: 'Reiseziel: Steg, Bergsee und Berge. Blau, Grün und Holz.',
    provence: 'Reiseziel: Lavendelfeld bei Sonnenuntergang und Schleier im Wind. Flieder und Gold.',
    maison: 'Old money: steinernes Château, französischer Garten und lange Schleppe. Creme und Grün.',
    noir: 'Reiseziel: Paris, der Eiffelturm und ein endloser Schleier. Schwarz-Weiß.',
    riviera: 'Italienischer Stil: weiße Terrasse über dem Meer, Olivenbäume und Riviera-Sonne.',
    luna: 'Minimalistisch: Spitze, Perlen und weiches Licht. Weiß, Zartrosa und Luft.',
    roma: 'Old money: bordeauxroter Samt, Pfingstrosen und verschlungene Hände.',
    ivory: 'Klassisch: Villentreppe, Zypressen und ein weißer Strauß. Elfenbein und Gold.',
    verona: 'Italienischer Stil: Schleier im Wind, Hügel und Zypressen. Feldgrün und Elfenbein.',
    camelia: 'Italienischer Stil: Hände unter dem Bogen, weiße Blüten und die Amalfiküste.',
    amalfi: 'Old money: goldener Samt, warmer Schatten und eine intime Geste. Gold und Nacht.',
  },
  ru: {
    felicidad: 'Классика: прогулка среди кипарисов, светлый камень и вечерний свет. Слоновая кость и золото.',
    anillos: 'Минимализм: цветочная акварель и мгновение с кольцом. Бледно-розовый и морская зелень.',
    viaje: 'Путешествие: кабриолет на тосканской дороге на закате. Кремовый и золотой.',
    nuit: 'Классика: поцелуй на закате над озером, фата и золотой свет. Слоновая кость и нежно-голубой.',
    jardin: 'Итальянский стиль: деревянные ворота, арка из цветов и городок на холме. Кремовый и зелёный.',
    oliva: 'Итальянский стиль: оливы, каменная арка и белый букет на глубоком зелёном.',
    azur: 'Конверты: хлопковый конверт с цветочным тиснением и печатью цвета слоновой кости. Белое на белом.',
    sepia: 'Конверты: конверт с бордовой печатью, шёлковой лентой и сухоцветами. Тона сепии.',
    burdeos: 'Old money: бордовый конверт с гравировкой роз и печатью в тон. Вино и золото.',
    rosal: 'Old money: бутылочно-зелёный конверт, белые розы и золочёный поднос. Зелёный и слоновая кость.',
    belair: 'Конверты: бумага с рваными краями, печать слоновой кости и льняная лента. Кремовый и жемчуг.',
    cisnes: 'Путешествие: тихое озеро, лебеди и небесно-голубая печать. Голубой, белый и дымка.',
    rubi: 'Конверты: карточка с золотой печатью, рубиновой лентой и гербарием. Слоновая кость и гранат.',
    mutuo: 'Old money: пара под аркой в свете окна, длинная фата. Чёрно-белый.',
    salon: 'Конверты: конверт с печатью-розой, золочёное зеркало и белые цветы. Слоновая кость и золото.',
    colores: 'Путешествие: пара босиком у кромки воды, море и скалы. Голубой, песок и лён.',
    lettera: 'Минимализм: конверт с тиснением среди жасмина. Чистый белый и зелёный.',
    corazon: 'Классика: смех на траве, белые цветы и кружево. Луговая зелень и слоновая кость.',
    promesa: 'Минимализм: переплетённые руки, кольцо и шёлк. Кремовый и рассеянный свет.',
    sienna: 'Минимализм: руки в руках и воздушное платье. Светлый чёрно-белый.',
    editorial: 'Минимализм: кольцо на светлом мраморе и белый цветок. Спокойно и журнально.',
    alibi: 'Old money: шёлк цвета слоновой кости, букет роз и руки на камне. Слоновая кость и чёрный.',
    como: 'Путешествие: пирс, альпийское озеро и горы. Синий, зелёный и дерево.',
    provence: 'Путешествие: лавандовое поле на закате и фата на ветру. Сиреневый и золото.',
    maison: 'Old money: каменный замок, французский сад и длинный шлейф. Кремовый и зелёный.',
    noir: 'Путешествие: Париж, Эйфелева башня и бесконечная фата. Чёрно-белый.',
    riviera: 'Итальянский стиль: белая терраса над морем, оливы и солнце Ривьеры.',
    luna: 'Минимализм: кружево, жемчуг и мягкий свет. Белый, бледно-розовый и воздух.',
    roma: 'Old money: бордовый бархат, пионы и переплетённые руки.',
    ivory: 'Классика: лестница виллы, кипарисы и белый букет. Слоновая кость и золото.',
    verona: 'Итальянский стиль: фата на ветру, холмы и кипарисы. Полевая зелень и слоновая кость.',
    camelia: 'Итальянский стиль: руки под аркой, белые цветы и побережье Амальфи.',
    amalfi: 'Old money: золотой бархат, тёплая тень и нежный жест. Золото и ночь.',
  },
};

for (const lang of LANGS) for (const t of T.list) if (!DESC[lang][t.id]) throw new Error(`missing caption ${lang}/${t.id}`);
const q = s => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

function between(file, start, end, body) {
  const p = path.join(root, file); const src = readFileSync(p, 'utf8');
  const a = src.indexOf(start), b = src.indexOf(end);
  if (a < 0 || b < 0 || b < a) throw new Error(`markers not found in ${file}`);
  writeFileSync(p, src.slice(0, a + start.length) + '\n' + body + '\n' + src.slice(b));
}
function replaceAll(file, pairs) {
  const p = path.join(root, file); let src = readFileSync(p, 'utf8');
  for (const [re, rep] of pairs) { if (!re.test(src)) throw new Error(`pattern ${re} not found in ${file}`); src = src.replace(re, rep); }
  writeFileSync(p, src);
}

// index.html gallery
between('site/index.html', '<!-- templates:start -->', '      <!-- templates:end -->', T.list.map(t =>
  `      <article class="tpl" data-cat="${t.cat}"><a href="editor.html?template=${t.id}" style="text-decoration:none;color:inherit"><img class="card-img" src="${t.cover}" alt="${esc(t.name)}" width="1024" height="1536" loading="lazy"></a><h3>${esc(t.name)}</h3><p data-i18n="tpl.${t.id}.desc">${esc(DESC.es[t.id])}</p></article>`).join('\n'));

// editor.html swatches
between('site/editor.html', '<!-- templates:start -->', '          <!-- templates:end -->', T.list.map(t =>
  `          <label class="sw" data-cat="${t.cat}"><input type="radio" name="template" value="${t.id}"${t.id === T.default ? ' checked' : ''}><span class="box"><img src="${t.mini}" alt="" width="320" height="480" loading="lazy"></span><small>${esc(t.name)}</small></label>`).join('\n'));

// i18n.js: one caption line + two filter labels per language, in LANGS order
{
  const p = path.join(root, 'site/assets/i18n.js'); let src = readFileSync(p, 'utf8');
  let i = 0;
  src = src.replace(/^(\s*)'tpl\.[a-z]+\.desc':.*$/gm, (m, ind) => { const lang = LANGS[i++]; return ind + T.list.map(t => `'tpl.${t.id}.desc': ${q(DESC[lang][t.id])}`).join(', ') + ','; });
  if (i !== LANGS.length) throw new Error(`expected ${LANGS.length} caption lines in i18n.js, found ${i}`);
  i = 0;
  src = src.replace(/'tpl\.filter\.other': '[^']*'|'tpl\.filter\.papel': '[^']*', 'tpl\.filter\.destinos': '[^']*'/g, () => { const f = FILTERS[LANGS[i++]]; return `'tpl.filter.papel': ${q(f.papel)}, 'tpl.filter.destinos': ${q(f.destinos)}`; });
  if (i !== LANGS.length) throw new Error(`expected ${LANGS.length} filter lines in i18n.js, found ${i}`);
  writeFileSync(p, src);
}

// server-side template validation (worker + node server)
const idsLit = `[${T.ids.map(q).join(', ')}]`;
const legacyLit = `{ ${Object.entries(T.legacy).map(([k, v]) => `${k}: ${q(v)}`).join(', ')} }`;
for (const f of ['cloudflare/src/worker.js', 'server/server.js']) replaceAll(f, [
  [/const TEMPLATES = \[[^\]]*\];/, `const TEMPLATES = ${idsLit};`],
  [/const LEGACY_TEMPLATES = \{[^}]*\};/, `const LEGACY_TEMPLATES = ${legacyLit};`],
  [/const DEFAULT_TEMPLATE = '[a-z]+';/, `const DEFAULT_TEMPLATE = ${q(T.default)};`],
]);

// catalogue file next to the photos
writeFileSync(path.join(root, 'site/assets/covers/plantillas.json'), JSON.stringify(T.list.map(t => ({ id: t.id, name: t.name, category: t.cat, theme: t.theme, cover: t.cover, mini: t.mini })), null, 2) + '\n');

console.log(`templates: ${T.list.length} entries, ${LANGS.length} languages written.`);
