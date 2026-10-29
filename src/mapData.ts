import type {Place} from './data';
// Local, manually approximated reference coordinates from the updated field-guide maps.
// They are *not* exact entrances or routing waypoints. Use a mapping application for navigation.
export const REFERENCE_PINS:Record<string,readonly[number,number]>={
monkey:[-34.0974,18.3599],boulders:[-34.1978,18.4508],chapmans:[-34.0839,18.3605],
kirstenbosch:[-33.9877,18.4329],cable:[-33.9619,18.4024],capepoint:[-34.3568,18.4970],
cpv:[-34.1071,18.3874],districtsix:[-33.9276,18.4264],bokap:[-33.9214,18.4124],
spier:[-34.0165,18.7846],stjames:[-34.1181,18.4595],kalk:[-34.1292,18.4515],
aquarium:[-33.9063,18.4189],robben:[-33.9036,18.4188],caferoux:[-34.0977,18.3640],
foodbarn:[-34.0977,18.3642],thorfynns:[-34.0974,18.3599],berthas:[-34.1930,18.4380],
dunes:[-34.0474,18.3482],jonkershuis:[-34.0276,18.4204],olympia:[-34.1279,18.4504],
harbourhouse:[-34.1293,18.4518],market:[-33.9051,18.4189],hospital1:[-34.1363,18.4310],
hospital2:[-34.0669,18.4555],hospital3:[-34.0378,18.4756]
  // Approximate neighbourhood reference points for the expanded culture and family guide.
  'slave-lodge': [-33.9244, 18.4209],
  'south-african-museum': [-33.929, 18.416],
  'national-gallery': [-33.93, 18.415],
  'bo-kaap-museum': [-33.92, 18.412],
  'zeitz': [-33.9095, 18.419],
  'blue-train-park': [-33.8995, 18.395],
  'green-point-park': [-33.904, 18.403],
  'imhoff': [-34.148, 18.354],
  'oranjezicht': [-33.903, 18.414],
  'norval': [-34.075, 18.438],
  'science-centre': [-33.94, 18.461],
  'gold': [-33.917, 18.412],
  'clay-cafe': [-34.048, 18.352],
  'castle': [-33.925, 18.427],
  'coffeebloc': [-34.026, 18.42],
  'longbeach-mall': [-34.117, 18.389],
  'book-lounge': [-33.932, 18.425],
};
export function pinForPlace(place:Place):[number,number]|null {const x=REFERENCE_PINS[place.id];return x?[x[0],x[1]]:null}
export const PENINSULA_LAND:[number,number][]=[
[-33.73,18.44],[-33.73,19.05],[-34.06,19.05],[-34.07,18.70],
[-34.10,18.53],[-34.18,18.51],[-34.26,18.505],[-34.36,18.496],
[-34.29,18.467],[-34.20,18.445],[-34.18,18.36],[-34.142,18.33],
[-34.09,18.321],[-34.051,18.340],[-33.98,18.379],[-33.91,18.410],[-33.73,18.44]
];
export const CATEGORY_COLOR:Record<Place['category'],string>={
Nature:'#287a70',Culture:'#a1634f',Family:'#5478ad',Food:'#c08b45',Wine:'#8d638e',Services:'#ad4d50'};
