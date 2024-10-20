# vec2d

Node.js 2d vector library with robust unit tests.

## Usage

```js
var v = require('vec2d');

var v1 = v(1, 2);
console.log(v1); // prints "(1, 2)"

var v2 = v1.offset(1, 0);
console.log(v2); // prints "(2, 2)"

var v3 = v({x: -1, y: 2.2});
console.log(v3); // prints "(-1, 2.2)"
```

Or a faster, less convenient version:

```js
var Vec2d = require('vec2d').Vec2d;

var v1 = new Vec2d(1, 2);
// etc...
```

More available functions are listed below in Test Coverage.

## Test Coverage

```
  v()
    ✓ no args 
    ✓ x, y 
    ✓ array 
    ✓ object 
    ✓ string coords 
    ✓ deserialize 
    ✓ invalid deserialize 
    ✓ unit 

  Vec2d
    ✓ unit 
    ✓ offset 
    ✓ add 
    ✓ sub 
    ✓ plus 
    ✓ minus 
    ✓ neg 
    ✓ mult 
    ✓ times 
    ✓ div 
    ✓ divBy 
    ✓ scale 
    ✓ scaled 
    ✓ clone 
    ✓ apply 
    ✓ applied 
    ✓ equals 
    ✓ toString 
    ✓ length 
    ✓ lengthSqrd 
    ✓ angle 
    ✓ normalize 
    ✓ normalized 
    ✓ boundMin 
    ✓ boundMax 
    ✓ floor 
    ✓ floored 
    ✓ ceil 
    ✓ ceiled 
    - project
    ✓ dot 
    ✓ rotate 
    ✓ rotated 
    ✓ distance 
    ✓ distanceSqrd 
    ✓ reflect 
    ✓ reflectAboutLine 
    ✓ set 


  45 passing (14ms)
  1 pending
```

More functions welcome in the form of pull requests.
