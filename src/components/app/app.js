import { Component } from "react";
import AppHeader from "../app-header/app-header";
import './app.scss';
import AppImageBlock from "../app-image-block/app-image-block";
import AppWeatherToday from "../app-weather-today/app-weather-today";
import AppWeatherTodayHours from "../app-weather-today-hours/app-weather-today-hours";
import AppWeatherFiveDays from "../app-weather-five-days/app-weather-five-days";


export const _apiKey = 'd670288ab7c499e762c376b3cf55b702'

class App extends Component{
state = {
  lat: undefined,
  lon: undefined,
  city: undefined,
  date: '',
  temp: undefined,
  feelsLike: undefined,
  wind: undefined,
  humidity: undefined,
  skyToday: undefined,
  id: undefined,
  err: undefined,
  hourlyTemp: undefined,
  hourlyTime: undefined,
  hourlyDataWeather: undefined,
  fiveDays: undefined,
  fiveDaysTemp: undefined,
  timeForChangeTheme: new Date().getHours()

}

 getCoordinate =  async(event) =>{     // метод по получению координат , записываем его в стейты
  event.preventDefault();
  const city = event.target.elements.city.value


 if(city){
  const data = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${_apiKey}`).then(response => response.json()).catch((err) => console.log(err));
 
  this.getWeather(data[0].lat, data[0].lon);
  this.getHourlyWeather(data[0].lat, data[0].lon)
  this.getLongTimeWeather (data[0].lat, data[0].lon)
  this.setState({
    city:data[0].name,
  })

}

 }


 getWeather = async(lat, lon) =>{              // метод получает данные по погоде 
  const apiWeatherUrl = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${_apiKey}&units=metric`);   
  const data  = await apiWeatherUrl.json();
  console.log('Данные за день')
  console.log(data)
  const date = data.dt
  console.log('время для смены стиля')
  console.log(date)
  const today = new Date(date * 1000).toDateString()
  console.log(today)


       this.setState ({
            lat:  lat,
            lon: lon,
            date: today,
            temp: Math.round(data.main.temp),
            feelsLike: Math.round (data.main.feels_like),
            wind: Math.round  (data.wind.speed),
            humidity: data.main.humidity,
            err: '',
            skyToday: data.weather[0].main,
            id: data.weather[0].id,
            
        })


 }


 getHourlyWeather = async(lat, lon) =>{
  const hourlyData = await fetch (`https://api.openweathermap.org/data/2.5/forecast?cnt=4&lat=${lat}&lon=${lon}&appid=${_apiKey}&units=metric`)    //*
  const hourly = await hourlyData.json();
  const everyHoursData = hourly.list;
  console.log(everyHoursData)
  const dataAllTemp = everyHoursData.map((obj) => Math.round(obj.main.temp))
  const dataAllTime = everyHoursData.map((obj) => obj.dt)
  console.log(dataAllTime)
  let onlyTime = dataAllTime.map((item) =>{
    return  new Date (item * 1000).toLocaleTimeString().slice(0, 5)
    
  })

  const hourlyDataWeather = everyHoursData.map((obj) => obj.weather)
  this.setState({
      weatherInfo: everyHoursData,
      hourlyTemp: dataAllTemp,
      hourlyTime: onlyTime,
      hourlyDataWeather: hourlyDataWeather,

  })

}



getLongTimeWeather = async(lat, lon) =>{
  const longTimeWeather = await fetch (`https://api.openweathermap.org/data/2.5/forecast?cnt=120&lat=${lat}&lon=${lon}&appid=${_apiKey}&units=metric`).then(response => response.json()) 
  const allDays = longTimeWeather.list;
  console.log(allDays)
  const filterFiveDays = allDays.filter((item) =>{
    
    let time =  new Date (item.dt * 1000).toLocaleTimeString()
    if(time == '00:00:00')
    return item
  })
  console.log(filterFiveDays)
  let temp = filterFiveDays.map((obj) => Math.round(obj.main.temp))
  
  this.setState({
    fiveDays: filterFiveDays,
    fiveDaysTemp: temp
  })
}

    render(){
      const { temp, feelsLike, wind, humidity, hourlyTemp, hourlyTime, hourlyData, hourlyDataWeather,skyToday, id, city, date,fiveDays,
        fiveDaysTemp, timeForChangeTheme} = this.state;  //*
        let themeClass ;
        if (timeForChangeTheme >=5 &&timeForChangeTheme< 12){ 
          themeClass = 'wrapper wrapper-morning'
        } else if (timeForChangeTheme >=12 &&timeForChangeTheme< 17) {
          themeClass = 'wrapper wrapper-day'
        } else if (timeForChangeTheme >=17 && timeForChangeTheme< 23) {
          themeClass = 'wrapper wrapper-evening'
        } else if (timeForChangeTheme ==23 || timeForChangeTheme >=0 && timeForChangeTheme <= 4 ) {
          themeClass = 'wrapper wrapper-night'
        }
        
      return(
        <div className= {themeClass} >
        < AppHeader coords= {this.getCoordinate}
        />
        <main>
          <section className="app-today-section">
          <AppWeatherToday 
          weatherTemp={temp}
          weatherFeelsLike = {feelsLike}
          weatherWind = {wind}
          weatherHumidity = {humidity}
          city= {city}
          date = {date}
          timeForChangeTheme= {timeForChangeTheme} 
          />
          <AppImageBlock skyToday = {skyToday}
           id = {id}
           className = 'app-image-block-img'
           classNone = 'none'
           timeForChangeTheme ={timeForChangeTheme}
           />
          </section>
          <section className="today-hours-section">

          <AppWeatherTodayHours 
          temp = {hourlyTemp}
          time = {hourlyTime} 
          hourlyDataWeather= {hourlyDataWeather}

          />
          </section>
          <section>
          <AppWeatherFiveDays 
          fiveDaysData = {fiveDays}
          fiveDaysTemp = {fiveDaysTemp}
          timeForChangeTheme= {timeForChangeTheme}
          />
          </section>
        </main>
  </div>
      )

    }
}

export default App;