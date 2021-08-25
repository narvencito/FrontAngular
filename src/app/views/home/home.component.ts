import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/core/models/producto.model';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  subscription1 = new Subscription();
  subscription2 = new Subscription();
  subscription3 = new Subscription();
  subscription4 = new Subscription();

  productoForm: FormGroup;
  productos: Producto[] = [];

  productoActual: Producto = {} as any;
  productId: number = 0;

  constructor(private dataService: DataService, private fb: FormBuilder) {
    this.productoForm = fb.group({
      nombre: ['', [Validators.required]],
      stock: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getAll();

    this.subscription4 = this.dataService.productService
      .obtenerProducto$()
      .subscribe((data) => {
        this.productoActual = data;
        this.productoForm.patchValue({
          nombre: this.productoActual.nombre,
          stock: this.productoActual.stock,
        });
        this.productId = this.productoActual.id || 0;
      });
  }

  productFormSubmit() {
    if (this.productId === 0) {
      this.saveProducto();
    } else {
      this.updateProducto();
    }
  }

  saveProducto() {
    const producto: Producto = {
      id: 0,
      nombre: this.productoForm.get('nombre')?.value,
      stock: this.productoForm.get('stock')?.value,
    };

    this.subscription1 = this.dataService.productService
      .add(producto)
      .subscribe((data) => {
        console.log('Guardado');
        this.productoForm.reset();
        this.productId = 0;
        this.getAll();
      });
  }

  updateProducto() {
    const producto: Producto = {
      id: this.productoActual.id || 0,
      nombre: this.productoForm.get('nombre')?.value,
      stock: this.productoForm.get('stock')?.value,
    };

    this.subscription1 = this.dataService.productService
      .update(this.productId, producto)
      .subscribe((data) => {
        console.log('update');
        this.productoForm.reset();
        this.productId = 0;
        this.getAll();
      });
  }

  getAll() {
    this.subscription3 = this.dataService.productService.getAll().subscribe((data) => {
      console.log(data);
      this.productos = data;
    });
  }

  deleteProduct(id: number) {
    if (id === 0) {
      console.log('invalid');
      return;
    }

    if (confirm('Esta seguro de eliminar?')) {
      this.subscription2 = this.dataService.productService
        .delete(id)
        .subscribe((data) => {
          console.log('delete');
          this.getAll();
        });
    }
  }

  editProduct(product: Producto) {
    this.dataService.productService.actualizar(product);
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
  }
}
