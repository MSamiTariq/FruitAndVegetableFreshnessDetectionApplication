import boto3
import json
import base64

# Initialize S3 client
s3 = boto3.client('s3')

# Load the machine learning models from S3
def load_model(bucket, key):
    response = s3.get_object(Bucket=bucket, Key=key)
    model_content = response['Body'].read()
    model = ""  # Load the model from model_content
    return model

# Load the fruit detection model
fruit_detection_model = load_model('your-bucket-name', 'path/to/fruit_detection_model')

# Load the freshness detection model
freshness_detection_model = load_model('your-bucket-name', 'path/to/freshness_detection_model')

# Lambda handler function
def lambda_handler(event, context):
    # Decode the image from the event
    image_data = base64.b64decode(event['image'])

    # Detect the fruit in the image using the fruit detection model
    fruit = fruit_detection_model.detect(image_data)

    # Check the freshness of the fruit using the freshness detection model
    freshness = freshness_detection_model.check(fruit)

    # Return the results
    return {
        'fruit': fruit,
        'freshness': freshness
    }