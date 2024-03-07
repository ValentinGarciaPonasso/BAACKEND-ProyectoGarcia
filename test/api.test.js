import * as chai from "chai"
import supertest from "supertest"
import mongoose from "mongoose"
import "dotenv/config.js"

// import databseConfig from "./../src/config/databse.js"
mongoose.connect(process.env.mongo);

const expect = chai.expect;

const requester = supertest("http://localhost:8080");


describe('Testing de la API', () => {
    /////////ROUTER DE PRODUCTS////////
    describe('Test de products', () => {
        const bodyProducts = {
            title: 'Prueba',
            description: 'Es una descripción de pruebas',
            code: 'test001012',
            price: 1000,
            available: true,
            stock: 100,
            category: 'prueba',
            thumbnail: 'www.img.com'
        }

        it('El endpoint POST /api/products debe poder crear una producto correctamente', async () => {
            const response = await requester.post('/api/products').send(bodyProducts)

            // expect(response.body).to.have.property('message').equal('Producto agregado');
            // expect(response.body).to.have.property('data');
            expect(response.statusCode).to.equal(200)
        })
    })


    /////////ROUTER DE CARTS////////
    describe('Test de cart', () => {

        it('El endpoint POST /:cid/productos/:pid debe poder agregar un producto correctamente a un carrito', async () => {
            const cid = 1;
            const pid = 5;
            const response = await requester.post(`/api/cart/${cid}/productos/${pid}`)
            expect(response.body).to.have.property('massage').equal('Producto agregado al carrito');
            expect(response.body).to.have.property('data');
            expect(response.statusCode).to.equal(200)
        })
    })

    /////////ROUTER DE SESSIONS////////

    describe('Test de Session', () => {

        it('El endpoint POST /register no debe poder registrar un usuario existente', async () => {
            const newUser = {
                first_name: 'prueba 1',
                last_name: 'prueba 1',
                email: 'prueba8@prueba.com',
                age: 99,
                password: 'prueba'
            };
            const response = await requester.post(`/api/sessions/register`).send(newUser)
            expect(response.statusCode).to.equal(400)
        })
    })
})