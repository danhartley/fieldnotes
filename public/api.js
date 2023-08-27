// INAT API

export const getInatObservations = async ({
      user_key = 'user_id'
    , user_id = null
    , place_key = 'place_id'
    , place_id = null
    , iconic_taxa
    , per_page = 200
    , page = 1
    , locale = 'en'
    , species_count = true
}) => {
    
    let params = ''

    params = user_id ? params + `&${user_key}=${user_id}` : params
    params = place_id ? params + `&${place_key}=${place_id}` : params
    params = iconic_taxa ? params + `&iconic_taxa=${iconic_taxa.map(taxon => taxon.name).join(',')}` : params
    params = params + `&page=${page}&per_page=${per_page}`
    params = params + `&locale=${locale}`
    
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

// GLOBAL OBJECT

// rank 20: genus
// rank 10: species
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
    templates: [
        {
            id: 'species-list-template',
            name: 'species-list',
            parent: 'species-list-parent',
            isTest: false,
        },
        {
            id: 'species-card-test-template',
            name: 'species-card-tests',
            parent: 'species-grid-parent',
            isTest: true,
        },
        {
            id: 'species-card-template',
            name: 'species-cards',
            parent: 'species-grid-parent',
            isTest: false,
        },
    ],
    count: 10,
    species: [],
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
    showFilters: true,
    showLesson: true,
    showScore: true,
    showPreferences: true,
    guides: [
        {
            id: 'danielhartley',
            name: 'Daniel Hartley',
            lesson: { id: 1 },
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
            ],
            templates: [
              {
                id: 'fire-history-template',
                name: 'fire-history',
                parent: 'guide-history-parent',
                isTest: false,
                title: 'Plants of the garrigue and maquis'
              },
            ]
        }
    ],
    inatSpecies: [],
    inatAutocompleteOptions: [
        {
            id: 'users',
            name: 'user',
            prop: 'login',
            placeholder: 'Username or user ID',
            isActive: false,
            user: null,
        },
        {
            id: 'places',
            name: 'place',
            prop: 'display_name',
            placeholder: 'Location',
            isActive: false,
            place: null,
        },
        {
            id: 'projects',
            name: 'project',
            placeholder: 'Name or URL slug, e.g. my-project',
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
    lessons: [
        lesson,
    ],
    lesson: {
        id: 0,
        scores: [],
        score: 0,
    }
}

