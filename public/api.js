// INAT API

export const getInatObservations = async ({
      user_key = 'user_id'
    , user_id = null
    , place_key = 'place_id'
    , place_id = null
    , iconic_taxa
    , per_page = 20
    , page = 1
    , locale = 'en'
    , species_count = false
    , d1
    , d2
}) => {
    
    let params = ''

    params = user_id ? params + `&${user_key}=${user_id}` : params
    params = place_id ? params + `&${place_key}=${place_id}` : params
    params = iconic_taxa ? params + `&iconic_taxa=${iconic_taxa.map(taxon => taxon.name).join(',')}` : params
    params = params + `&page=${page}&per_page=${per_page}`
    params = params + `&locale=${locale}`
    params = params + `&d1=${d1}`
    params = params + `&d2=${d2}`
    
    const base = species_count
        ? 'https://api.inaturalist.org/v1/observations/species_counts'
        : 'https://api.inaturalist.org/v1/observations'
    const url = `${base}?order=desc&photos=true` + params

    const response = await fetch(url)
    const json = await response.json()
    const observations = await json.results
    return await observations
}

export const getByAutocomplete = async ({by, toComplete}) => {
    const url = `https://api.inaturalist.org/v1/${by}/autocomplete?q=${toComplete}&per_page=10`
    const response = await fetch(url)
    const json = await response.json()
    return json
}

export const getInatTaxa = async({ 
    taxaIds 
  , locale = 'en'
  , rank = 'species'
}) => {
    const url = `https://api.inaturalist.org/v1/taxa?order=desc&order_by=observations_count&rank=${rank}&locale=${locale}&taxon_id=` + taxaIds.join('%2C')
    const response = await fetch(url)
    const json = await response.json()
    return json
}

// HARD-CODED DATA

