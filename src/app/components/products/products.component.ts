import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from 'src/app/shared/services/products.service';
import { Product } from 'src/app/shared/interfaces/products';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { provideAnimations } from '@angular/platform-browser/animations';
import { WishlistService } from 'src/app/shared/services/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';
import { Wishlist } from 'src/app/shared/interfaces/wishlist';
import { AllProducts } from 'src/app/shared/interfaces/allproducts';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CommonService } from 'src/app/shared/services/common.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CheckboxModule,
    FormsModule,
    SliderModule,
    RatingModule,
    LazyLoadImageModule,
    TranslateModule,
  ],
  providers: [provideAnimations()],
  templateUrl: './products.component.html',
  styles: [
    `
      :host ::ng-deep .p-checkbox-label {
        cursor: pointer;
      }
    `,
  ],
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  allProducts: AllProducts[] = [];
  selectedCategories: string[] = [];
  rangeValues: number[] = [100, 3000];
  Ratingvalue: number = 1;
  searchValue: string = '';
  selectedCategoryFilterNames: string[] = ['Products'];
  categories: any[] = [];
  brands: any[] = [];
  selectedBrands: string[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  categoryId: string = '';
  brandId: string = '';
  id: string = '';
  currency: string = '';
  userId: any;
  formData = new FormData();
  wishlistData: Wishlist[] = [];
  render: boolean = false;
  productLoading: boolean = true;
  filterLoading: boolean = true;
  currentLang: string = '';
  constructor(
    private _ProductsService: ProductsService,
    private _ActivatedRoute: ActivatedRoute,
    private _WishlistService: WishlistService,
    private _ToastrService: ToastrService,
    private _Renderer2: Renderer2,
    private _AuthService: AuthService,
    private _CommonService: CommonService,
    private translate: TranslateService
  ) {}
  ngOnInit(): void {
    // get currecy value
    this._CommonService.currency.subscribe({
      next: (res) => {
        this.currency = res.label;
        console.log(this.currency);
        this.getAllProducts();
      },
    });

    this._ActivatedRoute.queryParams.subscribe((params) => {
      const id = params['id'];
      if (params['category']) {
        this.categoryId = params['id'];
        if (id) {
          this.selectedCategories = [id];
          console.log('selectedCategory', this.selectedCategories);
          this.getAllBrands();
          this.onfilterChange();
        }
      } else if (params['brand']) {
        this.brandId = params['id'];
        if (id) {
          this.selectedBrands = [id];
          console.log('selectedBrands', this.selectedCategories);
          this._CommonService.currentLang.subscribe({
            next: (res) => {
              console.log(res);
              this.currentLang = res;
              this.getAllBrands();
              this.getAllCategory();
              this.getAllProducts();
            },
            error: (err: HttpErrorResponse) => {
              console.log(err);
            },
          });
          this.onfilterChange();
        }
      } else {
        this._CommonService.currentLang.subscribe({
          next: (res) => {
            console.log(res);
            this.currentLang = res;
            this.getAllCategory();
            this.getAllProducts();
            this.getAllBrands()
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
          },
        });
        // this.getAllBrands();
      }
    });

    this._ActivatedRoute.url.subscribe((segments) => {
      const routePath = segments.map((segment) => segment.path).join('/');
      if (routePath === 'products') {
        this.getAllProducts();
      } else {
        this.allProducts = [];
      }
    });

    this.decodeToken();
    if (this.userId !== 'notLogin') {
      this.formData.append('user_id', this.userId.user_id.toString());
      // wishlist
      this._WishlistService
        .getWishlist(this.currency, this.userId.user_id, this.currentLang)
        .subscribe({
          next: (res) => {
            this.wishlistData = res.map((item: any) => item.product.id);
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
          },
        });
    } else {
      console.log('visitor');
    }
  }

  decodeToken(): void {
    const token = localStorage.getItem('eToken');
    if (token !== null) {
      this.userId = jwtDecode(token);
    } else {
      this.userId = 'notLogin';
    }
  }

  onCategoryCheckboxChange(categoryKey: string, event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.selectedCategories.push(categoryKey);
    } else {
      this.selectedCategories = this.selectedCategories.filter(
        (key) => key !== categoryKey
      );
    }
    this.onCategoryFilterChange(this.selectedCategories);
    this.onfilterChange();
  }

  onBrandCheckboxChange(brandKey: string, event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.selectedBrands.push(brandKey);
    } else {
      this.selectedBrands = this.selectedBrands.filter(
        (key) => key !== brandKey
      );
    }
    this.onfilterChange();
  }

  onCategoryFilterChange(selectedCategories: string[]): void {
    if (selectedCategories && selectedCategories.length > 0) {
      this.selectedCategoryFilterNames = selectedCategories.map(
        (categoryKey) => {
          return (
            this.categories.find((category) => category.key === categoryKey)
              ?.name || ''
          );
        }
      );
    } else {
      if (this.currentLang = 'en'){
        this.selectedCategoryFilterNames = ['Products'];
      } else if (this.currentLang = 'ar') {
        this.selectedCategoryFilterNames = ['المنتجات'];
      }
    }
  }

  getAllProducts(): void {
    this.productLoading = true;
    this._ProductsService
      .getAllProduct(
        this.searchValue,
        this.selectedCategories,
        this.rangeValues,
        this.selectedBrands,
        this.Ratingvalue,
        this.currentPage,
        this.currency,
        this.currentLang
      )
      .subscribe({
        next: (res) => {
          this.allProducts = res.results;
          this.totalPages = res.num_pages;
          this.render = true;
          this.productLoading = false;
          console.log(this.totalPages, 'TOTAL PAGES');
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.render = true;
        },
      });
  }
  getAllCategory(): void {
    this.filterLoading = true;
    this._ProductsService.getAllCategory(this.currentLang).subscribe({
      next: (res) => {
        this.categories = res.map((category: any) => {
          return {
            name: category.title,
            key: category.id,
          };
        });
        this.filterLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }

  getAllBrands(): void {
    this.filterLoading = true;
    this._ProductsService.getAllBrands(this.currentLang).subscribe({
      next: (res) => {
        this.brands = res.map((brand: any) => {
          return {
            name: brand.title,
            key: brand.id,
          };
        });
        this.filterLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }

  resetFilters(): void {
    if (!this.categoryId) {
      this.selectedCategories = [];
    }
    this.rangeValues = [100, 3000];
    this.Ratingvalue = 1;
    this.searchValue = '';
    if ((this.currentLang = 'en')) {
      this.selectedCategoryFilterNames = ['Products'];
    } else {
      this.selectedCategoryFilterNames = ['المنتجات'];
    }
    if (!this.brandId) {
      this.selectedBrands = [];
    }
    this.onfilterChange();
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.getAllProducts();
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getAllProducts();
    }
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getAllProducts();
    }
  }

  getPageNumbers(): number[] {
    const pageCount = Math.min(this.totalPages, 5);
    const start = Math.max(1, this.currentPage - Math.floor(pageCount / 2));
    return Array.from({ length: pageCount }, (_, i) => start + i);
  }

  onfilterChange(): void {
    this.currentPage = 1;
    this.getAllProducts();
  }

  addAndRemoveWhishlist(id: number, layer: HTMLDivElement): void {
    this._AuthService.decodeToken();
    if (this._AuthService.userInfo == 'notLogin') {
      this._Renderer2.removeClass(layer, 'd-none');
    } else {
      this.formData.append('product_id', id.toString());
      this._WishlistService.addWishlist(this.formData).subscribe({
        next: (res) => {
          if (res.message == 'Added To Wishlist' && this.currentLang == 'en') {
            this._ToastrService.success('Added To Wishlist');
            const toaster:any = document.querySelector(".overlay-container")
            toaster.style.direction = 'ltr'
          }
          else if(res.message == 'Added To Wishlist' && this.currentLang == 'ar'){
            this._ToastrService.success('تم إضافة المنتج في قائمة المفضله');
            const toaster:any = document.querySelector(".overlay-container")
            toaster.style.direction = 'rtl'
          }
          else if(res.message == 'Removed From Wishlist' && this.currentLang == 'en'){
            this._ToastrService.error('Removed From Wishlist');
            const toaster:any = document.querySelector(".overlay-container")
            toaster.style.direction = 'ltr'
          }
          else if(res.message == 'Removed From Wishlist' && this.currentLang == 'ar'){
            this._ToastrService.error('تم إزالة المنتج من قائمة المفضله');
            const toaster:any = document.querySelector(".overlay-container")
            toaster.style.direction = 'rtl'
          }
          this.wishlistData = res.wishlist;
          this._WishlistService.wishlistNumber.next(this.wishlistData.length);
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
    }
  }
  showFilterlist(element:any){

    if (element.classList.contains('d-none')) {
      this._Renderer2.removeClass(element, 'd-none')
    }
    else{
      this._Renderer2.addClass(element, 'd-none')
    }
  }

  // close layerLogin

  closeLayer(layer: HTMLDivElement) {
    this._Renderer2.addClass(layer, 'd-none');
  }
  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }
}
