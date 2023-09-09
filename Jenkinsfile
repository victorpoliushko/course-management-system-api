pipeline {
  agent any
  environment {
    // GCLOUD_PATH='/Users/viktor-poliushko/google-cloud-sdk/bin/gcloud'
    GCLOUD_PATH=credentials('gcloud-path')
    GCLOUD_CREDS=credentials('gcloud-creds')
    // PROJECT_ID=credentials('project-id')
    // SERVICE_NAME=credentials('service-name')
    PROJECT_ID='vertical-realm-397409'
    SERVICE_NAME='cloud-build-promotion'
    REGION='us-central1'
    TIMESTAMP = new Date().format("yyyyMMddHHmmss")
    // CLIENT_EMAIL='jenkins-gcloud@vertical-realm-397409.iam.gserviceaccount.com'
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
        script {
          def IMAGE_NAME = "gcr.io/${PROJECT_ID}/${SERVICE_NAME}:${TIMESTAMP}"
          echo "IMAGE_NAME: ${IMAGE_NAME}"
        }
      }
    }
    stage('Test') {
      steps {
        echo 'testing the app'
      }
    }
    stage('Deploy') {
      steps {
        script {
          echo 'deploying the app'

          def IMAGE_NAME = "gcr.io/${PROJECT_ID}/${SERVICE_NAME}:${TIMESTAMP}"

          sh """
            ${GCLOUD_PATH} config set project ${PROJECT_ID}
            ${GCLOUD_PATH} builds submit --tag=${IMAGE_NAME}
            ${GCLOUD_PATH} run deploy ${SERVICE_NAME} --image=${IMAGE_NAME} --region=${REGION} --platform=managed --allow-unauthenticated
          """
        }
      }
    }
  }
}