#!/bin/bash

set -eu -o pipefail

readonly LOCATION="asia-northeast1"
readonly PROJECT_ID=$(gcloud config get-value project)
readonly SERVICE_ACCOUNT_ID="github-actions-builder"
readonly SERVICE_ACCOUNT="${SERVICE_ACCOUNT_ID}@${PROJECT_ID}.iam.gserviceaccount.com"

readonly REPOSITORY_NAME="$1"
readonly SERVER_PROJECT_NAME="$2"

if [[ -z ${REPOSITORY_NAME} ]]; then
  echo "❌ Not specified repository name at 1st argument."
  exit 1
elif [[ -z ${SERVER_PROJECT_NAME} ]]; then
  echo "❌ Not specified project name at 2nd argument."
  exit 1
fi

gcloud services enable \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  cloudresourcemanager.googleapis.com \
  secretmanager.googleapis.com

if [[ -z $(gcloud artifacts repositories describe "${REPOSITORY_NAME}" --location=${LOCATION} 2>/dev/null) ]]; then
  gcloud artifacts repositories create "${REPOSITORY_NAME}" \
    --repository-format=docker \
    --location=${LOCATION}
fi

if [[ -z $(gcloud secrets describe "${SERVER_PROJECT_NAME}" 2>/dev/null) ]]; then
  gcloud secrets create "${SERVER_PROJECT_NAME}"
  gcloud secrets versions add "${SERVER_PROJECT_NAME}" --data-file ./packages/server/.env.production
fi

if [[ -z $(gcloud iam service-accounts describe "${SERVICE_ACCOUNT}" 2>/dev/null) ]]; then
  gcloud iam service-accounts create "${SERVICE_ACCOUNT_ID}" \
    --display-name="Github Actions builder"
fi

if [[ ! -f "./credential.json" ]]; then
  gcloud iam service-accounts keys create ./credential.json \
    --iam-account "${SERVICE_ACCOUNT}"
fi
