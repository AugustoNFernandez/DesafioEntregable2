const fs = require('fs');

class ProductManager {
    constructor() {
      this.products = [];
      this.path = './listaProductos.txt'; 
      this.idCounter = 0;
    }

    addProduct = async (title, description, price, thumbnail, code,stock) => {
      if(!this.products.some((p) => p.code === code)){
      
        this.idCounter++;

        let newProduct = {
          id: this.idCounter, // asigno un id autogenerado y que incrementa
          title, 
          description, 
          price, 
          thumbnail, 
          code,
          stock
        };

        this.products.push(newProduct)
        console.log(`Tu producto ${title} fue agregado`)
              
        await fs.promises.writeFile(this.path, JSON.stringify(this.products));
      }else {
        console.error(`Ya se encuentra agregado el producto código ${code}`)
      }
    };
    
    readP = async () => {
      let resp = await fs.promises.readFile(this.path, "utf-8")
      return JSON.parse(resp) 
    }

    getProducts = async () => {
      let response2 = await this.readP() 
      return console.log(response2) 
      
    }

    getProductsById = async (id) => {
      let response3 = await this.readP()
      if (!response3.find(product => product.id === id)){
        console.log("Producto no encontrado")
      }else{
        console.log(response3.find((product) => product.id === id))
      }     
    };
    deleteProductsById = async (id) => {
      let response3 = await this.readP();
      let productFilter = response3.filter(products => products.id != id)

      await fs.promises.writeFile(this.path, JSON.stringify(productFilter));
      console.log("El producto fue eliminado")
    };
    updateProducts = async ({id, ...producto}) => {
        await this.deleteProductsById(id)
        let productOld = await this.readP()
        console.log(productOld);

        let modifyP = [
          { ...products, id}, 
          ...productOld
        ];
        await fs.promises.writeFile(this.path, JSON.stringify(modifyP));
        console.log(modifyP);
    };
}


// Instanciar la clase creada
const products = new ProductManager
// Agregar productos
products.addProduct("Disco", "Disco de prueba", 20000, "Sin imagen", "abc123",25 );
console.log(`---------------------------------------`);
//producto repetido, rechazado a ingresar
products.addProduct("Disco", "Disco de prueba", 20000, "Sin imagen", "abc123",25 );
console.log(`---------------------------------------`);
// nuevo producto  a ingresar
products.addProduct("Libro", "Libro de prueba", 15000, "Sin imagen", "abc124",50 );
console.log(`---------------------------------------`); 
// recuperar todos los productos pusheados
console.log(products.getProducts());
console.log(`---------------------------------------`); 
//traer producto por id, no existe el id 3
products.getProductsById(3)
console.log(`---------------------------------------`); 
products.deleteProductsById(2);
console.log(`---------------------------------------`); 
products.updateProducts({
  id: 3,
  title: 'Disco 2',
  description: 'Disco de prueba 2',
  price: 25000,
  thumbnail: 'Sin imagen',
  code: 'abc124',
  stock: 25
})