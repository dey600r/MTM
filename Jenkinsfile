node {
  stage('SCM') {
    checkout scm
  }
  stage('Install and Test') { 
    nodejs(nodeJSInstallationName: 'NodeJS') {
      //ws('app') {
        sh 'echo $env.WORKSPACE'
        sh 'echo $WORKSPACE'
        sh 'echo $PWD'
        sh 'ls -la'
        sh 'npm install'
        sh 'ng test --code-coverage --watch=false'
      }
    //}
  }
  stage('SonarQube Analysis') {
    def scannerHome = tool 'SonarScanner';
    withSonarQubeEnv() {
      sh "${scannerHome}/bin/sonar-scanner"
    }
  }
}
