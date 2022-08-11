
/* 
 * each matrix will transform the position until we get
 * the final clip space coordinates
 * 
 * they are uniforms because they are the same for all vertices
 * each matrix does a part in the transformation
 * to apply a matrix, we multiply it
 * must have the same size as coordinates (mat4 for vec4)
 *
 * modelMatrix       => apply transformations relative to the mesh
 *                   => (position, rotation, scale)
 *
 * viewMatrix        => apply transformations relative to the camera
 *                   => (position, rotation, field of view, near, far)
 *
 * projectionMatrix  => transform the coordinates into the clip space coordinates
 *
 * These three matrices are provided by THREE
 * modelMatrix and viewMatrix can be combined as below:
 * uniform vec4 modelViewMatrix
 * but comes with less control over the process
 *
 * these matrices will be handled automatically with ShaderMaterial (not raw)
 */
// uniform mat4 modelMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 projectionMatrix;

// custom uniform retrieved from RawShaderMaterial
// even though it was provided as int, it can be retrieved with float (examine this phenomena)
// uniform float uFrequency;
uniform vec2 uFrequency;

/*
 * retreiving position value from geometry
 * the same position attribute provided in the float array
 * geo.setAttribute('position', positionsAttribute)
 */
attribute vec3 position;

/*
 * retreive the custom attribute
 * type is float, because it's a number for each vertex (itemSize === 1)
 */
attribute float aRandom;

// main is called automatically, and is void
void main() {

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // using custom attribute
  // modelPosition.z += aRandom * 0.1;
  
  // to make a flag flow animation, we play with the z axis
  modelPosition.z += sin(modelPosition.x * uFrequency.x) * 0.1;
  modelPosition.z += sin(modelPosition.y * uFrequency.y) * 0.1;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  // this reassignment can be anywhere in this function, even at the very end
  // vRandom = aRandom;
}

// this function won't be called
void mainBasic() {
  /* 
   * gl_Position 
   * this variable already exists, we only reassign it
   * determines the vertex's position in the render  
   * returns a vec4
   * x, y, z are responsible for 3D position
   * w is responsibe for persepective (homogeneous coordinates)
   *
   * the formula below must be in this order
   * otherwise, funny results can happen
   *
   * it appears to be going from left to right, but it's actually the opposide 
   */
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}