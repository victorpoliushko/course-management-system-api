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
    stage('Install service') {
      steps {
        sh '''
          ${GCLOUD_PATH} run services replace service.yaml --platform='managed' --region='us-central1'
        '''
      }
    }
    stage('Allow allUsers') {
      steps {
        sh '''
          ${GCLOUD_PATH} run services add-iam-policy-binding hello --region='us-central1' --member='allUsers' --role='roles/run.invoker'
        '''
      }
    }
  }
  post {
    always {
      sh '${GCLOUD_PATH} auth revoke $CLIENT_EMAIL'
    }
  }
}