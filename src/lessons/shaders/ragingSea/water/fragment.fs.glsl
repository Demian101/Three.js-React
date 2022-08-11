precision mediump float;

// constant, without semicolon or equal sign
#define PI 3.1415926535897932384626433832795

uniform float uAlpha;
uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying vec2 vUV;
varying float vElevation;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453132);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
  return vec2(
    cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
    cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
  );
}

void main() {
  float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  vec3 color = mix(
    uDepthColor, 
    uSurfaceColor, 
    mixStrength);
  gl_FragColor = vec4(color, uAlpha);
}
