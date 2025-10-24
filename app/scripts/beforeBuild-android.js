module.exports = function(ctx) {

    const fs = require('fs');
    const path = require('path');
    const rootdir = ctx.opts.projectRoot;
    const android_dir = path.join(ctx.opts.projectRoot, 'platforms/android');
    const android_app_dir = path.join(ctx.opts.projectRoot, 'platforms/android/app');
    const gradle_file = rootdir + '/scripts/build-extras.gradle';
    const dest_gradle_file = android_dir + '/build-extras.gradle';
    const dest_gradle_app_file = android_app_dir + '/build-extras.gradle';
    console.log(`📦 Building gradles file from ${android_app_dir} → ${dest_gradle_file}`);

    console.log("Before-Build Hook - rootdir", rootdir);
    console.log("Before-Build Hook - android_dir", android_dir);
    console.log("Before-Build Hook - gradle_file", gradle_file);
    console.log("Before-Build Hook - dest_gradle_file", dest_gradle_file);
    console.log("Before-Build Hook - dest_gradle_app_file", dest_gradle_app_file);

    if(!fs.existsSync(gradle_file)){
        console.warn('WARNING: ' + gradle_file + ' not found. Skipping');
        return;
    }else if(!fs.existsSync(android_dir)){
        console.warn('WARNING: ' + android_dir + ' not found. Skipping');
       return;
    }else if(!fs.existsSync(android_app_dir)){
        console.warn('WARNING: ' + android_app_dir + ' not found. Skipping');
       return;
    }

    console.log('Before-Build Hook - Copy ' + gradle_file + ' to ' + android_dir);
    fs.createReadStream(gradle_file).pipe(fs.createWriteStream(dest_gradle_file));
    console.log('Before-Build Hook - Copy ' + gradle_file + ' to ' + android_app_dir);
    fs.createReadStream(gradle_file).pipe(fs.createWriteStream(dest_gradle_app_file));

    console.log('✅ Succesfully building gradles.');
}