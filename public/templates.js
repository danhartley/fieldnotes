export const templates = [
  {
      id: 'species-card-test-template',
      name: 'Species-card-tests',
      parent: 'grid-template',
      pairedTemplateId: 'species-template',
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
      id: 'species-template',
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

// TEMPLATES

export const h3 = {
  id: 'h3-input-template',
  parent: 'non-grid-template',
  type: 'h3-header',
  h3: 'title',
}

export const h4 = {
  id: 'h4-input-template',
  parent: 'non-grid-template',
  type: 'h4-header',
  h4: 'title',
}

export const text = {
  id: 'text-template',
  name: 'text',
  parent: 'non-grid-template',
  type: 'text',
  paras: [],
}

export const term = {
  id: 'term-template',
  name: 'term', 
  parent: 'dl-template',
  type: 'term',                 
  terms: [],
}

export const species = {
  id: 'species-template',
  name: 'Species-cards',
  parent: 'grid-template',
  type: 'species',
  species: [],
}

export const observations = {
  id: 'species-template',
  name: 'Species-cards',
  parent: 'grid-template',
  type: 'observations',
  species: [],
}

export const image = {
  id: 'img-template',
  parent: 'grid-template',
  type: 'img',
  imgs: [],
}

export const annotation = {
  id: 'annotation-template',
  name: 'annotation', 
  parent: 'dl-template',
  type: 'annotation',                 
  annotations: [],
}

export const date = {
  id: 'h3-input-template',
  parent: 'non-grid-template',
  type: 'date',
  date: 'date',
}

export const location = {
  id: 'h3-input-template',
  parent: 'non-grid-template',
  type: 'location',
  location: 'location',
  place_guess: 'place_guess',
}

export const author = {
  id: 'h3-input-template',
  parent: 'non-grid-template',
  type: 'author',
  author: 'author',
}

export const xenocanto = {
  id: 'xeno-canto-template',
  parent: 'non-grid-template',
  type: 'xeno-canto',
  recordingId: 'id',
}