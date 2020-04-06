export const weekDays = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag'
]

export const unitSettings = {
  kg: {
    chips: [
      {
        amount: 0.2,
        label: '200g'
      },
      {
        amount: 0.5,
        label: '500g'
      },
      {
        amount: 1,
        label: '1kg'
      },
      {
        amount: 2,
        label: '2kg'
      }
    ],
    step: 0.1,
    min: 0.1,
    max: 5
  },
  Stück: {
    chips: [
      {
        amount: 1,
        label: '1 Stück'
      },
      {
        amount: 2,
        label: '2 Stück'
      },
      {
        amount: 5,
        label: '5 Stück'
      },
      {
        amount: 10,
        label: '10 Stück'
      }
    ],
    step: 1,
    min: 1,
    max: 20
  },
  Gebinde: {
    chips: [
      {
        amount: 1,
        label: '1 Gebinde'
      },
      {
        amount: 2,
        label: '2 Gebinde'
      },
      {
        amount: 5,
        label: '5 Gebinde'
      },
      {
        amount: 10,
        label: '10 Gebinde'
      }
    ],
    step: 1,
    min: 1,
    max: 20
  },
  l: {
    chips: [
      {
        amount: 0.2,
        label: '200ml'
      },
      {
        amount: 0.5,
        label: '500ml'
      },
      {
        amount: 1,
        label: '1l'
      },
      {
        amount: 2,
        label: '2l'
      }
    ],
    step: 0.1,
    min: 0.1,
    max: 5
  },
  g: {
    chips: [
      {
        amount: 100,
        label: '100g'
      },
      {
        amount: 200,
        label: '200g'
      },
      {
        amount: 500,
        label: '500g'
      },
      {
        amount: 1000,
        label: '1kg'
      }
    ],
    step: 100,
    min: 10,
    max: 5000
  },
  ml: {
    chips: [
      {
        amount: 100,
        label: '100ml'
      },
      {
        amount: 200,
        label: '200ml'
      },
      {
        amount: 500,
        label: '500ml'
      },
      {
        amount: 1000,
        label: '1l'
      }
    ],
    step: 100
  }
}
export const units = ['kg', 'Stück', 'Gebinde', 'l', 'g', 'ml']
