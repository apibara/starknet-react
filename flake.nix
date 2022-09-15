{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem(system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in
        {
          devShells.default = pkgs.mkShell {
            nativeBuildInputs = [
              pkgs.nodejs-16_x
              pkgs.nodePackages.pnpm
              pkgs.nodePackages.typescript
              pkgs.nodePackages.typescript-language-server
            ];
          };
        }
    );
}