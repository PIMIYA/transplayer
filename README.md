transplayer
npm install --global --production windows-build-tools
npm install node-gyp
npm config set msvs_version 2019 --global

C:\Program Files\nodejs\node_modules\npm\node_modules\node-gyp\lib\configure.js
Line 159:

variables['msbuild_path'] = path.join(vsSetup.path, 'MSBuild', '15.0', 'Bin', 'MSBuild.exe')


npm install --save-dev electron-rebuild

# Every time you run "npm install", run this:
./node_modules/.bin/electron-rebuild