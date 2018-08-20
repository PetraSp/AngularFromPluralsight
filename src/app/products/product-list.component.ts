import { ProductService } from './product.service';
import { Component, OnInit } from "@angular/core";
import { IProduct } from "./product";
import { ValueTransformer } from "@angular/compiler/src/util";


@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit {
  pageTitle: string = 'Product List';
  imageWidth: number = 50;
  imageMargin: number = 2;
  // create class property that keeps track whether the images are currently displayed,
  // false - images are not displayed when the page is first loaded
  showImage: boolean = false;
  errorMessage: string;

  // next we need to know when the user changes the filter criteria. we could use the event binding and watch for keypresses or value changes but an easier way is to change our listFilter propery into a getter and setter.
  // when the data binding needs the value, it will call the getter and get the value 
  // everytime the user modifies the value, the data binding calls the setter, passing in the changed value 
  
  _listFilter: string; 
  get listFilter(): string {
    return this._listFilter;
  }

  // we want to set our product Filter array to the filtered list of products 
  // handle the posibility our listFilter string is empty, null or undefined 
  // if there is a listFilter value this code filters on that value 
  // if the listFilter is not set the filtered products property is assigned to the entire list of products. if there is no filter we should display all of the products

  set listFilter(value:string) {
    this._listFilter = value;
    this.filteredProducts = this.listFilter ? this.performFilter(this.listFilter) : this.products;
  }

  // first we need the filtered list of products that we can bind to, we define a property for it here. Why don't we just filter our products array? Because once we have filtered our products array we lose our original data and can't get it back withour re-getting the data from its source
  filteredProducts: IProduct [];
  products: IProduct [] = [];

// using typescript - of type ProductService
  constructor (private productService: ProductService) {
  }

  onRatingClicked(message: string): void {
    this.pageTitle = 'Product List: ' + message;
  }

  performFilter(filterBy: string): IProduct[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.products.filter((product: IProduct) =>
          product.productName.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }


  // no function keyword is required in TS, our method won't have the return type we specify it as void
  // the body of the method simply toggles the state of the showImage property 
  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  ngOnInit(): void {
    // console.log('In OnInit');
    this.productService.getProducts().subscribe(
      products => {
        this.products = products,
        this.filteredProducts = this.products;
      },
      error => this.errorMessage = <any>error
    );
  }
}
