let https = require('https');

let GMAPS_API_KEY = process.env.GMAPS_API_KEY
GMAPS_API_KEY = "AIzaSyC1v4JGi-e_chsyl0nugyV3FLZ82xLXlMw"
function zipCodeToCoordinatePair (zipcode, callback){
    console.log(GMAPS_API_KEY)
    https.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + zipcode + "&key=" + GMAPS_API_KEY, (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];
      
        let error;
        if (statusCode !== 200) {
          error = new Error('Request Failed.\n' +
                            `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error('Invalid content-type.\n' +
                            `Expected application/json but received ${contentType}`);
        }
        if (error) {
          console.error(error.message);
          // consume response data to free up memory
          res.resume();
          return;
        }
      
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);
            callback(null, parsedData)
          } catch (e) {
            callback(true, null)
          }
        });
      }).on('error', (e) => {
        callback(true, null)
      });
    
    }
//    zipCodeToCoordinatePair(44605, (error,coords) => {
//         console.log(coords);
//         console.log(coords.results[0].geometry.location);
//     });