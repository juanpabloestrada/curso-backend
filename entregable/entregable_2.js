const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async addProduct(product) {
        try {
            const products = await this.getProductsFromFile();
            const newProduct = {
                id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
                ...product
            };
            products.push(newProduct);
            await this.saveProductsToFile(products);
            return newProduct;
        } catch (error) {
            throw new Error(`Error adding product: ${error.message}`);
        }
    }

    async getProducts() {
        try {
            return await this.getProductsFromFile();
        } catch (error) {
            throw new Error(`Error getting products: ${error.message}`);
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProductsFromFile();
            return products.find(product => product.id === id);
        } catch (error) {
            throw new Error(`Error getting product by ID: ${error.message}`);
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            let products = await this.getProductsFromFile();
            const index = products.findIndex(product => product.id === id);
            if (index !== -1) {
                products[index] = { ...products[index], ...updatedFields };
                await this.saveProductsToFile(products);
                return products[index];
            } else {
                throw new Error('Product not found');
            }
        } catch (error) {
            throw new Error(`Error updating product: ${error.message}`);
        }
    }

    async deleteProduct(id) {
        try {
            let products = await this.getProductsFromFile();
            products = products.filter(product => product.id !== id);
            await this.saveProductsToFile(products);
        } catch (error) {
            throw new Error(`Error deleting product: ${error.message}`);
        }
    }

    async getProductsFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // If file doesn't exist yet, return an empty array
                return [];
            }
            throw error;
        }
    }

    async saveProductsToFile(products) {
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    }
}

// Ejemplo de uso:
const productManager = new ProductManager('products.json');

(async () => {
    try {
        await productManager.addProduct({
            title: 'Product 1',
            description: 'Description of product 1',
            price: 10.99,
            thumbnail: 'path/to/thumbnail1.jpg',
            code: 'ABC123',
            stock: 100
        });

        await productManager.addProduct({
            title: 'Product 2',
            description: 'Description of product 2',
            price: 20.49,
            thumbnail: 'path/to/thumbnail2.jpg',
            code: 'DEF456',
            stock: 50
        });

        console.log(await productManager.getProducts());
        console.log(await productManager.getProductById(1));
        await productManager.updateProduct(1, { price: 15.99 });
        console.log(await productManager.getProducts());
        await productManager.deleteProduct(2);
        console.log(await productManager.getProducts());
    } catch (error) {
        console.error(error);
    }
})();