export const snapSpeciesTraits = [
    {
        "behaviour": {
            "value": [
                "migratory"
            ]
        },
        "caterpillar colour": {
            "unit": "colour",
            "value": [
                "white",
                " black"
            ]
        },
        "caterpillar length": {
            "unit": "cm",
            "value": [
                "2.5"
            ]
        },
        "description": {
            "value": [
                "A medium-sized butterfly with black wings, orange to red bands, and white spots. It has a wingspan of about 5cm. \n\nTypically found in moist woodlands, the red admiral caterpillar's primary host plant is the stinging nettle (Urtica dioica); it can also be found on the false nettle (Boehmeria cylindrica). \n\nThe adult butterfly drinks from flowering plants (inc. Buddleia, blackthorn, crab apple, hawthorn, dogwood, bramble, ivy blossom, and wild cherry) and overripe fruit. \n\nThey roost head-downwards on the trunks or lower branches of oaks, larches and other trees, where the bark-like underside of the wings provides them with excellent camouflage. Male red admirals are highly territorial."
            ]
        },
        "food": {
            "value": [
                "Buddleia",
                "Rotten fruit"
            ]
        },
        "habitat": {
            "type": "commensalism",
            "value": [
                "hedera",
                "woodland"
            ]
        },
        "hibernating stage": {
            "value": [
                "adult"
            ]
        },
        "name": "Vanessa atalanta",
        "relationships": [{
            "description": "Red admirals will lay a dozen or so eggs a sizeable patch of nettles (Urtica dioica), one per leaf.",
            "symbiont": {
                "name": "Urtica dioica",
                "role": "Food source"
            },
            "type": "Predator",
            "value": [
                "Predation"
            ]
        }],
        "wing span": {
            "unit": "cm",
            "value": [
                "5.6",
                "6.2"
            ]
        },
    },
    {
        "cap height": {
        "unit": "cm",
        "value": [
            "3-8"
        ]
        },
        "cap shape": {
        "value": [
            "Conical",
            "Ovate"
        ]
        },
        "characteristic": {
        "value": [
            "Polymorphic"
        ]
        },
        "description": {
        "value": [
            "Ridges darken with maturity. The pits and ridges are primarily vertically oriented.\n\nThe cap that is attached to the stem with a small but noticeable groove.\n\nIt may be both saprobic and mycorrhizal at different points in its life cycle. \n\nIt grows alone, or scattered, or gregariously under hardwoods, including white ash, green ash, and tulip tree. \n\nFound late winter to early spring. It is widely distributed east of the Rocky Mountains."
        ]
        },
        "gill attachment": {
        "value": [
            "Decurrent"
        ]
        },
        "how edible": {
        "value": [
            "Choice"
        ]
        },
        "name": "Morchella angusticeps",
        "tree ecology": {
        "value": [
            "Hardwoods"
        ]
        }
    },
    {
        "cap colour": {
          "value": [
            "Orange",
            "Yellow"
          ]
        },
        "cap diameter": {
          "unit": "cm",
          "value": [
            "2-9"
          ]
        },
        "cap shape": {
          "value": [
            "Infundibuliform"
          ]
        },
        "cap texture": {
          "value": [
            "Tomentose"
          ]
        },
        "description": {
          "value": [
            "An ectomycorrhizal species of edible fungus in the mushroom family Cantharellaceae.\n\nThe fruit bodies of the fungus are brightly coloured yellow-orange, usually highly conspicuous against the soil. \n\nAt maturity, the mushroom resembles a filled funnel with the spore-bearing surface along the sloping outer sides. The texture of the fertile undersurface (hymenium) of the caps is a distinguishing characteristic: much smoother than the well-known golden chanterelle."
          ]
        },
        "ecological type": {
          "value": [
            "Mycorrhizal"
          ]
        },
        "gill attachment": {
          "value": [
            "Decurrent"
          ]
        },
        "gill colour": {
          "value": [
            "Pale yellow"
          ]
        },
        "how edible": {
          "value": [
            "Edible"
          ]
        },
        "hymenium type": {
          "value": [
            "Ridges"
          ]
        },
        "name": "Cantharellus lateritius",
        "spore print colour": {
          "value": [
            "Cream",
            "Mycorrhizal"
          ]
        },
        "stem height": {
          "unit": "cm",
          "value": [
            ".5-1.7"
          ]
        },
        "stipe character": {
          "value": [
            "Bare"
          ]
        }
    },
    {
        "cap shape": {
          "value": [
            "N/a"
          ]
        },
        "description": {
          "value": [
            "The fruiting body is 8–16cm across, consisting of one, unbranched clump of 1-5cm long, soft spines hanging from a tough, hidden base that is attached to the tree. The spines are white, ageing to brown-yellow.\n\nThe species is saprobic and parasitic, usually growing alone or in pairs and fruiting from the wounds of living hardwoods (especially oaks) in late summer and autumn, and over winter and spring in warmer climates.\n\n"
          ]
        },
        "ecological type": {
          "value": [
            "parasitic"
          ]
        },
        "ecology": {
          "value": [
            "hardwoods",
            " trunks",
            " dead wood"
          ]
        },
        "flesh": {
          "unit": "colour",
          "value": [
            "white"
          ]
        },
        "gill attachment": {
          "value": [
            "N/a"
          ]
        },
        "how edible": {
          "value": [
            "choice"
          ]
        },
        "hymenium type": {
          "value": [
            "teeth"
          ]
        },
        "name": "Hericium erinaceus",
        "spore print colour": {
          "unit": "colour",
          "value": [
            "white"
          ]
        },
        "stipe character": {
          "value": [
            "n/a"
          ]
        },
        "symbionts": {
          "value": [
            "Fagus",
            "Turkey oak"
          ]
        }
    },
    {
        "cap colour": {
          "value": [
            "White",
            "Grey",
            "Grey-brown",
            "Tan",
            "Dark brown"
          ]
        },
        "cap shape": {
          "value": [
            "offset"
          ]
        },
        "cap width": {
          "unit": "cm",
          "value": [
            "5-25"
          ]
        },
        "collective": {
          "value": [
            "White"
          ]
        },
        "description": {
          "value": [
            "The oyster mushroom is widespread in many temperate and subtropical forests. It is saprotrophic, mainly on deciduous trees, beech trees in particular. It appears not to be parasitic i.e. only acts on dead wood and dying trees.\n\nThe mushroom has a broad, fan or oyster-shaped cap spanning 5–25cm.\n\nThe cap is white to grey or tan to dark-brown; the flesh is white, firm, and varies in thickness due to stipe arrangement. The gills of the mushroom are white to cream, and descend on the stalk if present. If so, the stipe is off-centre with a lateral attachment to wood. The spore print of the mushroom is white to lilac-grey. \n\nThe cap margin is inrolled when young, and is smooth and often somewhat lobed or wavy (undulate). The mushroom's stipe is often absent. When present, it is short and thick (the Latin pleurotus - sideways - refers to the sideways growth of the stem with respect to the cap).\n\nIts mycelia can kill and digest nematodes, which is believed to be a way in which the mushroom obtains nitrogen. The oyster mushroom is one of the few known carnivorous mushrooms.\n"
          ]
        },
        "ecological type": {
          "value": [
            "saprotrophic"
          ]
        },
        "ecology": {
          "value": [
            "mixed woodland"
          ]
        },
        "flesh": {
          "unit": "colour",
          "value": [
            "white",
            " tough in stem"
          ]
        },
        "gill attachment": {
          "value": [
            "Decurrent"
          ]
        },
        "grouping": {
          "value": [
            "large clusters"
          ]
        },
        "how edible": {
          "value": [
            "choice"
          ]
        },
        "hymenium type": {
          "value": [
            "gills"
          ]
        },
        "look-alikes": {
          "value": []
        },
        "name": "Pleurotus ostreatus",
        "role": {
          "value": [
            "Mycoremediation"
          ]
        },
        "smell": {
          "unit": "odour",
          "value": [
            "mushroomy"
          ]
        },
        "spore print colour": {
          "value": [
            "white",
            " lilac"
          ]
        },
        "stipe character": {
          "value": [
            "bare"
          ]
        },
        "symbionts": {
          "value": [
            "Dead wood",
            "Fagus",
            "Deciduous",
            "Nematode"
          ]
        },
        "symbiosis": {
          "value": [
            "Predation"
          ]
        }
    },
    {
        "cap shape": {
          "value": [
            "Infundibuliform"
          ]
        },
        "description": {
          "value": [
            "Mycorrhizal with oaks, and possibly other hardwoods, spring to autumn and widely distributed east of the Rocky Mountains.\n\nVase-shaped fruiting body with fine scaly, grey-black upper surface and smooth or shallowly wrinkled outer surface;  initially black but develops yellow-orange shades as the spores mature.\n\nRecently established as a species distinct from Craterellus cornucopioides."
          ]
        },
        "ecological type": {
          "value": [
            "Saprotrophic"
          ]
        },
        "fruit height": {
          "unit": "cm",
          "value": [
            "3-9"
          ]
        },
        "fruit width": {
          "unit": "cm",
          "value": [
            "1-5"
          ]
        },
        "gill attachment": {
          "value": [
            "Decurrent"
          ]
        },
        "how edible": {
          "value": [
            "Edible"
          ]
        },
        "hymenium type": {
          "value": [
            "Ridges"
          ]
        },
        "name": "Craterellus fallax",
        "spore print colour": {
          "value": [
            "Orange-yellow"
          ]
        },
        "stipe character": {
          "value": [
            "Bare"
          ]
        }
    },
    {
        "cap colour": {
          "value": [
            "sulpur yellow",
            " fading"
          ]
        },
        "cap shape": {
          "value": [
            "flat"
          ]
        },
        "cap texture": {
          "value": [
            "Smooth"
          ]
        },
        "description": {
          "value": [
            "The fruiting body emerges directly from the trunk of a tree and is initially knob-shaped, but soon expands to fan-shaped shelves, typically growing in overlapping tiers. \n\nIt is sulphur-yellow to bright orange in colour, fading to tan or white. Soft when young, toughening with age. \n\nThe shelves are 5-60cm across and up to 4cm thick. The fertile surface is sulphur-yellow with small pores or tubes and produces a white spore print. \n\nWhen fresh, the flesh is succulent with a strong fungal aroma and exudes a yellow, transparent juice, but quickly becomes dry and brittle.\n\nParasitic and saprobic on living and dead oaks."
          ]
        },
        "ecological type": {
          "value": [
            "saprotrophic",
            " parasitic"
          ]
        },
        "ecology": {
          "value": [
            "dead wood",
            " hardwoods",
            " trunks",
            " stumps"
          ]
        },
        "flesh": {
          "unit": "colour",
          "value": [
            "yellow",
            " orange",
            " white"
          ]
        },
        "gill attachment": {
          "value": [
            "N/a"
          ]
        },
        "grouping": {
          "value": [
            "large groups"
          ]
        },
        "how edible": {
          "value": [
            "choice"
          ]
        },
        "hymenium type": {
          "value": [
            "pores"
          ]
        },
        "lookalikes": [
          {
            "description": "The pore surface is bright yellow. Grows in shelves at the base of the tree. Favours oaks.",
            "lookalike": {
              "description": "The pore surface is cream/white. Grows away from the tree in a rosette of individual caps. Favours oaks.",
              "name": "Laetiporus cincinnatus"
            }
          },
          {
            "description": "The pore surface is bright yellow. Grows in shelves at the base of the tree. Favours oaks.",
            "lookalike": {
              "description": "Commonly attached to dead logs or stumps at one point with a thick stem. Body can be yellow to brown with squamules (scales) on its upper side. On the underside are pores characteristic of the genus Cerioporus; made up of tubes packed closely together.",
              "name": "Polyporus squamosus"
            }
          }
        ],
        "name": "Laetiporus sulphureus",
        "role": {
          "value": [
            "Carbon dioxide production",
            "Nutrient cycling",
            "Bioindicator"
          ]
        },
        "shelf thickness": {
          "unit": "cm",
          "value": [
            "0.5-4"
          ]
        },
        "shelf width": {
          "unit": "cm",
          "value": [
            "5-60"
          ]
        },
        "spore print colour": {
          "value": [
            "white",
            "White"
          ]
        },
        "stipe character": {
          "value": [
            "N/a"
          ]
        },
        "symbionts": {
          "value": [
            "Fagus",
            "Quercus",
            "Prunus",
            "Salix",
            "Robinia",
            "Eucalyptus",
            "Ceratonia",
            "Yew"
          ]
        }
    }
]

