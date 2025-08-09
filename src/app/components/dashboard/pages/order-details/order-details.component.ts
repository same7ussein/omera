import { AdminDashboardService } from 'src/app/shared/services/admin-dashboard.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { TableModule } from 'primeng/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { ReceiptComponent } from '../orders/receipt/receipt.component';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TranslateModule,
    LazyLoadImageModule,
    LoadingComponent,
    ReceiptComponent,
  ],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  @ViewChild('printSection', { static: false }) printSection!: ElementRef;
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
  orderData: any;

  showReceipt = false;

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
          this.orderData = res;
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
  toggleReceipt(): void {
    this.showReceipt = !this.showReceipt;
  }

print() {
  if (!this.printSection) return;

  const clone = this.printSection.nativeElement.cloneNode(true) as HTMLElement;

  clone.querySelectorAll('img').forEach(img => {
    const srcAttr = img.getAttribute('src');
    if (srcAttr && !srcAttr.startsWith('http')) {
      img.src = `${location.origin}/${srcAttr}`;
    }
  });

  const printContents = clone.innerHTML;

  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map(node => node.outerHTML)
    .join('');

  const printWindow = window.open('', '_blank', 'width=800,height=600');

  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          ${styles}
        </head>
        <body onload="window.print(); window.close();">
          ${printContents}
        </body>
      </html>
    `);

    printWindow.document.close();
  }
}


}
