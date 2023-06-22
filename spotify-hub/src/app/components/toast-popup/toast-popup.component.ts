import { Component, OnInit } from '@angular/core';
import { ToastQueueService } from '../../services/toast-queue.service';
import { Toast } from '../../interfaces/toast.interface';

@Component({
    selector: 'app-toast',
    templateUrl: './toast-popup.component.html',
    styleUrls: ['./toast-popup.component.scss']
})
export class ToastPopupComponent implements OnInit {
    toastQueue: Toast[] = [];

    constructor(private toastQueueService: ToastQueueService) { }

    ngOnInit() {
        this.toastQueue = this.toastQueueService.getToastQueue();
    }

    dismissToast(toastId: number): void {
        this.toastQueueService.dequeueToastById(toastId);
    }
}
