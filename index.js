const { request, req, response } = require('express')
const express = require('express')
const app = express()
var bodyParser = require('body-parser');

app.use(express.json({ extended: false }))
app.use(express.static('./views'))
app.set('view engine', 'ejs')
app.set('views', './views')

const AWS = require('aws-sdk')
var config = new AWS.Config({
    accessKeyId: 'AKIAZSGJBA6WNXYM2LHD',
    secretAccessKey: '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',
    region: 'ap-southeast-1',
})
AWS.config = config

var dynamoDB = new AWS.DynamoDB({
    region: 'ap-southeast-1',
    accessKeyId: 'AKIAZSGJBA6WNXYM2LHD',
    secretAccessKey: '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',
});

const docClient = new AWS.DynamoDB.DocumentClient()

const tableName = 'Table1'

const multer = require('multer')
const upload = multer()

app.get('/', (request, response) => {
    const params = {
        TableName: tableName,
    }

    docClient.scan(params, (err, data) => {
        if (err) {
            response.send(err)
        } else {
            return response.render('index', { sanPhams: data.Items })
        }
    })
})

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.post('/post', upload.fields([]), (request, response) => {
    const { ma_sp, ten_sp, so_luong } = request.body

    // const ma_sp = request.body.ma_sp
    // const ten_sp = request.body.ten_sp
    // const so_luong = request.body.so_luong

    const params = {
        TableName: tableName,
        Item: {
            'ma_sp': ma_sp,
            'ten_sp': ten_sp,
            'so_luong': so_luong,
        }
    }

    docClient.put(params, (err, data) => {
        if (err) {
            return response.send(err)
        } else {
            return response.redirect('/')
        }
    })
})

app.get('/delete/:id', upload.fields([]), (request, response) => {
    const listItems = Object.keys(request.body)
    console.log(request.body.ma_sp)

    const { id } = request.params
    console.log(id)



    var fileItem = {
        TableName: tableName,
        Key: {
            'ma_sp': {
                S: id
            }
        }
    }

    dynamoDB.deleteItem(fileItem, function(err, data) {
            if (err) {
                console.log(err, err.stack)
            } else {
                console.log(data)
                return response.redirect('/')
            }
        })
        // onDeleteItem(listItems.length - 1)

    // if (listItems.length === 0) {
    //     return response.redirect('/')
    // }

    // function onDeleteItem(index) {
    //     const params = {
    //         TableName: tableName,
    //         Key: {
    //             'ma_sp': listItems[i]
    //         }
    //     }

    //     docClient.delete(params, (err, data) => {
    //         if (err) {
    //             return response.send(err)
    //         } else {
    //             if (index > 0) {
    //                 onDeleteItem(index - 1)
    //             } else {
    //                 return response.redirect('/')
    //             }
    //         }
    //     })
    // }
    // onDeleteItem(listItems.length - 1)
})

app.listen(3000, () => {
    console.log('Port 3000')
})