import { Component, Inject, LOCALE_ID, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar';
import { map, tap } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-tab2',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CalendarPage implements OnInit {
  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };
  viewTitle: string;

  @ViewChild(CalendarComponent) calView: CalendarComponent;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private modalController: ModalController,
    public gs: GlobalService
  ) { }

  currentModal?: HTMLIonModalElement = null;


  next() {
    this.calView.slideNext();
  }

  back() {
    this.calView.slidePrev();
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  backToCurrent() {
    this.calView.currentDate = new Date();
  }

  eventSelected(event) {

  }

  onCurrentDateChanged($event) {
  }
  reloadSource(startTime, endTime) {}
  onEventSelected($event) {}

  ngOnInit() {
  }

}