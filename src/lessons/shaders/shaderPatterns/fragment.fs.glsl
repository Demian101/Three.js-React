precision mediump float;

// constant, without semicolon or equal sign
#define PI 3.1415926535897932384626433832795

uniform float uAlpha;

// 0.0, 0.0 bottom-left => 1.0, 1.0 top-right
// think of it like a chart ↗️
varying vec2 vUV;

// thebookofshaders.com/10
// this random function will always return the same value based on passed arguments
// this function is psuedo-random, not true random
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453132);
}

/*
 * mid => pivot point
 */
vec2 rotate(vec2 uv, float rotation, vec2 mid) {
  return vec2(
    cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
    cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
  );
}

// most popular perlin noises 👇
// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83

// permute function is manually provided from another algo in perlin noises gist
vec4 permute(vec4 x) {
  return mod(((x*34.0)+1.0)*x, 289.0);
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main() {

  // // pattern #1 (like normals)
  // gl_FragColor = vec4(vUV, 1.0, uAlpha);

  // // pattern #2 (no blue)
  // gl_FragColor = vec4(vUV, 0.0, uAlpha);

  // // 😲 extra pattern (half blue)
  // // gives an amazing palette
  // gl_FragColor = vec4(vUV, 0.5, uAlpha);

  // // pattern #3 (gradient black to white - horizontal)
  float strength = vUV.x;
  // gl_FragColor = vec4(vec3(strength), uAlpha);

  // // pattern #4 (gradient black to white - vertical)
  // strength = vUV.y;
  // gl_FragColor = vec4(vec3(strength), uAlpha);

  // // pattern #5 (gradient black to white - vertical reversed)
  // strength = vUV.y;
  // gl_FragColor = vec4(vec3(1.0 - strength), uAlpha);

  // // pattern #6 (gradient black to white - vertical easeIn)
  // strength = vUV.y * 10.0;

  // // pattern #7 (gradient black to white - vertical easeIn 10waves)
  // // like blinders
  // // mod(value, limit)
  // strength = mod(vUV.y * 10.0, 1.0);

  // // pattern #8 (sharp black to white - vertical 10waves intervals)
  // strength = mod(vUV.y * 10.0, 1.0);
  // // conditions are bad for GLSL performances
  // // can even work without curly brackets
  // // if (strength < 0.5) {
  // //   strength = 1.0;
  // // } else {
  // //   strength = 0.0;
  // // }
  // // or even ternary
  // // strength = strength < 0.5 ? 0.0 : 1.0;
  // // same result can be achieved with step
  // strength = step(0.5, strength);

  // // pattern #9 (sharp black to white - vertical 10waves intervals more black)
  // strength = mod(vUV.y * 10.0, 1.0);
  // strength = step(0.8, strength);

  // // pattern #10 (sharp black to white - horizontal 10waves intervals more black)
  // strength = mod(vUV.x * 10.0, 1.0);
  // strength = step(0.8, strength);

  // // pattern #11 (waffle, black squares, white borders - ten intervals)
  // strength = step(0.8, mod(vUV.x * 10.0, 1.0));
  // strength += step(0.8, mod(vUV.y * 10.0, 1.0));

  // // pattern #12 (square white polka dots)
  // strength = step(0.8, mod(vUV.x * 10.0, 1.0));
  // strength *= step(0.8, mod(vUV.y * 10.0, 1.0));

  // // pattern #13 (short vertical white lines)
  // strength = step(0.3, mod(vUV.x * 10.0, 1.0));
  // strength *= step(0.8, mod(vUV.y * 10.0, 1.0));

  // // pattern #14 (small top-right white corners)
  // float barX = step(0.3, mod(vUV.x * 10.0, 1.0));
  // barX *= step(0.8, mod(vUV.y * 10.0, 1.0));
  // float barY = step(0.3, mod(vUV.y * 10.0, 1.0));
  // barY *= step(0.8, mod(vUV.x * 10.0, 1.0));
  // strength = barX + barY;

  // // pattern #15 (small white plus signs)
  // float barX = step(0.3, mod(vUV.x * 10.0, 1.0));
  // barX *= step(0.8, mod(vUV.y * 10.0 + 0.25, 1.0));
  // float barY = step(0.8, mod(vUV.x * 10.0 + 0.25, 1.0));
  // barY *= step(0.3, mod(vUV.y * 10.0, 1.0));
  // strength = barX + barY;
  
  // // pattern #16 (gradient black to white - horizontal middle to side)
  // strength = abs(vUV.x - 0.5);
  
  // // pattern #17 (gradient black -ish to white - center to corners)
  // strength = min(abs(vUV.x - 0.5), abs(vUV.y - 0.5));
  
  // // pattern #18 (gradient black to white -ish - center to corners)
  // strength = max(abs(vUV.x - 0.5), abs(vUV.y - 0.5));
  
  // // pattern #19 (black window in the middle, white thick border)
  // // or think of it as white frame
  // strength = step(0.2, max(abs(vUV.x - 0.5), abs(vUV.y - 0.5)));
  
  // // pattern #20 (small black window in the middle, white small border)
  // strength = step(0.2, max(abs(vUV.x - 0.5), abs(vUV.y - 0.5)));
  // strength *= 1.0 - step(0.25, max(abs(vUV.x - 0.5), abs(vUV.y - 0.5)));
  
  // // pattern #21 (gradient black to white - horizontal steps)
  // strength = ceil(vUV.x * 10.0) / 10.0;
  // // or
  // strength = floor(vUV.x * 10.0) / 10.0;
  
  // // pattern #22 (gradient black to white - horizontal+vertical steps)
  // strength = ((floor(vUV.x * 10.0) / 10.0) + (floor(vUV.y * 10.0) / 10.0)) / 2.0;
  
  // // pattern #23 (black noise on white screen)
  // // we need to mimic a random function (method)
  // strength = random(vUV.xy); // or simply => random(vUV)
  
  // // pattern #24 (pixelated black noise on white screen - minecraft style)
  // // mixed with pattern #22
  // vec2 gridUV = vec2(
  //   (floor(vUV.x * 10.0) / 10.0), 
  //   (floor(vUV.y * 10.0) / 10.0)
  // );
  // strength = random(gridUV);
  
  // // pattern #25 (pixelated black noise on white screen - minecraft style - with offset on Y)
  // vec2 gridUV = vec2(
  //   (floor(vUV.x * 10.0) / 10.0), 
  //   (floor((vUV.y + vUV.x * 0.5) * 10.0) / 10.0)
  // );
  // strength = random(gridUV);
  
  // // pattern #26 (gradient black to white - bottom-left to top-right easeIn)
  // // length is distance from 0.0 (bottom-left)
  // strength = length(vUV);
  
  // // pattern #27 (gradient black circle in the middle to white)
  // strength = length(vUV - 0.5);
  // // or
  // // distance creates some kind of point of origin effect
  // strength = distance(vUV, vec2(0.5, 0.5));
  
  // // pattern #28 (opposite to #27)
  // strength = 1.0 - distance(vUV, vec2(0.5, 0.5));
  
  // // pattern #29 (like previous but eclipsed sun)
  // // point light effect / faraway star
  // strength = 0.015 / distance(vUV, vec2(0.5, 0.5)) - 0.1;
  
  // // pattern #30 (like previous but stretched on x)
  // // point light effect / faraway star
  // vec2 lightUV = vec2(
  //   vUV.x * 0.25 + 0.375,
  //   vUV.y
  // );
  // strength = 0.015 / distance(lightUV, vec2(0.5, 0.5)) - 0.1;
  
  // // pattern #31 (starry shape in the middle)
  // vec2 lightUVX = vec2(vUV.x * 0.25 + 0.375, vUV.y);
  // float lightX = 0.015 / distance(lightUVX, vec2(0.5, 0.5)) - 0.1;
  // vec2 lightUVY = vec2(vUV.y * 0.25 + 0.375, vUV.x);
  // float lightY = 0.015 / distance(lightUVY, vec2(0.5, 0.5)) - 0.1;
  // strength = lightX + lightY;

  // // pattern #32 (like previous but rotated PI / 4)
  // float pi = 3.14;
  // // or
  // pi = 3.1415926535897932384626433832795;
  // // or define it as constant at the begging of the file
  // vec2 rotatedUV = rotate(vUV, PI / 4.0, vec2(0.5));
  // vec2 lightUVX = vec2(rotatedUV.x * 0.25 + 0.375, rotatedUV.y);
  // float lightX = 0.015 / distance(lightUVX, vec2(0.5, 0.5)) - 0.1;
  // vec2 lightUVY = vec2(rotatedUV.y * 0.25 + 0.375, rotatedUV.x);
  // float lightY = 0.015 / distance(lightUVY, vec2(0.5, 0.5)) - 0.1;
  // strength = lightX + lightY;

  // // pattern #33 (black solid circle in the middle)
  // strength = step(0.25, distance(vUV, vec2(0.5)));

  // // pattern #34 (black eclipse outline circle in the middle)
  // strength = abs(distance(vUV, vec2(0.5)) - 0.25);

  // // pattern #35 (black solid outline circle in the middle)
  // strength = step(0.01, abs(distance(vUV, vec2(0.5)) - 0.25));

  // // pattern #36 (white solid outline circle in the middle)
  // strength = 1.0 - step(0.01, abs(distance(vUV, vec2(0.5)) - 0.25));

  // // pattern #37 (white solid outline circle in the middle DISTORTED)
  // vec2 wavedUV = vec2(
  //   vUV.x, 
  //   vUV.y + sin(vUV.x * 30.0) * 0.1
  // );
  // strength = 1.0 - step(0.01, abs(distance(wavedUV, vec2(0.5)) - 0.25));

  // // pattern #38 (weird shapes)
  // vec2 wavedUV = vec2(
  //   vUV.x + sin(vUV.y * 30.0) * 0.1, 
  //   vUV.y + sin(vUV.x * 30.0) * 0.1
  // );
  // strength = 1.0 - step(0.01, abs(distance(wavedUV, vec2(0.5)) - 0.25));

  // // pattern #39 (super weird shapes)
  // vec2 wavedUV = vec2(
  //   vUV.x + sin(vUV.y * 100.0) * 0.1, 
  //   vUV.y + sin(vUV.x * 100.0) * 0.1
  // );
  // strength = 1.0 - step(0.01, abs(distance(wavedUV, vec2(0.5)) - 0.25));

  // // pattern #40 (angles)
  // float angle = atan(vUV.x, vUV.y);
  // strength = angle;

  // // pattern #41 (angle starting from center (half-square))
  // float angle = atan(vUV.x - 0.5, vUV.y - 0.5); 
  // strength = angle;

  // // pattern #42 (circular angle starting from center)
  // float angle = atan(vUV.x - 0.5, vUV.y - 0.5); 
  // angle /= PI * 2.0;
  // angle += 0.5;
  // strength = angle;

  // // pattern #43 (circular angle starting from center * 20 steps)
  // float angle = atan(vUV.x - 0.5, vUV.y - 0.5); 
  // angle /= PI * 2.0;
  // angle += 0.5;
  // angle *= 20.0; // crack to 100.0 for illusion pattern 😵
  // angle = mod(angle, 1.0);
  // strength = angle;

  // // pattern #44 (circular angle starting from center steps with gradient)
  // float angle = atan(vUV.x - 0.5, vUV.y - 0.5); 
  // angle /= PI * 2.0;
  // angle += 0.5;
  // strength = sin(angle * 100.0);

  // // pattern #45 (sinusoid - some shape in the middle)
  // float angle = atan(vUV.x - 0.5, vUV.y - 0.5); 
  // angle /= PI * 2.0;
  // angle += 0.5;
  // float sinusoid = sin(angle * 100.0);
  // float radius = 0.25 + sinusoid * 0.02;
  // strength = 1.0 - step(0.01, abs(distance(vUV, vec2(0.5)) - radius));

  // // pattern #46 (perlin noise (smoke, cloud, water, terrain, or even to animate grass in the wind etc...) bsically a nature algorithm)
  // // there are many perlin noise algorithms (2D, 3D, 4D)
  // // most popular perlin noises 👇
  // // https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
  // strength = cnoise(vUV * 10.0);

  // // pattern #47 (perlin noise sharp)
  // // step is 0.0, because perlin noise goes from -something to +something
  // strength = step(0.0, cnoise(vUV * 10.0));

  // // pattern #48 (perlin noise neon outlined)
  // strength = 1.0 - abs(cnoise(vUV * 10.0));

  // // pattern #49 (perlin noise mary-jane-high pattern)
  // // strength = step(0.9, 1.0 - abs(cnoise(vUV * 50.0))); // wrong answer, but nice pattern though
  // strength = sin(cnoise(vUV * 10.0) * 20.0); // 😲 AMAZING PATTERN

  // pattern #50 (perlin noise mary-jane-high pattern sharp)
  strength = step(0.9, sin(cnoise(vUV * 10.0) * 20.0)); // 😲 WWOOOOWWWW

  // CLAMPING STRENGTH
  // if strength goes beyond one, will cause much brighter colors at intersections (extrapolated)
  // leave as is if the effect is desired, or clamp to get rid of it
  // test with #11, #14 and #15
  strength = clamp(strength, 0.0, 1.0);

  // MIXING COLORS
  vec3 blackColor = vec3(0.0);
  vec3 uvColor = vec3(vUV, 0.5);

  // strength will be an interpolation between black and uvColor
  vec3 mixedColor = mix(blackColor, uvColor, strength);

  gl_FragColor = vec4(mixedColor, uAlpha);

  // // Black and White version
  // gl_FragColor = vec4(vec3(strength), uAlpha);
}
