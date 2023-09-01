
// NATIVE MODULES

import { NgModule } from '@angular/core';

// PRIMENG MODULES

import { TableModule } from 'primeng/table';
import {PickListModule} from 'primeng/picklist';
import { SliderModule } from 'primeng/slider';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import {ContextMenuModule} from 'primeng/contextmenu';
import { RatingModule } from 'primeng/rating';
import { ProgressBarModule } from 'primeng/progressbar';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { DialogService } from 'primeng/dynamicdialog';
import {ConfirmationService} from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import {CalendarModule} from 'primeng/calendar';
import {FileUploadModule} from 'primeng/fileupload';
import {MenuModule} from 'primeng/menu';
import { MessageService} from 'primeng/api';
import {PanelModule} from 'primeng/panel';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {AccordionModule} from 'primeng/accordion';
import {TooltipModule} from 'primeng/tooltip';
import {GalleriaModule} from 'primeng/galleria';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import {InputSwitchModule} from 'primeng/inputswitch';
import {EditorModule} from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import {CheckboxModule} from 'primeng/checkbox';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {ListboxModule} from 'primeng/listbox';
import {SidebarModule} from 'primeng/sidebar';
import {SelectButtonModule} from 'primeng/selectbutton';
import {RadioButtonModule} from 'primeng/radiobutton';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {KeyFilterModule} from 'primeng/keyfilter';
import {InputMaskModule} from 'primeng/inputmask';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {SplitButtonModule} from 'primeng/splitbutton';
import {TreeModule} from 'primeng/tree';
import {ColorPickerModule} from 'primeng/colorpicker';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {SlideMenuModule} from 'primeng/slidemenu';
import {ChartModule} from 'primeng/chart';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {TimelineModule} from 'primeng/timeline';
import {CardModule} from 'primeng/card';
import {SplitterModule} from 'primeng/splitter';
import {TriStateCheckboxModule} from 'primeng/tristatecheckbox';
import {OrderListModule} from 'primeng/orderlist';
import {BadgeModule} from 'primeng/badge';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputNumberModule } from 'primeng/inputnumber';
import { StepsModule } from 'primeng/steps';


@NgModule({
  declarations: [
    
  ],
  imports: [
	TableModule,
	SliderModule,
	DropdownModule,
	InputTextModule,
	MultiSelectModule,
	RatingModule,
	ProgressBarModule,
	TabViewModule,
	FormsModule,
	DialogModule,
	ToastModule,
	ConfirmDialogModule,
	CalendarModule,
	MenuModule,
	FileUploadModule,
	PanelModule,
	AutoCompleteModule,
	AccordionModule,
	TooltipModule,
	GalleriaModule,
	InputTextareaModule,
	PasswordModule,
	InputSwitchModule,
	EditorModule,
	CheckboxModule,
	ToggleButtonModule,
	ConfirmPopupModule,
	ListboxModule,
	SidebarModule,
	SelectButtonModule,
	ReactiveFormsModule ,
	RadioButtonModule,
	OverlayPanelModule,
	KeyFilterModule,
	InputMaskModule,
	DynamicDialogModule,
	SplitButtonModule,
	TreeModule,
	ColorPickerModule,
	ContextMenuModule,
	TieredMenuModule,
	SlideMenuModule,
	ChartModule,
	ScrollPanelModule,
	TimelineModule,
	CardModule,
	SplitterModule,
	PickListModule,
	TriStateCheckboxModule,
	OrderListModule,
	BadgeModule,
	ProgressSpinnerModule,
	SkeletonModule,
	InputNumberModule,
	StepsModule
  ],
  exports : [
	TableModule,
	SliderModule,
	DropdownModule,
	InputTextModule,
	MultiSelectModule,
	RatingModule,
	ProgressBarModule,
	TabViewModule,
	FormsModule,
	DialogModule,
	ToastModule,
	ConfirmDialogModule,
	CalendarModule,
	MenuModule,
	ConfirmPopupModule,
	FileUploadModule,
	PasswordModule,
	PanelModule,
	AutoCompleteModule,
	AccordionModule,
	TooltipModule,
	GalleriaModule,
	InputTextareaModule,
	InputSwitchModule,
	EditorModule,
	CheckboxModule,
	ToggleButtonModule,
	ListboxModule,
	SidebarModule,
	SelectButtonModule,
	ReactiveFormsModule ,
	RadioButtonModule,
	OverlayPanelModule,
	KeyFilterModule,
	InputMaskModule,
	DynamicDialogModule,
	SplitButtonModule,
	TreeModule,
	ColorPickerModule,
	ContextMenuModule,
	TieredMenuModule,
	SlideMenuModule,
	ChartModule,
	ScrollPanelModule,
	TimelineModule,
	CardModule,
	SplitterModule,
	PickListModule,
	TriStateCheckboxModule,
	OrderListModule,
	BadgeModule,
	ProgressSpinnerModule,
	SkeletonModule,
	InputNumberModule,
	StepsModule

  ],
  providers: [
    MessageService,
    ConfirmationService,
    DialogService,
  ]
})
export class PrimengModule { }
