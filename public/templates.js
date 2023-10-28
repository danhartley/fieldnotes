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

// TEMPLATES

export const h3 = {
  id: 'title-h3-template',
  parent: 'non-grid-template',
  type: 'h3-header',
  h3: 'title',
}

export const text = {
  id: 'text-template',
  name: 'text',
  parent: 'non-grid-template',
  type: 'text',
  texts: [],
}

export const term = {
  id: 'term-template',
  name: 'term', 
  parent: 'dl-template',
  type: 'term',                 
  terms: [],
}

export const species = {
  id: 'species-card-template',
  name: 'Species-cards',
  parent: 'grid-template',
  type: 'species',
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
  id: 'title-h3-template',
  parent: 'non-grid-template',
  type: 'date-header',
  date: 'date',
}

export const location = {
  id: 'title-h3-template',
  parent: 'non-grid-template',
  type: 'location',
  location: 'location',
  place_guess: 'place_guess',
}

export const author = {
  id: 'title-h3-template',
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