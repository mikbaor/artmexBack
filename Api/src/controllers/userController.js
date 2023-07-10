const { User, Role, Permission, Address, conn } = require("../connection/db");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const createUser = async (req, res) => {
  let {
    firstName,
    lastName,
    userName,
    civilSituation,
    phone,
    email,
    password,
    image,
    country, //address
    state, //address
    zipCode, //address
    address, //address
    satId,
    schedule,
    emergencyPhone,
    sons,
    inDate,
    outDate,
    roleStack, //roles
    permissionStack, //permissions
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAddress = await Address.create({
      country,
      state,
      zipCode,
      address,
    });

    const newPermission = await Permission.create(permissionStack);

    const newRole = await Role.create({
      roleStack,
    });

    const newUser = await User.create({
      firstName,
      lastName,
      userName,
      civilSituation,
      phone,
      email,
      password: hashedPassword,
      image,
      satId,
      schedule,
      emergencyPhone,
      sons,
      inDate,
    });

    await newUser.setAddress(newAddress);
    await newUser.setPermissions(newPermission);
    await newUser.setRole(newRole);

    res.status(201).json({
      message: "Usuario creado con exito",
      newUserDetai: newUser,
      status: res.status,
    });
  } catch (error) {
    console.error(error.message);
    res.status(404).json({
      msesage: "Error al crear el usuario",
      errorDetails: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { state: true },
      include: [
        {
          model: Address,
        },
        {
          model: Permission,
        },
        {
          model: Role,
        },
      ],
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Error al obtener usuarios" });
  }
};


const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    civilSituation,
    phone,
    country,
    state,
    zipCode,
    address,
    satId,
    emergencyPhone,
    sons,
    roleStack,
    password
  } = req.body;

  try {
    const user = await User.findByPk(id, 
      {
      include: [{
        model:Address
         },
         {
          model:Role
         }
        ],
    }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });

    }
console.log(user.dataValues.Role.dataValues.id)

    if(password){
      const hashedPassword = await bcrypt.hash(password, 10);

    await User.update({civilSituation,phone, satId, emergencyPhone, sons, password: hashedPassword, },{where:{id:id}}) 
    await Role.update({roleStack},{where:{id:user.dataValues.Role.dataValues.id}})
   if(address || state){
    await Address.update({country,state,zipCode,address},{where:{id:user.dataValues.Address.dataValues.id}})
   }}else{
    await User.update({civilSituation,phone, satId, emergencyPhone, sons, },{where:{id:id}}) 
    if(address || state){
     await Address.update({country,state,zipCode,address},{where:{id:user.dataValues.Address.dataValues.id}})
     await Role.update({roleStack},{where:{id:user.dataValues.Role.dataValues.id}})
   }
    }    

   const userUpdate = await User.findByPk(id, 
    {
    include: [{
      model:Address
       },
       {
        model:Role
       }
      ],
  }
  );

    res.status(200).json({
      message: "User modified successfully",
      userDetail: userUpdate,
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      message: "Error modifying user",
      errorDetail: error.message,
    });
  }
};


const userById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Address,
          attributes: ["id", "country", "state", "zipCode", "address"],
        },
        {
          model: Permission,
        },
        {
          model: Role,
          attributes: ["id", "roleStack"],
        },
      ],
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: "no hay usuarios con ese ID" });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  const state = req.body;

  try {
    await User.update(state, { where: { id: userId } });
    const userDelete = await User.findByPk(userId, {
      include: [
        {
          model: Address,
          attributes: ["id", "country", "state", "zipCode", "address"],
        },
        {
          model: Permission,
        },
        {
          model: Role,
          attributes: ["id", "roleStack"],
        },
      ],
    });
    res.status(200).json(userDelete);
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: "no se pudo borrar el usurario" });
  }
};

