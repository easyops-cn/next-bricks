import { geoStream } from "d3-geo";

// a simple duck test for projections and GeoJSON
export function rewind(duck, simple) {
  return duck?.stream
    ? geoRewindProjection(duck, simple)
    : duck?.type
    ? geoRewindFeature(duck, simple)
    : Array.isArray(duck)
    ? Array.from(duck, (d) => rewind(d, simple))
    : duck;
}

function geoRewindFeature(feature, simple) {
  return geoProjectSimple(feature, geoRewindStream(simple))
}

function geoRewindProjection (projection, simple) {
  const { stream: normalize } = geoRewindStream(simple);
  return { stream: (s) => normalize(projection.stream(s)) };
}

function geoRewindStream(simple = true) {
  const { geoContains, geoArea } = d3;

  let ring, polygon;
  return d3.geoTransform({
    polygonStart() {
      this.stream.polygonStart();
      polygon = [];
    },
    lineStart() {
      if (polygon) polygon.push((ring = []));
      else this.stream.lineStart();
    },
    lineEnd() {
      if (!polygon) this.stream.lineEnd();
    },
    point(x, y) {
      if (polygon) ring.push([x, y]);
      else this.stream.point(x, y);
    },
    polygonEnd() {
      for (let [i, ring] of polygon.entries()) {
        ring.push(ring[0].slice());
        if (
          i
            ? // a hole must contain the first point of the polygon
              !geoContains(
                { type: "Polygon", coordinates: [ring] },
                polygon[0][0]
              )
            : polygon[1]
            ? // the outer ring must contain the first point of its first hole (if any)
              !geoContains(
                { type: "Polygon", coordinates: [ring] },
                polygon[1][0]
              )
            : // a single ring polygon must be smaller than a hemisphere (optional)
              simple &&
              geoArea({ type: "Polygon", coordinates: [ring] }) > 2 * Math.PI
        ) {
          ring.reverse();
        }

        this.stream.lineStart();
        ring.pop();
        for (const [x, y] of ring) this.stream.point(x, y);
        this.stream.lineEnd();
      }
      this.stream.polygonEnd();
      polygon = null;
    }
  });
}

  function geoProjectSimple (object, projection) {
    const stream = projection.stream;
    let project;
    if (!stream) throw new Error("invalid projection");
    switch (object && object.type) {
      case "Feature":
        project = projectFeature;
        break;
      case "FeatureCollection":
        project = projectFeatureCollection;
        break;
      default:
        project = projectGeometry;
        break;
    }
    return project(object, stream);
  };

  function projectFeatureCollection(o, stream) {
    return { ...o, features: o.features.map((f) => projectFeature(f, stream)) };
  }

  function projectFeature(o, stream) {
    return { ...o, geometry: projectGeometry(o.geometry, stream) };
  }

  function projectGeometryCollection(o, stream) {
    return {
      ...o,
      geometries: o.geometries.map((o) => projectGeometry(o, stream))
    };
  }

  function projectGeometry(o, stream) {
    return !o
      ? null
      : o.type === "GeometryCollection"
      ? projectGeometryCollection(o, stream)
      : o.type === "Polygon" || o.type === "MultiPolygon"
      ? projectPolygons(o, stream)
      : o;
  }

  function projectPolygons(o, stream) {
    let coordinates = [];
    let polygon, line;
    geoStream(
      o,
      stream({
        polygonStart() {
          coordinates.push((polygon = []));
        },
        polygonEnd() {},
        lineStart() {
          polygon.push((line = []));
        },
        lineEnd() {
          line.push(line[0].slice());
        },
        point(x, y) {
          line.push([x, y]);
        }
      })
    );
    if (o.type === "Polygon") coordinates = coordinates[0];
    return { ...o, coordinates, rewind: true };
  }
