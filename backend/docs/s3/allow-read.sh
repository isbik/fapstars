#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <bucket-name>"
    exit 1
fi

BUCKET_NAME=$1

BUCKET_POLICY=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AddPerm",
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::$BUCKET_NAME",
        "arn:aws:s3:::$BUCKET_NAME/*"
      ]
    }
  ]
}
EOF
)

aws s3api put-bucket-policy \
  --endpoint-url https://s3.cloud.ru \
  --bucket "$BUCKET_NAME" \
  --policy "$BUCKET_POLICY" \

if [ $? -eq 0 ]; then
    echo "Bucket '$BUCKET_NAME' is now publicly readable."
else
    echo "Failed to update the bucket policy for '$BUCKET_NAME'."
    exit 1
fi
