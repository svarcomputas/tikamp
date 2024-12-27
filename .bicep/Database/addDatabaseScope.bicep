import * as types from '../Utilities/types.bicep'
type StackData = types.StackData

@description('Specify deployment data')
param stackData StackData

module database 'addDatabase.bicep' = {
  name: '${stackData.databaseBaseName}-database-scope'
  scope: resourceGroup(stackData.infrastructureResourceGroup)
  params: {
    stackData: stackData
  }
}

output databaseServerName string = database.outputs.databaseServerName
output databaseName string = database.outputs.databaseName
