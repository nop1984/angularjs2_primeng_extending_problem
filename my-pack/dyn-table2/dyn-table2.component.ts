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
    
//    get value(): any[] {
//        return this._value;
//    }
//    
//    set value(val:any[]) {
//        if(this.immutable) {
//            this._value = val ? [...val] : null;
//            super.handleDataChange();
//        }
//        else {
//            this._value = val;
//        }
//        
//        this.valueChange.emit(this.value);
//    }
    
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
