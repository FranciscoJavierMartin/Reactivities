import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  @Input() content: string;
  @Input() inverted: boolean;
  
  constructor() { }

  ngOnInit(): void {
  }

}
