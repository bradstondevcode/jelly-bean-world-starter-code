import Matter from 'matter-js'
import polyDecomp from 'poly-decomp'

export function toVertex(pathSVG, n){
  let pathLength = pathSVG.getTotalLength();
  let vtx = [];
  var i = 0;
  while(i < pathLength){
    let arr =  pathSVG.getPointAtLength(i);
    vtx.push({x:arr.x, y:arr.y});
    i+=n;
  }
  return vtx;
}

async function loadSvg(url) {
    return await fetch(url)
        .then(function(response) { return response.text(); })
        .then(function(raw) { return (new window.DOMParser()).parseFromString(raw, 'image/svg+xml'); });
}

function select(root, selector) {
    return Array.prototype.slice.call(root.querySelectorAll(selector));
};

export async function createVertexSetFromSVG(svgPath) {
	var Vertices = Matter.Vertices
	var Common = Matter.Common
	Common.setDecomp(polyDecomp)

	var vertexSets = null

	console.log('1')

	if (typeof fetch !== 'undefined') {

        await loadSvg(svgPath).then(function(root) {

            vertexSets = select(root, 'path')
                .map(function(path) { return Vertices.scale(toVertex(path, 50), 0.05, 0.05) });

        });
    } else {
        Common.warn('Fetch is not available. Could not load SVG.');
        return null
    }

    return vertexSets

}