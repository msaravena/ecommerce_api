const request = require('supertest');
const app = require('../app');
const ProductImg = require('../models/ProductImg');
require('../models')

let productId;
let token;

beforeAll(async() => {
    const credentials = {
        email: "test@gmail.com",
        password: "test1234"
    }
    const res = await request(app)
        .post('/users/login')
        .send(credentials)
    token = res.body.token
})

test("POST /products should create a product", async() => {
    const newProduct = {
        title: "notebook apple",
        description: "jblkjscdnbkñnsdlklskdajmlkfcsjlkdskl",        
        price: 1000
    }
    const res = await request(app)
        .post('/products')
        .send(newProduct)
        .set('Authorization', `Bearer ${token}`)
    productId = res.body.id
    expect(res.status).toBe(201)
    expect(res.body.title).toBe(newProduct.title)
});

test("GET /products should return all products", async() => {
    const res = await request(app).get('/products')    
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)        
});

test("GET /products/:id should return one product", async() => {
    const res = await request(app).get(`/products/${productId}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(productId)            
});

test("PUT /products/:id should update a product", async() => {
    const body = {
        title: "notebook apple pro"
    }
    const res = await request(app)
        .put(`/products/${productId}`)
        .send(body)
        .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.title).toBe(body.title)
});

test("POST /products/:id/images should set the product images", async() => {
    const image = await ProductImg.create({
        url: "j..kjscnljaks",
        filename: "jnkjkllkl"
    })
    const res = await request(app)
        .post(`/products/${productId}/images`)
        .send([image.id])
        .set('Authorization', `Bearer ${token}`)
        await image.destroy()
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)    
});

test("DELETE /products/:id should delete a product", async() => {
    const res = await request(app)
        .delete(`/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(204)
});