public with sharing class getObjectDetail {

    @AuraEnabled(cacheable=false)
    public static Map<String,Object> getRecordDetail(Id recordId) {
        Map<String,Object> returnMap = new Map<String,Object>();
        String objectName = recordId.getSObjectType().getDescribe().getName();
        String objectLabel = recordId.getSObjectType().getDescribe().getLabel();
        returnMap.put('objectName',objectName);
        returnMap.put('objectLabel',objectLabel);
        if (objectName == 'Account') {
            Account acc = [SELECT Id, Name, Phone, AccountNumber, AnnualRevenue,Sic FROM Account WHERE Id =: recordId];
            returnMap.put('records',acc);
        } else {
            String query = 'SELECT Id, Name FROM ' + objectName + ' WHERE Id=: recordId';
            SObject record = Database.query(query);
            returnMap.put('records',record);
        }
       
        return returnMap;
    }

}
