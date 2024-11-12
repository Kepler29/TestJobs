import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  currentUserSubject: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);

  constructor(private serviceAuth: AuthService, private service: DataService){
    const currentUser = this.serviceAuth.currentUserValue;
    if (currentUser) {
      this.currentUserSubject.next(currentUser);
    }
    this.getdata();
  }

  selectedFile: File | null = null;
  csvData: any[] = [];

  getdata(){
    this.service.show().subscribe( response => {
      this.csvData = response.data;
    });
  }


  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadCSV() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      console.log(formData.get('file'))
      this.service.import(formData).subscribe( response => {
        console.log(response);
        this.getdata();
      });
    }
  }

}
