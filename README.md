# MBW-Inventory
MBW Inventory is a simple Android app for battery and inverter shops. Scan each unit’s serial number or barcode to stock in, sell with customer, vehicle and invoice details, and search any history instantly. See low-stock alerts on the dashboard, export stock and sales to Excel, and back up your data.

# MBW Inventory (Flutter, Android, device-only)

## Setup (Windows)
1. Unzip, open a terminal in this folder.
2. `flutter create . --platforms=android --project-name mbw_inventory`
   (adds the android folder; keeps lib/). Delete the generated `test` folder.
3. `flutter pub get`
4. Connect phone (USB debugging on), then `flutter run`
5. APK: `flutter build apk` -> build/app/outputs/flutter-apk/app-release.apk

If the build complains about minSdk, set `minSdk = 23` in android/app/build.gradle(.kts).

## Included
Dashboard with low-stock flag, Stock in (scan serial/barcode, new model),
Sell (customer + invoice), Search, Excel export, Backup and Restore.

## Not yet built
Stock count, Reports, 7-day backup reminder, undo.
