import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {PaginatorModule} from 'primeng/components/paginator/paginator';
import { Column, HeaderColumnGroup, FooterColumnGroup, PrimeTemplate } from 'primeng/components/common/shared';
import {DataTable, DomHandler, Header} from 'primeng/primeng';

import {SharedModule} from 'primeng/components/common/shared' ;//'../common/shared';
import {FormsModule} from '@angular/forms'

import {DynTable, DTRadioButton, DTCheckbox, ColumnHeaders, ColumnFooters, TableBody, ScrollableView, RowExpansionLoader } from './dyn-table/dyn-table.component';
import { DynTable2Component } from './dyn-table2/dyn-table2.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PaginatorModule,
    FormsModule
  ],
  exports: [DynTable, DynTable2Component],
  declarations: [DynTable,DTRadioButton,DTCheckbox,ColumnHeaders,ColumnFooters,TableBody,ScrollableView,RowExpansionLoader, DynTable2Component]
})
export class MyPackModule { }
