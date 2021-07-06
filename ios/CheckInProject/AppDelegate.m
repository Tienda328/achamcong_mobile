#import "AppDelegate.h"
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#if DEBUG
//#import <FlipperKit/FlipperClient.h>
//#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
//#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
//#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
//#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
//#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>


static void InitializeFlipper(UIApplication *application) {
  //  FlipperClient *client = [FlipperClient sharedClient];
  //  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  //  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  //  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  //  [client addPlugin:[FlipperKitReactPlugin new]];
  //  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  //  [client start];
}
#endif

@implementation AppDelegate

CLLocationManager *_locationManager;

RCTRootView *rootView;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [self checkLocationServicesAndStartUpdates];
  
  if (@available(iOS 14, *)) {
    UIDatePicker *picker = [UIDatePicker appearance];
    picker.preferredDatePickerStyle = UIDatePickerStyleWheels;
  }
  
  [FIRApp configure];
  
  [[FIRMessaging messaging] tokenWithCompletion:^(NSString *token, NSError *error) {
    if (error != nil) {
      NSLog(@"Error getting FCM registration token: %@", error);
    } else {
      NSLog(@"FCM registration token: %@", token);
      //      self.fcmRegTokenMessage.text = token;
    }
  }];
  
  [FIRMessaging messaging].delegate = self;
  
  if ([UNUserNotificationCenter class] != nil) {
    // iOS 10 or later
    // For iOS 10 display notification (sent via APNS)
    [UNUserNotificationCenter currentNotificationCenter].delegate = self;
    UNAuthorizationOptions authOptions = UNAuthorizationOptionAlert |
    UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
    [[UNUserNotificationCenter currentNotificationCenter]
     requestAuthorizationWithOptions:authOptions
     completionHandler:^(BOOL granted, NSError * _Nullable error) {
      // ...
    }];
  } else {
    // iOS 10 notifications aren't available; fall back to iOS 8-9 notifications.
    UIUserNotificationType allNotificationTypes =
    (UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge);
    UIUserNotificationSettings *settings =
    [UIUserNotificationSettings settingsForTypes:allNotificationTypes categories:nil];
    [application registerUserNotificationSettings:settings];
  }
  
  [application registerForRemoteNotifications];
  
#if DEBUG
  InitializeFlipper(application);
#endif
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"CheckInProject"
                                            initialProperties:nil];
  
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error
{
  if (![CLLocationManager locationServicesEnabled]){
    NSLog(@"location services are disabled");
    return;
  }
  if ([CLLocationManager authorizationStatus] == kCLAuthorizationStatusDenied){
    NSLog(@"location services are blocked by the user");
    return;
  }
  
  if ([CLLocationManager authorizationStatus] == kCLAuthorizationStatusNotDetermined){
    NSLog(@"about to show a dialog requesting permission");
  }
}

- (void)locationManagerDidPauseLocationUpdates:(CLLocationManager *)manager {
  NSLog(@"didPauseLocations");
}

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray<CLLocation *> *)locations {
  NSLog(@"didUpdateLocations");
  manager.delegate = nil;
  CLLocation *location = [locations lastObject];
  // Call api update new location
}

- (void)messaging:(FIRMessaging *)messaging didReceiveRegistrationToken:(NSString *)fcmToken {
  NSLog(@"FCM registration token: %@", fcmToken);
  // Notify about received token.
  NSDictionary *dataDict = [NSDictionary dictionaryWithObject:fcmToken forKey:@"token"];
  [[NSNotificationCenter defaultCenter] postNotificationName:
   @"FCMToken" object:nil userInfo:dataDict];
  // TODO: If necessary send token to application server.
  // Note: This callback is fired at each app startup and whenever a new token is generated.
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler {
  NSLog(@"FCM foreground");
  completionHandler(UNNotificationPresentationOptionAlert);
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
  
}

-(void) checkLocationServicesAndStartUpdates
{
  _locationManager = [[CLLocationManager alloc] init];
  _locationManager.delegate = self;
  
  /* Pinpoint our location with the following accuracy:
   *
   *     kCLLocationAccuracyBestForNavigation  highest + sensor data
   *     kCLLocationAccuracyBest               highest
   *     kCLLocationAccuracyNearestTenMeters   10 meters
   *     kCLLocationAccuracyHundredMeters      100 meters
   *     kCLLocationAccuracyKilometer          1000 meters
   *     kCLLocationAccuracyThreeKilometers    3000 meters
   */
  _locationManager.desiredAccuracy = kCLLocationAccuracyBest;
  
  /* Notify changes when device has moved x meters.
   * Default value is kCLDistanceFilterNone: all movements are reported.
   */
  //  _locationManager.distanceFilter = 10.0f;
  
  /* Notify heading changes when heading is > 5.
   * Default value is kCLHeadingFilterNone: all movements are reported.
   */
  //  _locationManager.headingFilter = 5;
  
  _locationManager.allowsBackgroundLocationUpdates = YES;
  
  if ([_locationManager respondsToSelector:@selector(requestWhenInUseAuthorization)])
  {
    [_locationManager requestWhenInUseAuthorization];
    [_locationManager requestAlwaysAuthorization];
  }
  
  //Checking authorization status
  if (![CLLocationManager locationServicesEnabled] && [CLLocationManager authorizationStatus] == kCLAuthorizationStatusDenied)
  {
    [_locationManager requestAlwaysAuthorization];
  }
  else
  {
    //Location Services Enabled, let's start location updates
//    [NSTimer scheduledTimerWithTimeInterval: 60.0f
//                                     target:self
//                                   selector:@selector(updateLocation)
//                                   userInfo:nil
//                                    repeats:YES];
  }
}

//- (void)updateLocation {
//  _locationManager.delegate = self;
//  [_locationManager startUpdatingLocation];
//}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}
@end
