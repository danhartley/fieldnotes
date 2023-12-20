export const templates = [
  {
      id: 'species-test-template',
      name: 'Species catalogue tests',
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
      name: 'Species catalogue',
      parent: 'grid-template',
      pairedTemplateId: 'species-test-template',
      isTest: false,
      isTestable: true,
  },
  {
    id: 'species-list-template',
    name: 'Species list',
    parent: 'grid-template',
    isTest: false,
  },
]

// TEMPLATES

export const h3 = {
  id: 'h3-read-template',
  templateId: 'h3-read-template',
  name: 'Header',
  parent: 'non-grid-template',
  type: 'h3-read-template',
  h3: 'title',
  element: 'h3'
}

export const h4 = {
  id: 'h4-read-template',
  templateId: 'h4-read-template',
  name: 'Subheader',
  parent: 'non-grid-template',
  type: 'h4-read-template',
  h4: 'title',
  element: 'h4'
}

export const textarea = {
  id: 'textarea-read-template',
  templateId: 'textarea-read-template',
  name: 'Text block',
  parent: 'non-grid-template',
  type: 'textarea-read-template',
  paras: [],
  element: 'p'
}

export const term = {
  id: 'terms-template',
  name: 'Terms', 
  parent: 'dl-template',
  type: 'terms',                 
  terms: [],
}

export const species = {
  id: 'species-template',
  name: 'Species catalogue',
  parent: 'grid-template',
  type: 'species',
  species: [],
}

export const observations = {
  id: 'species-template',
  name: 'Observations',
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
  id: 'xenocanto-read-template',
  name: 'Xeno-canto',
  templateId: 'xenocanto-read-template',
  parent: 'non-grid-template',
  type: 'xenocanto-read-template',
  element: 'input'
}

export const previewTemplates = [
    h3
  , h4
  , xenocanto
  , textarea
]

export const writeTemplates = [
  {
    id: 'h3-write-template',
    templateId: 'h3-write-template',
    readTemplateId: 'h3-read-template',
    element: 'input',
    previewElement: 'h3' 
  },
  {
    id: 'h4-write-template',
    templateId: 'h4-write-template',
    readTemplateId: 'h4-read-template',
    element: 'input',
    previewElement: 'h4'
  },
  {
    id: 'xenocanto-write-template',
    templateId: 'xenocanto-write-template',
    readTemplateId: 'xenocanto-read-template',
    element: 'input',
    previewElement: 'input'
  },
  {
    id: 'textarea-write-template',
    templateId: 'textarea-write-template',
    readTemplateId: 'textarea-read-template',
    element: 'textarea',
    previewElement: 'p'
  }
]