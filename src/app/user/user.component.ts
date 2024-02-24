// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// @Component({
//   selector: 'app-user',
//   templateUrl: './user.component.html',
//   styleUrls: ['./user.component.css']
// })
// export class UserComponent
//  {
//   data: any; // Variable to store fetched data

//   constructor(private http: HttpClient) { }

//   ngOnInit(): void {
//     this.fetchData();
//   }

//   fetchData() {
//     this.http.get('https://ec2-65-0-61-101.ap-south-1.compute.amazonaws.com:18080/rasa-rest-api/api/v1/rasaweatherinfo/getRecentWeatherData/230802').subscribe(response => {
//       this.data = response;
//       console.log(this.data);
//     });
// }
//  }

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  data: any[] = []; 
  selectedData: any; 
  count: number =0;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData(); 
    setInterval(() => {
      this.count++;
      this.fetchData();
    }, 10 * 60 * 1000); 
  }

  fetchData() {
    this.http.get<any[]>('https://ec2-65-0-61-101.ap-south-1.compute.amazonaws.com:18080/rasa-rest-api/api/v1/rasaweatherinfo/getLastNDaysWeatherData/230802/1')
      .subscribe(response => {
        this.data = response; 
        this.selectedData = response[0];
        console.log(this.selectedData);
        console.log(this.count);
      });
  }
}

