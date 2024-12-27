import * as types from 'types.bicep'
type StackData = types.StackData
type Environment = types.Environment

@description('Specifies the environment of the function app.')
param environment string

@description('Specifies the location of the resources, defualts to resource groups location.')
param location string = resourceGroup().location

output stackData StackData = {
  environment: environment
  databaseServerName: 'tikamp-dbserver'
  databaseBaseName: 'tikampdb'
  infrastructureResourceGroup: 'tikamp-infrastruktur-rg'
  location: location
  keyVaultName: 'tikamp-kv'
  containerRegistryIdentityName: 'tikamp-container-registries-identity'
  deploymentScriptIdentityName: 'tikamp-deployment-script-identity'
  appServicePlanName: 'tikamp-sp'
  serviceAppBaseName: 'tikamp'
  computasTenantId: '945fa749-c3d6-4e3d-a28a-283934e3cabd'
}
