const {User, Account} = require("./model");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const zod = require("zod");

const signupSchema = zod.object({
  email: zod.string().email(),
  password: zod.string(),
  firstname: zod.string(),
  lastname: zod.string(),
});

const updateSchema = zod.object({
  password: zod.string().optional(),
  firstname: zod.string().optional(),
  lastname: zod.string().optional(),
});

exports.createUser = async (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  try {
    if (!email || !password || !firstname || !lastname) {
      throw new Error("All fields are rqeuired");
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      throw new Error("user already exist with that email");
    }

    if (
      !signupSchema.safeParse({ email, password, firstname, lastname })
        .success
    )
      throw new Error("Invalid inputs");

    const user = await User.create({ email, password, firstname, lastname });

    await Account.create({userId:user._id,balance:Math.floor(Math.random()+1000)+1});


    res
      .status(201)
      .json({ message: "user created sucessfully", statusCode: 201 });
  } catch (error) {
    res.status(400).json({ message: error.message, statusCode: 400 });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) throw new Error("all fields are required");

    const user = await User.findOne({ email, password });

    if (!user) throw new Error("username or password is incorrect");

    const token = jwt.sign(
      {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        id:user._id,
      },
      process.env.TOKEN_SECRET
    );

    res
      .status(200)
      .json({ message: "logged in successfully", statusCode: 200, token });
  } catch (error) {
    res.status(401).json({ message: error.message, statusCode: 401 });
  }
};



//get user ------------------------------------------
exports.getUser = (req, res) => {
  res.status(200).json({
    message: "user fetched successfully",
    statusCode: 200,
    user: req.user,
  });
};

exports.updateUser = async (req, res) => {
  try {
    if (!updateSchema.safeParse(req.body).success)
      throw new Error("Invalid inputs");
    const { firstname, lastname, password } = req.body;
  
    const user = await User.findById(req.params.id);

    if(!user){
        return res.status(404).json({message:"user not found",statusCode:404});
    }
  
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (password) user.password = password;

    await user.save({validateBeforeSave:false});

    res.status(200).json({message:"user updated successfully",statusCode:200});
  
  } catch (error) {
    res.status(400).json({message:error.message,statusCode:400})
  }

};



exports.getUsers = async (req,res)=>{
    const filter = req.query.filter || "";
    console.log(req.user.email);

    const users = await User.find({
        $or:[
            {
                lastname:{
                    $regex:filter
                }
            },
            {
                firstname:{
                    $regex:filter
                }

            }
        ]
    }).find({email:{$ne:req.user.email}}).select("-password");

    res.status(200).json({message:"users fetched successfully",statusCode:200,users});
}



exports.getBalance = async (req,res)=>{
    const account = await Account.findOne({userId:req.user.id});

    res.status(200).json({message:"balance fetched successfully",statusCode:200,balance:account.balance});
}



exports.transfer = async (req,res)=>{
  const session = await mongoose.startSession();

  session.startTransaction();
  let { amount, to } = req.body;
  amount = Number(amount);

  // Fetch the accounts within the transaction
  const account = await Account.findOne({ userId: req.user.id }).session(session);

  if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
          message: "Insufficient balance",
          statusCode:400
      });
  }

  const toAccount = await Account.findOne({ userId: to }).session(session);

  if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({
          message: "Invalid account",
          statusCode:400,
      });
  }

  // Perform the transfer
  await Account.updateOne({ userId: req.user.id }, { $inc: { balance: -amount } }).session(session);
  await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

  // Commit the transaction
  await session.commitTransaction();

  res.status(200).json({
      message: "Transfer successful",
      statusCode:200,

  });
}


