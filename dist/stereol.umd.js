!function(t,r){"object"==typeof exports&&"undefined"!=typeof module?module.exports=r():"function"==typeof define&&define.amd?define(r):(t=t||self).stereol=r()}(this,(function(){var t=function(t){var r=t[0],n=t[1],e=t[2],i=r[0],o=r[1],l=r[2],a=n[0]-i,u=n[1]-o,f=n[2]-l,s=e[0]-i,c=e[1]-o,d=e[2]-l,p=u*d-f*c,v=f*s-a*d,g=a*c-u*s,y=Math.sqrt(p*p+v*v+g*g);return 0===y?[0,0,0]:[p,v,g].map((function(t){return t/y}))},r=function(t,r,n){return[t,r,n].map((function(t){return t.toExponential()}))},n=function(t,n){return"facet normal "+r.apply(void 0,t).join(" ")+"\n  outer loop\n    vertex "+r.apply(void 0,n[0]).join(" ")+"\n    vertex "+r.apply(void 0,n[1]).join(" ")+"\n    vertex "+r.apply(void 0,n[2]).join(" ")+"\n  endloop\nendfacet\n"},e=function(t){for(var r=t.split("\n").filter((function(t){return""!==t.trim()})),n=r[0],e=r.slice(1),i=[],o=0,l=!1;!l&&o<e.length&&-1===e[o].indexOf("endsolid");)(l=(l=(l=(l=(l=e.length<o+6)||-1===e[o].indexOf("normal "))||-1===e[o+2].indexOf("vertex "))||-1===e[o+3].indexOf("vertex "))||-1===e[o+4].indexOf("vertex "))||(i.push({normal:e[o].split("normal ")[1].trim().split(" ").map((function(t){return parseFloat(t)})),verts:[e[o+2].split("vertex ")[1].trim().split(" ").map((function(t){return parseFloat(t)})),e[o+3].split("vertex ")[1].trim().split(" ").map((function(t){return parseFloat(t)})),e[o+4].split("vertex ")[1].trim().split(" ").map((function(t){return parseFloat(t)}))]}),o+=7);if(l)throw new Error("This file is not formatted correctly.");return{description:n.slice(6),facets:i}},i=function(t){return(r=t,void 0===n&&(n=255),Math.max(0,Math.min(n,parseInt(r,10)))).toString(2).padStart(8,"0");var r,n},o=function(t){var r=t[1],n=t[2],e=t[3];return Number("0b"+i(t[0])+i(r)+i(n)+i(e))},l=void 0;try{l=Boolean(Buffer)}catch(t){l=!1}var a=function(t,r,n){switch(void 0===n&&(n=0),r){case"uint8":return l?t.readUInt8(n):t.getUint8(n);case"uint16":return l?t.readUInt16LE(n):t.getUint16(n,!0);case"uint32":return l?t.readUInt32LE(n):t.getUint32(n,!0);case"float":return l?t.readFloatLE(n):t.getFloat32(n,!0);default:throw new Error("No type specified")}},u=function(t){return(new TextDecoder).decode(t)};return{exportStl:function(r,e){void 0===e&&(e={});var i=e.description,a=void 0===i?"":i,u=e.binary,f=e.color,s=void 0===f?null:f,c=e.material,d=void 0===c?null:c;if(void 0===u||u){var p=Array.isArray(s)&&4===s.length?s:null,v=p&&Array.isArray(d)&&3===d.length?d:null;if(v){var g=d[0],y=d[1],m=d[2];v=(v=(v=v&&Array.isArray(g)&&3===g.length?d:null)&&Array.isArray(y)&&3===y.length?d:null)&&Array.isArray(m)&&3===m.length?d:null}return function(r,n,e,i){var a=r.length,u=function(t){var r=l?Buffer.alloc(t):new DataView(new ArrayBuffer(t));return l&&r.fill(0,0,80),{writeBuffer:function(t,n,e){switch(void 0===e&&(e=0),t){case"uint8":return l?r.writeUInt8(n,e):r.setUint8(e,n);case"uint16":return l?r.writeUInt16LE(n,e):r.setUint16(e,n,!0);case"uint32":return l?r.writeUInt32LE(n,e):r.setUint32(e,n,!0);case"float":return l?r.writeFloatLE(n,e):r.setFloat32(e,n,!0);case"string":return l?r.write(n,e):function(t,r,n){void 0===r&&(r=""),void 0===n&&(n=0);var e=0;r.split("").forEach((function(r){t.setUint8(n+e,r.charCodeAt(0)),++e}))}(r,n,e);default:throw new Error("No type specified")}},getBuffer:function(){return l?r:r.buffer}}}(84+12*a*4+2*a),f=u.writeBuffer,s=u.getBuffer;if(f("string",n),console.log("color=",e),e){f("string"," COLOR=",47);var c=e[0],d=e[1],p=e[2],v=e[3];if(console.log(c,d,p,v),f("uint8",c,54),f("uint8",d,55),f("uint8",p,56),f("uint8",v,57),i){f("string",",MATERIAL=",58);var g=i[1],y=i[2];f("uint32",o(i[0]),68),f("uint32",o(g),72),f("uint32",o(y),76)}}f("uint32",a,80);for(var m=84,h=function(t){f("float",t,m),m+=4},x=0;x<r.length;x++){var w=r[x],A=w.normal||t(w.verts);h(A[0]),h(A[1]),h(A[2]);for(var E=0;E<w.verts.length;E++){var O=w.verts[E];h(O[0]),h(O[1]),h(O[2])}f("uint16",w.color||0,m),m+=2}return s()}(r,a,p,v)}return function(r,e){void 0===e&&(e="");for(var i="solid "+e.split(" COLOR=")[0].trim()+"\n",o=0;o<r.length;o++){var l=r[o],a=l.verts,u=l.normal||t(a);i+=n(u,a)}return i+"endsolid"}(r,a)},importStl:function(t){return"string"==typeof t&&"solid "===t.slice(0,6)?(console.log("type: ascii string"),e(t)):"undefined"!=typeof TextEncoder&&"object"==typeof t&&"solid "===u(t.slice(0,6))?(console.log("type: ascii string in ArrayBuffer (browser only)"),e(u(t))):"undefined"==typeof TextEncoder&&"object"==typeof t&&"solid "===t.toString().slice(0,6)?(console.log("type: ascii string in Buffer (nodeJS only)"),e(t.toString())):(console.log("type: binary buffer"),function(t){for(var r=l?Buffer.from(t):new DataView(t),n=[],e=0;e<80;++e)n.push(a(r,"uint8",e));var i=String.fromCharCode.apply(String,n);console.log(i);var o=i.indexOf(" COLOR=");console.log("colorIndex=",o);var u=null;-1!==o&&(u=[a(r,"uint8",o+7),a(r,"uint8",o+8),a(r,"uint8",o+9),a(r,"uint8",o+10)]),console.log("color retrived=",u);var f=null;-1!==i.indexOf("MATERIAL=")&&(f=[a(r,"uint32",o+9),a(r,"uint32",o+13),a(r,"uint32",o+17)]);for(var s=[],c=a(r,"uint32",80),d=84,p=function(){return a(r,"float",(d+=4)-4)},v=0;v<c;++v){var g=[p(),p(),p()],y=[[p(),p(),p()],[p(),p(),p()],[p(),p(),p()]],m=a(r,"uint16",d);d+=2,s.push({normal:g,verts:y,color:m})}return{description:i,facets:s,color:u,material:f}}(t))}}}));
//# sourceMappingURL=stereol.umd.js.map