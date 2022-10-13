const PORT =process.env.PORT || 8000

const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const newspapers =[
      {
            name:"thetimes",
            adress:"https://www.thetimes.co.uk/environment",
            base:'',
      },
      {
            name:"indianexpress",
            adress:"https://indianexpress.com/?s=climate",
            base:'',
      },
      {
            name:"hindustantimes",
            adress:"https://economictimes.indiatimes.com/topic/climate",
            base:'https://economictimes.indiatimes.com',
      },
      {
            name:"cnn",
            adress:"https://edition.cnn.com/specials/world/cnn-climate",
            base:'https://edition.cnn.com'
      },

      {
            name:"bbc",
            adress:"https://www.bbc.com/news/science-environment-56837908",
            base:'https://www.bbc.com',
      },
      {
            name:"thetimesofindia",
            adress:"https://timesofindia.indiatimes.com/topic/climate-change",
            base:'',
      },
      {
            name:"indiatoday",
            adress:'https://www.indiatoday.in/environment',
            base:'https://www.indiatoday.in'
      },
      {
            name:"timesnow",
            adress:'https://www.timesnownews.com/search-result/climate',
            base:'https://www.timesnownews.com'
      }
]
const app = express()
const articles =[]
newspapers.forEach(newspaper =>{
      axios.get(newspaper.adress)
            .then((response)=>{
                  const html = response.data
                  const $ = cheerio.load(html)
                  $('a:contains("climate")',html).each(function (){
                        const title = $(this).text()
                        const url = $(this).attr('href')
                        articles.push({
                              title,
                              url:newspaper.base+url,
                              source :newspaper.name
                        })
                  })
            }).catch((err)=>console.log(err))
})
app.get('/',(req,res)=>{res.json('Try endpoints i.e. /news')})
app.get('/news',(req,res)=>{
      res.json(articles)
})

app.get('/news/:newspaperId',(req,res)=>{
      const newspaperId = req.params.newspaperId
      const newspaperadress = newspapers.filter(newspaper=>newspaper.name == newspaperId)[0].adress
      const newspaperbase = newspapers.filter(newspaper=>newspaper.name == newspaperId)[0].base
      axios.get(newspaperadress)
            .then(response=>{
                  const html = response.data
                  const $ = cheerio.load(html)
                  const specificarticle=[]

                  $('a:contains("climate")',html).each(function(){
                        const title = $(this).text()
                        const url = $(this).attr("href")
                        specificarticle.push({title,url:newspaperbase+url,source:newspaperId})
                  })
                  res.json(specificarticle)
            }).catch((err)=>{console.log(err)})
            
})

app.listen(PORT,()=>console.log(`server is running on port : ${PORT}`));

