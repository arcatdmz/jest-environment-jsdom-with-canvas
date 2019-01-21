// Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.

module.exports = {
    plugins: [
      ['@babel/plugin-transform-modules-commonjs', {allowTopLevelThis: true}],
      '@babel/plugin-transform-strict-mode',
      '@babel/plugin-proposal-class-properties'
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          shippedProposals: true,
          targets: {node: 6},
        },
      ]
    ],
  };