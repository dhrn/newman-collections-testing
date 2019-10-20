import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  collection: File;
  constructor(private _http: HttpClient) {

  }
  handleFileInput(file: FileList) {
    this.collection = file.item(0);
  }

  executeCollection() {
    console.log(this.collection);
    const formData = new FormData();
    formData.append('file', this.collection);
    this._http.post('http://localhost:3000/loadTest', formData).subscribe(
      (res) => {
        console.log(res)
      });
  }

}
