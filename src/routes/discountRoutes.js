const express = require('express');
const router = express.Router();

router.get('/discount-products', (req, res) => {
  const products = [
    {
      id: 1,
      image: "https://res.cloudinary.com/dml1lihw1/image/upload/v1732459880/kitenge-products/uhsqtwgdbhnqjznylvkc.jpg",
      title: "Kitenge / Ankara Fabric 1",
      discountDates: "15th Oct - 30th Nov",
      description: "Beautiful fabric for every craft project.",
      originalPrice: "Ksh 7,740",
      discountPrice: "Ksh 5,500",
    },
    {
      id: 2,
      image: "https://res.cloudinary.com/dml1lihw1/image/upload/v1732459883/kitenge-products/io33wwbjzubmbla6tht0.jpg",
      title: "Kitenge / Ankara Fabric 2",
      discountDates: "15th Oct - 30th Nov",
      description: "Elegant patterns for every occasion.",
      originalPrice: "Ksh 8,990",
      discountPrice: "Ksh 6,500",
    },
  ];
  res.json(products);
});

module.exports = router;
