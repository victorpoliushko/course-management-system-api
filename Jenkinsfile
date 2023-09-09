pipeline {
  agent any
  environment {
    // GCLOUD_PATH='/Users/viktor-poliushko/google-cloud-sdk/bin/gcloud'
    GCLOUD_PATH=credentials('gcloud-path')
    PROJECT_ID=credentials('project-id')
    GCLOUD_CREDS=credentials('gcloud-creds')
    SERVICE_NAME=credentials('service-name')
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
        echo '''building the app        
        ${PROJECT_ID}
        ${SERVICE_NAME}
        ${TIMESTAMP}'''

        // echo "${PROJECT_ID}
        // ${SERVICE_NAME}
        // ${TIMESTAMP}"

        // docker build -t promotion-api:v1.0 .
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
          def CONTAINER_NAME = "${SERVICE_NAME}-${TIMESTAMP}"

          sh '''
            ${GCLOUD_PATH} config set project ${PROJECT_ID}
            ${GCLOUD_PATH} builds submit --tag=${IMAGE_NAME}
            ${GCLOUD_PATH} run deploy ${SERVICE_NAME} --image=${IMAGE_NAME} --platform=managed --allow-unauthenticated
          '''
        }
      }
    }
  }
}