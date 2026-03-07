package io.ionic.starter;

import android.os.Bundle;
import android.content.Intent;
import android.net.Uri;
import java.util.ArrayList;
import android.util.Log;
import android.content.SharedPreferences;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    // private String sharedImageUri = null;

    // @Override
    // protected void onCreate(Bundle savedInstanceState) {
    // super.onCreate(savedInstanceState);
    // handleShareIntent(getIntent());
    // }

    // @Override
    // protected void onNewIntent(Intent intent) {
    // super.onNewIntent(intent);
    // setIntent(intent);
    // handleShareIntent(intent);
    // }

    // @Override
    // public void onResume() {
    // super.onResume();

    // if (sharedImageUri != null) {
    // sendToJS(sharedImageUri);
    // sharedImageUri = null;
    // }
    // }

    // private void handleShareIntent(Intent intent) {
    // String action = intent.getAction();
    // String type = intent.getType();

    // if (Intent.ACTION_SEND.equals(action) && type != null &&
    // type.startsWith("image/")) {
    // Uri imageUri = intent.getParcelableExtra(Intent.EXTRA_STREAM);

    // if (imageUri != null) {
    // sharedImageUri = imageUri.toString();
    // Log.d("SHARE_DEBUG", "Saved URI: " + sharedImageUri);
    // }
    // }
    // }

    // private void sendToJS(String uri) {
    // bridge.getWebView().post(() -> {
    // String js = "window.dispatchEvent(new CustomEvent('shareImage', { detail: {
    // uri: '"
    // + uri +
    // "' } }));";

    // bridge.getWebView().evaluateJavascript(js, null);
    // });
    // }

    // private void handleShareIntent(Intent intent) {

    // String action = intent.getAction();
    // String type = intent.getType();

    // if (Intent.ACTION_SEND.equals(action)
    // && type != null
    // && type.startsWith("image/")) {

    // Uri imageUri = intent.getParcelableExtra(Intent.EXTRA_STREAM);

    // if (imageUri != null) {

    // // intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

    // // try {
    // // getContentResolver().takePersistableUriPermission(
    // // imageUri,
    // // Intent.FLAG_GRANT_READ_URI_PERMISSION);
    // // } catch (Exception e) {
    // // Log.e("SHARE_DEBUG", "Permission not persistable");
    // // }

    // this.sharedImageUri = imageUri.toString();
    // this.sendToImage(this.sharedImageUri);
    // }
    // }
    // }

    // @Override
    // public void onResume() {
    // super.onResume();

    // if (sharedImageUri != null) {
    // this.sendToImage(this.sharedImageUri);
    // sharedImageUri = null;
    // }
    // }

    // private void sendToImage(String uri) {
    // SharedPreferences prefs = getSharedPreferences("CapacitorStorage",
    // MODE_PRIVATE);
    // prefs.edit().putString("pendingImage", uri).apply();
    // Log.d("LOGIONICS SHARE_DEBUG", "Saved URI to prefs: " + uri);
    // }
}