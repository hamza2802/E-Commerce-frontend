import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { SearchservicesService } from 'src/app/services/customer/searchservices.service';

@Component({
  selector: 'app-searchpage',
  templateUrl: './searchpage.component.html',
  styleUrls: ['./searchpage.component.css']
})
export class SearchpageComponent {
  searchResults: any[] = [];
  searchQuery: string = '';
  loading: boolean = false;
  noResults: boolean = false;
  errorMessage: string = '';

  constructor(
    private searchService: SearchservicesService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['query']) {
        this.searchQuery = params['query'];
        this.performSearch();
      }
    });
  }

  performSearch(): void {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      this.noResults = true;
      return;
    }

    this.loading = true;
    this.noResults = false;
    this.errorMessage = '';
    
    this.searchService.searchProducts(this.searchQuery)
      .subscribe({
        next: (results) => {
          this.searchResults = results;
          this.noResults = results.length === 0;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching products:', error);
          this.loading = false;
          this.errorMessage = 'Error loading products. Please try again later.';
          this.searchResults = [];
        }
      });
  }

  viewProduct(product: any) {
    this.router.navigate(['customer-dashboard/product-details'], { state: { product } });
  }

  addToCart(event: Event, product: any) {
    event.stopPropagation();
    console.log('Adding to cart:', product.productName);
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/placeholder.jpg';
    }
  }
}
