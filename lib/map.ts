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

/**
 * La red usa dos tonos, no tres: el tipo de separación lo dice el guionado.
 *
 * @remarks Van rebajados y profundos a propósito. La interfaz es monocroma,
 * así que estos son el único color del producto y no pueden gritar.
 */
export const TRACK_COLOR = '#0A7C63'
/** El mismo tono punteado: es infraestructura, pero solo pintura. */
export const LANE_COLOR = '#0A7C63'
/** Ámbar quemado: compartís el asfalto con los autos. */
export const SHARED_COLOR = '#B4670F'
/** Halo blanco por debajo, para que la línea no se pierda sobre el mapa base. */
export const CASING_COLOR = '#FFFFFF'
/** Azul profundo. El punto azul es una convención que no vale la pena romper. */
export const RIDER_COLOR = '#1E4FD8'

/**
 * Los mismos tonos, aclarados para la leyenda.
 *
 * WHY Los de arriba están calculados contra el mapa claro. Sobre el panel
 * casi negro se hunden: 3,9:1 de contraste en un trazo de dos píxeles.
 */
export const TRACK_ON_DARK = '#2FB894'
export const SHARED_ON_DARK = '#E09A4A'

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
