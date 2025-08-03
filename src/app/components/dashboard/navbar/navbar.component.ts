import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from 'src/app/shared/services/common.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  currentLang: string = '';

  constructor(
    public translate: TranslateService,
    private _CommonService: CommonService
  ) {}
  changeCurrentLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('vendorcurrentLang', lang);
    this._CommonService.vendorCurrentLang.next(lang);
  }
  selectedLanguage: string = '';

  ngOnInit() {
    this.currentLang = localStorage.getItem('vendorcurrentLang') || 'en';
    this.translate.use(this.currentLang);
    this._CommonService.vendorCurrentLang.next(this.currentLang);
    this.selectedLanguage =
      localStorage.getItem('vendorselectedLanguage') || 'English';
  }

  selectLanguage(language: string) {
    this.selectedLanguage = language;
    localStorage.setItem('vendorselectedLanguage', this.selectedLanguage);
  }

  getIconClass(language: string) {
    switch (language) {
      case 'English':
        return 'fi fi-gb-eng';
      case 'Arabic':
        return 'fi fi-eg';
      default:
        return '';
    }
  }
  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }
}
