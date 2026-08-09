# Clima

App móvil de clima hecha con React Native (Expo). Permite buscar el clima actual de cualquier ciudad y muestra temperatura, humedad y una descripción, junto con sensación térmica, viento, punto de rocío y el pronóstico de las próximas horas. Los datos vienen de la API de [OpenWeatherMap](https://openweathermap.org/).

## Funcionalidades

- Búsqueda por ciudad con sugerencias en vivo (geocoding de OpenWeatherMap).
- Pantalla de resultado con temperatura, humedad, descripción, máx/mín, sensación, viento y franja horaria.
- Estados de carga (spinner + skeletons) y de error. Si la ciudad no existe se muestra "Ciudad no encontrada" con un "¿Quisiste decir…?" cuando hay una alternativa razonable, y un botón para reintentar.
- Historial de búsquedas persistido con AsyncStorage (tocar una fila repite la búsqueda, "Borrar" lo limpia).
- Cambio de unidades °C/°F tocando la temperatura.
- El fondo cambia según el clima: soleado, lluvia, nublado o noche.

## Requisitos previos

- Node 18 o superior.
- La app [Expo Go](https://expo.dev/go) en el teléfono, o un emulador de Android/iOS.
- Una API key gratuita de OpenWeatherMap.

## Configuración

1. Instalar dependencias:

```bash
npm install
```

2. Crear un archivo `.env` en la raíz (hay un `.env.example` de referencia):

```
EXPO_PUBLIC_OWM_API_KEY=tu_api_key
```

## Ejecutar la app

```bash
npm start
```

Escanear el QR con Expo Go, o presionar `a` para abrir el emulador de Android / `i` para el simulador de iOS.

## Ejecutar las pruebas

```bash
npm test              # corre toda la suite
npm run test:watch    # modo watch
npm run test:coverage # con reporte de cobertura
```

El proyecto está configurado con `jest-expo` y un umbral de cobertura del 80% (statements, branches, functions y lines). Las pruebas cubren, entre otras cosas:

- Que una búsqueda exitosa muestre temperatura, humedad y descripción (con el fetch mockeado).
- Que una ciudad inválida muestre el estado de error "Ciudad no encontrada".
- Que el campo de entrada y el botón de búsqueda disparen la petición con la ciudad correcta.
- La capa de API (mapeo de la respuesta, 404, errores de red, sugerencias), el historial (orden, deduplicación, límite, borrado) y las utilidades de formato.

## Estructura

```
src/
  api/weather.ts        cliente de OpenWeatherMap (clima actual, pronóstico, geocoding)
  components/           fondo con gradientes y piezas compartidas
  hooks/useWeather.ts   estado de la búsqueda (idle/loading/success/error) e historial
  screens/              Search, Result, Loading, Error, History
  storage/history.ts    persistencia del historial en AsyncStorage
  utils/format.ts       formato de fechas/temperaturas y conversión °C/°F
  theme.ts              tipografías, paletas por clima y estilos glass
__tests__/              pruebas de integración y unitarias
```

## Notas

- La key se lee de `EXPO_PUBLIC_OWM_API_KEY`; al ser una variable `EXPO_PUBLIC_*` queda embebida en el bundle del cliente, igual que pasaría con `NEXT_PUBLIC_*` en Next. Para un producto real lo correcto sería proxear la API desde un backend.
- El punto de rocío no viene en el endpoint de clima actual, así que se aproxima con la fórmula de Magnus a partir de temperatura y humedad.
- La franja horaria usa el endpoint de forecast (pasos de 3 horas), mostrando los próximos 5 bloques en la hora local de la ciudad.
