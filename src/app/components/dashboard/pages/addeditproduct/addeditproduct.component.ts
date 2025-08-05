import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormArray,
} from '@angular/forms';
import { ProductsService } from 'src/app/shared/services/products.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { InputNumberModule } from 'primeng/inputnumber';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AdminDashboardService } from 'src/app/shared/services/admin-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { disable } from '@rxweb/reactive-form-validators';
import { CommonService } from 'src/app/shared/services/common.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-addeditproduct',
  standalone: true,
  imports: [
CommonModule,
    StepsModule,
    ToastModule,
    DropdownModule,
    FormsModule,
    InputNumberModule,
    StepperModule,
    ButtonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './addeditproduct.component.html',
  styleUrls: ['./addeditproduct.component.scss'],
})
export class AddeditproductComponent implements OnInit {
  constructor(
    private _ProductsService: ProductsService,
    private _FormBuilder: FormBuilder,
    private _AuthService: AuthService,
    private _AdminDashboardService:AdminDashboardService,
    private _ToastrService:ToastrService,
    private _Router:Router,
    private _ActivatedRoute:ActivatedRoute,
    private _HttpClient:HttpClient,
    private _CommonService:CommonService,
    private translate:TranslateService,
    private _Renderer2:Renderer2
  ) {
    this.imageForm = this._FormBuilder.group({
      images: this._FormBuilder.array([])
    });
    this.specificationForm = this._FormBuilder.group({
      specifications: this._FormBuilder.array([]),
    });
    this.colorForm = this._FormBuilder.group({
      colors: this._FormBuilder.array([]),
    });
    this.sizeForm = this._FormBuilder.group({
      sizes: this._FormBuilder.array([]),
    });
  }
  get images(): FormArray {
    return this.imageForm.get('images') as FormArray;
  }
  get specifications(): FormArray {
    return this.specificationForm.get('specifications') as FormArray;
  }
  get colors(): FormArray {
    return this.colorForm.get('colors') as FormArray;
  }
  get sizes(): FormArray {
    return this.sizeForm.get('sizes') as FormArray;
  }
  imageForm: FormGroup;
  specificationForm: FormGroup;
  colorForm: FormGroup;
  sizeForm: FormGroup;
  categories: any[] = [];
  brands: any[] = [];
  selectedCat: any;
  selectedBrand: any;
  productSize: number = 0;
  priceValueEGP: number = 0;
  priceValueAED: number = 0;
  shippingamont: number = 0;
  stockquantity: number = 0;
  productImageSrc: any;
  productTitleEn: string = 'Product Title';
  productTitleAr: string = 'أسم المنتج';
  inputsImages: any[] = [];
  inputsSpecifications: any[] = [];
  inputsColors: any[] = [];

  inputsSizes: any[] = [];
  vendorId: number = 0;

  imageUrl:string = ''
  update:boolean = false
  headers:any
  vendorToken:any
  productId:any
  currentLang:string = ''

  // check update
  productDetails_success_ubdated:boolean = false
  //

  @ViewChild('stepper') stepper: any; // Add ViewChild reference

