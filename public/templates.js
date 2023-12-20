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
  id: 'h3-preview-template',
  templateId: 'h3-preview-template',
  writeTemplateId: 'h3-write-template',
  name: 'Header',
  parent: 'non-grid-template',
  type: 'h3-preview-template',
  h3: 'title',
  element: 'h3'
}

export const h4 = {
  id: 'h4-preview-template',
  templateId: 'h4-preview-template',
  writeTemplateId: 'h4-write-template',
  name: 'Subheader',
  parent: 'non-grid-template',
  type: 'h4-preview-template',
  h4: 'title',
  element: 'h4'
}

export const textarea = {
  id: 'textarea-preview-template',
  templateId: 'textarea-preview-template',
  writeTemplateId: 'textarea-write-template',
  name: 'Text block',
  parent: 'non-grid-template',
  type: 'textarea-preview-template',
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
  id: 'xenocanto-preview-template',
  name: 'Xeno-canto',
  templateId: 'xenocanto-preview-template',
  writeTemplateId: 'xenocanto-write-template',
  parent: 'non-grid-template',
  type: 'xenocanto-preview-template',
  element: 'p'
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
    previewTemplateId: 'h3-preview-template',
    element: 'input'
  },
  {
    id: 'h4-write-template',
    templateId: 'h4-write-template',
    previewTemplateId: 'h4-preview-template',
    element: 'input'
  },
  {
    id: 'xenocanto-write-template',
    templateId: 'xenocanto-write-template',
    previewTemplateId: 'xenocanto-preview-template',
    element: 'input'
  },
  {
    id: 'textarea-write-template',
    templateId: 'textarea-write-template',
    previewTemplateId: 'textarea-preview-template',
    element: 'textarea'
  }
]