import { LightningElement, api } from 'lwc';

export default class LtngRecordViewFormChild extends LightningElement {

    @api recordId;
    @api fields;
    @api objectApiName;
    @api enableInlineEdit;
    @api enableReadOnly;
    @api sectionTitle;
    @api sectionsMap = [{title: 'First', fields: ['Name', 'Amount']}, {title: 'Second', fields: ['StageName', 'CloseDate']}]; // [{title: abc, fields: ['def__c', 'xyz__c']}]


    /**
     * On click handler for the inline edit buttons on the form
     */
    handleInlineEdit() {
        this.dispatchEvent(
            // Default values for bubbles and composed are false.
            new CustomEvent('modechange')
        );
    }
}