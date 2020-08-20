import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../../services/activity/activity.service';
@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  listActivityElearning: any;
  constructor(private activityService: ActivityService) {
    this.activityService.layDanhSachActivityElearning().subscribe(
      res => {
        this.listActivityElearning = res.data;
      }
    )
  }

  ngOnInit(): void {
  }

}
