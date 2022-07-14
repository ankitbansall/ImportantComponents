public with sharing class GeneralUtil {
    // Returns map of field set label to list of field set fields
    @AuraEnabled(cacheable=true)
    public static Map<String, List<String>> getFieldsetFieldsMap(String sObjectName, String fldsets){

        if(String.isBlank(sObjectName) || String.isBlank(fldsets)) {
            return null;
        }

        List<String> lstFieldsets;
        fldsets = fldsets.replaceAll(' ', '');
        if(fldsets.contains(',')) {
            lstFieldsets = fldsets.split(',');
        }
        else {
            lstFieldsets = new List<String> {fldsets};
        }

        Map<String, List<String>> mapFldsetToFields = new Map<String, List<String>>();

        DescribeSObjectResult[] describes = Schema.describeSObjects(new String[] { sObjectName });

        if (describes != null && describes.size() > 0) {
            List<String> fields;
            for(String fldset: lstFieldsets) {
                // There should only be the one match for the one object type name
                Schema.FieldSet fieldSet = describes[0].fieldSets.getMap().get(fldset);
                if(fieldSet != null) {
                    fields = new List<String>();
                    for(Schema.FieldSetMember fsm: fieldSet.getFields()) {
                        fields.add(fsm.getFieldPath());
                    }

                    mapFldsetToFields.put(fieldSet.getName(), fields);
                }
            }
        }

        return mapFldsetToFields;
    }
}
