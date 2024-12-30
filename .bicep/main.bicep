// az deployment group create --mode Incremental --name testDeployemnt --resource-group tikamp-leveranse-rg --template-file main.bicep --parameters main.preprod.bicepparam
import * as types from 'Utilities/types.bicep'
type StackData = types.StackData

@allowed([
  'leveranse'
  'preprod'
  'prod'
])
@description('Specifies the environment of the function app.')
param environment string

@description('The location to deploy the keyvault. Default: same as resource group')
param location string = resourceGroup().location

@description('Should ip restrictions be disabled')
param disableIpRestrictions bool = false

@description('AdGruppen blir lagt til som en applikasjonsbruker i databasen')
param developerDbGroup string = ''

module stackDataModule 'Utilities/stackData.bicep' = {
  name: '${applicationBaseName}-stackData'
  params: {
    environment: environment
    location: location
  }
}

var stackData = stackDataModule.outputs.stackData

@description('Specifies the base name of the function app.')
param applicationBaseName string = 'tikamp'

module application 'ServiceApp/containerApiServiceApp.bicep' = {
  name: '${applicationBaseName}-application'
  params: {
    stackData: stackData
    applicationBaseName: applicationBaseName
    disableIpRestrictions: disableIpRestrictions
  }
}

module database 'Database/addDatabaseScope.bicep' = {
  name: '${applicationBaseName}-database'
  scope: resourceGroup()
  params: {
    stackData: stackData
  }
}

module createApplicationDbUser 'Database/DbAdUser/createApplicationDbAdUser.bicep' = {
  name: 'CreateApplicationUser_${applicationBaseName}'
  params: {
    stackData: stackData
    adUsername: application.outputs.applicationIdentityName
    adUserPrincipalId: application.outputs.applicationIdentityObjectid
    applicationDbName: database.outputs.databaseName
  }
}

module createDeveloperDbGroup 'Database/DbAdUser/createApplicationDbAdUser.bicep' = if (!empty(developerDbGroup)) {
  name: 'CreateApplicationUser_${developerDbGroup}'
  params: {
    stackData: stackData
    adUsername: developerDbGroup
    applicationDbName: database.outputs.databaseName
  }
}
