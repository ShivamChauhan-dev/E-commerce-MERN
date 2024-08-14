const port = 4000;
const express = require("express")
const app = express();
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");

app.use(express.json());
app.use(cors());

// Database Connection with mongodb
mongoose.connect("mongodb+srv://Shivam:Chauhan1234@ecommerce.i7iap.mongodb.net/e-commerce");

//API Creation

app.get("/",(req,res)=>{
    res.send("Express App is Running");
})

//Image Storage Engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

const upload = multer({storage:storage});

// Crating Upload Endpoint for images
app.use('/images',express.static('upload/images'));

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

//Schema for Creating Products

const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: { 
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
});

app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if(products.length>0)
    {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;

    }
    else{
        id=1;
    }

    const product = new Product({ 
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });

    console.log(product);
    
    try {
        await product.save();
        console.log("Saved");
        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        console.error("Error saving product:", error);
        res.status(500).json({
            success: false,
            message: "Failed to save product",
        });
    }
});

//Creating API For deleting Products

app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
    
});

//Create API For getting all products
app.get('/allproducts', async(req,res)=>{
    let products = await Product.find({});
    console.log("All Product Fetched")
    res.send(products);

})

// Schema creating for User Modle

const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

// Create Endpoint for Registering the User
app.post('/signup', async (req, res) => {  

    try {
        // Check if the user with the same email already exists
        let check = await Users.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ success: false, error: "Existing user found with the same email address" });
        }

        // Initialize a cart with 300 items, all set to 0
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        // Create a new user with the provided details
        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            cartData: cart,
        });

        // Save the new user to the database
        await user.save();

        // Create a payload with the user's id
        const data = {
            user: {
                id: user.id
            }
        };

        // Sign the JWT token with the payload and a secret key
        const token = jwt.sign(data, 'secret_ecom');

        // Respond with the token
        res.json({ success: true, token });

    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Login Endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists with the provided email
    const user = await Users.findOne({ email });
    if (!user) {
        return res.status(400).json({ success: false, error: "User not found" });
    }

    // Check if the provided password matches the stored password
    if (user.password !== password) {
        return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    // If user exists and password is correct, generate a JWT token
    const data = {
        user: {
            id: user.id
        }
    };

    const token = jwt.sign(data, 'secret_ecom', { expiresIn: '1h' }); // Token expires in 1 hour

    // Respond with the token
    res.json({ success: true, token });
});

//create endpoint for new collection
app.get('/newcollection',async(req,res)=>{
    let products = await Product.find({});
    let newcollections = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollections)
})

app.listen(port, (error)=>{
    if(!error){
        console.log("Server Running on port "+ port);
    }
    else{
        console.log("Error : "+ error);
    }
});


