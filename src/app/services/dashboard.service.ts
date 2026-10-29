import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';



export interface DashboardData{
  totalRevenue : number;
  totalOrders : number;
  averageOrderValue :number;
  revenueByCountry :{
    country : string;
    revenue : number;
  }[];
  revenueByCategory:{
    category :string ;
    revenue : number;
  }[];
  monthlyRevenue:{
    month : string ;
    revenue : number ;
  }[];
  recentOrders :{
    id : string ;
    country : string ;
    amount : number ;
    date : string ;
  }[];
}
@Injectable({
  providedIn: 'root'
})
export class DashboardService{
  private apiUrl = 'http://127.0.0.1:8000/api/dashboard';

  constructor(private http :HttpClient){}

  getDashboardData(): Observable<DashboardData>{
    return this.http.get<DashboardData>(this.apiUrl);
  }

}
