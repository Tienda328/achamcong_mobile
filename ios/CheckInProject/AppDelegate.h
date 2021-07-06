#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <Firebase.h>
#import <UserNotifications/UNUserNotificationCenter.h>
#import <CoreLocation/CoreLocation.h>
@import Firebase;

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, FIRMessagingDelegate, CLLocationManagerDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
