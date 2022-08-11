uniform float uTime;
uniform float uSize;
uniform bool uSizeAttenuation;

attribute float aRandomScale;
attribute vec3 aRandomness;

varying vec3 vColor;

void main() {
  // position
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  /*
   * Animate
   */
  // retrieve the angle
  float angle = atan(modelPosition.x, modelPosition.z);
  float distanceToCenter = length(modelPosition.xz);
  // (1.0 / distanceToCenter) to make closer particles faster than farther ones
  float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
  angle += angleOffset;
  modelPosition.z = sin(angle) * distanceToCenter;
  modelPosition.x = cos(angle) * distanceToCenter;

  // randomness
  modelPosition.xyz += aRandomness;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;
  gl_Position = projectionPosition;


  /*
   * Size
   */
  gl_PointSize = uSize * aRandomScale;
  // // enable sizeAttenuation
  // viewPosition can also be called modelViewPosition
  if (uSizeAttenuation) gl_PointSize *= ( 1.0 / - viewPosition.z);

  

  // Varyings
  vColor = color; // color is the default attribute from the custom geometry
}