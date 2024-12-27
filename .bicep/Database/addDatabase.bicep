import * as types from '../Utilities/types.bicep'
type StackData = types.StackData

@description('Specify deployment data')
param stackData StackData

var databaseServerName = stackData.databaseServerName
var databaseName = '${stackData.databaseBaseName}${stackData.environment}'

resource db 'Microsoft.DBforPostgreSQL/flexibleServers@2022-12-01' existing = {
  name: databaseServerName
}

resource database 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2022-12-01' = {
  name: databaseName
  parent: db
  properties: {
    charset: 'UTF8'
  }
}

output databaseServerName string = databaseServerName
output databaseName string = databaseName
