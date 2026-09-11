import type { FilterSpecification, LineLayerSpecification } from '@maplibre/maplibre-react-native'

/** Estilo base del mapa. Cambiar de proveedor de tiles es cambiar esta URL. */
export const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'

/** Parque Kennedy, Miraflores. Centro por defecto hasta que haya ubicación. */
export const LIMA_CENTER: [number, number] = [-77.0297, -12.1219]

export const CYCLEWAYS_SOURCE = 'chasqui-cycleways'

/** Filtros sobre el GeoJSON del APK: el tipo llega en la propiedad kind. */
export const IS_TRACK: FilterSpecification = ['==', ['get', 'kind'], 'track']
export const IS_LANE: FilterSpecification = ['==', ['get', 'kind'], 'lane']
export const IS_SHARED: FilterSpecification = ['==', ['get', 'kind'], 'shared']

/** Verde: tenés la vía para vos, separada del tráfico. */
export const TRACK_COLOR = '#0E9F6E'
/** El mismo verde punteado: es infraestructura, pero solo pintura. */
export const LANE_COLOR = '#0E9F6E'
/** Ámbar: compartís el asfalto con los autos. */
export const SHARED_COLOR = '#D97706'
/** Halo blanco por debajo, para que la línea no se pierda sobre el mapa base. */
export const CASING_COLOR = '#FFFFFF'
/** Azul: en este mapa el verde y el ámbar ya son la red ciclista. */
export const RIDER_COLOR = '#2563EB'

type LineWidth = NonNullable<NonNullable<LineLayerSpecification['paint']>['line-width']>

/** Se engrosa con el zoom para que la red siga leyéndose al alejarse. */
export const TRACK_WIDTH: LineWidth = ['interpolate', ['linear'], ['zoom'], 10, 1.8, 14, 4, 18, 9]

/** El halo va siempre un poco más ancho que la línea que envuelve. */
export const CASING_WIDTH: LineWidth = ['interpolate', ['linear'], ['zoom'], 10, 3.4, 14, 7, 18, 13]

/** Carril y compartida van más finas: no son lo mismo y no deben pesar igual. */
export const THIN_WIDTH: LineWidth = ['interpolate', ['linear'], ['zoom'], 10, 1.2, 14, 2.8, 18, 6]

/** Guiones: se leen como «acá no hay separación». */
export const LANE_DASH: [number, number] = [3, 1.5]
export const SHARED_DASH: [number, number] = [1.5, 1.5]
