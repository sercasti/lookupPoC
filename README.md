# lookupPoC
PoC to find people by their ID on a basic webpage, get s3 files associated to that person, and dynamodb data for that person, and show them on a responsive web.

# This Poc uses:
- DynamoDB to store unstructured data about a person
- S3 to store files related to a person, each person would have a prefix (subfolder) with their files
- Lambda to read the information from S3 and DynamoDB for a given ID, generating presigned URL's to download the files
- Lambda to mock a service returning expenditures for a person
- API gateway to expose the lambdas as API's
- IAM role to allow lambdas to access both s3 and dynamodb
- Environment variables in the lambdas to configure bucket and dynamoDB table names

# Prerequisite
An existing S3 bucket with file contents for some people, using their id as prefix/subfolder (i.e.: s3:/bucket/id/file.pdf)
Matching information on the DynamoDB table for some people with the same id. 

# How to use
Just browse the code as a guide on how this works, if you want to run it, use the cloudFormation template attached
