units-convert
=============

> This tool is modified from [convert-units](https://www.npmjs.com/package/convert-units), adding the following functions:
> - Solve the problem of floating-point precision after unit conversion
> - More types of units
> - Add [中文文档](https://github.com/shenxianhui/units-convert/blob/master/README_CN.md)

A handy utility for converting between quantities in different units.

Installation
-----

```
npm install units-convert --save
```

Usage
-----

`units-convert` has a simple chained API that is easy to read.

Here's how you move between the metric units for volume:

```js
var convert = require('units-convert')

convert(1).from('l').to('ml')
// 1000
```

Jump from imperial to metric units the same way:

```js
convert(1).from('lb').to('kg')
// 0.4536... (tested to 4 significant figures)
```

Just be careful not to ask for an impossible conversion:

```js
convert(1).from('oz').to('fl-oz')
// throws -- you can't go from mass to volume!
```

You can ask `units-convert` to select the best unit for you. You can also optionally explicitly exclude orders of magnitude or specify a cut off number for selecting the best representation.
```js
convert(12000).from('mm').toBest()
// 12 Meters (the smallest unit with a value above 1)

convert(12000).from('mm').toBest({ exclude: ['m'] })
// 1200 Centimeters (the smallest unit excluding meters)

convert(900).from('mm').toBest({ cutOffNumber: 10 });
// 900 Centimeters (the smallest unit with a value equal to or above 10)

convert(1000).from('mm').toBest({ cutOffNumber: 10 })
// 10 Meters (the smallest unit with a value equal to or above 10)
```

You can get a list of the measurement types supported with `.measures`

```js
convert().measures()
// [ 'length', 'mass', 'volume' ]
```

If you ever want to know the possible conversions for a unit, just use `.possibilities`

```js
convert().from('l').possibilities()
// [ 'ml', 'l', 'tsp', 'Tbs', 'fl-oz', 'cup', 'pnt', 'qt', 'gal' ]

convert().from('kg').possibilities()
// [ 'mcg', 'mg', 'g', 'kg', 'oz', 'lb' ]
```

You can also get the possible conversions for a measure:
```js
convert().possibilities('mass')
// [ 'mcg', 'mg', 'g', 'kg', 'oz', 'lb', 'mt', 't' ]
```

You can also get the all the available units:
```js
convert().possibilities()
// [ 'mm', 'cm', 'm', 'in', 'ft-us', 'ft', 'mi', 'mcg', 'mg', 'g', 'kg', 'oz', 'lb', 'mt', 't', 'ml', 'l', 'tsp', 'Tbs', 'fl-oz', 'cup', 'pnt', 'qt', 'gal', 'ea', 'dz' ];
```

To get a detailed description of a unit, use `describe`

```js
convert().describe('kg')
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

To get detailed descriptions of all units, use `list`.

```js
convert().list()
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

You can also get detailed descriptions of all units for a measure:

```js
convert().list('mass')
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

Supported Units
--------------
<details>
<summary>Length</summary>

- `nm`: nanometer
- `μm`: micrometer
- `mm`: millimeter
- `cm`: centimeter
- `m`: meter
- `km`: kilometer
- `in`: inch
- `yd`: yard
- `ft-us`: U.S. survey foot
- `ft`: foot
- `fathom`: fathom
- `mi`: mile
- `nMi`: nautical mile
</details>

<details>
<summary>Area</summary>

- `mm2`: square millimeter
- `cm2`: square centimeter
- `m2`: square meter
- `ha`: hectare
- `km2`: square kilometer
- `in2`: square inch
- `ft2`: square foot
- `ac`: acre
- `mi2`: square mile
</details>

<details>
<summary>Mass</summary>

- `mcg`: microgram
- `mg`: milligram
- `g`: gram
- `kg`: kilogram
- `oz`: ounce
- `lb`: pound
- `mt`: metric ton
- `t`: ton
</details>

<details>
<summary>Volume</summary>

- `mm3`: cubic millimeter
- `cm3`: cubic centimeter
- `ml`: milliliter
- `l`: liter
- `kl`: kiloliter
- `Ml`: megaliter
- `Gl`: gigaliter
- `m3`: cubic meter
- `km3`: cubic kilometer
- `tsp`: teaspoon
- `Tbs`: tablespoon
- `in3`: cubic inch
- `fl-oz`: fluid ounce
- `cup`: cup
- `pnt`: pint
- `qt`: quart
- `gal`: gallon
- `ft3`: cubic foot
- `yd3`: cubic yard
</details>

<details>
<summary>Volume Flow Rate</summary>

- `mm3/s`: cubic millimeter per second
- `cm3/s`: cubic centimeter per second
- `ml/s`: milliliter per second
- `cl/s`: centiliter per second
- `dl/s`: deciliter per second
- `l/s`: liter per second
- `l/min`: liter per minute
- `l/h`: liter per hour
- `kl/s`: kiloliter per second
- `kl/min`: kiloliter per minute
- `kl/h`: kiloliter per hour
- `m3/s`: cubic meter per second
- `m3/min`: cubic meter per minute
- `m3/h`: cubic meter per hour
- `km3/s`: cubic kilometer per second
- `tsp/s`: teaspoon per second
- `Tbs/s`: tablespoon per second
- `in3/s`: cubic inch per second
- `in3/min`: cubic inch per minute
- `in3/h`: cubic inch per hour
- `fl-oz/s`: fluid ounce per second
- `fl-oz/min`: fluid ounce per minute
- `fl-oz/h`: fluid ounce per hour
- `cup/s`: cup per second
- `pnt/s`: pint per second
- `pnt/min`: pint per minute
- `pnt/h`: pint per hour
- `qt/s`: quart per second
- `gal/s`: gallon per second
- `gal/min`: gallon per minute
- `gal/h`: gallon per hour
- `ft3/s`: cubic foot per second
- `ft3/min`: cubic foot per minute
- `ft3/h`: cubic foot per hour
- `yd3/s`: cubic yard per second
- `yd3/min`: cubic yard per minute
- `yd3/h`: cubic yard per hour
</details>

<details>
<summary>Temperature</summary>

- `C`: Celsius
- `F`: Fahrenheit
- `K`: Kelvin
- `R`: Rankine
</details>

<details>
<summary>Time</summary>

- `ns`: nanosecond
- `μs`: microsecond
- `ms`: millisecond
- `s`: second
- `min`: minute
- `h`: hour
- `d`: day
- `week`: week
- `month`: month
- `year`: year
</details>

<details>
<summary>Frequency</summary>

- `Hz`: hertz
- `mHz`: millihertz
- `kHz`: kilohertz
- `MHz`: megahertz
- `GHz`: gigahertz
- `THz`: terahertz
- `rpm`: revolutions per minute
- `deg/s`: degrees per second
- `rad/s`: radians per second
</details>

<details>
<summary>Speed</summary>

- `m/s`: meters per second
- `km/h`: kilometers per hour
- `mph`: miles per hour
- `knot`: knots
- `ft/s`: feet per second
- `in/h`: inches per hour
- `mm/h`: millimeters per hour
</details>

<details>
<summary>Pace</summary>

- `s/m`: seconds per meter
- `min/km`: minutes per kilometer
- `s/ft`: seconds per foot
- `min/mi`: minutes per mile
</details>

<details>
<summary>Pressure</summary>

- `Pa`: Pascal
- `hPa`: hectopascal
- `kPa`: kilopascal
- `MPa`: megapascal
- `bar`: bar
- `torr`: torr
- `mH2O`: meter of water column
- `mmHg`: millimeters of mercury
- `psi`: pound per square inch
- `ksi`: kilo pound per square inch
</details>

<details>
<summary>Digital</summary>

- `b`: bit
- `Kb`: kilobit
- `Mb`: megabit
- `Gb`: gigabit
- `Tb`: terabit
- `B`: byte
- `KB`: kilobyte
- `MB`: megabyte
- `GB`: gigabyte
- `TB`: terabyte
</details>

<details>
<summary>Illuminance</summary>

- `lx`: lux
- `ft-cd`: foot-candle
</details>

<details>
<summary>Parts-Per</summary>

- `ppm`: parts per million
- `ppb`: parts per billion
- `ppt`: parts per trillion
- `ppq`: parts per quadrillion
</details>

<details>
<summary>Voltage</summary>

- `V`: Volt
- `mV`: millivolt
- `kV`: kilovolt
</details>

<details>
<summary>Current</summary>

- `A`: Ampere
- `mA`: milliampere
- `kA`: kiloampere
</details>

<details>
<summary>Power</summary>

- `W`: Watt
- `mW`: milliwatt
- `kW`: kilowatt
- `MW`: megawatt
- `GW`: gigawatt
- `PS`: petawatt
- `Btu/s`: British thermal unit per second
- `ft-lb/s`: foot-pound per second
- `hp`: horsepower
</details>

<details>
<summary>Apparent Power</summary>

- `VA`: volt-ampere
- `mVA`: millivolt-ampere
- `kVA`: kilovolt-ampere
- `MVA`: megavolt-ampere
- `GVA`: gigavolt-ampere
</details>

<details>
<summary>Reactive Power</summary>

- `VAR`: volt-ampere reactive
- `mVAR`: millivolt-ampere reactive
- `kVAR`: kilovolt-ampere reactive
- `MVAR`: megavolt-ampere reactive
- `GVAR`: gigavolt-ampere reactive
</details>

<details>
<summary>Energy</summary>

- `Ws`: watt-second
- `Wh`: watt-hour
- `mWh`: milliwatt-hour
- `kWh`: kilowatt-hour
- `MWh`: megawatt-hour
- `GWh`: gigawatt-hour
- `J`: joule
- `kJ`: kilojoule
- `MJ`: megajoule
- `GJ`: gigajoule
</details>

<details>
<summary>Reactive Energy</summary>

- `VARh`: volt-ampere reactive hour
- `mVARh`: millivolt-ampere reactive hour
- `kVARh`: kilovolt-ampere reactive hour
- `MVARh`: megavolt-ampere reactive hour
- `GVARh`: gigavolt-ampere reactive hour
</details>

<details>
<summary>Angle</summary>

- `deg`: degree
- `rad`: radian
- `grad`: gradian
- `arcmin`: arcminute
- `arcsec`: arcsecond
</details>

<details>
<summary>Charge</summary>

- `c`: coulomb
- `mC`: milliampere
- `μC`: microcoulomb
- `nC`: nanocoulomb
- `pC`: picocoulomb
</details>

<details>
<summary>Force</summary>

- `N`: Newton
- `kN`: kilonewton
- `lbf`: pound-force
</details>

<details>
<summary>Acceleration</summary>

- `g (g-force)`: acceleration due to gravity
- `m/s2`: standard acceleration
</details>

<details>
<summary>Pieces</summary>

- `pcs`: pieces
- `bk-doz`: baker's dozen
- `cp`: cents
- `doz-doz`: dozen dozen
- `doz`: dozen
- `gr-gr`: gross gross
- `gros`: gross
- `half-dozen`: half a dozen
- `long-hundred`: long hundred
- `ream`: ream
- `scores`: scores
- `sm-gr`: small gross
- `trio`: trio
</details>
