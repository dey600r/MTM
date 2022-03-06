node {
  stage('SCM') {
    checkout scm
  }
  // stage('Install and Test') { 
  //   nodejs(nodeJSInstallationName: 'NodeJS-Ionic') {
  //     dir('./app') {
  //       sh 'npm install'
  //       sh 'ng test --code-coverage --watch=false'
  //     }
  //   }
  // }
  // stage('SonarQube Analysis') {
  //   def scannerHome = tool 'SonarScanner';
  //   withSonarQubeEnv() {
  //     dir('./app') {
  //       sh "${scannerHome}/bin/sonar-scanner"
  //     }
  //   }
  // }
  // stage('Save Test Result') {
  //   dir('./app') {
  //     junit 'coverage/junit/**/*.xml'
  //     cobertura coberturaReportFile: 'coverage/*coverage.xml'
  //   }
  // }
  stage('Build Android') {
    dir('./app') {
      withGradle {
        nodejs(nodeJSInstallationName: 'NodeJS-Ionic') {
          // sh 'ionic cordova platform ls'
          // sh 'ionic cordova platform add android@8.1.0'
          // sh 'ionic cordova platform add windows@6.0.1'
          sh 'java --version'
          // sh 'apt-get install openjdk-8-jdk'
          // sh 'apt install android-sdk android-sdk-platform-23'
          sh 'ionic cordova build android --debug'
        }
      }
    }
  }
}
