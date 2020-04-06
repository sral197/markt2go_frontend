export const marketDummy = {
  name: 'TestMarkt',
  location: 'Oldenburg',
  dayOfWeek: 2,
  startTime: '08:00',
  endTime: '14:00'
}

export const sellerDetailsDummy = {
  name: 'TestStand',
  category: 'Kategorie',
  description: 'Test Beschreibung',
  portfolio: [{
    name: 'Gemüse',
    products: [
      {
        unit: 'kg',
        name: 'Kartoffeln Linda (festkochend)',
        price: 1.99
      },
      {
        unit: 'kg',
        name: 'Kartoffeln Sieglinde (festkochend)',
        price: 1.79
      },
      {
        unit: 'kg',
        name: 'Kartoffeln Finka (vorwiegend festkochend)',
        price: 1.59
      },
      {
        unit: 'kg',
        name: 'Kartoffeln Augusta (mehligkochend)',
        price: 1.75
      },
      {
        unit: 'kg',
        name: 'Karotten aus der Region',
        price: 0.89
      },
      {
        unit: 'kg',
        name: 'Feldsalat aus der Region',
        price: 7.99
      },
      {
        unit: 'kg',
        name: 'Paprika aus Spanien (rot, gelb, grün)',
        price: 3.99
      },
      {
        unit: 'kg',
        name: 'Cherry-Tomaten aus regionalem Gewäschshaus',
        price: 8.75
      },
      {
        unit: '100g',
        name: 'Fleischtomaten aus Holland',
        price: 3.99
      }]
  },
  {
    name: 'Obst',
    products: [
      {
        unit: '100g',
        name: 'Äpfel Braeburn aus dem alten Land',
        price: 3.99
      },
      {
        unit: '100g',
        name: 'Birnen aus dem alten Land',
        price: 3.99
      },
      {
        unit: '100g',
        name: 'Bananen aus Equador',
        price: 3.99
      },
      {
        unit: '100g',
        name: 'Erdbeeren aus dem Gewächshaus',
        price: 3.99
      }]
  },
  {
    name: 'Sonstiges',
    products: [{
      unit: '100g',
      name: 'Irgendetwas anderes',
      price: 500
    }]
  }]
}
