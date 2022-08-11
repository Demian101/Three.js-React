varying vec2 vUV;

void main() {

  // ignore modelMatrix error, as it is automatically imported in ShaderMaterial
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vUV = uv;
}