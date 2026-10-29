import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DashboardData,
  DashboardService
} from './services/dashboard.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  // Period selector
  selectedPeriod = '365';

  // Dashboard summary
  totalRevenue = 0;
  totalOrders = 0;
  averageOrderValue = 0;
  totalCountries = 0;

  // Dashboard data
  revenueByCountry: DashboardData['revenueByCountry'] = [];
  revenueByCategory: DashboardData['revenueByCategory'] = [];
  monthlyRevenue: DashboardData['monthlyRevenue'] = [];
  recentOrders: DashboardData['recentOrders'] = [];

  // Loading and errors
  isLoading = true;
  errorMessage = '';

  constructor(
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dashboardService.getDashboardData().subscribe({
      next: (data: DashboardData) => {
        this.totalRevenue = data.totalRevenue;
        this.totalOrders = data.totalOrders;
        this.averageOrderValue = data.averageOrderValue;

        this.revenueByCountry = data.revenueByCountry ?? [];
        this.revenueByCategory = data.revenueByCategory ?? [];
        this.monthlyRevenue = data.monthlyRevenue ?? [];
        this.recentOrders = data.recentOrders ?? [];

        this.totalCountries = this.revenueByCountry.length;

        this.isLoading = false;
      },

      error: (error) => {
        console.error('Failed to load dashboard data:', error);

        this.errorMessage =
          'Unable to load dashboard data. Please check that the API is running.';

        this.isLoading = false;
      }
    });
  }

  // Selected period handler
  changePeriod(): void {
    console.log('Selected period:', this.selectedPeriod);
  }

  // Highest-revenue category
  get topCategory(): string {
    if (this.revenueByCategory.length === 0) {
      return 'N/A';
    }

    return [...this.revenueByCategory]
      .sort((a, b) => b.revenue - a.revenue)[0].category;
  }

  // Highest-revenue country
  get topCountry(): string {
    if (this.revenueByCountry.length === 0) {
      return 'N/A';
    }

    return [...this.revenueByCountry]
      .sort((a, b) => b.revenue - a.revenue)[0].country;
  }

  // Monthly chart bar height
  getBarHeight(revenue: number): number {
    const maxRevenue = Math.max(
      ...this.monthlyRevenue.map(item => item.revenue),
      0
    );

    if (maxRevenue === 0) {
      return 0;
    }

    return (revenue / maxRevenue) * 100;
  }

  // Category revenue percentage
  getCategoryPercentage(revenue: number): number {
    const total = this.revenueByCategory.reduce(
      (sum, item) => sum + item.revenue,
      0
    );

    if (total === 0) {
      return 0;
    }

    return (revenue / total) * 100;
  }

  // Country share of total revenue
  getCountryPercentage(revenue: number): number {
    if (this.totalRevenue === 0) {
      return 0;
    }

    return (revenue / this.totalRevenue) * 100;
  }
}
