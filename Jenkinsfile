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
      nodejs(nodeJSInstallationName: 'NodeJS-Ionic') {
        sh 'ionic cordova build android --debug'
      }
    }
  }
}
