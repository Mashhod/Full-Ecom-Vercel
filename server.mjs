import 'dotenv/config'
import express from 'express';
import { db } from './db.mjs';
import cors from 'cors'
import bcrypt, { hash } from 'bcryptjs';
import { customAlphabet } from 'nanoid';
import jwt from 'jsonwebtoken';
import path from 'path';
import cookieParser from 'cookie-parser';
import { profile } from 'console';
import Stripe from 'stripe';
import bodyParser from 'body-parser';



const app = express();

const PORT = 5004;

const SECRET = process.env.SECRET_TOKEN;
// const SECRET_KEY = process.env.STRIPE_SECRET_KEY

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json())
// app.use(cors())

// app.use(cors({
    //     origin: ["http://localhost/3000" , ""]
    // }))
    
    app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // your secret key

// app.get("/test-stripe", (req, res) => {
//     res.json({ key: process.env.STRIPE_SECRET_KEY ? "Loaded" : "Not Loaded" });
//   });
  

// app.get('/', async(req , res) => {
//     // res.send("Hello World ")

//     try{
//         let result = await db.query('SELECT * FROM users')
//         res.status(200).send({message: "success" , data: result.rows , result: result})

//     }catch (error) {
//         res.status(500).send({message: "Internal Server Error"})

//     }
// })


app.post('/api/v1/sign-up' , async(req , res) => {
    let reqBody = req.body;
    console.log("Api Hitted")
    if(!reqBody.firstName || !reqBody.lastName || !reqBody.email || !reqBody.password){
        res.status(400).send({message: "Required Parameter Missing"})
        return;
    } 
    reqBody.email = reqBody.email.toLowerCase();
    let query = `SELECT * FROM users WHERE email = $1`
    let value = [reqBody.email]

    try{
        let result = await db.query(query , value)
        // console.log(result);

        if(result.rows?.length){
            res.status(400).send({message: "User Already Exist With This Email"});
            return;
        }
        let addQuery = `INSERT INTO users(first_name , last_name, email, password) VALUES ($1 , $2, $3, $4)`
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(reqBody.password, salt);
        console.log("Hash" , hash)
        // console.log("Salt", salt , hash)
        // const nanoid = customAlphabet('1234567890', 6)
        let addValues = [reqBody.firstName, reqBody.lastName, reqBody.email, hash]
        let addUser = await db.query(addQuery ,  addValues)
        res.status(201).send({message: "User Created"})     
     }catch (error) {
        console.log("Error", error)
        res.status(500).send({message: "Internal Server Error"})

    }

})


  
  

app.post('/api/v1/login' , async(req , res) => {
    let reqBody = req.body;
    if(!reqBody.email || !reqBody.password){
        res.status(400).send({message: "Required Parameter Missing"})
        return;
    }
    reqBody.email = reqBody.email.toLowerCase();

    let query = `SELECT * FROM users WHERE email = $1`
    let value = [reqBody.email]

    try{
        let result = await db.query(query , value)
        if(!result.rows?.length){
            res.status(400).send({message: "User Doesn't exist with this Email"});
            return;
        }
        console.log("Result", result.rows)
        let isMatched = await bcrypt.compare(reqBody.password, result.rows[0].password); // true

        if(!isMatched){
            res.status(401).send({message: "Passsword did not Matched"});
            return;
        }
        
        let token = jwt.sign({ 
            id: result.rows[0].user_id,
            firstName: result.rows[0].first_name,
            lasttName: result.rows[0].last_name,
            email: result.rows[0].email,
            user_role: result.rows[0].user_role,
            // iat: Date.now() / 1000,
            // exp: (Date.now() / 1000) + (60*60*24) // 1 din seconds
         }, SECRET,{expiresIn: "1d"});

        res.cookie('Token', token, { 
        maxAge: 86400000, // 1 DAY
        httpOnly: true,
        secure: false,
        sameSite: "lax"
     });
        res.status(200);
        res.send({message: 'User Logged in' , user: {
            user_id: result.rows[0].user_id,
            first_name: result.rows[0].first_name,
            last_name: result.rows[0].last_name,
            email: result.rows[0].email,
            phone: result.rows[0].phone,
            user_role: result.rows[0].user_role,
            profile: result.rows[0].profile,
        },
    token: token})
        // res.status(200).send({message: "Testing" , result: result.rows , isMatched})
        
    
        
    

    }catch (error) {
        console.log("Error", error)
        res.status(500).send({message: "Internal Server Error"})

    }

});

app.get('/api/v1/logout', (req, res) => {
     res.cookie('Token', '', {
                    maxAge: 1,
                    httpOnly: true,
                    // sameSite: "none",
                    secure: true
                });
                res.status(200).send({message: "User Logout"})
})

