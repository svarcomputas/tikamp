import * as types from '../Utilities/types.bicep'
type StackData = types.StackData

@description('Specify deployment infrastucture data')
param stackData StackData

param tenantId string = stackData.computasTenantId
param principalId string

@allowed([ 'all', 'backup', 'delete', 'get', 'list', 'purge', 'recover', 'restore', 'set' ])
param secretPermissions string[] = [
  'get'
  'list'
]

@allowed([ 'all', 'backup', 'create', 'delete', 'deleteissuers', 'get', 'getissuers', 'import', 'list', 'listissuers', 'managecontacts', 'manageissuers', 'purge', 'recover', 'restore', 'setissuers', 'update' ])
param certificatesPermissions string[] = [
  'get'
  'list'
]

resource keyVault 'Microsoft.KeyVault/vaults@2023-02-01' existing = {
  name: stackData.keyVaultName
}

resource keyVaultAccessPolicy 'Microsoft.KeyVault/vaults/accessPolicies@2023-02-01' = {
  parent: keyVault
  name: 'add'
  properties: {
    accessPolicies: [
      {
        tenantId: tenantId
        objectId: principalId
        permissions: {
          secrets: secretPermissions
          certificates: certificatesPermissions
        }
      }
    ]
  }
}
