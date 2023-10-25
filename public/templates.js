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