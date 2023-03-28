const request = require('supertest');
const app = require('../app');
const Cart = require('../models/Cart');
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
require('../models')

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

describe("Purchase tests", () => {
  let cartId;
  let product;

  beforeAll(async() => {
    product = await Product.create({
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
  })

  afterAll(async() => {
    await product.destroy();
  })

  test("POST /purchases should create a purchase and delete the cart", async() => {
    const res = await request(app)
      .post('/purchases')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    const purchases = await Purchase.findAll()
    expect(purchases).toHaveLength(1)
    const carts = await Cart.findAll()
    expect(carts).toHaveLength(0)
  })

  test("GET /purchases should return all purchases of the user", async() => {
    const res = await request(app)
      .get('/purchases')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
  })

})
