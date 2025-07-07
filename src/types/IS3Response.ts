export interface IS3Response{
  ETag: string;
  location: string;
  key: string;
  Key: string;
  Bucket: string;
}
/*

"ETag": "\"5c123abc9d9d4cf12ef04fc894ab1234\"",
  "Location": "https://your-bucket-name.s3.amazonaws.com/images/photo.png",
  "key": "images/photo.png",
  "Key": "images/photo.png",
  "Bucket": "your-bucket-name"
*/