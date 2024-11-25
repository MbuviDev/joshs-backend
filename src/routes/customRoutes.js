const express = require('express');
const router = express.Router();

// Endpoint to fetch custom images
router.get('/custom-images', (req, res) => {
  const customImages = [
    {
      _id: "1",
      url: "https://res.cloudinary.com/dml1lihw1/image/upload/v1732459880/kitenge-products/uhsqtwgdbhnqjznylvkc.jpg",
      alt: "Custom Ankara Fashion 1",
    },
    {
      _id: "2",
      url: "https://res.cloudinary.com/dml1lihw1/image/upload/v1732459883/kitenge-products/io33wwbjzubmbla6tht0.jpg",
      alt: "Custom Ankara Fashion 2",
    },
    {
      _id: "3",
      url: "https://res.cloudinary.com/dml1lihw1/image/upload/v1732459885/kitenge-products/example.jpg",
      alt: "Custom Ankara Fashion 3",
    },
  ];
  res.json(customImages);
});

module.exports = router;