export const templates = [
  {
      id: 'species-card-test-template',
      name: 'Species-card-tests',
      parent: 'grid-template',
      pairedTemplateId: 'species-card-template',
      isTest: true,
      targets: [
        {
            id: 'common',
            name: 'common name',
        },
        {
            id: 'latin',
            name: 'latin name',
        },
      ],
      score: 0,
      scores: [],
  },
  {
      id: 'species-card-template',
      name: 'Species-cards',
      parent: 'grid-template',
      pairedTemplateId: 'species-card-test-template',
      isTest: false,
      isTestable: true,
  },
  {
    id: 'species-list-template',
    name: 'Species-list',
    parent: 'grid-template',
    isTest: false,
},
]

const terms = [
  {
    dt: 'Serotiny',
    dd: 'Remaining on a tree after maturity and opening to release seeds only after exposure to certain conditions, especially heat from a fire. Used of the cones of gymnosperms.',
    ds: 'https://en.wikipedia.org/wiki/Serotiny',
    da: 'Wikipedia',
  },
  {
    dt: 'Secondary succession',
    dd: 'A process started by an event (e.g. forest fire, harvesting, hurricane, etc.) that reduces an already established ecosystem (e.g. a forest or a wheat field) to a smaller population of species.',
    ds: 'https://en.wikipedia.org/wiki/Secondary_succession',
    da: 'Wikipedia',
  },
  {
    dt: 'Ecological succession',
    dd: 'The process of change in the species that make up an ecological community over time. Primary succession is the initial state of a new habitat.',
    ds: 'https://en.wikipedia.org/wiki/Ecological_succession',
    da: 'Wikipedia',
  },
  {
    dt: 'Maquis',
    dd: 'A shrubland biome in the Mediterranean region, typically consisting of densely growing evergreen shrubs.',
    ds: 'https://en.wikipedia.org/wiki/Maquis_shrubland',
    da: 'Wikipedia',
  },
  {
    dt: 'Garrigue',
    dd: 'A type of low scrubland ecoregion and plant community in the Mediterranean forests, woodlands, and scrub biome.',
    ds: 'https://en.wikipedia.org/wiki/Garrigue',
    da: 'Wikipedia',
  },
  {
    dt: 'Sclerophyll',
    dd: 'A type of vegetation that is adapted to long periods of dryness and heat. The plants feature hard leaves, short internodes (the distance between leaves along the stem) and leaf orientation which is parallel or oblique to direct sunlight.',
    ds: 'https://en.wikipedia.org/wiki/Sclerophyll',
    da: 'Wikipedia',
    dx: ['Quercus ilex', 'Myrtus communis', 'Arbutus unedo', 'Olea europaea', 'Laurus nobilis', 'Phillyrea latifolia', 'Rhamnus alaternus']
  },
  {
    dt: 'Marcescence',
    dd: 'The withering and persistence of plant organs that normally are shed, and is a term most commonly applied to plant leaves.',
    ds: 'https://en.wikipedia.org/wiki/Marcescence',
    da: 'Wikipedia',
    dx: ['Quercus', 'Fagus']
  },
  {
    dt: 'Therophytes',
    dd: 'These are annual plants that complete their lives rapidly in favorable conditions and survive the unfavorable cold or dry season in the form of seeds.',
    da: 'Wikipedia',
    ds: 'https://en.wikipedia.org//wiki/Raunki%C3%A6r_plant_life-form#Therophytes',
  },
  {
    dt: 'Xerothermic',
    dd: 'Adapted to or flourishing in an environment that is both dry and hot.',
  },
  {
    dt: 'Ruderal species',
    dd: 'A plant species that is first to colonize disturbed lands. The disturbance may be natural – for example, wildfires or avalanches – or the consequences of human activities.',
    ds: 'https://en.wikipedia.org/wiki/Ruderal_species',
    da: 'Wikipedia',
  },
  {
    dt: 'Synanthrope',
    dd: 'An organism that lives near and benefits from humans and their environmental modifications.',
    ds: 'https://en.wikipedia.org/wiki/Synanthrope',
    da: 'Wikipedia',
  },
  {
    dt: 'Phytophagous Insects',
    dd: 'Species that attack roots, stems, leaves, flowers, and fruits, either as larvae or as adults or in both stages. Phytophagous insects are highly diverse and the total species number is at least 500,000.',
    ds: 'https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/phytophagous-insects',
    da: 'ScienceDirect'
  },
  {
    dt: 'Limestone',
    dd: 'Calcium carbonate CaCO3 is a type of carbonate sedimentary rock. Limestone forms when these minerals precipitate out of water containing dissolved calcium, principally through the accumulation of corals and shells in the sea over the past 540 million years.',
    ds: 'https://en.wikipedia.org/wiki/Limestone',
    da: 'Wikipedia'
  },
  {
    dt: 'Convergent evolution',
    dd: 'The independent evolution of similar features in species of different periods or epochs in time.',
    ds: 'https://en.wikipedia.org//wiki/Convergent_evolution',
    da: 'Wikipedia'
  },
  {
    dt: 'Orthent',
    dd: 'Soils that lack horizon development due to either steep slopes or parent materials that contain no permanent weatherable minerals (such as ironstone). Typically, orthents are exceedingly shallow soils. They are often referred to as skeletal soils (USDA - entisols, UN FAO soil classification - lithosols).',
    ds: 'https://en.wikipedia.org/wiki/Orthent',
    da: 'Wikipedia'
  },
  {
    dt: 'Conifer',
    dd: 'A group of cone-bearing seed plants.',
    ds: 'https://en.wikipedia.org/wiki/Conifer',
    da: 'Wikipedia',
    dx: ['cedars', 'cypresses', 'firs', 'junipers', 'kauri', 'larches', 'pines', 'hemlocks', 'redwoods', 'spruces', 'yews'],
  },
  {
    dt: 'Mesozoic',
    dd: 'The second-to-last era of Earth\'s geological history, lasting from about 252 to 66 million years ago, comprising the Triassic, Jurassic and Cretaceous Periods.',
    ds: 'https://en.wikipedia.org/wiki/Mesozoic',
    da: 'Wikipedia',
  },
  {
    dt: 'Solstice',
    dd: 'A solstice is an event that occurs when the Sun appears to reach its most northerly or southerly excursion relative to the celestial equator on the celestial sphere.',
    ds: 'https://en.wikipedia.org/wiki/Solstice',
    da: 'Wikipedia',
  },
  {
    dt: 'Subsolar point',
    dd: 'The subsolar point on a planet is the point at which its Sun is perceived to be directly overhead (at the zenith); that is, where the Su\'s rays strike the planet exactly perpendicular to its surface.',
    ds: 'https://en.wikipedia.org/wiki/Subsolar_point',
    da: 'Wikipedia',
  },
  {
    dt: 'Tropic of Cancer (Northern Tropic)',
    dd: 'The most northerly circle of latitude on Earth at which the Sun can be directly overhead. This occurs on the June solstice, when the Northern Hemisphere is tilted toward the Sun to its maximum extent.',
    ds: 'https://en.wikipedia.org/wiki/Tropic_of_Cancer',
    da: 'Wikipedia',
  },
  {
    dt: 'Tropic of Capricorn (Southern Tropic)',
    dd: 'The circle of latitude that contains the subsolar point at the December (or southern) solstice. It is thus the southernmost latitude where the Sun can be seen directly overhead. It also reaches 90 degrees below the horizon at solar midnight on the June Solstice.',
    ds: 'https://en.wikipedia.org/wiki/Tropic_of_Capricorn',
    da: 'Wikipedia',
  },
  {
    dt: 'Köppen climate classification',
    dd: 'Divides climates into five main climate groups, with each group being divided based on patterns of seasonal precipitation and temperature. The five main groups are A (tropical), B (arid), C (temperate), D (continental), and E (polar). These are in turn divided into subgroups. Climates are assigned a group and typically a subgroup e.g. Mediterranean climate has a Köppen climate classification of Csa/Csb.',
    ds: 'https://en.wikipedia.org/wiki/K%C3%B6ppen_climate_classification',
    da: 'Wikipedia',
  },
  {
    dt: 'Siliceous rock',
    dd: 'Sedimentary rocks that have silica (SiO2) as the principal constituent. The most common siliceous rock is chert.',
    ds: 'https://en.wikipedia.org/wiki/Siliceous_rock',
    da: 'Wikipedia',
  },
  {
    dt: 'Lignotuber',
    dd: 'A woody swelling of the root crown (that part of a root system from which a stem arise) possessed by some plants as a protection against destruction of the plant stem, such as by fire.',
    ds: 'https://en.wikipedia.org/wiki/lignotuber',
    da: 'Wikipedia',
    dx: ['Quercus suber', 'Erica arborea', 'Olea europaea']
  },
  {
    dt: 'Phytology',
    dd: 'The study of plants; botany.',
    ds: 'https://en.wikipedia.org/wiki/Lignotuberphytology',
    da: 'Wikipedia',
  },
  {
    dt: 'Obligate seeders',
    dd: 'Plants with large, fire-activated seed banks that germinate, grow, and mature rapidly following a fire, in order to reproduce and renew the seed bank before the next fire.',
    ds: 'https://en.wikipedia.org/wiki/Fire_ecology#Fire_intolerance',
    da: 'Wikipedia',
  },
  {
    dt: 'Resprouters',
    dd: 'Plant species that are able to survive fire by the activation of dormant vegetative buds to produce regrowth.',
    ds: 'https://en.wikipedia.org/wiki/Fire_ecology#Fire_tolerance',
    da: 'Wikipedia',
  },
  {
    dt: 'Iteroparity',
    dd: 'Characterized by multiple reproductive cycles over the course of its lifetime. Compare polycarpy.',
    ds: 'https://en.wikipedia.org/wiki/Semelparity_and_iteroparity',
    da: 'Wikipedia',
  },
  {
    dt: 'Semelparity',
    dd: 'Characterized by a single reproductive episode before death. Compare monocarpy.',
    ds: 'https://en.wikipedia.org/wiki/Semelparity_and_iteroparity',
    da: 'Wikipedia',
  },
  {
    dt: 'Monocarpic',
    dd: 'Plants are those that flower and set seeds only once, and then die.',
    ds: 'https://en.wikipedia.org/wiki/Monocarpic',
    da: 'Wikipedia',
  },
  {
    dt: 'Polycarpic',
    dd: 'Plants are those that flower and set seeds many times before dying.',
    ds: 'https://en.wikipedia.org/wiki/Polycarpic',
    da: 'Wikipedia',
  },
  {
    dt: 'Monopyric',
    dd: 'Species that perform all their life cycle within a fire cycle. In plants, examples are annual and biennial species, postfire obligate seeders and some bamboos.',
    ds: 'https://nph.onlinelibrary.wiley.com/doi/10.1111/nph.12921',
    da: 'New Phytologist',
  },
  {
    dt: 'Polypyric',
    dd: 'Species that perform all their life cycle through multiple fire cycles. In plants, examples are those with postfire resprouting capacity as well as trees with other survival strategies such as very thick bark.',
    ds: 'https://nph.onlinelibrary.wiley.com/doi/10.1111/nph.12921',
    da: 'New Phytologist',
  },
  {
    dt: 'Subtropics',
    dd: 'Geographical and climate zones to the north of the tropic of Cancer and south of the tropic of Capricorn. The tropics lie at a latitude of ~23.44° north and south, which corresponds to the Earth\'s axial tilt.',
    ds: 'https://nph.onlinelibrary.wiley.com/doi/10.1111/nph.12921',
    da: 'New Phytologist',
  },
  {
    dt: 'Climax community',
    dd: 'A historic term for a community of plants, animals, and fungi which, through the process of ecological succession in the development of vegetation in an area over time, have reached a steady state.',
    ds: 'https://en.wikipedia.org/wiki/Climax_community',
    da: 'Wikipedia',
  },
  {
    dt: 'Edaphology',
    dd: 'Concerned with the influence of soils on living beings, particularly plants.',
    ds: 'https://en.wikipedia.org/wiki/Edaphology',
    da: 'Wikipedia',
  },
  {
    dt: 'Epicormic shoot',
    dd: 'A shoot growing from an epicormic bud, which lies underneath the bark of a trunk, stem, or branch of a plant. Epicormic resprouting is typical of some tree species from fire-prone ecosystems.',
    ds: 'https://en.wikipedia.org/wiki/Epicormic_shoot',
    da: 'Wikipedia',
    dx: ['Eucalyptus', 'Quercus suber']
  },
  {
    dt: 'Epicuticular wax',
    dd: 'A waxy coating which covers the outer surface of the plant cuticle in land plants. It may form a whitish film or bloom on leaves, fruits and other plant organs.',
    ds: 'https://en.wikipedia.org/wiki/Epicuticular_wax',
    da: 'Wikipedia',
    dx: ['Cercis siliquastrum', 'Ceratonia siliqua']
  },
  {
    dt: 'Geophyte',
    dd: 'Plants with underground storage organs (bulbs, rhizomes, tuber) lying beneath the surface of the ground.',
    ds: 'https://www.sciencedirect.com/topics/earth-and-planetary-sciences/geophyte',
    da: 'ScienceDirect',
  },
  {
    dt: 'Karst',
    dd: 'A topography formed from the dissolution of soluble carbonate rocks such as limestone, dolomite, and gypsum.',
    ds: 'https://en.wikipedia.org/wiki/Karst',
    da: 'Wikipedia',
    dx: ['Cercis siliquastrum', 'Ceratonia siliqua']
  },
]

