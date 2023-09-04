export class ConnectorAlreadyConnectedError extends Error {
  override name = "ConnectorAlreadyConnectedError";
  override message = "Connector already connected";
}

export class ConnectorNotConnectedError extends Error {
  override name = "ConnectorNotConnectedError";
  override message = "Connector not connected";
}

export class ConnectorNotFoundError extends Error {
  override name = "ConnectorNotFoundError";
  override message = "Connector not found";
}

export class UserRejectedRequestError extends Error {
  override name = "UserRejectedRequestError";
  override message = "User rejected request";
}

export class UserNotConnectedError extends Error {
  override name = "UserNotConnectedError";
  override message = "User not connected";
}

export class UnsupportedAccountInterfaceError extends Error {
  override name = "UnsupportedAccountInterfaceError";
  override message =
    "Unsupported account interface. starknet-react v1 only supports the starknet.js v5 account interface";
}
