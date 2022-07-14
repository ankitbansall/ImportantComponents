 import { LightningElement, track, api } from 'lwc';
 import {  getFieldsetFieldsMap } from 'c/metadataService';
 
 export default class LtngMultiSectionRecordForm extends LightningElement {
 
     @api recordId;
     @api objectApiName;
 
     @api enableInlineEdit;
     @api enableReadOnly;
     @api actionInHeader;
     @api actionInFooter;
 
     @track editForm = false;
     @track viewForm = false;
     @track showLoading = false;
     @track badConfigMessage;
     @track sectionsMap;
 
     pageConfigMap = []; // map of section title to field set name. this map is derived from sectionToFieldsetMap value provided by user in the component config
     fieldsetList = ''; // list of field set API names derived from sectionToFieldsetMap value provided by user in the component config
 
     @api
     get sectionToFieldsetMap() {
         return this._sectionToFieldsetMap;
     }
 
     set sectionToFieldsetMap(value) {
         this._sectionToFieldsetMap = value;
 
         if(this._sectionToFieldsetMap) {
             let configMap = [];
             let arr = this._sectionToFieldsetMap.split(',');
             // eslint-disable-next-line guard-for-in
             for(let i in arr) {
                 let item = { title: '', fieldset: ''};
                 item.title = arr[i].split(':')[0];
                 let fieldsetApiName = arr[i].split(':')[1];
                 if(fieldsetApiName) {
                     item.fieldset = fieldsetApiName.trim();
                 }
                 this.fieldsetList += ',' + item.fieldset;
                 configMap.push(item);
             }
             this.pageConfigMap = configMap; // use this later
         }
     }
 
     get fieldsetFieldsMap() {
         return this._fieldsetFieldsMap;
     }
 
     set fieldsetFieldsMap(value) {
         this._fieldsetFieldsMap = value;
 
         if(this._fieldsetFieldsMap) {
             let sectionsMap = [];
 
             // eslint-disable-next-line guard-for-in
             Object.keys(this._fieldsetFieldsMap).forEach((element, index) => {
                 let sectionTitle = element;
                 // get section name from this.pageConfigMap
                 for(let i in this.pageConfigMap) {
                     if(this.pageConfigMap[i].fieldset === element) {
                         sectionTitle = this.pageConfigMap[i].title;
                         break;
                     }
                 }
                 let section = {title: sectionTitle, fields: this._fieldsetFieldsMap[element]};
                 sectionsMap.push(section);
             });
 
             this.sectionsMap = sectionsMap;
         }
     }
 
     get fieldsetFields() {
         return this._fieldsetFields;
     }
 
     set fieldsetFields(value) {
         if(value) {
             this._fieldsetFields = value;
             // Add the field set fields to this.fields once the list of fields from field set are available to this component
             this.configureRecordFormFields(this._fieldsetFields);
         }
     }
 
     @track fields;
 
     /**
      * Invoked when this component is inserted into DOM
      */
     connectedCallback() {
 
         this.viewForm = true;
 
         // if user has provided the field set name
         if(this.fieldsetList) {
             this.showLoading = true;
             // get list of field set's fields
             this.getFieldsetInfoMap(this.objectApiName, this.fieldsetList);
         }
 
         if(!this.actionInHeader && !this.actionInFooter && !this.enableInlineEdit) {
             this.actionInHeader = true;
         }
     }
 
 
     async getFieldsetInfoMap(objectApiName, fieldset) {
         let response = await getFieldsetFieldsMap(objectApiName, fieldset);
         if(response && response.hasOwnProperty('ok') && !response.ok) {
             //error handling
             this.badConfigMessage = 'The component encountered an unexpected error. Please double check the configuration and try again. If the issue still persists, contact the support team.'
         }
         else if(response) {
             this.fieldsetFieldsMap = response;// set respose in tracked property
         }
 
         this.showLoading = false;
     }
 
     /**
      *
      * @param {string}  values - one or more field api names separated by comma
      */
     configureRecordFormFields(values) {
 
         if(values) {
             let fldArr;
             if(Array.isArray(values)) { // values is array for fields from field set
                 fldArr = values;
             }
             if(!this.fields) {
                 this.fields = [];
             }
             if(Array.isArray(fldArr)) {
 
                 for(let i in fldArr) {
                     if(!this.fields.includes(fldArr[i])) {
                         this.fields.push(fldArr[i].trim());
                     }
                 }
             }
             else if(!this.fields.includes(values)) {
                 this.fields.push(values.trim());
             }
         }
 
     }
 
     /**
      * On click handler for the inline edit buttons on the form
      */
     handleInlineEdit() {
         this.switchToEditMode();
     }
 
     /**
      * On click handler for the Cancel button on the form. This switches the form back to read-only mode
      */
     handleEditFormCancel() {
         this.switchToViewMode();
     }
 
     /**
      * Success handler for the form Submit event. It is invoked when data is successfully updated on server side. This switches the form back to read-only mode
      */
     handleSuccess() {
         this.switchToViewMode();
     }
 
     switchToEditMode() {
         this.editForm = true;
         this.viewForm = false;
     }
 
     switchToViewMode() {
         this.editForm = false;
         this.viewForm = true;
     }
 }