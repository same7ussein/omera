import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorCoponsService } from 'src/app/shared/services/vendor-copons.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoadingComponent } from 'src/app/components/loading/loading.component';

@Component({
  selector: 'app-vendor-coupons',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, LoadingComponent],
  templateUrl: './vendor-coupons.component.html',
  styleUrls: ['./vendor-coupons.component.scss'],
})
export class VendorCouponsComponent implements OnInit {
  constructor(
    private _FormBuilder: FormBuilder,
    private _VendorCoponsService: VendorCoponsService,
    private _AuthService: AuthService,
    private _Renderer2: Renderer2,
    private translate: TranslateService
  ) {}

  allCoupons: any[] = [];
  allCouponsNum: any;
  activateCoupons: any;
  couponId: number = 0;
  vendorId: number = 0;
  couponsName: string[] = [];
  loading: boolean = true;
  couponDataForm: FormGroup = this._FormBuilder.group({
    code: ['', [Validators.required]],
    discount: ['', [Validators.required]],
    active: [false],
  });
  couponStatus() {
    this.loading = true;
    this._VendorCoponsService.couponsStatus(this.vendorId).subscribe({
      next: (res) => {
        console.log(res);
        this.allCouponsNum = res[0].total_coupons;
        this.activateCoupons = res[0].active_coupons;
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  createCoupon(layer: HTMLDivElement, alert: HTMLDivElement) {
    if (this.couponDataForm.valid) {
      for (const couponName of this.allCoupons) {
        this.couponsName.push(couponName.code);
      }
      if (this.couponsName.includes(this.couponDataForm.get('code')?.value)) {
        this._Renderer2.removeClass(alert, 'd-none');
      } else {
        console.log(this.couponsName);

        const itemData: FormGroup = this._FormBuilder.group({
          vendor_id: 1,
          code: this.couponDataForm.get('code')?.value,
          discount: this.couponDataForm.get('discount')?.value,
          active: this.couponDataForm.get('active')?.value,
        });

        const formData = new FormData();
        Object.keys(itemData.value).forEach((key) => {
          formData.append(key, itemData.get(key)?.value);
        });
        //console.log(itemData.value);

        this._VendorCoponsService
          .createCoupon(this.vendorId, formData)
          .subscribe({
            next: (res) => {
              console.log(res);
              this._Renderer2.addClass(layer, 'd-none');
              if (res.message == 'Coupon Created Successfully.') {
                this.getAllCoupons();
              }
            },
            error: (err) => {
              console.log(err);
            },
          });
      }
    } else {
      console.log('all inputs are required');
      this.couponDataForm.markAllAsTouched();
    }
  }
  // all coupons
  getAllCoupons() {
    this.loading = true;
    this._VendorCoponsService.listCoupons(this.vendorId).subscribe({
      next: (res) => {
        console.log(res, 'allcop');
        this.allCoupons = res;
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  ngOnInit(): void {
    this._AuthService.decodeToken();
    this.vendorId = this._AuthService.userInfo.vendor_id;
    // get all coupons
    this.getAllCoupons();
    this.couponStatus();
  }

  editCoupon(layer: HTMLDivElement) {
    this.couponId = 0;
    this.couponDataForm.get('code')?.setValue('');
    this.couponDataForm.get('discount')?.setValue('');
    this.couponDataForm.get('active')?.setValue(false);
    this._Renderer2.removeClass(layer, 'd-none');
  }
  closeLayer(layer: HTMLDivElement) {
    this._Renderer2.addClass(layer, 'd-none');
    this.couponId = 0;
  }

  // delete coupon
  deleteCoupon(id: number) {
    this._VendorCoponsService.deleteCoupon(this.vendorId, id).subscribe({
      next: (res) => {
        console.log(res);
        if (res == null) {
          this.getAllCoupons();
          this.couponStatus();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  // coupon details
  couponDetails(
    couponId: number,
    layer: HTMLDivElement,
    formButtons: HTMLDivElement
  ) {
    this.couponId = couponId;
    this._VendorCoponsService.couponDetails(this.vendorId, couponId).subscribe({
      next: (res) => {
        console.log(res);
        this._Renderer2.removeClass(layer, 'd-none');
        this.couponDataForm.get('code')?.setValue(res.code);
        this.couponDataForm.get('discount')?.setValue(res.discount);
        this.couponDataForm.get('active')?.setValue(res.active);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // update coupon
  updateCoupon(couponId: number, layer: HTMLDivElement) {
    if (this.couponDataForm.valid) {
      const itemData: FormGroup = this._FormBuilder.group({
        vendor_id: 1,
        code: this.couponDataForm.get('code')?.value,
        discount: this.couponDataForm.get('discount')?.value,
        active: this.couponDataForm.get('active')?.value,
      });

      const formData = new FormData();
      Object.keys(itemData.value).forEach((key) => {
        formData.append(key, itemData.get(key)?.value);
      });

      this._VendorCoponsService
        .updateCoupon(this.vendorId, couponId, formData)
        .subscribe({
          next: (res) => {
            console.log(res);
            this._Renderer2.addClass(layer, 'd-none');
            this.getAllCoupons();
            this.couponStatus();
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else {
      console.log('all inputs are required');
      this.couponDataForm.markAllAsTouched();
    }
  }

  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }
}
