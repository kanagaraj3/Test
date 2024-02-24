import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, OnDestroy, OnInit} from '@angular/core';


interface WeatherData 
{

  temperature: number;
  humidity: number;
  altitude :number;
batteryInfo:number;
cloudInfo:String;
createdOn:number;
weatherTime:number;
deviceId:number;
id:number;
weatherHumidity:number;
weatherLightIntens:number;
weatherPressure:number;
weatherRainRate:number;
weatherTemp:number;
weatherWindDirection:string;
weatherWindSpeed:number;
iconClass: string; 
iconColor: string; 
}
@Component({
  selector: 'app-weathercard',
  templateUrl: './weathercard.component.html',
  styleUrls: ['./weathercard.component.css']
})
export class WeathercardComponent implements OnInit, AfterViewInit, OnDestroy {
 
  data: any[] = [];
  count: number = 0;
  private fetchDataInterval: any;
  // searchlocation:string='';
  errorMessage:string='';

  selectedCity: string = '';

  constructor(private http: HttpClient) {}
  

  ngOnInit(): void {
    this.fetchData();
    this.getLocation();
    this.fetchDataInterval = setInterval(() => {
      this.count++;
      this.fetchData();
      console.log(this.count);
    }, 10 * 60 * 1000);
  }

  public lat!: number;
  public lng!: number;

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
        if (position) {
          console.log("Latitude: " + position.coords.latitude +
            " Longitude: " + position.coords.longitude);
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          console.log(this.lat);
          console.log(this.lng); 
        }
      },
      (error: GeolocationPositionError) => console.log(error)); 
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  search():void {
    const inputValue = this.selectedCity;
   
    if(inputValue != '')
    {
    this.http.get<any[]>(`https://ec2-65-0-61-101.ap-south-1.compute.amazonaws.com:18080/rasa-rest-api/api/v1/rasaweatherinfo/getLastNDaysWeatherData/${inputValue}/1`)    
      .subscribe((response: any[]) => {
        this.data = response.map((item: any) => {
          const createdDate = new Date(item.createdOn);
          const createdTime = `${createdDate.getHours() > 12 ? createdDate.getHours() - 12 : createdDate.getHours()}:${createdDate.getMinutes() < 10 ? '0' : ''}${createdDate.getMinutes()}`;
          const weattherTime = Number(`${createdDate.getHours()}`);
          this.selectedCity='';
          let iconClass: string=''; // To Store the Icon class
          let iconColor: string=''; // To store the Icon Color
          
          let temptemp=item.weatherTemp; // To Store the Weather Temperature
          let deviceIdToName='';
          let deviceIdName: Array<string> = new Array<string>('Kumbakonam', 'Nasiyanor', 'IITM','Pariyur'); 
            if(item.deviceId == 230800 )
            {
              deviceIdToName=deviceIdName[0];
            }
            else if(item.deviceId == 230802)
            {
              deviceIdToName=deviceIdName[1];
            }
            else if(item.deviceId == 240801)
            {
              deviceIdToName=deviceIdName[2];
            }
            else if(item.deviceId == 45007)
            {
              deviceIdToName=deviceIdName[3];
            }
            else
            {
              deviceIdToName="Null";
            }

 
          // console.log(item.weatherLightIntens);
          // if (item.weatherLightIntens<=10000)    // For Bright
          // {
          //   iconClass = 'fa-solid fa-sun fa-fade fa-flip-both fa-2xl';
          //   iconColor = '#FFD43B'; 
          // }
          // else if (item.weatherLightIntens > 10000 && item.weatherLightIntens <=13000 )  // For Light Brightness
          // {
          //   iconClass = 'fa-solid fa-cloud';
          //   iconColor = ' #0091ff';
          // }
          // else if(item.weatherLightIntens > 13000 && item.weatherLightIntens < 15000)    // For Cloudy
          // {
          //   iconClass = 'fa-solid fa-cloud';
          //   iconColor = ' #0091ff';
          // }
          // else
          // {
          //   iconClass = 'fa-solid fa-moon fa-2xl';
          //   iconColor = ' #7c7e83';
          // }

   
// This Part is to check the timeing and temperature to set the icons based on temperature and time
        if (weattherTime >= 6 && weattherTime < 18) 
        {
          if (weattherTime >=6 && temptemp <= 30 )
          {
            iconClass = 'fa-solid fa-sun ';
            iconColor = '#ffde66';
          }
          else if (weattherTime <= 12 && temptemp >= 30 ) 
          {
            iconClass = 'fa-solid fa-sun  ';
            iconColor = '#FFD43B';
          }
          else if (weattherTime >=12 && temptemp >=30 )
          {
            iconClass = 'fa-solid fa-sun';
            iconColor = '#ffc800';
          }
          else if (weattherTime >=12 && temptemp <=30 )
          {
            iconClass = 'fa-solid fa-sun';
            iconColor = '#ffc800';
          }
          else
           {
            iconClass = 'fa-solid fa-sun';
            iconColor = '#FFD43B';
          }
        } 
        else
         {
          
            iconClass = 'fa-solid fa-moon ';
            iconColor = '#8d8e91';
        }

        //Time and Temperatur checking part ending here

          return {
            temperature: item.weatherTemp, 
            humidity: item.weatherHumidity,
            altitude: item.altitude,
            batteryInfo: item.batteryInfo,
            cloudInfo: item.cloudInfo,
            createdOn: createdTime,
            weatherTime:weattherTime,
            deviceId: deviceIdToName,
            id: item.id,
            weatherHumidity: item.weatherHumidity,
            weatherLightIntens: item.weatherLightIntens,
            weatherPressure: item.weatherPressure,
            weatherRainRate: item.weatherRainRate,
            weatherTemp: item.weatherTemp,
            weatherWindDirection: item.weatherWindDirection,
            weatherWindSpeed: item.weatherWindSpeed,
            iconClass: iconClass, 
            iconColor:iconColor
          };
        });
      },
      (error: any) =>
       { 
        this.errorMessage = error.message;
        console.error('There was an error!', error);
      }
      );
    }
    
  }


    
  fetchData(): void {
    this.http.get<any[]>('https://ec2-65-0-61-101.ap-south-1.compute.amazonaws.com:18080/rasa-rest-api/api/v1/rasaweatherinfo/getLastNDaysWeatherData/230802/1')
      .subscribe((response: any[]) => {
        this.data = response.map((item: any) => {
          const createdDate = new Date(item.createdOn);
          const createdTime = `${createdDate.getHours()}:${createdDate.getMinutes() < 10 ? '0' : ''}${createdDate.getMinutes()}`;
          const weattherTime = Number(`${createdDate.getHours()}`);
        // console.log(item.weatherLightIntens);
          let iconClass: string='';
          let iconColor: string='';
          let temptemp=item.weatherTemp;
          // if (item.weatherLightIntens<=10000)    // For Bright
          // {
          //   iconClass = 'fa-solid fa-sun fa-fade fa-flip-both fa-2xl';
          //   iconColor = '#FFD43B'; 
          // }
          // else if (item.weatherLightIntens > 10000 && item.weatherLightIntens <=13000 )  // For Light Brightness
          // {
          //   iconClass = 'fa-solid fa-cloud';
          //   iconColor = ' #0091ff';
          // }
          // else if(item.weatherLightIntens > 13000 && item.weatherLightIntens < 15000)    // For Cloudy
          // {
          //   iconClass = 'fa-solid fa-cloud';
          //   iconColor = ' #0091ff';
          // }
          // else
          // {
          //   iconClass = 'fa-solid fa-moon fa-2xl';
          //   iconColor = ' #7c7e83';
          // }
           let deviceIdToName='';
          if(item.deviceId == 230802 )
          {
            deviceIdToName='Nasiyanor';
          }

        if (weattherTime >= 6 && weattherTime < 18) 
        {
          if (weattherTime >=6 && temptemp <= 30 )
          {
            iconClass = 'fa-solid fa-sun ';
            iconColor = '#ffde66';
          }
          else if (weattherTime <= 12 && temptemp >= 30 ) 
          {
            iconClass = 'fa-solid fa-sun ';
            iconColor = '#FFD43B';
          }
          else if (weattherTime >=12 && temptemp >=30 )
          {
            iconClass = 'fa-solid fa-sun ';
            iconColor = '#ffc800';
          }
          else if (weattherTime >=12 && temptemp <=30 )
          {
            iconClass = 'fa-solid fa-sun ';
            iconColor = '#ffc800';
          }
          else
           {
            iconClass = 'fa-solid fa-sun ';
            iconColor = '#FFD43B';
          }
        } 
        else
         {
          
            iconClass = 'fa-solid fa-moon ';
            iconColor = '#8d8e91';
        }
          return {
            temperature: item.weatherTemp,
            humidity: item.weatherHumidity,
            altitude: item.altitude,
            batteryInfo: item.batteryInfo,
            cloudInfo: item.cloudInfo,
            createdOn: createdTime,
            weatherTime:weattherTime,
            deviceId: deviceIdToName,
            id: item.id,
            weatherHumidity: item.weatherHumidity,
            weatherLightIntens: item.weatherLightIntens,
            weatherPressure: item.weatherPressure,
            weatherRainRate: item.weatherRainRate,
            weatherTemp: item.weatherTemp,
            weatherWindDirection: item.weatherWindDirection,
            weatherWindSpeed: item.weatherWindSpeed,
            iconClass: iconClass, 
            iconColor:iconColor
          };
        },
        (error: any) =>
        { 
         this.errorMessage = error.message;
         console.error('There was an error!', error);
       }
        );
      });
  }

  ngAfterViewInit(): void {
    let isDragging = false;
    let startX: number;
    let scrollLeft: number;

    const weatherContainer = document.querySelector('.weather-container') as HTMLElement;

    weatherContainer.addEventListener('mousedown', (event: MouseEvent) => {
        isDragging = true;
        startX = event.pageX - weatherContainer.offsetLeft;
        scrollLeft = weatherContainer.scrollLeft;
    });

    weatherContainer.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    weatherContainer.addEventListener('mouseup', () => {
        isDragging = false;
    });

    weatherContainer.addEventListener('mousemove', (event: MouseEvent) => {
        if (!isDragging) return;
        event.preventDefault();
        const x = event.pageX - weatherContainer.offsetLeft;
        const walk = (x - startX) * 1 - 0.5; // Adjust the multiplier for faster/slower movement
        weatherContainer.scrollLeft = scrollLeft - walk;
    });
}


  ngOnDestroy(): void {
    // Clean up any event listeners or subscriptions if necessary
  }
}
