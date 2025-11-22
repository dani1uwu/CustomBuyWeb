// server.js — Backend en Node.js para generar preferencia Mercado Pago



import express from 'express';

import { MercadoPagoConfig, Preference } from 'mercadopago';

import cors from 'cors';



const app = express();

const PORT = 3001;



// 🔥 TU ACCESS TOKEN DE PRUEBA

const ACCESS_TOKEN = "TEST-5049491517719445-081403-f427df10652e4d8a47385ca7ad88e64a-1383510234";



// Inicializamos Mercado Pago

const client = new MercadoPagoConfig({

    accessToken: ACCESS_TOKEN

});



app.use(cors());

app.use(express.json());



// 🟦 Crear preferencia de pago

app.post('/api/create-preference', async (req, res) => {

    const { amount } = req.body;



    const preferenceBody = {

        items: [

            {

                title: "Taza personalizada Custom Buy",

                unit_price: amount || 174,

                quantity: 1

            }

        ]

    };



    try {

        const preference = new Preference(client);

        const response = await preference.create({ body: preferenceBody });



        console.log("Preferencia creada:");

        console.log("sandbox_init_point:", response.sandbox_init_point);



        // 🔥 ENVIAMOS LA URL CORRECTA PARA PAGAR (Sandbox)

        res.json({

            checkoutUrl: response.sandbox_init_point

        });



    } catch (error) {

        console.error("Error al crear preferencia:", error);

        res.status(500).send(

            `Error al crear preferencia: ${error.message || "Error desconocido"}`

        );

    }

});



// Iniciar servidor

app.listen(PORT, () => {

    console.log(`Backend corriendo en http://localhost:${PORT}`);

});