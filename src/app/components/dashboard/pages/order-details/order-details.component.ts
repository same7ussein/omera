import { AdminDashboardService } from 'src/app/shared/services/admin-dashboard.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { TableModule } from 'primeng/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { LoadingComponent } from 'src/app/components/loading/loading.component';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, TableModule, TranslateModule,LazyLoadImageModule, LoadingComponent],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  constructor(
    private _AdminDashboardService: AdminDashboardService,
    private _ActivatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private _CommonService: CommonService
  ) {}
  ngOnInit(): void {
    this.getOid();
    this.getId();
    this._CommonService.vendorCurrentLang.subscribe({
      next: (res) => {
        this.currentLang = res;
        this.getOrderDetails();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }
  Oid: string = '';
  id: any;
  products!: any;
  data: any;
  first = 0;
  loading: boolean = true;
  currentLang: string = '';

  getOid(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (pram: any) => {
        this.Oid = pram.params.oid;
        console.log(this.Oid);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getId(): void {
    const encode = localStorage.getItem('eToken');
    if (encode !== null) {
      const decode = jwtDecode(encode);
      this.id = decode;
      console.log(this.id);
      console.log(this.id.vendor_id);
    } else {
      this.id = 'notLogin';
    }
  }
  getOrderDetails(): void {
    this.loading = true;
    this._AdminDashboardService
      .getOrderDetails(this.id.vendor_id, this.Oid, this.currentLang)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.products = res.orderitem;
          this.data = res;
          this.loading = false;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }
}
