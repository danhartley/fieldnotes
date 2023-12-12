import { 
  templates
, h3
, h4
, date
, location
, text
, term
, species
, image
, annotation
, xenocanto 
, author
} from './templates.js'

export const fieldnotes = [
  {
    id: 'Arrábida-9-November-2023',
    title: 'Arrábida 9 November 2023',
    author: 'danielhartley',
    d1: '2023-11-09',
    d2: '2023-11-09',
    taxa: [
        {
            "id": 49490,
            "name": "Cladonia"
        },
        {
            "id": 636795,
            "name": "Salvia rosmarinus"
        },
        {
            "id": 134216,
            "name": "Tortella"
        },
        {
            "id": 82942,
            "name": "Quercus coccifera"
        },
        {
            "id": 82856,
            "name": "Rhamnus alaternus"
        },
        {
            "id": 60271,
            "name": "Asparagus"
        },
        {
            "id": 47574,
            "name": "Juniperus"
        },
        {
            "id": 82600,
            "name": "Pistacia lentiscus"
        },
        {
            "id": 76363,
            "name": "Cistus monspeliensis"
        },
        {
            "id": 49490,
            "name": "Cladonia"
        },
        {
            "id": 47170,
            "name": "Fungi"
        },
        {
            "id": 174994,
            "name": "Squamarina"
        },
        {
            "id": 82836,
            "name": "Daphne gnidium"
        },
        {
            "id": 179065,
            "name": "Suillus granulatus"
        },
        {
            "id": 64021,
            "name": "Omphalotus olearius"
        },
        {
            "id": 72165,
            "name": "Helichrysum"
        },
        {
            "id": 118535,
            "name": "Drimia maritima"
        },
        {
            "id": 734833,
            "name": "Petrosedum sediforme"
        },
        {
            "id": 82903,
            "name": "Smilax aspera"
        },
        {
            "id": 363592,
            "name": "Suillus collinitus"
        },
        {
            "id": 57140,
            "name": "Olea europaea"
        },
        {
            "id": 82722,
            "name": "Pinus halepensis"
        },
        {
            "id": 63621,
            "name": "Pinus pinea"
        }
    ],
    templates: [              
        {
          id: 'Arrábida-9-November-2023-template',
          name: 'Field journal',
          parent: 'non-grid-template',
          type: 'fieldnotes',
          isTest: false,                
          sections: [
            {
                ...text,
                paras: [
                    {
                        p: "My observations were made in the Serra do Louro within the Arrábida Natural Park (Parque Natural da Arrábida), a protected area in the district of Setúbal which lies about twenty kilometres south of Lisbon."
                    },
                    {
                        p: "The day was clear and bright, between 18º and 20ºC, not unusual for the time of year. On the south and east facing slopes of the serra, where there is shelter from westerly breezes, it felt three or four degrees warmer. The ground, however, was wet due to overnight rain of which there has been a great deal in recent weeks."
                    },
                    {
                        p: "I began the day at the Capela das Necessidades which is situated on the left (top or north) side of the Vale dos Barris, in the freguesia (parish) of São Simão."
                    },
                    {
                        p: "My intention was to observe the common native trees I would expect to find and to separate out the various oaks (Kermes, Holm, Cork and Portuguese) and pines (Umbrella or Stone, Maritime and Aleppo) which grow in the park."
                    },
                    {
                        p: "A Stone Pine on the escarpment above the chapel caught my attention almost at once, and I decided to scramble up the small bluff that led to it. It took an hour to catalogue it as best I could and to record the species that lay within twenty or so feet of it."
                    },
                    {
                        p: "Of the other trees in the vicinity, there were several Kermes oaks, junipers and an olive tree. The uncultivated slopes and lower slopes of the serra is maquis so I was not surprised to see Mediterranean Buckthorn, asparagus, rosemary, mastic, Flax-leaved Daphne, everlasting-flowers and cistus (Montpellier cistus)."                            
                    },
                    {
                        p: "After the fire that had affected 400 hectares two years earlier, a great many Sea Squills had sprung up. I saw one dead adult but numerous rosettes of green which are quite different in appearance to that of the mature plant. Their leaves are dark green and leathery in texture."                            
                    },
                    {
                        p: "Among the species I was unable to record were a dozen or so butterflies though I believe I recognised several Clouded Yellows and Green-striped Whites among them."
                    },
                    {
                        p: "After completing my study - and without battery life to continue recording - I followed the gentle curve of the serra as it banked north and east towards Palmela. Instead of taking the upper path or dropping down to the unmetalled road I commonly take, I followed an unmarked path through relatively clear wood."
                    },
                    {
                        p: "Many of the trees were pine saplings but I was not sure if they were Maritime or Aleppo pines. When young their bark was smooth and light grey and as they matured the lower bark grew darker and fissured. The cones were sessile. I recorded them as Aleppo pines. "
                    },
                    {
                        p: "There was an abundance of Slippery Jacks (I could see 14 from where I took photos of one specimen) both alongside the path and scattered among the trees. There were also a great many flies which had not troubled me on previous trips and may have been due to the presence of wild boar."
                    },
                    {
                        p: "Their scat was everywhere and they appeared to have eaten the berries of mastic which were in fruit on the lower part of the escarpment where the trees thinned. It is likely the paths I was following had been made by them as they criss-crossed the slopes, and where they descended in search of food and water."
                    },
                    {
                        p: "After stopping for lunch, I took a path that brought me to the road/track which is flanked on the lower side by vineyards and on the upper by an abandoned fig orchard. I observed two dead fire salamanders, killed by vehicles. Because of the recent rains there were puddles on the track and water in the ditches which may have drawn them out. Where the track became the road proper, I followed the steep path which ascends the southern flank of the Serra do Louro."
                    },
                    {
                        p: "I rejoined the Roteiro dos Moinhos da Serra do Louro at Cabeço das Vacas, and continued along it to my endpoint in Palmela. Notable were the birds of prey that twice overflew me and which may have been Peregrine falcons."
                    },
                    {
                        p: "As always on this path, I was accompanied by butterflies and nomads. Today there were Red Admirals, A Swallowtail, Small Coppers, and what may have been a Painted Lady or Speckled Wood. The ground often came alive as Blue-winged Grasshoppers, startled by my presence, scattered. The vegetation on the top of the serra is garrigue and on either side of the path I saw wild thyme and lavender from which characteristic fragrances could be raised by a sweep of the hand."
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
            { ...h3,  h3: 'Grinnell method of note-taking' },
            {
                ...text,
                paras: [
                {
                    p: 'A field-worthy notebook where one records direct observations as they are being observed.',
                },
                {
                    p: 'A larger more substantial journal containing written entries on observations and information, transcribed from the smaller field notebook as soon as possible.',
                },
                {
                    p: 'Species accounts of the notes taken on specific species.',
                },
                {
                    p: 'A catalogue to record the location and date of collected specimens.',
                },
                ]
            },
            {
                ...term,
                terms: [
                'Secondary succession',
                'Maquis',
                'Garrigue',
                ],
            },
            { ...h3,  h3: 'Biological habitat' },
            {
                ...text,
                paras: [
                {
                    p: 'The other types of plants growing around your specimen.',
                },
                {
                    p: 'What kind of plant community is it growing in (open forest, opening in forest, closed forest, grassland, shrub-steppe, disturbed roadside).',
                },
                {
                    p: 'If you know the identification (even to genus or family) of any other plants growing in the immediate surroundings of your collection, record them here.',
                },
                {
                    p: 'This information can help researchers assess what type of habitat is present at this location.',
                },
                ]
            },
            { ...h4, h4: 'Observations (specimens)' },
            {
                ...image,
                imgs: [
                {
                    src: 'https://inaturalist-open-data.s3.amazonaws.com/photos/225724924/small.jpeg',
                    alt: 'Chicory',
                },
                {
                    src: 'https://inaturalist-open-data.s3.amazonaws.com/photos/225727251/small.jpeg',
                    alt: 'Southern Gatekeeper',
                },
                {
                    src: 'https://inaturalist-open-data.s3.amazonaws.com/photos/225724946/small.jpeg',
                    alt: 'Hare\'s Tail Grass',
                },
                ]
            },                
            { ...text,
                paras: [
                    {
                        p: 'Comparison (above) between species observed on location and the type specimens (below) used by iNaturalist.'
                    }
                ]
            },
            { ...h4, h4: 'Type specimens (iNaturalist)' },
            {
                ...species,
                species: [
                    'Pinus pinea',
                    'Pinus halepensis',
                    'Olea europaea',                    
                ],
            },
            { ...h3,  h3: 'Physical habitat' },
            { ...text,
                paras: [
                {
                    p: 'The type of soil, rocks, slope, elevation, aspect, moisture (for instance, whether the site is continuously wet)',
                },
                {
                    p: 'Record anything you know about soil type (sand, clay, loam), topography, slope, exposure, amount of sun, proximity to water sources such as streams or lakes, etc. Describe the site to the best of your ability.',
                },
                {
                    p: 'You can also include information about the level of disturbance of the habitat, e.g. does the area appear to be naturally forested? In agricultural use?',
                },
                ]
            },
            {
                ...image,
                imgs: [
                {
                    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Garrigue_herault.jpg/500px-Garrigue_herault.jpg',
                    alt: 'Garrigue',
                },
                {
                    src: 'https://imgs.search.brave.com/9QJj-kXLkUKr6uFS6XI6mBR8SWpFboMF4COqZfHoR8w/rs:fit:860:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy9l/L2UyL0p1bmlwZXJ1/c19waG9lbmljZWFf/a3oxLmpwZw',
                    alt: 'Maquis',
                },
                {
                    src: 'https://imgs.search.brave.com/0FNAjS4UvGwHrZBFAgcgEx6lruv37nqj0FjmJisZEhw/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudGFrZXNoYXBl/LmlvLzg2Y2U5NTI1/LWY1ZjItNGU5Ny04/MWJhLTU0ZThjZTkz/M2RhNy9kZXYvNzJk/NGEwYTYtZmE4OS00/YTI2LWIyYTktNTU4/NGUwNGQxOTU5Lzc1/OCUyME1lZGl0ZXJy/YW5lYW4lMjBIaWdo/JTIwQXRsYXMlMjBq/dW5pcGVyJTIwc3Rl/cHBlJTIwLSUyMFdp/bGZyaWVkJTIwU2Fu/dGVyLmpwZz9hdXRv/PWNvbXByZXNzLGZv/cm1hdCZ3PTE2MDA',
                    alt: 'Steppe',
                },
                ]
            },
            { ...h3, h3: 'Description' },
            {
                ...text,
                paras: [
                    {
                    p: 'Record features that may not be preserved in the pressed specimen, such as colour, odor, sap or latex, height, diameter, etc.',
                    },
                    {
                    p: 'Particular attention should be paid to phenology – is tree in fruit or flower? If so, what color are flowers? You can also describe the plant’s habit – is the plant a tree, shrub, or vine?',
                    },
                    {
                    p: 'If you have reason to believe a specimen is cultivated or offspring of a cultivated specimen that has “escaped,” that information should be recorded as such.',
                    },                                                  
                ]
            },
            {
                ...term,
                terms: [
                'Serotiny',
                'Sclerophyll',
                'Ruderal species',
                ],
            },
            { ...h3,  h3: 'iNaturalist annotations' },
            {
                ...annotation,
                annotations: [],
            },
            { ...h3, h3: 'Birdsong'},
            {
                ...xenocanto,
                recordingId: '121910'
            },
          ],
        },
        ...templates,
    ],
  },
  {
    id: "São Simão, Portugal, Thu Nov 09 2023",
    title: "Saved São Simão, Portugal, Thu Nov 09 2023",
    author: "danhartleybcn",
    user: {      
        id: 19829,
        login: "danielhartley",
        icon: "https://static.inaturalist.org/attachments/users/icons/19829/thumb.jpg?1525787411",
        observations_count: 1185,
        identifications_count: 20,
        species_count: 559,    
    },
    d1: "2023-11-09",
    d2: "2023-11-09",
    location: {
      location: "38.5296472222,-8.9822055556",
      place_guess: "São Simão, Portugal"
    },
    language: {
      name: "English",
      id: "en"
    },
    taxa: [
      {
        id: 63621,
        name: "Pinus pinea"
      },
      {
        id: 82722,
        name: "Pinus halepensis"
      },
      {
        id: 82723,
        name: "Pinus pinaster"
      },
      {
        id: 82856,
        name: "Rhamnus alaternus"
      },
      {
        id: 82942,
        name: "Quercus coccifera"
      },
      {
        id: 60271,
        name: "Asparagus"
      },
      {
        id: 82600,
        name: "Pistacia lentiscus"
      },
      {
        id: 82836,
        name: "Daphne gnidium"
      },
      {
        id: 57140,
        name: "Olea europaea"
      },
      {
        id: 64021,
        name: "Omphalotus olearius"
      },
      {
        id: 179065,
        name: "Suillus granulatus"
      },
      {
        id: 49490,
        name: "Cladonia"
      }
    ],
    templates: [
      {
        id: "São Simão, Portugal, Thu Nov 09 2023",
        name: "Field journal",
        parent: "non-grid-template",
        type: "fieldnotes",
        isTest: false,
        sections: [
          {
            id: "text-template",
            name: "Text block",
            parent: "non-grid-template",
            type: "text",
            paras: [
              {
                p: "My observations were made in the Serra do Louro within the Arrábida Natural Park (Parque Natural da Arrábida), a protected area in the district of Setúbal which lies about twenty kilometres south of Lisbon."
              },
              {
                p: "The day was clear and bright, between 18º and 20ºC, not unusual for the time of year. On the south and east facing slopes of the serra, where there is shelter from westerly breezes, it felt three or four degrees warmer. The ground, however, was wet due to overnight rain of which there has been a great deal in recent weeks."
              }
            ]
          },
          {
            id: "species-template",
            name: "Species catalogue",
            parent: "grid-template",
            type: "species",
            species: [
              "Pinus pinea",
              "Pinus halepensis",
              "Pinus pinaster"
            ]
          },
          {
            id: "text-template",
            name: "Text block",
            parent: "non-grid-template",
            type: "text",
            paras: [
              {
                p: "I began the day at the Capela das Necessidades which is situated on the left (top or north) side of the Vale dos Barris, in the freguesia (parish) of São Simão."
              },
              {
                p: "My intention was to observe the common native trees I would expect to find and to separate out the various oaks (Kermes, Holm, Cork and Portuguese) and pines (Umbrella or Stone, Maritime and Aleppo) which grow in the park."
              },
              {
                p: "A Stone Pine on the escarpment above the chapel caught my attention almost at once, and I decided to scramble up the small bluff that led to it. It took an hour to catalogue it as best I could and to record the species that lay within twenty or so feet of it."
              },
              {
                p: "Of the other trees in the vicinity, there were several Kermes oaks, junipers and an olive tree. The uncultivated slopes and lower slopes of the serra is maquis so I was not surprised to see Mediterranean Buckthorn, asparagus, rosemary, mastic, Flax-leaved Daphne, everlasting-flowers and cistus (Montpellier cistus)."
              }
            ]
          },
          {
            id: "species-template",
            name: "Species catalogue",
            parent: "grid-template",
            type: "species",
            species: [
              "Rhamnus alaternus",
              "Quercus coccifera",
              "Asparagus",
              "Pistacia lentiscus",
              "Daphne gnidium",
              "Olea europaea"
            ]
          },
          {
            id: "text-template",
            name: "Text block",
            parent: "non-grid-template",
            type: "text",
            paras: [
              {
                p: "After the fire that had affected 400 hectares two years earlier, a great many Sea Squills had sprung up. I saw one dead adult but numerous rosettes of green which are quite different in appearance to that of the mature plant. Their leaves are dark green and leathery in texture."
              },
              {
                p: "Among the species I was unable to record were a dozen or so butterflies though I believe I recognised several Clouded Yellows and Green-striped Whites among them."
              }
            ]
          },
          {
            id: "species-template",
            name: "Species catalogue",
            parent: "grid-template",
            type: "species",
            species: [
              "Omphalotus olearius",
              "Suillus granulatus",
              "Cladonia"
            ]
          },
          {
            id: "text-template",
            name: "Text block",
            parent: "non-grid-template",
            type: "text",
            paras: [
              {
                p: "After completing my study - and without battery life to continue recording - I followed the gentle curve of the serra as it banked north and east towards Palmela. Instead of taking the upper path or dropping down to the unmetalled road I commonly take, I followed an unmarked path through relatively clear wood."
              },
              {
                p: "Many of the trees were pine saplings but I was not sure if they were Maritime or Aleppo pines. When young their bark was smooth and light grey and as they matured the lower bark grew darker and fissured. The cones were sessile. I recorded them as Aleppo pines."
              },
              {
                p: "There was an abundance of Slippery Jacks (I could see 14 from where I took photos of one specimen) both alongside the path and scattered among the trees. There were also a great many flies which had not troubled me on previous trips and may have been due to the presence of wild boar."
              },
              {
                p: "Their scat was everywhere and they appeared to have eaten the berries of mastic which were in fruit on the lower part of the escarpment where the trees thinned. It is likely the paths I was following had been made by them as they criss-crossed the slopes, and where they descended in search of food and water."
              },
              {
                p: "After stopping for lunch, I took a path that brought me to the road/track which is flanked on the lower side by vineyards and on the upper by an abandoned fig orchard. I observed two dead fire salamanders, killed by vehicles. Because of the recent rains there were puddles on the track and water in the ditches which may have drawn them out. Where the track became the road proper, I followed the steep path which ascends the southern flank of the Serra do Louro."
              },
              {
                p: "I rejoined the Roteiro dos Moinhos da Serra do Louro at Cabeço das Vacas, and continued along it to my endpoint in Palmela. Notable were the birds of prey that twice overflew me and which may have been Peregrine falcons."
              }
            ]
          },
          {
            id: "h4-input-template",
            name: "Subheader",
            parent: "non-grid-template",
            type: "h4-header",
            h4: "Final reflections"
          },
          {
            id: "text-template",
            name: "Text block",
            parent: "non-grid-template",
            type: "text",
            paras: [
              {
                p: "As always on this path, I was accompanied by butterflies and nomads. Today there were Red Admirals, A Swallowtail, Small Coppers, and what may have been a Painted Lady or Speckled Wood. The ground often came alive as Blue-winged Grasshoppers, startled by my presence, scattered. The vegetation on the top of the serra is garrigue and on either side of the path I saw wild thyme and lavender from which characteristic fragrances could be raised by a sweep of the hand."
              }
            ]
          }
        ]
      },
      {
        id: "species-test-template",
        name: "Species-card-tests",
        parent: "grid-template",
        pairedTemplateId: "species-template",
        isTest: true,
        targets: [
          {
            id: "common",
            name: "common name"
          },
          {
            id: "latin",
            name: "latin name"
          }
        ],
        score: 0,
        scores: []
      },
      {
        id: "species-template",
        name: "Species catalogue",
        parent: "grid-template",
        pairedTemplateId: "species-test-template",
        isTest: false,
        isTestable: true
      },
      {
        id: "species-list-template",
        name: "Species-list",
        parent: "grid-template",
        isTest: false
      }
    ]
  }
]

export const getAnnotations = observations => {
  const controls = Array.from(new Set(observations.map(sp => sp.annotations).filter(a => a.length > 0).flat().map(JSON.stringify))).map(JSON.parse)
  const annotations = controls.map(ctrl => {
    return {
      ...ctrl,
      species: observations
        .filter(o => o.annotations.length > 0)
        .map(o => o.annotations
            .map(a => {
                if(a.controlled_attribute_id === ctrl.controlled_attribute_id && a.controlled_value_id === ctrl.controlled_value_id) {
                    return o.taxon
                }
            })
            )
            .flat()
            .filter(o => o)
            .map(o => {
                return { 
                    id: o.id,
                    name: o.name
                }                
            })
            .flat()
      }
  })
  return annotations
}