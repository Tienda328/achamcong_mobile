/**
 * @format
 */
import React from 'react';
import { View } from 'react-native';
import { AppRegistry } from 'react-native';
import AppNavigator from './source/commons/navigation/navigator/index';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import PermissionRequest from './App';
// import notifee from '@notifee/react-native';
import SoundPlayer from 'react-native-sound-player';
import Root from './source/ui/components/Root';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log(
    'Message handled in the background notification!',
    remoteMessage.data,
  );
  SoundPlayer.playSoundFile('dethuong', 'mp3');
  console.log('Message handled in the background!', remoteMessage);

  // await notifee.setBadgeCount(remoteMessage.data.un_read);
  // notifee.setBadgeCount(1).then(() => console.log('Badge count set!'));
});

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    return null;
  }

  return (
    <Root>
      <View style={{ flex: 1 }}>
        <AppNavigator />
        <PermissionRequest />
      </View>
    </Root>
  );
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
