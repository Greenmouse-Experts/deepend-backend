<<<<<<< HEAD
const Sequelize = require("sequelize");
const db = require("../config/config");
const { nanoid } = require("nanoid");
const Cinema = require("./cinema");

const CinemaImage = db.define("cinemaimage", {
  id: {
    type: Sequelize.STRING(10),
    autoincrement: false,
    allowNull: false,
    primaryKey: true,
    defaultValue: () => nanoid(10),
  },
  cinemaId: {
    type: Sequelize.STRING(10),
    references: {
      model: 'cinemas',
      key: 'id',
    },
  },
  img_id: {
    type: Sequelize.STRING,
  },
  img_url: {
    type: Sequelize.STRING,
  }
});

CinemaImage.belongsTo(Cinema, { foreignKey: "cinemaId" });
Cinema.hasMany(CinemaImage, { foreignKey: "cinemaId" });

module.exports = CinemaImage;
=======
const Sequelize = require("sequelize");
const db = require("../config/config");
const { nanoid } = require("nanoid");
const Cinema = require("./cinema");

const CinemaImage = db.define("cinemaimage", {
  id: {
    type: Sequelize.STRING(10),
    autoincrement: false,
    allowNull: false,
    primaryKey: true,
    defaultValue: () => nanoid(10),
  },
  cinemaId: {
    type: Sequelize.STRING(10),
    references: {
      model: 'cinemas',
      key: 'id',
    },
  },
  img_id: {
    type: Sequelize.STRING,
  },
  img_url: {
    type: Sequelize.STRING,
  }
});

CinemaImage.belongsTo(Cinema, { foreignKey: "cinemaId" });
Cinema.hasMany(CinemaImage, { foreignKey: "cinemaId" });

module.exports = CinemaImage;
>>>>>>> 3604926e3bcaa891553f07c089fc691e7998ba48
