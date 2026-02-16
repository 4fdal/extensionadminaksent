package io.ionic.starter;

import android.os.Bundle;
import android.content.Intent;
import android.net.Uri;
import java.util.ArrayList;
import android.util.Log;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private String sharedImageUri = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        handleShareIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleShareIntent(intent);
    }

    @Override
    public void onResume() {
        super.onResume();

        if (sharedImageUri != null) {
            sendToJS(sharedImageUri);
            sharedImageUri = null;
        }
    }

    private void handleShareIntent(Intent intent) {
        String action = intent.getAction();
        String type = intent.getType();

        if (Intent.ACTION_SEND.equals(action) && type != null && type.startsWith("image/")) {
            Uri imageUri = intent.getParcelableExtra(Intent.EXTRA_STREAM);

            if (imageUri != null) {
                sharedImageUri = imageUri.toString();
                Log.d("SHARE_DEBUG", "Saved URI: " + sharedImageUri);
            }
        }
    }

    private void sendToJS(String uri) {
        bridge.getWebView().post(() -> {
            String js = "window.dispatchEvent(new CustomEvent('shareImage', { detail: { uri: '"
                    + uri +
                    "' } }));";

            bridge.getWebView().evaluateJavascript(js, null);
        });
    }
}