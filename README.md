# @takayoshiotake/color-toning

## Installation

```sh
npm install @takayoshiotake/color-toning
```

## Example

```js
import { lightness, hueRotate, saturate } from '@takayoshiotake/color-toning';

// This is same as darken(#003ee5, 10%) of Sass.
lightness("#003ee5", -0.1);
// "#0030b2"

// Complementary color:
hueRotate("#003ee5", 180);
// "#e5a700"

saturate("#003ee5", -1);
// "#737373"
```
