const express = require("express");
const ProductService = require("./ProductService");
const app = express();
const port = 3000;
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//////GET HOMEPAGE//////
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//----------------------PRODUCTS------------------------//

//////GET PRODUCTS//////
app.get("/products", async (req, res) => {
  let products = await ProductService.getProducts();
  res.json(products);
});

app.get("/products/:id", async (req, res) => {
  let id = req.params.id;
  let product = await ProductService.getProductById(id);
  if (!product || !product[0]) {
    res.status(404).send("Product not found");
  } else res.json(product);
});

////ADD PRODUCTS//////
app.post("/products", async (req, res) => {
  let productInput = req.body;
  // console.log(`index file : ${product.id}`);
  let resultOfRequest = await ProductService.addProduct(productInput);
  res.status(201).json(resultOfRequest);
});

/////DELETE PRODUCTS////

app.delete("/products/:id", async (req, res) => {
  let id = req.params.id;
  let product = await ProductService.getProductById(id);
  if (!product || !product[0]) {
    res.status(404).send("Product not found");
  } else {
    ProductService.deleteProductById(id);
    res.status(200).send("Product Deleted Successfully");
  }
});

/////CHANGE PRODUCTS PATCH////
app.patch("/products/:id", async (req, res) => {
  let id = req.params.id;
  let productInput = req.body;
  let product = await ProductService.getProductById(id);
  if (!product || !product[0]) {
    ProductService.addProduct(productInput);
    res.status(201).send(productInput);
  } else {
    ProductService.changeProductById(id, productInput);
    res.status(200).send("Product Altered(Patch) Successfully");
  }
});

/////CHANGE PRODUCTS PUT////

app.put("/products/:id", async (req, res) => {
  let id = req.params.id;
  let productInput = req.body;
  let product = await ProductService.getProductById(id);
  if (!product || !product[0]) {
    ProductService.addProduct(productInput);
    res.status(200).send("Product not found but added successfully");
  } else {
    //first delete and then add
    ProductService.deleteProductById(id);
    ProductService.addProduct(productInput);
    res.status(200).send("Product found and Altered(Put) Successfully");
  }
});

////PORT LISTEN/////
app.listen(port, () => {
  console.log(`Product app listening on port ${port}`);
});
