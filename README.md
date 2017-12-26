# angularjs2_primeng_extending_problem
This repo is to demonstrate problematic situation/behaviour with class extending

Also posted here https://forum.primefaces.org/viewtopic.php?p=162976#p162976

i think the reason can be in TypeScript itself but dont know how to formulate it proper.
Code of DynTable2Component which extends DynTable (exact copy of DataTable)

```
import { Component, OnInit , ChangeDetectorRef, ElementRef, IterableDiffers, NgZone, Renderer2, forwardRef, Input, Output, QueryList  } from '@angular/core';
import {ObjectUtils} from 'primeng/components/utils/objectutils'; //'../utils/objectutils';
import {DomHandler} from 'primeng/components/dom/domhandler';
import { Column } from 'primeng/components/common/shared';

import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import {  HttpResponse, HttpRequest,  HttpEvent,  HttpEventType, HttpErrorResponse } from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject'



import {DynTable} from '../dyn-table/dyn-table.component';

const DATATABLE_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DynTable2Component),
    multi: true
};

@Component({
  selector: 'app-dyn-table2',
  templateUrl: './dyn-table2.component.html',
  styleUrls: ['./dyn-table2.component.scss'],
  providers: [DATATABLE_VALUE_ACCESSOR, DomHandler, ObjectUtils, DynTable],
})
export class DynTable2Component extends DynTable {
    
    private subj_items = <BehaviorSubject<any[]>> new BehaviorSubject([]);
    items = this.subj_items.asObservable();
    
    data_items: any[];
    

    
    private _data_source: string;
    
    @Input() get dataSource(): string {
        return this._data_source;
    }
    
    set dataSource(ds) {
        this._data_source = ds;
    }

    constructor(private http: HttpClient, public el: ElementRef, public domHandler: DomHandler, public differs: IterableDiffers,
        public renderer: Renderer2, public changeDetector: ChangeDetectorRef, public objectUtils: ObjectUtils,
        public zone: NgZone) {
        super(el, domHandler, differs, renderer, changeDetector, objectUtils, zone);
        this.test_property = "MY PROPERTY";
    }

    ngOnInit() {
        super.ngOnInit();
        if (this._data_source.trim().length != 0) {
            this.loadData();
        }
        console.log(this);
    }
    
    loadData() {
        console.log("Loading " + this._data_source);
        this.http.get(this._data_source).subscribe(data => {
            this.reciveData(data);
        });
    }
    
    reciveData(data) {
           console.log(data);
           this.subj_items.next(<any[]>data);
           this.items.subscribe(data => {
                this.itemsSubscribe(data);
            });

    }
    
    itemsSubscribe(data) {
                console.log("SETTING NEW DATA");
                console.log(data); 
                this.data_items = Object.assign([], data); 
                this.cols = new QueryList<Column>();
                let temp = [];
                for (let propName in this.data_items[0]) {
                    temp.push(<Column>{field: propName, header: propName});
                }
                //this.cols =  <QueryList<Column>>(temp);
                this.columns = temp;
                this.value = this.data_items;
                console.log((<DynTable>(this)).isEmpty());

    }

}

```

If i locate same all this code in parent class DynTable - all works fine.
To reproduce problem I have added to parent class a property [b]test_property[/b] for maximual simplicity of test and i assign its value in child class DynTable2Component constructor
```
this.test_property = "MY PROPERTY";
```

In parent class DynTable there is a function isEmpty() where I added few console.log() things 

```
    isEmpty() {
        console.log(" isEmpty " + (!this.dataToRender||(this.dataToRender.length == 0)) );
        //console.log(this.isEmpty.caller);
        console.log(this._value);
        console.log(this);
        console.log("MY PROP == " + this.test_property);
        return !this.dataToRender||(this.dataToRender.length == 0);
    }
```

When isEmpty called from from DynTable2Component all console.log() contain proper values.
But it is also called from template of TableBody class ()

```
        <tr *ngIf="dt.isEmpty()" class="ui-widget-content ui-datatable-emptymessage-row" [style.visibility]="dt.loading ? 'hidden' : 'visible'">
            <td [attr.colspan]="dt.visibleColumns().length" class="ui-datatable-emptymessage">
                <span *ngIf="!dt.emptyMessageTemplate">{{dt.emptyMessage}}</span>
                <p-templateLoader [template]="dt.emptyMessageTemplate"></p-templateLoader>
            </td>
        </tr>
```

Which is linked this way 
```
export class TableBody {
    
    constructor(@Inject(forwardRef(() => DynTable)) public dt:DynTable) {}
    
    @Input("pTableBody") columns: Column[];
    
    @Input() data: any[];
    
    visibleColumns() {
        return this.columns ? this.columns.filter(c => !c.hidden): [];
    }
}
```
And in this context those console.log() show undefined or "" .
printscreen https://i.imgur.com/kP3DbLU.gif
