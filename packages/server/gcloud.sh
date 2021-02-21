#!/bin/bash

readonly LOCATION="asia-northeast1"
readonly PROJECT_ID=$(gcloud config get-value project)
readonly PROJECT_NUMBER=$(gcloud projects describe ${PROJECT_ID} --format="value(projectNumber)")
readonly REPOSITORY_NAME="ravyd-repository"
readonly SERVER_PROJECT_NAME="ravyd-server"

gcloud services enable \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  secretmanager.googleapis.com

if [[ -z $(gcloud artifacts repositories describe ${REPOSITORY_NAME} --location=${LOCATION} 2>/dev/null) ]]; then
  gcloud artifacts repositories create ${REPOSITORY_NAME} \
    --repository-format=docker \
    --location=${LOCATION}
fi

if [[ -z $(gcloud secrets describe ${SERVER_PROJECT_NAME} 2>/dev/null) ]]; then
  gcloud secrets create ${SERVER_PROJECT_NAME}
  gcloud secrets versions add ${SERVER_PROJECT_NAME} --data-file ./packages/server/.env.production
fi

gcloud iam service-accounts add-iam-policy-binding \
  ${PROJECT_NUMBER}-compute@developer.gserviceaccount.com \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
