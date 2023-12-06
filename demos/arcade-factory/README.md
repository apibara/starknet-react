# Arcade factory

This demo is a Cairo contract allowing [arcade account](https://github.com/BibliothecaDAO/arcade-account) deployment, funding and configuration in a single tx.

### Notes

Usually an Arcade account is initialized with a `public key` and a `master account`, thus the master account will impact the account address. To avoid this, the Arcade factory deploys a custom arcade account for which the master account initialization is done outside of the constructor.

### Hashes

```
factory: 0x0286bb21588bdb808fb52e1e27346413e1f5be82e7de6a173e34677c3531d958
account: 0x0251830adc3d8b4d818c2c309d71f1958308e8c745212480c26e01120c69ee49
```

⚠️ This arcade account is not intended to be used in prod.
