import * as types from '../../Utilities/types.bicep'
type StackData = types.StackData

@description('Specify deployment data')
param stackData StackData

@description('Gets or sets how the deployment script should be forced to execute even if the script resource has not changed. Can be current time stamp or a GUID.')
param forceUpdateTag string = utcNow('u')

@description('The name of a database')
param databaseName string = 'postgres'

@description('The login username of the database user')
param databaseAdminUser string = 'dbAdministrator'

@description('Secret name of the database admin password')
var databaseAdminPasswordSecretName = 'dbAdministratorPassword'

@description('Are we connecting with an adUser')
param isAdminAdUser bool = true

@description('Script display name')
param sqlScriptName string = ''

@description('Sql script to run')
param sqlScript string = ''

param environmentVariables EnvironmentVariable[] = []

resource deploymentScriptIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' existing = {
  name: stackData.deploymentScriptIdentityName
}

var databaseAdminUsername = isAdminAdUser ? stackData.deploymentScriptIdentityName : databaseAdminUser

var createSqlFile = [
  'cat > ./sqlScript.sql <<EOL'
  '${replace(sqlScript, '$$', '\\$\\$')}'
  'EOL'
]

var getPasswordCommand = isAdminAdUser
  ? 'az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken'
  : 'az keyvault secret show --name ${databaseAdminPasswordSecretName} --vault-name ${stackData.keyVaultName} --query value -o tsv'

var commands = [
  'az config set extension.use_dynamic_install=yes_without_prompt;'
  join(createSqlFile, '\n')
  'dbPassord=$(${getPasswordCommand})'
  'az postgres flexible-server execute --admin-password "$dbPassord" --admin-user $databaseAdminUsername --name $databaseServerName --database-name $databaseName --file-path "./sqlScript.sql"'
]

var environmentVariableStrings = map(environmentVariables, env => '${env.name}${env.value}')
var environmentVariableString = join(environmentVariableStrings, '_')

var RunDbScriptName = 'RunScript-${sqlScriptName}-${guid(sqlScript, databaseAdminUser, stackData.databaseServerName, databaseName, environmentVariableString)}'
resource RunDbScript 'Microsoft.Resources/deploymentScripts@2020-10-01' = {
  name: substring(RunDbScriptName, 0, min(63, length(RunDbScriptName)))
  location: stackData.location
  kind: 'AzureCLI'
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${deploymentScriptIdentity.id}': {}
    }
  }
  properties: {
    azCliVersion: '2.51.0'
    forceUpdateTag: forceUpdateTag
    retentionInterval: 'PT1H'
    cleanupPreference: 'Always'
    environmentVariables: concat(
      [
        {
          name: 'databaseAdminUsername'
          value: databaseAdminUsername
        }
        {
          name: 'databaseServerName'
          value: stackData.databaseServerName
        }
        {
          name: 'databaseName'
          value: databaseName
        }
      ],
      environmentVariables
    )
    scriptContent: join(commands, '\n')
  }
}

@export()
type EnvironmentVariable = {
  name: string
  value: string
}
