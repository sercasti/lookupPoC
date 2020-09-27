import boto3
import json
import os

from datetime import datetime
from boto3.dynamodb.types import TypeDeserializer, TypeSerializer

tableName = os.environ['DYNAMO_TABLE']
s3bucketName = os.environ['S3_BUCKET']

s3_client = boto3.client('s3')
dynamo = boto3.client('dynamodb')


def lambda_handler(event, context):
    dniParam = event["queryStringParameters"]['dni'];
    dynamoData = dynamo.get_item(
                        TableName=tableName,
                        Key={'dni': {'S': dniParam}});

    response = {};
    response['personData'] = from_dynamodb_to_json(dynamoData['Item']);
    s3resp = s3_client.list_objects_v2(
        Bucket=s3bucketName,
        Prefix=dniParam,
        StartAfter='/'
    );
    files = [];
    for obj in s3resp['Contents']:
        file = {}
        if(obj['Size'] > 0):
            file['Name'] = obj['Key'].replace(dniParam+'/','');
            file['LastModified'] = obj['LastModified'].strftime("%d/%m/%Y %H:%M:%S");
            file['Size'] = str(round(obj['Size']/1024,1)) + ' KB';
            file['URL'] = create_presigned_url(obj['Key']);
            headresponse = s3_client.head_object(Bucket=s3bucketName,Key=obj['Key']);
            if (headresponse['Metadata']):
                file['Metadata'] = headresponse['Metadata'];
            files.append(file)
    response['files'] = files;

    return {
        'statusCode': '200',
        'body': json.dumps(response),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,GET'
        },
    }

def from_dynamodb_to_json(item):
    d = TypeDeserializer()
    return {k: d.deserialize(value=v) for k, v in item.items()}

#Generate a presigned URL to share an S3 object
def create_presigned_url(object_name):
    return s3_client.generate_presigned_url('get_object', Params = {'Bucket': s3bucketName,'Key': object_name}, ExpiresIn=3600)
