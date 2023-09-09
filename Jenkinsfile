pipeline {
  agent any
  environment {
    GCLOUD_PATH='/Users/viktor-poliushko/google-cloud-sdk/bin/gcloud'
    CLOUDSDK_CORE_PROJECT='vertical-realm-397409'
    GCLOUD_CREDS=credentials('gcloud-creds')
    CLIENT_EMAIL='jenkins-gcloud@vertical-realm-397409.iam.gserviceaccount.com'
  }
  stages {
    stage('Verify version') {
      steps {
        sh '''
          ${GCLOUD_PATH} version
        '''
      }
    }
    stage('Authenticate') {
      steps {
        sh '''
          ${GCLOUD_PATH} auth activate-service-account --key-file="$GCLOUD_CREDS"
        '''
      }
    }
    stage('Build') {
      steps {
        echo 'building the app'
      }
    }
    stage('Test') {
      steps {
        echo 'testing the app'
      }
    }
    stage('Deploy') {
      steps {
        echo 'deploying the app'
        sh '''
          ${GCLOUD_PATH} run services update cloud-build-promotion
        '''
      }
    }
  }
}