import { LightningElement, api } from 'lwc';

export default class LtngRecordEditFormChild extends LightningElement {

    @api recordId;
    @api objectApiName;
    @api fields;
    @api sectionTitle;
    @api sectionsMap;

    connectedCallback() {

    }

    handleEditFormCancel() {
        this.dispatchEvent(
            // Default values for bubbles and composed are false.
            new CustomEvent('modechange')
        );
    }

    handleSuccess() {
        this.dispatchEvent(
            // Default values for bubbles and composed are false.
            new CustomEvent('modechange')
        );
    }
}