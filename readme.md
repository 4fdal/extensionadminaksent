Adding the Android Platform
First, install the @capacitor/android package.
> npm install @capacitor/android

Then, add the Android platform.
> npx cap add android
> cd ./android/ && ./gradlew clean --no-daemon --refresh-dependencies && cd ..
> npx cap sync android

Opening the Android Project
To open the project in Android Studio, run:
> npx cap open android

Alternatively, you can open Android Studio and import the android/ directory as an Android Studio project.

Running Your App
You can either run your app on the command-line or with Android Studio.

To use an Android Emulator you must use an API 24+ system image. The System WebView does not automatically update on emulators. Physical devices should work as low as API 24 as long as their System WebView is updated.

Running on the Command-Line
To run the project on a device or emulator, run:
> npx cap run android


Debug
> adb logcat | grep Capacitor
1. adb start-server
2. adb devices (check device)
3. open chrome browser with “chrome://inspect/#devices”
WebView in io.ionic.starter (133.0.6943.137)
Ionic App http://192.168.1.16:8100/home
Inspect
