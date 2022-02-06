require('dotenv').config();


const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json())

let refreshTokens = []


app.post('/token',(req,res)=>{
    const refreshToken = req.body.token;
    if(refreshToken == null) return res.sendStatus(401)
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESHTOKEN, (err,user)=>{
        if(err) return res.sendStatus(404)
        const accessToken = createAccessToken({ name: user.name })
        res.json({accessToken: accessToken})
    })
})


app.post('/login', (req,res)=>{
    const username = req.body.username;
    const user = { name: username };
    const accessToken = createAccessToken(user);
    const refreshToken = jwt.sign(user,process.env.REFRESHTOKEN);
    refreshTokens.push(refreshToken);
    res.json({ accessToken:accessToken ,  refreshToken:refreshToken}) 
})

 createAccessToken = (user) =>{
    return  jwt.sign(user,process.env.ACCESSTOKEN, {expiresIn: '20s'});
}


app.delete('/logout', (req,res)=>{
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
})
app.listen(4000, ()=>{
    console.log('connected to 4000')
});