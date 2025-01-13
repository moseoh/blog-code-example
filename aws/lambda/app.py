import json
import boto3
import os
import base64
from PIL import Image
import io

s3_client = boto3.client('s3')

def create_thumbnail(image_content, output_format='WEBP', size=(200, 200)):
    """썸네일을 생성하는 함수"""
    # PIL 이미지로 변환
    image = Image.open(io.BytesIO(image_content))
    
    # 썸네일 생성
    image.thumbnail(size)
    
    # 썸네일을 바이트로 변환
    buffer = io.BytesIO()
    image.save(buffer, format=output_format, quality=85)
    return buffer.getvalue()

def handle_api_request(event):
    """API Gateway를 통한 요청 처리"""
    try:
        # multipart/form-data 또는 base64 인코딩된 이미지 처리
        if event.get('isBase64Encoded', False):
            image_content = base64.b64decode(event['body'])
        else:
            return {
                'statusCode': 400,
                'body': json.dumps('Image must be sent as base64 encoded data')
            }
            
        # 썸네일 생성
        thumbnail_content = create_thumbnail(image_content)
        
        # 바이너리 응답 반환
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'image/webp',
                'Content-Disposition': 'attachment; filename="thumbnail.webp"'
            },
            'body': base64.b64encode(thumbnail_content).decode('utf-8'),
            'isBase64Encoded': True
        }
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }

def handle_s3_request(event):
    """S3 이벤트 핸들러"""
    try:
        # S3 버킷과 키 정보 가져오기
        bucket = event['Records'][0]['s3']['bucket']['name']
        key = event['Records'][0]['s3']['object']['key']
        
        # 원본 이미지 다운로드
        response = s3_client.get_object(Bucket=bucket, Key=key)
        image_content = response['Body'].read()
        
        # 썸네일 생성
        thumbnail_content = create_thumbnail(
            image_content, 
            output_format=Image.open(io.BytesIO(image_content)).format
        )
        
        # 썸네일용 새 키 생성
        thumbnail_key = f"thumbnails/{os.path.basename(key)}"
        
        # S3에 업로드
        s3_client.put_object(
            Bucket=bucket,
            Key=thumbnail_key,
            Body=thumbnail_content,
            ContentType=f'image/{Image.open(io.BytesIO(image_content)).format.lower()}'
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps('Thumbnail created successfully')
        }
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }

def lambda_handler(event, context):
    """Lambda 핸들러"""
    # API Gateway를 통한 요청인지 확인
    if 'httpMethod' in event:
        return handle_api_request(event)
    # S3 이벤트인지 확인
    elif 'Records' in event and event['Records'][0].get('eventSource') == 'aws:s3':
        return handle_s3_request(event)
    # 그 외의 경우 에러 반환
    else:
        return {
            'statusCode': 400,
            'body': json.dumps('Invalid event source')
        }