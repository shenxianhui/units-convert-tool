units-convert
=============

> 本工具修改自[convert-units](https://www.npmjs.com/package/convert-units)，增加了以下功能：
> - 解决浮点数精度问题
> - 更加丰富的单位类型

一个方便的实用程序，用于在不同单位的数量之间进行转换。

安装
-----

```
npm install units-convert --save
```

用法
-----

`units-convert` 有一个简单的链式 API，易于阅读。

以下是在体积的公制单位之间移动的方法：

```js
var convert = require('units-convert')

convert(1).from('l').to('ml')
// 1000
```

以同样的方式从英制单位跳转到公制单位：

```js
convert(1).from('lb').to('kg')
// 0.4536... (测试为 4 位有效数字)
```

请注意不要使用无效的转换：

```js
convert(1).from('oz').to('fl-oz')
// Error: Cannot convert incompatible measures of volume and mass
```

您可以要求 `units-convert` 来选择最适合您的单位。 您还可以选择显式排除数量级或指定用于选择最佳表示的截止数。

```js
convert(12000).from('mm').toBest()
// 12 Meters (数值大于 1 的最小单位)

convert(12000).from('mm').toBest({ exclude: ['m'] })
// 1200 Centimeters (除米之外的最小单位)

convert(900).from('mm').toBest({ cutOffNumber: 10 });
// 900 Centimeters (数值等于或大于 10 的最小单位)

convert(1000).from('mm').toBest({ cutOffNumber: 10 })
// 10 Meters (数值等于或大于 10 的最小单位)
```

您可以获取 `.measures` 支持的测量类型列表

```js
convert().measures()
// [ 'length', 'mass', 'volume' ]
```

如果您想知道单位的转换，只需使用 `.possibilities`

```js
convert().from('l').possibilities()
// [ 'ml', 'l', 'tsp', 'Tbs', 'fl-oz', 'cup', 'pnt', 'qt', 'gal' ]

convert().from('kg').possibilities()
// [ 'mcg', 'mg', 'g', 'kg', 'oz', 'lb' ]
```

您还可以获取单元相关的转换：

```js
convert().possibilities('mass')
// [ 'mcg', 'mg', 'g', 'kg', 'oz', 'lb', 'mt', 't' ]
```

您还可以获取所有可用的单位：

```js
convert().possibilities()
// [ 'mm', 'cm', 'm', 'in', 'ft-us', 'ft', 'mi', 'mcg', 'mg', 'g', 'kg', 'oz', 'lb', 'mt', 't', 'ml', 'l', 'tsp', 'Tbs', 'fl-oz', 'cup', 'pnt', 'qt', 'gal', 'ea', 'dz' ];
```

要获取单元的详细描述，请使用 `describe`

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

要获取所有单位的详细描述，请使用 `list`

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

您还可以获取某个单元的所有单位的详细描述：

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

支持单位
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
