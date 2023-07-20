units-convert
=============

[![Downloads](https://img.shields.io/npm/dm/units-convert.svg)](https://www.npmjs.com/package/units-convert)

> Tip: This tool is modified on the basis of [convert-units](https://www.npmjs.com/package/convert-units), and the following functions are added:
> - Solve the problem of floating-point precision after unit conversion
> - More types of units

A handy utility for converting between quantities in different units.


Installation
-----

```bash
npm install units-convert --save
```

```bash
# beta builds are also available with
npm install units-convert@beta --save
```

Usage
-----

`units-convert` has a simple chained API that is easy to read. It can also be configured with the measures that are packaged with it or custom measures.

The code snippet below shows everything needed to get going:

```js
// `allMeasures` includes all the measures packaged with this library
import configureMeasurements from 'units-convert';
import allMeasures from 'units-convert/definitions/all';

const convert = configureMeasurements(allMeasures);
```

It's also possible to limit the measures configured. This allows for smaller packages when using a bundler like `webpack` or `rollup`:

```js
import configureMeasurements from 'units-convert';
import volume from 'units-convert/definitions/volume';

/*
  `configureMeasurements` is a closure that accepts a directory
  of measures and returns a factory function (`convert`) that uses
  only those measures.
*/
const convert = configureMeasurements({
    volume,
    mass,
    length,
});
```

Converting between units in a measure:

```js
convert(1).from('l').to('ml');
// 1000
```

Converting between systems is handled automatically (`imperial` to `metric` in this case):

```js
convert(1).from('lb').to('kg');
// 0.4536... (tested to 4 significant figures)
```

Attempting to convert between measures will result in an error:

```js
convert(1).from('oz').to('fl-oz');
// throws -- you can't go from mass to volume!
```

To convert a unit to another unit within the same measure with the smallest value above `1`:

```js
convert(12000).from('mm').toBest();
// { val: 12, unit: 'm', ... }
```

Exclude units to get different results:

```js
convert(12000).from('mm').toBest({ exclude: ['m'] });
// { val: 1200, unit: 'cm', ... } (the smallest unit excluding meters)
```

The best is always the smallest number above `1`. If the value is a negative number, the best is always the largest number below `-1`. The cut off number of either `1` or `-1` can be changed to get different results:

```js
convert(900).from('mm').toBest({ cutOffNumber: 10 });
// { val: 90, unit: 'cm', ... } (the smallest unit with a value equal to or above 10)

convert(1000).from('mm').toBest({ cutOffNumber: 10 });
// { val: 100, unit: 'cm', plural: 'Centimeters' } (the smallest unit with a value equal to or above 10)

// by default the system of the origin is used, the `system` option overwrites this behaviour
convert(254).from('mm').toBest({ system: 'imperial' }); // ('mm' is metric)
// { val: 10, unit: 'in', plural: 'Inches' }            // ('in' is imperial)
```

List all available measures:

```js
convert().measures();
// [ 'length', 'mass', 'volume', ... ]

const differentConvert = configureMeasurements({
    volume,
    mass,
    length,
    area,
});
differentConvert().measures();
// [ 'length', 'mass', 'volume', 'area' ]
```

List all units that a given unit can be converted to:

```js
convert().from('l').possibilities();
// [ 'ml', 'l', 'tsp', 'Tbs', 'fl-oz', 'cup', 'pnt', 'qt', 'gal' ]

convert().from('kg').possibilities();
// [ 'mcg', 'mg', 'g', 'kg', 'oz', 'lb' ]
```

List all units that belong to a measure:

```js
convert().possibilities('mass');
// [ 'mcg', 'mg', 'g', 'kg', 'oz', 'lb', 'mt', 't' ]
```

List all configured units:

```js
convert().possibilities();
// [ 'mm', 'cm', 'm', 'in', 'ft-us', 'ft', 'mi', 'mcg', 'mg', 'g', 'kg', 'oz', 'lb', 'mt', 't', 'ml', 'l', 'tsp', 'Tbs', 'fl-oz', 'cup', 'pnt', 'qt', 'gal', 'ea', 'dz' ];
```

Get a detailed description of a unit:

```js
convert().describe('kg');
/*
  {
    abbr: 'kg',
    measure: 'mass',
    system: 'metric',
    singular: 'Kilogram',
    plural: 'Kilograms',
  }
*/
```

List detailed descriptions of all units:

```js
convert().list();
/*
  [{
    abbr: 'kg',
    measure: 'mass',
    system: 'metric',
    singular: 'Kilogram',
    plural: 'Kilograms',
  }, ...]
*/
```

List detailed descriptions of all units for a measure:

```js
convert().list('mass');
/*
  [{
    abbr: 'kg',
    measure: 'mass',
    system: 'metric',
    singular: 'Kilogram',
    plural: 'Kilograms',
  }, ...]
*/
```

Custom Measures
---------------

To create a custom measure, it's best to start with an plain object. The key itself will be used as the measure's name. In the example below, the measure's name is "`customMeasure`".

<details>
<summary>Code example:</summary>

```js
const measure = {
  customMeasure: {},
};
```
</details>

Next step is to create the measure's systems. A system is a collection of related units. Here are some examples of some common systems: metric, imperial, SI, bits, bytes, etc. You don't need to use one of these systems for your measure. In the example below, there are 3 systems defined: `A`, `B`, `C`.

<details>
<summary>Code example:</summary>

```js
const measure = {
  customMeasure: {
    systems: {
      A: {},
      B: {},
      C: {},
    }
  },
};
```
</details>

Now the measure is ready to define some units. The first unit that needs to be defined for each system is the base unit. The base unit is like all other units except that it's the unit used to convert between systems and every other unit in the system will be configured to convert directly to it. Below is an example of a base unit for the `A` system.

<details>
<summary>Code example:</summary>

```js
const measure = {
  customMeasure: {
    systems: {
      A: {
        a: {  // the name of the unit (commonly an abbreviation)
          name: {  // human friendly names for the unit
            singular: 'a',
            plural: 'as',
          },
        }
      },
      // ignoring C & B for now
    }
  },
};
```
</details>

Each unit also needs to an `to_anchor` property. `to_anchor` holds a number which represents the factor needed to go from another unit in the system to the base unit. In the case of the `a` unit, the value will be `1`. The value for all base units in every system should to be `1` because if you convert `5 a` to `a` the result should be `5 a`. This is because the value of `to_anchor` is multiplied with the value of the unit being converted from. So in this case, `5 * 1 = 5`.

<details>
<summary>Code example:</summary>

```js
const measure = {
  customMeasure: {
    systems: {
      A: {
        a: {
          name: {
            singular: 'a',
            plural: 'as',
          },
          to_anchor: 1,
        }
      },
      // ignoring C & B for now
    }
  },
};
```
</details>

Adding a second measure to the `A` measure looks exactly the same as the `a` unit except the `to_anchor` value will be different. If the unit is supposed to be larger than the base then the `to_anchor` value needs to be greater than `1`. For example, the new unit `ah` should be a factor of 10 larger than the base. This would mean that `1 ah` equals `10 a`. To make sure this assumption is correct multiply the `to_anchor` by the unit, `5 ah * 10 = 50 a`.

<details>
<summary>Code example:</summary>

```js
const measure = {
  customMeasure: {
    systems: {
      A: {
        ah: {  // new unit, ah
          name: {
            singular: 'ah',
            plural: 'ahs',
          },
          to_anchor: 1e1,  // = 10 ^ 1 = 10
        },
        a: {
          name: {
            singular: 'a',
            plural: 'as',
          },
          to_anchor: 1,
        }
      },
      // ignoring C & B for now
    },
  },
};
```
</details>

If the unit should be smaller than the base unit then the `to_anchor` value should be less than `1` and greater than `0`. With that said, the new unit `al` should have a `to_anchor` value of `0.1`. This would mean that `10 al` would equal `1 a`.

<details>
<summary>Code example:</summary>

```js
const measure = {
  customMeasure: {
    systems: {
      A: {
        ah: {  // new unit, ah
          name: {
            singular: 'ah',
            plural: 'ahs',
          },
          to_anchor: 1e1,  // = 10 ^ 1 = 10
        },
        a: {
          name: {
            singular: 'a',
            plural: 'as',
          },
          to_anchor: 1,
        }
        al: {  // new unit, al
          name: {
            singular: 'al',
            plural: 'als',
          },
          to_anchor: 1e-1,  // = 10 ^ -1 = 0.1
        },
      },
      // ignoring C & B for now
    },
  },
};
```
</details>

There is one more option, `anchor_shift`, it can be defined on a unit if it requires to be shifted after the conversion. If `al` had a `anchor_shift` of `5` then `10 al` to `a` would look like, `10 * 0.1 - 5 = -4 a`. If the shift needs to go in the opposite direction then it should be a negative number. Typically, measures and units that use the `anchor_shift` only need to be shifted. If that is the desired effect then setting `to_anchor` to `1` for each unit will achieve that. To see a real world example, check out the `temperature` measure in the `definitions` folder.

<details>
<summary>Code example:</summary>

```js
const measure = {
  customMeasure: {
    systems: {
      A: {
        ah: {  // new unit, ah
          name: {
            singular: 'ah',
            plural: 'ahs',
          },
          to_anchor: 1e1,  // = 10 ^ 1 = 10
        },
        a: {
          name: {
            singular: 'a',
            plural: 'as',
          },
          to_anchor: 1,
        }
        al: {  // new unit, al
          name: {
            singular: 'al',
            plural: 'als',
          },
          to_anchor: 1e-1,  // = 10 ^ -1 = 0.1
          anchor_shift: 5,
        },
      },
      // ignoring C & B for now
    }
  },
};
```
</details>

At this point if the custom measure only needs one system then it's done! However, if it requires more than one system, an extra step is required. In the example code below, the previously ignored systems `C` and `B` have been defined to look exactly like the `A` system.

<details>
<summary>Code example:</summary>

```js
const measure = {
  customMeasure: {
    systems: {
      A: {
        ah: {
          name: {
            singular: 'ah',
            plural: 'ahs',
          },
          to_anchor: 1e1,
        },
        a: {
          name: {
            singular: 'a',
            plural: 'as',
          },
          to_anchor: 1,
        },
        al: {
          name: {
            singular: 'al',
            plural: 'als',
          },
          to_anchor: 1e-1,
        },
      },
      B: {
        bh: {
          name: {
            singular: 'bh',
            plural: 'bhs',
          },
          to_anchor: 1e1,
        },
        b: {
          name: {
            singular: 'b',
            plural: 'bs',
          },
          to_anchor: 1,
        },
        bl: {
          name: {
            singular: 'bl',
            plural: 'bls',
          },
          to_anchor: 1e-1,
        },
      },
      C: {
        ch: {
          name: {
            singular: 'ch',
            plural: 'chs',
          },
          to_anchor: 1e1,
        },
        c: {
          name: {
            singular: 'c',
            plural: 'cs',
          },
          to_anchor: 1,
        },
        cl: {
          name: {
            singular: 'cl',
            plural: 'cls',
          },
          to_anchor: 1e-1,
        },
      },
    },
  }
};
```
</details>

The measure now has three systems, `A`, `B`, and `C`. To define how each system can be converted to the other, anchors will needs to be defined for each possible conversion. To start, add the key `anchors` to the `customMeasure` object:

<details>
<summary>Code example:</summary>

```js
const measure = {
  customMeasure: {
    systems: {
      // ...
    },
    anchors: {},
  }
};
```
</details>

Then just like for the `systems` object, add a key for each system with it's value being an empty object:

<details>
<summary>Code example:</summary>

```js
const measure = {
  customMeasure: {
    systems: {
      // ...
    },
    anchors: {
      A: {},
      B: {},
      C: {},
    },
  }
};
```
</details>

In each of those empty objects, add keys for the other systems which their values being an empty object. The measure should look like the code snippet below:

<details>
<summary>Code example:</summary>

```js
const measure = {
  customMeasure: {
    systems: {
      // ...
    },
    anchors: {
      A: {  // A to B or C
        B: {},
        C: {},
      },
      B: {  // B to A or C
        A: {},
        C: {},
      },
      C: {  // C to A or B
        A: {},
        B: {},
      },
    },
  }
};
```
</details>

When converting, for example, `1 a` to `bl`, the code can perform a simple lookup here, `anchors.A.B`. If instead the conversion is from `10 c` to `ah` then the lookup would be, `anchors.C.A`. At this point how to convert from one system to the next hasn't been defined yet; that will be the next and final step in creating a new measure.

Each system pair needs to either defined a `ratio` or a `transform` function. If a `ratio` is defined then it's multiplied by the base unit to convert it to the target system's base unit. If `transform` is defined, the function is called with the value of the best unit. It's value is used as the base unit of the target system. The `transform` function should return a number.

> Note: If both `ratio` and `transform` are defined then the `ratio` will be used and the `transform` function will be ignored. If nether are defined, the conversion will throw an error.

<details>
<summary>Code example:</summary>

```js
const measure = {
  customMeasure: {
    systems: {
      // ...
    },
    anchors: {
      A: {  // A to B or C
        B: {
          ratio: 2,
        },
        C: {
          ratio: 3,
        },
      },
      B: {  // B to A or C
        A: {
          ratio: 1 / 2,
        },
        C: {
          ratio: 3 / 2,
        },
      },
      C: {  // C to A or B
        A: {
          // example of using a transform function
          // This would be the same as ratio: 1 / 3
          transform: value => value * 1 / 3,
        },
        B: {
          transform: value => value * 2 / 3,
        },
      },
    },
  }
};
```
</details>

With the above example, converting `10 cl` to `ah` would result in `0.0333` (rounded).

<details>
<summary>Here is the complete measure:</summary>

```js
const measure = {
  customMeasure: {
    systems: {
      A: {
        ah: {
          name: {
            singular: 'ah',
            plural: 'ahs',
          },
          to_anchor: 1e1,
        },
        a: {
          name: {
            singular: 'a',
            plural: 'as',
          },
          // to_anchor: The factor used to reach the base unit
          // The base unit should have a to_anchor value of 1
          // Eg. 1 a -> al = 1a * 1e-1 (to_anchor of al) = 10 al
          to_anchor: 1,
        },
        al: {
          name: {
            singular: 'al',
            plural: 'als',
          },
          to_anchor: 1e-1,
        },
      },
      B: {
        bh: {
          name: {
            singular: 'bh',
            plural: 'bhs',
          },
          to_anchor: 1e1,
        },
        b: {
          name: {
            singular: 'b',
            plural: 'bs',
          },
          to_anchor: 1,
        },
        bl: {
          name: {
            singular: 'bl',
            plural: 'bls',
          },
          to_anchor: 1e-1,
        },
      },
      C: {
        ch: {
          name: {
            singular: 'ch',
            plural: 'chs',
          },
          to_anchor: 1e1,
        },
        c: {
          name: {
            singular: 'c',
            plural: 'cs',
          },
          to_anchor: 1,
        },
        cl: {
          name: {
            singular: 'cl',
            plural: 'cls',
          },
          to_anchor: 1e-1,
        },
      },
    },
    anchors: {
      A: {
        // unit a -> unit b
        B: {
          ratio: 2,
        },
        // unit a -> unit c
        C: {
          ratio: 3,
        },
      },
      B: {
        // unit b -> unit a
        A: {
          ratio: 1 / 2,
        },
        // unit b -> unit c
        C: {
          ratio: 3 / 2,
        },
      },
      C: {
        // unit c -> unit a
        A: {
          ratio: 1 / 3,
        },
        // unit c -> unit b
        B: {
          ratio: 2 / 3,
        },
      },
    },
  }
};

const convert = configureMeasurements(measure);
convert(1).from('a').to('bl')
// 20
```
</details>

<details>
<summary>Pseudo code that shows the maths involved when converting a unit</summary>

```js
// a -> bl
let v = 1  // 1 a
let a_to_anchor = 1  // systems.A.a.to_anchor
let r = v * a_to_anchor
// r = 1 a
let ratio = 2  // anchors.A.B.ratio
r *= ratio
// r = 2 b
let bl_to_anchor = 1e-1  // systems.B.bl.to_anchor
r /= b_to_anchor
// r = 20 bl
```
</details>

## Extending Existing Measures

Since measure definitions are plain JS objects, additional units can be added, removed, and changed.

<details>
<summary>Example of extending the `length` measure</summary>

```ts
import configureMeasurements, {
  Measure
} from 'units-convert';

import
  length, {
  LengthSystems,
  LengthUnits,
} from "units-convert/definitions/length"

type NewLengthUnits = LengthUnits | 'px';
const DPI = 96;
const extendedLength: Measure<LengthSystems, NewLengthUnits> = {
  systems: {
    metric: {
      ...length.systems.metric,
      px: {
        name: {
          singular: 'Pixel',
          plural: 'Pixels',
        },
        to_anchor: 0.0254 / DPI,
      },
    },
    imperial: {
      ...length.systems.imperial,
    },
  },
  anchors: {
    ...length.anchors,
  },
};

const convert = configureMeasurements<'length', LengthSystems, NewLengthUnits>(
  { length: extendedLength }
);

convert(4).from('cm').to('px');
// 151.18110236220474
```
</details>

Migrating from v2 to v3+
-----------------------

This only applies if moving from `<=2.3.4` to `>=3.x`.

`index.js`
```js
import convert from 'units-convert';

convert(1).from('m').to('mm');
convert(1).from('m').to('ft');
```

The code above could be changed to match the following:

`index.js`
```js
import convert from './convert';  // defined below

convert(1).from('m').to('mm');
convert(1).from('m').to('ft');
```

`convert.js`
```js
import configureMeasurements from 'units-convert';
import allMeasures from 'units-convert/definitions/all';

export default configureMeasurements(allMeasures);
```

Typescript
----------

The library provides types for all packaged mesasures:

```ts
import configureMeasurements from 'units-convert';

import length, {
  LengthSystems,
  LengthUnits,
} from "units-convert/definitions/length"

import area, {
  AreaSystems,
  AreaUnits,
} from "units-convert/definitions/area"

// Measures: The names of the measures being used
type Measures = 'length' | 'area';
// Systems: The systems being used across all measures
type Systems = LengthSystems | AreaSystems;
// Units: All the units across all measures and their systems
type Units = LengthUnits | AreaUnits;

const convert = configureMeasurements<Measures, Systems, Units>({
  length,
  area,
});

convert(4).from('m').to('cm');
// 400
```

This also allows for IDE tools to highlight issues before running the application:

```ts
import configureMeasurements from 'units-convert';

import length, {
  LengthSystems,
  LengthUnits,
} from "units-convert/definitions/length"

import area, {
  AreaSystems,
  AreaUnits,
} from "units-convert/definitions/area"

// Measures: The names of the measures being used
type Measures = 'length' | 'area';
// Systems: The systems being used across all measures
type Systems = LengthSystems | AreaSystems;
// Units: All the units across all measures and their systems
type Units = LengthUnits | AreaUnits;

const convert = configureMeasurements<Measures, Systems, Units>({
  length,
  area,
});

convert(4).from('wat').to('cm');
// Typescript will warm that the unit `wat` does not exist because it's not a member of the `Units` type defined above.
```

Types for the `allMeasures` object are also provided:

```js
import configureMeasurements from 'units-convert';

import allMeasures, {
  AllMeasures,
  AllMeasuresSystems,
  AllMeasuresUnits,
} from 'units-convert/definitions/all';

const convertAll = configureMeasurements<
  AllMeasures,
  AllMeasuresSystems,
  AllMeasuresUnits
>(allMeasures);

convertAll(4).from('m2').to('cm2');
// 400000
```

Request Measures & Units
-----------------------

All new measures and additional units are welcome! Take a look at [`src/definitions`](https://github.com/units-convert/units-convert/tree/main/src/definitions) to see some examples.

Packaged Units
--------------
<details>
<summary>Length 长度</summary>

- `nm`：纳米 (nanometer)
- `μm`：微米 (micrometer)
- `mm`：毫米 (millimeter)
- `cm`：厘米 (centimeter)
- `m`：米 (meter)
- `km`：千米 (kilometer)
- `in`：英寸 (inch)
- `yd`：码 (yard)
- `ft-us`：美国英尺 (U.S. survey foot)
- `ft`：英尺 (foot)
- `fathom`：英寻 (fathom)
- `mi`：英里 (mile)
- `nMi`：海里 (nautical mile)
</details>

<details>
<summary>Area 面积</summary>

- `mm2`：平方毫米 (square millimeter)
- `cm2`：平方厘米 (square centimeter)
- `m2`：平方米 (square meter)
- `ha`：公顷 (hectare)
- `km2`：平方千米 (square kilometer)
- `in2`：平方英寸 (square inch)
- `ft2`：平方英尺 (square foot)
- `ac`：英亩 (acre)
- `mi2`：平方英里 (square mile)
</details>

<details>
<summary>Mass 质量</summary>

- `mcg`：微克 (microgram)
- `mg`：毫克 (milligram)
- `g`：克 (gram)
- `kg`：千克 (kilogram)
- `oz`：盎司 (ounce)
- `lb`：磅 (pound)
- `mt`：公吨 (metric ton)
- `t`：吨 (ton)
</details>

<details>
<summary>Volume 体积/容量</summary>

- `mm3`：立方毫米 (cubic millimeter)
- `cm3`：立方厘米 (cubic centimeter)
- `ml`：毫升 (milliliter)
- `l`：升 (liter)
- `kl`：千升 (kiloliter)
- `Ml`：兆升 (megaliter)
- `Gl`：吉升 (gigaliter)
- `m3`：立方米 (cubic meter)
- `km3`：立方千米 (cubic kilometer)
- `tsp`：茶匙 (teaspoon)
- `Tbs`：汤匙 (tablespoon)
- `in3`：立方英寸 (cubic inch)
- `fl-oz`：液体盎司 (fluid ounce)
- `cup`：杯 (cup)
- `pnt`：品脱 (pint)
- `qt`：夸脱 (quart)
- `gal`：加仑 (gallon)
- `ft3`：立方英尺 (cubic foot)
- `yd3`：立方码 (cubic yard)
</details>

<details>
<summary>Volume Flow Rate 容量流量</summary>

- `mm3/s`：每秒立方毫米 (cubic millimeter per second)
- `cm3/s`：每秒立方厘米 (cubic centimeter per second)
- `ml/s`：每秒毫升 (milliliter per second)
- `cl/s`：每秒厘升 (centiliter per second)
- `dl/s`：每秒分升 (deciliter per second)
- `l/s`：每秒升 (liter per second)
- `l/min`：每分钟升 (liter per minute)
- `l/h`：每小时升 (liter per hour)
- `kl/s`：每秒千升 (kiloliter per second)
- `kl/min`：每分钟千升 (kiloliter per minute)
- `kl/h`：每小时千升 (kiloliter per hour)
- `m3/s`：每秒立方米 (cubic meter per second)
- `m3/min`：每分钟立方米 (cubic meter per minute)
- `m3/h`：每小时立方米 (cubic meter per hour)
- `km3/s`：每秒立方千米 (cubic kilometer per second)
- `tsp/s`：每秒茶匙 (teaspoon per second)
- `Tbs/s`：每秒汤匙 (tablespoon per second)
- `in3/s`：每秒立方英寸 (cubic inch per second)
- `in3/min`：每分钟立方英寸 (cubic inch per minute)
- `in3/h`：每小时立方英寸 (cubic inch per hour)
- `fl-oz/s`：每秒液体盎司 (fluid ounce per second)
- `fl-oz/min`：每分钟液体盎司 (fluid ounce per minute)
- `fl-oz/h`：每小时液体盎司 (fluid ounce per hour)
- `cup/s`：每秒杯 (cup per second)
- `pnt/s`：每秒品脱 (pint per second)
- `pnt/min`：每分钟品脱 (pint per minute)
- `pnt/h`：每小时品脱 (pint per hour)
- `qt/s`：每秒夸脱 (quart per second)
- `gal/s`：每秒加仑 (gallon per second)
- `gal/min`：每分钟加仑 (gallon per minute)
- `gal/h`：每小时加仑 (gallon per hour)
- `ft3/s`：每秒立方英尺 (cubic foot per second)
- `ft3/min`：每分钟立方英尺 (cubic foot per minute)
- `ft3/h`：每小时立方英尺 (cubic foot per hour)
- `yd3/s`：每秒立方码 (cubic yard per second)
- `yd3/min`：每分钟立方码 (cubic yard per minute)
- `yd3/h`：每小时立方码 (cubic yard per hour)
</details>

<details>
<summary>Temperature 温度</summary>

- `C`：摄氏度 (Celsius)
- `F`：华氏度 (Fahrenheit)
- `K`：开尔文 (Kelvin)
- `R`：兰氏度 (Rankine)
</details>

<details>
<summary>Time 时间</summary>

- `ns`：纳秒 (nanosecond)
- `μs`：微秒 (microsecond)
- `ms`：毫秒 (millisecond)
- `s`：秒 (second)
- `min`：分钟 (minute)
- `h`：小时 (hour)
- `d`：天 (day)
- `week`：周 (week)
- `month`：月 (month)
- `year`：年 (year)
</details>

<details>
<summary>Frequency 频率/角速度</summary>

- `Hz`：赫兹 (hertz)
- `mHz`：毫赫兹 (millihertz)
- `kHz`：千赫兹 (kilohertz)
- `MHz`：兆赫兹 (megahertz)
- `GHz`：千兆赫兹 (gigahertz)
- `THz`：太赫兹 (terahertz)
- `rpm`：每分钟转数 (revolutions per minute)
- `deg/s`：每秒角度 (degrees per second)
- `rad/s`：每秒弧度 (radians per second)
</details>

<details>
<summary>Speed 速度</summary>

- `m/s`：米每秒 (meters per second)
- `km/h`：千米每小时 (kilometers per hour)
- `mph`：英里每小时 (miles per hour)
- `knot`：海里每小时 (knots)
- `ft/s`：英尺每秒 (feet per second)
- `in/h`：英寸每小时 (inches per hour)
- `mm/h`：毫米每小时 (millimeters per hour)
</details>

<details>
<summary>Pace 速度倒数</summary>

- `s/m`：每米秒 (seconds per meter)
- `min/km`：每千米分钟 (minutes per kilometer)
- `s/ft`：每英尺秒 (seconds per foot)
- `min/mi`：每英里分钟 (minutes per mile)
</details>

<details>
<summary>Pressure 压力</summary>

- `Pa`：帕斯卡 (Pascal)
- `hPa`：百帕斯卡 (hectopascal)
- `kPa`：千帕斯卡 (kilopascal)
- `MPa`：兆帕斯卡 (megapascal)
- `bar`：巴 (bar)
- `torr`：托 (torr)
- `mH2O`：米水柱 (meter of water column)
- `mmHg`：毫米汞柱 (millimeters of mercury)
- `psi`：磅力/平方英寸 (pound per square inch)
- `ksi`：千磅力/平方英寸 (kilo pound per square inch)
</details>

<details>
<summary>Digital 数据</summary>

- `b`：比特 (bit)
- `Kb`：千比特 (kilobit)
- `Mb`：兆比特 (megabit)
- `Gb`：千兆比特 (gigabit)
- `Tb`：太比特 (terabit)
- `B`：字节 (byte)
- `KB`：千字节 (kilobyte)
- `MB`：兆字节 (megabyte)
- `GB`：千兆字节 (gigabyte)
- `TB`：太字节 (terabyte)
</details>

<details>
<summary>Illuminance 照度</summary>

- `lx`：勒克斯 (lux)
- `ft-cd`：英尺烛光 (foot-candle)
</details>

<details>
<summary>Parts-Per 浓度/含量</summary>

- `ppm`：百万分之一 (parts per million)
- `ppb`：十亿分之一 (parts per billion)
- `ppt`：万亿分之一 (parts per trillion)
- `ppq`：千万亿分之一 (parts per quadrillion)
</details>

<details>
<summary>Voltage 电压</summary>

- `V`：伏特 (Volt)
- `mV`：毫伏特 (millivolt)
- `kV`：千伏特 (kilovolt)
</details>

<details>
<summary>Current 电流</summary>

- `A`：安培 (Ampere)
- `mA`：毫安培 (milliampere)
- `kA`：千安培 (kiloampere)
</details>

<details>
<summary>Power 功率</summary>

- `W`：瓦特 (Watt)
- `mW`：毫瓦特 (milliwatt)
- `kW`：千瓦特 (kilowatt)
- `MW`：兆瓦特 (megawatt)
- `GW`：千兆瓦特 (gigawatt)
- `PS`：皮卡瓦特 (petawatt)
- `Btu/s`：英热单位每秒 (British thermal unit per second)
- `ft-lb/s`：英尺-磅每秒 (foot-pound per second)
- `hp`：马力 (horsepower)
</details>

<details>
<summary>Apparent Power 视在功率</summary>

- `VA`：伏安 (volt-ampere)
- `mVA`：毫伏安 (millivolt-ampere)
- `kVA`：千伏安 (kilovolt-ampere)
- `MVA`：兆伏安 (megavolt-ampere)
- `GVA`：千兆伏安 (gigavolt-ampere)
</details>

<details>
<summary>Reactive Power 无功功率</summary>

- `VAR`：伏安无功 (volt-ampere reactive)
- `mVAR`：毫伏安无功 (millivolt-ampere reactive)
- `kVAR`：千伏安无功 (kilovolt-ampere reactive)
- `MVAR`：兆伏安无功 (megavolt-ampere reactive)
- `GVAR`：千兆伏安无功 (gigavolt-ampere reactive)
</details>

<details>
<summary>Energy 能量/功耗</summary>

- `Ws`：瓦秒 (watt-second)
- `Wh`：瓦时 (watt-hour)
- `mWh`：毫瓦时 (milliwatt-hour)
- `kWh`：千瓦时 (kilowatt-hour)
- `MWh`：兆瓦时 (megawatt-hour)
- `GWh`：千兆瓦时 (gigawatt-hour)
- `J`：焦耳 (joule)
- `kJ`：千焦耳 (kilojoule)
- `MJ`：兆焦耳 (megajoule)
- `GJ`：千兆焦耳 (gigajoule)
</details>

<details>
<summary>Reactive Energy 无功功耗</summary>

- `VARh`：伏安无功时 (volt-ampere reactive hour)
- `mVARh`：毫伏安无功时 (millivolt-ampere reactive hour)
- `kVARh`：千伏安无功时 (kilovolt-ampere reactive hour)
- `MVARh`：兆伏安无功时 (megavolt-ampere reactive hour)
- `GVARh`：千兆伏安无功时 (gigavolt-ampere reactive hour)
</details>

<details>
<summary>Angle 角度</summary>

- `deg`：度 (degree)
- `rad`：弧度 (radian)
- `grad`：百分度 (gradian)
- `arcmin`：角分 (arcminute)
- `arcsec`：角秒 (arcsecond)
</details>

<details>
<summary>Charge 电荷</summary>

- `c`：库仑 (coulomb)
- `mC`：毫库仑 (milliampere)
- `μC`：微库仑 (microcoulomb)
- `nC`：纳库仑 (nanocoulomb)
- `pC`：皮库仑 (picocoulomb)
</details>

<details>
<summary>Force 力</summary>

- `N`：牛顿 (Newton)
- `kN`：千牛顿 (kilonewton)
- `lbf`：磅力 (pound-force)
</details>

<details>
<summary>Acceleration 加速度</summary>

- `g (g-force)`：重力加速度 (acceleration due to gravity)
- `m/s2`：标准加速度 (standard acceleration)
</details>

<details>
<summary>Pieces 数量/计量</summary>

- `pcs`：pieces（件数），表示物品的数量。
- `bk-doz`：baker's dozen（烘焙师的一打），表示13个物品，比标准的一打（12个）多一个。
- `cp`：cents（分），表示货币单位中的百分之一。
- `doz-doz`：dozen dozen（打打），表示12打，即144个物品。
- `doz`：dozen（打），表示12个物品。
- `gr-gr`：gross gross（十二打十二打），表示12打，即144个物品。
- `gros`：gross（十二打），表示12打，即144个物品。
- `half-dozen`：half a dozen（半打），表示6个物品。
- `long-hundred`：long hundred（长百），表示120个物品。
- `ream`：ream（令），表示一组纸张，通常为500张。
- `scores`：scores（二十个一组），表示20个物品。
- `sm-gr`：small gross（小打），表示10打，即120个物品。
- `trio`：trio（三个一组），表示3个物品。
</details>


License
-------
Copyright (c) 2013-2017 Ben Ng and Contributors, http://benng.me

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
