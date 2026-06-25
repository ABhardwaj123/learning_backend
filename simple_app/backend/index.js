//express is a web framework

//another syntax for import
// const express = require('express')

import express from 'express'
import dotenv from 'dotenv';

dotenv.config();

const app = express()

const PORT = process.env.PORT 


app.get('/api/jokes' , (req , res) => {
    const jokes = [
        {
            id: 1,
            title: "Why don't programmers like nature?",
            content: "It has too many bugs."
        },
        {
            id: 2,
            title: "Why do Java developers wear glasses?",
            content: "Because they don't C#."
        },
        {
            id: 3,
            title: "How many programmers does it take to change a light bulb?",
            content: "None. That's a hardware problem."
        },
        {
            id: 4,
            title: "Why was the computer cold?",
            content: "Because it forgot to close its Windows."
        },
        {
            id: 5,
            title: "Why did the developer go broke?",
            content: "Because they used up all their cache."
        }
    ];

    res.send(jokes)
})

app.listen(PORT , () => {
    console.log(`running at port ${PORT}`)
})
