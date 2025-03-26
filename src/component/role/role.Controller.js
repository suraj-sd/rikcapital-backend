const roleModels = require("./role.model");

let role = {};

role.createRoles = async (req, res) => {
  const create = {};
  create.roleCode = req.body.roleCode.toLowerCase();
  create.roleName = req.body.roleName.toLowerCase();

  try {
    const saveData = new roleModels(create);
    const data = await saveData.save();
    res.status(200).json({
      data: data,
    });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
};

role.getAll = async (req, res) => {
  console.log(" ---  in role --- >", req.query);
  try {
    const data = await roleModels.find({
      isActive: true,
    });
    console.log(data);
    if (data) {
      res.status(200).json({
        data: data,
      });
    }
  } catch (Exception) {
    res.status(500).json({
      data: Exception,
    });
  }
};

role.accessControl = (req, res) => {
  var x = req.body.accessControl;
  console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", x);
  var roleID = req.body.roleID;

  let data = [];
  let name = [];
  let checkData = [];
  for (var i = 0; i < x.length; i++) {
    if (x[i].check) {
      name.push({ name: x[i].name, properties: [] });
      for (var k = 0; k < x[i].properties.length; k++) {
        if (x[i].properties[k].check) {
          name[0].properties.push({
            name: x[i].properties[k].name,
            access: [],
          });
          for (var q = 0; q < x[i].properties[k].access.length; q++) {
            if (x[i].properties[k].access[q].check) {
              for (var m = 0; m < name[0].properties.length; m++) {
                if (x[i].properties[k].name == name[0].properties[m].name) {
                  name[0].properties[m].access.push({
                    name: x[i].properties[k].access[q].name,
                  });
                }
              }
            }
          }
        }
      }
    }
    if (name[0]) {
      data.push(name[0]);
    }
    name = [];
  }

  let condition = {};
  condition.$and = [];
  if (data[0]) {
    checkData = data;
    for (var i = 0; i < data.length; i++) {
      condition.$and.push({
        accessControl: { $elemMatch: { name: data[i].name } },
      });
      for (var j = 0; j < data[i].properties.length; j++) {
        if (
          !condition.$and[condition.$and.length - 1].accessControl.$elemMatch
            .$and
        ) {
          condition.$and[
            condition.$and.length - 1
          ].accessControl.$elemMatch.$and = [
            {
              properties: {
                $elemMatch: { name: data[i].properties[j].name, $and: [] },
                $size: data[i].properties.length,
              },
            },
          ];
        } else {
          condition.$and[
            condition.$and.length - 1
          ].accessControl.$elemMatch.$and.push({
            properties: {
              $elemMatch: { name: data[i].properties[j].name, $and: [] },
              $size: data[i].properties.length,
            },
          });
        }
        for (var k = 0; k < data[i].properties[j].access.length; k++) {
          condition.$and[
            condition.$and.length - 1
          ].accessControl.$elemMatch.$and[
            condition.$and[condition.$and.length - 1].accessControl.$elemMatch
              .$and.length - 1
          ].properties.$elemMatch.$and.push({
            access: {
              $elemMatch: { name: data[i].properties[j].access[k].name },
              $size: data[i].properties[j].access.length,
            },
          });
        }
      }
    }
    console.log("this is condtion ", JSON.stringify(condition));

    roleModels.find(condition, (err, user) => {
      if (err) res.send("err while saving");
      if (user[0]) {
        console.log("user Already exist-->");
        let accessBoolean = false;
        let userFound;
        for (var i = 0; i < user.length; i++) {
          if (user[i].accessControl.length == checkData.length) {
            userFound = user[i];
            accessBoolean = true;
            break;
          }
        }
        if (accessBoolean) {
          console.log("accessBoolean boolean");
          res.status(200).json({
            data: "User Already Exist",
            status: 101,
            user: userFound,
          });
        } else {
          console.log("accessBoolean not");
          roleModels.update(
            { _id: roleID },
            { $set: { accessControl: data } },
            (err, resp) => {
              if (err) {
                console.log(err);
              } else {
                console.log(resp);
                res.status(200).json({
                  data: "File Probaly updated sucessfull",
                  status: 100,
                });
              }
            }
          );
        }
      } else {
        console.log("not found");
        roleModels.update(
          { _id: roleID },
          { $set: { accessControl: data } },
          (err, resp) => {
            if (err) {
              console.log(err);
            } else {
              console.log(resp);
              res.status(200).json({
                data: "File Probaly updated sucessfull",
                status: 100,
              });
            }
          }
        );
      }
    });
  } else {
    res.status(200).json({
      data: "Please Provide Some Access",
      status: 102,
    });
  }
};

module.exports = role;
