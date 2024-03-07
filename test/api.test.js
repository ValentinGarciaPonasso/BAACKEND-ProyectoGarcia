import * as chai from "chai"
import supertest from "supertest"
import mongoose from "mongoose"

import databseConfig from "./../src/config/databse.js"
mongoose.connect(databseConfig.URL);

const expect = chai.expect;

const requester = supertest("http://localhost:8080");

describe('Testing de la API', () => {
    describe('Test de products', () => {
        const bodyProducts = {
            title: 'Prueba',
            description: 'Es una descripción de pruebas',
            code: 'test001',
            price: 1000,
            available: true,
            stock: 100,
            category: 'prueba',
            thumbnail: 'www.img.com'
        }

        it('El endpoint POST /api/products debe poder crear una producto correctamente', async () => {
            const response = await requester.post('/api/products').send(bodyProducts)

            expect(response.body.payload).to.have.property('_id')
            expect(response.statusCode).to.equal(200)
        })

    })

    ////////////////////////////////////////////////////

    describe('Test de login, captura y uso de token en una ruta protegida', () => {
        const cookie = {}

        before(async function () {
            this.timeout(5000)
            await mongoose.connection.collections.users.deleteMany({})
        })

        it('Debe registrar correctamente a un usuario', async () => {
            const mockUser = {
                first_name: 'Titin',
                last_name: 'Naran',
                email: 'titin@naran.com',
                password: 'titin123',
            }

            const { body } = await requester
                .post('/api/sessions/register')
                .send(mockUser)

            expect(body.payload).to.be.ok
            expect(body).to.have.property('payload')
            expect(body).to.have.property('status')
            expect(body.status).to.equal('success')
        })

        it('Debe devolver correctamente al usuario y devolver una cookie', async () => {
            const mockUserLogin = {
                email: 'titin@naran.com',
                password: 'titin123',
            }

            const response = await requester
                .post('/api/sessions/login')
                .send(mockUserLogin)

            const coderCookie = response.headers['set-cookie'][0]
            expect(coderCookie).to.be.ok

            cookie.name = coderCookie.split('=')[0]
            cookie.value = coderCookie.split('=')[1]

            expect(cookie.name).to.be.ok.and.equal('coderCookie')
            expect(cookie.value).to.be.ok
        })

        it('Debe enviar la cookie que contiene el usuario y destructurar este correctamente', async () => {
            const { body } = await requester
                .get('/api/sessions/current')
                .set('Cookie', [`${cookie.name}=${cookie.value}`])
        })
    })

    describe('Testear carga de imágenes', () => {
        it('Debe poderse crear una mascota con la ruta de la imagen', async () => {
            const petMock = {
                name: 'Poncho',
                specie: 'Pez',
                birthDate: '10-18-2022',
            }

            const result = await requester
                .post('/api/pets/withimage')
                .field('name', petMock.name)
                .field('specie', petMock.specie)
                .field('birthDate', petMock.birthDate)
                .attach('image', process.cwd() + '/test/pikachu.png')

            expect(result.status).to.be.equal(201)
            expect(result.body.payload).to.have.property('_id')
            expect(result.body.payload.image).to.be.ok
        })
    })
})