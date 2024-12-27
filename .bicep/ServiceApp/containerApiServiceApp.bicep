import * as types from '../Utilities/types.bicep'
type StackData = types.StackData

@description('Specify deployment data')
param stackData StackData

@description('Specifies the base name of the function app.')
param applicationBaseName string

@description('List of allowed orgins for CORS')
param allowedOrigins array = []

@description('List of extra appSettings')
param extraAppSettings object = {}

@description('Should ip restrictions be disabled')
param disableIpRestrictions bool = false

@description('true to enable client affinity; false to stop sending session affinity cookies, which route client requests in the same session to the same instance. Default is true.')
param clientAffinityEnabled bool = false

@description('Enables websockets')
param webSocketsEnabled bool = false

module application './containerServiceApp.bicep' = {
  name: '${applicationBaseName}-api-application'
  params: {
    stackData: stackData
    applicationBaseName: applicationBaseName
    allowedOrigins: allowedOrigins
    disableIpRestrictions: disableIpRestrictions
    extraAppSettings: union(extraAppSettings, {
      ASPNETCORE_ENVIRONMENT: toLower(stackData.environment)
      WEBSITE_SWAP_WARMUP_PING_PATH: '/api/ping'
      WEBSITE_SWAP_WARMUP_PING_STATUSES: '200'
      WEBSITE_WARMUP_PATH: '/api/ping'
      WEBSITE_SLOT_NUMBER_OF_TIMEOUTS_BEFORE_RESTART: 1
      WEBSITE_SLOT_MAX_NUMBER_OF_TIMEOUTS: 3
    })
    appSettingsToKeep: ['DOCKER_CUSTOM_IMAGE_NAME', 'WEBSITE_ENABLE_SYNC_UPDATE_SITE']
    webSocketsEnabled: webSocketsEnabled
    clientAffinityEnabled: clientAffinityEnabled
  }
}

output applicationName string = application.outputs.applicationName
output applicationIdentityName string = application.outputs.applicationIdentityName
output applicationIdentityObjectid string = application.outputs.applicationIdentityObjectid
