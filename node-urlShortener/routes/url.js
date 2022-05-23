const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const shortid = require('shortid')
const config = require('config');

const Url = require('../models/Url');


//@route  POST /api/url/shorten
//@desc Create short url
router.post('/shorten', async (req, res) =>{
    const { longUrl } = req.body;
    const baseUrl = config.get('baseUrl');
    
    //check base url
    if (!validUrl.isUri(baseUrl)){
       return res.status(401).json('Invalid base url');
    }


    //create url code
    const urlCode = shortid.generate();

    //check long url

    if(validUrl.isUri(longUrl)) {
       try {
           let url = await Url.findOne({longUrl});
           if(url) {
               res.json(url);
           } else {
               const shortUrl = baseUrl + '/' + urlCode;
               url = new Url({
                   longUrl,
                   shortUrl,
                   urlCode,
                   date: new Date()
               });
               await url.save();
               res.json(url);
           }
       } catch (error) {
           console.log(err);
           res.status(500).json('Server Error')
       }
    } else {
        res.status(401).json('invalid long url')
    }
});

module.exports = router;