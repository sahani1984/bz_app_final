import { Component, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
@Component({
    selector: 'baseComponent',
    template: 'no-ui'
})
export abstract class SubscribedContainer implements OnDestroy {
    destroyed$ = new Subject<void>();
    /**
     * DO NOT this.destroyed$.complete();
     * It is not necessary:
     * https://stackoverflow.com/questions/44289859/do-i-need-to-complete-a-subject-for-it-to-be-garbage-collected
     */
    ngOnDestroy(): void {
      //  console.log('test unsubscribe')
      this.destroyed$.next();
    }
  }