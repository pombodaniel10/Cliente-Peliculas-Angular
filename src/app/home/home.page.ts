import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Pelicula } from '../pelicula';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  peliculas: Pelicula[] = [];

  constructor(public api: ApiService,
    public loadingController: LoadingController,
    public router: Router,
    public route: ActivatedRoute) { }
  
  async getProducts() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();
    await this.api.listaPeliculas()
     .subscribe(res => {
        this.peliculas = res;
        console.log(this.peliculas);
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
        });
  }
  

  ngOnInit() {
    this.getProducts();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.peliculas, event.previousIndex, event.currentIndex);
  }

}
