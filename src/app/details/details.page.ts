import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Pelicula } from '../pelicula';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  pelicula:Pelicula = { _id: null, titulo: '', fechaLanzamiento: null, genero: 'null', precio: null };

  constructor(public api: ApiService,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public route: ActivatedRoute,
    public router: Router) {}

  async buscarPelicula() {
    if(this.route.snapshot.paramMap.get('id') == 'null') {
      this.presentAlertConfirm('No está escogiendo algun elemento de la lista');
    } else {
      const loading = await this.loadingController.create({
        message: 'Cargando...'
      });
      await loading.present();
      await this.api.buscarPelicula(this.route.snapshot.paramMap.get('id'))
        .subscribe(res => {
          console.log(res);
          this.pelicula = res;
          loading.dismiss();
        }, err => {
          console.log(err);
          loading.dismiss();
        });
    }
  }

  async presentAlertConfirm(msg: string) {
    const alert = await this.alertController.create({
      header: 'Warning!',
      message: msg,
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            this.router.navigate(['']);
          }
        }
      ]
    });
  
    await alert.present();
  }

  ngOnInit() {
    this.buscarPelicula();
  }

  async eliminar(id) {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();
    await this.api.eliminarPelicula(id)
      .subscribe(res => {
        loading.dismiss();
        this.router.navigateByUrl("/tabs/home");
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

}
