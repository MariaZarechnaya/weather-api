
// class WeatherService  {

//     getResourse = async (url) =>{
//         let res = await fetch(url)
//         if( !res.ok){
//             throw new Error (`Could not fetch ${url}, status: ${res.status}`)
//         }
//         return await res.json();
//     }

//     getGeocoding = () =>{
//        return this.getResourse('http://api.openweathermap.org/geo/1.0/direct?q=London&limit=1&appid=d670288ab7c499e762c376b3cf55b702');
//     }
// }

// export default WeatherService;