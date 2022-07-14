/**
 * This component mimics the functionality offered by Details tab in Salesforce LEX to view and edit a record.
 * This component can be leveraged to pull in fields from a field set specified in the component's configuration parameters.
 * Also the fields can be specified in a comma separated format in the component's configuration parameters.
 */
 import { LightningElement, track, api, wire } from 'lwc';
 import { getRecord } from 'lightning/uiRecordApi';
 import { getFieldsetFields } from 'c/metadataService';
 
 export default class LtngRelatedRecordForm extends LightningElement {
 
     @api recordId;
     @api objectApiName;
 
     @api relatedObjectApiName;
     @api relatedFieldApiName;
     @api relatedRecordId;
     @api selectedFieldset;
 
     @api additionalFields;
     @api enableInlineEdit;
     @api enableReadOnly;
     @api sectionTitle;
     @api masterTitle;
     @api iconName;
     @api actionInHeader;
     @api actionInFooter;
 
     @track editForm = false;
     @track viewForm = false;
     @track showLoading = false;
     @track badConfigMessage;
     fieldsToQuery = [];
 
     @wire(getRecord, {
         recordId: '$recordId', fields: '$fieldsToQuery'
     })
     wiredRecord({ error, data }) {
         debugger;
         if (data) {
             this.relatedRecordId = data.fields[this.relatedFieldApiName].value;
             this.error = undefined;
         } else if (error) {
             this.error = error;
             this.relatedRecordId = undefined;
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
 
     @track fields = [];
 
     get _fldApiName() {
         return this.objectApiName + '.' + this.relatedFieldApiName;
     }
 
     /**
      * Invoked when this component is inserted into DOM
      */
     connectedCallback() {
 
         debugger;
 
         this.fieldsToQuery = [this._fldApiName];
 
         this.viewForm = true;
 
         // if user has provided the field set name
         if(this.selectedFieldset) {
             this.showLoading = true;
             this.getFieldsetInfo(this.relatedObjectApiName, this.selectedFieldset);
         }
 
         // if user has provided additional fields
         if(this.additionalFields) {
             this.configureRecordFormFields(this.additionalFields);
         }
 
         if(!this.actionInHeader && !this.actionInFooter && !this.enableInlineEdit) {
             this.actionInHeader = true;
         }
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
             else if(values !== undefined && values !== '' && values.includes(',')) { // values is comma separated list for this.additionalFields
                 fldArr = values.split(',');
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
      * Retrives a list of fields in the given field set on a given object
      * @param {*} objApiName - API name of the current object in context
      * @param {*} fieldset - API name of the field set on current object in context
      */
     async getFieldsetInfo(objApiName, fieldset) {
         let response = await getFieldsetFields(objApiName, fieldset);
         if(response && response.hasOwnProperty('ok') && !response.ok) {
             //error handling
             this.badConfigMessage = 'The component encountered an unexpected error. Please double check the configuration and try again. If the issue still persists, contact the support team.'
         }
         else if(response) {
             this.fieldsetFields = response;
         }
 
         this.showLoading = false;
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