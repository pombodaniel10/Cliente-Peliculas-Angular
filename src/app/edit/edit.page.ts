import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Pelicula } from '../pelicula';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  peliculaForm: FormGroup;
  _id:any='';
  titulo:string='';
  fechaLanzamiento:Date=null;
  genero:string='';
  precio:number=null;
  
  constructor(public api: ApiService,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder) {
  }

  async buscarPelicula(id) {
    if(this.route.snapshot.paramMap.get('id') == 'null') {
      this.presentAlertConfirm('You are not choosing an item from the list');
    } else {
      const loading = await this.loadingController.create({
        message: 'Loading...'
      });
      await loading.present();
      await this.api.buscarPelicula(id)
        .subscribe(data => {
          this._id = data._id;
          this.peliculaForm.setValue({
            titulo: data.titulo,
            fechaLanzamiento: data.fechaLanzamiento,
            genero:data.genero,
            precio: data.precio
          });
          this.titulo = data.titulo;
          this.fechaLanzamiento = data.fechaLanzamiento;
          this.genero = data.genero;
          this.precio = data.precio;
          loading.dismiss();
        }, err => {
          console.log(err);
          loading.dismiss();
        });
    }
  }

  ngOnInit() {
    this.buscarPelicula(this.route.snapshot.params['id']);
    this.peliculaForm = this.formBuilder.group({
      'titulo' : [null, Validators.required],
      'fechaLanzamiento' : [null, Validators.required],
      'genero' : [null, Validators.required],
      'precio' : [null, Validators.required]
    });
  }

  async onFormSubmit(form:NgForm) {
    await this.api.editarPelicula(this._id, form)
      .subscribe(res => {
          let id = res['_id'];
          var myurl = `${'/tabs/details'}/${id}`;
          this.router.navigateByUrl(myurl);
        }, (err) => {
          console.log(err);
        }
      );
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

  

}
