import mapboxgl from 'mapbox-gl'

export function lockCamera(map: mapboxgl.Map) {
  map.dragPan.disable()
  map.scrollZoom.disable()
  map.boxZoom.disable()
  map.dragRotate.disable()
  map.keyboard.disable()
  map.doubleClickZoom.disable()
  map.touchZoomRotate.disable()
  map.touchPitch.disable()

  // bearing·pitch 강제 고정: move 이벤트마다 리셋
  map.on('move', () => {
    if (map.getBearing() !== 45) map.setBearing(45)
    if (map.getPitch() !== 45) map.setPitch(45)
  })
}

export function followPlayer(map: mapboxgl.Map, lng: number, lat: number) {
  map.setCenter([lng, lat])
}
