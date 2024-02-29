const express = require('express');
const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([]));
        }
    }

    addProduct(product) {
        const products = this.getProducts();
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            console.error("Todos los campos son obligatorios.");
            return;
        }
        if (products.some(p => p.code === product.code)) {
            console.error("El código de producto ya existe.");
            return;
        }
        product.id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        products.push(product);
        fs.writeFileSync(this.path, JSON.stringify(products));
    }

    getProducts() {
        const data = fs.readFileSync(this.path);
        return JSON.parse(data);
    }

    getProductById(id) {
        const products = this.getProducts();
        const product = products.find(p => p.id === id);
        if (!product) {
            console.error("Producto no encontrado.");
            return null;
        }
        return product;
    }

    updateProduct(id, updatedProduct) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) {
            console.error("Producto no encontrado.");
            return;
        }
        products[index] = { ...products[index], ...updatedProduct };
        fs.writeFileSync(this.path, JSON.stringify(products));
    }

    deleteProduct(id) {
        let products = this.getProducts();
        products = products.filter(p => p.id !== id);
        fs.writeFileSync(this.path, JSON.stringify(products));
    }
}

const app = express();
app.use(express.json());

const productManager = new ProductManager('products.json');

app.get('/products', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    let products = productManager.getProducts();
    if (limit !== null) {
        products = products.slice(0, limit);
    }
    res.json(products);
});

app.get('/products/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = productManager.getProductById(productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Producto no encontrado.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});