const keys = [
  {
    key: 'mediterranean',
    values: [
      'Biodiversity hotspot: Mediterranean Sea 4% to 18% of all identified marine species in 0.82% of the global ocean surface.',
      '26,000 people have died attemptig to cross the Mediterranean since 2014',
      'Average annual temperatures are now 1.4 °C higher than during the period 1880-1899.',
      'The estimated sea level rise during the last two decades was ~3 cm/decade.',
    ]
  }
]

// TEMPLATES

const h3 = {
  id: 'title-h3-template',
  parent: 'non-grid-template',
  type: 'h3-header',
  h3: 'title',
}

const text = {
  id: 'text-template',
  name: 'text',
  parent: 'non-grid-template',
  type: 'text',
  texts: [],
}

const term = {
  id: 'term-template',
  name: 'term', 
  parent: 'dl-template',
  type: 'term',                 
  terms: [],
}

const species = {
  id: 'species-card-template',
  name: 'Species-cards',
  parent: 'grid-template',
  type: 'species',
  species: [],
}

const image = {
  id: 'img-template',
  parent: 'grid-template',
  type: 'img',
  imgs: [],
}

export const g = {
    ICONIC_TAXA: [
        {
            name: 'fungi',
        },
        {
            name: 'amphibia',
        },
        {
            name: 'mammalia',
        },
        {
            name: 'plantae',
        },
        {
            name: 'insecta',
        },
        {
            name: 'aves',
        },
        {
            name: 'reptilia',
        },
    ],
    LANGUAGES: [
        { name: 'Deutsche', id: 'de' },
        { name: 'English', id: 'en' },
        { name: 'Español', id: 'es' },
        { name: 'Français', id: 'fr' },
        { name: 'Italiano', id: 'it' },
        { name: 'Português', id: 'pt' },
        { name: 'Slovenščina', id: 'sl' },
    ],
    templates: templates,
    count: 12,
    species: null,
    guides: [
        {
            id: 'mediterranean-climate-regions-guide',
            name: 'Mediterranean climate regions',
            author: 'danielhartley',
            taxa: [
              {
                id: 1137754,
                name: 'Quercus ilex',
                rank: 10,
              },
              {
                id: 78159,
                name: 'Myrtus communis',
                rank: 10,
              },
              {
                id: 82689,
                name: 'Arbutus unedo',
                rank: 10,
              },
              {
                id: 57140,
                name: 'Olea europaea',
                rank: 10,
              },
              {
                id: 54759,
                name: 'Laurus nobilis',
                rank: 10,
              },
              {
                id: 82856,
                name: 'Rhamnus alaternus',
                rank: 10,
              },
            ],
            templates: [              
              {
                id: 'introduction-to-mediterranean-climate-regions-template',
                name: 'Journal',
                parent: 'non-grid-template',
                type: 'guide',
                isTest: false,
                sections: [
                  {
                    templates: [
                      { ...h3, h3: 'Mediterranean Climate Regions' },
                      { 
                        ...text, texts: [
                          {
                            text: `
                            The Mediterranean has a subtropical climate with hot summers and mild winters. Precipitation is concentrated in the winter.`,
                          },
                          {
                            text: 'The subtropics fall outside of the tropics of Cancer (in the northern hemisphere) and Capricorn (southern hemisphere).',
                          },
                        ]
                      },
                      {
                        ...image,
                        imgs: [
                          {
                            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Subtropical.png/320px-Subtropical.png',
                            alt: 'Subtropical regions on Earth',
                            width: 640,
                            height: 296,
                            contain: true,
                          },                          
                          // {
                          //   src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Roman_Empire_Trajan_117AD.png/320px-Roman_Empire_Trajan_117AD.png',
                          //   alt: 'Roman Empire under Trajan 117AD',
                          //   width: 640,
                          //   height: 408,
                          //   contain: true,
                          // },                          
                        ]
                      },
                      { 
                        ...text, texts: [
                          {
                            text: 'The typical Mediterranean landscape is a mosaic of diverse plant communities characterised by biodiversity.',
                          },
                          {
                            text: 'Plants that have developed and diversified in areas with a Mediterranean macroclimate have acquired special characteristics, adapting their morphology and metabolism to survive during the drought period and to resprout after wildfires.',
                          },
                          {
                            text: 'The main Mediterranean vegetation types throughout the Mediterranean Basin are sclerophyllous or marcescent oak forests and woodlands at lower elevations, marcescent oak forests in middle elevations and conifer forests or woodlands at higher elevations.',
                          },                        
                        ]
                      },
                      { ...term, terms: [
                        'Sclerophyll',
                        'Marcescence',
                        'Conifer',
                        ]
                      },
                      { ...text, texts: [
                          {
                            text: 'Much of Portugal has a Mediterranean climate.',
                          },
                        ]
                      },
                      {
                        ...image,
                        imgs: [
                          // {
                          //   src: 'https://drive.google.com/thumbnail?id=1NfXWqunQ-TvGy8ffuzvR9IVYRwNKPOzF',
                          //   alt: 'Pine bark',
                          //   width: 220,
                          //   height: 165,
                          // },
                          {
                            src: 'https://drive.google.com/thumbnail?id=1p3Qd3_CCdQuqEl_mRNEx9lFzhYkvzS_p',
                            alt: 'Costa Vicentina, Portugal',
                            width: 220,
                            height: 165,
                            contain: true,
                          },
                          {
                            src: 'https://drive.google.com/thumbnail?id=1dhlGp_xaVeb67RriGjdXbeY9I8DEhb5C',
                            alt: 'Costa Vicentina, Portugal',
                            width: 220,
                            height: 165,
                            contain: true,
                          },
                          {
                            src: 'https://drive.google.com/thumbnail?id=11ckREuDuCyHqKkfwNRLV9zTR7TVyezKN',
                            alt: 'Constância, Portugal',
                            width: 220,
                            height: 165,
                            contain: true,
                          },
                        ]
                      },
                      { ...h3,  h3: 'Mediterranean climate and vegetation' },           
                      { ...text, texts: [
                        {
                          text: 'The Mediterranean is characterised by mild and rainy winters and hot and dry summers.',
                        },
                        {
                          text: 'MCRs are covered by characteristic vegetation types involving dense forests, woodlands and thickets of woody shrubby plants of varying density, generally with evergreen sclerophyllous leaves.',
                        },
                        {
                          text: 'The most notable aspect of the Mediterranean macrobioclimate affecting its main vegetation types is the restricted summer rainfall when temperatures reach their maximum.',
                        },
                        {
                          text: 'Plants that have developed and diversified in areas with a Mediterranean macroclimate have acquired special characteristics, adapting their morphology and metabolism to survive during drought, and to resprout after wildfires.',
                        },
                        {
                          text: 'The main Mediterranean vegetation types throughout the Mediterranean Basin are sclerophyllous or marcescent oak forests and woodlands at lower elevations, marcescent oak forests in middle elevations and conifer forests or woodlands at higher elevations.',
                        },   
                      ] },
                      { ...term, terms: [
                        'Convergent evolution',
                        'Limestone',
                        'Orthent',
                        ]
                      },
                      {
                        ...text,
                        texts: [
                          {
                            text: `
                            Quercus *ilex*, Myrtus *communis*, Arbutus *unedo*, Olea *europaea*, Laurus *nobilis*, and Rhamnus *alaternus* are sclerophyllic, a typical adaptation to areas with low rainfall or seasonal droughts.`,
                          },
                        ]
                      },
                      {
                        ...species,
                        species: [
                          'Quercus ilex',
                          'Myrtus communis',
                          'Arbutus unedo',
                          'Olea europaea',
                          'Laurus nobilis',
                          'Rhamnus alaternus',
                          'Triticum', // wheat genus
                          'Vitis', // grapevine genus
                        ]
                      }
                    ],
                  },
                  {
                    templates: [
                      { ...h3,  h3: 'Human impact' },
                      { ...text,
                        texts: [
                          {
                            text: 'Matorrals can be considered as different vegetation types developed on disturbed or altered sites where forest species form the natural potential vegetation and its vegetation series.',
                          },
                          {
                            text: 'Most of the food crops cultivated in the area were originated in the Mediterranean Basin and in Middle Eastern regions. Wheat, barley, legumes (such as lentils and chickpeas), vegetables (such as artichokes, asparagus, cabbage, leeks, onions and garlic), and fruits and seeds (such as grapes, olives, almonds and acorns).',
                          },
                          {
                            text: 'The present Mediterranean landscape is the complex result of human activity in the management of nature for its own benefit.'
                          },                  
                          {
                            text: 'The pristine Mediterranean vegetation was transformed through human intervention. This was not only due to agriculture, livestock and the building of cities but also due to mining for metals, a key activity throughout its history.'
                          },                
                          {
                            text: 'Natural woods and bushes were transformed into a new cultural space where crops and grasslands could be identified with boundaries defining their ownership.'
                          },
                        ]
                      },
                      {
                        id: 'term-template',
                        name: 'term', 
                        parent: 'dl-template',
                        type: 'term',
                        terms: [
                          'Sclerophyll',
                          'Marcescence',
                          'Xerothermic',
                          'Phytophagous Insects'
                        ],
                      },
                    ],
                  }
                ],
              },
              ...templates,
            ],
        },
        {
            id: 'wild-edible-plants-of-the-mediterranean-guide',
            name: 'Wild edible plants of the Mediterranean',
            author: 'danielhartley',
            taxa: [
              {
                id: 82946,
                name: 'Quercus rotundifolia',
                rank: 10,
              },
              {
                id: 57140,
                name: 'Olea europaea',
                rank: 10,
              },
              {
                id: 79009,
                name: 'Scolymus hispanicus',
                rank: 10,
              },
              {
                id: 55721,
                name: 'Silene vulgaris',
                rank: 10,
              },
              {
                id: 52586,
                name: 'Silybum marianum',
                rank: 10,
              },
              {
                id: 60232,
                name: 'Rumex pulcher',
                rank: 10,
                description: [
                  {
                    text: 'At its best in early spring when the plant has developed its basal leaves and before the growth of the flowering stems.'
                  }
                ]
              },
              {
                id: 82691,
                name: 'Dioscorea communis',
                rank: 10,
                description: [
                  {
                    text: 'The young shoots are collected in mid-spring.'
                  }
                ]
              },
              {
                id: 210513,
                name: 'Asparagus acutifolius',
                rank: 10,
              },
              {
                id: 78174,
                name: 'Nasturtium officinale',
                rank: 10,
              },
              {
                id: 53196,
                name: 'Rumex',
                rank: 20,
              },
              {
                id: 79009,
                name: 'Scolymus hispanicus',
                rank: 10,
              },
              {
                id: 72264,
                name: 'Onopordum',
                rank: 20,
              },
              {
                id: 48150,
                name: 'Boraginaceae',
                rank: 20,
                description: [
                  {
                    text: 'Have been used as stewed vegetables.'
                  }
                ]
              },
              {
                id: 53294,
                name: 'Sonchus oleraceus',
                rank: 10,
              },
              {
                id: 53779,
                name: 'Humulus lupulus',
                rank: 10,
              },
              {
                id: 493017,
                name: 'Scandix australis',
                rank: 10,
              },
              {
                id: 75429,
                name: 'Anchusa azurea',
                rank: 10,
                description: [
                  {
                    text: 'These flowers, which typically appear in May–July, are edible and attract bees.'
                  }
                ]
              },
              {
                id: 53052,
                name: 'Foeniculum vulgare',
                rank: 10,
                description: [
                  {
                    text: 'Consumed in salads or eaten raw.'
                  }
                ]
              },
              {
                id: 76300,
                name: 'Chondrilla juncea',
                rank: 10,
                description: [
                  {
                    text: 'Consumed in salads or eaten raw.'
                  }
                ]
              },
              {
                id: 82642,
                name: 'Mantisalca salmantica',
                rank: 10,
                description: [
                  {
                    text: 'Consumed in salads or eaten raw.'
                  }
                ]
              },
              {
                id: 168693,
                name: 'Scorzonera laciniata',
                rank: 10,
                description: [
                  {
                    text: 'Consumed in salads or eaten raw.'
                  }
                ]
              },
              {
                id: 61396,
                name: 'Origanum vulgare',
                rank: 10,
                description: [
                  {
                    text: ''
                  }
                ]
              },
            ],
            templates: [              
              {
                id: 'wild-edible-plants-template',
                name: 'Journal',
                parent: 'non-grid-template',
                type: 'guide',
                isTest: false,
                sections: [
                  {
                    templates: [
                      { ...h3,  h3: 'The Mediterranean landscape' },
                      {
                        ...text,
                        texts: [
                          {
                            text: 'The typical Mediterranean landscape is a mosaic of diverse plant communities characterised by biodiversity.',
                          },
                          {
                            text: 'These complexes are home to an important group of edible plants and plants that provide wild edible fruits, as well as aromatic plants used as seasoning in human nutrition.',
                          },
                          {
                            text: 'Mild and rainy winters contrasting with hot and dry summers.',
                          },
                          {
                            text: 'The Mediterranean macrobioclimate is shared with southern and south-western territories on all the continents.',
                          },
                          {
                            text: 'The lands in these regions around the world are covered by characteristic vegetation types involving dense forests, woodlands and thickets of woody shrubby plants of varying density, generally with evergreen sclerophyllous leaves.',
                          },
                          {
                            text: 'Wild plants were a major source of food and a key nutritional complement to the animal proteins obtained from hunting and fishing. Knowledge of wild edible plants has survived in more advanced farming and livestock societies, and in times of hardship, such as war and famine, it has once again served as a vital source of food and medicinal resources.',
                          },
                          {
                            text: 'The most notable aspect of the Mediterranean macrobioclimate affecting its main vegetation types is the restricted summer rainfall when temperatures reach their maximum.',
                          },
                          {
                            text: 'Plants that have developed and diversified in areas with a Mediterranean macroclimate have acquired special characteristics adapting their morphology and metabolism to survive during the drought period and to resprout after wildfires.',
                          },
                          {
                            text: 'The main Mediterranean vegetation types throughout the Mediterranean Basin are sclerophyllous or marcescent oak forests and woodlands at lower elevations, marcescent oak forests in middle elevations and conifer forests or woodlands at higher elevations.',
                          },                        
                        ]
                      },
                      {
                        ...image,
                        imgs: [
                          {
                            src: 'https://drive.google.com/thumbnail?id=1p3Qd3_CCdQuqEl_mRNEx9lFzhYkvzS_p',
                            alt: 'Costa Vicentina, Portugal',
                            width: 220,
                            height: 165,
                            contain: true,
                          },
                          {
                            src: 'https://drive.google.com/thumbnail?id=1dhlGp_xaVeb67RriGjdXbeY9I8DEhb5C',
                            alt: 'Costa Vicentina, Portugal',
                            width: 220,
                            height: 165,
                            contain: true,
                          },
                          {
                            src: 'https://drive.google.com/thumbnail?id=11ckREuDuCyHqKkfwNRLV9zTR7TVyezKN',
                            alt: 'Constância, Portugal',
                            width: 220,
                            height: 165,
                            contain: true,
                          },
                        ]
                      },
                      {
                        ...species,
                        species: [
                          'Quercus rotundifolia',
                          'Olea europaea',
                          'Rumex pulcher',
                          'Dioscorea communis',
                          'Asparagus acutifolius',
                          'Nasturtium officinale',                        
                        ],
                      },
                      {
                        ...term,
                        terms: [
                          'Sclerophyll',
                          'Marcescence',
                          'Xerothermic',
                          'Phytophagous Insects'
                        ],
                      },
                    ],
                  },
                  {
                    templates: [
                      { ...h3,  h3: 'title…' },
                      {
                        ...text,
                        texts: [
                          {
                            text: 'Matorrals can be considered as different vegetation types developed on disturbed or altered sites where forest species form the natural potential vegetation and its vegetation series.',
                          },
                          {
                            text: 'Most of the food crops cultivated in the area were originated in the Mediterranean Basin and in Middle Eastern regions. Wheat, barley, legumes (such as lentils and chickpeas), vegetables (such as artichokes, asparagus, cabbage, leeks, onions and garlic), and fruits and seeds (such as grapes, olives, almonds and acorns).',
                          },
                          {
                            text: 'The present Mediterranean landscape is the complex result of human activity in the management of nature for its own benefit.'
                          },                  
                          {
                            text: 'The pristine Mediterranean vegetation was transformed through human intervention. This was not only due to agriculture, livestock and the building of cities but also due to mining for metals, a key activity throughout its history.'
                          },                
                          {
                            text: 'Natural woods and bushes were transformed into a new cultural space where crops and grasslands could be identified with boundaries defining their ownership.'
                          },                
                          {
                            text: 'Changes promoted nitrogen-loving (nitrophilous) plants. Many are as-sociated with farmlands and cultivated plants (weeds), and others grow near places of human habitation (ruderals) or live along the borders of paths, roads or cattle tracks, carried by man and domestic animals in their seasonal migration.'
                          },                
                          {
                            text: 'Numerous weeds and ruderal plants are used and collected as wild vegetables in the Iberian Peninsula, such as Scolymus hispanicus (Asteraceae), Silene vulgaris, Garcke (Caryophyllaceae) and Silybum marianum.'
                          },          
                          {
                            text: 'Late winter, and especially spring, is in general the best time to collect vegetables that reach their higher development while being still tender, though de-pending on the local climatic conditions, they could be collected in other parts of the year.'
                          },       
                          {
                            text: 'Seasonality is a very determinant condition for the life in the Mediterranean areas.'
                          },       
                          {
                            text: 'Very dry autumns in Spanish continental sites signal the beginning of a bad year for collecting wild vegetables which develop during this season and produce their stems and leaves in late winter and spring.'
                          },       
                          {
                            text: 'Asparagus acutifolius — which grows in oak forest communities, in olive groves and, in the past, inside rain-fed farm crops — has very tough underground organs like tuberous roots, and in dry years also produces new shoots or asparagus.'
                          },      
                          {
                            text: 'There are also species that are not so dependent on the yearly climatic variation, such as watercress (Nasturtium officinale) that always grow where there are permanent waters.'
                          },    
                          {
                            text: 'Late spring and summer is the season of aromatic plants used for seasoning. The diverse floras of the Mediterranean Basin countries provide numerous highly scented species. Chemical compounds from the essential oils are produced in the secondary metabolism of all these plants and are present in the small uni- or multicellular dots that are transformed hairs located on the epidermis of leaves and flowers.'
                          },
                          {
                            text: 'These tiny dots burst, and the essential oil evap-orates into the air producing their pleasant aromas, even when the plants are dried. One of the biological advantages of the presence of these chemical compounds is that plants are protected from being eaten by large animals or phytophagous insects and from bacterial infections.'
                          },
                          {
                            text: 'One of the biological advantages of the presence of these chemical compounds is that plants are protected from being eaten by large animals or phytophagous insects and from bacterial infections.'
                          },
                          {
                            text: 'There is a high biodiversity within the group of species used for cooking, flavouring and preserving. Lamiaceae, Apiaceae and Asteraceae are the main aromatic plant families in the territories of the Mediterranean Basin.'
                          },
                        ]
                      },
                      {
                        ...species,
                        species: [
                          'Silene vulgaris',
                          'Silybum marianum',
                          'Sonchus oleraceus',
                          'Anchusa azurea',
                          'Foeniculum vulgare',
                          'Chondrilla juncea',
                          'Mantisalca salmantica',
                          'Origanum vulgare',
                        ],
                      },
                      {
                        ...term,
                        terms: [
                          'Sclerophyll',
                          'Marcescence',
                          'Xerothermic',
                          'Phytophagous Insects'
                        ],
                      },
                    ],
                  }
                ],
              },
              ...templates,
            ],
            sources: [
              {
                name: 'The Mediterranean Landscape and Wild Edible Plants',
                src: 'https://www.researchgate.net/publication/301320513_The_Mediterranean_Landscape_and_Wild_Edible_Plants',
                authors: [
                  'Daniel Sánchez-Mata',
                  'Ramón Morales',
                ]
              }
            ],
        },
        {
            id: 'fire-prone-ecosystems-guide',
            name: 'Fire-prone ecosystems',
            author: 'danielhartley',
            taxa: [
              {
                  id: 1150906,
                  name: 'Juniperus oxycedrus',
                  rank: 10,
              },
              {
                  id: 63621,
                  name: 'Pinus pinea',
                  rank: 10,
              },
              {
                  id: 82722,
                  name: 'Pinus halepensis',
                  rank: 10,
              },
              {
                  id: 82742,
                  name: 'Ceratonia siliqua',
                  rank: 10,
              },
              {
                  id: 47452,
                  name: 'Acacia',
                  rank: 20,
              },
              {
                  id: 340941,
                  name: 'Calicotome villosa',
                  rank: 10,
              },
              {
                  id: 47407,
                  name: 'Genista',
                  rank: 20,
              },
              {
                  id: 47406,
                  name: 'Spartium junceum',
                  rank: 10,
              },
              {
                  id: 771653,
                  name: 'Ulex',
                  rank: 20,
              },
              {
                  id: 82727,
                  name: 'Ulex parviflorus',
                  rank: 10,
              },
              {
                  id: 54812,
                  name: 'Rhamnus',
                  rank: 20,
              },
              {
                  id: 60218,
                  name: 'Ficus carica',
                  rank: 10,
              },
              {
                  id: 133387,
                  name: 'Ericaceae',
                  rank: 20,
              },
              {
                  id: 51047,
                  name: 'Arbutus',
                  rank: 20,
              },
              {
                  id: 82689,
                  name: 'Arbutus unedo',
                  rank: 10,
              },
              {
                  id: 82688,
                  name: 'Erica arborea',
                  rank: 10,
              },
              {
                  id: 129759,
                  name: 'Carpobrotus acinaciformis',
                  rank: 10,
              },
              {
                  id: 167774,
                  name: 'Reichardia tingitana',
                  rank: 10,
              },
              {
                  id: 59904,
                  name: 'Glebionis coronaria',
                  rank: 10,
              },
              {
                  id: 72301,
                  name: 'Pistacia',
                  rank: 20,
              },
              {
                  id: 82600,
                  name: 'Pistacia lentiscus',
                  rank: 10,
              },
              {
                  id: 51815,
                  name: 'Eucalyptus',
                  rank: 20,
              },
              {
                  id: 72248,
                  name: 'Myrtus',
                  rank: 20,
              },
              {
                  id: 47851,
                  name: 'Quercus',
                  rank: 20,
              },
              {
                  id: 50868,
                  name: 'Quercus suber',
                  rank: 10,
              },
              {
                  id: 1137754,
                  name: 'Quercus ilex',
                  rank: 10,
              },
              {
                  id: 82942,
                  name: 'Quercus coccifera',
                  rank: 10,
              },
              {
                  id: 121763,
                  name: 'Castanea sativa',
                  rank: 10,
              },
              {
                  id: 63935,
                  name: 'Juglans regia',
                  rank: 10,
              },
              {
                  id: 57140,
                  name: 'Olea europaea',
                  rank: 10,
              },
              {
                  id: 48623,
                  name: 'Lamiaceae',
                  rank: 20,
              },
              {
                  id: 61904,
                  name: 'Lavandula stoechas',
                  rank: 10,
              },
              {
                  id: 82927,
                  name: 'Rosmarinus',
                  rank: 20,
              },
              {
                  id: 52344,
                  name: 'Ipomoea purpurea',
                  rank: 10,
              },
              {
                  id: 76432,
                  name: 'Convolvulus althaeoides',
                  rank: 10,
              },
              {
                  id: 48797,
                  name: 'Malvaceae',
                  rank: 20,
              },
              {
                  id: 77950,
                  name: 'Malva arborea',
                  rank: 10,
              },
              {
                  id: 333734,
                  name: 'Thymelaea hirsuta',
                  rank: 10,
              },
              {
                  id: 64322,
                  name: 'Cistus',
                  rank: 20,
              },
              {
                  id: 76363,
                  name: 'Cistus monspeliensis',
                  rank: 10,
              },
              {
                  id: 76365,
                  name: 'Cistus salviifolius',
                  rank: 10,
              },
              {
                  id: 64318,
                  name: 'Cistus creticus',
                  rank: 10,
              },
              {
                  id: 82673,
                  name: 'Cistus albidus',
                  rank: 10,
              },
              {
                  id: 54760,
                  name: 'Laurus',
                  rank: 20,
              },
              {
                  id: 76764,
                  name: 'Echium plantagineum',
                  rank: 10,
              },
              {
                  id: 179648,
                  name: 'Aphyllanthes monspeliensis',
                  rank: 10,
              },
              {
                  id: 82895,
                  name: 'Allium roseum',
                  rank: 10,
              },
              {
                  id: 47328,
                  name: 'Liliaceae',
                  rank: 20,
              },
              {
                  id: 82903,
                  name: 'Smilax aspera',
                  rank: 10,
              },
              {
                  id: 52594,
                  name: 'Phytophthora',
                  rank: 20,
              },
              {
                  id: 118535,
                  name: 'Drimia maritima',
                  rank: 10,
              },
              {
                  id: 338067,
                  name: 'Asparagus aphyllus',
                  rank: 10,
              },
              {
                  id: 82836,
                  name: 'Daphne gnidium',
                  rank: 10,
              },
              {
                  id: 956048,
                  name: 'Chamaeleon gummifer',
                  rank: 10,
              },
              {
                  id: 113507,
                  name: 'Sympetrum fonscolombii',
                  rank: 10,
              },
              {
                  id: 123912,
                  name: 'Charaxes jasius',
                  rank: 10,
              },
            ],
            templates: [              
              {
                id: 'introduction-to-fire-prone-ecosystems-template',
                name: 'Journal',
                parent: 'non-grid-template',
                type: 'guide',
                isTest: false,                
                sections: [
                  {
                    templates: [
                      {
                        ...text,
                        texts: [
                          {
                            text: 'Mediterranean vegetation is among the most fire-prone and fire-shaped in the world.',
                          },
                          {
                            text: 'Sclerophyllous evergreen shrublands with widespread adaptations to intense fire. (Maquis)',
                          },
                          {
                            text: 'Lower, more xeric, sometimes drought-deciduous shrublands. (Garrigue)',
                          },
                          {
                            text: 'It is found on limestone soils in southern France and around the Mediterranean Basin, generally near the coast where the moderated Mediterranean climate provides annual summer drought. It is an anthropogenic degradation and succession form of former evergreen oak forests that existed until around 2500 years BC.'
                          },                                                  
                        ]
                      },
                      {
                        ...image,
                        imgs: [
                          {
                            src: 'https://drive.google.com/thumbnail?id=1HyoBMUvF76pzfpWkhfkvZZtty1VO32B3',
                            alt: 'Arrábida after the fire',
                            width: 220,
                            height: 165,
                          },
                          {
                            src: 'https://drive.google.com/thumbnail?id=1lLXTsBb8juPgrUar5MD6KOIBusAcG31Y',
                            alt: 'Arrábida after the fire',
                            width: 220,
                            height: 165,
                          },
                          {
                            src: 'https://drive.google.com/thumbnail?id=1GcMih3Zcrv8oHa_Hc8Y_m4nYGKxKIsIA',
                            alt: 'Arrábida after the fire',
                            width: 220,
                            height: 165,
                          },
                        ],
                      },
                      {
                        ...term,
                        terms: [
                          'Serotiny',
                          'Secondary succession',
                          'Maquis',
                          'Garrigue',
                          'Sclerophyll',
                          'Ruderal species',
                        ],
                      }
                    ]
                  }
                ],
              },
              ...templates,
            ],
        },
    ],
    terms: terms,
    inatSpecies: [],
    inatAutocompleteOptions: [
        {
            id: 'users',
            name: 'user',
            prop: 'login',
            placeholder: 'Start typing a username or user ID…',
            isActive: false,
            user: null,
        },
        {
            id: 'places',
            name: 'place',
            prop: 'display_name',
            placeholder: 'Start typing a location…',
            isActive: false,
            place: null,
        },
        {
            id: 'projects',
            name: 'project',
            placeholder: 'Start typing a name or URL slug, e.g. my-project…',
            prop: '',
            isActive: false,
            project: null,
        }
    ],
    inatAutocomplete: {
        id: 'users',
        name: 'user',
        prop: 'login',
        placeholder: 'Username or user ID',
        isActive: false,
        user: null,
        project: null,
        place: null,
    },
    matches: [],    
    useObservationsSpeciesCountOptions: [{name:'Observations', id: "false"}, {name:'Observations by species', id: "true"}],
}

