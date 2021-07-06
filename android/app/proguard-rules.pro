# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
-dontwarn sun.misc.Unsafe
-dontwarn javax.annotation.Nullable
-dontwarn javax.annotation.ParametersAreNonnullByDefault
-dontwarn javax.annotation.CheckReturnValue
-dontwarn javax.annotation.CheckForNull
-dontwarn javax.annotation.concurrent.GuardedBy
-dontwarn javax.annotation.concurrent.Immutable
-dontwarn javax.annotation.concurrent.ThreadSafe
-dontwarn javax.annotation.concurrent.NotThreadSafe
