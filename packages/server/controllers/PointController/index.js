const { Point } = require("../../models");

module.exports.getPoints = async (req, res, next) => {
  try {
    const points = await Point.findAndCountAll();
    res.status(200).json({ success: true, data: points });
  } catch (error) {
    res.status(error.code || 500).json({
      success: false,
      data: error,
    });
  }
};

module.exports.createPoint = async (req, res, next) => {
  try {
    const { name, lat, lng } = req.body;
    if (!name)
      return res.status(400).json({
        status: false,
        error: "Name is required",
      });
    else if (!lat)
      return res.status(400).json({
        status: false,
        error: "Latitude is  required",
      });
    else if (!lng)
      return res.status(400).json({
        status: false,
        error: "Longitude is  required",
      });

    const points = await Point.create({
      name,
      lat,
      lng,
      userc_id: req.user.id,
    });
    res.status(200).json({ success: true, data: points });
  } catch (error) {
    res.status(error.code || 500).json({
      success: false,
      data: error,
    });
  }
};

module.exports.updatePoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, lat, lng } = req.body;
    const point = await Point.findByPk(id);

    if (!point)
      return res.status(400).json({
        status: false,
        error: "Invalid id provided",
      });

    if (!name)
      return res.status(400).json({
        status: false,
        error: "Name is required",
      });
    else if (!lat)
      return res.status(400).json({
        status: false,
        error: "Latitude is  required",
      });
    else if (!lng)
      return res.status(400).json({
        status: false,
        error: "Longitude is  required",
      });

    await point.update({
      name,
      lat,
      lng,
      useru_id: req.user.id,
    });
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(error.code || 500).json({
      success: false,
      data: error,
    });
  }
};

module.exports.deletePoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const point = await Point.findByPk(id);

    if (!point)
      return res.status(400).json({
        status: false,
        error: "Invalid id provided",
      });

    await point.destroy();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(error.code || 500).json({
      success: false,
      data: error,
    });
  }
};
