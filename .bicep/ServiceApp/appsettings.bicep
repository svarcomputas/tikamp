param webAppName string
param appSettings object
param currentAppSettings object
param appSettingsToKeep array = []

resource webApp 'Microsoft.Web/sites@2023-12-01' existing = {
  name: webAppName
}

var currentAppSettingsArray = [for (item, i) in items(currentAppSettings): contains(appSettingsToKeep, item.key) ? item : []]
var filteredCurrentAppSettingsArray = intersection(currentAppSettingsArray, items(currentAppSettings))
var filteredCurrentAppSettings = toObject(filteredCurrentAppSettingsArray, entry => entry.key, entry => entry.value)

resource siteconfig 'Microsoft.Web/sites/config@2023-12-01' = {
  parent: webApp
  name: 'appsettings'
  properties: union(filteredCurrentAppSettings, appSettings)
}
