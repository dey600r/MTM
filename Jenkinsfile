node {
  stage('SCM') {
    checkout scm
  }
  stage('Install and Test') { 
    nodejs(nodeJSInstallationName: 'NodeJS') {
      //ws('$WORKSPACE/app') {
        sh '''
          cd $WORKSPACE/app
          ls -la
        '''
        sh 'ls -la'
        sh 'npm install'
        sh 'ng test --code-coverage --watch=false'
      //}
    }
  }
  stage('SonarQube Analysis') {
    def scannerHome = tool 'SonarScanner';
    withSonarQubeEnv() {
      sh "${scannerHome}/bin/sonar-scanner"
    }
  }
}
