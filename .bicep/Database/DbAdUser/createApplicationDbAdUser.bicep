import * as types from '../../Utilities/types.bicep'
type StackData = types.StackData

@description('Specify deployment data')
param stackData StackData

@description('Ad Username')
param adUsername string

@description('Ad Username')
param adUserPrincipalId string = ''

@description('Name of ApplicationDb')
param applicationDbName string

var createDbUserName = 'CreateAdUser_${adUsername}_${guid(applicationDbName, adUsername)}'
module createDbUser './runDatabaseScript.bicep' = {
  name: substring(createDbUserName, 0, min(63, length(createDbUserName)))
  scope: resourceGroup(stackData.infrastructureResourceGroup)
  params: {
    stackData: stackData
    databaseName: 'postgres'
    sqlScriptName: 'CreateAdUser_${applicationDbName}'
    sqlScript: loadTextContent('./create-aduser.sql')
    environmentVariables: [
      {
        name: 'applicationDbAdUser'
        value: adUsername
      }
      {
        name: 'applicationDbAdUserPrincipalId'
        value: adUserPrincipalId
      }
    ]
  }
}

var grantDbUserPermissionsName = 'GrantDbUserPerms_${adUsername}_${guid(applicationDbName, adUsername)}'
module createDbUserPermissions './runDatabaseScript.bicep' = {
  name: substring(grantDbUserPermissionsName, 0, min(63, length(grantDbUserPermissionsName)))
  scope: resourceGroup(stackData.infrastructureResourceGroup)
  params: {
    stackData: stackData
    databaseName: applicationDbName
    sqlScriptName: 'GrantDbUserPerms'
    isAdminAdUser: false
    sqlScript: loadTextContent('./grant-permission-to-user.sql')
    environmentVariables: [
      {
        name: 'applicationDbName'
        value: applicationDbName
      }
      {
        name: 'applicationDbAdUser'
        value: adUsername
      }
    ]
  }
  dependsOn: [createDbUser]
}
