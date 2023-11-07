import { 
    templates
  , h3
  , text
  , term
  , species
  , image
} from './templates.js'

export const guides = [
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
          name: 'Guide',
          parent: 'non-grid-template',
          type: 'guide',
          isTest: false,
          sections: [
            {
              templates: [
                { ...h3, h3: 'Mediterranean Climate Regions' },
                { 
                  ...text, paras: [
                    {
                      p: `
                      The Mediterranean has a subtropical climate with hot summers and mild winters. Precipitation is concentrated in the winter.`,
                    },
                    {
                      p: 'The subtropics fall outside of the tropics of Cancer (in the northern hemisphere) and Capricorn (southern hemisphere).',
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
                  ...text, paras: [
                    {
                      p: 'The typical Mediterranean landscape is a mosaic of diverse plant communities characterised by biodiversity.',
                    },
                    {
                      p: 'Plants that have developed and diversified in areas with a Mediterranean macroclimate have acquired special characteristics, adapting their morphology and metabolism to survive during the drought period and to resprout after wildfires.',
                    },
                    {
                      p: 'The main Mediterranean vegetation types throughout the Mediterranean Basin are sclerophyllous or marcescent oak forests and woodlands at lower elevations, marcescent oak forests in middle elevations and conifer forests or woodlands at higher elevations.',
                    },                        
                  ]
                },
                { ...term, terms: [
                  'Sclerophyll',
                  'Marcescence',
                  'Conifer',
                  ]
                },
                { ...text, paras: [
                    {
                      p: 'Much of Portugal has a Mediterranean climate.',
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
                { ...text, paras: [
                  {
                    p: 'The Mediterranean is characterised by mild and rainy winters and hot and dry summers.',
                  },
                  {
                    p: 'MCRs are covered by characteristic vegetation types involving dense forests, woodlands and thickets of woody shrubby plants of varying density, generally with evergreen sclerophyllous leaves.',
                  },
                  {
                    p: 'The most notable aspect of the Mediterranean macrobioclimate affecting its main vegetation types is the restricted summer rainfall when temperatures reach their maximum.',
                  },
                  {
                    p: 'Plants that have developed and diversified in areas with a Mediterranean macroclimate have acquired special characteristics, adapting their morphology and metabolism to survive during drought, and to resprout after wildfires.',
                  },
                  {
                    p: 'The main Mediterranean vegetation types throughout the Mediterranean Basin are sclerophyllous or marcescent oak forests and woodlands at lower elevations, marcescent oak forests in middle elevations and conifer forests or woodlands at higher elevations.',
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
                  paras: [
                    {
                      p: `
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
                  paras: [
                    {
                      p: 'Matorrals can be considered as different vegetation types developed on disturbed or altered sites where forest species form the natural potential vegetation and its vegetation series.',
                    },
                    {
                      p: 'Most of the food crops cultivated in the area were originated in the Mediterranean Basin and in Middle Eastern regions. Wheat, barley, legumes (such as lentils and chickpeas), vegetables (such as artichokes, asparagus, cabbage, leeks, onions and garlic), and fruits and seeds (such as grapes, olives, almonds and acorns).',
                    },
                    {
                      p: 'The present Mediterranean landscape is the complex result of human activity in the management of nature for its own benefit.'
                    },                  
                    {
                      p: 'The pristine Mediterranean vegetation was transformed through human intervention. This was not only due to agriculture, livestock and the building of cities but also due to mining for metals, a key activity throughout its history.'
                    },                
                    {
                      p: 'Natural woods and bushes were transformed into a new cultural space where crops and grasslands could be identified with boundaries defining their ownership.'
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
              p: 'At its best in early spring when the plant has developed its basal leaves and before the growth of the flowering stems.'
            }
          ]
        },
        {
          id: 82691,
          name: 'Dioscorea communis',
          rank: 10,
          description: [
            {
              p: 'The young shoots are collected in mid-spring.'
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
              p: 'Have been used as stewed vegetables.'
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
              p: 'These flowers, which typically appear in May–July, are edible and attract bees.'
            }
          ]
        },
        {
          id: 53052,
          name: 'Foeniculum vulgare',
          rank: 10,
          description: [
            {
              p: 'Consumed in salads or eaten raw.'
            }
          ]
        },
        {
          id: 76300,
          name: 'Chondrilla juncea',
          rank: 10,
          description: [
            {
              p: 'Consumed in salads or eaten raw.'
            }
          ]
        },
        {
          id: 82642,
          name: 'Mantisalca salmantica',
          rank: 10,
          description: [
            {
              p: 'Consumed in salads or eaten raw.'
            }
          ]
        },
        {
          id: 168693,
          name: 'Scorzonera laciniata',
          rank: 10,
          description: [
            {
              p: 'Consumed in salads or eaten raw.'
            }
          ]
        },
        {
          id: 61396,
          name: 'Origanum vulgare',
          rank: 10,
          description: [
            {
              p: ''
            }
          ]
        },
      ],
      templates: [              
        {
          id: 'wild-edible-plants-template',
          name: 'Guide',
          parent: 'non-grid-template',
          type: 'guide',
          isTest: false,
          sections: [
            {
              templates: [
                { ...h3,  h3: 'The Mediterranean landscape' },
                {
                  ...text,
                  paras: [
                    {
                      p: 'The typical Mediterranean landscape is a mosaic of diverse plant communities characterised by biodiversity.',
                    },
                    {
                      p: 'These complexes are home to an important group of edible plants and plants that provide wild edible fruits, as well as aromatic plants used as seasoning in human nutrition.',
                    },
                    {
                      p: 'Mild and rainy winters contrasting with hot and dry summers.',
                    },
                    {
                      p: 'The Mediterranean macrobioclimate is shared with southern and south-western territories on all the continents.',
                    },
                    {
                      p: 'The lands in these regions around the world are covered by characteristic vegetation types involving dense forests, woodlands and thickets of woody shrubby plants of varying density, generally with evergreen sclerophyllous leaves.',
                    },
                    {
                      p: 'Wild plants were a major source of food and a key nutritional complement to the animal proteins obtained from hunting and fishing. Knowledge of wild edible plants has survived in more advanced farming and livestock societies, and in times of hardship, such as war and famine, it has once again served as a vital source of food and medicinal resources.',
                    },
                    {
                      p: 'The most notable aspect of the Mediterranean macrobioclimate affecting its main vegetation types is the restricted summer rainfall when temperatures reach their maximum.',
                    },
                    {
                      p: 'Plants that have developed and diversified in areas with a Mediterranean macroclimate have acquired special characteristics adapting their morphology and metabolism to survive during the drought period and to resprout after wildfires.',
                    },
                    {
                      p: 'The main Mediterranean vegetation types throughout the Mediterranean Basin are sclerophyllous or marcescent oak forests and woodlands at lower elevations, marcescent oak forests in middle elevations and conifer forests or woodlands at higher elevations.',
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
                  paras: [
                    {
                      p: 'Matorrals can be considered as different vegetation types developed on disturbed or altered sites where forest species form the natural potential vegetation and its vegetation series.',
                    },
                    {
                      p: 'Most of the food crops cultivated in the area were originated in the Mediterranean Basin and in Middle Eastern regions. Wheat, barley, legumes (such as lentils and chickpeas), vegetables (such as artichokes, asparagus, cabbage, leeks, onions and garlic), and fruits and seeds (such as grapes, olives, almonds and acorns).',
                    },
                    {
                      p: 'The present Mediterranean landscape is the complex result of human activity in the management of nature for its own benefit.'
                    },                  
                    {
                      p: 'The pristine Mediterranean vegetation was transformed through human intervention. This was not only due to agriculture, livestock and the building of cities but also due to mining for metals, a key activity throughout its history.'
                    },                
                    {
                      p: 'Natural woods and bushes were transformed into a new cultural space where crops and grasslands could be identified with boundaries defining their ownership.'
                    },                
                    {
                      p: 'Changes promoted nitrogen-loving (nitrophilous) plants. Many are as-sociated with farmlands and cultivated plants (weeds), and others grow near places of human habitation (ruderals) or live along the borders of paths, roads or cattle tracks, carried by man and domestic animals in their seasonal migration.'
                    },                
                    {
                      p: 'Numerous weeds and ruderal plants are used and collected as wild vegetables in the Iberian Peninsula, such as Scolymus hispanicus (Asteraceae), Silene vulgaris, Garcke (Caryophyllaceae) and Silybum marianum.'
                    },          
                    {
                      p: 'Late winter, and especially spring, is in general the best time to collect vegetables that reach their higher development while being still tender, though de-pending on the local climatic conditions, they could be collected in other parts of the year.'
                    },       
                    {
                      p: 'Seasonality is a very determinant condition for the life in the Mediterranean areas.'
                    },       
                    {
                      p: 'Very dry autumns in Spanish continental sites signal the beginning of a bad year for collecting wild vegetables which develop during this season and produce their stems and leaves in late winter and spring.'
                    },       
                    {
                      p: 'Asparagus acutifolius — which grows in oak forest communities, in olive groves and, in the past, inside rain-fed farm crops — has very tough underground organs like tuberous roots, and in dry years also produces new shoots or asparagus.'
                    },      
                    {
                      p: 'There are also species that are not so dependent on the yearly climatic variation, such as watercress (Nasturtium officinale) that always grow where there are permanent waters.'
                    },    
                    {
                      p: 'Late spring and summer is the season of aromatic plants used for seasoning. The diverse floras of the Mediterranean Basin countries provide numerous highly scented species. Chemical compounds from the essential oils are produced in the secondary metabolism of all these plants and are present in the small uni- or multicellular dots that are transformed hairs located on the epidermis of leaves and flowers.'
                    },
                    {
                      p: 'These tiny dots burst, and the essential oil evap-orates into the air producing their pleasant aromas, even when the plants are dried. One of the biological advantages of the presence of these chemical compounds is that plants are protected from being eaten by large animals or phytophagous insects and from bacterial infections.'
                    },
                    {
                      p: 'One of the biological advantages of the presence of these chemical compounds is that plants are protected from being eaten by large animals or phytophagous insects and from bacterial infections.'
                    },
                    {
                      p: 'There is a high biodiversity within the group of species used for cooking, flavouring and preserving. Lamiaceae, Apiaceae and Asteraceae are the main aromatic plant families in the territories of the Mediterranean Basin.'
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
          name: 'Guide',
          parent: 'non-grid-template',
          type: 'guide',
          isTest: false,                
          sections: [
            {
              templates: [
                {
                  ...text,
                  paras: [
                    {
                      p: 'Mediterranean vegetation is among the most fire-prone and fire-shaped in the world.',
                    },
                    {
                      p: 'Sclerophyllous evergreen shrublands with widespread adaptations to intense fire. (Maquis)',
                    },
                    {
                      p: 'Lower, more xeric, sometimes drought-deciduous shrublands. (Garrigue)',
                    },
                    {
                      p: 'It is found on limestone soils in southern France and around the Mediterranean Basin, generally near the coast where the moderated Mediterranean climate provides annual summer drought. It is an anthropogenic degradation and succession form of former evergreen oak forests that existed until around 2500 years BC.'
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
]