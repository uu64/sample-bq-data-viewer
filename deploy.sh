#!/bin/bash

set -e

if [ $# -ne 1 ]; then
    echo "usage: deploy.sh GCP_PROJECT_ID"
    exit 1
fi

npm run build
gcloud app deploy --project="${1}"
