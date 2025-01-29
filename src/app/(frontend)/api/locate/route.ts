const gdprCountryCodes = [
  // -----[ EU 28 ]-----
  'AT', // Austria
  'BE', // Belgium
  'BG', // Bulgaria
  'HR', // Croatia
  'CY', // Cyprus
  'CZ', // Czech Republic
  'DK', // Denmark
  'EE', // Estonia
  'FI', // Finland
  'FR', // France
  'DE', // Germany
  'GR', // Greece
  'HU', // Hungary
  'IE', // Ireland, Republic of (EIRE)
  'IT', // Italy
  'LV', // Latvia
  'LT', // Lithuania
  'LU', // Luxembourg
  'MT', // Malta
  'NL', // Netherlands
  'PL', // Poland
  'PT', // Portugal
  'RO', // Romania
  'SK', // Slovakia
  'SI', // Slovenia
  'ES', // Spain
  'SE', // Sweden
  'GB', // United Kingdom (Great Britain)

  // -----[ Outermost Regions (OMR) ]------
  'GF', // French Guiana
  'GP', // Guadeloupe
  'MQ', // Martinique
  'ME', // Montenegro
  'YT', // Mayotte
  'RE', // Réunion
  'MF', // Saint Martin

  // -----[ Special Cases: Part of EU ]-----
  'GI', // Gibraltar
  'AX', // Åland Islands

  // -----[ Overseas Countries and Territories (OCT) ]-----
  'PM', // Saint Pierre and Miquelon
  'GL', // Greenland
  'BL', // Saint Bartelemey
  'SX', // Sint Maarten
  'AW', // Aruba
  'CW', // Curacao
  'WF', // Wallis and Futuna
  'PF', // French Polynesia
  'NC', // New Caledonia
  'TF', // French Southern Territories
  'AI', // Anguilla
  'BM', // Bermuda
  'IO', // British Indian Ocean Territory
  'VG', // Virgin Islands, British
  'KY', // Cayman Islands
  'FK', // Falkland Islands (Malvinas)
  'MS', // Montserrat
  'PN', // Pitcairn
  'SH', // Saint Helena
  'GS', // South Georgia and the South Sandwich Islands
  'TC', // Turks and Caicos Islands

  // -----[ Microstates ]-----
  'AD', // Andorra
  'LI', // Liechtenstein
  'MC', // Monaco
  'SM', // San Marino
  'VA', // Vatican City

  // -----[ Other ]-----
  'JE', // Jersey
  'GG', // Guernsey
]

/**
 * Returns the status of GDPR requirement and defaults to true when unknown
 * @param countryCode
 */
const locate = (countryCode: null | string = null): boolean =>
  countryCode ? gdprCountryCodes.indexOf(countryCode) > -1 : true

export function GET(req: Request) {
  const country = req.headers.get('x-vercel-ip-country')
  const isGDPR = locate(country)
  return new Response(JSON.stringify({ country, isGDPR }))
}