app.use('/api/v1/*splat', (req, res, next) => {
    console.log("req?.cookies?.Token", req?.cookies?.Token)
    if(!req?.cookies?.Token){
        res.status(401).send({message: "Unathorized"})
        return;
    }

    // const authHeader = req.headers["authorization"];
    // if (!authHeader) {
    //   return res.status(401).json({ message: "No token provided" });
    // }

    // // Format: "Bearer <token>"
    // const token = authHeader.split(" ")[1];
    // console.log("Header Token:", token);

    jwt.verify(req?.cookies?.Token, SECRET, (err, decodedData) => {
        if(!err){
            console.log("decodedData", decodedData);

            const nowDate = new Date().getTime() / 1000

            if(decodedData.exp < nowDate){
                res.status(401);
                res.cookie('Token', '', {
                    maxAge: 1,
                    httpOnly: true,
                    sameSite: "lax",
                    secure: true
                });
                res.send({message: "Token Expired"})
            
            }else{
                console.log("token approved");

                req.body = {
                    ...req.body,
                    token: decodedData
                }
                next();
            }

        }else{
            res.status(401).send({message: "Invalid token"})
        }

    } )

});


// // Middleware to verify token
// const verifyToken = (req, res, next) => {
//     try {
//       const authHeader = req.headers.authorization;
//       if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
  
//       const token = authHeader.split(" ")[1]; // Bearer token
//       const decoded = jwt.verify(token, SECRET); // JWT secret
//       req.user = decoded; // attach user info to request
//       next();
//     } catch (err) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//   };
  
//   // POST /create-checkout-session
//   app.post("/create-checkout-session", verifyToken, async (req, res) => {
//     try {
//       const { items } = req.body;
  
//       if (!items || items.length === 0)
//         return res.status(400).json({ message: "No items in cart" });
  
//       // Prepare Stripe line items
//       const lineItems = items.map(item => ({
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: item.product_name,
//           },
//           unit_amount: Math.round(item.price * 100), // price in cents
//         },
//         quantity: item.quantity,
//       }));
  
//       const session = await stripe.checkout.sessions.create({
//         payment_method_types: ["card"],
//         line_items: lineItems,
//         mode: "payment",
//         success_url: "http://localhost:3000/success",
//         cancel_url: "http://localhost:3000/cancel",
//         customer_email: req.user.email, // optional
//       });
  
//       res.json({ id: session.id }); // session id for frontend
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Server error", error: err.message });
//     }
//   });

// app.use('/api/v1/*', (req, res, next) => {
//     const authHeader = req.headers["authorization"];
//     if (!authHeader) {
//       return res.status(401).json({ message: "No token provided" });
//     }
  
//     const token = authHeader.split(" ")[1];
//     console.log("Header Token:", token);
  
//     jwt.verify(token, SECRET, (err, decodedData) => {
//       if (err) {
//         console.log("JWT Error:", err.message);
//         return res.status(401).json({ message: "Invalid or expired token" });
//       }
  
//       console.log("decodedData", decodedData);
//       console.log("token approved");
  
//       req.user = decodedData; // ✅ safe jagah pe decoded token rakho
//       next();
//     });
//   });
  


// =======================
// Middleware: Verify Token
// =======================
// ========================
// JWT Middleware (Cookie)
// ========================
const verifyToken = (req, res, next) => {
    const token = req.cookies?.Token;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
  
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        console.log("JWT Error:", err.message);
        return res.status(401).json({ message: "Invalid or expired token" });
      }
  
      req.user = decoded; // attach user info
      next();
    });
  };
  
// ========================
// Checkout Session (Cookie Based)
// ========================
app.post("/api/v1/create-checkout-session", verifyToken, async (req, res) => {
    try {
      const { items } = req.body;
      if (!items || items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
  
      const lineItems = items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.product_name, },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      }));
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
        customer_email: req.user.email // ✅ user email from token
      });
      console.log("S_K", process.env.STRIPE_SECRET_KEY)
      res.json({ id: session.id });
    } catch (error) {
      console.error("Checkout Error:", error.message);
      res.status(500).json({ message: "Something went wrong", error: error.message });
    }
  });
    
  app.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;
  
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // in cents (e.g., $10 = 1000)
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  });

app.get('/api/v1/profile', (req, res) => {
    console.log("reqBody", req.body);
    res.status(200).send({message: "user found"})
})


