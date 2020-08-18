export const tiles = [
  {
    name: 'Streets',
    attribution: '&copy; CDT 2019',
    url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGFya29tayIsImEiOiJjanU3ZWpqaWkxdGs5M3lsb3J5bmp6emJ6In0.CQyLn86hyPyaNSRODfP-BQ',
    wms: false,
    visible: true
  },
  {
    name: 'Satellite',
    attribution: '&copy; CDT 2019',
    url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGFya29tayIsImEiOiJjanU3ZWpqaWkxdGs5M3lsb3J5bmp6emJ6In0.CQyLn86hyPyaNSRODfP-BQ',
    wms: false,
    visible: false
  },
  {
    name: 'Maritime',
    attribution: '&copy; CDT 2019',
    url: 'https://api.mapbox.com/styles/v1/darkomk/cju7fjs4s2kl41golvx7ufzer/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGFya29tayIsImEiOiJjanU3ZWpqaWkxdGs5M3lsb3J5bmp6emJ6In0.CQyLn86hyPyaNSRODfP-BQ',
    wms: false,
    visible: false
  },
  {
    name: 'Dark Map',
    attribution: '&copy; CDT 2019',
    url: 'https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGFya29tayIsImEiOiJjanU3ZWpqaWkxdGs5M3lsb3J5bmp6emJ6In0.CQyLn86hyPyaNSRODfP-BQ',
    wms: false,
    visible: false
  },
  {
    name: 'Light Map',
    attribution: '&copy; CDT 2019',
    url: 'https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGFya29tayIsImEiOiJjanU3ZWpqaWkxdGs5M3lsb3J5bmp6emJ6In0.CQyLn86hyPyaNSRODfP-BQ',
    wms: false,
    visible: false
  },
  {
    name: 'Outdoors',
    attribution: '&copy; CDT 2019',
    url: 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGFya29tayIsImEiOiJjanU3ZWpqaWkxdGs5M3lsb3J5bmp6emJ6In0.CQyLn86hyPyaNSRODfP-BQ',
    wms: false,
    visible: false
  },
  {
    name: 'Nautical Charts',
    attribution: '&copy; CDT 2019',
    url: 'https://seamlessrnc.nauticalcharts.noaa.gov/arcgis/services/RNC/NOAA_RNC/ImageServer/WMSServer',
    layers: '0',
    transparent: false,
    wms: true,
    visible: false
  }
]
