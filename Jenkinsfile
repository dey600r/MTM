node {
  stage('SCM') {
    checkout scm
  }
  // stage('Angular - Install and Test') { 
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
  //     nodejs(nodeJSInstallationName: 'NodeJS-Ionic') {
  //       dir('./app') {
  //         sh "${scannerHome}/bin/sonar-scanner"
  //       }
  //     } 
  //   }
  // }
  // stage('Android - Install') {
  //   sh 'docker run --rm -v docker_jenkins_data:/home node-android bash -c "cd workspace/deyapps-mtm-build/app && ionic cordova platform rm android && ionic cordova platform add android@9.0.0"'
  // }
  stage('Android - Build') {
    sh 'docker run --rm -v docker_jenkins_data:/home node-android bash -c "cd ./workspace/deyapps-mtm-build/app && npm run build:release-jenkins"'
    //sh 'docker run --rm -v docker_jenkins_data:/home/workspace node-android bash -c "cd /var/jenkins_home/workspace/deyapps-mtm-build/app && ionic cordova build android --debug"'
  }
  // stage('Save Test Result') {
  //   dir('./app') {
  //     junit 'coverage/junit/**/*.xml'
  //     cobertura coberturaReportFile: 'coverage/*coverage.xml'
  //   }
  // }
}
