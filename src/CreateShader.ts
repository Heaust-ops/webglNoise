const createShader = (gl: WebGLRenderingContext, sourceCode: string, type: GLenum) => {
    // Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
    var shader = gl.createShader( type )!;
    gl.shaderSource( shader, sourceCode );
    gl.compileShader( shader );
  
    if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
      var info = gl.getShaderInfoLog(shader);
      throw 'Could not compile WebGL program. \n\n' + info;
    }
    return shader;
  };
  
  export default createShader;