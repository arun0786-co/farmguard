const https = require('https');
const fs = require('fs');
const path = require('path');

// Product images with their Unsplash URLs
const productImages = {
  'placeholder-farm.jpg': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'rice-placeholder.jpg': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'coconut-placeholder.jpg': 'https://images.unsplash.com/photo-1580984969071-a8da5656c2fb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'banana-placeholder.jpg': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'coffee-placeholder.jpg': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'pepper-placeholder.jpg': 'https://images.unsplash.com/photo-1613758235256-43a7bdc21d82?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'cardamom-placeholder.jpg': 'https://images.unsplash.com/photo-1599909631715-c0ee017d1f76?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'fish-placeholder.jpg': 'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'vegetable-placeholder.jpg': 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'fruit-placeholder.jpg': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'herb-placeholder.jpg': 'https://images.unsplash.com/photo-1611911813383-67769b37a149?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'turmeric-placeholder.jpg': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'default-product-placeholder.jpg': 'https://images.unsplash.com/photo-1607004468138-e7e23ea26947?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
};

// Function to download an image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve(filepath));
      } else {
        response.resume();
        reject(new Error(`Request Failed With a Status Code: ${response.statusCode}`));
      }
    });
  });
}

// Function to download all images
async function downloadAllImages() {
  // Create the products directory if it doesn't exist
  const productsDir = path.join(__dirname, '../public/images/products');
  if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
  }

  // Create the images directory if it doesn't exist
  const imagesDir = path.join(__dirname, '../public/images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // Download each image
  for (const [filename, url] of Object.entries(productImages)) {
    const filepath = path.join(
      filename === 'placeholder-farm.jpg' ? imagesDir : productsDir,
      filename
    );
    try {
      console.log(`Downloading ${filename}...`);
      await downloadImage(url, filepath);
      console.log(`Successfully downloaded ${filename}`);
    } catch (error) {
      console.error(`Error downloading ${filename}:`, error.message);
    }
  }
}

// Run the download
downloadAllImages().catch(console.error); 