import { Component } from '@angular/core';
import { ProductStateService } from '../../../products/state/product-state.service';

@Component({
    selector: 'app-cart',
    templateUrl: './cart-shell.component.html',
    styleUrls: ['./cart-shell.component.css'],
})
export class CartShellComponent {
    constructor(public productState: ProductStateService) {}
}
