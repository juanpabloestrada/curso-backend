class ProductManager {
    constructor() {
        this.products = [];
        this.productIdCounter = 1;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        // Validar que todos los campos sean obligatorios
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error('Todos los campos son obligatorios');
            return;
        }

        // Validar que no se repita el campo "code"
        const existingProduct = this.products.find(product => product.code === code);
        if (existingProduct) {
            console.error('El código del producto ya existe');
            return;
        }

        const product = {
            id: this.productIdCounter++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        this.products.push(product);
        console.log('Producto agregado correctamente:', product);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            console.error('Producto no encontrado');
            return;
        }
        return product;
    }
}

// Ejemplo de uso:
const productManager = new ProductManager();

productManager.addProduct('Producto 1', 'Descripción del producto 1', 10.99, 'imagen1.jpg', 'P001', 100);
productManager.addProduct('Producto 2', 'Descripción del producto 2', 19.99, 'imagen2.jpg', 'P002', 50);

console.log(productManager.getProducts());
console.log(productManager.getProductById(1));
console.log(productManager.getProductById(3));