node {
  stage('SCM') {
    checkout scm
  }
  stage('Install and Test') { 
    nodejs(nodeJSInstallationName: 'NodeJS-Ionic') {
      dir('./app') {
        sh 'npm install'
        sh 'ng test --code-coverage --watch=false'
      }
    }
  }
  stage('SonarQube Analysis') {
    def scannerHome = tool 'SonarScanner';
    withSonarQubeEnv() {
      nodejs(nodeJSInstallationName: 'NodeJS-Ionic') {
        dir('./app') {
          sh "${scannerHome}/bin/sonar-scanner"
        }
      } 
    }
  }
  stage('Save Test Result') {
    dir('./app') {
      junit 'coverage/junit/**/*.xml'
      cobertura coberturaReportFile: 'coverage/*coverage.xml'
    }
  }
  // stage('Build Android') {
  //   dir('./app') {
  //     sh 'docker run --rm -v /var/jenkins_home/:/home/workspace node-android bash -c "ionic cordova build android"'
  // }
}