app.get('/api/v1/user-detail', async(req, res) => {
    let userToken = req.body.token;
    let query = `SELECT * FROM users WHERE user_id = $1`;
    let values = [userToken.id];
    try{
        let result = await db.query(query, values)
        res.status(200).send({message: "User Found", user: {
            user_id: result.rows[0].user_id,
            first_name: result.rows[0].first_name,
            last_name: result.rows[0].last_name,
            email: result.rows[0].email,
            phone: result.rows[0].phone,
            user_role: result.rows[0].user_role,
            profile: result.rows[0].profile
        }})
    
    }catch (error) {
        console.log("Error", error);
        res.status(500).send({message: "Internal Server Error"});
    }
});

app.get('/api/v1/categories' , async(req , res) => {
    try{
        let result = await db.query(`SELECT * FROM categories`);
        res.status(200).send({message: "Categories Found" , category_list: result.rows})

    }catch (error) {
        res.status(500).send({message: "Internal Server Erroe"})

    }
});


// app.get('/api/v1/products' , async(req , res) => {
//     const { category } = req.query;
//     console.log("category", category)
//     try{
//         let result = await db.query(`SELECT p.product_id, p.product_name, p.price, p.images, p.description, p.original_price,
//         p.created_at, c.category_name FROM products AS p 
//         INNER JOIN categories c ON p.category_id = c.category_id`
//     );

    
//     // Agar category param aya to filter lagao
//     // if (category) {
//     //     query += ` WHERE c.category_id = $1`;
//     //     const result = await db.query(query, [category]);
//     //     return res.status(200).send({ message: 'Product Found', products: result.rows });
//     //   }
        
//     // Agar category param nahi aya to saare products
//         // const result = await db.query(query);
//         res.status(200).send({message: 'Product Found' , products: result.rows })


//     }catch (error) {
//         console.log("Error" , error)
//         res.status(500).send({message: 'Internal Server Error'})

//     }

// });

app.get('/api/v1/products', async (req, res) => {
    const { category } = req.query;
    console.log("category query param =>", category);
  
    try {
      let query = `
        SELECT p.product_id, p.product_name, p.price, p.images, p.description, p.original_price,
               p.created_at, c.category_name, c.category_id
        FROM products AS p 
        INNER JOIN categories c ON p.category_id = c.category_id
      `;
  
      let values = [];
      if (category) {
        query += ` WHERE c.category_id = $1`;
        values.push(category);
      }
  
      const result = await db.query(query, values);
      res.status(200).send({ message: 'Product Found', products: result.rows });
    } catch (error) {
      console.log("Error", error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  });
  

app.use('/api/v1/*splat' , (req, res, next) => {
    if (req.body.token.user_role != 1) {
        res.status(401).send({
            message: "Unauthorized"
        })
        return;
    }else{
        next();
    }
});

app.post('/api/v1/category' , async(req, res) =>{
    let reqBody = req.body
    if(!reqBody.name || !reqBody.description || !reqBody.image){
        res.status(400).send({message: "Required Parameter Missing"})
        return;
    }

    try{
        let query = `INSERT INTO categories(category_name , category_description, category_image) VALUES($1 , $2, $3)`;
        let values= [reqBody.name , reqBody.description, reqBody.image];
        let result =  await db.query(query ,values);
        res.status(201).send({message: " category Added"});

    }catch (error) {
        console.log("Error" , error)
        res.status(500).send({message: "Internal Server Error" , Error: error})

    }
});

app.post('/api/v1/product' , async(req, res) =>{
    // let reqBody = req.body
    let {name, description, price, category_id, images, original_price} = req.body;
    if(!name || !description || !price || !category_id || !images || !original_price){
        res.status(400).send({message: "Required Parameter Missing"})
        return;
    }

    try{

            if (!Array.isArray(images)) {
      return res.status(400).send({ message: "Images must be an array of URLs" });
    }


        let query = `INSERT INTO products(product_name, price, description, images, category_id, original_price) VALUES($1 , $2, $3, $4, $5, $6)`;
        let values= [name, price,  description, JSON.stringify(images), category_id, original_price];
        let result =  await db.query(query ,values);
        res.status(201).json({message: " Product Added",  product: result.rows[0],  });

    }catch (error) {
        console.log("Error" , error)
        res.status(500).send({message: "Internal Server Error" , Error: error})

    }
});


  



const _dirname = path.resolve(); //'D:\Saylani Batch 12\Express Js\react-with-server\03-Project-COMPELETE-ECOM'
// const fileLocation = path.join(_dirname , './web/build')
// app.use('/', express.static(fileLocation))
app.use('/' , express.static(path.join(_dirname , './frontend/build')))
app.use('/*splat' , express.static(path.join(_dirname , './frontend/build')))


app.listen(PORT , () => {
    console.log(`Server is Runnig ${PORT}`)
})