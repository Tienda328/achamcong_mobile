package com.checkinproject;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


class LocationTrackModule extends ReactContextBaseJavaModule {

    String location = "";
    public LocationTrackModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "LocationTrackModule";
    }

    @ReactMethod
    public void startBackGroundService(String baseLocation, String latLong, String workingTime){
        Intent intent = new Intent(getReactApplicationContext(), GoogleService.class);
        Bundle bundle = new Bundle();
        bundle.putString(AppConstants.BASE_LOCATION,baseLocation);
        bundle.putString(AppConstants.LAT_LONG,latLong);
        bundle.putString(AppConstants.WORKING_TIME,workingTime);
        intent.putExtras(bundle);
        getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void stopTrackLocationService(){
        Intent broadcast1 = new Intent(AppConstants.BROADCAST_KEY_INTENT);
        broadcast1.putExtra(AppConstants.STOP_SERVICE, AppConstants.STOP_VALUE);
        getReactApplicationContext().sendBroadcast(broadcast1);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getLocation(){
        getReactApplicationContext().registerReceiver(broadcastReceiver, new IntentFilter(GoogleService.str_receiver));
        getReactApplicationContext().unregisterReceiver(broadcastReceiver);
        return location;
    }

    private final BroadcastReceiver broadcastReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            location = intent.getStringExtra("latutide") + "," +intent.getStringExtra("longitude");
            Log.d("Location Update", location);
        }
    };

}
