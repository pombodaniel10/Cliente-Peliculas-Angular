import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Pelicula } from '../pelicula';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

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

  ngOnInit() {
    this.peliculaForm = this.formBuilder.group({
      'titulo' : [null, Validators.required],
      'fechaLanzamiento' : [null, Validators.required],
      'genero' : [null, Validators.required],
      'precio' : [null, Validators.required]
    });
  }

  async onFormSubmit(form:NgForm) {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();
    await this.api.añadirPelicula(form)
      .subscribe(res => {
          let id = res['_id'];
          loading.dismiss();
          console.log(this.router);
          location.reload();
          this.router.navigateByUrl("/tabs/home");
        }, (err) => {
          console.log(err);
          loading.dismiss();
        });
  }

}
