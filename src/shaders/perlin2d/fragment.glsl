#ifdef GL_ES
  precision mediump float;
#endif

#define PI 3.14159265358979323846
#define screenWidth 800.0
uniform float canvasWidth;
uniform float canvasHeight;
uniform float seed;
uniform float frequency;
uniform int resolution;

float rand(vec2 c){
        return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 40000.0 + seed);
}

float noise(vec2 p, float freq ){
        float unit = screenWidth/freq;
        vec2 ij = floor(p/unit);
        vec2 xy = mod(p,unit)/unit;
        //xy = 3.*xy*xy-2.*xy*xy*xy;
        xy = .5*(1.-cos(PI*xy));
        float a = rand((ij+vec2(0.,0.)));
        float b = rand((ij+vec2(1.,0.)));
        float c = rand((ij+vec2(0.,1.)));
        float d = rand((ij+vec2(1.,1.)));
        float x1 = mix(a, b, xy.x);
        float x2 = mix(c, d, xy.x);
        return mix(x1, x2, xy.y);
}

float pNoise(vec2 p, int res){
        float persistance = .8;
        float n = 0.;
        float normK = 0.;
        float f = frequency;
        float amp = 9.;
        int iCount = 3;
        for (int i = 0; i<50; i++){
                n+=amp*noise(p, f);
                f*=2.;
                normK+=amp;
                amp*=persistance;
                if (iCount == res) break;
                iCount++;
        }
        float nf = n/normK;
        return nf*nf*nf*nf;
}

void main( void )
{
    float x = gl_FragCoord.xy.x - (canvasWidth / 2.0);
    float y = gl_FragCoord.xy.y - (canvasHeight / 2.0);
    float r = sqrt(x*x + y*y);
    float nos = pNoise(vec2(x, y), resolution + 3);
    // Output to screen
    gl_FragColor = vec4(nos, nos, nos, 1.0);
}