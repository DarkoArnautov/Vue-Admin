export function prettyDate (date, startDate) {
  let secs = Math.floor((date.getTime() - startDate.getTime()) / 1000)
  if (secs < 60) return secs + ' sec(s) ago'
  if (secs < 3600) return Math.floor(secs / 60) + ' min(s) ago'
  if (secs < 86400) return Math.floor(secs / 3600) + ' hour(s) ago'
  if (secs < 604800) return Math.floor(secs / 86400) + ' day(s) ago'
  return 'more than a week ago'
}

export function toDegreesMinutesAndSeconds (coordinate) {
  let absolute = Math.abs(coordinate)
  let degrees = Math.floor(absolute)
  let minutesNotTruncated = (absolute - degrees) * 60
  let minutes = Math.floor(minutesNotTruncated)
  let seconds = Math.floor((minutesNotTruncated - minutes) * 60)
  return degrees + '&deg; ' + minutes + '\' ' + seconds + '\'\''
}

export function toDMS (lat, lng) {
  let latitude = toDegreesMinutesAndSeconds(lat)
  let latitudeCardinal = Math.sign(lat) >= 0 ? 'N' : 'S'
  let longitude = toDegreesMinutesAndSeconds(lng)
  let longitudeCardinal = Math.sign(lng) >= 0 ? 'E' : 'W'
  return latitude + ' ' + latitudeCardinal + ' / ' + longitude + ' ' + longitudeCardinal
}

export function numberFormatter (num, dec, sep) {
  let res = L.Util.formatNum(num, dec) + ''
  let numbers = res.split('.')
  if (numbers[1]) {
    let d = dec - numbers[1].length
    for (; d > 0; d--) {
      numbers[1] += '0'
    }
    res = numbers.join(sep || '.')
  }
  return res
}

export function getVesselIcon (vesselType, aisStatusId) {
  let validTypes = ['0', '1', '2', '3', '3a', '3b', '4', '5', '5a', '6', '7', '8', '9']
  if (!vesselType || !validTypes.includes(vesselType.toString())) {
    vesselType = 'Unspecified'
  }
  if (!validateAISStatusID(aisStatusId)) {
    aisStatusId = 'No_AIS'
  }
  return {
    iconUrl: '/images/vessel_icons/' + vesselType.toString() + '/' + aisStatusId.toString() + '.png',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, 0],
    className: 'default-vessel'
  }
}

export function validateAISStatusID (aisStatusId) {
  let validStatusIDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12]
  return validStatusIDS.includes(aisStatusId)
}

export function getPrimaryServiceIcon (primaryService) {
  if (!primaryService) {
    primaryService = 'undefined'
  }
  return L.icon({
    iconUrl: '/images/smff_icons/' + primaryService.toString() + '.png',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, 0],
    className: 'default-vessel'
  })
}
