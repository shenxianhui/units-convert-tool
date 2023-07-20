var metric, imperial

metric = {
  'kg/s': {
    name: {
      singular: 'Kilogram per second',
      plural: 'Kilograms per second',
    },
    to_anchor: 1,
  },
  'kg/h': {
    name: {
      singular: 'Kilogram per hour',
      plural: 'Kilograms per hour',
    },
    to_anchor: 1 / 3600,
  },
  'mt/h': {
    name: {
      singular: 'Ton per hour',
      plural: 'Tons per hour',
    },
    to_anchor: 1 / 3.6,
  },
}

imperial = {
  'lb/s': {
    name: {
      singular: 'Pound per second',
      plural: 'Pounds per second',
    },
    to_anchor: 1,
  },
  'lb/h': {
    name: {
      singular: 'Pound per hour',
      plural: 'Pounds per hour',
    },
    to_anchor: 1 / 3600,
  },
}

module.exports = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: 'kg/s',
			ratio: 1 / 0.453592,
    },
    imperial: {
      unit: 'lb/s',
			ratio: 0.453592,
    },
  },
}