const filterUser = async (req, res) => {
  const { roleStack, country, userName, state, firstName } = req.body;
  try {
    let whereUser = {};
    let whereAddress = {};
    let whereRole = {};

    if (roleStack) whereRole.roleStack = roleStack;
    if (country) whereAddress.country = country;
    if (userName) whereUser.userName = { [Op.like]: `%${userName}%` };
    if (state) whereUser.state = state;
    if (firstName) whereUser.firstName = { [Op.like]: `${firstName}%` };

    let usersFilter = await User.findAll({
      where: whereUser,

      include: [
        {
          model: Address,
          attributes: ["id", "country", "state", "zipCode", "address"],
          where: whereAddress,
        },
        {
          model: Role,
          attributes: ["id", "roleStack"],
          where: whereRole,
        },
        {
          model: Permission,
        },
      ],
      order: [["id", "DESC"]],
    });

    usersFilter.length
      ? res.status(200).json(usersFilter)
      : res.status(200).json({ message: "no hay usuarios" });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: "Error en la peticion" });
  }
};

const loginUser = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({
      where: { userName },
      include: [
        {
          model: Permission,
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    if (!user.dataValues.state) {
      return res.status(402).json({ message: "User account is inactive" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    return res.json({
      token,
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.id,
      permission: user.Permissions[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(401).json({ message: "no se envio cabecera" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "token no valido", token: token });
    req.user = user;
    next();
  });
};

const csvUsers = async (req, res) => {
  const { dateStart, dateEnd } = req.body;

  const where = {};
  if (dateStart && dateEnd) {
    const startDate = new Date(dateStart);
    const endDate = new Date(dateEnd);

    where.inDate = {
      [Op.between]: [startDate, endDate],
    };
  }
  try {
    const users = await User.findAll({
      where: { state: true },
      include: [
        {
          model: Address,
        },
        {
          model: Permission,
        },
        {
          model: Role,
        },
      ],
      order: [["id", "DESC"]],
      raw: true,
    });

    const csvWriter = createCsvWriter({
      path: "users.csv",
      header: [
        { id: "id", title: "ID" },
        { id: "firstName", title: "First Name" },
        { id: "lastName", title: "Last Name" },
        { id: "userName", title: "User Name" },
        { id: "civilSituation", title: "Civil Situation" },
        { id: "phone", title: "Phone" },
        { id: "email", title: "Email" },
        { id: "image", title: "Image" },
        { id: "state", title: "State" },
        { id: "satId", title: "SAT ID" },
        { id: "schedule", title: "Schedule" },
        { id: "emergencyPhone", title: "Emergency Phone" },
        { id: "sons", title: "Sons" },
        { id: "inDate", title: "In Date" },
        { id: "outDate", title: "Out Date" },
        { id: "ArtisanId", title: "Artisan ID" },
        { id: "RoleId", title: "Role ID" },
        { id: "AddressId", title: "Address ID" },
        { id: "Address.id", title: "Address ID" },
        { id: "Address.country", title: "Address Country" },
        { id: "Address.state", title: "Address State" },
        { id: "Address.zipCode", title: "Address Zip Code" },
        { id: "Address.address", title: "Address" },
        { id: "Permissions.id", title: "Permissions ID" },
        { id: "Role.id", title: "Role ID" },
        { id: "Role.roleStack", title: "Role Stack" },
      ],
    });

    await csvWriter.writeRecords(users);

    res.download("users.csv");
  } catch (error) {
    res.status(400).json(error.status);
  }
};

const updatePermissionUser = async (req, res) => {
  const userId = req.params.id;
  const permissionFields = req.body;

  try {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Permission,
        },
      ],
    });

    const id = user.Permissions[0].dataValues.id;

    await Permission.update(permissionFields, { where: { id: id } });

    const actUser = await User.findByPk(userId, {
      include: [
        {
          model: Permission,
        },
      ],
    });

    res.status(200).json({ message: "usuario actualizado", actUser });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  userById,
  deleteUser,
  filterUser,
  loginUser,
  auth,
  csvUsers,
  updatePermissionUser,
};
