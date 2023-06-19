export class ConnectorAlreadyConnectedError extends Error {
  name = 'ConnectorAlreadyConnectedError'
  message = 'Connector already connected'
}

export class ConnectorNotConnectedError extends Error {
  name = 'ConnectorNotConnectedError'
  message = 'Connector not connected'
}

export class ConnectorNotFoundError extends Error {
  name = 'ConnectorNotFoundError'
  message = 'Connector not found'
}

export class UserRejectedRequestError extends Error {
  name = 'UserRejectedRequestError'
  message = 'User rejected request'
}

export class UserNotConnectedError extends Error {
  name = 'UserNotConnectedError'
  message = 'User not connected'
}

export class UnsupportedAccountInterfaceError extends Error {
  name = 'UnsupportedAccountInterfaceError'
  message =
    'Unsupported account interface. starknet-react v1 only supports the starknet.js v5 account interface'
}
