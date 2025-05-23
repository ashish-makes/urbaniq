const fs = require('fs');
const path = require('path');
const ImageKit = require('imagekit');

// Initialize ImageKit with your credentials
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Create a simple function to upload a test file
async function uploadTestFile() {
  try {
    // Upload a file from a URL since we don't have a local file
    const uploadResponse = await imagekit.upload({
      file: "https://picsum.photos/200/300", // Random image from picsum
      fileName: "test-image.jpg",
      folder: "/test-folder",
    });
    
    console.log('Upload successful!');
    console.log('Full response:', JSON.stringify(uploadResponse, null, 2));
    console.log('File ID:', uploadResponse.fileId);
    console.log('File URL:', uploadResponse.url);
    
    // Now try to delete the file using the fileId
    console.log('Attempting to delete file with ID:', uploadResponse.fileId);
    const deleteResponse = await imagekit.deleteFile(uploadResponse.fileId);
    console.log('Delete successful!', deleteResponse);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
uploadTestFile();
