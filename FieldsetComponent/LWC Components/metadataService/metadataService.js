import { LightningElement } from 'lwc';
import getFieldsetInfoMap from "@salesforce/apex/GeneralUtil.getFieldsetFieldsMap";

const getFieldsetFieldsMap = (objApiName, fieldsets) => {

    return new Promise(resolve => {

        getFieldsetInfoMap({sObjectName: objApiName, fldsets: fieldsets})
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            resolve(error);
        });
    })
}

export { getFieldsetFieldsMap};