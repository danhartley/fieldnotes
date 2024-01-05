export const templates = [
  {
        id: 'species-test-template'
      , templateId: 'species-test-template'
      , name: 'Species catalogue tests'
      , parent: 'grid-template'
      , pairedTemplateId: 'species-template'
      , isTest: true
      , targets: [
        {
              id: 'common'
            , name: 'common name'
        },
        {
              id: 'latin'
            , name: 'latin name'
        },
      ]
      , score: 0
      , scores: []
      , requiresSpecies: true
      , types: ['inatSearch', 'fieldnotes']
  },
  {
        id: 'species-template'
      , templateId: 'species-template'
      , name: 'Species catalogue'
      , parent: 'grid-template'
      , pairedTemplateId: 'species-test-template'
      , isTest: false
      , isTestable: true
      , requiresSpecies: true
      , types: ['inatSearch', 'fieldnotes']
  },
  {
      id: 'species-list-template'
    , templateId: 'species-list-template'
    , name: 'Species list'
    , parent: 'grid-template'
    , isTest: false
    , requiresSpecies: true
    , types: ['inatSearch', 'fieldnotes']
  },
  {
      id: 'fieldnotes-template'
    , templateId: 'fieldnotes-template'
    , name: 'Field notes'
    , parent: 'grid-template'
    , isTest: false
    , requiresSpecies: true
    , isTestable: false
    , types: ['fieldnotes']
  },
]

// TEMPLATES

export const h3 = {
    id: 'h3-preview-template'
  , templateId: 'h3-preview-template'
  , writeTemplateId: 'h3-write-template'
  , writeParentTemplateId: 'section-parent-template'
  , name: 'Header'
  , parent: 'non-grid-template'
  , type: 'h3-preview-template'
  , h3: 'title'
  , element: 'h3'
}

export const h4 = {
    id: 'h4-preview-template'
  , templateId: 'h4-preview-template'
  , writeTemplateId: 'h4-write-template'
  , writeParentTemplateId: 'section-parent-template'
  , name: 'Subheader'
  , parent: 'non-grid-template'
  , type: 'h4-preview-template'
  , h4: 'title'
  , element: 'h4'
}

export const textarea = {
    id: 'textarea-preview-template'
  , templateId: 'textarea-preview-template'
  , writeTemplateId: 'textarea-write-template'
  , writeParentTemplateId: 'section-parent-template'
  , name: 'Text block'
  , parent: 'non-grid-template'
  , type: 'textarea-preview-template'
  , paras: []
  , element: 'p'
}

export const terms = {
    id: 'terms-preview-template'
  , templateId: 'terms-preview-template'
  , writeTemplateId: 'terms-write-template'
  , writeParentTemplateId: 'section-parent-template'
  , name: 'Terms'
  , parent: 'dl-template'
  , type: 'terms'
  , terms: []
}

export const species = {
    id: 'species-preview-template'
  , templateId: 'species-preview-template'
  , writeTemplateId: 'species-write-template'
  , writeParentTemplateId: 'section-with-species-parent-template'
  , name: 'Species catalogue'
  , parent: 'grid-template'
  , type: 'species'
  , species: []
}

export const observations = {
    id: 'observations-preview-template'
  , templateId: 'observations-preview-template'
  , writeTemplateId: 'observations-write-template'
  , writeParentTemplateId: 'section-with-species-parent-template'
  , name: 'Observations catalogue'
  , parent: 'grid-template'
  , type: 'species'
  , species: []
}

export const inatlookup = {
    id: 'inat-lookup-preview-template'
  , templateId: 'inat-lookup-preview-template'
  , writeTemplateId: 'inat-lookup-write-template'
  , writeParentTemplateId: 'section-with-species-parent-template'
  , name: 'iNat species'
  , parent: 'grid-template'
  , type: 'species'
  , species: []
}

export const images = {
    id: 'images-preview-template'
  , templateId: 'images-preview-template'
  , writeTemplateId: 'images-write-template'
  , writeParentTemplateId: 'section-parent-template'
  , name: 'Context images'
  , parent: 'grid-template'
  , type: 'images'
  , images: []
}

export const annotation = {
    id: 'annotation-template'
  , name: 'annotation'
  , parent: 'dl-template'
  , type: 'annotation'
  , annotations: []
}

export const xenocanto = {
    id: 'xenocanto-preview-template'
  , name: 'Xeno-canto'
  , templateId: 'xenocanto-preview-template'
  , writeTemplateId: 'xenocanto-write-template'
  , writeParentTemplateId: 'section-parent-template'
  , parent: 'non-grid-template'
  , type: 'xenocanto-preview-template'
  , element: 'p'
}

export const previewTemplates = [
    h3
  , h4
  , xenocanto
  , textarea
  , species
  , observations
  , inatlookup
  , terms
  , images
]

export const writeTemplates = [
  {
      id: 'h3-write-template'
    , templateId: 'h3-write-template'
    , previewTemplateId: 'h3-preview-template'
    , writeParentTemplateId: 'section-parent-template'
    , element: 'input'
  },
  {
      id: 'h4-write-template'
    , templateId: 'h4-write-template'
    , previewTemplateId: 'h4-preview-template'
    , writeParentTemplateId: 'section-parent-template'
    , element: 'input'
  },
  {
      id: 'xenocanto-write-template'
    , templateId: 'xenocanto-write-template'
    , previewTemplateId: 'xenocanto-preview-template'
    , writeParentTemplateId: 'section-parent-template'
    , element: 'input'
  },
  {
      id: 'textarea-write-template'
    , templateId: 'textarea-write-template'
    , previewTemplateId: 'textarea-preview-template'
    , writeParentTemplateId: 'section-parent-template'
    , element: 'textarea'
  },
  {
      id: 'species-write-template'
    , templateId: 'species-write-template'
    , previewTemplateId: 'species-preview-template'
    , writeParentTemplateId: 'section-with-species-parent-template'
    , element: 'div'
  },
  {
      id: 'observations-write-template'
    , templateId: 'observations-write-template'
    , previewTemplateId: 'observations-preview-template'
    , writeParentTemplateId: 'section-with-species-parent-template'
    , element: 'div'
  },
  {
      id: 'inat-lookup-write-template'
    , templateId: 'inat-lookup-write-template'
    , previewTemplateId: 'inat-lookup-preview-template'
    , writeParentTemplateId: 'section-with-species-parent-template'
    , element: 'div'
  },
  {
      id: 'terms-write-template'
    , templateId: 'terms-write-template'
    , previewTemplateId: 'terms-preview-template'
    , writeParentTemplateId: 'section-parent-template'
    , element: 'div'
  },
  {
      id: 'images-write-template'
    , templateId: 'images-write-template'
    , previewTemplateId: 'images-preview-template'
    , writeParentTemplateId: 'section-parent-template'
    , element: 'div'
  },
]