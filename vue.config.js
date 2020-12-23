module.exports = {
  transpileDependencies: ['vuetify'],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      externals: ['serialport', 'mqtt', 'electron-edge-js'],
      nodeModulesPath: ['./node_modules'],
      builderOptions: {
        appId: 'com.payot.kiosk2',
        productName: 'PayOT 키오스크',
        win: {
          icon: 'icon.ico',
          publish: 'never',
          target: [{ target: 'nsis', arch: ['x64'] }],
        },
      }
    },
  },
};
