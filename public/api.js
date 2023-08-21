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
}) => {
    
    let params = ''

    params = user_id ? params + `&${user_key}=${user_id}` : params
    params = place_id ? params + `&${place_key}=${place_id}` : params
    params = iconic_taxa ? params + `&iconic_taxa=${iconic_taxa.map(taxon => taxon.name).join(',')}` : params
    params = params + `&page=${page}&per_page=${per_page}`
    params = params + `&locale=${locale}`

    const url = 'https://api.inaturalist.org/v1/observations?order=desc&photos=true' + params

    const response = await fetch(url)
    const json = await response.json()
    const observations = await json.results
    return await observations
}

export const getByAutocomplete = async ({by, toComplete}) => {
    const url = `https://api.inaturalist.org/v1/${by}/autocomplete?q=${toComplete}`
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

export const snapModules = {     
    results: [
        {
            "behaviour": "static",
            "create": {
            "__time__": "2020-03-31T23:00:00.000Z"
            },
            "glossary": [
            "plantae",
            "common"
            ],
            "hasVideo": true,
            "icon": "https://storage.googleapis.com/snapdragon-222014.appspot.com/dist/susun%20weed.jpg",
            "iconicTaxa": [
            {
                "common": "Plants",
                "id": "plantae"
            }
            ],
            "id": 1008,
            "isActive": true,
            "items": [],
            "lessonPlanLandscape": 10,
            "lessonPlanPortrait": 110,
            "moduleSize": 1,
            "name": "Susun Weed - Wild Plant Identification",
            "notes": [],
            "producer": "wisewomantradition",
            "species": [
            {
                "description": "Flowers are in perfect condition, just right for picking and making tinctures and oils from the fresh blossoms.\n      \n      A tincture is typically an extract of plant or animal material dissolved in ethanol (ethyl alcohol).\n\n      In herbal medicine, alcoholic tinctures are most commonly made with a 20% ethanol concentration (Snapdragon).\n      ",
                "name": "Hypericum perforatum",
                "time": [
                18
                ]
            },
            {
                "description": "Deemed invasive, now appreciated more. The flowers (together with chicory and cronewort) are part of my third eye opening tincture.",
                "name": "Lythrum salicaria",
                "time": [
                40
                ]
            },
            {
                "description": "Cronewort, or Common mugwort. White on the back of the leaves, just coming into bud. The flowers of cronewort, chicory and purple loosestrife comprise the third eye opening tincture.",
                "name": "Artemisia vulgaris",
                "time": [
                86
                ]
            },
            {
                "description": "Staghorn Sumac, named in honour of the fuzz on the horns of a young male deer. Produces huge clusters of red berries which are high in anti-oxidants including anthocyanins.\n      \n      Antioxidants are compounds that inhibit oxidation which produces free radicals, thereby leading to chain reactions that may damage the cells of organisms (Snapdragon).\n\n      Anthocyanins are water-soluble pigments that, depending on their pH, may appear red, purple, blue or black. Colouration may attract pollinators (to flowers), animals for seed dispersal (fruit), and protect against extreme weather (Snapdragon). \n      ",
                "name": "Rhus typhina",
                "time": [
                112
                ]
            },
            {
                "description": "The tendrils are crisp, cruncy with lots of vitamin C. The grapes and its leaves can also be eaten.",
                "name": "Vitis",
                "time": [
                172
                ]
            },
            {
                "description": "Flowers are rich in potassium. Together with the leaves, they can go in a salad. The whole plant is edible. \n      \n      Skin contact with the foliage of Daucus carota, especially wet foliage, can cause skin irritation in some people, (Snapdragon). ",
                "name": "Daucus carota",
                "questionIds": [
                "13"
                ],
                "time": [
                200
                ]
            },
            {
                "description": "Wild geranium is widely used by herbalists as an astrigent, something to contract tissues, to counter weeping sores, eczema, etc.",
                "name": "Geranium maculatum",
                "time": [
                218
                ]
            },
            {
                "description": "Where there's one, there will be more. Dig the root in autumn and make a tincture from it. Dynamite for helping people who are dealing with Lyme disease.",
                "name": "Polygonum cuspidatum",
                "time": [
                240
                ]
            },
            {
                "description": "Green blessings are everywhere around you.",
                "name": "Impatiens capensis",
                "time": [
                275
                ]
            }
            ],
            "still": "https://storage.googleapis.com/snapdragon-222014.appspot.com/dist/stills/susun weed.jpg",
            "type": "taxon",
            "video": {
            "id": "Oyb9do5_6Ts",
            "intro": "Remember, green blessings are everywhere. When you've finished watching, review what we covered to see how much you remember, and to reinforce what you learnt.",
            "links": [
                {
                "label": "",
                "url": ""
                },
                {
                "label": "Channel",
                "url": "https://www.youtube.com/channel/UCo0uJBHNwF_IqhvVMbvdDTA"
                }
            ],
            "location": "United States",
            "owner": "wisewomantradition",
            "ownerUrl": "https://www.youtube.com/channel/UCo0uJBHNwF_IqhvVMbvdDTA",
            "presenter": "Susun Weed",
            "src": "https://yt3.ggpht.com/a/AGF-l7_0rsdKYlsNUg8ayuivW0J3LLEK1NtKVKSAPQ=s48-c-k-c0xffffffff-no-rj-mo",
            "startAt": 0,
            "title": "Wild Plant Identification with Susun Weed"
            }
        },
        {
            "behaviour": "static",
            "create": {
                "__time__": "2020-09-21T23:00:00.000Z"
            },
            "glossary": [
                "fungi",
                "common"
            ],
            "hasTermsClass": "",
            "hasVideo": true,
            "hideTextIntroClass": "hide-important",
            "hideVideoClass": "",
            "icon": "https://storage.googleapis.com/snapdragon-222014.appspot.com/dist/mushrooms.jpg",
            "iconicTaxa": [{
                "common": "Fungi & Lichens",
                "id": "fungi"
            }],
            "id": 10012,
            "isActive": true,
            "isCollectionEditableClass": "",
            "isPaused": false,
            "isPrivate": true,
            "itemIndex": 0,
            "items": [],
            "lessonPlanLandscape": 3,
            "lessonPlanPortrait": 103,
            "moduleSize": 1,
            "name": "New To Mushroom Hunting? Start Here!",
            "notes": [{
                    "description": "\nThese fungi grow on decaying wood, on stumps, logs, sticks, forest litter and fallen leaves.\n\nThey have the ability to break down plant cell wall compounds, and are therefore considered to be decomposers.",
                    "tag": "Saprotrophic fungi",
                    "time": 208
                },
                {
                    "description": "\nThese fungi grow on or within living substrates at the expense of their hosts.\n\nSubstrates include living trees, plants, other mushrooms, animals, even humans.",
                    "tag": "Parasitic fungi",
                    "time": "230"
                },
                {
                    "description": "\nThese fungi form mutualistic, symbiotic relationships with plants. \n\nBoth organisms, the plant and the fungus, benefit in this relationship.\n\nThe plants photosynthesis and create sugars, in exchange for water, minerals and nutrients.",
                    "tag": "Mycorrizhal fungi",
                    "time": 251
                },
                {
                    "description": "\nA mushroom represents a single stage in the complex lifecycle of a fungus, the fruiting stage.\n\nThis cycle begins when spores germinate into slender strands that grow and connect to form a large network of filaments known as mycelium.\n\nMycelium is often hidden from plain sight but abundant in soil, leaf litter, and trees. The mycelium network of a fungus is responsible for acquiring nutrients.\n\nWhen conditions are appropriate, mycelium can give rise to above ground reproductive structures known as mushrooms.\n\nNot all fungi, however, produce mushrooms.\n\nThere may be as many as 12 million species of fungi.\n",
                    "tag": "What is a mushroom?",
                    "time": "113"
                },
                {
                    "description": "\nOak\nQuercus spp.\n\nBeech \nFagus spp.\n\nBirch\nBetula spp.\n\nHemlock\nTsuga spp.\n\nPine\nPinus spp.\n\nSpruce\nPicea spp.",
                    "tag": "Trees forming mycorrhizal relationships",
                    "time": 308
                },
                {
                    "description": "\nGilled fungi are among our recognisable mushrooms.\n\nA gilled mushrooms contains a spreading cap or pileus.\n\nMany gilled mushrooms have a stalk or stipe.\n\nUnderneath the cap is where you will find the fertile gills or lamellae.\n\nThe lamellae contain microscopic structures that forcibly discharge spores.\n\nSome gilled mushrooms have a universal veil. This covers the entire immature mushroom and eventually breaks to leave patches on the cap surface, or a sac-like structure at the base of the stem called a volva.\n\nSome gilled mushrooms also have a partial veil which covers the gills of an immature mushroom. This partial veil breaks to leave a ring, ring zone or annulus, around the stem.",
                    "tag": "Gilled fungi",
                    "time": 448
                },
                {
                    "description": "\nPolypore mushrooms have fertile tubes and spores underneath their caps",
                    "tag": "Polypore fungi",
                    "time": 520
                },
                {
                    "description": "\nBolete mushrooms typically have tubes and pores underneath their caps.",
                    "tag": "Bolete fungi",
                    "time": "527"
                },
                {
                    "description": "\nToothed mushrooms have teeth or spines that contain fertile structures.",
                    "tag": "Toothed fungi",
                    "time": 520
                },
                {
                    "description": "\nChanterelles have blunt folds or ridges.",
                    "tag": "Chanterelles and allies",
                    "time": "541"
                },
                {
                    "description": "",
                    "tag": "Club and coral fungi",
                    "time": "545"
                },
                {
                    "description": "",
                    "tag": "Puffball fungi",
                    "time": "552"
                },
                {
                    "description": "",
                    "tag": "Stinkhorn fungi",
                    "time": "555"
                },
                {
                    "description": "",
                    "tag": "Crust fungi",
                    "time": "559"
                },
                {
                    "description": "\n",
                    "tag": "Cup fungi",
                    "time": "567"
                },
                {
                    "description": "\n",
                    "tag": "Cordyceps fungi",
                    "time": "573"
                },
                {
                    "description": "\n",
                    "tag": "Truffle-like fungi",
                    "time": "577"
                },
                {
                    "description": "\nA mushroom's spore colour can be one way of acquiring a positive identification. \n\nTo observe a spore colour it may be necessary to take a spore print. \n\nTo take a spore print, place the fertile, or underside, of the mushroom on a surface; check the spores deposited after a few hours, and note their colour. This may help, in addition to morphological features, in arriving at a positive identification.",
                    "tag": "Spore colour",
                    "time": "583"
                },
                {
                    "description": "\nMushroom safety guidelines\n\n-  Start small\n-  Cook well\n-  Cook all wild, edible mushrooms\n-  Be 100% positive of your ID before consuming a wild, edible mushroom\n-  Forage from clean habitats\n-  When in doubt, learn to properly identify your mushroom",
                    "tag": "Edible mushrooms",
                    "time": "874"
                },
                {
                    "description": "\nResearch suggests that certain species of fungi, and more specifically their bioactive compounds, may offer support for mental health issues, immune system regulation, and in the treatment of certain types of cancer.\n\nA few mushrooms worth investigating\n\nTurkey tail\nTrametes versicolor\n\nLion's mane\nHericium erinaceus\n\nReishi\nGanoderma spp.\n\nCordyceps\nCordyceps militaris\n\nMaitake\nGrifola frondosa\n\nChaga\nInonotus obliquus\n\nBirch polypore\nFomitopsis betulina",
                    "tag": "Medicinal mushrooms",
                    "time": "1525"
                }
            ],
            "producer": "Adam Haritan, Learn Your Land",
            "reviewState": "Lesson Quiz",
            "showVideoIconClass": "",
            "species": [{
                    "description": "Grow terrestrially, from the soil.\n\nAssociated with elm, tulip poplar, apple, sycamore, hickory, ash and pine.",
                    "eolId": "187840",
                    "eolName": "Morchella elata Fr., 1822",
                    "iconicTaxon": "fungi",
                    "images": [{
                            "license": "http://creativecommons.org/licenses/by/2.0/",
                            "photographer": {
                                "full_name": "<a href='http://www.flickr.com/photos/61021753@N02'>Biodiversity Heritage Library</a>",
                                "homepage": "http://www.flickr.com/photos/61021753@N02",
                                "role": "photographer"
                            },
                            "rightsHolder": "Biodiversity Heritage Library",
                            "source": "https://www.flickr.com/photos/biodivlibrary/6459650839/",
                            "title": "n137_w1150",
                            "url": "80/a0/6a/542.6459650839.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "This image was created by user Dan Molter (shroomydan) at Mushroom Observer, a source for mycological images.You can contact this user here. English | español | français | italiano | македонски | português | +/−",
                            "source": "https://commons.wikimedia.org/wiki/File:Morchella_elata_83538.jpg",
                            "title": "Morchella elata 83538.jpg",
                            "url": "55/38/be/509.10274445.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "Jason Hollinger",
                            "source": "https://commons.wikimedia.org/wiki/File:Black_Morel2.jpg",
                            "title": "Black Morel2.jpg",
                            "url": "56/6a/9c/509.15953983.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "",
                            "source": "https://commons.wikimedia.org/wiki/File:Morchella_elata_83503.jpg",
                            "title": "Morchella elata 83503.jpg",
                            "url": "5a/39/fb/509.10274406.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "Klevsand",
                            "source": "https://commons.wikimedia.org/wiki/File:Morchella_elata_closeup.jpg",
                            "title": "Morchella elata closeup.jpg",
                            "url": "60/5d/54/509.40472757.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/publicdomain/",
                            "photographer": "",
                            "rightsHolder": "",
                            "source": "https://commons.wikimedia.org/wiki/File:Morilles.JPG",
                            "title": "Morilles.JPG",
                            "url": "60/92/52/509.4101879.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "Scott Darbey",
                            "source": "https://commons.wikimedia.org/wiki/File:A_young_%27Black_Morel%27,_Morchella_elata_(14004871422).jpg",
                            "title": "File:A young 'Black Morel', Morchella elata (14004871422).jpg",
                            "url": "60/d3/8b/509.42235526.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "Scott Darbey",
                            "source": "https://commons.wikimedia.org/wiki/File:Black_Morel,_Morchella_elata_(8678419694).jpg",
                            "title": "Black Morel, Morchella elata (8678419694).jpg",
                            "url": "60/d3/ea/509.42235941.jpg"
                        }
                    ],
                    "name": "Morchella angusticeps",
                    "names": [{
                            "language": "en",
                            "vernacularName": "Eastern black morel"
                        },
                        {
                            "language": "en",
                            "vernacularName": "Black morel"
                        },
                        {
                            "language": "es",
                            "vernacularName": "Colmena"
                        },
                        {
                            "language": "es",
                            "vernacularName": "Colmenilla"
                        },
                        {
                            "language": "es",
                            "vernacularName": "Colmenita"
                        },
                        {
                            "language": "es",
                            "vernacularName": "Elote"
                        },
                        {
                            "language": "es",
                            "vernacularName": "Elotito"
                        },
                        {
                            "language": "es",
                            "vernacularName": "Keyicho"
                        },
                        {
                            "language": "es",
                            "vernacularName": "Mazorca"
                        },
                        {
                            "language": "es",
                            "vernacularName": "Morilla"
                        },
                        {
                            "language": "es",
                            "vernacularName": "Morillón"
                        },
                        {
                            "language": "es",
                            "vernacularName": "Murugula"
                        },
                        {
                            "language": "es",
                            "vernacularName": "Olote"
                        },
                        {
                            "language": "es",
                            "vernacularName": "Pancita"
                        },
                        {
                            "language": "es",
                            "vernacularName": "En castellano: colmenilla, morilla, cagarria; en catalán: murgula; y en vascuense: tripa-riza."
                        }
                    ],
                    "taxonomy": {
                        "class": "Pezizomycetes",
                        "family": "Morchellaceae",
                        "genus": "Morchella",
                        "kingdom": "Fungi",
                        "order": "Pezizales",
                        "phylum": "Ascomycota"
                    },
                    "time": [
                        986
                    ]
                },
                {
                    "description": "Forms mycorrhizal relationships with oaks and hemlock.\n\nGrows terrestrially, from soil.\n\nVase-shaped morphology. Underside: blunt folds or ridges.\n\nFound summer and autumn.",
                    "eolId": "47393091",
                    "eolName": "Cantharellus lateritius",
                    "iconicTaxon": "fungi",
                    "images": [{
                            "license": "http://creativecommons.org/licenses/by-sa/4.0/",
                            "photographer": "",
                            "rightsHolder": "Fluff Berger",
                            "source": "https://www.inaturalist.org/photos/1030632",
                            "title": "",
                            "url": "28/2e/9b/18.https___www_inaturalist_org_photos_1030632.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/4.0/",
                            "photographer": "",
                            "rightsHolder": "Marlo Perdicas",
                            "source": "https://www.inaturalist.org/photos/1090034",
                            "title": "",
                            "url": "28/7c/dd/18.https___www_inaturalist_org_photos_1090034.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/4.0/",
                            "photographer": "",
                            "rightsHolder": "Katja Schulz",
                            "source": "https://www.inaturalist.org/photos/4228682",
                            "title": "",
                            "url": "3b/54/9e/18.https___www_inaturalist_org_photos_4228682.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/4.0/",
                            "photographer": "",
                            "rightsHolder": "Fluff Berger",
                            "source": "https://www.inaturalist.org/photos/434011",
                            "title": "",
                            "url": "3b/ff/68/18.https___www_inaturalist_org_photos_434011.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/4.0/",
                            "photographer": "",
                            "rightsHolder": "Fluff Berger",
                            "source": "https://www.inaturalist.org/photos/434015",
                            "title": "",
                            "url": "3b/ff/72/18.https___www_inaturalist_org_photos_434015.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/4.0/",
                            "photographer": "",
                            "rightsHolder": "Fluff Berger",
                            "source": "https://www.inaturalist.org/photos/434016",
                            "title": "",
                            "url": "3b/ff/75/18.https___www_inaturalist_org_photos_434016.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/4.0/",
                            "photographer": "",
                            "rightsHolder": "Fluff Berger",
                            "source": "https://www.inaturalist.org/photos/5453254",
                            "title": "",
                            "url": "42/46/76/18.https___www_inaturalist_org_photos_5453254.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/4.0/",
                            "photographer": "",
                            "rightsHolder": "Fluff Berger",
                            "source": "https://www.inaturalist.org/photos/6142219",
                            "title": "",
                            "url": "46/99/a7/18.https___www_inaturalist_org_photos_6142219.jpg"
                        }
                    ],
                    "name": "Cantharellus lateritius",
                    "names": [{
                        "language": "en",
                        "vernacularName": "Smooth chanterelle"
                    }],
                    "taxonomy": {
                        "class": "Agaricomycetes",
                        "family": "Cantharellaceae",
                        "genus": "Cantharellus",
                        "kingdom": "Fungi",
                        "order": "Cantharellales",
                        "phylum": "Basidiomycota"
                    },
                    "time": [
                        1051
                    ]
                },
                {
                    "description": "Lions' mane\n\nThe only similar mushrooms are in the same genus, and all are considered edible.\n\nConsists of a cushiony mass of downward pointing teeth or spines.\n\nGrows directly on wood, typically hardwood, living or dead, summer through autumn. ",
                    "eolId": 1016541,
                    "eolName": "Hericium erinaceus (Bull.) Pers. 1797",
                    "iconicTaxon": "fungi",
                    "images": [{
                            "license": "http://creativecommons.org/licenses/by-nc/2.0/",
                            "photographer": {
                                "full_name": "<a href='http://www.flickr.com/photos/18024068@N00'>Ken-ichi Ueda</a>",
                                "homepage": "http://www.flickr.com/photos/18024068@N00",
                                "role": "photographer"
                            },
                            "rightsHolder": "Ken-ichi Ueda",
                            "source": "https://www.flickr.com/photos/ken-ichi/306425098/",
                            "title": "Yay, Hericium!",
                            "url": "7f/46/1c/542.306425098.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Hericium_erinaceum_on_an_old_tree_in_Shave_Wood,_New_Forest_-_geograph.org.uk_-_254892.jpg",
                            "title": "Hericium erinaceum on an old tree in Shave Wood, New Forest - geograph.org.uk - 254892.jpg",
                            "url": "55/7d/5d/509.11283568.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Igelstachelbart,_Hericium_erinaceus22.jpg",
                            "title": "Igelstachelbart, Hericium erinaceus22.jpg",
                            "url": "56/5a/e2/509.15687356.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:2006-11-03_Hericium_erinaceus_crop.jpg",
                            "title": "2006-11-03 Hericium erinaceus crop.jpg",
                            "url": "57/a8/27/509.21942390.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Lions_Mane_(4501233135).jpg",
                            "title": "Lions Mane (4501233135).jpg",
                            "url": "58/20/94/509.24213834.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Hericium_erinaceum_on_an_old_tree_-UK.jpg",
                            "title": "Hericium erinaceum on an old tree -UK.jpg",
                            "url": "58/85/2a/509.25557204.jpg"
                        }
                    ],
                    "name": "Hericium erinaceus",
                    "names": [{
                            "language": "en",
                            "vernacularName": "lion's mane"
                        },
                        {
                            "language": "en",
                            "vernacularName": "Pom-pom Mushroom"
                        },
                        {
                            "language": "en",
                            "vernacularName": "Bearded Tooth"
                        }
                    ],
                    "taxonomy": {
                        "class": "Agaricomycetes",
                        "family": "Hericiaceae",
                        "kingdom": "Fungi",
                        "order": "Russulales",
                        "phylum": "Basidiomycota"
                    },
                    "time": [
                        1194
                    ]
                },
                {
                    "description": "Oyster mushroom\n\nGrows all year round, on wood.\n\nCap is white, green, cream, tan, yellow or brown.\n\nGills run down the stalk (decurrent).",
                    "eolId": 1028614,
                    "eolName": "Pleurotus ostreatus (Jacq.) P. Kumm. 1871",
                    "iconicTaxon": "fungi",
                    "images": [{
                            "license": "http://creativecommons.org/licenses/by-nc-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from BioImages DwCA without owner",
                            "source": "http://www.bioimages.org.uk/html/../image.php?id=16180",
                            "title": "Caps - in situ",
                            "url": "89/88/d5/549.BI-image-16180.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-nc-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from BioImages DwCA without owner",
                            "source": "http://www.bioimages.org.uk/html/../image.php?id=20661",
                            "title": "Fruitbody - underside showing gills - lain down",
                            "url": "89/9b/70/549.BI-image-20661.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Austernpilze_01-smy.jpg",
                            "title": "Austernpilze 01-smy.jpg",
                            "url": "55/76/36/509.11187772.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/publicdomain/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Austernseitling-1.jpg",
                            "title": "Austernseitling-1.jpg",
                            "url": "55/dd/7d/509.1281377.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Frozen_fungus_(Oyster_mushroom)_-_geograph.org.uk_-_1713740.jpg",
                            "title": "Frozen fungus (Oyster mushroom) - geograph.org.uk - 1713740.jpg",
                            "url": "56/0e/da/509.14434355.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Oyster_Mushrooms,_Tile_Wood_-_geograph.org.uk_-_643622.jpg",
                            "title": "Oyster Mushrooms, Tile Wood - geograph.org.uk - 643622.jpg",
                            "url": "56/13/55/509.14550501.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Pleurotus_ostreatus.001.COPY.jpg",
                            "title": "Pleurotus ostreatus.001.COPY.jpg",
                            "url": "56/24/1d/509.14766169.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Pleurotus_ostreatus_405.jpg",
                            "title": "Pleurotus ostreatus 405.jpg",
                            "url": "56/6b/fc/509.15972977.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Pleurotus_ostreatus_in_autumn_2011_(2).jpg",
                            "title": "Pleurotus ostreatus in autumn 2011 (2).jpg",
                            "url": "56/b3/1e/509.17320437.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Pleurotus_ostreatus_in_autumn_2011_(1).jpg",
                            "title": "Pleurotus ostreatus in autumn 2011 (1).jpg",
                            "url": "56/b3/1f/509.17320438.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:2010-10-28_Pleurotus_ostreatus_(Jacq.)_P._Kumm_116409_cropped.jpg",
                            "title": "2010-10-28 Pleurotus ostreatus (Jacq.) P. Kumm 116409 cropped.jpg",
                            "url": "56/b5/68/509.17374148.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Pleurotus_ostreatus_-_Pleurote_en_hu%C3%AEtre_cropped.jpg",
                            "title": "File:Pleurotus ostreatus - Pleurote en huÃ®tre cropped.jpg",
                            "url": "56/b5/75/509.17375021.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:2011-10-19_Pleurotus_ostreatus.jpg",
                            "title": "2011-10-19 Pleurotus ostreatus.jpg",
                            "url": "56/c0/a9/509.17584853.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Austernpilz_Pleurotus_ostreatus.jpg",
                            "title": "Austernpilz Pleurotus ostreatus.jpg",
                            "url": "56/c7/97/509.17729842.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Gilled_mushroom_cluster_2011-12-27_03.jpg",
                            "title": "Gilled mushroom cluster 2011-12-27 03.jpg",
                            "url": "56/e1/36/509.18145636.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:NPR_Libicky_luh_04_hliva.jpg",
                            "title": "NPR Libicky luh 04 hliva.jpg",
                            "url": "57/07/eb/509.18791982.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/publicdomain/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Agaricus_ostreatus_%E2%80%94_Flora_Batava_%E2%80%94_Volume_v10.jpg",
                            "title": "File:Agaricus ostreatus â\u0080\u0094 Flora Batava â\u0080\u0094 Volume v10.jpg",
                            "url": "57/0d/a0/509.18902265.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Pleurotus_ostreatus.R.H._04.jpg",
                            "starred": true,
                            "title": "Pleurotus ostreatus.R.H. 04.jpg",
                            "url": "57/51/49/509.20083365.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Pleurotus_ostreatus.R.H._05.jpg",
                            "title": "Pleurotus ostreatus.R.H. 05.jpg",
                            "url": "57/51/4a/509.20083366.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Pleurotus_ostreatus.R.H._08.jpg",
                            "title": "Pleurotus ostreatus.R.H. 08.jpg",
                            "url": "57/51/4d/509.20083369.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Pleurotus_ostreatus_G3.jpg",
                            "title": "Pleurotus ostreatus G3.jpg",
                            "url": "57/bc/4c/509.22361463.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/publicdomain/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Pleurotus_ostreatus,_Japan_1.JPG",
                            "title": "Pleurotus ostreatus, Japan 1.JPG",
                            "url": "57/ee/64/509.22946181.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Oyster_mushoom_fells.jpg",
                            "title": "Oyster mushoom fells.jpg",
                            "url": "58/af/87/509.263869.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Pleurotus_ostreatus_1.JPG",
                            "title": "Pleurotus ostreatus 1.JPG",
                            "url": "59/56/e3/509.3005251.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Paddenstoelen_op_els_01.JPG",
                            "title": "Paddenstoelen op els 01.JPG",
                            "url": "59/56/e9/509.30054431.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Paddenstoelen_op_een_vlier_(Sambucus_nigra)_03.JPG",
                            "title": "Paddenstoelen op een vlier (Sambucus nigra) 03.JPG",
                            "url": "59/5f/33/509.30241708.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Austern_Sabine_u._Holger.JPG",
                            "title": "Austern Sabine u. Holger.JPG",
                            "url": "59/9e/6b/509.31676931.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Austernseitling_(3).jpg",
                            "title": "Austernseitling (3).jpg",
                            "url": "59/9e/72/509.31676978.jpg"
                        }
                    ],
                    "name": "Pleurotus ostreatus",
                    "names": [{
                            "language": "en",
                            "vernacularName": "Oyster mushroom"
                        },
                        {
                            "language": "de",
                            "vernacularName": "Austernseitling"
                        },
                        {
                            "language": "de",
                            "vernacularName": "Austernpilz"
                        },
                        {
                            "language": "de",
                            "vernacularName": "Kalbfleischpilz"
                        },
                        {
                            "language": "en",
                            "vernacularName": "Tree oyster mushroom"
                        },
                        {
                            "language": "en",
                            "vernacularName": "Pearl oyster mushroom"
                        },
                        {
                            "language": "es",
                            "vernacularName": "orellanes"
                        },
                        {
                            "language": "es",
                            "vernacularName": "pleuroto ostreato"
                        },
                        {
                            "language": "fr",
                            "vernacularName": "Pleurote en huître"
                        },
                        {
                            "language": "it",
                            "vernacularName": "Pinella"
                        },
                        {
                            "language": "it",
                            "vernacularName": "agarico ostreato"
                        },
                        {
                            "language": "it",
                            "vernacularName": "bertolana"
                        },
                        {
                            "language": "it",
                            "vernacularName": "gelone"
                        },
                        {
                            "language": "pt",
                            "vernacularName": "shimeji-preto"
                        },
                        {
                            "language": "pt",
                            "vernacularName": "cogumelo ostra"
                        }
                    ],
                    "taxonomy": {
                        "class": "Agaricomycetes",
                        "family": "Pleurotaceae",
                        "kingdom": "Fungi",
                        "order": "Agaricales",
                        "phylum": "Basidiomycota"
                    },
                    "terms": [
                        "Mycoremediation",
                        "Inrolled margin",
                        "Undulate"
                    ],
                    "time": [
                        1016
                    ]
                },
                {
                    "description": "Black trumpet\n\nSimilar features to the chanterelles.\n\nMycorrhizal with oak, hemlock, and pine.\n\nFound in summer and autumn.\n\nVase-shaped with folds and ridges rather than clearly defined plate-like gills.\n\n",
                    "eolId": "6666736",
                    "eolName": "Craterellus fallax A. H. Sm., 1968",
                    "iconicTaxon": "fungi",
                    "images": [{
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "",
                            "source": "https://commons.wikimedia.org/wiki/File:Craterellus_fallax_-_Horn_of_Plenty.jpg",
                            "title": "File:Craterellus fallax - Horn of Plenty.jpg",
                            "url": "5b/6b/6c/509.15946993.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "Jsunseri85",
                            "source": "https://commons.wikimedia.org/wiki/File:Craterellus_fallax_.jpg",
                            "title": "Craterellus fallax .jpg",
                            "url": "63/9f/f6/509.50059065.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "Jsunseri85",
                            "source": "https://commons.wikimedia.org/wiki/File:Craterellus_fallax_2.jpg",
                            "title": "Craterellus fallax 2.jpg",
                            "url": "63/9f/f7/509.50059087.jpg"
                        }
                    ],
                    "name": "Craterellus fallax",
                    "names": [{
                            "language": "it",
                            "vernacularName": "trombetta dei morti"
                        },
                        {
                            "language": "de",
                            "vernacularName": "Toten"
                        },
                        {
                            "language": "de",
                            "vernacularName": "Herbsttrompete"
                        },
                        {
                            "language": "en",
                            "vernacularName": "horn of plenty"
                        },
                        {
                            "language": "fr",
                            "vernacularName": "trompette de la mort"
                        },
                        {
                            "language": "fr",
                            "vernacularName": "trompette des morts"
                        },
                        {
                            "language": "pt",
                            "vernacularName": "Trompeta-da-morte"
                        },
                        {
                            "language": "pt",
                            "vernacularName": "Trompeta"
                        },
                        {
                            "language": "pt",
                            "vernacularName": "Corneta"
                        },
                        {
                            "language": "pt",
                            "vernacularName": "corno da abundância"
                        },
                        {
                            "language": "pt",
                            "vernacularName": "orelha-de-morcego"
                        },
                        {
                            "language": "pt",
                            "vernacularName": "viuvinha"
                        }
                    ],
                    "taxonomy": {
                        "class": "Agaricomycetes",
                        "family": "Cantharellaceae",
                        "genus": "Craterellus",
                        "kingdom": "Fungi",
                        "order": "Cantharellales",
                        "phylum": "Basidiomycota"
                    },
                    "time": [
                        1083
                    ]
                },
                {
                    "description": "Chicken of the woods\n\nLarge, bright orange caps, found in late spring, summer and autumn.\n\nYellow pores instead of gills on the underside.\n\n",
                    "eolId": 191234,
                    "eolName": "Laetiporus sulphureus (Bull.) Murrill 1920",
                    "iconicTaxon": "fungi",
                    "images": [{
                            "license": "http://creativecommons.org/licenses/by-nc/2.0/",
                            "photographer": {
                                "full_name": "<a href='http://www.flickr.com/photos/14140210@N08'>Julian Black</a>",
                                "homepage": "http://www.flickr.com/photos/14140210@N08",
                                "role": "photographer"
                            },
                            "rightsHolder": "Julian Black",
                            "source": "https://www.flickr.com/photos/blackartz/4897509581/",
                            "title": "Chicken of the Woods (Laetiporus sulphureus)",
                            "url": "80/1a/59/542.4897509581.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-nc-sa/2.0/",
                            "photographer": {
                                "full_name": "<a href='http://www.flickr.com/photos/54361172@N02'>Dianne Frost</a>",
                                "homepage": "http://www.flickr.com/photos/54361172@N02",
                                "role": "photographer"
                            },
                            "rightsHolder": "Dianne Frost",
                            "source": "https://www.flickr.com/photos/dkfrost/5875013894/",
                            "title": "Chicken of the Woods (Laetiporus sulphureus)",
                            "url": "80/67/fa/542.5875013894.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/2.0/",
                            "photographer": {
                                "full_name": "<a href='http://www.flickr.com/photos/68932647@N00'>Tim Sheerman-Chase</a>",
                                "homepage": "http://www.flickr.com/photos/68932647@N00",
                                "role": "photographer"
                            },
                            "rightsHolder": "Tim Sheerman-Chase",
                            "source": "https://www.flickr.com/photos/tim_uk/9648696600/",
                            "title": "Fungal",
                            "url": "81/97/ee/542.9648696600.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/2.0/",
                            "photographer": {
                                "full_name": "<a href='http://www.flickr.com/photos/87724820@N06'>Danny Haelewaters</a>",
                                "homepage": "http://www.flickr.com/photos/87724820@N06",
                                "role": "photographer"
                            },
                            "rightsHolder": "Danny Haelewaters",
                            "source": "https://www.flickr.com/photos/dhaelewa/9847744766/",
                            "title": "Laetiporus sulphureus - chicken of the woods",
                            "url": "81/9f/41/542.9847744766.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-nc-sa/2.0/",
                            "photographer": {
                                "full_name": "<a href='http://www.flickr.com/photos/100815078@N03'>Sarah Gregg</a>",
                                "homepage": "http://www.flickr.com/photos/100815078@N03",
                                "role": "photographer"
                            },
                            "rightsHolder": "Sarah Gregg",
                            "source": "https://www.flickr.com/photos/wild-eyes/9870412723/",
                            "title": "Laetiporus sulphureus SRD807-C022",
                            "url": "81/9f/a8/542.9870412723.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/publicdomain/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Chicken_of_the_Woods_-_Laetiporus_sulphureus.JPG",
                            "title": "Chicken of the Woods - Laetiporus sulphureus.JPG",
                            "url": "55/73/bc/509.11144627.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Baumpilz_Gotha_2010.JPG",
                            "title": "Baumpilz Gotha 2010.JPG",
                            "url": "55/b5/47/509.12337524.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Laetiporus_sulphureus_J1.JPG",
                            "title": "Laetiporus sulphureus J1.JPG",
                            "url": "56/34/7f/509.15093970.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Laetiporus_sulphureus_JPG01.jpg",
                            "title": "Laetiporus sulphureus JPG01.jpg",
                            "url": "56/3a/38/509.1517795.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Laetiporus_sulphureus_04.jpg",
                            "title": "Laetiporus sulphureus 04.jpg",
                            "url": "56/7e/37/509.162622.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Yellow_mushroom_on_old_oak_tree3.jpg",
                            "title": "Yellow mushroom on old oak tree3.jpg",
                            "url": "56/e0/a3/509.181368.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Laetiporus_sulphureus_OB10.jpg",
                            "title": "Laetiporus sulphureus OB10.jpg",
                            "url": "57/2d/db/509.19531106.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Laetiporus_sulphureus_(Spreewald,_II).JPG",
                            "starred": true,
                            "title": "Laetiporus sulphureus (Spreewald, II).JPG",
                            "url": "57/78/a8/509.20892891.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Laetiporus_sulphureus_(Spreewald).JPG",
                            "title": "Laetiporus sulphureus (Spreewald).JPG",
                            "url": "57/78/a9/509.20892892.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Laetiporus_sulphureus_(Bulliard_and_Murill_1920).jpg",
                            "title": "Laetiporus sulphureus (Bulliard and Murill 1920).jpg",
                            "url": "57/a2/68/509.21827634.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Laetiporus_sulphureus_R.H._09.jpg",
                            "title": "Laetiporus sulphureus R.H. 09.jpg",
                            "url": "58/2f/1f/509.24405506.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Svavelticka_(Lindome,_2013-05-29).jpg",
                            "title": "Svavelticka (Lindome, 2013-05-29).jpg",
                            "url": "58/b0/9f/509.26400219.jpg"
                        }
                    ],
                    "name": "Laetiporus sulphureus",
                    "names": [{
                            "language": "de",
                            "vernacularName": "Gemeiner Schwefelporling"
                        },
                        {
                            "language": "de",
                            "vernacularName": "Schwefelgelber Porling"
                        },
                        {
                            "language": "de",
                            "vernacularName": "Schwefelporling"
                        },
                        {
                            "language": "en",
                            "vernacularName": "Chicken of the Woods"
                        },
                        {
                            "language": "en",
                            "vernacularName": "Sulphur Shelf"
                        },
                        {
                            "language": "en",
                            "vernacularName": "Bracket Fungus"
                        },
                        {
                            "language": "en",
                            "vernacularName": "Chicken Mushroom"
                        },
                        {
                            "language": "en",
                            "vernacularName": "Sulphur shelf mushroom"
                        },
                        {
                            "language": "en",
                            "vernacularName": "chicken-of-the-woods"
                        },
                        {
                            "language": "en",
                            "vernacularName": "sulfur polypore"
                        },
                        {
                            "language": "en",
                            "vernacularName": "sulfur shelf"
                        },
                        {
                            "language": "en",
                            "vernacularName": "sulphur polypore"
                        },
                        {
                            "language": "pt",
                            "vernacularName": "Frango Da Floresta"
                        },
                        {
                            "language": "pt",
                            "vernacularName": "cogumelo de prateleira de enxofre"
                        },
                        {
                            "language": "fr",
                            "vernacularName": "Polypore soufré"
                        }
                    ],
                    "taxonomy": {
                        "class": "Agaricomycetes",
                        "family": "Fomitopsidaceae",
                        "kingdom": "Fungi",
                        "order": "Polyporales",
                        "phylum": "Basidiomycota"
                    },
                    "terms": [
                        "Pore",
                        "Saprophyte",
                        "Saprotrophic",
                        "Conk",
                        "Polypore",
                        "Bioindicator"
                    ],
                    "time": [
                        1114
                    ]
                },
                {
                    "description": "White pored chicken of the woods\n\nFound on or near deciduous trees and conifers, living or dead.",
                    "eolId": 47391423,
                    "eolName": "Laetiporus cincinnatus (Morgan) Burds., Banik & T. J. Volk 1998",
                    "iconicTaxon": "fungi",
                    "images": [{
                            "license": "http://creativecommons.org/licenses/by-sa/4.0/",
                            "photographer": "",
                            "rightsHolder": "Fluff Berger",
                            "source": "https://www.inaturalist.org/photos/4182373",
                            "title": "",
                            "url": "3b/0b/61/18.https___www_inaturalist_org_photos_4182373.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/4.0/",
                            "photographer": "",
                            "rightsHolder": "michael_hodge",
                            "source": "https://www.inaturalist.org/photos/4432675",
                            "starred": true,
                            "title": "",
                            "url": "3c/93/8a/18.https___www_inaturalist_org_photos_4432675.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/4.0/",
                            "photographer": "",
                            "rightsHolder": "Benjamin Dion",
                            "source": "https://www.inaturalist.org/photos/6084680",
                            "title": "",
                            "url": "46/35/4c/18.https___www_inaturalist_org_photos_6084680.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/4.0/",
                            "photographer": "",
                            "rightsHolder": "Benjamin Dion",
                            "source": "https://www.inaturalist.org/photos/6084682",
                            "title": "",
                            "url": "46/35/4e/18.https___www_inaturalist_org_photos_6084682.jpg"
                        }
                    ],
                    "name": "Laetiporus cincinnatus",
                    "names": [{
                        "language": "en",
                        "shortForm": "WP chicken of the woods",
                        "vernacularName": "White-pored chicken of the woods"
                    }],
                    "taxonomy": {
                        "class": "Agaricomycetes",
                        "family": "Fomitopsidaceae",
                        "kingdom": "Fungi",
                        "order": "Polyporales",
                        "phylum": "Basidiomycota"
                    },
                    "time": [
                        1145
                    ]
                },
                {
                    "description": "Giant puffball\n\nEasy to identify.\n\nEdible when the insides are still white; with age they become discoloured olive, yellow or purple.",
                    "eolId": 1005378,
                    "eolName": "Calvatia gigantea (Batsch) Lloyd 1904",
                    "iconicTaxon": "fungi",
                    "images": [{
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Riesenbovist_Calvatia_gigantea.JPG",
                            "title": "Riesenbovist Calvatia gigantea.JPG",
                            "url": "5f/ab/de/509.37323516.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Riesenbovis_hexenring.jpg",
                            "title": "Riesenbovis hexenring.jpg",
                            "url": "55/5b/95/509.1077650.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Red_River_Gorge_-_Calvatia_gigantea_1.jpg",
                            "title": "Red River Gorge - Calvatia gigantea 1.jpg",
                            "url": "55/5c/52/509.10787039.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Puff_Ball_near_Appleridge_Farm_-_geograph.org.uk_-_250321.jpg",
                            "title": "Puff Ball near Appleridge Farm - geograph.org.uk - 250321.jpg",
                            "url": "55/7d/72/509.11286079.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Giant_Puffball_by_Tong_Lane_-_geograph.org.uk_-_960748.jpg",
                            "title": "Giant Puffball by Tong Lane - geograph.org.uk - 960748.jpg",
                            "url": "55/fb/af/509.13658005.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Langermannia_gigantea_(04).jpg",
                            "title": "Langermannia gigantea (04).jpg",
                            "url": "56/11/0a/509.14516841.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Calvatia_gigantea.jpg",
                            "title": "Calvatia gigantea.jpg",
                            "url": "56/4e/31/509.15504239.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Big_white_mushroom_Giants_bovist_Holland.jpg",
                            "title": "Big white mushroom Giants bovist Holland.jpg",
                            "url": "58/a5/fe/509.26171553.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Red_River_Gorge_-_Calvatia_gigantea_1.jpg",
                            "title": "Red River Gorge - Calvatia gigantea 1.jpg",
                            "url": "5a/5d/92/509.10787039.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Giant_Puff-Ball_Fungus_-_geograph.org.uk_-_261538.jpg",
                            "title": "Giant Puff-Ball Fungus - geograph.org.uk - 261538.jpg",
                            "url": "5a/b3/b8/509.12284121.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/publicdomain/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Nouvel_atlas_de_poche_des_champignons_comestibles_et_v%C3%A9n%C3%A9neux_(Pl._55)_BHL3895023.jpg",
                            "title": "File:Nouvel atlas de poche des champignons comestibles et vÃ©nÃ©neux (Pl. 55) BHL3895023.jpg",
                            "url": "61/89/e9/509.44602640.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Riesenbovist.jpg",
                            "starred": true,
                            "title": "Riesenbovist.jpg",
                            "url": "63/0f/36/509.479793.jpg"
                        }
                    ],
                    "name": "Calvatia gigantea",
                    "names": [{
                            "eol_preferred": true,
                            "language": "de",
                            "vernacularName": "Riesenbovist"
                        },
                        {
                            "language": "de",
                            "vernacularName": "Riesenstäubling"
                        },
                        {
                            "eol_preferred": true,
                            "language": "en",
                            "vernacularName": "Giant puffball"
                        },
                        {
                            "eol_preferred": true,
                            "language": "fr",
                            "vernacularName": "Vesse-de-loup géante"
                        },
                        {
                            "language": "fr",
                            "vernacularName": "Calvatie géante"
                        },
                        {
                            "language": "fr",
                            "vernacularName": "Tête de mort"
                        }
                    ],
                    "taxonomy": {
                        "class": "Agaricomycetes",
                        "family": "Agaricaceae",
                        "kingdom": "Fungi",
                        "order": "Agaricales",
                        "phylum": "Basidiomycota"
                    },
                    "terms": [
                        "Spore",
                        "Polyphyletic",
                        "Styptic"
                    ],
                    "time": [
                        1223
                    ]
                },
                {
                    "description": "Destroying angel\n\nComprises a group of closely related mycorrhizal species that contain amatoxins.\n\nAll nearly pure white and grow directly from soil, typically in summer and autumn.\n\nThey have a partial veil that breaks off to leave a ring or annulus around the stalk.\n",
                    "eolId": "6691605",
                    "eolName": "Amanita bisporigera G. F. Atk., 1906",
                    "iconicTaxon": "fungi",
                    "images": [{
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "00Amanita00",
                            "source": "https://commons.wikimedia.org/wiki/File:Amanita.bisporigera.002..jpg",
                            "title": "Amanita.bisporigera.002..jpg",
                            "url": "56/2a/62/509.14896724.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "Jarek Tuszyński",
                            "source": "https://commons.wikimedia.org/wiki/File:Adirondacks_-_mushrooms_-_04.JPG",
                            "title": "Adirondacks - mushrooms - 04.JPG",
                            "url": "59/17/1c/509.28430751.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "",
                            "source": "https://commons.wikimedia.org/wiki/File:Adirondacks_-_mushrooms_-_05.JPG",
                            "title": "Adirondacks - mushrooms - 05.JPG",
                            "url": "5e/18/5d/509.28430754.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "Dan Molter (shroomydan)",
                            "source": "https://commons.wikimedia.org/wiki/File:Amanita_bisporigera_55047.jpg",
                            "title": "Amanita bisporigera 55047.jpg",
                            "url": "67/de/52/509.8043510.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "Dan Molter (shroomydan)",
                            "source": "https://commons.wikimedia.org/wiki/File:Amanita_bisporigera_17933.jpg",
                            "title": "Amanita bisporigera 17933.jpg",
                            "url": "68/00/3b/509.8314404.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "This image was created by user Dan Molter (shroomydan) at Mushroom Observer, a source for mycological images.You can contact this user here. English | español | français | italiano | македонски | português | +/−",
                            "source": "https://commons.wikimedia.org/wiki/File:Amanita_bisporigera_15954.jpg",
                            "title": "Amanita bisporigera 15954.jpg",
                            "url": "68/03/98/509.8354111.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "This image was created by user Dan Molter (shroomydan) at Mushroom Observer, a source for mycological images.You can contact this user here. English | español | français | italiano | македонски | português | +/−",
                            "source": "https://commons.wikimedia.org/wiki/File:Amanita_bisporigera_49421.jpg",
                            "title": "Amanita bisporigera 49421.jpg",
                            "url": "68/03/9b/509.8354142.jpg"
                        }
                    ],
                    "name": "Amanita bisporigera",
                    "names": [{
                            "language": "en",
                            "vernacularName": "Destroying angel"
                        },
                        {
                            "language": "en",
                            "vernacularName": "Eastern north american destroying angel"
                        }
                    ],
                    "taxonomy": {
                        "class": "Agaricomycetes",
                        "family": "Amanitaceae",
                        "genus": "Amanita",
                        "kingdom": "Fungi",
                        "order": "Agaricales",
                        "phylum": "Basidiomycota"
                    },
                    "time": [
                        1316
                    ]
                },
                {
                    "description": "Deadly Galerina\n\nContains the same class of amatoxins as found in deadly Amanita.\n\nA small brown, saprotrophic mushroom that grows directly from wood, logs and stumps or even wood chips.\n\nThe gills are rusty brown at maturity. The partial veil breaks to leave a ring or annulus around the stalk.",
                    "eolId": "189220",
                    "eolName": "Galerina marginata (Batsch) Kühner, 1935",
                    "iconicTaxon": "fungi",
                    "images": [{
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "This image was created by user Dan Molter (shroomydan) at Mushroom Observer, a source for mycological images.You can contact this user here. English | español | français | italiano | македонски | português | +/−",
                            "source": "https://commons.wikimedia.org/wiki/File:Galerina_marginata_116931.jpg",
                            "title": "Galerina marginata 116931.jpg",
                            "url": "55/9e/13/509.11911999.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "User:Strobilomyces",
                            "source": "https://commons.wikimedia.org/wiki/File:Galerina_marginata_051106Bw.jpg",
                            "title": "Galerina marginata 051106Bw.jpg",
                            "url": "55/d4/53/509.1273050.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "00Amanita00",
                            "source": "https://commons.wikimedia.org/wiki/File:Galerina.marg.001..COPY.jpg",
                            "title": "Galerina.marg.001..COPY.jpg",
                            "url": "56/2a/d6/509.14905840.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "00Amanita00",
                            "source": "https://commons.wikimedia.org/wiki/File:Galerina.marginata.1001.jpg",
                            "title": "Galerina.marginata.1001.jpg",
                            "url": "56/2a/d9/509.14905958.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "",
                            "source": "https://commons.wikimedia.org/wiki/File:2008-11-04_Galerina_marginata_(Batsch)_K%C3%BChner_27992.jpg",
                            "title": "File:2008-11-04 Galerina marginata (Batsch) KÃ¼hner 27992.jpg",
                            "url": "56/c7/09/509.17717780.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "",
                            "source": "https://commons.wikimedia.org/wiki/File:2011-10-30_Galerina_marginata_(Batsch)_K%C3%BChner_178829.jpg",
                            "title": "File:2011-10-30 Galerina marginata (Batsch) KÃ¼hner 178829.jpg",
                            "url": "56/c7/0a/509.17717812.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "Jason Hollinger",
                            "source": "https://commons.wikimedia.org/wiki/File:Deadly_Galerina_(4501855396).jpg",
                            "title": "Deadly Galerina (4501855396).jpg",
                            "url": "58/20/9a/509.24213856.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "Jason Hollinger",
                            "source": "https://commons.wikimedia.org/wiki/File:Deadly_Galerina_(2061857977).jpg",
                            "title": "Deadly Galerina (2061857977).jpg",
                            "url": "58/22/31/509.24216217.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "",
                            "source": "https://commons.wikimedia.org/wiki/File:Gifthaeubling.jpg",
                            "title": "Gifthaeubling.jpg",
                            "url": "5e/a0/f1/509.31688571.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "Agnes Monkelbaan",
                            "source": "https://commons.wikimedia.org/wiki/File:Paddenstoelen_op_dood_hout._Locatie,_Stuttebosch_in_de_lendevallei._Provincie_Friesland_001.jpg",
                            "title": "Paddenstoelen op dood hout. Locatie, Stuttebosch in de lendevallei. Provincie Friesland 001.jpg",
                            "url": "61/5f/6c/509.44091378.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "Agnes Monkelbaan",
                            "source": "https://commons.wikimedia.org/wiki/File:Paddenstoelen_op_dood_hout._Locatie,_Stuttebosch_in_de_lendevallei._Provincie_Friesland_002.jpg",
                            "title": "Paddenstoelen op dood hout. Locatie, Stuttebosch in de lendevallei. Provincie Friesland 002.jpg",
                            "url": "61/5f/6d/509.44091379.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "USFWS - Pacific Region",
                            "source": "https://commons.wikimedia.org/wiki/File:Galerina_marginata_(23766255521).jpg",
                            "title": "Galerina marginata (23766255521).jpg",
                            "url": "63/32/3e/509.48672536.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "Dan Molter (shroomydan)",
                            "source": "https://commons.wikimedia.org/wiki/File:Galerina_autumnalis_61363.jpg",
                            "title": "Galerina autumnalis 61363.jpg",
                            "url": "67/f2/4b/509.8159819.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "This image was created by user Dan Molter (shroomydan) at Mushroom Observer, a source for mycological images.You can contact this user here. English | español | français | italiano | македонски | português | +/−",
                            "source": "https://commons.wikimedia.org/wiki/File:Galerina_marginata_63678.jpg",
                            "title": "Galerina marginata 63678.jpg",
                            "url": "68/4d/48/509.9542214.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "This image was created by user Dan Molter (shroomydan) at Mushroom Observer, a source for mycological images.You can contact this user here. English | español | français | italiano | македонски | português | +/−",
                            "source": "https://commons.wikimedia.org/wiki/File:Galerina_marginata_61108.jpg",
                            "title": "Galerina marginata 61108.jpg",
                            "url": "68/4d/49/509.9542243.jpg"
                        }
                    ],
                    "name": "Galerina marginata",
                    "names": [{
                            "language": "en",
                            "vernacularName": "deadly galerina"
                        },
                        {
                            "language": "de",
                            "vernacularName": "Gifthäubling"
                        },
                        {
                            "language": "en",
                            "vernacularName": "autumn skullcap"
                        }
                    ],
                    "taxonomy": {
                        "class": "Agaricomycetes",
                        "family": "Hymenogastraceae",
                        "genus": "Galerina",
                        "kingdom": "Fungi",
                        "order": "Agaricales",
                        "phylum": "Basidiomycota"
                    },
                    "time": [
                        1364
                    ]
                },
                {
                    "description": "Green-spored Lepiota\n\nA common lawn mushroom associated with more reports of poisoning than any other mushroom in North America.\n\nA key feature is the distinctive, green spore print.",
                    "eolId": "195778",
                    "eolName": "Chlorophyllum molybdites (G. Mey.) Massee ex P. Syd. 1900",
                    "iconicTaxon": "fungi",
                    "images": [{
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "Amanita77",
                            "source": "https://commons.wikimedia.org/wiki/File:Chlorophyllum.Molybdites.001.jpg",
                            "title": "Chlorophyllum.Molybdites.001.jpg",
                            "url": "56/21/0f/509.14733109.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "Amanita77",
                            "source": "https://commons.wikimedia.org/wiki/File:Chlorophyllum.Molybdites.002.jpg",
                            "title": "Chlorophyllum.Molybdites.002.jpg",
                            "url": "56/21/11/509.14733153.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "Jason Hollinger",
                            "source": "https://commons.wikimedia.org/wiki/File:Green-Spored_Parasol_sisterhood.jpg",
                            "title": "Green-Spored Parasol sisterhood.jpg",
                            "url": "56/6b/ec/509.15972035.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "Jason Hollinger",
                            "source": "https://commons.wikimedia.org/wiki/File:Green-Spored_Parasol_young_top_and_bottom.jpg",
                            "title": "Green-Spored Parasol young top and bottom.jpg",
                            "url": "56/6b/ed/509.15972050.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "",
                            "source": "https://commons.wikimedia.org/wiki/File:2011-09-14_Chlorophyllum_molybdites_169975_cropped.jpg",
                            "title": "2011-09-14 Chlorophyllum molybdites 169975 cropped.jpg",
                            "url": "56/8f/1b/509.16659284.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "This image was created by user Richard Kneal (bloodworm) at Mushroom Observer, a source for mycological images.You can contact this user here. English | español | français | italiano | македонски | português | +/−",
                            "source": "https://commons.wikimedia.org/wiki/File:2012-08-07_Chlorophyllum_molybdites_(G._Mey.-_Fr.)_Massee_246280.jpg",
                            "title": "2012-08-07 Chlorophyllum molybdites (G. Mey.- Fr.) Massee 246280.jpg",
                            "url": "57/6b/d5/509.20563077.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "This image was created by user Richard Kneal (bloodworm) at Mushroom Observer, a source for mycological images.You can contact this user here. English | español | français | italiano | македонски | português | +/−",
                            "source": "https://commons.wikimedia.org/wiki/File:2012-08-07_Chlorophyllum_molybdites_(G._Mey.-_Fr.)_Massee_246281.jpg",
                            "title": "2012-08-07 Chlorophyllum molybdites (G. Mey.- Fr.) Massee 246281.jpg",
                            "url": "57/6b/d6/509.20563082.jpg"
                        }
                    ],
                    "name": "Chlorophyllum molybdites",
                    "names": [{
                            "language": "en",
                            "vernacularName": "Green-spored parasol"
                        },
                        {
                            "language": "de",
                            "vernacularName": "Giftiger grünsporschirmling"
                        },
                        {
                            "language": "en",
                            "vernacularName": "Green-spored lepiota"
                        },
                        {
                            "language": "fr",
                            "vernacularName": "Lépiote de morgan"
                        }
                    ],
                    "taxonomy": {
                        "class": "Agaricomycetes",
                        "family": "Agaricaceae",
                        "genus": "Chlorophyllum",
                        "kingdom": "Fungi",
                        "order": "Agaricales",
                        "phylum": "Basidiomycota"
                    },
                    "time": [
                        1394
                    ]
                },
                {
                    "description": "Jack-o'lantern\n\nMedium to large mushroom that grows in dense clusters in association with wood, in summer and autumn.\n\nA gilled mushroom.\n\nContains toxic illudin compounds.",
                    "eolId": "46706940",
                    "eolName": "Omphalotus illudens (Schwein.) Bresinsky & Besl, 1979",
                    "iconicTaxon": "fungi",
                    "images": [{
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "Jason Hollinger",
                            "source": "https://commons.wikimedia.org/wiki/File:2007-08-05_Omphalotus_illudens_(Schwein.)_Bresinsky_%26_Besl_1017356893.jpg",
                            "title": "File:2007-08-05 Omphalotus illudens (Schwein.) Bresinsky &amp; Besl 1017356893.jpg",
                            "url": "56/6b/7d/509.15963725.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "Jason Hollinger",
                            "source": "https://commons.wikimedia.org/wiki/File:2007-08-05_Omphalotus_illudens_(Schwein.)_Bresinsky_%26_Besl_1018098506.jpg",
                            "title": "File:2007-08-05 Omphalotus illudens (Schwein.) Bresinsky &amp; Besl 1018098506.jpg",
                            "url": "56/6b/7e/509.15963730.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "This image was created by user Karen (oldmanofthewoods) at Mushroom Observer, a source for mycological images.You can contact this user here.",
                            "source": "https://commons.wikimedia.org/wiki/File:2012-08-12_Omphalotus_illudens_(Schwein.)_Bresinsky_%26_Besl_248346.jpg",
                            "title": "File:2012-08-12 Omphalotus illudens (Schwein.) Bresinsky &amp; Besl 248346.jpg",
                            "url": "57/6f/57/509.20638835.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "This image was created by user Ann B. (Ann F. Berger) at Mushroom Observer, a source for mycological images.You can contact this user here.",
                            "source": "https://commons.wikimedia.org/wiki/File:2012-09-25_Omphalotus_illudens_(Schwein.)_Bresinsky_%26_Besl_270109.jpg",
                            "title": "File:2012-09-25 Omphalotus illudens (Schwein.) Bresinsky &amp; Besl 270109.jpg",
                            "url": "57/aa/db/509.21985224.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "",
                            "source": "https://commons.wikimedia.org/wiki/File:2007-08-05_Omphalotus_illudens_(Schwein.)_Bresinsky_%26_Besl_1018098506.jpg",
                            "title": "File:2007-08-05 Omphalotus illudens (Schwein.) Bresinsky &amp; Besl 1018098506.jpg",
                            "url": "5b/6c/be/509.15963730.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "",
                            "source": "https://commons.wikimedia.org/wiki/File:Jack-o%E2%80%99-lantern_Mushrooms_(Omphalotus_illudens)_(11696224466).jpg",
                            "title": "File:Jack-oâ\u0080\u0099-lantern Mushrooms (Omphalotus illudens) (11696224466).jpg",
                            "url": "5f/f1/8f/509.38629189.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "",
                            "source": "https://commons.wikimedia.org/wiki/File:Jack-o%E2%80%99-lantern_Mushrooms_(Omphalotus_illudens)_(11695721013).jpg",
                            "title": "File:Jack-oâ\u0080\u0099-lantern Mushrooms (Omphalotus illudens) (11695721013).jpg",
                            "url": "5f/f1/91/509.38629192.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/publicdomain/",
                            "photographer": "",
                            "rightsHolder": "",
                            "source": "https://commons.wikimedia.org/wiki/File:Annual_report_of_the_Regents%22_(1890-1903)_(18747189843).jpg",
                            "title": "Annual report of the Regents",
                            "url": "60/ac/17/509.41591567.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "Burt, E. A.; Farlow, W. G.; Harvard University.",
                            "source": "https://commons.wikimedia.org/wiki/File:Icones_Farlowianae_(Pl._20)_(8488367383).jpg",
                            "title": "Icones Farlowianae (Pl. 20) (8488367383).jpg",
                            "url": "61/20/7b/509.43095038.jpg"
                        }
                    ],
                    "name": "Omphalotus illudens",
                    "names": [{
                            "language": "en",
                            "vernacularName": "eastern jack-o'lantern"
                        },
                        {
                            "language": "fr",
                            "vernacularName": "Faux Clytocybe lumineux"
                        },
                        {
                            "language": "fr",
                            "vernacularName": "Clytocybe trompeur"
                        },
                        {
                            "language": "fr",
                            "vernacularName": "Clytocybe illusoire"
                        }
                    ],
                    "taxonomy": {
                        "class": "Agaricomycetes",
                        "family": "Omphalotaceae",
                        "genus": "Omphalotus",
                        "kingdom": "Fungi",
                        "order": "Agaricales",
                        "phylum": "Basidiomycota"
                    },
                    "time": [
                        1430
                    ]
                },
                {
                    "description": "Sulphur tuft\n\nSmall to medium sized mushroom with yellowish, greenish gills and purple-brown spores.\n\nGrows in clusters on deciduous and conifer trees, usually in colder months.",
                    "eolId": "1030336",
                    "eolName": "Hypholoma fasciculare (Huds.) P. Kumm., 1871",
                    "iconicTaxon": "fungi",
                    "images": [{
                            "license": "http://creativecommons.org/licenses/by/2.0/",
                            "photographer": "",
                            "rightsHolder": "Biodiversity Heritage Library",
                            "source": "https://farm9.staticflickr.com/8376/8574881848_200d0988f4_o.jpg",
                            "title": "n270_w1150",
                            "url": "00/41/a6/8.8574881848.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/2.0/",
                            "photographer": {
                                "full_name": "<a href='http://www.flickr.com/photos/92252798@N07'>Dick Culbert</a>",
                                "homepage": "http://www.flickr.com/photos/92252798@N07",
                                "role": "photographer"
                            },
                            "rightsHolder": "Dick Culbert",
                            "source": "https://www.flickr.com/photos/92252798@N07/32921103376/",
                            "title": "Hypholoma fasciculare.",
                            "url": "7f/6f/48/542.32921103376.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/2.0/",
                            "photographer": {
                                "full_name": "<a href='http://www.flickr.com/photos/32023375@N06'>Jrg Hempel</a>",
                                "homepage": "http://www.flickr.com/photos/32023375@N06",
                                "role": "photographer"
                            },
                            "rightsHolder": "Jrg Hempel",
                            "source": "https://www.flickr.com/photos/joerghempel/4237198802/",
                            "title": "Hypholoma fasciculare",
                            "url": "7f/e3/ca/542.4237198802.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/2.0/",
                            "photographer": {
                                "full_name": "<a href='http://www.flickr.com/photos/61021753@N02'>Biodiversity Heritage Library</a>",
                                "homepage": "http://www.flickr.com/photos/61021753@N02",
                                "role": "photographer"
                            },
                            "rightsHolder": "Biodiversity Heritage Library",
                            "source": "https://www.flickr.com/photos/biodivlibrary/6459642637/",
                            "title": "n101_w1150",
                            "url": "80/a0/58/542.6459642637.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "Jose Luis Cernadas Iglesias",
                            "source": "https://commons.wikimedia.org/wiki/File:Hypholoma_Fasciculare,_Galicia_(Spain).jpg",
                            "title": "Hypholoma Fasciculare, Galicia (Spain).jpg",
                            "url": "55/4f/ee/509.10615981.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "Szabi237",
                            "source": "https://commons.wikimedia.org/wiki/File:Hypholoma_fasciculare3.JPG",
                            "title": "Hypholoma fasciculare3.JPG",
                            "url": "55/78/5d/509.11213780.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "The High Fin Sperm Whale edit by Muhammad",
                            "source": "https://commons.wikimedia.org/wiki/File:Hypholoma_fasciculare_4_edit1.jpg",
                            "title": "Hypholoma fasciculare 4 edit1.jpg",
                            "url": "55/97/c4/509.11775575.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "The High Fin Sperm Whale",
                            "source": "https://commons.wikimedia.org/wiki/File:Hypholoma_fasciculare_6.JPG",
                            "title": "Hypholoma fasciculare 6.JPG",
                            "url": "55/a4/94/509.12044755.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "Aiwok",
                            "source": "https://commons.wikimedia.org/wiki/File:Hypholoma_fasciculare_1a.jpg",
                            "title": "Hypholoma fasciculare 1a.jpg",
                            "url": "55/ad/ad/509.12209924.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "Jim Champion",
                            "source": "https://commons.wikimedia.org/wiki/File:Fungi_in_Winding_Stonard_wood,_New_Forest_-_geograph.org.uk_-_267461.jpg",
                            "title": "Fungi in Winding Stonard wood, New Forest - geograph.org.uk - 267461.jpg",
                            "url": "55/b2/73/509.12283977.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "4028mdk09",
                            "source": "https://commons.wikimedia.org/wiki/File:Nacktschnecke_auf_Pilzen.JPG",
                            "title": "Nacktschnecke auf Pilzen.JPG",
                            "url": "55/d7/04/509.12740415.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "",
                            "source": "https://commons.wikimedia.org/wiki/File:SulphurTuftClump.JPG",
                            "title": "SulphurTuftClump.JPG",
                            "url": "56/8d/d6/509.1662198.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "",
                            "source": "https://commons.wikimedia.org/wiki/File:Schwefelkopf-gr%C3%BCnbl.jpg",
                            "title": "File:Schwefelkopf-grÃ¼nbl.jpg",
                            "url": "56/be/c7/509.1754573.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "Jörg Hempel",
                            "source": "https://commons.wikimedia.org/wiki/File:Hypholoma_fasciculare_LC0091.jpg",
                            "title": "Hypholoma fasciculare LC0091.jpg",
                            "url": "58/8d/3c/509.2572261.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "Raphaël Blo.",
                            "source": "https://commons.wikimedia.org/wiki/File:Hypholoma_fasciculare_(1).JPG",
                            "title": "Hypholoma fasciculare (1).JPG",
                            "url": "59/23/8a/509.28874563.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "Stu's Images",
                            "source": "https://commons.wikimedia.org/wiki/File:Hypholoma_fasciculare,_Sulphur_Tuft,UK.jpg",
                            "title": "Hypholoma fasciculare, Sulphur Tuft,UK.jpg",
                            "url": "59/51/62/509.29909891.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "Thomas Pruß",
                            "source": "https://commons.wikimedia.org/wiki/File:Schwefelkopf_Gruenbl_(1).jpg",
                            "title": "Schwefelkopf Gruenbl (1).jpg",
                            "url": "59/9d/77/509.31658269.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "Uckermaerker",
                            "source": "https://commons.wikimedia.org/wiki/File:Schwefelkopf_jiw.jpg",
                            "title": "Schwefelkopf jiw.jpg",
                            "url": "59/d0/10/509.32793483.jpg"
                        }
                    ],
                    "name": "Hypholoma fasciculare",
                    "names": [{
                            "language": "en",
                            "vernacularName": "Sulfur tuft"
                        },
                        {
                            "language": "en",
                            "vernacularName": "Sulphur tuft"
                        },
                        {
                            "language": "de",
                            "vernacularName": "Grünblättriger schwefelkopf"
                        },
                        {
                            "language": "fr",
                            "vernacularName": "Hypholome en touffe"
                        },
                        {
                            "language": "de",
                            "vernacularName": "Büscheliger schwefelkopf"
                        },
                        {
                            "language": "de",
                            "vernacularName": "Bitterer schwefelkopf"
                        },
                        {
                            "language": "fr",
                            "vernacularName": "Hypholome fasciculé"
                        }
                    ],
                    "taxonomy": {
                        "class": "Agaricomycetes",
                        "family": "Hymenogastraceae",
                        "genus": "Hypholoma",
                        "kingdom": "Fungi",
                        "order": "Agaricales",
                        "phylum": "Basidiomycota"
                    },
                    "time": [
                        1461
                    ]
                },
                {
                    "description": "Hen of the woods\nMaitake\n\nAlso a polypore but instead of the bright orange or yellow of species in the genus Laetiporus, hen of the woods has brown, tan or grey colouring that provides camouflage.\n\nGrows on or a little away from trees. in late summer through autumn in association with oaks, beeches, maples and cherry.",
                    "eolId": 196141,
                    "eolName": "Grifola frondosa (Dicks.) Gray 1821",
                    "iconicTaxon": "fungi",
                    "images": [{
                            "license": "http://creativecommons.org/licenses/by-nc-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from BioImages DwCA without owner",
                            "source": "http://www.bioimages.org.uk/html/../image.php?id=22936",
                            "title": "In situ - three-quarter view",
                            "url": "89/a4/b8/549.BI-image-22936.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-nc-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from BioImages DwCA without owner",
                            "source": "http://www.bioimages.org.uk/html/../image.php?id=22938",
                            "title": "In situ - showing underside",
                            "url": "89/a4/ba/549.BI-image-22938.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-nc-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from BioImages DwCA without owner",
                            "source": "http://www.bioimages.org.uk/html/../image.php?id=22940",
                            "title": "Top surface",
                            "url": "89/a4/bd/549.BI-image-22940.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/publicdomain/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Eichhase-1.jpg",
                            "title": "Eichhase-1.jpg",
                            "url": "55/b2/d9/509.1230119.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Grifola_frondosa_57503_cropped.jpg",
                            "title": "Grifola frondosa 57503 cropped.jpg",
                            "url": "56/01/df/509.13890340.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Many_Grifola_frondosa_at_the_base_of_an_oak_tree.jpg",
                            "title": "Many Grifola frondosa at the base of an oak tree.jpg",
                            "url": "56/90/2d/509.16691622.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Klapperschwamm_(2).jpg",
                            "starred": true,
                            "title": "Klapperschwamm (2).jpg",
                            "url": "59/98/46/509.31565378.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Klapperschwamm_(Grifola_frondosa).jpg",
                            "title": "Klapperschwamm (Grifola frondosa).jpg",
                            "url": "5f/4e/5b/509.3520529.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Grifola_frondosa_-_Hen_of_the_Woods_at_Wheatrig,_Ayrshire.JPG",
                            "title": "Grifola frondosa - Hen of the Woods at Wheatrig, Ayrshire.JPG",
                            "url": "5f/61/e6/509.35741816.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Hen_of_the_Woods_(22602103527).jpg",
                            "title": "Hen of the Woods (22602103527).jpg",
                            "url": "62/ba/ff/509.46376748.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Hen_of_the_Woods_(22603413193).jpg",
                            "title": "Hen of the Woods (22603413193).jpg",
                            "url": "62/bb/02/509.46376755.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Hen_of_the_Woods_(22603414133).jpg",
                            "title": "Hen of the Woods (22603414133).jpg",
                            "url": "62/bb/04/509.46376758.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from Wikimedia Commons in DwCA without owner",
                            "source": "https://commons.wikimedia.org/wiki/File:Hen_of_the_Woods_-_Grifola_frondosa_(37820669824).jpg",
                            "title": "File:Hen of the Woods - Grifola frondosa (37820669824).jpg",
                            "url": "67/50/c8/509.64618118.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-nc-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from BioImages DwCA without owner",
                            "source": "http://www.bioimages.org.uk/html/../image.php?id=128223",
                            "title": "Fruitbodies at base of old dead Oak",
                            "url": "89/62/0e/549.BI-image-128223.jpg"
                        },
                        {
                            "license": "http://creativecommons.org/licenses/by-nc-sa/3.0/",
                            "photographer": "",
                            "rightsHolder": "licensed media from BioImages DwCA without owner",
                            "source": "http://www.bioimages.org.uk/html/../image.php?id=39928",
                            "title": "LS fruitbody",
                            "url": "89/e9/49/549.BI-image-39928.jpg"
                        }
                    ],
                    "name": "Grifola frondosa",
                    "names": [{
                            "language": "de",
                            "vernacularName": "Laubporling"
                        },
                        {
                            "language": "de",
                            "vernacularName": "Gemeiner Klapperschwamm"
                        },
                        {
                            "language": "de",
                            "vernacularName": "Graue Gans"
                        },
                        {
                            "language": "de",
                            "vernacularName": "Kamm-Porling"
                        },
                        {
                            "language": "de",
                            "vernacularName": "Klapperschwamm"
                        },
                        {
                            "language": "de",
                            "vernacularName": "Spatelhütiger Porling"
                        },
                        {
                            "language": "en",
                            "vernacularName": "Hen of the Woods"
                        },
                        {
                            "language": "en",
                            "vernacularName": "maitake"
                        },
                        {
                            "language": "en",
                            "vernacularName": "Ram's head"
                        },
                        {
                            "language": "en",
                            "vernacularName": "Sheep's head"
                        },
                        {
                            "language": "fr",
                            "vernacularName": "Polypore en touffe"
                        },
                        {
                            "language": "fr",
                            "vernacularName": "Poule de bois"
                        }
                    ],
                    "taxonomy": {
                        "class": "Agaricomycetes",
                        "family": "Meripilaceae",
                        "kingdom": "Fungi",
                        "order": "Polyporales",
                        "phylum": "Basidiomycota"
                    },
                    "terms": [
                        "Sclerotium"
                    ],
                    "time": [
                        1155
                    ]
                },
                {
                    "description": "Morels are some of the first edible mushrooms to appear in the spring months.\n\nMorels have honeycomb pitted caps that sit on top of stalks. For the most part the insides are typically hollow from top to bottom.\n\nThey grow terrestrially, from the soil.\n\nAssociated with elm, tulip poplar, apple, sycamore, hickory, ash and pine.",
                    "eolId": "44451013",
                    "eolName": "Morchella americana Clowez & Matherly, 2012",
                    "iconicTaxon": "fungi",
                    "images": [{
                        "license": "http://creativecommons.org/licenses/by-nc/4.0/",
                        "rightsHolder": "cjosefson",
                        "source": "https://static.inaturalist.org/photos/3282901/original.jpg?1459723733",
                        "title": "orchella americana",
                        "url": "35/d2/e5/18.https___www_inaturalist_org_photos_3282901.jpg"
                    }],
                    "name": "Morchella americana",
                    "names": [{
                            "language": "en",
                            "vernacularName": "yellow morel"
                        },
                        {
                            "language": "en",
                            "vernacularName": "white morel"
                        }
                    ],
                    "taxonomy": {
                        "class": "Pezizomycetes",
                        "family": "Morchellaceae",
                        "genus": "Morchella",
                        "kingdom": "Fungi",
                        "order": "Pezizales",
                        "phylum": "Ascomycota"
                    },
                    "time": [
                        968
                    ]
                }
            ],
            "still": "https://storage.googleapis.com/snapdragon-222014.appspot.com/dist/stills/new%20to%20mushroom%20hunting.jpg",
            "taxa": "Fungi & Lichens",
            "terms": [
                "MsFWkQMSNGPqZgUz5zmd",
                "1AgX6Ngdy53Ws9z2Wcyh",
                "t9H9XHBLA7x2bTL4qQHi",
                "ClklVi7FCa6U6d4KLYK3",
                "7McObe3GXqLN5AB4Wqi0",
                "SJz67wSRKNY3xYHmdwZV",
                "FDNz4BHUToANlWF6Y9Ld",
                "hHq1mRYA6jZ1PRccKcfB",
                "jXWx6yenp6K9rpYiCOWW",
                "7xUEi8tOdSek67DaaN0S",
                "wYo4UFy27u8BDlmJ9Xdo",
                "zowdPu9yRGIvDd1vPIwV",
                "ooAvjcDqvlNfTkD16qcq",
                "q0bQ0fh5NUnfXmZBH1pM",
                "o5FoDa6HKqF26PdcrWVh",
                "L4HbMrxiFBDIColS1sh9",
                "84UlGarm6XuEJpbXzngo",
                "77RxeASfcE71nTVBtCL1",
                "IFnirqXBsHGgvC3PtU7Y",
                "MsFWkQMSNGPqZgUz5zmd",
                "EBEiGczqRnBVK1NYXiOl",
                "hHq1mRYA6jZ1PRccKcfB",
                "xidNJHGZJeKOVBCPozgC",
                "8WUWgRosPtdxDhoZWTo7",
                "CMH5asOEf51Mbkyr5dd5",
                "yGucoYJFSa8dQHBzgXpm",
                "zLgA6sj25nj7K9mDh2ic",
                "T8uTRFTT8TNIltCclrZ5",
                "Q1MLN7iSfc1KwPF13fiT",
                "GZDsTCb8DYLbYoovUlqC"
            ],
            "video": {
                "id": "9tqKQ1GrEy4",
                "intro": "I hope you enjoy this beginner's introduction to mushrooms. When you've finished watching, review what we covered to see how much you remember, and to reinforce what you learnt.",
                "links": [{
                        "label": "Subscribe to the Learn Your Land email newsletter here",
                        "url": ""
                    },
                    {
                        "label": "Website",
                        "url": "https://www.learnyourland.com"
                    }
                ],
                "location": "Eastern North America",
                "owner": "Learn Your Land",
                "ownerUrl": "www.youtube.com/channel/UCcbf8wnyVJl631LAmAbo7nw",
                "presenter": "Adam Haritan",
                "src": "https://yt3.ggpht.com/a/AGF-l79-2yZvLlzlusiC9-3HZ8vrXsB-qsEHNf6PcA=s48-c-k-c0xffffffff-no-rj-mo",
                "startAt": 0,
                "title": "New To Mushroom Hunting? Start Here!"
            },
            "videoState": ""
        }
    ]
}

export const staticInatSpeciesData = [
    {
        "iconic_taxon_id": 47126,
        "name": "Hypericum perforatum",
        "id": 56077,
        "default_photo": {
            "square_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/80103099/square.jpg",
            "attribution": "(c)  Daniel VILLAFRUELA, some rights reserved (CC BY-SA)",
            "flags": [],
            "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/80103099/medium.jpg",
            "id": 80103099,
            "license_code": "cc-by-sa",
            "original_dimensions": {
                "width": 2048,
                "height": 2048
            },
            "url": "https://inaturalist-open-data.s3.amazonaws.com/photos/80103099/square.jpg"
        },
        "iconic_taxon_name": "Plantae",
        "preferred_common_name": "common St. John's-wort"
    },
    {
        "iconic_taxon_id": 47126,
        "name": "Lythrum salicaria",
        "id": 61321,
        "default_photo": {
            "square_url": "https://static.inaturalist.org/photos/63744014/square.jpeg",
            "attribution": "(c) wojtest, all rights reserved, uploaded by wojtest",
            "flags": [],
            "medium_url": "https://static.inaturalist.org/photos/63744014/medium.jpeg",
            "id": 63744014,
            "license_code": null,
            "original_dimensions": {
                "width": 1362,
                "height": 2048
            },
            "url": "https://static.inaturalist.org/photos/63744014/square.jpeg"
        },
        "iconic_taxon_name": "Plantae",
        "preferred_common_name": "purple loosestrife"
    },
    {
        "iconic_taxon_id": 47126,
        "name": "Artemisia vulgaris",
        "id": 52856,
        "default_photo": {
            "square_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/46355424/square.jpeg",
            "attribution": "(c) Valentin Hamon, some rights reserved (CC BY-NC), uploaded by Valentin Hamon",
            "flags": [],
            "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/46355424/medium.jpeg",
            "id": 46355424,
            "license_code": "cc-by-nc",
            "original_dimensions": {
                "width": 1365,
                "height": 2048
            },
            "url": "https://inaturalist-open-data.s3.amazonaws.com/photos/46355424/square.jpeg"
        },
        "iconic_taxon_name": "Plantae",
        "preferred_common_name": "common mugwort"
    },
    {
        "iconic_taxon_id": 47126,
        "name": "Rhus typhina",
        "id": 167829,
        "default_photo": {
            "square_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/41368056/square.jpg",
            "attribution": "(c) mkosiewski, some rights reserved (CC BY-NC), uploaded by mkosiewski",
            "flags": [],
            "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/41368056/medium.jpg",
            "id": 41368056,
            "license_code": "cc-by-nc",
            "original_dimensions": {
                "width": 2048,
                "height": 1536
            },
            "url": "https://inaturalist-open-data.s3.amazonaws.com/photos/41368056/square.jpg"
        },
        "iconic_taxon_name": "Plantae",
        "preferred_common_name": "staghorn sumac"
    },
    {
        "iconic_taxon_id": 47126,
        "name": "Daucus carota",
        "id": 76610,
        "default_photo": {
            "square_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/303861833/square.jpg",
            "attribution": "(c) Zeynel Cebeci, some rights reserved (CC BY-SA)",
            "flags": [],
            "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/303861833/medium.jpg",
            "id": 303861833,
            "license_code": "cc-by-sa",
            "original_dimensions": {
                "width": 1392,
                "height": 2048
            },
            "url": "https://inaturalist-open-data.s3.amazonaws.com/photos/303861833/square.jpg"
        },
        "iconic_taxon_name": "Plantae",
        "preferred_common_name": "wild carrot"
    },
    {
        "iconic_taxon_id": 47126,
        "name": "Geranium maculatum",
        "id": 47699,
        "default_photo": {
            "square_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/3489641/square.JPG",
            "attribution": "(c) Mark Kluge, some rights reserved (CC BY-NC), uploaded by Mark Kluge",
            "flags": [],
            "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/3489641/medium.JPG",
            "id": 3489641,
            "license_code": "cc-by-nc",
            "original_dimensions": {
                "width": 1362,
                "height": 2048
            },
            "url": "https://inaturalist-open-data.s3.amazonaws.com/photos/3489641/square.JPG"
        },
        "iconic_taxon_name": "Plantae",
        "preferred_common_name": "wild geranium"
    },
    {
        "iconic_taxon_id": 47126,
        "name": "Reynoutria japonica",
        "id": 914922,
        "default_photo": {
            "square_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/74418856/square.jpg",
            "attribution": "AnRo0002, no known copyright restrictions (public domain)",
            "flags": [],
            "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/74418856/medium.jpg",
            "id": 74418856,
            "license_code": "pd",
            "original_dimensions": {
                "width": 1536,
                "height": 2048
            },
            "url": "https://inaturalist-open-data.s3.amazonaws.com/photos/74418856/square.jpg"
        },
        "iconic_taxon_name": "Plantae",
        "preferred_common_name": "Japanese knotweed"
    },
    {
        "iconic_taxon_id": 47126,
        "name": "Impatiens capensis",
        "id": 47888,
        "default_photo": {
            "square_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/112963/square.jpg",
            "attribution": "(c) James Gaither, some rights reserved (CC BY-NC-ND)",
            "flags": [],
            "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/112963/medium.jpg",
            "id": 112963,
            "license_code": "cc-by-nc-nd",
            "original_dimensions": {
                "width": 1529,
                "height": 2048
            },
            "url": "https://inaturalist-open-data.s3.amazonaws.com/photos/112963/square.jpg"
        },
        "iconic_taxon_name": "Plantae",
        "preferred_common_name": "common jewelweed"
    },
    {
        "iconic_taxon_id": 47126,
        "name": "Vaccinium vitis-idaea",
        "id": 56312,
        "default_photo": {
            "square_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/113486481/square.jpg",
            "attribution": "(c) Sam Thomas, some rights reserved (CC BY-NC-SA)",
            "flags": [],
            "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/113486481/medium.jpg",
            "id": 113486481,
            "license_code": "cc-by-nc-sa",
            "original_dimensions": {
                "width": 2048,
                "height": 1565
            },
            "url": "https://inaturalist-open-data.s3.amazonaws.com/photos/113486481/square.jpg"
        },
        "iconic_taxon_name": "Plantae",
        "preferred_common_name": "Lingonberry"
    },
    {
        "iconic_taxon_id": 47170,
        "name": "Morchella angusticeps",
        "id": 133686,
        "default_photo": {
            "square_url": "https://static.inaturalist.org/photos/119761552/square.jpg",
            "attribution": "(c) Armin Weise, all rights reserved, uploaded by Armin Weise",
            "flags": [],
            "medium_url": "https://static.inaturalist.org/photos/119761552/medium.jpg",
            "id": 119761552,
            "license_code": null,
            "original_dimensions": {
                "width": 2048,
                "height": 1365
            },
            "url": "https://static.inaturalist.org/photos/119761552/square.jpg"
        },
        "iconic_taxon_name": "Fungi",
        "preferred_common_name": "black morel"
    },
    {
        "iconic_taxon_id": 47170,
        "name": "Cantharellus lateritius",
        "id": 143270,
        "default_photo": {
            "square_url": "https://static.inaturalist.org/photos/23237875/square.jpg",
            "attribution": "(c) whitetail, all rights reserved",
            "flags": [],
            "medium_url": "https://static.inaturalist.org/photos/23237875/medium.jpg",
            "id": 23237875,
            "license_code": null,
            "original_dimensions": {
                "width": 1536,
                "height": 2048
            },
            "url": "https://static.inaturalist.org/photos/23237875/square.jpg"
        },
        "iconic_taxon_name": "Fungi",
        "preferred_common_name": "Smooth Chanterelle"
    },
    {
        "iconic_taxon_id": 47170,
        "name": "Hericium erinaceus",
        "id": 49158,
        "default_photo": {
            "square_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/13419525/square.jpg",
            "attribution": "(c) Katja Schulz, some rights reserved (CC BY)",
            "flags": [],
            "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/13419525/medium.jpg",
            "id": 13419525,
            "license_code": "cc-by",
            "original_dimensions": {
                "width": 2048,
                "height": 2048
            },
            "url": "https://inaturalist-open-data.s3.amazonaws.com/photos/13419525/square.jpg"
        },
        "iconic_taxon_name": "Fungi",
        "preferred_common_name": "lion's-mane mushroom"
    },
    {
        "iconic_taxon_id": 47170,
        "name": "Pleurotus ostreatus",
        "id": 48494,
        "default_photo": {
            "square_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/28199820/square.jpg",
            "attribution": "(c) Niels, some rights reserved (CC BY-NC), uploaded by Niels",
            "flags": [],
            "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/28199820/medium.jpg",
            "id": 28199820,
            "license_code": "cc-by-nc",
            "original_dimensions": {
                "width": 2048,
                "height": 1536
            },
            "url": "https://inaturalist-open-data.s3.amazonaws.com/photos/28199820/square.jpg"
        },
        "iconic_taxon_name": "Fungi",
        "preferred_common_name": "Oyster Mushroom"
    },
    {
        "iconic_taxon_id": 47170,
        "name": "Craterellus fallax",
        "id": 194231,
        "default_photo": {
            "square_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/43293792/square.jpg",
            "attribution": "(c) Dwayne Estes, some rights reserved (CC BY-NC), uploaded by Dwayne Estes",
            "flags": [],
            "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/43293792/medium.jpg",
            "id": 43293792,
            "license_code": "cc-by-nc",
            "original_dimensions": {
                "width": 1536,
                "height": 2048
            },
            "url": "https://inaturalist-open-data.s3.amazonaws.com/photos/43293792/square.jpg"
        },
        "iconic_taxon_name": "Fungi",
        "preferred_common_name": "Eastern Black Trumpet"
    },
    {
        "iconic_taxon_id": 47170,
        "name": "Laetiporus sulphureus",
        "id": 53713,
        "default_photo": {
            "square_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/42106925/square.jpg",
            "attribution": "(c) Stephen John Davies, some rights reserved (CC BY-NC), uploaded by Stephen John Davies",
            "flags": [],
            "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/42106925/medium.jpg",
            "id": 42106925,
            "license_code": "cc-by-nc",
            "original_dimensions": {
                "width": 2032,
                "height": 1360
            },
            "url": "https://inaturalist-open-data.s3.amazonaws.com/photos/42106925/square.jpg"
        },
        "iconic_taxon_name": "Fungi",
        "preferred_common_name": "chicken of the woods"
    },
    {
        "iconic_taxon_id": 47170,
        "name": "Laetiporus cincinnatus",
        "id": 487301,
        "default_photo": {
            "square_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/8883146/square.png",
            "attribution": "(c) Nate Swick, some rights reserved (CC BY-NC), uploaded by Nate Swick",
            "flags": [],
            "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/8883146/medium.png",
            "id": 8883146,
            "license_code": "cc-by-nc",
            "original_dimensions": {
                "width": 428,
                "height": 393
            },
            "url": "https://inaturalist-open-data.s3.amazonaws.com/photos/8883146/square.png"
        },
        "iconic_taxon_name": "Fungi",
        "preferred_common_name": "White-pored Chicken of the Woods"
    },
    {
        "iconic_taxon_id": 47170,
        "name": "Calvatia gigantea",
        "id": 57692,
        "default_photo": {
            "square_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/209263726/square.jpg",
            "attribution": "(c) Krystelle Denis, some rights reserved (CC BY-NC), uploaded by Krystelle Denis",
            "flags": [],
            "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/209263726/medium.jpg",
            "id": 209263726,
            "license_code": "cc-by-nc",
            "original_dimensions": {
                "width": 2048,
                "height": 1760
            },
            "url": "https://inaturalist-open-data.s3.amazonaws.com/photos/209263726/square.jpg"
        },
        "iconic_taxon_name": "Fungi",
        "preferred_common_name": "giant puffball"
    },
    {
        "iconic_taxon_id": 47170,
        "name": "Amanita bisporigera",
        "id": 125390,
        "default_photo": {
            "square_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/158303/square.jpg",
            "attribution": "(c) Kathie Hodge, some rights reserved (CC BY-NC-SA)",
            "flags": [],
            "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/158303/medium.jpg",
            "id": 158303,
            "license_code": "cc-by-nc-sa",
            "original_dimensions": {
                "width": 673,
                "height": 800
            },
            "url": "https://inaturalist-open-data.s3.amazonaws.com/photos/158303/square.jpg"
        },
        "iconic_taxon_name": "Fungi",
        "preferred_common_name": "Eastern North American Destroying Angel"
    },
    {
        "iconic_taxon_id": 47170,
        "name": "Galerina marginata",
        "id": 154735,
        "default_photo": {
            "square_url": "https://static.inaturalist.org/photos/188934/square.jpg",
            "attribution": "(c) Fluff Berger, all rights reserved",
            "flags": [],
            "medium_url": "https://static.inaturalist.org/photos/188934/medium.jpg",
            "id": 188934,
            "license_code": null,
            "original_dimensions": {
                "width": 2048,
                "height": 1156
            },
            "url": "https://static.inaturalist.org/photos/188934/square.jpg"
        },
        "iconic_taxon_name": "Fungi",
        "preferred_common_name": "Funeral Bell"
    },
    {
        "iconic_taxon_id": 47170,
        "name": "Chlorophyllum molybdites",
        "id": 117308,
        "default_photo": {
            "square_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/4133009/square.",
            "attribution": "(c) Christian Schwarz, some rights reserved (CC BY-NC), uploaded by Christian Schwarz",
            "flags": [],
            "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/4133009/medium.",
            "id": 4133009,
            "license_code": "cc-by-nc",
            "original_dimensions": {
                "width": 1422,
                "height": 893
            },
            "url": "https://inaturalist-open-data.s3.amazonaws.com/photos/4133009/square."
        },
        "iconic_taxon_name": "Fungi",
        "preferred_common_name": "green-spored parasol"
    },
    {
        "iconic_taxon_id": 47170,
        "name": "Omphalotus illudens",
        "id": 126831,
        "default_photo": {
            "square_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/64193/square.jpg",
            "attribution": "(c) Jason Hollinger, some rights reserved (CC BY)",
            "flags": [],
            "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/64193/medium.jpg",
            "id": 64193,
            "license_code": "cc-by",
            "original_dimensions": {
                "width": 1200,
                "height": 800
            },
            "url": "https://inaturalist-open-data.s3.amazonaws.com/photos/64193/square.jpg"
        },
        "iconic_taxon_name": "Fungi",
        "preferred_common_name": "Eastern American jack-o'-lantern"
    },
    {
        "iconic_taxon_id": 47170,
        "name": "Hypholoma fasciculare",
        "id": 48767,
        "default_photo": {
            "square_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/256148291/square.jpg",
            "attribution": "(c) Nicolas Schwab, some rights reserved (CC BY-NC), uploaded by Nicolas Schwab",
            "flags": [],
            "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/256148291/medium.jpg",
            "id": 256148291,
            "license_code": "cc-by-nc",
            "original_dimensions": {
                "width": 2048,
                "height": 1360
            },
            "url": "https://inaturalist-open-data.s3.amazonaws.com/photos/256148291/square.jpg"
        },
        "iconic_taxon_name": "Fungi",
        "preferred_common_name": "Sulphur Tuft"
    },
    {
        "iconic_taxon_id": 47170,
        "name": "Grifola frondosa",
        "id": 53714,
        "default_photo": {
            "square_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/7027079/square.jpg",
            "attribution": "(c) Davide Puddu, some rights reserved (CC BY-NC), uploaded by Davide Puddu",
            "flags": [],
            "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/7027079/medium.jpg",
            "id": 7027079,
            "license_code": "cc-by-nc",
            "original_dimensions": {
                "width": 800,
                "height": 533
            },
            "url": "https://inaturalist-open-data.s3.amazonaws.com/photos/7027079/square.jpg"
        },
        "iconic_taxon_name": "Fungi",
        "preferred_common_name": "hen of the woods"
    },
    {
        "iconic_taxon_id": 47170,
        "name": "Morchella americana",
        "id": 462132,
        "default_photo": {
            "square_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/7237495/square.jpeg",
            "attribution": "(c) noah_siegel, some rights reserved (CC BY-NC-SA), uploaded by noah_siegel",
            "flags": [],
            "medium_url": "https://inaturalist-open-data.s3.amazonaws.com/photos/7237495/medium.jpeg",
            "id": 7237495,
            "license_code": "cc-by-nc-sa",
            "original_dimensions": {
                "width": 2048,
                "height": 1152
            },
            "url": "https://inaturalist-open-data.s3.amazonaws.com/photos/7237495/square.jpeg"
        },
        "iconic_taxon_name": "Fungi",
        "preferred_common_name": "white morel"
    }
]