  ngOnInit(): void {
    // get current lang samehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
    this._CommonService.vendorCurrentLang.subscribe({
      next: (res) => {
        console.log(res , 'cartlang');
        this.currentLang = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });

    this.getAllCategories()
    this.getAllBrands()



    if (localStorage.getItem('eToken')!==null) {
      console.log('eToken' , localStorage.getItem('eToken'));
      this.vendorToken = localStorage.getItem('eToken')
    }

    this._AuthService.decodeToken();
    this.vendorId = this._AuthService.userInfo?.vendor_id;
    console.log();


    console.log('input', this.inputsImages);
    this._ActivatedRoute.paramMap.subscribe({
      next:(param)=>{
        this.productId = param.get('id')
        if (this.productId !== null) {
          console.log('update0 0000');

          this.update = true
           this._AdminDashboardService.getProductDetails(this.vendorId , this.productId).subscribe({
            next:(res)=>{
              console.log(res , 'productdetails');
              this.firstForm.get('title_en')?.setValue(res.title_en)
              this.firstForm.get('title_ar')?.setValue(res.title_ar)
              this.productTitleEn = res.title_en
              this.productTitleAr = res.title_ar
              this.firstForm.get('description_en')?.setValue(res.description_en)
              this.firstForm.get('description_ar')?.setValue(res.description_ar)
              this.firstForm.get('category')?.setValue(res.category.id)
              this.firstForm.get('brand')?.setValue(res.brand.id)
              this.firstForm.get('price_EGP')?.setValue(res.price_EGP)
              this.firstForm.get('price_AED')?.setValue(res.price_AED)
              this.firstForm.get('shipping_amount')?.setValue(res.shipping_amount)
              this.firstForm.get('stock_qty')?.setValue(res.stock_qty)
              this.productImageSrc = res.image
              this.imageUrl = res.image

              console.log(this.inputsImages , 'inputsImages');
              console.log(this.specificationForm , 'specificationForm');

            },
            error:(err)=>{
              console.log(err);

            }
           })
        }
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
//

 // Function to handle file input change
  onFileChange(event: any) {
    console.log(event , 'onFileChange=>event');

    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.productImageSrc = reader.result as string;
      };
    }
  }

  firstForm: FormGroup = this._FormBuilder.group({
    image: [null],
    title_en: ['', Validators.required],
    title_ar: [''],
    description_en: ['', Validators.required],
    description_ar: [''],
    category: [null, Validators.required],
    brand: [null, Validators.required],
    price_EGP: [0, Validators.required],
    price_AED: [0],
    shipping_amount: [0, Validators.required],
    stock_qty: [0, Validators.required],
  });

  getAllCategories(): void {
    this._ProductsService.getAllCategory(this.currentLang).subscribe({
      next: (res: any[]) => {
        this.categories = res.map((item) => ({
          name: item.title,
          code: item.id,
        }));
        console.log(this.categories);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }
  getAllBrands(): void {
    this._ProductsService.getAllBrands(this.currentLang).subscribe({
      next: (res: any[]) => {
        this.brands = res.map((item) => ({
          name: item.title,
          code: item.id,
        }));
        console.log(this.brands , 'brands');
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }

  readAndSetImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.firstForm.get('image')?.setValue(reader.result);
    };
    reader.readAsDataURL(file);
  }

  onTitleChange(lang:string , event: any) {
    if (lang == 'en') {
      if (event.target.value.length > 0) {
        this.productTitleEn = event.target.value;
      } else {
        this.productTitleEn = 'Product Title';
      }
    }
    else if(lang == 'ar'){
      if (event.target.value.length > 0) {
        this.productTitleAr = event.target.value;
      } else {
        this.productTitleAr = 'أسم المنتج';
      }
    }

  }

  addInput(type: any) {
    type.push({});
    console.log('input', type);
  }
  addToImagesFormGroup() {
    this.images.push(this._FormBuilder.group({
      image: [null],
    }));
  }
  addToSpecificationsFormGroup() {
    this.specifications.push(this._FormBuilder.group({
      title_en: ['' , [Validators.required]],
      content_en: ['' , [Validators.required]],
      title_ar: [''],
      content_ar: ['']
    }));
  }
  addToColorsFormGroup() {
    this.colors.push(this._FormBuilder.group({
      name_en: ['' , [Validators.required]],
      name_ar: ['' ],
      code: ['' , [Validators.required]]
    }));
  }
  addToSizesFormGroup() {
    this.sizes.push(this._FormBuilder.group({
      name_en: ['' , [Validators.required]],
      name_ar: [''],
      price:[0]
    }));
  }

  removeInput(type:any , form:any , index: number) {
    console.log(form , 'form 1');
    console.log(type , 'type 1');

    form.removeAt(index)
    console.log(form , 'form 2');

    type.splice(index, 1);
  }

  onImageInputChange(event: any, index: number) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.inputsImages[index].image = reader.result as string;
      };
    }
  }

  hello() {
    console.log(this.firstForm.value);
  }

  onNextClick(): void {
    if (this.firstForm.valid && this.sizeForm.valid) {
      this.addProduct();
    } else {
      this.markInvalidFields(this.firstForm);
      this.markInvalidFields(this.sizeForm);
      console.log(this.sizeForm.value.sizes);
    }
  }

  markInvalidFields(form: FormGroup): void {
    console.log(form);
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      if (control && control.invalid) {
        control.markAsTouched();
        control.markAsDirty();
      }
    });
  }

  showSpecificationForm() {
    console.log(this.specificationForm.value, 'specificationForm');
  }
  showColorsForm() {
    console.log(this.colorForm.value, 'colorForm');
  }
  showSizesForm() {
    console.log(this.sizeForm.value, 'sizeForm');
  }

  //

  productThumbnailUrl: any;
  productImages: any[] = [];

  onThumbnailChange(e: any) {
    console.log(e.target.files[0].name);
    this.productThumbnailUrl = e.target.files[0];
  }

  //  here i collect all product images

  @ViewChildren('imageInput')
  imageInputs!:QueryList<any>

  collectProductImages(){

    for (const input of this.imageInputs) {
      this.productImages.push(input.nativeElement.files[0]);
    }
    console.log(this.productImages , 'productImages');

  }
  //

  addProduct() {
    let availability: Boolean = false;
    if (this.firstForm.get('stock_qty')?.value > 0) {
      availability = true;
    } else {
      availability = false;
    }
    const itemData: FormGroup = this._FormBuilder.group({
      title_en: this.firstForm.get('title_en')?.value,
      title_ar: this.firstForm.get('title_ar')?.value,
      description_en: this.firstForm.get('description_en')?.value,
      description_ar: this.firstForm.get('description_ar')?.value,
      category: this.firstForm.get('category')?.value,
      brand: this.firstForm.get('brand')?.value,
      price_EGP: this.firstForm.get('price_EGP')?.value,
      price_AED: this.firstForm.get('price_AED')?.value,
      shipping_amount: this.firstForm.get('shipping_amount')?.value,
      stock_qty: this.firstForm.get('stock_qty')?.value,
      in_stock: availability,
      vendor: this.vendorId,
    });

    const formData = new FormData();
    Object.keys(itemData.value).forEach((key) => {
      formData.append(key, itemData.get(key)?.value);
    });

    if (
      this.productThumbnailUrl !== null &&
      this.productThumbnailUrl !== undefined
    ) {
      formData.append(
        'image',
        this.productThumbnailUrl,
        this.productThumbnailUrl.name
      );
    }
    for (let i = 0; i < this.productImages.length; i++) {
      console.log(this.productImages[i] ,'productImages[i]');
      if (this.productImages[i] !== undefined) {
        formData.append(
          `gallery[${i}][image]`,
          this.productImages[i],
          this.productImages[i].name
        );
      }
    }
    for (let i = 0; i < this.specificationForm.value.specifications.length; i++) {
      formData.append(
        `specifications[${i}][title_en]`,
        this.specificationForm.value.specifications[i].title_en
      );
      formData.append(
        `specifications[${i}][content_en]`,
        this.specificationForm.value.specifications[i].content_en
      );
      formData.append(
        `specifications[${i}][title_ar]`,
        this.specificationForm.value.specifications[i].title_ar
      );
      formData.append(
        `specifications[${i}][content_ar]`,
        this.specificationForm.value.specifications[i].content_ar
      );
    }
    for (let i = 0; i < this.colorForm.value.colors.length; i++) {
      formData.append(
        `colors[${i}][name_en]`,
        this.colorForm.value.colors[i].name_en
      );
      formData.append(
        `colors[${i}][name_ar]`,
        this.colorForm.value.colors[i].name_ar
      );
      formData.append(
        `colors[${i}][color_code]`,
        this.colorForm.value.colors[i].code
      );
    }
    for (let i = 0; i < this.sizeForm.value.sizes.length; i++) {
      formData.append(`sizes[${i}][name_en]`, this.sizeForm.value.sizes[i].name_en);
      formData.append(`sizes[${i}][name_ar]`, this.sizeForm.value.sizes[i].name_ar);
      formData.append(`sizes[${i}][price]`, this.sizeForm.value.sizes[i].price);
    }

    formData.forEach((value, key) => {
      console.log(key, value);
    });

    if (this.update == false) {
      this._AdminDashboardService.addProduct(formData).subscribe({
        next:(res)=>{
          console.log(res , 'finish');
          if (res.id) {
            this._ToastrService.success('The Product Was Added Successfully')
            this._Router.navigate(['dashboard'])
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
  updateProductDetails() {
    if (this.update) {
      let availability: Boolean = false;
    if (this.firstForm.get('stock_qty')?.value > 0) {
      availability = true;
    } else {
      availability = false;
    }
    const itemData: FormGroup = this._FormBuilder.group({
      title_en: this.firstForm.get('title_en')?.value,
      title_ar: this.firstForm.get('title_ar')?.value,
      description_en: this.firstForm.get('description_en')?.value,
      description_ar: this.firstForm.get('description_ar')?.value,
      category: this.firstForm.get('category')?.value,
      brand: this.firstForm.get('brand')?.value,
      price_EGP: this.firstForm.get('price_EGP')?.value,
      price_AED: this.firstForm.get('price_AED')?.value,
      shipping_amount: this.firstForm.get('shipping_amount')?.value,
      stock_qty: this.firstForm.get('stock_qty')?.value,
      in_stock: availability,
      vendor: this.vendorId,
    });

    const formData = new FormData();
    Object.keys(itemData.value).forEach((key) => {
      formData.append(key, itemData.get(key)?.value);
    });
    if (
      this.productThumbnailUrl !== null &&
      this.productThumbnailUrl !== undefined
    ) {
      formData.append(
        'image',
        this.productThumbnailUrl,
        this.productThumbnailUrl.name
      );
    }


      this._AdminDashboardService.updateProductDetails(this.vendorId , this.productId , formData , this.vendorToken).subscribe({
        next:(res)=>{
          console.log(res , 'updateProductDetails');
          if (res.message == "Product details have been updated successfully") {
            this.productDetails_success_ubdated = true
          }
          this.inputsImages = res.product.gallery
          console.log(this.inputsImages , 'imagesProsuct');

          if(this.inputsImages.length == 0){
            this.inputsImages.push({images:{
              image: ['' , [Validators.required]],
            }
            })
          }

          // set inputsSpecifications values from Api response
          this.inputsSpecifications = res.product.specification
          console.log(this.inputsSpecifications , 'inputsSpecifications');
          if (this.inputsSpecifications.length > 0) {
            this.specifications.clear()
          }
          else if(this.inputsSpecifications.length == 0){
            this.inputsSpecifications.push({specifications:{
              title_en: ['' , [Validators.required]],
              content_en: ['' , [Validators.required]],
              title_ar: ['' , ],
              content_ar: ['' , ]
            }

            })
          }
          for (const spec of this.inputsSpecifications) {
            this.specifications.push(this._FormBuilder.group({
              title_en: [spec.title_en , [Validators.required]],
              title_ar: [spec.title_ar ],
              content_en: [spec.content_en , [Validators.required]],
              content_ar: [spec.content_ar ]
            }));
            console.log(this.specifications , 'specifications');
            console.log(this.inputsSpecifications , 'inputsSpecifications');

          }

          // set inputsColors values from Api response
          this.inputsColors = res.product.color
          if (this.inputsColors.length > 0) {
            this.colors.clear()
          }
          else if(this.inputsColors.length == 0){
            this.inputsColors.push({colors:{
              name_en: ['' , [Validators.required]],
              name_ar: ['' ],
              code: ['' , [Validators.required]]
            }
            })
          }
          for (const color of this.inputsColors) {
            this.colors.push(this._FormBuilder.group({
              name_en: [color.name_en , [Validators.required]],
              name_ar: [color.name_ar ],
              code: [color.color_code , [Validators.required]]
            }));
            console.log(this.colors , 'colors');
            console.log(this.inputsColors , 'inputsColors');

          }

          // set inputsSizes values from Api response
          this.inputsSizes = res.product.size
          if (this.inputsSizes.length > 0) {
            this.sizes.clear()
          }
          else if(this.inputsSizes.length == 0){
            this.inputsSizes.push({sizes:{
              name_en: ['' , [Validators.required]],
              name_ar: ['' ]
            }
            })
          }
          for (const size of this.inputsSizes) {
            this.sizes.push(this._FormBuilder.group({
              name_en: [size.name_en , [Validators.required]],
              name_ar: [size.name_ar ],
            }));
            console.log(this.sizes , 'sizes');
            console.log(this.inputsSizes , 'inputsSizes');

          }
        },
        error:(err)=>{
          console.log(err);

        }
      })
    }
  }

  // product gallery
  updateProductGalleryImage(index:number , element:any) {
    if (this.update) {
      console.log(index);
      const imagesArray: ElementRef[] = this.imageInputs.toArray();
      const image = imagesArray[index].nativeElement.files[0]
      const gId:string = imagesArray[index].nativeElement.getAttribute('gid')
      this._Renderer2.setAttribute(element , 'disabled' , 'true')
      console.log(imagesArray[index].nativeElement);

      if (image !== undefined && gId !== null) {
        console.log('UPDATE IMAGE');
        const formData = new FormData();
        formData.append('gallery_gid',gId)
        formData.append('image',image)
        formData.append('active','true')
        this._AdminDashboardService.updateProductGalleryImage(this.vendorId , this.productId , formData , this.vendorToken).subscribe({
          next:(res)=>{
            console.log(res , 'update');
            if (res.message == "Gallery details have been updated successfully" && this.currentLang == 'en') {
              this._ToastrService.success('Product image Was Added Successfully')
              const toaster:any = document.querySelector(".overlay-container")
              toaster.style.direction = 'ltr'
            }
            else if (res.message == "Gallery details have been updated successfully" && this.currentLang == 'ar') {
              this._ToastrService.success('تم إضافة صورة المنتج بنجاح')
              const toaster:any = document.querySelector(".overlay-container")
              toaster.style.direction = 'rtl'
            }
          },
          error:(err)=>{
            console.log(err);

          }
        })

      }
      else if (image !== undefined && gId == null){
        console.log('ADD iMAGE');
        const formData = new FormData();
        formData.append('image',image)
        formData.append('active','true')
        this._AdminDashboardService.updateProductGalleryImage(this.vendorId , this.productId , formData , this.vendorToken).subscribe({
          next:(res)=>{
            console.log(res , 'add');

          },
          error:(err)=>{
            console.log(err);

          }
        })
      }

    }
  }
  deleteProductGalleryImage(gid:string){
    const formData = new FormData ()
    if (gid !== undefined) {
      formData.append('gallery_gid' , gid)
    this._AdminDashboardService.deleteProductGalleryImage(this.vendorId , this.productId , this.vendorToken , formData).subscribe({
      next:(res)=>{
        console.log(res);
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
}

  // product specification
  updateProductSpecification(spId:string , index:number , updateSpecBtn:any){
    console.log(spId);
    console.log(index);
    if (this.specifications.controls[index].status == 'VALID'){
      this._Renderer2.setAttribute(updateSpecBtn , 'disabled' , 'true' )
      const formData = new FormData ()
        formData.append(
          `title_en`,
          this.specificationForm.value.specifications[index].title_en
        );
        formData.append(
          `content_en`,
          this.specificationForm.value.specifications[index].content_en
        );
        formData.append(
          `title_ar`,
          this.specificationForm.value.specifications[index].title_ar
        );
        formData.append(
          `content_ar`,
          this.specificationForm.value.specifications[index].content_ar
        );
      if (spId !== undefined) {

        formData.append( `spid`, spId );
        this._AdminDashboardService.updateProductSpecifications(this.vendorId , this.productId , formData , this.vendorToken).subscribe({
          next:(res)=>{
            console.log(res , 'updateSpec');
            if (res.message == "Specification have been updated successfully" && this.currentLang == 'en') {
              this._ToastrService.success('Product Specification Was Updated Successfully')
              const toaster:any = document.querySelector(".overlay-container")
              toaster.style.direction = 'ltr'
            }
            else if (res.message == "Specification have been updated successfully" && this.currentLang == 'ar') {
              this._ToastrService.success('تم تحديث وصف المنتج بنجاح')
              const toaster:any = document.querySelector(".overlay-container")
              toaster.style.direction = 'rtl'
            }
          },
          error:(err)=>{
            console.log(err);
          }
        })
      }
      else if(spId == undefined){
        formData.delete('spid');
        this._AdminDashboardService.updateProductSpecifications(this.vendorId , this.productId , formData , this.vendorToken).subscribe({
          next:(res)=>{
            console.log(res , 'addSpec');
            if (res.message == "Specification have been updated successfully" && this.currentLang == 'en') {
              this._ToastrService.success('Product Specification Was Added Successfully')
              const toaster:any = document.querySelector(".overlay-container")
              toaster.style.direction = 'ltr'
            }
            else if (res.message == "Specification have been updated successfully" && this.currentLang == 'ar') {
              this._ToastrService.success('تم إضافة وصف المنتج بنجاح')
              const toaster:any = document.querySelector(".overlay-container")
              toaster.style.direction = 'rtl'
            }
          },
          error:(err)=>{
            console.log(err);
          }
        })
      }
    }
    else{
      this._ToastrService.error('All Inputs Are Required')
    }


  }
  // SHOW SPEC-UPDATE-BTN
  displayUpdateBtn(updateBtnRef:any,Id:any){
    if (Id !== undefined) {
      let updateBtn:any = updateBtnRef.querySelector('.updateBtn')
      this._Renderer2.removeAttribute(updateBtn , 'disabled' )
    }
  }
  deleteProductSpecification(spid:string){
    const formData = new FormData ()
    if (spid !== undefined) {
      formData.append('spid' , spid)
    this._AdminDashboardService.deleteProductSpecifications(this.vendorId , this.productId , this.vendorToken , formData).subscribe({
      next:(res)=>{
        console.log(res);
        if (res.message == "Specification deleted successfully" && this.currentLang == 'en') {
          this._ToastrService.error('Product Specification Was Deleted Successfully')
          const toaster:any = document.querySelector(".overlay-container")
          toaster.style.direction = 'ltr'
        }
        else if (res.message == "Specification deleted successfully" && this.currentLang == 'ar') {
          this._ToastrService.error('تم حذف وصف المنتج بنجاح')
          const toaster:any = document.querySelector(".overlay-container")
          toaster.style.direction = 'rtl'
        }
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
}

  // product color
  updateProductColor(cId:string , index:number , updateColorBtn:any){
    console.log(cId);
    console.log(index);
    if (this.colors.controls[index].status == 'VALID') {
      this._Renderer2.setAttribute(updateColorBtn , 'disabled' , 'true' )
      const formData = new FormData ()
      formData.append(
        `name_en`,
        this.colorForm.value.colors[index].name_en
      );
      formData.append(
        `name_ar`,
        this.colorForm.value.colors[index].name_ar
      );
      formData.append(
        `color_code`,
        this.colorForm.value.colors[index].code
      );
      if (cId !== undefined) {

        formData.append( `color_cid`, cId );
        this._AdminDashboardService.updateProductColor(this.vendorId , this.productId , formData , this.vendorToken).subscribe({
          next:(res)=>{
            console.log(res , 'updatecolor');
            if (res.message == "Color have been updated successfully" && this.currentLang == 'en') {
              this._ToastrService.success('Product Color Was Updated Successfully')
              const toaster:any = document.querySelector(".overlay-container")
              toaster.style.direction = 'ltr'
            }
            else if (res.message == "Color have been updated successfully" && this.currentLang == 'ar') {
              this._ToastrService.success('تم تحديث لون المنتج بنجاح')
              const toaster:any = document.querySelector(".overlay-container")
              toaster.style.direction = 'rtl'
            }
          },
          error:(err)=>{
            console.log(err);
          }
        })
      }
      else if(cId == undefined){
        formData.delete('color_cid');
        this._AdminDashboardService.updateProductColor(this.vendorId , this.productId , formData , this.vendorToken).subscribe({
          next:(res)=>{
            console.log(res , 'addcolor');
            if (res.message == "Color have been updated successfully" && this.currentLang == 'en') {
              this._ToastrService.success('Product Color Was Added Successfully')
              const toaster:any = document.querySelector(".overlay-container")
              toaster.style.direction = 'ltr'
            }
            else if (res.message == "Color have been updated successfully" && this.currentLang == 'ar') {
              this._ToastrService.success('تم إضافة لون المنتج بنجاح')
              const toaster:any = document.querySelector(".overlay-container")
              toaster.style.direction = 'rtl'
            }
          },
          error:(err)=>{
            console.log(err);
          }
        })
      }
    }
    else{
      this._ToastrService.error('All Inputs Are Required')
    }


  }
  deleteProductColor(cid:string){
    const formData = new FormData ()
    if (cid !== undefined) {
      formData.append('color_cid' , cid)
    this._AdminDashboardService.deleteProductColor(this.vendorId , this.productId , this.vendorToken , formData).subscribe({
      next:(res)=>{
        console.log(res);
        if (res.message == "Color deleted successfully" && this.currentLang == 'en') {
          this._ToastrService.error('Product Color Was Deleted Successfully')
          const toaster:any = document.querySelector(".overlay-container")
          toaster.style.direction = 'ltr'
        }
        else if (res.message == "Color deleted successfully" && this.currentLang == 'ar') {
          this._ToastrService.error('تم حذف لون المنتج بنجاح')
          const toaster:any = document.querySelector(".overlay-container")
          toaster.style.direction = 'rtl'
        }
      },
      error:(err)=>{
        console.log(err);
      }
    })
    }
  }

  // product Size
  updateProductSize(sId:string , index:number , updateSizeBtn:any){
    console.log(sId);
    console.log(index);
    if (this.sizes.controls[index].status == 'VALID'){
      this._Renderer2.setAttribute(updateSizeBtn , 'disabled' , 'true' )
    const formData = new FormData ()
    formData.append(`name_en`, this.sizeForm.value.sizes[index].name_en);
    formData.append(`name_ar`, this.sizeForm.value.sizes[index].name_ar);

    if (sId !== undefined) {

      formData.append( `sid`, sId );
      this._AdminDashboardService.updateProductSize(this.vendorId , this.productId , formData , this.vendorToken).subscribe({
        next:(res)=>{
          console.log(res , 'updatesize');
          if (res.message == "Size have been updated successfully" && this.currentLang == 'en') {
            this._ToastrService.success('Product Size Was Updated Successfully')
            const toaster:any = document.querySelector(".overlay-container")
            toaster.style.direction = 'ltr'
          }
          else if (res.message == "Size have been updated successfully" && this.currentLang == 'ar') {
            this._ToastrService.success('تم تحديث مقاس المنتج بنجاح')
            const toaster:any = document.querySelector(".overlay-container")
            toaster.style.direction = 'rtl'
          }
        },
        error:(err)=>{
          console.log(err);
        }
      })
    }
    else if(sId == undefined){
      formData.delete('sid');
      this._AdminDashboardService.updateProductSize(this.vendorId , this.productId , formData , this.vendorToken).subscribe({
        next:(res)=>{
          console.log(res , 'addsize');
          if (res.message == "Size have been updated successfully" && this.currentLang == 'en') {
            this._ToastrService.success('Product Size Was Added Successfully')
            const toaster:any = document.querySelector(".overlay-container")
            toaster.style.direction = 'ltr'

          }
          else if (res.message == "Size have been updated successfully" && this.currentLang == 'ar') {
            this._ToastrService.success('تم إضافة مقاس المنتج بنجاح')
            const toaster:any = document.querySelector(".overlay-container")
            toaster.style.direction = 'rtl'

          }

        },
        error:(err)=>{
          console.log(err);
        }
      })
    }
    }
    else{
      this._ToastrService.error('All Inputs Are Required')
    }


  }
  deleteProductSize(sid:string){
    console.log(sid ,' sid');
    const formData = new FormData ()
    if (sid !== undefined) {
      formData.append('sid' , sid)
      this._AdminDashboardService.deleteProductSize(this.vendorId , this.productId , this.vendorToken , formData).subscribe({
        next:(res)=>{
          console.log(res);
          if (res.message == "Size deleted successfully" && this.currentLang == 'en') {
            this._ToastrService.error('Product Size Was Deleted Successfully')
            const toaster:any = document.querySelector(".overlay-container")
            toaster.style.direction = 'ltr'
          }
          else if (res.message == "Size deleted successfully" && this.currentLang == 'ar') {
            this._ToastrService.error('تم حذف مقاس المنتج بنجاح')
            const toaster:any = document.querySelector(".overlay-container")
            toaster.style.direction = 'rtl'
          }
        },
        error:(err)=>{
          console.log(err);
        }
      })
    }
  }

  // update done
  checkUpdates(){
    if ( this.productDetails_success_ubdated && this.currentLang == 'en')
      {
        this._ToastrService.success('Product Was Updated Successfully')
        const toaster:any = document.querySelector(".overlay-container")
        toaster.style.direction = 'ltr'
      }
    else if(this.productDetails_success_ubdated && this.currentLang == 'ar')  {
      this._ToastrService.success('تم تحديث المنتج بنجاح')
      const toaster:any = document.querySelector(".overlay-container")
      toaster.style.direction = 'rtl'
    }
    this._Router.navigate(['dashboard'])
  }
  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }
}
