const request = require('supertest');
const app = require('../app');
const Product = require('../models/Product');
require('../models')

let cartId;
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

test("POST / carts should creata one cart", async() => {
    const product = await Product.create({
        title: "notebook apple 2",
        description: "jblkjscdnbkñnsdlklskdajmlkfcsjlkdsklcdcsd",        
        price: 1000
    })
    const cart = {
        productId: product.id,   
        quantity: 3
    }
    const res = await request(app)
        .post('/carts')
        .send(cart)
        .set('Authorization', `Bearer ${token}`)
        cartId = res.body.id
        await product.destroy()
    expect(res.status).toBe(201)
    expect(res.body.quantity).toBe(cart.quantity)
});

test("GET /carts should return all carts", async() => {
    const res = await request(app)
        .get('/carts')
        .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)       
});

test("PUT /carts/:id should update one cart", async() => {
    const body = {
        quantity: 4
    }
    const res = await request(app)
        .put(`/carts/${cartId}`)
        .send(body)
        .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.quantity).toBe(body.quantity)
});

test("DELETE /carts/:id should delete a cart", async() => {
    const res = await request(app)
        .delete(`/carts/${cartId}`)
        .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(204)    
});
