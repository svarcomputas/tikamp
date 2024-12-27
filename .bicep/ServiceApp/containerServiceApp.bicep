//az deployment group create --mode Incremental --name testDeployemnt2 --resource-group Fam-UmaApi-leveranse-rg --template-file .\Rh.ProsessData\.bicep\main.bicep
import * as types from '../Utilities/types.bicep'
type StackData = types.StackData

@description('Specify deployment data')
param stackData StackData

@description('Specifies the base name of the function app.')
param applicationBaseName string

@description('List of allowed orgins for CORS')
param allowedOrigins array = []

@description('Extra appSettings')
param extraAppSettings object = {}

@description('List of appSettings to keep')
param appSettingsToKeep array = ['DOCKER_CUSTOM_IMAGE_NAME', 'WEBSITE_ENABLE_SYNC_UPDATE_SITE']

@description('Should ip restrictions be disabled')
param disableIpRestrictions bool = false

@description('Enables websockets')
param webSocketsEnabled bool = false

@description('true to enable client affinity; false to stop sending session affinity cookies, which route client requests in the same session to the same instance. Default is true.')
param clientAffinityEnabled bool = false

var applicationName = 'tikamp-${stackData.environment}-app'

resource containerRegistryIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' existing = {
  name: stackData.containerRegistryIdentityName
  scope: resourceGroup(stackData.infrastructureResourceGroup)
}

resource serverFarm 'Microsoft.Web/serverfarms@2023-12-01' existing = {
  name: stackData.appServicePlanName
  scope: resourceGroup(stackData.infrastructureResourceGroup)
}

resource application 'Microsoft.Web/sites@2023-12-01' = {
  name: applicationName
  location: stackData.location
  kind: 'app,linux,container'
  identity: {
    type: 'SystemAssigned, UserAssigned'
    userAssignedIdentities: {
      '${containerRegistryIdentity.id}': {}
    }
  }
  properties: {
    enabled: true
    serverFarmId: serverFarm.id
    clientAffinityEnabled: clientAffinityEnabled
    reserved: true
    scmSiteAlsoStopped: false
    httpsOnly: true
    isXenon: false
    hyperV: false
    redundancyMode: 'None'
    publicNetworkAccess: 'Enabled'
    storageAccountRequired: false
    keyVaultReferenceIdentity: 'SystemAssigned'
    hostNameSslStates: [
      {
        name: '${applicationName}.azurewebsites.net'
        sslState: 'Disabled'
        hostType: 'Standard'
      }
    ]
    siteConfig: {
      alwaysOn: false
      ftpsState: 'Disabled'
      logsDirectorySizeLimit: 35
      httpLoggingEnabled: false
      ipSecurityRestrictions: null
      ipSecurityRestrictionsDefaultAction: disableIpRestrictions ? 'Allow' : 'Deny'
      http20Enabled: true
      acrUseManagedIdentityCreds: true
      acrUserManagedIdentityID: containerRegistryIdentity.properties.clientId
      vnetRouteAllEnabled: true
      cors: {
        allowedOrigins: allowedOrigins
        supportCredentials: true
      }
      webSocketsEnabled: webSocketsEnabled
    }
  }

  resource appServiceConfig 'config@2023-12-01' = {
    name: 'logs'
    properties: {
      detailedErrorMessages: {
        enabled: true
      }

      failedRequestsTracing: {
        enabled: false
      }

      applicationLogs: {
        fileSystem: {
          level: 'Information'
        }
      }
      httpLogs: {
        fileSystem: {
          enabled: true
          retentionInDays: 4
          retentionInMb: 25
        }
      }
    }
  }
}

module appSettings './appsettings.bicep' = {
  name: '${applicationName}-appsettings'
  params: {
    webAppName: application.name
    currentAppSettings: list(resourceId('Microsoft.Web/sites/config', application.name, 'appsettings'), '2022-03-01').properties
    appSettings: extraAppSettings
    appSettingsToKeep: appSettingsToKeep
  }
}

module addPolicy './addKeyVaultPolicy.bicep' = {
  name: '${applicationBaseName}-keyVaultPolicy'
  scope: resourceGroup(stackData.infrastructureResourceGroup)
  params: {
    stackData: stackData
    principalId: application.identity.principalId
    tenantId: application.identity.tenantId
  }
}

output applicationName string = application.name
output applicationIdentityName string = application.name
output applicationIdentityObjectid string = application.identity.principalId
