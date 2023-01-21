module.exports = function(ctx) {
    const fs = require('fs');
    const path = require('path');
    const rootdir = ctx.opts.projectRoot;
    const android_dir = path.join(ctx.opts.projectRoot, 'platforms/android');
    const android_app_dir = path.join(ctx.opts.projectRoot, 'platforms/android/app');
    const gradle_file = rootdir + '/scripts/build-extras.gradle';
    const dest_gradle_file = android_dir + '/build-extras.gradle';
    const dest_gradle_app_file = android_app_dir + '/build-extras.gradle';

    
    console.log("Before-Build Hook - rootdir", rootdir);
    console.log("Before-Build Hook - android_dir", android_dir);
    console.log("Before-Build Hook - gradle_file", gradle_file);
    console.log("Before-Build Hook - dest_gradle_file", dest_gradle_file);
    console.log("Before-Build Hook - dest_gradle_app_file", dest_gradle_app_file);


    if(!fs.existsSync(gradle_file)){
        console.log(gradle_file + ' not found. Skipping');
        return;
    }else if(!fs.existsSync(android_dir)){
        console.log(android_dir + ' not found. Skipping');
       return;
    }else if(!fs.existsSync(android_app_dir)){
        console.log(android_app_dir + ' not found. Skipping');
       return;
    }

    console.log('Copy ' + gradle_file + ' to ' + android_dir);
    fs.createReadStream(gradle_file).pipe(fs.createWriteStream(dest_gradle_file));
    console.log('Copy ' + gradle_file + ' to ' + android_app_dir);
    fs.createReadStream(gradle_file).pipe(fs.createWriteStream(dest_gradle_app_file));
}