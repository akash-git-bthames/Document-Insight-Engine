import boto3
from botocore.exceptions import NoCredentialsError
import os

# AWS S3 Configuration
S3_BUCKET = 'your-bucket-name'
S3_KEY = 'your-access-key'
S3_SECRET = 'your-secret-key'
S3_REGION = 'your-region'

s3 = boto3.client('s3', aws_access_key_id=S3_KEY, aws_secret_access_key=S3_SECRET, region_name=S3_REGION)

def upload_to_s3(file_obj, bucket_name, object_name):
    try:
        s3.upload_fileobj(file_obj, bucket_name, object_name)
        return f"https://{bucket_name}.s3.{S3_REGION}.amazonaws.com/{object_name}"
    except NoCredentialsError:
        return None
