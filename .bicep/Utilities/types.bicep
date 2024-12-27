@export()
type Environment = 'preprod' | 'prod'

@export()
type StackData = {
  @description('Specifies the environment of the function app.')
  environment: Environment

  @description('Server name of the database')
  databaseServerName: string

  @description('Base name of the database')
  databaseBaseName: string

  @description('Infrastructure resourceGroup')
  infrastructureResourceGroup: string

  @description('The location to deploy the resource')
  location: string
  
  @description('Name of the key vault')
  keyVaultName: string

  @description('Name of the deployment managed identity')
  deploymentScriptIdentityName: string

  @description('Identity with access to pull from container registry')
  containerRegistryIdentityName: string

  @description('Application service plan name')
  appServicePlanName: string

  @description('Base name of the service apps')
  serviceAppBaseName: string
  
  @description('Computas tenant id')
  computasTenantId: string
}
