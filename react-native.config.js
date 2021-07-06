module.exports = {
  project: {
    ios: {},
    android: {
      packageName: 'com.checkinproject',
    },
  },

  dependencies: {
    // 'react-native-device-info': {
    //   platforms: {
    //     android: {
    //       packageInstance: 'new RNDeviceInfo(false)',
    //     },
    //   },
    // },
    realm: {
      platforms: {
        ios: null, // disable iOS platform, other platforms will still autolink if provided
      },
    },
  },

  assets: ['./source/assets/fonts/'],
};
